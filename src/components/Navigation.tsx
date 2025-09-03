import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Navigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="w-full bg-card border-b border-border">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <h1 className="text-xl font-medium text-foreground">
            Narrative Nurture Box
          </h1>
          
          {user && (
            <div className="flex items-center space-x-8">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/') || isActive('/storyboard') 
                    ? 'text-primary' 
                    : 'text-muted-foreground'
                }`}
              >
                Storyboard Generator
              </Link>
              
              <Link
                to="/characters"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/characters') 
                    ? 'text-primary' 
                    : 'text-muted-foreground'
                }`}
              >
                Character Library
              </Link>
            </div>
          )}
          
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="border-border text-muted-foreground hover:text-foreground"
              >
                Sign Out
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navigation;