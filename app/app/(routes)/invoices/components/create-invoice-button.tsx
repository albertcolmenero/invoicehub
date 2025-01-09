"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export const CreateInvoiceButton = () => {
  const router = useRouter();

  return (
    <Button onClick={() => router.push("/app/invoices/new")}>
      <Plus className="mr-2 h-4 w-4" /> Create Invoice
    </Button>
  );
}; 