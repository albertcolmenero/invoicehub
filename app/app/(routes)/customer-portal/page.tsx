"use client";

import { CustomerPortalComponent } from "@runonatlas/private-next/client";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CustomerPortalPage() {
  const { userId } = useAuth();
  const router = useRouter();

  /*useEffect(() => {
    if (!userId) {
      router.push('/sign-in');
    }
  }, [userId, router]);*/

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Customer Portal</h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscription, billing, and account settings
        </p>
      </div>
      
      <CustomerPortalComponent successUrl="http://localhost:3000/app/customer-portal" />
    </div>
  );
} 