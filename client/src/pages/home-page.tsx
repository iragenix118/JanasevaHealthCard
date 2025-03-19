import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, ShieldPlus } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { HealthCard, UserCard } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function HomePage() {
  const { toast } = useToast();

  const { data: healthCards, isLoading: isLoadingCards } = useQuery<HealthCard[]>({
    queryKey: ["/api/health-cards"],
  });

  const { data: userCards, isLoading: isLoadingUserCards } = useQuery<UserCard[]>({
    queryKey: ["/api/user-cards"],
  });

  const createPaymentMutation = useMutation({
    mutationFn: async (cardId: number) => {
      const res = await apiRequest("POST", "/api/create-payment", { cardId });
      return await res.json();
    },
    onSuccess: (data) => {
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "HealthCard",
        description: "Health Card Application Payment",
        order_id: data.orderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await apiRequest("POST", "/api/verify-payment", response);
            const userCard = await verifyRes.json();
            queryClient.invalidateQueries({ queryKey: ["/api/user-cards"] });
            toast({
              title: "Payment successful",
              description: "Your card application has been processed.",
            });
          } catch (error) {
            toast({
              title: "Verification failed",
              description: "Payment verification failed. Please contact support.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
        },
        theme: {
          color: "#000000",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    },
    onError: (error: Error) => {
      toast({
        title: "Payment failed",
        description: error.message,
        variant: "destructive",
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
                  onClick={() => createPaymentMutation.mutate(card.id)}
                  disabled={hasApplied || createPaymentMutation.isPending}
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