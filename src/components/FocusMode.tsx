import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Clock, BookOpen } from "lucide-react";
import LightningIcon from "@/components/icons/LightningIcon";
import { cn } from "@/lib/utils";

interface FocusModeProps {
  isActive: boolean;
  onStart: (minutes: number) => void;
  onEnd: () => void;
  onExtend: () => void;
  sparksRead?: number;
  categoriesTouched?: string[];
  currentStreak?: number;
}

const PRESETS = [5, 10, 15, 20, 30];

const FocusMode = ({
  isActive,
  onStart,
  onEnd,
  onExtend,
  sparksRead = 0,
  categoriesTouched = [],
  currentStreak = 0,
}: FocusModeProps) => {
  const [showSetup, setShowSetup] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState(15);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  const progress =
    totalTime > 0 ? ((totalTime - timeRemaining) / totalTime) * 100 : 0;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!isActive || timeRemaining <= 0) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setShowSummary(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  const handleStart = () => {
    setTotalTime(selectedMinutes * 60);
    setTimeRemaining(selectedMinutes * 60);
    setShowSetup(false);
    onStart(selectedMinutes);
  };

  return (
    <>
      {/* Setup modal */}
      <AnimatePresence>
        {showSetup && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSetup(false)}
            />
            <motion.div
              className="fixed inset-x-4 bottom-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 w-auto sm:w-96 bg-background border border-border rounded-sm p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl font-bold text-foreground">
                  Focus Session
                </h2>
                <button
                  onClick={() => setShowSetup(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="font-sans text-sm text-muted-foreground mb-4">
                How long do you want to learn?
              </p>
              <div className="grid grid-cols-5 gap-2 mb-6">
                {PRESETS.map((min) => (
                  <button
                    key={min}
                    onClick={() => setSelectedMinutes(min)}
                    className={cn(
                      "py-3 font-mono text-sm font-bold rounded-sm border transition-colors",
                      selectedMinutes === min
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border text-foreground hover:border-accent/50"
                    )}
                  >
                    {min}m
                  </button>
                ))}
              </div>
              <button
                onClick={handleStart}
                className="w-full h-11 bg-accent text-accent-foreground font-sans text-sm font-semibold rounded-sm hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
              >
                <Play className="h-4 w-4" />
                Start Session
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Active session progress bar */}
      {isActive && timeRemaining > 0 && (
        <div className="fixed top-14 left-0 right-0 z-30 h-1.5 bg-muted">
          <motion.div
            className="h-full bg-accent"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute right-4 -bottom-6 font-mono text-[10px] text-accent font-medium">
            {formatTime(timeRemaining)} left
          </div>
        </div>
      )}

      {/* Session summary */}
      <AnimatePresence>
        {showSummary && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="fixed inset-x-4 bottom-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 w-auto sm:w-96 bg-background border border-border rounded-sm p-6 shadow-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <h2 className="font-serif text-xl font-bold text-foreground text-center mb-1">
                Great session!
              </h2>
              <p className="font-sans text-sm text-muted-foreground text-center mb-6">
                Here's what you explored
              </p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <BookOpen className="h-5 w-5 mx-auto text-accent mb-1" />
                  <p className="font-mono text-lg font-bold text-foreground">
                    {sparksRead}
                  </p>
                  <p className="font-sans text-[10px] text-muted-foreground">
                    Sparks read
                  </p>
                </div>
                <div className="text-center">
                  <Clock className="h-5 w-5 mx-auto text-accent mb-1" />
                  <p className="font-mono text-lg font-bold text-foreground">
                    {selectedMinutes}
                  </p>
                  <p className="font-sans text-[10px] text-muted-foreground">
                    Minutes
                  </p>
                </div>
                <div className="text-center">
                  <LightningIcon
                    size={20}
                    filled
                    className="mx-auto text-accent mb-1"
                  />
                  <p className="font-mono text-lg font-bold text-foreground">
                    {currentStreak}
                  </p>
                  <p className="font-sans text-[10px] text-muted-foreground">
                    Day streak
                  </p>
                </div>
              </div>

              {categoriesTouched.length > 0 && (
                <div className="mb-6">
                  <p className="font-sans text-xs text-muted-foreground mb-2">
                    Categories explored
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {categoriesTouched.map((cat) => (
                      <span
                        key={cat}
                        className="px-2 py-1 bg-accent/10 text-accent font-sans text-[10px] font-semibold uppercase tracking-wide rounded-sm"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowSummary(false);
                    onEnd();
                  }}
                  className="flex-1 h-10 border border-border font-sans text-sm font-medium text-foreground hover:bg-secondary transition-colors rounded-sm"
                >
                  Done for now
                </button>
                <button
                  onClick={() => {
                    setShowSummary(false);
                    onExtend();
                    setTimeRemaining(selectedMinutes * 60);
                  }}
                  className="flex-1 h-10 bg-accent text-accent-foreground font-sans text-sm font-semibold hover:bg-accent/90 transition-colors rounded-sm"
                >
                  Keep going
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FocusMode;
