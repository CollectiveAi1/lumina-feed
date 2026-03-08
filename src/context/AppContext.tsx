import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ContentBlock = {
  type: "paragraph" | "quote" | "heading" | "image";
  content: string;
  caption?: string;
};

export type Author = {
  id: string;
  name: string;
  username?: string;
  avatar?: string;
  credentials?: string;
  institution?: string;
  verified?: boolean;
  followerCount?: number;
  sparkCount?: number;
};

export type Spark = {
  id: string;
  title: string;
  excerpt: string;
  author: Author | string;
  category: string;
  readTime: number;
  image: string;
  brainCount: number;
  publishedAt?: string;
  contentBlocks?: ContentBlock[];
  slug?: string;
  status?: "published" | "draft" | "archived";
};

export type Stack = {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  sparks: Spark[];
  sparkCount: number;
  collaborators?: Author[];
  isCollaborative?: boolean;
  isPublic?: boolean;
};

export type Note = {
  id: string;
  sparkId: string;
  sparkTitle?: string;
  content: string;
  createdAt: string;
};

export type Notification = {
  id: string;
  type: "brain" | "follow" | "new_spark";
  message: string;
  timestamp: string;
  read: boolean;
};

export type UserProfile = {
  id: string;
  name: string;
  displayName: string;
  username: string;
  bio: string;
  credentials?: string;
  institution?: string;
  location?: string;
  website?: string;
  avatar?: string;
  currentStreak: number;
  bestStreak: number;
  consecutiveWeeks: number;
  sparksCount: number;
  brainsReceived: number;
  followersCount: number;
  followingCount: number;
  brainedSparks?: string[];
};

export type StreakDay = {
  date: string;
  sparksRead: number;
  isActive: boolean;
  sessionDuration?: number;
};

// ─── Context Interface ────────────────────────────────────────────────────────

interface AppContextType {
  // Auth
  authUser: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;

  // User & onboarding
  currentUser: UserProfile;
  updateProfile: (fields: Partial<UserProfile>) => Promise<void>;
  hasOnboarded: boolean;
  completeOnboarding: (topics: string[]) => void;
  selectedTopics: string[];

  // Sparks
  sparks: Spark[];
  sparksLoading: boolean;
  addSpark: (spark: Omit<Spark, "id" | "brainCount">) => Promise<void>;

  // Brains
  brainedSparkIds: Set<string>;
  toggleBrain: (sparkId: string) => Promise<void>;

  // Notes
  notes: Note[];
  addNote: (sparkId: string, content: string) => Promise<void>;
  editNote: (noteId: string, content: string) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;

  // Stacks
  stacks: Stack[];
  addStack: (stack: Omit<Stack, "sparks" | "sparkCount" | "collaborators">) => Promise<void>;

  // Streak
  streakLog: StreakDay[];

  // UI state
  focusModeEnabled: boolean;
  setFocusModeEnabled: (v: boolean) => void;
  streakOpen: boolean;
  setStreakOpen: (v: boolean) => void;

  // Notifications (ephemeral)
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DEFAULT_USER: UserProfile = {
  id: "",
  name: "",
  displayName: "",
  username: "",
  bio: "",
  currentStreak: 0,
  bestStreak: 0,
  consecutiveWeeks: 0,
  sparksCount: 0,
  brainsReceived: 0,
  followersCount: 0,
  followingCount: 0,
};

// Map a posts row (with author profile join) → Spark
function rowToSpark(
  row: {
    id: string;
    title: string;
    excerpt: string | null;
    cover_image: string | null;
    category: string;
    read_time_minutes: number | null;
    published_at: string | null;
    slug: string;
    status: string;
    content: unknown;
    // reaction count via aggregation
    reactions?: { count: number }[];
    // author profile
    profiles?: {
      id: string;
      username: string;
      display_name: string | null;
      avatar_url: string | null;
    } | null;
  }
): Spark {
  const brainCount = row.reactions?.[0]?.count ?? 0;
  const author: Author = row.profiles
    ? {
        id: row.profiles.id,
        name: row.profiles.display_name ?? row.profiles.username,
        username: row.profiles.username,
        avatar: row.profiles.avatar_url ?? undefined,
      }
    : { id: "", name: "Anonymous" };

  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt ?? "",
    author,
    category: row.category,
    readTime: row.read_time_minutes ?? 5,
    image: row.cover_image ?? "",
    brainCount,
    publishedAt: row.published_at ?? undefined,
    contentBlocks: (row.content as ContentBlock[]) ?? [],
    slug: row.slug,
    status: row.status as Spark["status"],
  };
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  // ── Auth state ───────────────────────────────────────────────────────────
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Onboarding / topic selection ─────────────────────────────────────────
  const onboardingKey = authUser ? `lumina_onboarded_${authUser.id}` : "lumina_onboarded";
  const topicsKey = authUser ? `lumina_topics_${authUser.id}` : "lumina_topics";

  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  useEffect(() => {
    setHasOnboarded(localStorage.getItem(onboardingKey) === "true");
    const stored = localStorage.getItem(topicsKey);
    setSelectedTopics(stored ? JSON.parse(stored) : []);
  }, [onboardingKey, topicsKey]);

