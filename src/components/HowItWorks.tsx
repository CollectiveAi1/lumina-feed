import { motion } from "framer-motion";
import {
  Sparkles,
  Brain,
  Layers,
  Timer,
  Flame,
  StickyNote,
  Compass,
  ChevronDown,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const steps = [
  {
    icon: Compass,
    title: "Explore Your Feed",
    summary: "Scroll through curated micro-discoveries called Sparks.",
    detail:
      "Your home feed surfaces bite-sized knowledge from science, history, philosophy, and more — written by experts and curated for maximum insight per scroll. Unlike social media, every swipe teaches you something real.",
    why: "Replaces mindless scrolling with purposeful discovery so every minute on the platform makes you sharper.",
  },
  {
    icon: Brain,
    title: "Brain the Best Ideas",
    summary: "Tap the Brain icon to save Sparks that resonate with you.",
    detail:
      "When a Spark clicks, hit the Brain reaction. This saves it to your personal collection and signals the algorithm to surface more content like it. Your brained Sparks become a personal knowledge library you can revisit anytime.",
    why: "Builds a curated second brain tailored to your curiosity — no bookmarks lost in browser tabs.",
  },
  {
    icon: StickyNote,
    title: "Add Personal Notes",
    summary: "Attach private reflections to any Spark you read.",
    detail:
      "Notes let you capture your own thoughts, connections, and questions alongside a Spark. They're private by default and searchable, turning passive reading into active learning.",
    why: "Writing forces deeper processing. Research shows annotating increases retention by up to 50%.",
  },
  {
    icon: Layers,
    title: "Build Stacks",
    summary: "Organize Sparks into themed collections you can share.",
    detail:
      "Group related Sparks into Stacks — like playlists for knowledge. Create a Stack on 'Cognitive Biases' or 'Space Exploration', collaborate with friends, and share your collections with the community.",
    why: "Transforms scattered facts into structured understanding you can teach others.",
  },
  {
    icon: Timer,
    title: "Use Focus Mode",
    summary: "Set a timed learning session to stay intentional.",
    detail:
      "Choose 5–30 minutes and Focus Mode serves a curated set of Sparks that fit your time budget. When the session ends, you get a summary of what you read and the categories you explored.",
    why: "Creates healthy boundaries around consumption so learning fits your schedule, not the other way around.",
  },
  {
    icon: Flame,
    title: "Keep Your Streak",
    summary: "Read daily to build momentum and track your growth.",
    detail:
      "Every day you read at least one Spark, your streak grows. The Streak Dashboard shows your current run, personal best, and weekly consistency — giving you a lightweight accountability system.",
    why: "Small daily habits compound. A 5-minute reading streak builds more knowledge over a year than occasional deep dives.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            How It Works
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-foreground md:text-4xl">
            Six steps to smarter scrolling
          </h2>
          <p className="mx-auto mt-4 max-w-lg font-sans text-sm leading-relaxed text-muted-foreground md:text-base">
            Lumina turns every spare moment into a learning opportunity. Here's
            exactly how each feature works — and why it matters to you.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <Accordion type="single" collapsible>
                <AccordionItem
                  value={step.title}
                  className="border border-border bg-card rounded-sm px-5 py-1"
                >
                  <AccordionTrigger className="hover:no-underline gap-3">
                    <div className="flex items-center gap-3 text-left">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-accent/10">
                        <step.icon className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          Step {i + 1}
                        </span>
                        <p className="font-serif text-sm font-semibold text-foreground leading-tight">
                          {step.title}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-12 space-y-3">
                      <p className="font-sans text-sm text-foreground leading-relaxed">
                        {step.detail}
                      </p>
                      <div className="rounded-sm bg-accent/5 border border-accent/10 px-3 py-2">
                        <p className="font-sans text-xs font-semibold text-accent uppercase tracking-wide mb-1">
                          Why it matters
                        </p>
                        <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                          {step.why}
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="font-sans text-sm text-muted-foreground">
            Ready to make every scroll count?
          </p>
          <a
            href="#"
            className="mt-3 inline-flex items-center gap-2 bg-primary px-6 py-3 font-sans text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
          >
            <Sparkles className="h-4 w-4" />
            Start Exploring
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
