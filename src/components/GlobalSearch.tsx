import { useState, useMemo, useEffect } from "react";
import { Search, X, Sparkles, Layers, Users, BookOpen, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mockAuthors } from "@/data/mockSparks";
import { mockTopics } from "@/data/mockTopics";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

type SearchFilter = "all" | "sparks" | "topics" | "authors" | "stacks" | "notes";

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSearch = ({ isOpen, onClose }: GlobalSearchProps) => {
  const { sparks, stacks, notes } = useApp();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<SearchFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const navigate = useNavigate();

  const CATEGORY_OPTIONS = useMemo(
    () => [...new Set(sparks.map((s) => s.category))],
    [sparks]
  );

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setFilter("all");
      setCategoryFilter(null);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const q = query.toLowerCase().trim();

  const results = useMemo(() => {
    if (!q) return { sparks: [], topics: [], authors: [], stacks: [], notes: [] };

    const filteredSparks =
      filter === "all" || filter === "sparks"
        ? sparks.filter((s) => {
            const authorName =
              typeof s.author === "string" ? s.author : s.author.name;
            const matchesQuery =
              s.title.toLowerCase().includes(q) ||
              s.excerpt.toLowerCase().includes(q) ||
              s.category.toLowerCase().includes(q) ||
              authorName.toLowerCase().includes(q);
            const matchesCategory = !categoryFilter || s.category === categoryFilter;
            return matchesQuery && matchesCategory;
          })
        : [];

    const topics =
      filter === "all" || filter === "topics"
        ? mockTopics.filter(
            (t) =>
              t.name.toLowerCase().includes(q) ||
              t.description.toLowerCase().includes(q)
          )
        : [];

    const authors =
      filter === "all" || filter === "authors"
        ? mockAuthors.filter(
            (a) =>
              a.displayName.toLowerCase().includes(q) ||
              a.username.toLowerCase().includes(q) ||
              (a.bio && a.bio.toLowerCase().includes(q))
          )
        : [];

    const filteredStacks =
      filter === "all" || filter === "stacks"
        ? stacks.filter(
            (s) =>
              s.title.toLowerCase().includes(q) ||
              (s.description && s.description.toLowerCase().includes(q))
          )
        : [];

    const filteredNotes =
      filter === "all" || filter === "notes"
        ? notes.filter((n) => n.content.toLowerCase().includes(q))
        : [];

    return {
      sparks: filteredSparks,
      topics,
      authors,
      stacks: filteredStacks,
      notes: filteredNotes,
    };
  }, [q, filter, categoryFilter, sparks, stacks, notes]);

  const totalResults =
    results.sparks.length +
    results.topics.length +
    results.authors.length +
    results.stacks.length +
    results.notes.length;

  const filters: { value: SearchFilter; label: string; icon: React.ReactNode }[] = [
    { value: "all", label: "All", icon: <Search className="h-3.5 w-3.5" /> },
    { value: "sparks", label: "Sparks", icon: <Sparkles className="h-3.5 w-3.5" /> },
    { value: "topics", label: "Topics", icon: <BookOpen className="h-3.5 w-3.5" /> },
    { value: "authors", label: "Authors", icon: <Users className="h-3.5 w-3.5" /> },
    { value: "stacks", label: "Stacks", icon: <Layers className="h-3.5 w-3.5" /> },
    { value: "notes", label: "Notes", icon: <BookOpen className="h-3.5 w-3.5" /> },
  ];

  const handleSparkClick = (id: string) => {
    onClose();
    navigate(`/spark/${id}`);
  };

  const handleTopicClick = () => {
    onClose();
    navigate("/explore");
  };

  const handleStackClick = (id: string) => {
    onClose();
    navigate(`/stack/${id}`);
  };

  const handleNoteClick = () => {
    onClose();
    navigate("/notes");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Search panel */}
          <motion.div
            className="fixed inset-x-0 top-0 z-[70] mx-auto mt-[10vh] max-w-2xl px-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="rounded-md border border-border bg-background shadow-2xl overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-3 border-b border-border px-4">
                <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search sparks, topics, authors, stacks..."
                  className="flex-1 h-12 bg-transparent font-sans text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
                <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
                  ESC
                </kbd>
                <button
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground sm:hidden"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Filters row */}
              <div className="flex items-center gap-1.5 px-4 py-2 border-b border-border overflow-x-auto">
                <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                {filters.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFilter(f.value)}
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1 rounded-sm font-sans text-xs font-medium transition-colors whitespace-nowrap",
                      filter === f.value
                        ? "bg-accent/10 text-accent border border-accent/30"
                        : "text-muted-foreground hover:text-foreground border border-transparent"
                    )}
                  >
                    {f.icon}
                    {f.label}
                  </button>
                ))}

                {/* Category sub-filter for sparks */}
                {(filter === "all" || filter === "sparks") && (
                  <div className="ml-2 flex items-center gap-1 border-l border-border pl-2">
                    {CATEGORY_OPTIONS.map((cat) => (
                      <button
                        key={cat}
                        onClick={() =>
                          setCategoryFilter(categoryFilter === cat ? null : cat)
                        }
                        className={cn(
                          "px-2 py-1 rounded-sm font-sans text-[10px] font-medium transition-colors whitespace-nowrap",
                          categoryFilter === cat
                            ? "bg-accent/10 text-accent border border-accent/30"
                            : "text-muted-foreground hover:text-foreground border border-transparent"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Results */}
              <div className="max-h-[50vh] overflow-y-auto">
                {!q && (
                  <div className="px-4 py-8 text-center">
                    <p className="font-sans text-sm text-muted-foreground">
                      Start typing to search across Lumina
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground mt-1">
                      Use filters to narrow results by type or category
                    </p>
                  </div>
                )}

                {q && totalResults === 0 && (
                  <div className="px-4 py-8 text-center">
                    <p className="font-sans text-sm text-muted-foreground">
                      No results for "{query}"
                    </p>
                  </div>
                )}

                {/* Sparks */}
                {results.sparks.length > 0 && (
                  <div className="px-2 py-2">
                    <p className="px-2 py-1.5 font-sans text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Sparks
                    </p>
                    {results.sparks.map((spark) => {
                      const authorName =
                        typeof spark.author === "string"
                          ? spark.author
                          : spark.author.name;
                      return (
                        <button
                          key={spark.id}
                          onClick={() => handleSparkClick(spark.id)}
                          className="flex items-center gap-3 w-full px-2 py-2 rounded-sm hover:bg-secondary transition-colors text-left"
                        >
                          <img
                            src={spark.image}
                            alt={spark.title}
                            className="w-10 h-10 rounded-sm object-cover shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-serif text-sm font-semibold text-foreground truncate">
                              {spark.title}
                            </p>
                            <p className="font-sans text-[11px] text-muted-foreground truncate">
                              {authorName} · {spark.category}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Topics */}
                {results.topics.length > 0 && (
                  <div className="px-2 py-2">
                    <p className="px-2 py-1.5 font-sans text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Topics
                    </p>
                    {results.topics.map((topic) => (
                      <button
                        key={topic.id}
                        onClick={handleTopicClick}
                        className="flex items-center gap-3 w-full px-2 py-2 rounded-sm hover:bg-secondary transition-colors text-left"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-accent/10 shrink-0">
                          <BookOpen className="h-4 w-4 text-accent" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-serif text-sm font-semibold text-foreground">
                            {topic.name}
                          </p>
                          <p className="font-sans text-[11px] text-muted-foreground truncate">
                            {topic.sparkCount} sparks ·{" "}
                            {topic.description.slice(0, 60)}…
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Authors */}
                {results.authors.length > 0 && (
                  <div className="px-2 py-2">
                    <p className="px-2 py-1.5 font-sans text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Authors
                    </p>
                    {results.authors.map((author) => (
                      <button
                        key={author.id}
                        onClick={() => onClose()}
                        className="flex items-center gap-3 w-full px-2 py-2 rounded-sm hover:bg-secondary transition-colors text-left"
                      >
                        <img
                          src={author.avatarUrl}
                          alt={author.displayName}
                          className="w-10 h-10 rounded-full shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-serif text-sm font-semibold text-foreground">
                            {author.displayName}
                          </p>
                          <p className="font-sans text-[11px] text-muted-foreground truncate">
                            @{author.username} · {author.sparkCount} sparks
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Stacks */}
                {results.stacks.length > 0 && (
                  <div className="px-2 py-2">
                    <p className="px-2 py-1.5 font-sans text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Stacks
                    </p>
                    {results.stacks.map((stack) => (
                      <button
                        key={stack.id}
                        onClick={() => handleStackClick(stack.id)}
                        className="flex items-center gap-3 w-full px-2 py-2 rounded-sm hover:bg-secondary transition-colors text-left"
                      >
                        {stack.coverImage ? (
                          <img
                            src={stack.coverImage}
                            alt={stack.title}
                            className="w-10 h-10 rounded-sm object-cover shrink-0"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-accent/10 shrink-0">
                            <Layers className="h-4 w-4 text-accent" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-serif text-sm font-semibold text-foreground">
                            {stack.title}
                          </p>
                          <p className="font-sans text-[11px] text-muted-foreground truncate">
                            {stack.sparkCount} sparks
                            {stack.description &&
                              ` · ${stack.description.slice(0, 50)}…`}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Notes */}
                {results.notes.length > 0 && (
                  <div className="px-2 py-2">
                    <p className="px-2 py-1.5 font-sans text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Notes
                    </p>
                    {results.notes.map((note) => (
                      <button
                        key={note.id}
                        onClick={handleNoteClick}
                        className="flex items-center gap-3 w-full px-2 py-2 rounded-sm hover:bg-secondary transition-colors text-left"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-muted shrink-0">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-sans text-sm text-foreground truncate">
                            {note.content.slice(0, 80)}
                            {note.content.length > 80 ? "…" : ""}
                          </p>
                          <p className="font-mono text-[10px] text-muted-foreground">
                            {new Date(note.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-border px-4 py-2">
                <p className="font-mono text-[10px] text-muted-foreground">
                  {q
                    ? `${totalResults} result${totalResults !== 1 ? "s" : ""}`
                    : ""}
                </p>
                <p className="font-mono text-[10px] text-muted-foreground hidden sm:block">
                  ⌘K to toggle
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GlobalSearch;
