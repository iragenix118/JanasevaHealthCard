import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, ShieldPlus } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { HealthCard, UserCard } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const { toast } = useToast();
  
  const { data: healthCards, isLoading: isLoadingCards } = useQuery<HealthCard[]>({
    queryKey: ["/api/health-cards"],
  });

  const { data: userCards, isLoading: isLoadingUserCards } = useQuery<UserCard[]>({
    queryKey: ["/api/user-cards"],
  });

  const applyMutation = useMutation({
    mutationFn: async (cardId: number) => {
      const res = await apiRequest("POST", `/api/apply-card/${cardId}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-cards"] });
      toast({
        title: "Application submitted",
        description: "Your card application has been received.",
      });
    },
  });

  if (isLoadingCards || isLoadingUserCards) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Health Cards</h1>
        <p className="text-muted-foreground">
          Choose from our selection of healthcare benefit cards
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {healthCards?.map((card) => {
          const hasApplied = userCards?.some((uc) => uc.cardId === card.id);
          
          return (
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
                    ${card.monthlyPremium}
                    <span className="text-sm font-normal text-muted-foreground">/month</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Up to ${card.coverageLimit.toLocaleString()} coverage
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
                  onClick={() => applyMutation.mutate(card.id)}
                  disabled={hasApplied || applyMutation.isPending}
                >
                  {hasApplied ? "Applied" : "Apply Now"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
