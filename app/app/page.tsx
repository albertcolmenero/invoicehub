import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import { DashboardClient } from "./components/dashboard-client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

const DashboardPage = async ({ 
  searchParams 
}: { 
  searchParams: Promise<{ year?: string }> 
}) => {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const resolvedSearchParams = await searchParams;
  const selectedYear = resolvedSearchParams.year ? parseInt(resolvedSearchParams.year) : new Date().getFullYear();

  // Fetch all required data for the selected year
  const [
    allInvoices,
    yearInvoices,
    currentMonthInvoices,
    recentInvoices,
    paidInvoices,
    clients,
  ] = await Promise.all([
    // All invoices ever (for total revenue calculation)
    prismadb.invoice.findMany({
      where: { 
        userId,
        status: 'PAID', // Only count paid invoices for total revenue
      },
      include: {
        client: true,
      },
    }),
    // Invoices for selected year
    prismadb.invoice.findMany({
      where: { 
        userId,
        invoiceDate: {
          gte: new Date(selectedYear, 0, 1),
          lt: new Date(selectedYear + 1, 0, 1),
        },
      },
      include: {
        client: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    // Current month invoices (for this month calculation)
    prismadb.invoice.findMany({
      where: {
        userId,
        invoiceDate: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        },
      },
    }),
    // Recent invoices (last 10 for better visibility)
    prismadb.invoice.findMany({
      where: { userId },
      include: {
        client: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    }),
    // Recently paid invoices
    prismadb.invoice.findMany({
      where: {
        userId,
        status: 'PAID',
      },
      include: {
        client: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 5,
    }),
    // Clients with invoice counts and totals for selected year
    prismadb.client.findMany({
      where: { userId },
      include: {
        invoices: {
          where: {
            invoiceDate: {
              gte: new Date(selectedYear, 0, 1),
              lt: new Date(selectedYear + 1, 0, 1),
            }
          }
        },
      },
    }),
  ]);

  // Calculate dashboard metrics
  const totalRevenue = allInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
  
  const currentMonthRevenue = currentMonthInvoices.reduce((sum, invoice) => 
    invoice.status === 'PAID' ? sum + invoice.total : sum, 0
  );

  const outstandingPayments = yearInvoices.reduce((sum, invoice) => 
    invoice.status !== 'PAID' ? sum + invoice.total : sum, 0
  );

  const invoicesByStatus = {
    DRAFT: yearInvoices.filter(invoice => invoice.status === 'DRAFT').length,
    SENT: yearInvoices.filter(invoice => invoice.status === 'SENT').length,
    PAID: yearInvoices.filter(invoice => invoice.status === 'PAID').length,
  };

  // Calculate monthly revenue for chart (selected year)
  const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(selectedYear, i, 1);
    const monthInvoices = yearInvoices.filter(invoice => 
      invoice.status === 'PAID' &&
      invoice.invoiceDate.getMonth() === month.getMonth()
    );
    return {
      month: month.toLocaleString('default', { month: 'long' }),
      revenue: monthInvoices.reduce((sum, invoice) => sum + invoice.total, 0),
    };
  });

  // Get top clients by revenue for selected year
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
    .filter(client => client.invoiceCount > 0)
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);

  // Get available years from invoice data
  const availableYears = await prismadb.invoice.findMany({
    where: { userId },
    select: { invoiceDate: true },
    orderBy: { invoiceDate: 'desc' },
  });

  const uniqueYears = [...new Set(
    availableYears.map(invoice => invoice.invoiceDate.getFullYear())
  )].sort((a, b) => b - a);

  return (
    <DashboardClient 
      totalRevenue={totalRevenue}
      currentMonthRevenue={currentMonthRevenue}
      outstandingPayments={outstandingPayments}
      invoicesByStatus={invoicesByStatus}
      monthlyRevenue={monthlyRevenue}
      recentInvoices={recentInvoices}
      recentlyPaid={paidInvoices}
      topClients={topClients}
      availableYears={uniqueYears}
    />
  );
}

export default DashboardPage; 