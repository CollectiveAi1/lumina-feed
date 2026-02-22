import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-start px-4 py-16 md:py-24">
        <motion.div
          className="flex items-center gap-2 mb-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Social Learning Platform
          </span>
        </motion.div>

        <motion.h1
          className="max-w-3xl font-serif text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Learn something{" "}
          <span className="italic text-accent">brilliant</span>
          <br />
          every time you scroll.
        </motion.h1>

        <motion.p
          className="mt-6 max-w-xl font-sans text-base leading-relaxed text-muted-foreground md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Lumina replaces mindless scrolling with micro-discoveries. 
          Swipe through ideas from the world's best thinkers — curated, 
          beautiful, and built for your brain.
        </motion.p>

        <motion.div
          className="mt-8 flex items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link to="/explore" className="group flex items-center gap-2 bg-primary px-6 py-3 font-sans text-sm font-semibold text-primary-foreground transition-all hover:gap-3">
            Start Exploring
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a href="#how-it-works" className="px-6 py-3 font-sans text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors">
            How it works
          </a>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          className="mt-16 flex gap-12 border-t border-border pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {[
            { value: "12K+", label: "Sparks published" },
            { value: "340K", label: "Learners" },
            { value: "98%", label: "Retention rate" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-serif text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="font-sans text-xs text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
