import { motion } from "framer-motion";
import { Clock, Bookmark } from "lucide-react";
import { useState } from "react";

interface SparkCardProps {
  title: string;
  author: string;
  category: string;
  readTime: string;
  image: string;
  index?: number;
}

const SparkCard = ({ title, author, category, readTime, image, index = 0 }: SparkCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.article
      className="group relative aspect-[4/5] overflow-hidden rounded-sm cursor-pointer"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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

      {/* Category badge */}
      <div className="absolute top-4 left-4">
        <span className="inline-block bg-accent px-2 py-1 font-sans text-xs font-semibold uppercase tracking-widest text-accent-foreground">
          {category}
        </span>
      </div>

      {/* Bookmark */}
      <button className="absolute top-4 right-4 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
        <Bookmark className="h-5 w-5" />
      </button>

      {/* Content overlay */}
      <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col gap-2">
        <h3 className="font-serif text-lg font-semibold leading-tight text-primary-foreground text-balance">
          {title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="font-sans text-xs font-medium text-primary-foreground/70">
            {author}
          </span>
          <motion.span
            className="flex items-center gap-1 font-sans text-xs text-primary-foreground/70"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 8 }}
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
