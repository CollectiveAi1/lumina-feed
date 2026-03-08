import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Link, Building, Award } from "lucide-react";
import { type UserProfile } from "@/context/AppContext";

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: UserProfile;
  onSave: (fields: Partial<UserProfile>) => void;
}

const CHAR_LIMITS = {
  displayName: 50,
  username: 30,
  bio: 160,
  credentials: 80,
  institution: 80,
  location: 60,
  website: 100,
};

const CharCounter = ({ current, max }: { current: number; max: number }) => (
  <span
    className={`font-mono text-[10px] ${
      current >= max * 0.9 ? "text-accent" : "text-muted-foreground/60"
    }`}
  >
    {current}/{max}
  </span>
);

const EditProfileModal = ({
  open,
  onOpenChange,
  currentUser,
  onSave,
}: EditProfileModalProps) => {
  const [form, setForm] = useState({
    displayName: currentUser.displayName || currentUser.name || "",
    username: currentUser.username || "",
    bio: currentUser.bio || "",
    credentials: currentUser.credentials || "",
    institution: currentUser.institution || "",
    location: currentUser.location || "",
    website: currentUser.website || "",
  });

  const set = (key: keyof typeof form, value: string) => {
    const limit = CHAR_LIMITS[key];
    setForm((prev) => ({ ...prev, [key]: value.slice(0, limit) }));
  };

  const handleSave = () => {
    onSave({
      displayName: form.displayName,
      name: form.displayName,
      username: form.username,
      bio: form.bio,
      credentials: form.credentials,
      institution: form.institution,
      location: form.location,
      website: form.website,
    });
    onOpenChange(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            className="fixed inset-x-4 top-1/2 z-50 max-w-lg mx-auto -translate-y-1/2 bg-background border border-border rounded-sm shadow-xl max-h-[85vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.96, y: "-48%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%" }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-6 py-4">
              <h2 className="font-serif text-xl font-bold text-foreground">Edit Profile</h2>
              <button
                onClick={() => onOpenChange(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-sm"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Display name */}
              <div>
                <label className="font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-1.5">
                  Display Name
                </label>
                <div className="relative">
                  <input
                    value={form.displayName}
                    onChange={(e) => set("displayName", e.target.value)}
                    className="w-full h-10 px-3 bg-surface border border-border rounded-sm font-sans text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent pr-14"
                    placeholder="Your full name"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <CharCounter current={form.displayName.length} max={CHAR_LIMITS.displayName} />
                  </div>
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                  <input
                    value={form.username}
                    onChange={(e) =>
                      set("username", e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))
                    }
                    className="w-full h-10 pl-7 pr-14 bg-surface border border-border rounded-sm font-sans text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="username"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <CharCounter current={form.username.length} max={CHAR_LIMITS.username} />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-1.5">
                  Bio
                </label>
                <div className="relative">
                  <textarea
                    value={form.bio}
                    onChange={(e) => set("bio", e.target.value)}
                    rows={3}
                    placeholder="Tell us about yourself"
                    className="w-full px-3 py-2 bg-surface border border-border rounded-sm font-sans text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                  />
                  <div className="absolute bottom-2 right-3">
                    <CharCounter current={form.bio.length} max={CHAR_LIMITS.bio} />
                  </div>
                </div>
              </div>

              {/* Credentials */}
              <div>
                <label className="font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-1.5">
                  Credentials
                </label>
                <div className="relative flex items-center">
                  <Award className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <input
                    value={form.credentials}
                    onChange={(e) => set("credentials", e.target.value)}
                    className="w-full h-10 pl-9 pr-3 bg-surface border border-border rounded-sm font-sans text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="e.g. PhD Neuroscience"
                  />
                </div>
              </div>

              {/* Institution */}
              <div>
                <label className="font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-1.5">
                  Institution
                </label>
                <div className="relative flex items-center">
                  <Building className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <input
                    value={form.institution}
                    onChange={(e) => set("institution", e.target.value)}
                    className="w-full h-10 pl-9 pr-3 bg-surface border border-border rounded-sm font-sans text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="University or organization"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-1.5">
                  Location
                </label>
                <div className="relative flex items-center">
                  <MapPin className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <input
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                    className="w-full h-10 pl-9 pr-3 bg-surface border border-border rounded-sm font-sans text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-1.5">
                  Website
                </label>
                <div className="relative flex items-center">
                  <Link className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <input
                    value={form.website}
                    onChange={(e) => set("website", e.target.value)}
                    className="w-full h-10 pl-9 pr-3 bg-surface border border-border rounded-sm font-sans text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="https://yoursite.com"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => onOpenChange(false)}
                  className="flex-1 h-10 border border-border font-sans text-sm font-medium text-foreground hover:bg-secondary transition-colors rounded-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!form.displayName.trim()}
                  className="flex-1 h-10 bg-accent text-accent-foreground font-sans text-sm font-semibold hover:bg-accent/90 transition-colors rounded-sm disabled:opacity-50"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;
