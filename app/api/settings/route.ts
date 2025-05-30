import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";

export async function PATCH(
  req: Request,
) {
  try {
    const { userId } = await auth();
    const body = await req.json();

    const { 
      companyName,
      address,
      city,
      state,
      zipCode,
      country,
      phone,
      logo,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log(body);

    // Get the user from database using clerkId
    const useraux = await prismadb.user.findUnique({
        where: {
          clerkId: userId
        }
      });

    console.log(useraux);

    const user = await prismadb.user.update({
      where: {
        clerkId: userId,
      },
      data: {
        companyName,
        address,
        city,
        state,
        zipCode,
        country,
        phone,
        logo,
      },
    });
  
    return NextResponse.json(user);
  } catch (error) {
    console.log('[SETTINGS_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}; 