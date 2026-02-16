import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PROMPTS = [
  "What stood out to you most?",
  "Any thoughts you want to hold onto?",
  "What would you tell someone about this?",
  "Leave yourself a note for later.",
  "Capture the thought before it fades.",
];

interface ReflectionPromptProps {
  isVisible: boolean;
  onSave: (note: string) => void;
  onSkip: () => void;
}

const ReflectionPrompt = ({
  isVisible,
  onSave,
  onSkip,
}: ReflectionPromptProps) => {
  const [note, setNote] = useState("");
  const prompt = useMemo(
    () => PROMPTS[Math.floor(Math.random() * PROMPTS.length)],
    []
  );

  const handleSave = () => {
    if (note.trim()) {
      onSave(note.trim());
      setNote("");
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="border-t border-border bg-surface/50 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="max-w-lg mx-auto">
            <p className="font-serif text-lg font-semibold text-foreground mb-1">
              {prompt}
            </p>
            <p className="font-sans text-xs text-muted-foreground mb-4">
              Only you can see your notes
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write your reflection..."
              maxLength={1000}
              rows={3}
              className="w-full px-3 py-2 bg-background border border-border rounded-sm font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent resize-none"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="font-mono text-[10px] text-muted-foreground">
                {note.length}/1000
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={onSkip}
                  className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={handleSave}
                  disabled={!note.trim()}
                  className="px-4 py-2 bg-accent text-accent-foreground font-sans text-sm font-semibold rounded-sm hover:bg-accent/90 transition-colors disabled:opacity-50"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReflectionPrompt;
