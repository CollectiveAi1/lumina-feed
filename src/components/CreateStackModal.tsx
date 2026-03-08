import { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface CreateStackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateStackModal = ({ open, onOpenChange }: CreateStackModalProps) => {
  const { addStack } = useApp();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCollaborative, setIsCollaborative] = useState(false);

  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!title.trim() || creating) return;
    setCreating(true);
    try {
      await addStack({
        id: "",
        title: title.trim(),
        description: description.trim(),
        isCollaborative,
        isPublic: !isCollaborative,
      });
      onOpenChange(false);
      setTitle("");
      setDescription("");
      setIsCollaborative(false);
    } catch {
      // silently fail — could add toast
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border border-border rounded-sm">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl font-bold">
            Create a Stack
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <label className="font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Mind-Bending Physics"
              className="w-full h-10 px-3 bg-surface border border-border rounded-sm font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label className="font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this stack about?"
              rows={3}
              className="w-full px-3 py-2 bg-surface border border-border rounded-sm font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent resize-none"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sans text-sm font-medium text-foreground">
                Collaborative
              </p>
              <p className="font-sans text-xs text-muted-foreground">
                Let others add Sparks
              </p>
            </div>
            <button
              onClick={() => setIsCollaborative(!isCollaborative)}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                isCollaborative ? "bg-accent" : "bg-muted"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 rounded-full bg-white transition-transform",
                  isCollaborative ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>
          <button
            onClick={handleCreate}
            disabled={!title.trim() || creating}
            className="w-full h-10 bg-accent text-accent-foreground font-sans text-sm font-semibold hover:bg-accent/90 transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? "Creating…" : "Create Stack"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStackModal;
