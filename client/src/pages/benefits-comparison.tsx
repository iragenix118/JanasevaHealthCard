import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Loader2 } from "lucide-react";
import type { HealthCard } from "@shared/schema";

export default function BenefitsComparison() {
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

  // Get all unique benefits across all cards
  const allBenefits = new Set<string>();
  healthCards?.forEach((card) => {
    card.benefits.forEach((benefit) => allBenefits.add(benefit));
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Benefits Comparison</h1>
        <p className="text-muted-foreground">
          Compare our health cards to find the right one for you
        </p>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Benefit</TableHead>
              {healthCards?.map((card) => (
                <TableHead key={card.id} className="text-center">
                  {card.name}
                  <div className="text-sm font-normal text-muted-foreground">
                    ${card.monthlyPremium}/month
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Coverage Limit</TableCell>
              {healthCards?.map((card) => (
                <TableCell key={card.id} className="text-center">
                  ${card.coverageLimit.toLocaleString()}
                </TableCell>
              ))}
            </TableRow>
            {Array.from(allBenefits).map((benefit) => (
              <TableRow key={benefit}>
                <TableCell className="font-medium">{benefit}</TableCell>
                {healthCards?.map((card) => (
                  <TableCell key={card.id} className="text-center">
                    {card.benefits.includes(benefit) ? (
                      <Check className="h-4 w-4 text-green-500 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-red-500 mx-auto" />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
