import { DocumentForm } from "../[documentId]/components/document-form";

import prismadb from "@/lib/prismadb";
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from "next/navigation";


const NewDocumentPage = async () => {

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

  const projects = await prismadb.project.findMany({
    where: {
      userId: userId
    }
  });

  

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <DocumentForm initialData={null} projects={projects} />
      </div>
    </div>
   );
}

export default NewDocumentPage; 