import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, Link2, MapPin, Building2, GraduationCap, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/data/mockSparks";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSave: (updates: Partial<EditableProfileFields>) => void;
}

export interface EditableProfileFields {
  displayName: string;
  username: string;
  bio: string;
  credentials: string;
  institution: string;
  website: string;
  location: string;
  avatarUrl: string;
  coverUrl: string;
  birthDate: string;
}

const CHAR_LIMITS = {
  displayName: 50,
  username: 30,
  bio: 160,
  credentials: 80,
  institution: 100,
  website: 100,
  location: 60,
};

const EditProfileModal = ({ isOpen, onClose, user, onSave }: EditProfileModalProps) => {
  const [form, setForm] = useState<EditableProfileFields>({
    displayName: user.displayName,
    username: user.username,
    bio: user.bio,
    credentials: user.credentials || "",
    institution: user.institution || "",
    website: "",
    location: "",
    avatarUrl: user.avatarUrl,
    coverUrl: "",
    birthDate: "",
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof EditableProfileFields, value: string) => {
    const limit = CHAR_LIMITS[field as keyof typeof CHAR_LIMITS];
    if (limit && value.length > limit) return;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (type: "avatar" | "cover", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === "avatar") {
      setAvatarPreview(url);
      setForm((prev) => ({ ...prev, avatarUrl: url }));
    } else {
      setCoverPreview(url);
      setForm((prev) => ({ ...prev, coverUrl: url }));
    }
  };

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  const charCount = (field: keyof typeof CHAR_LIMITS) => {
    const val = form[field] || "";
    const limit = CHAR_LIMITS[field];
    return { current: val.length, limit, nearLimit: val.length > limit * 0.8 };
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-xl bg-background border border-border rounded-sm shadow-2xl"
              initial={{ y: 32, scale: 0.97 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 32, scale: 0.97 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <button
                    onClick={onClose}
                    className="p-1.5 -ml-1.5 hover:bg-secondary rounded-sm transition-colors"
                  >
                    <X size={18} className="text-foreground" />
                  </button>
                  <h2 className="font-serif text-lg font-bold text-foreground">Edit profile</h2>
                </div>
                <Button size="sm" variant="primary" onClick={handleSave}>
                  Save
                </Button>
              </div>

              {/* Cover Photo */}
              <div className="relative">
                <div
                  className={cn(
                    "w-full h-36 sm:h-44 bg-secondary relative overflow-hidden group cursor-pointer"
                  )}
                  onClick={() => coverInputRef.current?.click()}
                >
                  {(coverPreview || form.coverUrl) && (
                    <img
                      src={coverPreview || form.coverUrl}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors flex items-center justify-center">
                    <Camera
                      size={24}
                      className="text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload("cover", e)}
                />

                {/* Avatar overlay */}
                <div className="absolute -bottom-12 left-4">
                  <div
                    className="w-24 h-24 rounded-sm border-4 border-background bg-primary relative group cursor-pointer overflow-hidden"
                    onClick={(e) => {
                      e.stopPropagation();
                      avatarInputRef.current?.click();
                    }}
                  >
                    {avatarPreview || form.avatarUrl ? (
                      <img
                        src={avatarPreview || form.avatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary-foreground font-serif text-3xl font-bold">
                        {form.displayName.charAt(0)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors flex items-center justify-center">
                      <Camera
                        size={18}
                        className="text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </div>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload("avatar", e)}
                  />
                </div>
              </div>

              {/* Form fields */}
              <div className="px-4 pt-16 pb-6 space-y-5">
                {/* Display Name */}
                <FieldWithCounter
                  label="Name"
                  value={form.displayName}
                  onChange={(v) => handleChange("displayName", v)}
                  counter={charCount("displayName")}
                />

                {/* Username */}
                <FieldWithCounter
                  label="Username"
                  value={form.username}
                  onChange={(v) => handleChange("username", v.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                  counter={charCount("username")}
                  prefix="@"
                />

                {/* Bio */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="font-sans text-xs text-muted-foreground uppercase tracking-wide">Bio</Label>
                    <CharCounter {...charCount("bio")} />
                  </div>
                  <Textarea
                    value={form.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    className="resize-none font-sans text-sm min-h-[72px]"
                    rows={3}
                    placeholder="Tell the world about yourself"
                  />
                </div>

                {/* Credentials */}
                <FieldWithIcon
                  icon={<GraduationCap size={16} className="text-muted-foreground" />}
                  label="Credentials"
                  value={form.credentials}
                  onChange={(v) => handleChange("credentials", v)}
                  counter={charCount("credentials")}
                  placeholder="e.g. Ph.D. Cognitive Neuroscience"
                />

                {/* Institution */}
                <FieldWithIcon
                  icon={<Building2 size={16} className="text-muted-foreground" />}
                  label="Institution"
                  value={form.institution}
                  onChange={(v) => handleChange("institution", v)}
                  counter={charCount("institution")}
                  placeholder="e.g. MIT Department of Brain Sciences"
                />

                {/* Location */}
                <FieldWithIcon
                  icon={<MapPin size={16} className="text-muted-foreground" />}
                  label="Location"
                  value={form.location}
                  onChange={(v) => handleChange("location", v)}
                  counter={charCount("location")}
                  placeholder="e.g. Cambridge, MA"
                />

                {/* Website */}
                <FieldWithIcon
                  icon={<Link2 size={16} className="text-muted-foreground" />}
                  label="Website"
                  value={form.website}
                  onChange={(v) => handleChange("website", v)}
                  counter={charCount("website")}
                  placeholder="https://yoursite.com"
                />

                {/* Birth Date */}
                <div className="space-y-1.5">
                  <Label className="font-sans text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                    <Calendar size={16} className="text-muted-foreground" />
                    Birth date
                  </Label>
                  <Input
                    type="date"
                    value={form.birthDate}
                    onChange={(e) => handleChange("birthDate", e.target.value)}
                    className="font-sans text-sm"
                  />
                  <p className="font-sans text-[10px] text-muted-foreground">
                    This won't be shown publicly. Only used for age verification.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ── Sub-components ── */

const CharCounter = ({ current, limit, nearLimit }: { current: number; limit: number; nearLimit: boolean }) => (
  <span
    className={cn(
      "font-mono text-[10px] tabular-nums",
      nearLimit ? "text-accent" : "text-muted-foreground",
      current >= limit && "text-destructive"
    )}
  >
    {current}/{limit}
  </span>
);

const FieldWithCounter = ({
  label,
  value,
  onChange,
  counter,
  prefix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  counter: { current: number; limit: number; nearLimit: boolean };
  prefix?: string;
}) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <Label className="font-sans text-xs text-muted-foreground uppercase tracking-wide">{label}</Label>
      <CharCounter {...counter} />
    </div>
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-sans text-sm text-muted-foreground">
          {prefix}
        </span>
      )}
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn("font-sans text-sm", prefix && "pl-7")}
      />
    </div>
  </div>
);

const FieldWithIcon = ({
  icon,
  label,
  value,
  onChange,
  counter,
  placeholder,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  counter: { current: number; limit: number; nearLimit: boolean };
  placeholder?: string;
}) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <Label className="font-sans text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
        {icon}
        {label}
      </Label>
      <CharCounter {...counter} />
    </div>
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="font-sans text-sm"
      placeholder={placeholder}
    />
  </div>
);

export default EditProfileModal;
