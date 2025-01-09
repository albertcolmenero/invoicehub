import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/navbar'
import { UserButton } from "@clerk/nextjs";
import { MobileMainNav } from "@/components/mobile-main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import prismadb from "@/lib/prismadb";

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
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Navbar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-end gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div className="flex items-center gap-4">
            <MobileMainNav />
            <ThemeToggle />
            <UserButton />
          </div>
        </header>

        <div className="flex flex-col sm:gap-4 sm:py-4">      
          {children}
        </div>
      </div>
    </div>
  )
} 