import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(
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
      include: {
        items: true,
        client: true,
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.log("[INVOICE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { invoiceId: string } }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();

    const {
      clientId,
      invoiceDate,
      dueDate,
      items,
      paymentTerms,
      notes,
      status,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!items || !items.length) {
      return new NextResponse("Items are required", { status: 400 });
    }

    // Calculate totals
    const subtotal = items.reduce(
      (acc: number, item: any) => acc + item.quantity * item.unitPrice,
      0
    );
    const taxAmount = items.reduce(
      (acc: number, item: any) =>
        acc + item.quantity * item.unitPrice * (item.tax / 100),
      0
    );
    const total = subtotal + taxAmount;

    // Delete existing items
    await prismadb.invoiceItem.deleteMany({
      where: {
        invoiceId: params.invoiceId,
      },
    });

    // Update invoice with new items
    const invoice = await prismadb.invoice.update({
      where: {
        id: params.invoiceId,
        userId,
      },
      data: {
        clientId,
        invoiceDate: invoiceDate ? new Date(invoiceDate) : undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        status,
        subtotal,
        taxAmount,
        total,
        paymentTerms,
        notes,
        items: {
          create: items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            tax: item.tax,
            amount: item.quantity * item.unitPrice * (1 + item.tax / 100),
          })),
        },
      },
      include: {
        items: true,
        client: true,
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.log("[INVOICE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { invoiceId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Delete invoice items first due to foreign key constraint
    await prismadb.invoiceItem.deleteMany({
      where: {
        invoiceId: params.invoiceId,
      },
    });

    const invoice = await prismadb.invoice.delete({
      where: {
        id: params.invoiceId,
        userId,
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.log("[INVOICE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 