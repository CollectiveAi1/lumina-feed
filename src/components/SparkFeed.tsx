import { useState, useEffect, useRef, useCallback } from "react";
import SparkCard from "./SparkCard";
import { mockSparks } from "@/data/mockSparks";

const INITIAL_COUNT = 6;
const LOAD_MORE_COUNT = 3;

const SparkFeed = () => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const todaySparks = mockSparks.slice(0, 3);
  const allSparks = mockSparks;
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
    </section>
  );
};

export default SparkFeed;
