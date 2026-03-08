import { useState, useEffect, useRef, useCallback } from "react";
import SparkCard from "./SparkCard";
import { useApp } from "@/context/AppContext";
import CreateSparkModal from "./CreateSparkModal";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

const INITIAL_COUNT = 6;
const LOAD_MORE_COUNT = 3;

const SparkFeed = () => {
  const { sparks, brainedSparkIds, toggleBrain } = useApp();
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [createOpen, setCreateOpen] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const todaySparks = sparks.slice(0, 3);
  const allSparks = sparks;
  const visibleSparks = allSparks.slice(0, visibleCount);

  // Infinite scroll observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && visibleCount < allSparks.length) {
        setVisibleCount((prev) =>
          Math.min(prev + LOAD_MORE_COUNT, allSparks.length)
        );
      }
    },
    [visibleCount, allSparks.length]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "200px",
      threshold: 0,
    });
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      {/* Today's Sparks section */}
      <div className="mb-10">
        <div className="mb-6 flex items-end justify-between border-b border-border pb-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Today's Sparks
            </h2>
            <p className="mt-1 font-sans text-sm text-muted-foreground">
              Curated ideas worth your attention
            </p>
          </div>
          <button className="font-sans text-sm font-medium text-accent hover:underline underline-offset-4 transition-colors">
            View all
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {todaySparks.map((spark, i) => (
            <SparkCard
              key={spark.id}
              {...spark}
              author={spark.author}
              isBrained={brainedSparkIds.has(spark.id)}
              onBrain={() => toggleBrain(spark.id)}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* Continuous feed */}
      <div className="mb-6 flex items-end justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-foreground">
            All Sparks
          </h2>
          <p className="mt-1 font-sans text-sm text-muted-foreground">
            Explore the full collection
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {visibleSparks.map((spark, i) => (
          <SparkCard
            key={spark.id}
            {...spark}
            author={spark.author}
            isBrained={brainedSparkIds.has(spark.id)}
            onBrain={() => toggleBrain(spark.id)}
            index={i}
          />
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      {visibleCount < allSparks.length && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          <div className="flex items-center gap-2 font-sans text-sm text-muted-foreground">
            <div className="h-1 w-1 rounded-full bg-accent animate-pulse" />
            <div className="h-1 w-1 rounded-full bg-accent animate-pulse [animation-delay:0.2s]" />
            <div className="h-1 w-1 rounded-full bg-accent animate-pulse [animation-delay:0.4s]" />
          </div>
        </div>
      )}

      {/* Floating create button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setCreateOpen(true)}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 bg-accent text-accent-foreground px-4 py-3 rounded-full shadow-lg font-sans text-sm font-semibold hover:bg-accent/90 transition-colors"
      >
        <Plus className="h-4 w-4" />
        New Spark
      </motion.button>

      <CreateSparkModal open={createOpen} onOpenChange={setCreateOpen} />
    </section>
  );
};

export default SparkFeed;
