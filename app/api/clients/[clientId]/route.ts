import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { clientId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const client = await prismadb.client.findUnique({
      where: {
        id: params.clientId,
        userId,
      },
      include: {
        invoices: {
          include: {
            items: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.log("[CLIENT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { clientId: string } }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();

    const { name, email, phone, address, city, state, zip } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const client = await prismadb.client.update({
      where: {
        id: params.clientId,
        userId,
      },
      data: {
        name,
        email,
        phone,
        address,
        city,
        state,
        zip
      },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.log("[CLIENT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { clientId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if client has any invoices
    const clientWithInvoices = await prismadb.client.findUnique({
      where: {
        id: params.clientId,
        userId,
      },
      include: {
        invoices: true,
      },
    });

    if (clientWithInvoices?.invoices.length) {
      return new NextResponse(
        "Cannot delete client with existing invoices",
        { status: 400 }
      );
    }

    const client = await prismadb.client.delete({
      where: {
        id: params.clientId,
        userId,
      },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.log("[CLIENT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 