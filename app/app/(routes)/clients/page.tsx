import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from "next/navigation";
import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { ClientColumn } from "./components/columns"
import { ClientClient } from "./components/client";

const ClientsPage = async ({
  params
}: {
  params: {  }
}) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const user = await prismadb.user.findUnique({
    where: {
      clerkId: userId
    }
  });

  if (!user) {
    redirect("/");
  }

  const clients = await prismadb.client.findMany({
    where: {
      userId: userId
    },
    include: {
      invoices: true,
    },
  });

  const formattedClients: ClientColumn[] = clients.map((item) => ({
    id: item.id,
    name: item.name,
    email: item.email || "N/A",
    invoiceCount: item.invoices.length,
    totalBilled: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(
      item.invoices.reduce((acc, invoice) => acc + invoice.total, 0)
    ),
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ClientClient data={formattedClients} />
      </div>
    </div>
  );
};

export default ClientsPage;
