import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import { NewInvoiceForm } from "./components/new-invoice-form";

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
    <NewInvoiceForm clients={clients} />
  );
}

export default NewInvoicePage; 