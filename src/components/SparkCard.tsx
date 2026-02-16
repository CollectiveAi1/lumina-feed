import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useState } from "react";
import BrainIcon from "@/components/icons/BrainIcon";

interface SparkCardProps {
  id?: string;
  title: string;
  author: string | { displayName: string; id?: string };
  authorId?: string;
  category: string;
  readTime: string;
  image: string;
  index?: number;
  brainCount?: number;
  isBrained?: boolean;
  onBrain?: (id: string) => void;
  onAuthorClick?: (authorId: string) => void;
  onClick?: () => void;
  slug?: string;
  excerpt?: string;
  readTimeMinutes?: number;
  content?: unknown[];
  publishedAt?: string;
  status?: string;
}

const SparkCard = ({
  id = "",
  title,
  author,
  authorId,
  category,
  readTime,
  image,
  index = 0,
  brainCount = 0,
  isBrained: initialBrained = false,
  onBrain,
  onAuthorClick,
  onClick,
}: SparkCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBrained, setIsBrained] = useState(initialBrained);
  const [count, setCount] = useState(brainCount);

  const authorName = typeof author === "string" ? author : author.displayName;
  const authorIdResolved = authorId || (typeof author === "object" ? author.id : undefined);

  const handleBrain = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBrained(!isBrained);
    setCount((prev) => (isBrained ? prev - 1 : prev + 1));
    onBrain?.(id);
  };

  return (
    <motion.article
      className="group relative aspect-[4/5] overflow-hidden rounded-sm cursor-pointer"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Image */}
      <motion.img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover"
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, hsl(220 10% 10% / 0.85) 0%, hsl(220 10% 10% / 0.2) 50%, transparent 100%)",
        }}
      />

      {/* Hover shadow lift */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          boxShadow: isHovered
            ? "0 8px 30px rgba(0,0,0,0.3)"
            : "0 0px 0px rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Category badge */}
      <div className="absolute top-4 left-4">
        <span className="inline-block bg-accent px-2 py-1 font-sans text-xs font-semibold uppercase tracking-widest text-accent-foreground rounded-[2px]">
          {category}
        </span>
      </div>

      {/* Brain reaction button */}
      <div className="absolute top-4 right-4 flex flex-col items-center gap-1">
        <button
          onClick={handleBrain}
          className="transition-colors"
          aria-label={isBrained ? "Remove brain reaction" : "Brain this spark"}
        >
          <BrainIcon
            filled={isBrained}
            size={22}
            className={
              isBrained
                ? "text-accent"
                : "text-white/60 hover:text-white/90"
            }
          />
        </button>
        {count > 0 && (
          <span
            className={`font-mono text-[10px] font-medium ${
              isBrained ? "text-accent" : "text-white/50"
            }`}
          >
            {count}
          </span>
        )}
      </div>

      {/* Content overlay */}
      <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col gap-2">
        <h3 className="font-serif text-lg font-semibold leading-tight text-white text-balance">
          {title}
        </h3>
        <div className="flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAuthorClick?.(authorIdResolved || "");
            }}
            className="font-sans text-xs font-medium text-white/70 hover:text-white transition-colors"
          >
            {authorName}
          </button>
          <motion.span
            className="flex items-center gap-1 font-sans text-xs text-white/70"
            initial={{ opacity: 0, x: 8 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              x: isHovered ? 0 : 8,
            }}
            transition={{ duration: 0.3 }}
          >
            <Clock className="h-3 w-3" />
            {readTime}
          </motion.span>
        </div>
      </div>
    </motion.article>
  );
};

export default SparkCard;
