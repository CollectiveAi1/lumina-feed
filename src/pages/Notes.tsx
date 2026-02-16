import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Edit3, Trash2 } from "lucide-react";
import { mockNotes, mockSparks } from "@/data/mockSparks";

const Notes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const categories = [...new Set(mockSparks.map((s) => s.category))];

  const filteredNotes = mockNotes.filter((note) => {
    const matchesSearch =
      !searchQuery ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const spark = mockSparks.find((s) => s.id === note.postId);
    const matchesCategory =
      !categoryFilter || spark?.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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
              onClick={() =>
                setCategoryFilter(categoryFilter === cat ? null : cat)
              }
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
        {filteredNotes.map((note, i) => {
          const spark = mockSparks.find((s) => s.id === note.postId);
          return (
            <motion.div
              key={note.id}
              className="border border-border rounded-sm p-4 bg-background hover:border-border/80 transition-colors"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              {/* Linked Spark */}
              {spark && (
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border/50">
                  <img
                    src={spark.image}
                    alt={spark.title}
                    className="w-10 h-10 object-cover rounded-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-sm font-semibold text-foreground truncate">
                      {spark.title}
                    </p>
                    <span className="font-sans text-[10px] text-accent uppercase tracking-wide font-semibold">
                      {spark.category}
                    </span>
                  </div>
                </div>
              )}

              {/* Note content */}
              <p className="font-sans text-sm text-foreground leading-relaxed">
                {note.content}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between mt-3">
                <span className="font-mono text-[10px] text-muted-foreground">
                  {new Date(note.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Edit note"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Delete note"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <p className="font-sans text-sm text-muted-foreground">
              No notes found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
