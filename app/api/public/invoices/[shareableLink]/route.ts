import { NextResponse } from "next/server";
import { renderToBuffer, Document } from "@react-pdf/renderer";
import { createElement } from 'react';

import prismadb from "@/lib/prismadb";
import { InvoicePDF } from "@/app/app/(routes)/invoices/components/invoice-pdf";

export async function GET(
  req: Request,
  { params }: { params: { shareableLink: string } }
) {
  try {
    const invoice = await prismadb.invoice.findUnique({
      where: {
        shareableLink: params.shareableLink,
      },
      include: {
        items: true,
        client: true,
      },
    });

    if (!invoice) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Get the user details
    const user = await prismadb.user.findUnique({
      where: {
        clerkId: invoice.userId,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Track the view
    await prismadb.invoice.update({
      where: {
        id: invoice.id,
      },
      data: {
        viewCount: {
          increment: 1,
        },
        lastViewed: new Date(),
      },
    });

    // Generate PDF
    const element = createElement(Document, {}, createElement(InvoicePDF, { invoice, user }));
    const pdfBuffer = await renderToBuffer(element);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.log('[INVOICE_PUBLIC_PDF]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 