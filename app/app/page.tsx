import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import { DashboardClient } from "./components/dashboard-client";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

const DashboardPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Fetch all required data
  const [
    invoices,
    currentMonthInvoices,
    paidInvoices,
    clients,
  ] = await Promise.all([
    // All invoices
    prismadb.invoice.findMany({
      where: { userId },
      include: {
        client: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    // Current month invoices
    prismadb.invoice.findMany({
      where: {
        userId,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
    // Paid invoices
    prismadb.invoice.findMany({
      where: {
        userId,
        status: 'PAID',
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 5,
    }),
    // Clients with invoice counts and totals
    prismadb.client.findMany({
      where: { userId },
      include: {
        invoices: true,
      },
    }),
  ]);

  // Calculate dashboard metrics
  const totalRevenue = invoices.reduce((sum, invoice) => 
    invoice.status === 'PAID' ? sum + invoice.total : sum, 0
  );
  
  const currentMonthRevenue = currentMonthInvoices.reduce((sum, invoice) => 
    invoice.status === 'PAID' ? sum + invoice.total : sum, 0
  );

  const outstandingPayments = invoices.reduce((sum, invoice) => 
    invoice.status !== 'PAID' ? sum + invoice.total : sum, 0
  );

  const invoicesByStatus = {
    DRAFT: invoices.filter(invoice => invoice.status === 'DRAFT').length,
    SENT: invoices.filter(invoice => invoice.status === 'SENT').length,
    PAID: invoices.filter(invoice => invoice.status === 'PAID').length,
  };

  // Calculate monthly revenue for chart
  const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(new Date().getFullYear(), i, 1);
    const monthInvoices = invoices.filter(invoice => 
      invoice.status === 'PAID' &&
      invoice.createdAt.getMonth() === month.getMonth() &&
      invoice.createdAt.getFullYear() === month.getFullYear()
    );
    return {
      month: month.toLocaleString('default', { month: 'short' }),
      revenue: monthInvoices.reduce((sum, invoice) => sum + invoice.total, 0),
    };
  });

  // Get top clients by revenue
  const topClients = clients
    .map(client => ({
      ...client,
      totalRevenue: client.invoices.reduce((sum, invoice) => 
        invoice.status === 'PAID' ? sum + invoice.total : sum, 0
      ),
      outstandingAmount: client.invoices.reduce((sum, invoice) => 
        invoice.status !== 'PAID' ? sum + invoice.total : sum, 0
      ),
      invoiceCount: client.invoices.length,
    }))
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <DashboardClient 
          totalRevenue={totalRevenue}
          currentMonthRevenue={currentMonthRevenue}
          outstandingPayments={outstandingPayments}
          invoicesByStatus={invoicesByStatus}
          monthlyRevenue={monthlyRevenue}
          recentInvoices={invoices.slice(0, 5)}
          recentlyPaid={paidInvoices}
          topClients={topClients}
        />
      </div>
    </div>
  );
}

export default DashboardPage; 