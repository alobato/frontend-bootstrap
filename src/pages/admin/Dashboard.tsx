import { useQuery } from "@apollo/client/react";
import { ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { ME_QUERY, PING_QUERY } from "@/graphql/queries";
import { QueryErrorCard, QueryLoadingCard } from "@/components/admin/states";
import type { QueryMeData, QueryPingData } from "@/types/graphql";

export function DashboardPage() {
  const { user } = useAuth();
  const meQuery = useQuery<QueryMeData>(ME_QUERY);
  const pingQuery = useQuery<QueryPingData>(PING_QUERY, { errorPolicy: "all" });

  if (meQuery.loading) {
    return <QueryLoadingCard title="Loading dashboard" />;
  }

  if (meQuery.error) {
    return <QueryErrorCard title="Unable to load dashboard" message={meQuery.error.message} onRetry={() => meQuery.refetch()} />;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Admin dashboard
          </CardTitle>
          <CardDescription>Overview of current authentication and backend connectivity.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground">Current user:</span>
            <Badge variant="outline">{user?.name ?? "Unknown"}</Badge>
            <Badge variant="outline">{user?.email ?? "No email"}</Badge>
            <Badge>{user?.role ?? "No role"}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Admin ping:</span>
            {pingQuery.loading ? <Badge variant="outline">Checking...</Badge> : null}
            {pingQuery.data?.ping ? <Badge>Online</Badge> : null}
            {pingQuery.error ? <Badge variant="destructive">Access denied or unavailable</Badge> : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
