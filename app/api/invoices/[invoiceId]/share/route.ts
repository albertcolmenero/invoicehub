import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { invoiceId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const invoice = await prismadb.invoice.findUnique({
      where: {
        id: params.invoiceId,
        userId,
      },
    });

    if (!invoice) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Generate a unique shareable link if one doesn't exist
    if (!invoice.shareableLink) {
      const shareableLink = randomBytes(32).toString('hex');
      
      await prismadb.invoice.update({
        where: {
          id: params.invoiceId,
        },
        data: {
          shareableLink,
        },
      });

      return NextResponse.json({ shareableLink });
    }

    return NextResponse.json({ shareableLink: invoice.shareableLink });
  } catch (error) {
    console.log('[INVOICE_SHARE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 