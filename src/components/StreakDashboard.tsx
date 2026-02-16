import { motion, AnimatePresence } from "framer-motion";
import LightningIcon from "@/components/icons/LightningIcon";

interface StreakDay {
  date: string;
  isActive: boolean;
  sparksRead: number;
}

interface StreakDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  currentStreak: number;
  bestStreak: number;
  consecutiveWeeks: number;
  streakDays: StreakDay[];
  hasReadToday: boolean;
}

const StreakDashboard = ({
  isOpen,
  onClose,
  currentStreak,
  bestStreak,
  consecutiveWeeks,
  streakDays,
  hasReadToday,
}: StreakDashboardProps) => {
  const isNewRecord = currentStreak >= bestStreak && currentStreak > 0;
  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

  // Group streak days into weeks (4 weeks)
  const weeks: StreakDay[][] = [];
  for (let i = 0; i < streakDays.length; i += 7) {
    weeks.push(streakDays.slice(i, i + 7));
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed top-14 right-4 z-50 w-80 border border-border bg-background rounded-sm shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="p-6">
              {/* Current Streak */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <LightningIcon
                    size={28}
                    filled={hasReadToday}
                    className={
                      hasReadToday ? "text-accent" : "text-muted-foreground"
                    }
                  />
                  <span
                    className={`font-serif text-5xl font-bold ${
                      hasReadToday ? "text-accent" : "text-foreground"
                    }`}
                  >
                    {currentStreak}
                  </span>
                </div>
                <p className="font-sans text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  day streak
                </p>
                {!hasReadToday && currentStreak > 0 && (
                  <p className="mt-2 font-sans text-xs text-accent">
                    Read a Spark to keep your streak
                  </p>
                )}
                {isNewRecord && (
                  <motion.p
                    className="mt-2 font-sans text-xs font-semibold text-accent"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    🏆 New Record!
                  </motion.p>
                )}
              </div>

              {/* Stats row */}
              <div className="flex justify-between border-t border-b border-border py-4 mb-6">
                <div className="text-center flex-1">
                  <p className="font-mono text-lg font-bold text-foreground">
                    {bestStreak}
                  </p>
                  <p className="font-sans text-[10px] text-muted-foreground uppercase tracking-wide">
                    Best Streak
                  </p>
                </div>
                <div className="w-px bg-border" />
                <div className="text-center flex-1">
                  <p className="font-mono text-lg font-bold text-foreground">
                    {consecutiveWeeks}
                  </p>
                  <p className="font-sans text-[10px] text-muted-foreground uppercase tracking-wide">
                    Weeks in a row
                  </p>
                </div>
              </div>

              {/* Heatmap */}
              <div>
                <p className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Activity
                </p>
                {/* Day labels */}
                <div className="flex gap-1 mb-1">
                  {weekDays.map((day, i) => (
                    <div
                      key={i}
                      className="flex-1 text-center font-mono text-[9px] text-muted-foreground"
                    >
                      {day}
                    </div>
                  ))}
                </div>
                {/* Grid */}
                <div className="flex flex-col gap-1">
                  {weeks.map((week, wi) => (
                    <div key={wi} className="flex gap-1">
                      {week.map((day, di) => (
                        <div
                          key={di}
                          className={`flex-1 aspect-square rounded-[2px] transition-colors ${
                            day.isActive
                              ? day.sparksRead >= 3
                                ? "bg-accent"
                                : "bg-accent/60"
                              : "bg-muted/50"
                          }`}
                          title={`${day.date}: ${day.sparksRead} sparks read`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StreakDashboard;
