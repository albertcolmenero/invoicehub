import { auth } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";

import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import prismadb from "@/lib/prismadb";

const Navbar = async () => {
    const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in');
  }

  return ( 
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <MainNav className="mx-6" />
    </aside>
    
    
  );
};
 
export default Navbar;
