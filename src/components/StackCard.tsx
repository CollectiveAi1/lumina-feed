import { motion } from "framer-motion";
import { Layers, Users } from "lucide-react";
import type { Stack } from "@/data/mockSparks";

interface StackCardProps {
  stack: Stack;
  index?: number;
}

const StackCard = ({ stack, index = 0 }: StackCardProps) => {
  // Get first 4 spark images for mosaic
  const mosaicImages = stack.sparks.slice(0, 4).map((s) => s.image);

  return (
    <motion.div
      className="group border border-border rounded-sm overflow-hidden bg-background hover:border-accent/50 transition-colors cursor-pointer"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      {/* Mosaic thumbnail */}
      <div className="aspect-[16/9] relative grid grid-cols-2 grid-rows-2 gap-px bg-border overflow-hidden">
        {mosaicImages.map((img, i) => (
          <div key={i} className="relative overflow-hidden">
            <img
              src={img}
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}
        {mosaicImages.length < 4 &&
          Array.from({ length: 4 - mosaicImages.length }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-surface" />
          ))}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-serif text-base font-semibold text-foreground leading-tight mb-1">
          {stack.title}
        </h3>
        <p className="font-sans text-xs text-muted-foreground line-clamp-2 mb-3">
          {stack.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
              <Layers className="h-3 w-3" />
              {stack.sparkCount} sparks
            </span>
            {stack.isCollaborative && (
              <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                <Users className="h-3 w-3" />
                {stack.collaborators.length + 1}
              </span>
            )}
          </div>
          {stack.isCollaborative && (
            <span className="px-2 py-0.5 bg-accent/10 text-accent font-sans text-[10px] font-semibold uppercase tracking-wide rounded-sm">
              Collab
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StackCard;
