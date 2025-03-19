import { useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { UserCard } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import HealthCardPlans from "@/components/health-card-plans";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function HomePage() {
  const { toast } = useToast();

  const { data: userCards } = useQuery<UserCard[]>({
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

  const handleApply = (cardId: number) => {
    const hasApplied = userCards?.some((uc) => uc.cardId === cardId);
    if (!hasApplied) {
      createPaymentMutation.mutate(cardId);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Health Cards</h1>
        <p className="text-muted-foreground">
          Choose from our selection of healthcare benefit cards
        </p>
      </div>

      <HealthCardPlans onApply={handleApply} />
    </div>
  );
}