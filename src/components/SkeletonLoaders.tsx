import { cn } from "@/lib/utils";

// ─── Base shimmer element ─────────────────────────────────────────────────────

const Shimmer = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "bg-muted animate-pulse rounded-sm",
      className
    )}
  />
);

// ─── Spark card skeleton ──────────────────────────────────────────────────────

export const SparkCardSkeleton = ({ index = 0 }: { index?: number }) => (
  <div
    className="rounded-sm overflow-hidden border border-border"
    style={{ animationDelay: `${index * 80}ms` }}
  >
    {/* Image area */}
    <Shimmer className="aspect-[4/5] w-full rounded-none" />
    {/* Content */}
    <div className="p-3 space-y-2">
      <Shimmer className="h-3 w-16" />
      <Shimmer className="h-4 w-full" />
      <Shimmer className="h-4 w-3/4" />
      <div className="flex justify-between items-center pt-1">
        <Shimmer className="h-3 w-20" />
        <Shimmer className="h-3 w-8" />
      </div>
    </div>
  </div>
);

// ─── Feed skeleton (grid of cards) ───────────────────────────────────────────

export const SparkFeedSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <SparkCardSkeleton key={i} index={i} />
    ))}
  </div>
);

// ─── Stack card skeleton ──────────────────────────────────────────────────────

export const StackCardSkeleton = ({ index = 0 }: { index?: number }) => (
  <div
    className="rounded-sm border border-border overflow-hidden"
    style={{ animationDelay: `${index * 80}ms` }}
  >
    <div className="grid grid-cols-2 gap-0.5">
      {Array.from({ length: 4 }).map((_, i) => (
        <Shimmer key={i} className="aspect-square rounded-none" />
      ))}
    </div>
    <div className="p-4 space-y-2">
      <Shimmer className="h-4 w-2/3" />
      <Shimmer className="h-3 w-full" />
      <Shimmer className="h-3 w-1/2" />
    </div>
  </div>
);

// ─── Note card skeleton ───────────────────────────────────────────────────────

export const NoteCardSkeleton = ({ index = 0 }: { index?: number }) => (
  <div
    className="rounded-sm border border-border p-4 space-y-3"
    style={{ animationDelay: `${index * 80}ms` }}
  >
    <div className="flex gap-3">
      <Shimmer className="w-14 h-10 flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Shimmer className="h-3 w-16" />
        <Shimmer className="h-3.5 w-full" />
      </div>
    </div>
    <Shimmer className="h-3 w-full" />
    <Shimmer className="h-3 w-5/6" />
  </div>
);

// ─── Profile header skeleton ──────────────────────────────────────────────────

export const ProfileSkeleton = () => (
  <div>
    <Shimmer className="w-full h-36 rounded-none" />
    <div className="px-6 pb-6">
      <div className="flex justify-between items-end -mt-8 mb-4">
        <Shimmer className="w-24 h-24 rounded-full" />
        <Shimmer className="w-28 h-9" />
      </div>
      <Shimmer className="h-5 w-40 mb-1" />
      <Shimmer className="h-4 w-28 mb-4" />
      <Shimmer className="h-3 w-full mb-1" />
      <Shimmer className="h-3 w-3/4 mb-6" />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="text-center space-y-1">
            <Shimmer className="h-6 w-12 mx-auto" />
            <Shimmer className="h-3 w-16 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Spark reader skeleton ────────────────────────────────────────────────────

export const SparkReaderSkeleton = () => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
    <Shimmer className="w-full aspect-[2.4/1] rounded-sm" />
    <Shimmer className="h-4 w-24" />
    <Shimmer className="h-8 w-full" />
    <Shimmer className="h-8 w-3/4" />
    <div className="flex gap-3 p-4 border border-border rounded-sm">
      <Shimmer className="w-11 h-11 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Shimmer className="h-4 w-32" />
        <Shimmer className="h-3 w-48" />
      </div>
    </div>
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="space-y-2">
        <Shimmer className="h-3.5 w-full" />
        <Shimmer className="h-3.5 w-full" />
        <Shimmer className="h-3.5 w-5/6" />
      </div>
    ))}
  </div>
);
