"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, InvoiceColumn } from "./columns";
import { CreateInvoiceButton } from "./create-invoice-button";

interface InvoiceClientProps {
  data: InvoiceColumn[];
}

export const InvoiceClient: React.FC<InvoiceClientProps> = ({
  data
}) => {
  const router = useRouter();

  const onRowClick = (id: string) => {
    router.push(`/app/invoices/${id}`);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Invoices (${data.length})`}
          description="Manage your invoices"
        />
        <CreateInvoiceButton />
      </div>
      <Separator />
      <DataTable 
        searchKey="invoiceNumber" 
        columns={columns} 
        data={data} 
        onRowClick={onRowClick}
      />
    </>
  );
}; 