import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Heart, Users, LogOut, ArrowLeftRight, LayoutDashboard } from "lucide-react";

export default function Navigation() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  // Only show navigation when user is logged in or on the landing page
  if (!user && location !== '/') return null;

  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href={user ? "/dashboard" : "/"}>
              <a className="flex items-center space-x-2">
                <Heart className="w-6 h-6" />
                <span className="font-bold text-lg">HealthCard</span>
              </a>
            </Link>

            {user && (
              <div className="hidden md:flex space-x-4">
                <Link href="/dashboard">
                  <a className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location === "/dashboard" ? "bg-primary-foreground/10" : ""
                  }`}>
                    <div className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </div>
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
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
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
              </>
            ) : (
              location === '/' && (
                <Link href="/auth">
                  <a className="hover:bg-primary-foreground/10 px-4 py-2 rounded-md transition-colors">
                    Sign In
                  </a>
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}