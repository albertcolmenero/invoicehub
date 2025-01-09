"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, ClientColumn } from "./columns";

interface ClientClientProps {
  data: ClientColumn[];
}

export const ClientClient: React.FC<ClientClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  const onRowClick = (id: string) => {
    router.push(`/app/clients/${id}`);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Clients`} description="Manage your clients" />
        <Button onClick={() => router.push(`/app/clients/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      
      <DataTable 
        searchKey="name" 
        columns={columns} 
        data={data} 
        onRowClick={onRowClick}
      />
    </>
  );
};
