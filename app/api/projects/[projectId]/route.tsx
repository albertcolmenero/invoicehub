import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    if (!params.projectId) {
      return new NextResponse("project id is required", { status: 400 });
    }

    const project = await prismadb.project.findUnique({
      where: {
        id: params.projectId
      }
    });
  
    return NextResponse.json(project);
  } catch (error) {
    console.log('[PROJECT_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.projectId) {
      return new NextResponse("project id is required", { status: 400 });
    }

    const project = await prismadb.project.delete({
      where: {
        id: params.projectId,
      }
    });
  
    return NextResponse.json(project);
  } catch (error) {
    console.log('[PROJECT_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
    { params }: { params: { projectId: string } }
) {
  try {   
    const { userId } = await auth();

    const body = await req.json();
    
    const { name, ignore } = body;
    
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.projectId) {
      return new NextResponse("Project id is required", { status: 400 });
    }

    const projectByUserId = await prismadb.project.findFirst({
        where: {
          id: params.projectId,
          userId,
        }
      });

   
    const project = await prismadb.project.update({
      where: {
        id: params.projectId,
      },
      data: {
        name,
      }
    });
  
    return NextResponse.json(project);
  } catch (error) {
    console.log('[PROJECT_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
