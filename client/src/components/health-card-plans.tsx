import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, ShieldPlus } from "lucide-react";
import type { HealthCard } from "@shared/schema";

export default function HealthCardPlans({ onApply }: { onApply?: (cardId: number) => void }) {
  const { data: healthCards, isLoading } = useQuery<HealthCard[]>({
    queryKey: ["/api/health-cards"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {healthCards?.map((card) => (
        <Card key={card.id} className="relative">
          {card.tier === "Gold" && (
            <div className="absolute -top-2 -right-2">
              <Badge className="bg-yellow-500">Premium</Badge>
            </div>
          )}

          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldPlus className="h-5 w-5 text-primary" />
              {card.name}
            </CardTitle>
            <CardDescription>{card.description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <div className="text-2xl font-bold">
                ₹{card.monthlyPremium}
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Up to ₹{card.coverageLimit.toLocaleString()} coverage
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-medium">Benefits:</div>
              <ul className="space-y-1">
                {card.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>

          <CardFooter>
            <Button 
              className="w-full"
              onClick={() => onApply?.(card.id)}
            >
              Get Started
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
