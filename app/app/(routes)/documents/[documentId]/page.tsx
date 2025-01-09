import prismadb from "@/lib/prismadb";
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from "next/navigation";


        
import { DocumentForm } from "./components/document-form";

const DocumentPage = async ({
  params
}: {
  params: { documentId: string }
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

  const document = await prismadb.document.findUnique({
    where: {
      id: params.documentId
    }
  });   

  const projects = await prismadb.project.findMany({
    where: {
      userId: userId
    }
  });

  console.log("projects::");
  console.log(projects);


  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
            <DocumentForm initialData={document} projects={projects} />
      </div>
    </div>
  );
}

export default DocumentPage;