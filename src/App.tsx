import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/context/AppContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";

import Index from "./pages/Index";
import Explore from "./pages/Explore";
import Stacks from "./pages/Stacks";
import Profile from "./pages/Profile";
import Notes from "./pages/Notes";
import BrainedSparks from "./pages/BrainedSparks";
import SparkReader from "./pages/SparkReader";
import StackDetail from "./pages/StackDetail";
import Onboarding from "./pages/Onboarding";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

import Navbar from "./components/Navbar";
import StreakDashboard from "./components/StreakDashboard";
import FocusMode from "./components/FocusMode";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 2, retry: 1 },
  },
});

// ─── Auth guard ───────────────────────────────────────────────────────────────

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, authLoading } = useApp();
  if (authLoading) return null;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

// ─── Onboarding guard ────────────────────────────────────────────────────────

const OnboardingGuard = ({ children }: { children: React.ReactNode }) => {
  const { hasOnboarded } = useApp();
  if (!hasOnboarded) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
};

// ─── Shared page layout ───────────────────────────────────────────────────────

const PageLayout = ({ children }: { children: React.ReactNode }) => {
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
  } = useApp();

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        currentStreak={currentUser.currentStreak}
        onStreakClick={() => setStreakOpen(!streakOpen)}
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
        hasReadToday={streakLog[0]?.isActive ?? false}
      />
      {focusModeEnabled && (
        <FocusMode
          isEnabled={focusModeEnabled}
          onStart={() => {}}
          onEnd={() => setFocusModeEnabled(false)}
          onExtend={() => {}}
          sparksRead={sparks.filter((s) => brainedSparkIds.has(s.id)).length}
          currentStreak={currentUser.currentStreak}
        />
      )}
      <main>{children}</main>
    </div>
  );
};

// ─── Route tree ───────────────────────────────────────────────────────────────

const AppRoutes = () => {
  const { isAuthenticated, authLoading, hasOnboarded } = useApp();

  return (
    <Routes>
      {/* Public: auth page */}
      <Route
        path="/auth"
        element={
          !authLoading && isAuthenticated ? <Navigate to="/" replace /> : <Auth />
        }
      />

      {/* Onboarding — authenticated, not yet onboarded */}
      <Route
        path="/onboarding"
        element={
          <AuthGuard>
            {hasOnboarded ? <Navigate to="/" replace /> : <Onboarding />}
          </AuthGuard>
        }
      />

      {/* Home */}
      <Route
        path="/"
        element={
          <AuthGuard>
            <OnboardingGuard>
              <Index />
            </OnboardingGuard>
          </AuthGuard>
        }
      />

      {/* Spark reader — full-screen */}
      <Route
        path="/spark/:id"
        element={
          <AuthGuard>
            <OnboardingGuard>
              <ErrorBoundary>
                <SparkReader />
              </ErrorBoundary>
            </OnboardingGuard>
          </AuthGuard>
        }
      />

      {/* Stack detail */}
      <Route
        path="/stack/:id"
        element={
          <AuthGuard>
            <OnboardingGuard>
              <ErrorBoundary>
                <StackDetail />
              </ErrorBoundary>
            </OnboardingGuard>
          </AuthGuard>
        }
      />

      {/* Layout pages */}
      <Route
        path="/explore"
        element={
          <AuthGuard>
            <OnboardingGuard>
              <PageLayout>
                <ErrorBoundary><Explore /></ErrorBoundary>
              </PageLayout>
            </OnboardingGuard>
          </AuthGuard>
        }
      />
      <Route
        path="/stacks"
        element={
          <AuthGuard>
            <OnboardingGuard>
              <PageLayout>
                <ErrorBoundary><Stacks /></ErrorBoundary>
              </PageLayout>
            </OnboardingGuard>
          </AuthGuard>
        }
      />
      <Route
        path="/profile"
        element={
          <AuthGuard>
            <OnboardingGuard>
              <PageLayout>
                <ErrorBoundary><Profile /></ErrorBoundary>
              </PageLayout>
            </OnboardingGuard>
          </AuthGuard>
        }
      />
      <Route
        path="/notes"
        element={
          <AuthGuard>
            <OnboardingGuard>
              <PageLayout>
                <ErrorBoundary><Notes /></ErrorBoundary>
              </PageLayout>
            </OnboardingGuard>
          </AuthGuard>
        }
      />
      <Route
        path="/brained"
        element={
          <AuthGuard>
            <OnboardingGuard>
              <PageLayout>
                <ErrorBoundary><BrainedSparks /></ErrorBoundary>
              </PageLayout>
            </OnboardingGuard>
          </AuthGuard>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
