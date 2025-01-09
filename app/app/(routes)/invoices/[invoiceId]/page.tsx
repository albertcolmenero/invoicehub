import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";

import { InvoiceForm } from "./components/invoice-form";

const InvoicePage = async ({
  params
}: {
  params: { invoiceId: string }
}) => {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const invoice = await prismadb.invoice.findUnique({
    where: {
      id: params.invoiceId,
      userId
    },
    include: {
      items: true
    }
  });

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
          initialData={invoice}
          clients={clients}
        />
      </div>
    </div>
  );
}

export default InvoicePage; 