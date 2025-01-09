import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";

import { InvoiceForm } from "../[invoiceId]/components/invoice-form";

const NewInvoicePage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const clients = await prismadb.client.findMany({
    where: {
      userId
    },
    orderBy: {
      name: 'asc'
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <InvoiceForm 
          initialData={null}
          clients={clients}
        />
      </div>
    </div>
  );
}

export default NewInvoicePage; 