import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import prismadb from '@/lib/prismadb';
 
export async function POST(
  req: Request,
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log('userId::', userId);

    const body = await req.json();

    if (!body) {
      return new NextResponse("Missing request body", { status: 400 });
    }

    const { name, projectId, content } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    // Get the user from database using clerkId
    const user = await prismadb.user.findUnique({
      where: {
        clerkId: userId
      }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const document = await prismadb.document.create({
      data: {
        name,
        userId: user.clerkId, // Use the database user ID
        projectId: projectId,
        content: content,
      }
    });
  
    return NextResponse.json(document);
  } catch (error) {
    console.log('[DOCUMENT_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request,
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prismadb.user.findUnique({
      where: {
        clerkId: userId
      }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const documents = await prismadb.document.findMany({
      where: {
        userId: userId
      }
    });

    console.log('user:', user);
    console.log('documents:', documents);
  
    return NextResponse.json(documents);
  } catch (error) {
    console.log('[DOCUMENTS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
