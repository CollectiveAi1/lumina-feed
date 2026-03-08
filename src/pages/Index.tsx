import Navbar from "@/components/Navbar";
import SparkFeed from "@/components/SparkFeed";
import HeroSection from "@/components/HeroSection";
import StreakDashboard from "@/components/StreakDashboard";
import FocusMode from "@/components/FocusMode";
import GlobalSearch from "@/components/GlobalSearch";
import { useApp } from "@/context/AppContext";
import { useState } from "react";

const Index = () => {
  const {
    currentUser,
    streakLog,
    streakOpen,
    setStreakOpen,
    focusModeEnabled,
    setFocusModeEnabled,
    sparks,
    brainedSparkIds,
    unreadCount,
    selectedTopics,
  } = useApp();

  const [searchOpen, setSearchOpen] = useState(false);

  // Show hero only when the user has no read sparks yet (fresh session)
  const hasReadSparks = brainedSparkIds.size > 0 || sparks.some((s) => s.brainCount > 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        currentStreak={currentUser.currentStreak}
        onStreakClick={() => setStreakOpen(!streakOpen)}
        onSearchClick={() => setSearchOpen(true)}
        focusModeEnabled={focusModeEnabled}
        onFocusModeToggle={() => setFocusModeEnabled(!focusModeEnabled)}
        unreadCount={unreadCount}
      />

      <StreakDashboard
        isOpen={streakOpen}
        onClose={() => setStreakOpen(false)}
        currentStreak={currentUser.currentStreak}
        bestStreak={currentUser.bestStreak}
        consecutiveWeeks={currentUser.consecutiveWeeks}
        streakDays={streakLog}
        hasReadToday={streakLog[streakLog.length - 1]?.isActive ?? false}
      />

      {focusModeEnabled && (
        <FocusMode
          isEnabled={focusModeEnabled}
          onStart={() => {}}
          onEnd={() => setFocusModeEnabled(false)}
          onExtend={() => {}}
          sparksRead={brainedSparkIds.size}
          currentStreak={currentUser.currentStreak}
        />
      )}

      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <main>
        {/* Show hero section only for users who haven't engaged yet */}
        {!hasReadSparks && <HeroSection />}
        <SparkFeed />
      </main>
    </div>
  );
};

export default Index;
