"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Bar, BarChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis } from "recharts";

import { TrendingUp } from "lucide-react"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]
const chartConfig = {
  desktop: {
    label: "Desktop",
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
}) => {
  const router = useRouter();

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Dashboard" description="Overview of your invoices" />
        <div className="flex items-center gap-x-2">
          <Button onClick={() => router.push('/clients/new')}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
          <Button onClick={() => router.push('/invoices/new')}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>
      <Separator />

      {/* Charts and Lists */}
      <div className="grid gap-4 grid-cols-2">
        {/* Monthly Revenue Chart */}
        <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{formatter.format(totalRevenue)}</div>
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
                <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
            </BarChart>
            </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
            
            <div className="leading-none text-muted-foreground">
            Current year earnings
            </div>
        </CardFooter>
      </Card> 

        {/* Recent Activity and Top Clients */}
        <div className="space-y-4">
            <div className="grid gap-4 grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Current Month</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
            
                <CardContent>
                    <div className="text-2xl font-bold">{formatter.format(currentMonthRevenue)}</div>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">                
                    <div className="leading-none text-muted-foreground">
                    This month's revenue
                    </div>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>Outstanding</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatter.format(outstandingPayments)}</div>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">                
                        <div className="leading-none text-muted-foreground">
                        Pending payments
                        </div>
                    </CardFooter>
                </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>Invoice Status</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-x-2 text-sm">
                    <Send className="h-4 w-4" /> {invoicesByStatus.SENT} Sent
                    </div>
                    <div className="flex items-center gap-x-2 text-sm">
                    <CheckCircle className="h-4 w-4" /> {invoicesByStatus.PAID} Paid
                    </div>
                    <div className="flex items-center gap-x-2 text-sm">
                    <FileText className="h-4 w-4" /> {invoicesByStatus.DRAFT} Draft
                    </div>
                </CardContent>
            </Card>
          {/* Recent Invoices */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentInvoices.map((invoice) => (
                  <div 
                    key={invoice.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        invoice.status === 'PAID' 
                          ? 'bg-green-500' 
                          : invoice.status === 'SENT' 
                            ? 'bg-blue-500' 
                            : 'bg-gray-500'
                      }`} />
                      <span>{invoice.client.name}</span>
                    </div>
                    <span>{formatter.format(invoice.total)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Clients */}
          <Card>
            <CardHeader>
              <CardTitle>Top Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {topClients.map((client) => (
                  <div 
                    key={client.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex flex-col">
                      <span>{client.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {client.invoiceCount} invoices
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span>{formatter.format(client.totalRevenue)}</span>
                      {client.outstandingAmount > 0 && (
                        <span className="text-xs text-red-500">
                          {formatter.format(client.outstandingAmount)} outstanding
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    </>
  );
}; 