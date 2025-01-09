import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from "next/navigation";
import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { ProjectColumn } from "./components/columns"
import { ProjectClient } from "./components/client";

const ProjectsPage = async ({
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

  const projects = await prismadb.project.findMany({
    where: {
      userId: userId
    }
  });

  const formattedProjects: ProjectColumn[] = projects.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProjectClient data={formattedProjects} />
      </div>
    </div>
  );
};

export default ProjectsPage;
