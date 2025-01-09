import { Metadata } from "next";
import prismadb from "@/lib/prismadb";
        
import { ClientForm } from "./components/client-form";

interface Props {
  params: {
    clientId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

const ClientPage = async ({ params }: Props) => {
  const client = await prismadb.client.findUnique({
    where: {
      id: params.clientId
    }
  });   

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
            <ClientForm initialData={client} />
      </div>
    </div>
  );
}

export default ClientPage;