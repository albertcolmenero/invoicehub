"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import { AtlasProvider } from "@runonatlas/private-next/client";
import { redirect } from "next/navigation";

export function AtlasClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, getToken } = useAuth();
  const { user } = useUser();

  return (
    <AtlasProvider
      getAuth={getToken}
      host="http://localhost:3000"
      loginCallback={() => { redirect("/sign-in"); }}
      userEmail={user?.primaryEmailAddress?.emailAddress} // Optional
      userId={userId}
      userName={user?.fullName} // Optional
    >
      {children}
    </AtlasProvider>
  );
}