  const completeOnboarding = useCallback(
    (topics: string[]) => {
      setSelectedTopics(topics);
      setHasOnboarded(true);
      localStorage.setItem(onboardingKey, "true");
      localStorage.setItem(topicsKey, JSON.stringify(topics));
    },
    [onboardingKey, topicsKey]
  );

  // ── Profile query ─────────────────────────────────────────────────────────
  const { data: profile } = useQuery({
    queryKey: ["profile", authUser?.id],
    enabled: !!authUser,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser!.id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  // ── Sparks query ──────────────────────────────────────────────────────────
  const { data: sparksData = [], isLoading: sparksLoading } = useQuery({
    queryKey: ["sparks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          id, title, excerpt, cover_image, category, read_time_minutes,
          published_at, slug, status, content,
          profiles!posts_author_id_fkey(id, username, display_name, avatar_url),
          reactions(count)
        `)
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(rowToSpark);
    },
  });

  // ── Brained spark IDs query ───────────────────────────────────────────────
  const { data: reactionsData = [] } = useQuery({
    queryKey: ["reactions", authUser?.id],
    enabled: !!authUser,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reactions")
        .select("post_id")
        .eq("user_id", authUser!.id);
      if (error) throw error;
      return data ?? [];
    },
  });

  const brainedSparkIds = new Set(reactionsData.map((r) => r.post_id));

  // ── Notes query ───────────────────────────────────────────────────────────
  const { data: notesData = [] } = useQuery({
    queryKey: ["notes", authUser?.id],
    enabled: !!authUser,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("id, post_id, content, created_at, posts(title)")
        .eq("user_id", authUser!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((n) => ({
        id: n.id,
        sparkId: n.post_id,
        sparkTitle: (n.posts as { title: string } | null)?.title,
        content: n.content ?? "",
        createdAt: n.created_at,
      })) as Note[];
    },
  });

  // ── Stacks query ──────────────────────────────────────────────────────────
  const { data: stacksData = [] } = useQuery({
    queryKey: ["stacks", authUser?.id],
    enabled: !!authUser,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stacks")
        .select(`
          id, title, description, cover_image, is_collaborative, is_public,
          stack_items(count)
        `)
        .eq("owner_id", authUser!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description ?? "",
        coverImage: s.cover_image ?? undefined,
        isCollaborative: s.is_collaborative,
        isPublic: s.is_public,
        sparkCount: (s.stack_items as { count: number }[])?.[0]?.count ?? 0,
        sparks: [],
        collaborators: [],
      })) as Stack[];
    },
  });

  // ── Streak log query ──────────────────────────────────────────────────────
  const { data: streakLogData = [] } = useQuery({
    queryKey: ["streak_log", authUser?.id],
    enabled: !!authUser,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("streak_log")
        .select("active_date, sparks_read, session_minutes")
        .eq("user_id", authUser!.id)
        .order("active_date", { ascending: false })
        .limit(90);
      if (error) throw error;
      return (data ?? []).map((row) => ({
        date: row.active_date,
        sparksRead: row.sparks_read,
        isActive: row.sparks_read > 0,
        sessionDuration: row.session_minutes,
      })) as StreakDay[];
    },
  });

  // ── Assemble currentUser ──────────────────────────────────────────────────
  const currentUser: UserProfile = profile
    ? {
        id: profile.id,
        name: profile.display_name ?? profile.username,
        displayName: profile.display_name ?? profile.username,
        username: profile.username,
        bio: profile.bio ?? "",
        avatar: profile.avatar_url ?? undefined,
        currentStreak: profile.current_streak,
        bestStreak: profile.best_streak,
        consecutiveWeeks: profile.consecutive_weeks,
        sparksCount: 0,
        brainsReceived: 0,
        followersCount: 0,
        followingCount: 0,
      }
    : DEFAULT_USER;

  // ── UI state ──────────────────────────────────────────────────────────────
  const [focusModeEnabled, setFocusModeEnabled] = useState(false);
  const [streakOpen, setStreakOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // ── Auth actions ──────────────────────────────────────────────────────────
  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signUp = useCallback(async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        username,
        display_name: username,
      });
      if (profileError) throw profileError;
    }
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    queryClient.clear();
  }, [queryClient]);

  // ── Profile update ────────────────────────────────────────────────────────
  const updateProfile = useCallback(
    async (fields: Partial<UserProfile>) => {
      if (!authUser) return;
      const { error } = await supabase.from("profiles").update({
        display_name: fields.displayName,
        username: fields.username,
        bio: fields.bio,
        avatar_url: fields.avatar,
      }).eq("id", authUser.id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["profile", authUser.id] });
    },
    [authUser, queryClient]
  );

  // ── Spark mutations ───────────────────────────────────────────────────────
  const addSpark = useCallback(
    async (spark: Omit<Spark, "id" | "brainCount">) => {
      if (!authUser) throw new Error("Must be signed in");
      const slug = spark.title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
      const { error } = await supabase.from("posts").insert({
        author_id: authUser.id,
        title: spark.title,
        slug,
        excerpt: spark.excerpt,
        cover_image: spark.image,
        category: spark.category,
        read_time_minutes: spark.readTime,
        content: spark.contentBlocks ?? [],
        status: "published",
        published_at: new Date().toISOString(),
      });
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["sparks"] });
    },
    [authUser, queryClient]
  );

  // ── Brain mutations ───────────────────────────────────────────────────────
  const toggleBrain = useCallback(
    async (sparkId: string) => {
      if (!authUser) return;
      const isBrained = brainedSparkIds.has(sparkId);

      // Optimistic update
      queryClient.setQueryData<{ post_id: string }[]>(
        ["reactions", authUser.id],
        (old = []) =>
          isBrained
            ? old.filter((r) => r.post_id !== sparkId)
            : [...old, { post_id: sparkId }]
      );

      if (isBrained) {
        await supabase
          .from("reactions")
          .delete()
          .eq("user_id", authUser.id)
          .eq("post_id", sparkId);
      } else {
        await supabase.from("reactions").insert({ user_id: authUser.id, post_id: sparkId });
      }

      // Refresh reaction count on the spark
      queryClient.invalidateQueries({ queryKey: ["sparks"] });
    },
    [authUser, brainedSparkIds, queryClient]
  );

  // ── Note mutations ────────────────────────────────────────────────────────
  const addNote = useCallback(
    async (sparkId: string, content: string) => {
      if (!authUser) return;
      const { error } = await supabase.from("notes").insert({
        user_id: authUser.id,
        post_id: sparkId,
        content,
      });
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["notes", authUser.id] });
    },
    [authUser, queryClient]
  );

  const editNote = useCallback(
    async (noteId: string, content: string) => {
      const { error } = await supabase
        .from("notes")
        .update({ content })
        .eq("id", noteId);
      if (error) throw error;
      if (authUser) {
        queryClient.invalidateQueries({ queryKey: ["notes", authUser.id] });
      }
    },
    [authUser, queryClient]
  );

  const deleteNote = useCallback(
    async (noteId: string) => {
      const { error } = await supabase.from("notes").delete().eq("id", noteId);
      if (error) throw error;
      if (authUser) {
        queryClient.invalidateQueries({ queryKey: ["notes", authUser.id] });
      }
    },
    [authUser, queryClient]
  );

  // ── Stack mutations ───────────────────────────────────────────────────────
  const addStack = useCallback(
    async (stack: Omit<Stack, "sparks" | "sparkCount" | "collaborators">) => {
      if (!authUser) throw new Error("Must be signed in");
      const { error } = await supabase.from("stacks").insert({
        owner_id: authUser.id,
        title: stack.title,
        description: stack.description,
        is_collaborative: stack.isCollaborative ?? false,
        is_public: stack.isPublic ?? true,
      });
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["stacks", authUser.id] });
    },
    [authUser, queryClient]
  );

  // ── Notifications ─────────────────────────────────────────────────────────
  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // ── Focus mode sync with DB ───────────────────────────────────────────────
  useEffect(() => {
    if (profile?.focus_mode_enabled !== undefined) {
      setFocusModeEnabled(profile.focus_mode_enabled);
    }
  }, [profile?.focus_mode_enabled]);

  const handleSetFocusMode = useCallback(
    (v: boolean) => {
      setFocusModeEnabled(v);
      if (authUser) {
        supabase
          .from("profiles")
          .update({ focus_mode_enabled: v })
          .eq("id", authUser.id)
          .then(() => {
            queryClient.invalidateQueries({ queryKey: ["profile", authUser.id] });
          });
      }
    },
    [authUser, queryClient]
  );

  return (
    <AppContext.Provider
      value={{
        authUser,
        isAuthenticated: !!authUser,
        authLoading,
        signIn,
        signUp,
        signOut,
        currentUser,
        updateProfile,
        hasOnboarded,
        completeOnboarding,
        selectedTopics,
        sparks: sparksData,
        sparksLoading,
        addSpark,
        brainedSparkIds,
        toggleBrain,
        notes: notesData,
        addNote,
        editNote,
        deleteNote,
        stacks: stacksData,
        addStack,
        streakLog: streakLogData,
        focusModeEnabled,
        setFocusModeEnabled: handleSetFocusMode,
        streakOpen,
        setStreakOpen,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        unreadCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
