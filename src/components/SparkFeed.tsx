import SparkCard from "./SparkCard";
import { mockSparks } from "@/data/mockSparks";

const SparkFeed = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      {/* Section header */}
      <div className="mb-8 flex items-end justify-between border-b border-border pb-4">
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

      {/* Masonry-style grid */}
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {mockSparks.map((spark, i) => (
          <div key={spark.id} className="mb-4 break-inside-avoid">
            <SparkCard
              title={spark.title}
              author={spark.author}
              category={spark.category}
              readTime={spark.readTime}
              image={spark.image}
              index={i}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default SparkFeed;
