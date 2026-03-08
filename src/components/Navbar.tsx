import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Search,
  Bell,
  User,
  Menu,
  X,
  Brain,
  BookOpen,
  Layers,
  Settings,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LightningIcon from "@/components/icons/LightningIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import NotificationsDropdown from "@/components/NotificationsDropdown";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  currentStreak?: number;
  onStreakClick?: () => void;
  onSearchClick?: () => void;
  focusModeEnabled?: boolean;
  onFocusModeToggle?: () => void;
  unreadCount?: number;
}

const Navbar = ({
  currentStreak = 5,
  onStreakClick,
  onSearchClick,
  focusModeEnabled = false,
  onFocusModeToggle,
  unreadCount = 0,
}: NavbarProps) => {
  const { signOut, currentUser } = useApp();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const navLinks = [
    { to: "/", label: "Feed" },
    { to: "/explore", label: "Explore" },
    { to: "/stacks", label: "Stacks" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Left side */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="font-serif text-xl font-bold tracking-tight text-foreground"
          >
            Lumina
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "px-3 py-1.5 font-sans text-sm font-medium transition-colors rounded-sm",
                  isActive(link.to)
                    ? "text-foreground bg-secondary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <button
            onClick={onSearchClick}
            className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Search"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>

          {/* Streak */}
          <button
            onClick={onStreakClick}
            className="flex items-center gap-1.5 px-2 py-1.5 text-accent hover:bg-accent/10 transition-colors rounded-sm"
            aria-label="View streak"
          >
            <LightningIcon
              size={18}
              filled={currentStreak > 0}
              className="text-accent"
            />
            <span className="font-mono text-sm font-bold text-accent">
              {currentStreak}
            </span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:text-foreground transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="h-[18px] w-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
              )}
            </button>
            <NotificationsDropdown
              isOpen={notifOpen}
              onClose={() => setNotifOpen(false)}
            />
          </div>

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors overflow-hidden">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.displayName} className="w-full h-full object-cover" />
                ) : (
                  <User className="h-4 w-4" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-background border border-border rounded-sm p-1"
            >
              <DropdownMenuItem asChild>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <User className="h-4 w-4" />
                  My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to="/brained"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Brain className="h-4 w-4" />
                  Brained Sparks
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to="/notes"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen className="h-4 w-4" />
                  My Notes
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to="/stacks"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Layers className="h-4 w-4" />
                  My Stacks
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  onFocusModeToggle?.();
                }}
                className="flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Focus Mode
                </span>
                <div
                  className={cn(
                    "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                    focusModeEnabled ? "bg-accent" : "bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform",
                      focusModeEnabled
                        ? "translate-x-[18px]"
                        : "translate-x-[3px]"
                    )}
                  />
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to="/settings"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="flex items-center gap-2 text-muted-foreground cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu toggle */}
          <button
            className="flex h-9 w-9 items-center justify-center text-muted-foreground md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border md:hidden"
          >
            <nav className="flex flex-col px-4 py-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "py-3 font-sans text-sm font-medium border-b border-border/50 transition-colors",
                    isActive(link.to)
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
