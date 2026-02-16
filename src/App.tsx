import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import Stacks from "./pages/Stacks";
import Profile from "./pages/Profile";
import Notes from "./pages/Notes";
import BrainedSparks from "./pages/BrainedSparks";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import { useState } from "react";
import StreakDashboard from "./components/StreakDashboard";
import { mockCurrentUser, mockStreakLog } from "./data/mockSparks";

const queryClient = new QueryClient();

// Layout wrapper for pages that need the shared nav
const PageLayout = ({ children }: { children: React.ReactNode }) => {
  const [streakOpen, setStreakOpen] = useState(false);
  const [focusModeEnabled, setFocusModeEnabled] = useState(false);

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
      <main>{children}</main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Home has its own Navbar built-in */}
          <Route path="/" element={<Index />} />

          {/* Pages with shared layout */}
          <Route
            path="/explore"
            element={
              <PageLayout>
                <Explore />
              </PageLayout>
            }
          />
          <Route
            path="/stacks"
            element={
              <PageLayout>
                <Stacks />
              </PageLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <PageLayout>
                <Profile />
              </PageLayout>
            }
          />
          <Route
            path="/notes"
            element={
              <PageLayout>
                <Notes />
              </PageLayout>
            }
          />
          <Route
            path="/brained"
            element={
              <PageLayout>
                <BrainedSparks />
              </PageLayout>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
