import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";

import { InvoiceClient } from "./components/client";
import { InvoiceColumn } from "./components/columns";
import { format } from "date-fns";

const InvoicesPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const invoices = await prismadb.invoice.findMany({
    where: {
      userId
    },
    include: {
      client: true,
      items: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedInvoices: InvoiceColumn[] = invoices.map((item) => ({
    id: item.id,
    invoiceNumber: item.invoiceNumber,
    clientName: item.client.name,
    date: format(item.invoiceDate, 'MMMM do, yyyy'),
    dueDate: format(item.dueDate, 'MMMM do, yyyy'),
    status: item.status,
    total: item.total.toString(),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <InvoiceClient data={formattedInvoices} />
      </div>
    </div>
  );
}

export default InvoicesPage; 