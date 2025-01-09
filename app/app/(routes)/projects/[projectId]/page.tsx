import prismadb from "@/lib/prismadb";
        
import { ProjectForm } from "./components/project-form";

const ProjectPage = async ({
  params
}: {
  params: { projectId: string }
}) => {
  const project = await prismadb.project.findUnique({
    where: {
      id: params.projectId
    }
  });   

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
            <ProjectForm initialData={project} />
      </div>
    </div>
  );
}

export default ProjectPage;
