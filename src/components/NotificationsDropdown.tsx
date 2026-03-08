import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Brain, UserPlus, Sparkles, CheckCheck, X } from "lucide-react";
import { useApp, type Notification } from "@/context/AppContext";
import { cn } from "@/lib/utils";

// ─── Icon per notification type ───────────────────────────────────────────────

const NotifIcon = ({ type }: { type: Notification["type"] }) => {
  const base = "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0";
  if (type === "brain")
    return (
      <div className={cn(base, "bg-accent/15")}>
        <Brain className="w-4 h-4 text-accent" />
      </div>
    );
  if (type === "follow")
    return (
      <div className={cn(base, "bg-blue-500/15")}>
        <UserPlus className="w-4 h-4 text-blue-400" />
      </div>
    );
  return (
    <div className={cn(base, "bg-emerald-500/15")}>
      <Sparkles className="w-4 h-4 text-emerald-400" />
    </div>
  );
};

// ─── Single notification row ──────────────────────────────────────────────────

const NotifRow = ({
  notif,
  onRead,
}: {
  notif: Notification;
  onRead: (id: string) => void;
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: -6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: -12 }}
    onClick={() => onRead(notif.id)}
    className={cn(
      "flex items-start gap-3 px-4 py-3.5 cursor-pointer hover:bg-muted/50 transition-colors",
      !notif.read && "bg-accent/[0.04]"
    )}
  >
    <NotifIcon type={notif.type} />
    <div className="flex-1 min-w-0">
      <p
        className={cn(
          "text-sm leading-snug",
          notif.read ? "text-muted-foreground" : "text-foreground"
        )}
      >
        {notif.message}
      </p>
      <p className="text-xs text-muted-foreground/60 mt-1">{notif.timestamp}</p>
    </div>
    {!notif.read && (
      <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-1.5" />
    )}
  </motion.div>
);

// ─── Main dropdown ────────────────────────────────────────────────────────────

interface Props {
  isOpen: boolean;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLElement>;
}

export default function NotificationsDropdown({ isOpen, onClose }: Props) {
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadCount } =
    useApp();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 top-full mt-2 w-[360px] max-w-[calc(100vw-2rem)] bg-background border border-border rounded-sm shadow-xl z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-foreground" />
              <span className="font-medium text-sm text-foreground">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-xs bg-accent text-background font-mono px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications list */}
          <div className="max-h-[400px] overflow-y-auto divide-y divide-border/50">
            <AnimatePresence initial={false}>
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bell className="w-8 h-8 text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <NotifRow
                    key={notif.id}
                    notif={notif}
                    onRead={markNotificationRead}
                  />
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-border px-4 py-2.5 text-center">
              <button className="text-xs text-accent hover:underline">
                View all notifications
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
