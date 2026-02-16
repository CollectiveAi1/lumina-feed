import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SparkFeed from "@/components/SparkFeed";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <SparkFeed />
      </main>
    </div>
  );
};

export default Index;
