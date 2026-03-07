import { Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { UserButton } from "@neondatabase/neon-js/auth/react";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-background)]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-1.5 sm:gap-2 text-[var(--color-foreground)]"
        >
          <Dumbbell className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-accent)]" />
          <span className="font-semibold text-base sm:text-lg whitespace-nowrap">
            Gym Planner
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/profile">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs sm:text-sm px-2 sm:px-4"
                >
                  My Plan
                </Button>
              </Link>

              <div className="scale-90 origin-right">
                <UserButton className="bg-(--color-accent)" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <Link to="/auth/sign-in">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs sm:text-sm px-2 sm:px-4"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/auth/sign-up">
                <Button size="sm" className="text-xs sm:text-sm px-3 sm:px-4">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
