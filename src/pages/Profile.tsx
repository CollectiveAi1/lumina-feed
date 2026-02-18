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
import EditProfileModal, { type EditableProfileFields } from "@/components/EditProfileModal";
import { cn } from "@/lib/utils";
import { MapPin, Link2, GraduationCap, Building2, Calendar } from "lucide-react";

const tabs = ["Sparks", "Brained", "Stacks", "Notes"];

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Sparks");
  const [editOpen, setEditOpen] = useState(false);

  // Local profile state (mock — would be DB-backed)
  const [profile, setProfile] = useState({
    ...mockCurrentUser,
    website: "",
    location: "",
    coverUrl: "",
    birthDate: "",
  });

  const brainedSparks = mockSparks.filter((s) =>
    profile.brainedSparks.includes(s.id)
  );
  const userSparks = mockSparks.slice(0, 4);

  const handleSave = (updates: Partial<EditableProfileFields>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-0">
      {/* Cover Photo */}
      <div className="relative w-full h-36 sm:h-48 bg-secondary -mx-4 px-4" style={{ width: "calc(100% + 2rem)" }}>
        {profile.coverUrl && (
          <img
            src={profile.coverUrl}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Profile header */}
      <div className="relative -mt-12 mb-6">
        <div className="flex items-end justify-between mb-4">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-sm bg-primary text-primary-foreground flex items-center justify-center font-serif text-3xl font-bold shrink-0 border-4 border-background overflow-hidden">
            {profile.avatarUrl && !profile.avatarUrl.includes("dicebear") ? (
              <img src={profile.avatarUrl} alt={profile.displayName} className="w-full h-full object-cover" />
            ) : (
              profile.displayName.charAt(0)
            )}
          </div>
          <button
            onClick={() => setEditOpen(true)}
            className="px-4 py-1.5 border border-border font-sans text-sm font-medium text-foreground hover:bg-secondary transition-colors rounded-sm"
          >
            Edit Profile
          </button>
        </div>

        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            {profile.displayName}
          </h1>
          <p className="font-sans text-sm text-muted-foreground">
            @{profile.username}
          </p>

          <p className="font-sans text-sm text-foreground mt-2">{profile.bio}</p>

          {/* Meta row: credentials, institution, location, website, joined */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3">
            {profile.credentials && (
              <span className="flex items-center gap-1 font-sans text-xs text-muted-foreground">
                <GraduationCap size={13} />
                {profile.credentials}
              </span>
            )}
            {profile.institution && (
              <span className="flex items-center gap-1 font-sans text-xs text-muted-foreground">
                <Building2 size={13} />
                {profile.institution}
              </span>
            )}
            {profile.location && (
              <span className="flex items-center gap-1 font-sans text-xs text-muted-foreground">
                <MapPin size={13} />
                {profile.location}
              </span>
            )}
            {profile.website && (
              <a
                href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-sans text-xs text-accent hover:underline"
              >
                <Link2 size={13} />
                {profile.website.replace(/^https?:\/\//, "")}
              </a>
            )}
            <span className="flex items-center gap-1 font-sans text-xs text-muted-foreground">
              <Calendar size={13} />
              Joined Dec 2025
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-1.5">
              <LightningIcon size={16} filled className="text-accent" />
              <span className="font-mono text-sm font-bold text-accent">
                {profile.currentStreak}
              </span>
              <span className="font-sans text-xs text-muted-foreground">
                day streak
              </span>
            </div>
            <div>
              <span className="font-mono text-sm font-bold text-foreground">
                {profile.sparkCount}
              </span>
              <span className="font-sans text-xs text-muted-foreground ml-1">
                Sparks
              </span>
            </div>
            <div>
              <span className="font-mono text-sm font-bold text-foreground">
                {profile.totalBrains}
              </span>
              <span className="font-sans text-xs text-muted-foreground ml-1">
                Brains
              </span>
            </div>
            <div>
              <span className="font-mono text-sm font-bold text-foreground">
                {profile.followerCount}
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
            <SparkCard key={spark.id} {...spark} author={spark.author} index={i} />
          ))}
        </div>
      )}

      {activeTab === "Brained" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {brainedSparks.map((spark, i) => (
            <SparkCard key={spark.id} {...spark} author={spark.author} isBrained index={i} />
          ))}
          {brainedSparks.length === 0 && (
            <div className="col-span-2 text-center py-12">
              <BrainIcon size={32} className="mx-auto text-muted-foreground mb-2" />
              <p className="font-sans text-sm text-muted-foreground">No brained Sparks yet</p>
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
                <p className="font-sans text-sm text-foreground">{note.content}</p>
                <p className="font-mono text-[10px] text-muted-foreground mt-2">
                  {new Date(note.createdAt).toLocaleDateString()}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        user={profile}
        onSave={handleSave}
      />
    </div>
  );
};

export default Profile;
