import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Lock, Globe, BookOpen } from "lucide-react";
import { useApp } from "@/context/AppContext";
import SparkCard from "@/components/SparkCard";

export default function StackDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { stacks, brainedSparkIds, toggleBrain } = useApp();

  const stack = stacks.find((s) => s.id === id);

  if (!stack) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="font-serif text-xl text-foreground">Stack not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="text-accent hover:underline text-sm"
        >
          Go back
        </button>
      </div>
    );
  }

  const sparks = stack.sparks || [];
  const collaboratorCount =
    (stack.collaborators?.length || 0) + 1; // +1 for creator

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Stack hero mosaic */}
        {sparks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-1 rounded-sm overflow-hidden aspect-[3/1] mb-8 max-h-52"
          >
            {sparks.slice(0, 4).map((spark, i) => (
              <div key={spark.id} className="overflow-hidden">
                <img
                  src={spark.image}
                  alt={spark.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </motion.div>
        )}

        {/* Stack meta */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-accent">
              Stack
            </span>
            {stack.isPublic ? (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Globe className="w-3 h-3" /> Public
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Lock className="w-3 h-3" /> Private
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3 leading-tight">
            {stack.title}
          </h1>

          <p className="text-muted-foreground text-base leading-relaxed mb-4 max-w-2xl">
            {stack.description}
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              {sparks.length} Spark{sparks.length !== 1 ? "s" : ""}
            </span>
            {stack.isCollaborative && (
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {collaboratorCount} contributor{collaboratorCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </motion.div>

        {/* Collaborators */}
        {stack.isCollaborative && stack.collaborators && stack.collaborators.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mb-8 p-4 rounded-sm border border-border"
          >
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
              Contributors
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              {stack.collaborators.map((c) => (
                <div key={c.id} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-semibold">
                    {c.name.charAt(0)}
                  </div>
                  <span className="text-sm text-foreground">{c.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Divider */}
        <div className="border-t border-border mb-8" />

        {/* Sparks grid */}
        {sparks.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-serif text-lg">No Sparks in this Stack yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sparks.map((spark, i) => (
              <SparkCard
                key={spark.id}
                id={spark.id}
                title={spark.title}
                author={spark.author}
                category={spark.category}
                readTime={spark.readTime}
                image={spark.image}
                brainCount={spark.brainCount}
                isBrained={brainedSparkIds.has(spark.id)}
                onBrain={() => toggleBrain(spark.id)}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
