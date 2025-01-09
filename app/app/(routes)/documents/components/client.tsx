"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, DocumentColumn } from "./columns";

interface DocumentClientProps {
  data: DocumentColumn[];
}

export const DocumentClient: React.FC<DocumentClientProps> = ({
  data,
}) => {
  const params = useParams();

  const router = useRouter();

  const onRowClick = (id: string) => {
    router.push(`/app/documents/${id}`);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Documents`} description="Manage your documents" />
          <Button onClick={() => router.push(`/documents/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} onRowClick={onRowClick} />
      
    </>
  );
};
