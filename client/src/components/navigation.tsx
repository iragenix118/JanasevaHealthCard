import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Heart, Users, LogOut, ArrowLeftRight } from "lucide-react";

export default function Navigation() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  if (!user) return null;

  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <a className="flex items-center space-x-2">
                <Heart className="w-6 h-6" />
                <span className="font-bold text-lg">HealthCard</span>
              </a>
            </Link>

            <div className="hidden md:flex space-x-4">
              <Link href="/">
                <a className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location === "/" ? "bg-primary-foreground/10" : ""
                }`}>
                  Cards
                </a>
              </Link>
              <Link href="/benefits">
                <a className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location === "/benefits" ? "bg-primary-foreground/10" : ""
                }`}>
                  <div className="flex items-center gap-2">
                    <ArrowLeftRight className="w-4 h-4" />
                    Compare Benefits
                  </div>
                </a>
              </Link>
              <Link href="/partners">
                <a className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location === "/partners" ? "bg-primary-foreground/10" : ""
                }`}>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Partners
                  </div>
                </a>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm">{user.username}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}