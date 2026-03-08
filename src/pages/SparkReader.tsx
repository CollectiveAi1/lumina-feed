import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  Share2,
  Bookmark,
  ChevronRight,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { type Spark, type Author } from "@/context/AppContext";
import ReflectionPrompt from "@/components/ReflectionPrompt";
import BrainIcon from "@/components/icons/BrainIcon";
import { cn } from "@/lib/utils";

// ─── Reading progress bar ────────────────────────────────────────────────────

const ReadingProgressBar = ({ progress }: { progress: number }) => (
  <motion.div
    className="fixed top-0 left-0 right-0 h-[3px] bg-accent z-50 origin-left"
    style={{ scaleX: progress / 100 }}
    transition={{ ease: "linear" }}
  />
);

// ─── Content block renderer ──────────────────────────────────────────────────

const ContentBlockRenderer = ({
  block,
}: {
  block: { type: string; content: string; caption?: string };
}) => {
  switch (block.type) {
    case "heading":
      return (
        <h2 className="font-serif text-2xl font-semibold text-foreground mt-10 mb-4 leading-snug">
          {block.content}
        </h2>
      );
    case "paragraph":
      return (
        <p className="text-foreground/90 leading-[1.85] text-[1.0625rem] mb-6">
          {block.content}
        </p>
      );
    case "quote":
      return (
        <blockquote className="border-l-[3px] border-accent pl-6 my-8">
          <p className="font-serif text-xl italic text-foreground/80 leading-relaxed">
            {block.content}
          </p>
          {block.caption && (
            <cite className="block mt-3 text-sm font-sans text-muted-foreground not-italic">
              — {block.caption}
            </cite>
          )}
        </blockquote>
      );
    case "image":
      return (
        <figure className="my-8">
          <div className="rounded-sm overflow-hidden aspect-video bg-muted">
            <img
              src={block.content}
              alt={block.caption || ""}
              className="w-full h-full object-cover"
            />
          </div>
          {block.caption && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    default:
      return null;
  }
};

// ─── Related spark card ───────────────────────────────────────────────────────

const RelatedSparkCard = ({ spark }: { spark: Spark }) => {
  const navigate = useNavigate();
  const authorName =
    typeof spark.author === "string" ? spark.author : spark.author.name;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={() => navigate(`/spark/${spark.id}`)}
      className="flex gap-3 p-3 rounded-sm border border-border hover:border-accent/40 cursor-pointer transition-colors group"
    >
      <div className="w-20 h-16 rounded-sm overflow-hidden flex-shrink-0">
        <img
          src={spark.image}
          alt={spark.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-accent font-mono uppercase tracking-wide mb-1">
          {spark.category}
        </p>
        <h4 className="font-serif text-sm font-medium text-foreground leading-snug line-clamp-2 mb-1">
          {spark.title}
        </h4>
        <p className="text-xs text-muted-foreground">{authorName}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground self-center flex-shrink-0 group-hover:text-accent transition-colors" />
    </motion.div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

export default function SparkReader() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { sparks, brainedSparkIds, toggleBrain, addNote } = useApp();

  const spark = sparks.find((s) => s.id === id);

  const [readProgress, setReadProgress] = useState(0);
  const [hasFinished, setHasFinished] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionSaved, setReflectionSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const articleRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const isBrained = spark ? brainedSparkIds.has(spark.id) : false;

  // Track reading progress via scroll
  useEffect(() => {
    const handleScroll = () => {
      const article = articleRef.current;
      if (!article) return;
      const { top, height } = article.getBoundingClientRect();
      const windowH = window.innerHeight;
      const scrolled = Math.max(0, windowH - top);
      const pct = Math.min(100, Math.round((scrolled / height) * 100));
      setReadProgress(pct);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection observer for end-of-article trigger
  useEffect(() => {
    const endEl = endRef.current;
    if (!endEl) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasFinished) {
          setHasFinished(true);
          setTimeout(() => setShowReflection(true), 600);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(endEl);
    return () => observer.disconnect();
  }, [hasFinished]);

  const handleSaveNote = (content: string) => {
    if (!spark) return;
    addNote(spark.id, content);
    setReflectionSaved(true);
    setShowReflection(false);
  };

  const handleShare = async () => {
    if (!spark) return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // fallback silently
    }
  };

  if (!spark) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="font-serif text-xl text-foreground">Spark not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="text-accent hover:underline text-sm"
        >
          Go back
        </button>
      </div>
    );
  }

  const authorObj: Author | null =
    typeof spark.author === "object" ? spark.author : null;
  const authorName =
    typeof spark.author === "string" ? spark.author : spark.author.name;

  const relatedSparks = sparks
    .filter((s) => s.id !== spark.id && s.category === spark.category)
    .slice(0, 3);

  return (
    <>
      <ReadingProgressBar progress={readProgress} />

      <div className="min-h-screen bg-background">
        {/* Back nav */}
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <div className="flex items-center gap-2">
              {/* Brain button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleBrain(spark.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors border",
                  isBrained
                    ? "bg-accent/10 border-accent text-accent"
                    : "border-border text-muted-foreground hover:border-accent/50 hover:text-accent"
                )}
              >
                <BrainIcon className="w-4 h-4" />
                <span className="font-mono text-xs">{spark.brainCount}</span>
              </motion.button>

              {/* Share */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="p-2 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                title="Copy link"
              >
                {isCopied ? (
                  <Bookmark className="w-4 h-4 text-accent" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Hero image */}
        <div className="w-full aspect-[2.4/1] overflow-hidden bg-muted max-h-[420px]">
          <motion.img
            initial={{ scale: 1.04 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
            src={spark.image}
            alt={spark.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article body */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          {/* Category + meta */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs font-mono uppercase tracking-widest text-accent">
              {spark.category}
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {spark.readTime} min read
            </span>
          </div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-6"
          >
            {spark.title}
          </motion.h1>

          {/* Author card */}
          {authorObj && (
            <Link to={`/profile`}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 mb-10 p-4 rounded-sm border border-border hover:border-accent/30 transition-colors"
              >
                <div className="w-11 h-11 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold text-sm flex-shrink-0">
                  {authorObj.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-medium text-foreground text-sm">
                      {authorObj.name}
                    </p>
                    {authorObj.verified && (
                      <span className="text-[10px] bg-accent/10 text-accent px-1.5 py-0.5 rounded font-mono">
                        VERIFIED
                      </span>
                    )}
                  </div>
                  {authorObj.credentials && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {authorObj.credentials}
                      {authorObj.institution && ` · ${authorObj.institution}`}
                    </p>
                  )}
                </div>
              </motion.div>
            </Link>
          )}

          {!authorObj && (
            <p className="text-sm text-muted-foreground mb-10 font-medium">
              By {authorName}
            </p>
          )}

          {/* Excerpt lead */}
          <p className="font-serif text-lg text-foreground/80 leading-relaxed mb-8 italic border-l-[3px] border-accent/40 pl-5">
            {spark.excerpt}
          </p>

          {/* Content blocks */}
          <article ref={articleRef}>
            {spark.contentBlocks && spark.contentBlocks.length > 0 ? (
              spark.contentBlocks.map((block, i) => (
                <ContentBlockRenderer key={i} block={block} />
              ))
            ) : (
              <p className="text-muted-foreground italic text-center py-12">
                Full content coming soon.
              </p>
            )}
          </article>

          {/* End-of-article sentinel */}
          <div ref={endRef} className="h-4" />

          {/* Read complete badge */}
          <AnimatePresence>
            {hasFinished && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-accent text-sm my-8 font-mono"
              >
                <BookOpen className="w-4 h-4" />
                <span>You finished this Spark</span>
                {reflectionSaved && (
                  <span className="ml-2 text-foreground/60">· Note saved</span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Brain CTA */}
          <div className="flex items-center justify-center gap-4 py-10 border-t border-border mt-8">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleBrain(spark.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-sm border font-medium text-sm transition-all",
                isBrained
                  ? "bg-accent text-background border-accent"
                  : "border-border text-foreground hover:border-accent hover:text-accent"
              )}
            >
              <BrainIcon className="w-5 h-5" />
              {isBrained ? "Brained!" : "Brain this Spark"}
            </motion.button>
          </div>
        </div>

        {/* Related sparks */}
        {relatedSparks.length > 0 && (
          <div className="border-t border-border bg-card/50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
              <h3 className="font-serif text-xl font-semibold text-foreground mb-5">
                More in {spark.category}
              </h3>
              <div className="flex flex-col gap-3">
                {relatedSparks.map((s) => (
                  <RelatedSparkCard key={s.id} spark={s} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reflection prompt overlay */}
      <AnimatePresence>
        {showReflection && (
          <ReflectionPrompt
            isVisible={showReflection}
            onSave={handleSaveNote}
            onSkip={() => setShowReflection(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
