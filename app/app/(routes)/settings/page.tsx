import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { CustomerPortal, MerchantPricingPage } from "@runonatlas/private-next/client";


import prismadb from "@/lib/prismadb";
import { SettingsForm } from "./components/settings-form";

const SettingsPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const user = await prismadb.user.findFirst({
    where: {
      clerkId: userId
    }
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={user} />
        <CustomerPortal />
      
      </div>
    </div>
  );
}

export default SettingsPage; 