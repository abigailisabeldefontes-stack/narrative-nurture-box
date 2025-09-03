import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="w-full bg-card border-b border-border">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <h1 className="text-xl font-medium text-foreground">
            Narrative Nurture Box
          </h1>
          
          <div className="flex items-center space-x-8">
            <Link
              to="/storyboard"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/storyboard') 
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
        </nav>
      </div>
    </header>
  );
};

export default Navigation;