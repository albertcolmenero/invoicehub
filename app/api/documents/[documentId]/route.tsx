import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { documentId: string } }
) {
  try {
    if (!params.documentId) {
      return new NextResponse("document id is required", { status: 400 });
    }

    const document = await prismadb.document.findUnique({
      where: {
        id: params.documentId
      }
    });
  
    return NextResponse.json(document);
  } catch (error) {
    console.log('[DOCUMENT_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { documentId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.documentId) {
        return new NextResponse("document id is required", { status: 400 });
    }

    const document = await prismadb.document.delete({
      where: {
        id: params.documentId,
      }
    });
  
    return NextResponse.json(document);
  } catch (error) {
    console.log('[DOCUMENT_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
    { params }: { params: { documentId: string } }
) {
  try {   
    const { userId } = await auth();

    const body = await req.json();
    
    const { name, projectId, content } = body;
    
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.documentId) {
      return new NextResponse("Document id is required", { status: 400 });
    }

    const documentByUserId = await prismadb.document.findFirst({
        where: {
          id: params.documentId,
          userId,
        }
      });

   
    const document = await prismadb.document.update({
      where: {
        id: params.documentId,
      },
      data: {
        name,
        projectId,
        content
      }
    });
  
    return NextResponse.json(document);
  } catch (error) {
    console.log('[DOCUMENT_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
