"use client";

import { FeatureProtect, useFeaturesAllowed } from "@runonatlas/private-next/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, BarChart3, Users, AlertTriangle } from "lucide-react";

// Example 1: Protected Export Button
export function ProtectedExportButton() {
  return (
    <FeatureProtect
      disallowedFallback={
        <Button variant="outline" disabled className="gap-2">
          <Download className="h-4 w-4" />
          Export (Premium)
        </Button>
      }
      features={["export-data"]}
    >
      <Button variant="outline" className="gap-2">
        <Download className="h-4 w-4" />
        Export
      </Button>
    </FeatureProtect>
  );
}

// Example 2: Advanced Analytics Feature
export function ProtectedAnalytics() {
  const { isAllowed } = useFeaturesAllowed(["advanced-analytics"]);

  if (!isAllowed) {
    return (
      <Card className="border-dashed border-2 border-muted-foreground/25">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Advanced Analytics
            <Badge variant="outline">Premium</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Upgrade to Premium to access detailed analytics, revenue forecasting, and payment trends.
            </p>
            <Button variant="outline" asChild>
              <a href="/app/pricing">Upgrade Now</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Advanced Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Revenue Trend</p>
            <p className="text-2xl font-bold text-green-600">+12%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg Payment Time</p>
            <p className="text-2xl font-bold">18 days</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Collection Rate</p>
            <p className="text-2xl font-bold">94%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Example 3: Multiple Clients Feature
export function ProtectedMultipleClients() {
  return (
    <FeatureProtect
      disallowedFallback={
        <div className="text-center p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Multiple Clients</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Upgrade to manage unlimited clients and organize your business better.
          </p>
          <Button variant="outline" asChild>
            <a href="/app/pricing">Upgrade to Pro</a>
          </Button>
        </div>
      }
      features={["multiple-clients"]}
    >
      <div className="space-y-4">
        <h3 className="font-semibold">All Clients</h3>
        {/* Your multiple clients content would go here */}
        <p className="text-sm text-muted-foreground">
          You have access to unlimited client management.
        </p>
      </div>
    </FeatureProtect>
  );
}

// Example 4: Bulk Operations
export function ProtectedBulkActions() {
  const { isAllowed } = useFeaturesAllowed(["bulk-operations"]);

  return (
    <div className="flex gap-2">
      {isAllowed ? (
        <>
          <Button variant="outline" size="sm">
            Bulk Send
          </Button>
          <Button variant="outline" size="sm">
            Bulk Export
          </Button>
          <Button variant="outline" size="sm">
            Bulk Delete
          </Button>
        </>
      ) : (
        <>
          <Button variant="outline" size="sm" disabled>
            Bulk Send (Pro)
          </Button>
          <Button variant="outline" size="sm" disabled>
            Bulk Export (Pro)
          </Button>
          <Button variant="outline" size="sm" disabled>
            Bulk Delete (Pro)
          </Button>
        </>
      )}
    </div>
  );
} 