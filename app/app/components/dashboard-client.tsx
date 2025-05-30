"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { 
  DollarSign, 
  CreditCard, 
  Package, 
  FileText, 
  Send, 
  CheckCircle,
  UserPlus,
  PlusCircle,
  Plus,
  Users,
  Badge,
  BarChart3,
  Eye,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Bar, BarChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { TrendingUp } from "lucide-react"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

interface DashboardClientProps {
  totalRevenue: number;
  currentMonthRevenue: number;
  outstandingPayments: number;
  invoicesByStatus: {
    DRAFT: number;
    SENT: number;
    PAID: number;
  };
  monthlyRevenue: {
    month: string;
    revenue: number;
  }[];
  recentInvoices: any[];
  recentlyPaid: any[];
  topClients: any[];
  availableYears?: number[];
}

export const DashboardClient: React.FC<DashboardClientProps> = ({
  totalRevenue,
  currentMonthRevenue,
  outstandingPayments,
  invoicesByStatus,
  monthlyRevenue,
  recentInvoices,
  recentlyPaid,
  topClients,
  availableYears = [],
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentYear = new Date().getFullYear();
  const selectedYear = searchParams.get('year') ? parseInt(searchParams.get('year')!) : currentYear;

  // Generate available years if not provided
  const years = availableYears.length > 0 
    ? availableYears 
    : Array.from({ length: 5 }, (_, i) => currentYear - i);

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PAID":
        return "bg-green-100 text-green-800"
      case "SENT":
        return "bg-yellow-100 text-yellow-800"
      case "OVERDUE":
        return "bg-red-100 text-red-800"
      case "DRAFT":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Calculate percentage change for current month
  const currentMonthIndex = new Date().getMonth();
  const previousMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;
  const currentMonthData = monthlyRevenue[currentMonthIndex]?.revenue || 0;
  const previousMonthData = monthlyRevenue[previousMonthIndex]?.revenue || 0;
  
  const revenueChange = previousMonthData > 0 
    ? ((currentMonthData - previousMonthData) / previousMonthData * 100).toFixed(1)
    : currentMonthData > 0 ? "100" : "0";

  // Count total customers from top clients
  const totalCustomers = topClients.length;

  const handleYearChange = (year: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('year', year);
    router.push(`?${params.toString()}`);
  };

  // Calculate total pending invoices (SENT status)
  const totalPendingInvoices = invoicesByStatus.SENT;

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Header with Year Selector */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <Button className="gap-2" onClick={() => router.push('/app/invoices/new')}>
              <Plus className="h-4 w-4" />
              New Invoice
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => router.push('/app/clients/new')}>
              <Users className="h-4 w-4" />
              Add Customer
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue (All Time)</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatter.format(totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">From all paid invoices</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPendingInvoices}</div>
              <p className="text-xs text-muted-foreground">{formatter.format(outstandingPayments)} outstanding</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCustomers}</div>
              <p className="text-xs text-muted-foreground">Customers with invoices in {selectedYear}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatter.format(currentMonthRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                {revenueChange !== "0" ? `${revenueChange > "0" ? "+" : ""}${revenueChange}% from last month` : "No change from last month"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Invoices */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
            <CardDescription>Your latest invoices and their current status</CardDescription>
          </CardHeader>
          <CardContent>
            {recentInvoices.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">#{invoice.invoiceNumber || invoice.id}</TableCell>
                      <TableCell>{invoice.client?.name || invoice.customerName || "Unknown"}</TableCell>
                      <TableCell>{formatter.format(invoice.total || 0)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                      </TableCell>
                      <TableCell>{new Date(invoice.invoiceDate || invoice.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => router.push(`/app/invoices/${invoice.id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {invoice.status === "DRAFT" && (
                            <Button variant="ghost" size="sm" onClick={() => router.push(`/app/invoices/${invoice.id}/send`)}>
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No invoices found</p>
                <Button className="mt-4" onClick={() => router.push('/app/invoices/new')}>
                  Create your first invoice
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue for {selectedYear}</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyRevenue.length > 0 ? (
              <ChartContainer config={chartConfig}>
                <BarChart accessibilityLayer data={monthlyRevenue}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis
                    tickFormatter={(value) => formatter.format(value)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" radius={8} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center bg-muted/50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No revenue data available for {selectedYear}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}; 