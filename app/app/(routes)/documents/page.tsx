import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from "next/navigation";
import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { DocumentColumn } from "./components/columns"
import { DocumentClient } from "./components/client";

const DocumentsPage = async ({
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

  const documents = await prismadb.document.findMany({
    where: {
      userId: userId
    },
    include: {
      project: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedDocuments: DocumentColumn[] = documents.map((item) => ({
    id: item.id,
    name: item.name,
    projectId: item.projectId,
    project: item.project.name,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <DocumentClient data={formattedDocuments} />
      </div>
    </div>
  );
};

export default DocumentsPage;