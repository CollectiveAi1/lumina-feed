import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SparkFeed from "@/components/SparkFeed";
import StreakDashboard from "@/components/StreakDashboard";
import FocusMode from "@/components/FocusMode";
import { mockCurrentUser, mockStreakLog } from "@/data/mockSparks";

const Index = () => {
  const [streakOpen, setStreakOpen] = useState(false);
  const [focusModeEnabled, setFocusModeEnabled] = useState(
    mockCurrentUser.focusModeEnabled
  );
  const [focusActive, setFocusActive] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        currentStreak={mockCurrentUser.currentStreak}
        onStreakClick={() => setStreakOpen(!streakOpen)}
        focusModeEnabled={focusModeEnabled}
        onFocusModeToggle={() => setFocusModeEnabled(!focusModeEnabled)}
      />

      <StreakDashboard
        isOpen={streakOpen}
        onClose={() => setStreakOpen(false)}
        currentStreak={mockCurrentUser.currentStreak}
        bestStreak={mockCurrentUser.bestStreak}
        consecutiveWeeks={mockCurrentUser.consecutiveWeeks}
        streakDays={mockStreakLog}
        hasReadToday={
          mockStreakLog[mockStreakLog.length - 1]?.isActive ?? false
        }
      />

      <FocusMode
        isActive={focusActive}
        onStart={() => setFocusActive(true)}
        onEnd={() => setFocusActive(false)}
        onExtend={() => setFocusActive(true)}
        sparksRead={3}
        categoriesTouched={["Neuroscience", "Mathematics", "History"]}
        currentStreak={mockCurrentUser.currentStreak}
      />

      <main>
        <HeroSection />
        <SparkFeed />
      </main>
    </div>
  );
};

export default Index;
