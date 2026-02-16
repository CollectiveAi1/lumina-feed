import { useState } from "react";
import { mockCurrentUser, mockSparks } from "@/data/mockSparks";
import SparkCard from "@/components/SparkCard";
import BrainIcon from "@/components/icons/BrainIcon";

const BrainedSparks = () => {
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const brainedSparks = mockSparks.filter((s) =>
    mockCurrentUser.brainedSparks.includes(s.id)
  );
  const categories = [...new Set(brainedSparks.map((s) => s.category))];

  const filtered = categoryFilter
    ? brainedSparks.filter((s) => s.category === categoryFilter)
    : brainedSparks;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <BrainIcon size={28} filled className="text-accent" />
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Brained Sparks
          </h1>
        </div>
        <p className="font-sans text-sm text-muted-foreground">
          Ideas that impacted your thinking — saved for later
        </p>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button
          onClick={() => setCategoryFilter(null)}
          className={`px-3 py-1.5 font-sans text-xs font-medium rounded-sm border transition-colors ${
            !categoryFilter
              ? "border-accent bg-accent/10 text-accent"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          All ({brainedSparks.length})
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

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((spark, i) => (
          <SparkCard
            key={spark.id}
            {...spark}
            author={spark.author}
            isBrained
            index={i}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <BrainIcon size={40} className="mx-auto text-muted-foreground mb-3" />
          <p className="font-serif text-lg font-semibold text-foreground mb-1">
            No brained Sparks yet
          </p>
          <p className="font-sans text-sm text-muted-foreground">
            Tap the brain icon on any Spark to save it here
          </p>
        </div>
      )}
    </div>
  );
};

export default BrainedSparks;
