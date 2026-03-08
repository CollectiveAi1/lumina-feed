import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Check, ChevronRight, Zap } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { mockSparks } from "@/data/mockSparks";
import { cn } from "@/lib/utils";

// ─── Data ─────────────────────────────────────────────────────────────────────

const ALL_TOPICS = [
  { id: "neuroscience", label: "Neuroscience", emoji: "🧠" },
  { id: "mathematics", label: "Mathematics", emoji: "∞" },
  { id: "culture", label: "Culture", emoji: "🎭" },
  { id: "astronomy", label: "Astronomy", emoji: "🔭" },
  { id: "biology", label: "Biology", emoji: "🌿" },
  { id: "history", label: "History", emoji: "📜" },
  { id: "philosophy", label: "Philosophy", emoji: "💭" },
  { id: "technology", label: "Technology", emoji: "⚡" },
  { id: "psychology", label: "Psychology", emoji: "🪞" },
  { id: "art", label: "Art", emoji: "🎨" },
  { id: "physics", label: "Physics", emoji: "⚛️" },
  { id: "literature", label: "Literature", emoji: "📚" },
];

const SUGGESTED_CREATORS = [
  {
    id: "c1",
    name: "Dr. Elena Santos",
    credentials: "PhD Neuroscience · MIT",
    topics: ["Neuroscience", "Psychology"],
    bio: "Exploring the brain's hidden architectures.",
  },
  {
    id: "c2",
    name: "Prof. James Wright",
    credentials: "Mathematics · Oxford",
    topics: ["Mathematics", "Philosophy"],
    bio: "Making the abstract tangible, one proof at a time.",
  },
  {
    id: "c3",
    name: "Dr. Yuki Nakamura",
    credentials: "Astrophysics · Caltech",
    topics: ["Astronomy", "Physics"],
    bio: "We are all made of stardust.",
  },
  {
    id: "c4",
    name: "Maria Chen",
    credentials: "Microbiology · Stanford",
    topics: ["Biology", "Technology"],
    bio: "The invisible world shapes everything.",
  },
];

// ─── Step indicators ──────────────────────────────────────────────────────────

const StepDots = ({ step, total }: { step: number; total: number }) => (
  <div className="flex gap-2 justify-center mb-10">
    {Array.from({ length: total }).map((_, i) => (
      <motion.div
        key={i}
        animate={{
          width: i === step ? 24 : 8,
          backgroundColor: i <= step ? "hsl(var(--accent))" : "hsl(var(--border))",
        }}
        transition={{ duration: 0.3 }}
        className="h-2 rounded-full"
      />
    ))}
  </div>
);

// ─── Step 1: Pick topics ──────────────────────────────────────────────────────

