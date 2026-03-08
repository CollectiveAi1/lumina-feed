import { useState } from "react";
import { Plus } from "lucide-react";
import StackCard from "@/components/StackCard";
import CreateStackModal from "@/components/CreateStackModal";
import { useApp } from "@/context/AppContext";

const Stacks = () => {
  const { stacks } = useApp();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // First 2 stacks belong to current user (by convention)
  const myStacks = stacks.slice(0, 2);
  const discoverStacks = stacks;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Stacks
          </h1>
          <p className="mt-1 font-sans text-sm text-muted-foreground">
            Curated collections of Sparks — like playlists for knowledge
          </p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 font-sans text-sm font-semibold hover:bg-accent/90 transition-colors rounded-sm"
        >
          <Plus className="h-4 w-4" />
          Create Stack
        </button>
      </div>

      {/* Your Stacks */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Your Stacks
          </h2>
          <span className="font-mono text-xs text-muted-foreground">
            {myStacks.length} stack{myStacks.length !== 1 ? "s" : ""}
          </span>
        </div>
        {myStacks.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-border rounded-sm">
            <p className="font-sans text-sm text-muted-foreground">
              You haven't created any Stacks yet.
            </p>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="mt-3 text-accent text-sm hover:underline"
            >
              Create your first Stack
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myStacks.map((stack, i) => (
              <StackCard key={stack.id} stack={stack} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Discover */}
      <section>
        <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Discover Stacks
          </h2>
          <button className="font-sans text-sm font-medium text-accent hover:underline underline-offset-4">
            View all
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {discoverStacks.map((stack, i) => (
            <StackCard key={stack.id} stack={stack} index={i} />
          ))}
        </div>
      </section>

      <CreateStackModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
    </div>
  );
};

export default Stacks;
