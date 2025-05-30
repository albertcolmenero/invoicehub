import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { cookies } from "next/headers"

import Navbar from '@/components/navbar'
import { UserButton } from "@clerk/nextjs";
import { MobileMainNav } from "@/components/mobile-main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import prismadb from "@/lib/prismadb";
import { DashboardClient } from './components/dashboard-client';
import { Separator } from '@/components/ui/separator';
import { DynamicHeader } from '@/components/dynamic-header';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect('/')
  }

  // Check if user exists in database
  const dbUser = await prismadb.user.findUnique({
    where: {
      clerkId: userId
    }
  });

  // If user doesn't exist, create them
  if (!dbUser) {
    await prismadb.user.create({
      data: {
        clerkId: userId,
        email: user.emailAddresses[0].emailAddress,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      }
    });
  }

  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />

            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2  px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <DynamicHeader />
              </header>
              <div className="flex-col">
              <div className="flex-1 space-y-4 px-1">
              {children}
              </div>
            </div>
            </SidebarInset>
          
          
        </SidebarProvider>
    </div>
  )
} 