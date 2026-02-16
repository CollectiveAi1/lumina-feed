import { useState } from "react";
import { motion } from "framer-motion";
import {
  mockCurrentUser,
  mockSparks,
  mockStacks,
  mockNotes,
} from "@/data/mockSparks";
import SparkCard from "@/components/SparkCard";
import StackCard from "@/components/StackCard";
import BrainIcon from "@/components/icons/BrainIcon";
import LightningIcon from "@/components/icons/LightningIcon";
import { cn } from "@/lib/utils";

const tabs = ["Sparks", "Brained", "Stacks", "Notes"];

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Sparks");
  const user = mockCurrentUser;

  const brainedSparks = mockSparks.filter((s) =>
    user.brainedSparks.includes(s.id)
  );
  const userSparks = mockSparks.slice(0, 4);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Profile header */}
      <div className="flex flex-col sm:flex-row gap-6 mb-8">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-sm bg-primary text-primary-foreground flex items-center justify-center font-serif text-3xl font-bold shrink-0">
          {user.displayName.charAt(0)}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-serif text-2xl font-bold text-foreground">
                {user.displayName}
              </h1>
              <p className="font-sans text-sm text-muted-foreground">
                @{user.username}
              </p>
            </div>
            <button className="px-4 py-1.5 border border-border font-sans text-sm font-medium text-foreground hover:bg-secondary transition-colors rounded-sm">
              Edit Profile
            </button>
          </div>

          <p className="font-sans text-sm text-foreground mt-3">{user.bio}</p>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-1.5">
              <LightningIcon size={16} filled className="text-accent" />
              <span className="font-mono text-sm font-bold text-accent">
                {user.currentStreak}
              </span>
              <span className="font-sans text-xs text-muted-foreground">
                day streak
              </span>
            </div>
            <div>
              <span className="font-mono text-sm font-bold text-foreground">
                {user.sparkCount}
              </span>
              <span className="font-sans text-xs text-muted-foreground ml-1">
                Sparks
              </span>
            </div>
            <div>
              <span className="font-mono text-sm font-bold text-foreground">
                {user.totalBrains}
              </span>
              <span className="font-sans text-xs text-muted-foreground ml-1">
                Brains
              </span>
            </div>
            <div>
              <span className="font-mono text-sm font-bold text-foreground">
                {user.followerCount}
              </span>
              <span className="font-sans text-xs text-muted-foreground ml-1">
                Followers
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2.5 font-sans text-sm font-medium transition-colors relative",
              activeTab === tab
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                layoutId="profile-tab-indicator"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "Sparks" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {userSparks.map((spark, i) => (
            <SparkCard
              key={spark.id}
              {...spark}
              author={spark.author}
              index={i}
            />
          ))}
        </div>
      )}

      {activeTab === "Brained" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {brainedSparks.map((spark, i) => (
            <SparkCard
              key={spark.id}
              {...spark}
              author={spark.author}
              isBrained
              index={i}
            />
          ))}
          {brainedSparks.length === 0 && (
            <div className="col-span-2 text-center py-12">
              <BrainIcon
                size={32}
                className="mx-auto text-muted-foreground mb-2"
              />
              <p className="font-sans text-sm text-muted-foreground">
                No brained Sparks yet
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === "Stacks" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockStacks.map((stack, i) => (
            <StackCard key={stack.id} stack={stack} index={i} />
          ))}
        </div>
      )}

      {activeTab === "Notes" && (
        <div className="space-y-3">
          {mockNotes.map((note, i) => {
            const spark = mockSparks.find((s) => s.id === note.postId);
            return (
              <motion.div
                key={note.id}
                className="border border-border rounded-sm p-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {spark && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-sans text-[10px] text-accent uppercase tracking-wide font-semibold">
                      {spark.category}
                    </span>
                    <span className="font-serif text-xs font-medium text-foreground truncate">
                      {spark.title}
                    </span>
                  </div>
                )}
                <p className="font-sans text-sm text-foreground">
                  {note.content}
                </p>
                <p className="font-mono text-[10px] text-muted-foreground mt-2">
                  {new Date(note.createdAt).toLocaleDateString()}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Profile;
