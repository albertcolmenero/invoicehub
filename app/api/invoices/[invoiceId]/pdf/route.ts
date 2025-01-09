import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { renderToBuffer, Document } from "@react-pdf/renderer";
import { createElement } from 'react';

import prismadb from "@/lib/prismadb";
import { InvoicePDF } from "@/app/app/(routes)/invoices/components/invoice-pdf";

export async function GET(
  req: Request,
  { params }: { params: { invoiceId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const [invoice, user] = await Promise.all([
      prismadb.invoice.findUnique({
        where: {
          id: params.invoiceId,
          userId,
        },
        include: {
          items: true,
          client: true,
        },
      }),
      prismadb.user.findUnique({
        where: {
          clerkId: userId,
        },
      }),
    ]);

    if (!invoice || !user) {
      return new NextResponse("Not found", { status: 404 });
    }

    const element = createElement(Document, {}, createElement(InvoicePDF, { invoice, user }));
    const pdfBuffer = await renderToBuffer(element);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.log('[INVOICE_PDF]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 