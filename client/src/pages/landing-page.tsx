import { useAuth } from "@/hooks/use-auth";
import { Heart } from "lucide-react";
import HealthCardPlans from "@/components/health-card-plans";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6" />
              <span className="font-bold text-lg">HealthCard</span>
            </div>
            {user ? (
              <a href="/dashboard" className="hover:bg-primary-foreground/10 px-4 py-2 rounded-md transition-colors">
                Dashboard
              </a>
            ) : (
              <a href="/auth" className="hover:bg-primary-foreground/10 px-4 py-2 rounded-md transition-colors">
                Sign In
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Perfect Health Card</h1>
          <p className="text-muted-foreground text-lg">
            Compare our health cards and find the right coverage for you and your family.
            Enjoy comprehensive benefits and a wide network of healthcare partners.
          </p>
        </div>

        <HealthCardPlans onApply={() => window.location.href = user ? '/dashboard' : '/auth'} />
      </main>
    </div>
  );
}