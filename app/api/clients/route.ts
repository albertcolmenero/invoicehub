import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();

    const { name, email, phone, address, city, state, zip } = body;
    console.log(body);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!email) {
        return new NextResponse("Email is required", { status: 400 });
      }

    const client = await prismadb.client.create({
      data: {
        userId,
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
    console.log("[CLIENTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const clients = await prismadb.client.findMany({
      where: {
        userId,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.log("[CLIENTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 