"use client";

import { PricingComponent } from "@runonatlas/private-next/client";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function PricingPage() {
  const { userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  console.log('userId', userId);

  /* useEffect(() => {
    if (!userId ) {
      router.push('/sign-in');
    }
  }, [userId, user, router]);*/

  if (!userId || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const merchantUser = {
    id: userId,
    email: user.primaryEmailAddress?.emailAddress || '',
    name: user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}` 
      : user.fullName || user.firstName || 'User',
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Pricing & Billing</h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscription and billing preferences
        </p>
      </div>
      
      <PricingComponent
        
        successUrl={process.env.NODE_ENV === 'development' ? "http://localhost:3000/app" : `${process.env.NEXT_PUBLIC_APP_URL}/app`}
      />
    </div>
  );
} 