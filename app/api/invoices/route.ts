import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { InvoiceStatus } from "@/lib/constants";

export async function POST(req: Request) {
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
    } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!clientId) {
      return new NextResponse("Client ID is required", { status: 400 });
    }

    if (!items || !items.length) {
      return new NextResponse("Items are required", { status: 400 });
    }

    // Calculate totals
    const subtotal = items.reduce(
      (acc, item) => acc + item.quantity * item.unitPrice,
      0
    );
    const taxAmount = items.reduce(
      (acc, item) =>
        acc + item.quantity * item.unitPrice * (item.tax / 100),
      0
    );
    const total = subtotal + taxAmount;

    // Generate invoice number (you might want to implement a more sophisticated system)
    const lastInvoice = await prismadb.invoice.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    const invoiceNumber = lastInvoice
      ? `INV-${String(parseInt(lastInvoice.invoiceNumber.split("-")[1]) + 1).padStart(6, "0")}`
      : "INV-000001";

    const invoice = await prismadb.invoice.create({
      data: {
        userId,
        clientId,
        invoiceNumber,
        invoiceDate: new Date(invoiceDate),
        dueDate: new Date(dueDate),
        status: InvoiceStatus.DRAFT,
        subtotal,
        taxAmount,
        total,
        paymentTerms,
        notes,
        items: {
          create: items.map((item) => ({
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
    console.log("[INVOICES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");

    const invoices = await prismadb.invoice.findMany({
      where: {
        userId,
        ...(clientId && { clientId }),
      },
      include: {
        items: true,
        client: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.log("[INVOICES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 