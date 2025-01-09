"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, ProjectColumn } from "./columns";

interface ProjectClientProps {
  data: ProjectColumn[];
}

export const ProjectClient: React.FC<ProjectClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  const onRowClick = (id: string) => {
    router.push(`/app/projects/${id}`);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Projects`} description="Manage your projects" />
        <Button onClick={() => router.push(`/projects/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} onRowClick={onRowClick} />
      
    </>
  );
};
