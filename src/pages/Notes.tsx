import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Edit3, Trash2, Check, X, StickyNote } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";

const Notes = () => {
  const { notes, sparks, editNote, deleteNote } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const categories = [...new Set(sparks.map((s) => s.category))];

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      !searchQuery ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const spark = sparks.find((s) => s.id === note.sparkId || s.id === (note as any).postId);
    const matchesCategory =
      !categoryFilter || spark?.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const startEdit = (id: string, content: string) => {
    setEditingId(id);
    setEditContent(content);
  };

  const saveEdit = () => {
    if (editingId && editContent.trim()) {
      editNote(editingId, editContent.trim());
    }
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleDelete = (id: string) => {
    if (confirmDeleteId === id) {
      deleteNote(id);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      // Auto-cancel confirm after 3s
      setTimeout(() => setConfirmDeleteId((cur) => (cur === id ? null : cur)), 3000);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">
          My Notes
        </h1>
        <p className="mt-1 font-sans text-sm text-muted-foreground">
          Your personal reflections and takeaways
        </p>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-surface border border-border rounded-sm font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setCategoryFilter(null)}
            className={`px-3 py-1.5 font-sans text-xs font-medium rounded-sm border transition-colors ${
              !categoryFilter
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}
              className={`px-3 py-1.5 font-sans text-xs font-medium rounded-sm border transition-colors ${
                categoryFilter === cat
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notes list */}
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {filteredNotes.map((note, i) => {
            const spark = sparks.find((s) => s.id === note.sparkId || s.id === (note as any).postId);
            const isEditing = editingId === note.id;

            return (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                className="border border-border rounded-sm p-4 bg-background hover:border-border/80 transition-colors"
              >
                {/* Linked Spark */}
                {spark && (
                  <div
                    onClick={() => navigate(`/spark/${spark.id}`)}
                    className="flex items-center gap-3 mb-3 pb-3 border-b border-border/50 cursor-pointer group/spark"
                  >
                    <img
                      src={spark.image}
                      alt={spark.title}
                      className="w-10 h-10 object-cover rounded-sm flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-sm font-semibold text-foreground truncate group-hover/spark:text-accent transition-colors">
                        {spark.title}
                      </p>
                      <span className="font-sans text-[10px] text-accent uppercase tracking-wide font-semibold">
                        {spark.category}
                      </span>
                    </div>
                  </div>
                )}

                {/* Note content — edit mode or read mode */}
                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      autoFocus
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      maxLength={1000}
                      rows={4}
                      className="w-full px-3 py-2 bg-surface border border-accent rounded-sm font-sans text-sm text-foreground focus:outline-none resize-none"
                    />
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {editContent.length}/1000
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={cancelEdit}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground border border-border rounded-sm transition-colors"
                        >
                          <X className="h-3 w-3" />
                          Cancel
                        </button>
                        <button
                          onClick={saveEdit}
                          disabled={!editContent.trim()}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs bg-accent text-accent-foreground rounded-sm font-medium disabled:opacity-50 transition-colors"
                        >
                          <Check className="h-3 w-3" />
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="font-sans text-sm text-foreground leading-relaxed">
                    {note.content}
                  </p>
                )}

                {/* Footer */}
                {!isEditing && (
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {new Date(note.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(note.id, note.content)}
                        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-sm transition-colors"
                        aria-label="Edit note"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className={`p-1.5 rounded-sm transition-colors ${
                          confirmDeleteId === note.id
                            ? "text-destructive bg-destructive/10"
                            : "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        }`}
                        aria-label={
                          confirmDeleteId === note.id
                            ? "Confirm delete"
                            : "Delete note"
                        }
                        title={
                          confirmDeleteId === note.id
                            ? "Click again to confirm delete"
                            : "Delete note"
                        }
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      {confirmDeleteId === note.id && (
                        <span className="text-[10px] text-destructive font-sans ml-1">
                          Confirm?
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredNotes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <StickyNote className="w-10 h-10 text-muted-foreground/30 mb-3" />
            <p className="font-serif text-lg text-foreground mb-1">
              {notes.length === 0 ? "No notes yet" : "No notes found"}
            </p>
            <p className="font-sans text-sm text-muted-foreground">
              {notes.length === 0
                ? "Finish reading a Spark to add your first reflection"
                : "Try a different search or filter"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Notes;
