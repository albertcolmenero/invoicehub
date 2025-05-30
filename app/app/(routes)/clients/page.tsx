import { auth } from '@clerk/nextjs/server'
import { redirect } from "next/navigation";
import { Plus, Search, Download, DollarSign } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import prismadb from "@/lib/prismadb";

export default async function ClientsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const clients = await prismadb.client.findMany({
    where: {
      userId: userId
    },
    include: {
      invoices: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // Calculate summary stats
  const totalCustomers = clients.length
  const activeCustomers = clients.filter((client) => client.invoices.length > 0).length
  const totalRevenue = clients.reduce((sum, client) => {
    return sum + client.invoices.filter(invoice => invoice.status === 'PAID').reduce((sum, invoice) => sum + invoice.total, 0)
  }, 0)
  const totalInvoiceCount = clients.reduce((sum, client) => sum + client.invoices.length, 0)
  const averageInvoiceValue = totalInvoiceCount > 0 ? totalRevenue / totalInvoiceCount : 0

  return (
    <>

      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCustomers}</div>
              <p className="text-xs text-muted-foreground">{activeCustomers} active clients</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeCustomers}</div>
              <p className="text-xs text-muted-foreground">
                {totalCustomers > 0 ? ((activeCustomers / totalCustomers) * 100).toFixed(1) : 0}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">From all clients</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Invoice Value</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{formatCurrency(averageInvoiceValue)}</div>
              <p className="text-xs text-muted-foreground">Per invoice</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions and Search */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2">
            <Button className="gap-2" asChild>
              <a href="/app/clients/new">
                <Plus className="h-4 w-4" />
                New Client
              </a>
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search clients..." className="pl-8 w-[250px]" />
            </div>
          </div>
        </div>

        {/* Clients Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Clients</CardTitle>
            <CardDescription>Manage your client relationships and track their activity</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Invoiced</TableHead>
                  <TableHead>Total Paid</TableHead>
                  <TableHead>Invoices</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => {
                  const totalInvoiced = client.invoices.reduce((sum, invoice) => sum + invoice.total, 0)
                  const totalPaid = client.invoices.filter(invoice => invoice.status === 'PAID').reduce((sum, invoice) => sum + invoice.total, 0)
                  
                  return (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{client.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>{client.email || "No email"}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          {client.invoices.length > 0 ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(totalInvoiced)}</TableCell>
                      <TableCell className="font-medium text-green-600">{formatCurrency(totalPaid)}</TableCell>
                      <TableCell>{client.invoices.length}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
