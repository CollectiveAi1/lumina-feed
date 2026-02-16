import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronRight } from "lucide-react";
import { mockTopics, type Topic } from "@/data/mockTopics";
import { mockSparks } from "@/data/mockSparks";
import SparkCard from "@/components/SparkCard";
import { cn } from "@/lib/utils";

// Position nodes in a circular/organic layout
const getNodePositions = (topics: Topic[]) => {
  const centerX = 50;
  const centerY = 50;
  const radius = 32;
  return topics.map((topic, i) => {
    const angle = (i / topics.length) * 2 * Math.PI - Math.PI / 2;
    const jitter = (i % 2 === 0 ? 1 : -1) * 3;
    return {
      ...topic,
      x: centerX + Math.cos(angle) * (radius + jitter),
      y: centerY + Math.sin(angle) * (radius + jitter),
      size: Math.max(28, Math.min(56, topic.sparkCount * 3.5)),
    };
  });
};

const Explore = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const positionedTopics = useMemo(() => getNodePositions(mockTopics), []);

  const filteredTopics = searchQuery
    ? positionedTopics.filter((t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : positionedTopics;

  const selectedTopicData = positionedTopics.find(
    (t) => t.id === selectedTopic
  );
  const topicSparks = selectedTopic
    ? mockSparks.filter((s) => s.category === selectedTopicData?.name)
    : [];

  // Get connections as pairs
  const connections = useMemo(() => {
    const pairs: {
      from: (typeof positionedTopics)[0];
      to: (typeof positionedTopics)[0];
    }[] = [];
    positionedTopics.forEach((topic) => {
      topic.connections.forEach((connId) => {
        const target = positionedTopics.find((t) => t.id === connId);
        if (target && topic.id < connId) {
          pairs.push({ from: topic, to: target });
        }
      });
    });
    return pairs;
  }, [positionedTopics]);

  // Mobile grid fallback
  if (isMobile) {
    return (
      <div className="px-4 py-6">
        <div className="mb-6">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
            Explore
          </h1>
          <p className="font-sans text-sm text-muted-foreground">
            Chart your path through knowledge
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-surface border border-border rounded-sm font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredTopics.map((topic) => (
            <motion.button
              key={topic.id}
              onClick={() =>
                setSelectedTopic(
                  selectedTopic === topic.id ? null : topic.id
                )
              }
              className={cn(
                "p-4 border rounded-sm text-left transition-colors",
                selectedTopic === topic.id
                  ? "border-accent bg-accent/5"
                  : "border-border bg-surface hover:border-accent/50"
              )}
              whileTap={{ scale: 0.97 }}
            >
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center mb-2">
                <div className="w-3 h-3 rounded-full bg-accent" />
              </div>
              <h3 className="font-serif text-sm font-semibold text-foreground">
                {topic.name}
              </h3>
              <p className="font-mono text-[10px] text-muted-foreground mt-1">
                {topic.sparkCount} sparks
              </p>
            </motion.button>
          ))}
        </div>

        {/* Expanded topic */}
        <AnimatePresence>
          {selectedTopicData && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 border-t border-border pt-4 overflow-hidden"
            >
              <h2 className="font-serif text-xl font-bold text-foreground mb-1">
                {selectedTopicData.name}
              </h2>
              <p className="font-sans text-sm text-muted-foreground mb-4">
                {selectedTopicData.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedTopicData.connections.map((connId) => {
                  const conn = mockTopics.find((t) => t.id === connId);
                  return conn ? (
                    <span
                      key={conn.id}
                      className="px-2 py-1 bg-secondary font-sans text-xs text-muted-foreground rounded-sm"
                    >
                      {conn.name}
                    </span>
                  ) : null;
                })}
              </div>
              {topicSparks.length > 0 && (
                <div className="grid grid-cols-1 gap-3">
                  {topicSparks.slice(0, 3).map((spark, i) => (
                    <SparkCard
                      key={spark.id}
                      {...spark}
                      author={spark.author}
                      index={i}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Desktop: Knowledge graph
  return (
    <div className="relative h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Search bar */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-md px-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-background/90 backdrop-blur-sm border border-border rounded-sm font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent shadow-sm"
          />
        </div>
      </div>

      {/* SVG connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {connections.map(({ from, to }, i) => (
          <motion.line
            key={i}
            x1={`${from.x}%`}
            y1={`${from.y}%`}
            x2={`${to.x}%`}
            y2={`${to.y}%`}
            stroke="hsl(var(--border))"
            strokeWidth={1.5}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 1, delay: i * 0.05 }}
          />
        ))}
      </svg>

      {/* Nodes */}
      {filteredTopics.map((topic, i) => {
        const isSelected = selectedTopic === topic.id;
        const isHighlighted =
          !searchQuery ||
          topic.name.toLowerCase().includes(searchQuery.toLowerCase());
        return (
          <motion.button
            key={topic.id}
            className="absolute z-10 flex flex-col items-center gap-1 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${topic.x}%`, top: `${topic.y}%` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: isHighlighted ? 1 : 0.3,
              scale: isSelected ? 1.2 : 1,
            }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            onClick={() => setSelectedTopic(isSelected ? null : topic.id)}
            whileHover={{ scale: 1.15 }}
          >
            <motion.div
              className={cn(
                "rounded-full flex items-center justify-center transition-colors border-2",
                isSelected
                  ? "bg-accent border-accent shadow-lg shadow-accent/20"
                  : "bg-accent/15 border-accent/30 hover:bg-accent/25"
              )}
              style={{ width: topic.size, height: topic.size }}
              animate={
                isSelected
                  ? { boxShadow: "0 0 20px hsl(16 85% 55% / 0.3)" }
                  : {}
              }
            >
              <span
                className={cn(
                  "font-mono text-[9px] font-bold",
                  isSelected ? "text-white" : "text-accent"
                )}
              >
                {topic.sparkCount}
              </span>
            </motion.div>
            <span
              className={cn(
                "font-sans text-xs font-medium whitespace-nowrap",
                isSelected ? "text-accent font-semibold" : "text-foreground"
              )}
            >
              {topic.name}
            </span>
          </motion.button>
        );
      })}

      {/* Selected topic panel */}
      <AnimatePresence>
        {selectedTopicData && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 z-20 bg-background border-t border-border"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="max-w-7xl mx-auto p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground">
                    {selectedTopicData.name}
                  </h2>
                  <p className="font-sans text-sm text-muted-foreground mt-1">
                    {selectedTopicData.description}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTopic(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Related topics */}
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedTopicData.connections.map((connId) => {
                  const conn = mockTopics.find((t) => t.id === connId);
                  return conn ? (
                    <button
                      key={conn.id}
                      onClick={() => setSelectedTopic(conn.id)}
                      className="px-3 py-1 bg-secondary font-sans text-xs text-muted-foreground hover:text-foreground rounded-sm transition-colors flex items-center gap-1"
                    >
                      {conn.name}
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  ) : null;
                })}
              </div>

              {/* Sparks in category */}
              {topicSparks.length > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {topicSparks.slice(0, 4).map((spark, i) => (
                    <SparkCard
                      key={spark.id}
                      {...spark}
                      author={spark.author}
                      index={i}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Explore;
