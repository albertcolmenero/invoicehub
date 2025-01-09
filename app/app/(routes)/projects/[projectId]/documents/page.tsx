import { auth } from '@clerk/nextjs/server'
import { redirect } from "next/navigation";
import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { DocumentClient } from "./components/client";

const DocumentsPage = async ({
  params
}: {
  params: { projectId: string }
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

  // Verify project belongs to user
  const project = await prismadb.project.findFirst({
    where: {
      id: params.projectId,
      userId: userId,
    }
  });

  if (!project) {
    redirect("/projects");
  }

  const documents = await prismadb.document.findMany({
    where: {
      projectId: params.projectId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedDocuments = documents.map((item) => ({
    id: item.id,
    name: item.name,
    content: item.content,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <DocumentClient data={formattedDocuments} projectId={params.projectId} />
      </div>
    </div>
  );
};

export default DocumentsPage; 