const StepTopics = ({
  selected,
  onToggle,
  onNext,
}: {
  selected: string[];
  onToggle: (id: string) => void;
  onNext: () => void;
}) => (
  <motion.div
    key="topics"
    initial={{ opacity: 0, x: 40 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -40 }}
    transition={{ duration: 0.3 }}
  >
    <h2 className="font-serif text-3xl font-bold text-foreground mb-2 text-center">
      What sparks your curiosity?
    </h2>
    <p className="text-muted-foreground text-center mb-8">
      Pick at least 3 topics. Your feed will be tailored around them.
    </p>

    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
      {ALL_TOPICS.map((topic) => {
        const isSelected = selected.includes(topic.id);
        return (
          <motion.button
            key={topic.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => onToggle(topic.id)}
            className={cn(
              "relative flex items-center gap-3 px-4 py-3.5 rounded-sm border text-sm font-medium transition-all",
              isSelected
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-foreground hover:border-accent/40"
            )}
          >
            <span className="text-xl leading-none">{topic.emoji}</span>
            <span>{topic.label}</span>
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2"
              >
                <Check className="w-3.5 h-3.5 text-accent" />
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>

    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">
        {selected.length} of 3+ selected
      </span>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onNext}
        disabled={selected.length < 3}
        className={cn(
          "flex items-center gap-2 px-6 py-2.5 rounded-sm text-sm font-medium transition-all",
          selected.length >= 3
            ? "bg-accent text-background hover:bg-accent/90"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        )}
      >
        Continue
        <ChevronRight className="w-4 h-4" />
      </motion.button>
    </div>
  </motion.div>
);

// ─── Step 2: Follow creators ──────────────────────────────────────────────────

const StepCreators = ({
  selectedTopics,
  followed,
  onToggleFollow,
  onNext,
  onBack,
}: {
  selectedTopics: string[];
  followed: string[];
  onToggleFollow: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}) => {
  // Filter creators whose topics overlap with selected topics (case-insensitive)
  const relevant = SUGGESTED_CREATORS.filter((c) =>
    c.topics.some((t) =>
      selectedTopics.map((s) => s.toLowerCase()).includes(t.toLowerCase())
    )
  );
  const creators = relevant.length >= 2 ? relevant : SUGGESTED_CREATORS;

  return (
    <motion.div
      key="creators"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="font-serif text-3xl font-bold text-foreground mb-2 text-center">
        Follow a few brilliant minds
      </h2>
      <p className="text-muted-foreground text-center mb-8">
        Curated creators matched to your interests. Follow at least 2 to get started.
      </p>

      <div className="flex flex-col gap-3 mb-8">
        {creators.map((c) => {
          const isFollowing = followed.includes(c.id);
          return (
            <div
              key={c.id}
              className={cn(
                "flex items-center gap-4 p-4 rounded-sm border transition-all",
                isFollowing ? "border-accent/50 bg-accent/5" : "border-border"
              )}
            >
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold text-lg flex-shrink-0">
                {c.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.credentials}</p>
                <p className="text-xs text-foreground/60 mt-0.5 truncate">{c.bio}</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onToggleFollow(c.id)}
                className={cn(
                  "flex-shrink-0 px-4 py-1.5 rounded-sm text-xs font-medium border transition-all",
                  isFollowing
                    ? "border-accent text-accent bg-accent/10"
                    : "border-border text-foreground hover:border-accent/50"
                )}
              >
                {isFollowing ? "Following" : "Follow"}
              </motion.button>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back
        </button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          disabled={followed.length < 2}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-sm text-sm font-medium transition-all",
            followed.length >= 2
              ? "bg-accent text-background hover:bg-accent/90"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

// ─── Step 3: First spark ──────────────────────────────────────────────────────

const StepFirstSpark = ({
  selectedTopics,
  onFinish,
  onBack,
}: {
  selectedTopics: string[];
  onFinish: () => void;
  onBack: () => void;
}) => {
  const navigate = useNavigate();

  // Pick a spark matching a selected topic
  const firstSpark = (mockSparks as any[]).find((s: any) =>
    selectedTopics.includes(s.category?.toLowerCase())
  ) || mockSparks[0];

  const handleRead = () => {
    onFinish();
    navigate(`/spark/${firstSpark.id}`);
  };

  return (
    <motion.div
      key="first-spark"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="font-serif text-3xl font-bold text-foreground mb-2 text-center">
        Your first Spark awaits
      </h2>
      <p className="text-muted-foreground text-center mb-8">
        We picked this one based on your interests. Read it to ignite your streak.
      </p>

      <motion.div
        whileHover={{ y: -2 }}
        className="rounded-sm border border-border overflow-hidden mb-8 cursor-pointer group"
        onClick={handleRead}
      >
        <div className="aspect-video overflow-hidden">
          <img
            src={(firstSpark as any).image}
            alt={(firstSpark as any).title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-5">
          <span className="text-xs font-mono uppercase tracking-widest text-accent">
            {(firstSpark as any).category}
          </span>
          <h3 className="font-serif text-xl font-semibold text-foreground mt-2 mb-1">
            {(firstSpark as any).title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {(firstSpark as any).excerpt}
          </p>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
            <Zap className="w-3.5 h-3.5" />
            {(firstSpark as any).readTime} min read
          </div>
        </div>
      </motion.div>

      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back
        </button>
        <div className="flex gap-3">
          <button
            onClick={onFinish}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2.5"
          >
            Skip for now
          </button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleRead}
            className="flex items-center gap-2 px-6 py-2.5 rounded-sm text-sm font-medium bg-accent text-background hover:bg-accent/90 transition-all"
          >
            Read it now
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

export default function Onboarding() {
  const navigate = useNavigate();
  const { completeOnboarding } = useApp();

  const [step, setStep] = useState(0);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [followed, setFollowed] = useState<string[]>([]);

  const toggleTopic = (id: string) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const toggleFollow = (id: string) => {
    setFollowed((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    completeOnboarding(selectedTopics);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <span className="font-serif text-2xl font-bold text-foreground tracking-tight">
          lumina
        </span>
        <p className="text-xs text-muted-foreground mt-1 tracking-widest font-mono uppercase">
          Let's set up your feed
        </p>
      </motion.div>

      <div className="w-full max-w-xl">
        <StepDots step={step} total={3} />

        <AnimatePresence mode="wait">
          {step === 0 && (
            <StepTopics
              selected={selectedTopics}
              onToggle={toggleTopic}
              onNext={() => setStep(1)}
            />
          )}
          {step === 1 && (
            <StepCreators
              selectedTopics={selectedTopics}
              followed={followed}
              onToggleFollow={toggleFollow}
              onNext={() => setStep(2)}
              onBack={() => setStep(0)}
            />
          )}
          {step === 2 && (
            <StepFirstSpark
              selectedTopics={selectedTopics}
              onFinish={handleFinish}
              onBack={() => setStep(1)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
