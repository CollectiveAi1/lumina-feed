import { Search, Bell, User } from "lucide-react";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <h1 className="font-serif text-xl font-bold tracking-tight text-foreground">
            Lumina
          </h1>
          <nav className="hidden items-center gap-6 font-sans text-sm font-medium text-muted-foreground md:flex">
            <a href="#" className="text-foreground transition-colors">Feed</a>
            <a href="#" className="hover:text-foreground transition-colors">Explore</a>
            <a href="#" className="hover:text-foreground transition-colors">Stacks</a>
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Search className="h-5 w-5" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="h-5 w-5" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <User className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
