import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Building2 } from "lucide-react";
import type { Partner } from "@shared/schema";

export default function Partners() {
  const { data: partners, isLoading } = useQuery<Partner[]>({
    queryKey: ["/api/partners"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Healthcare Partners</h1>
        <p className="text-muted-foreground">
          Our network of trusted healthcare providers
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {partners?.map((partner) => (
          <Card key={partner.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  {partner.name}
                </CardTitle>
                <Badge>{partner.type}</Badge>
              </div>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {partner.location}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{partner.description}</p>
              <div>
                <div className="font-medium mb-2">Services:</div>
                <div className="flex flex-wrap gap-2">
                  {partner.services.map((service, i) => (
                    <Badge key={i} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
