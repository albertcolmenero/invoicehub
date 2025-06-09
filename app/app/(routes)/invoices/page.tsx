import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  Send,
  Trash2,
  MoreHorizontal,
  Calendar,
  DollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProtectedExportButton, ProtectedAnalytics } from "@/components/feature-protection-examples"

import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

const InvoicesPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const invoices = await prismadb.invoice.findMany({
    where: {
      userId
    },
    include: {
      client: true,
      items: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PAID":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "SENT":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "OVERDUE":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "DRAFT":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const isOverdue = (dueDate: Date, status: string) => {
    return new Date() > new Date(dueDate) && status !== "PAID"
  }

  // Calculate summary stats
  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.total, 0)
  const paidAmount = invoices
    .filter((invoice) => invoice.status === "PAID")
    .reduce((sum, invoice) => sum + invoice.total, 0)
  const pendingAmount = invoices
    .filter((invoice) => invoice.status === "SENT")
    .reduce((sum, invoice) => sum + invoice.total, 0)
  const overdueInvoices = invoices.filter((invoice) => 
    isOverdue(invoice.dueDate, invoice.status)
  )
  const overdueAmount = overdueInvoices.reduce((sum, invoice) => sum + invoice.total, 0)

  return (
    <>

      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invoiced</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
              <p className="text-xs text-muted-foreground">{invoices.length} total invoices</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(paidAmount)}</div>
              <p className="text-xs text-muted-foreground">
                {invoices.filter((i) => i.status === "PAID").length} invoices
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{formatCurrency(pendingAmount)}</div>
              <p className="text-xs text-muted-foreground">
                {invoices.filter((i) => i.status === "SENT").length} invoices
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <DollarSign className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(overdueAmount)}</div>
              <p className="text-xs text-muted-foreground">
                {overdueInvoices.length} invoices
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Protected Analytics Section */}
        <ProtectedAnalytics />

        {/* Actions and Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Invoice
            </Button>
            <ProtectedExportButton />
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search invoices..." className="pl-8 w-[250px]" />
            </div>
            <Select>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Invoices</CardTitle>
            <CardDescription>Manage and track all your invoices</CardDescription>
          </CardHeader>
          <CardContent>
            {invoices.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => {
                    const isInvoiceOverdue = isOverdue(invoice.dueDate, invoice.status)
                    return (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">#{invoice.invoiceNumber}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{invoice.client.name}</div>
                            <div className="text-sm text-muted-foreground">{invoice.client.email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{formatCurrency(invoice.total)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(isInvoiceOverdue ? "OVERDUE" : invoice.status)}>
                            {isInvoiceOverdue ? "Overdue" : invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
                        <TableCell>
                          <div className={isInvoiceOverdue ? "text-red-600 font-medium" : ""}>
                            {formatDate(invoice.dueDate)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                              </DropdownMenuItem>
                              {(invoice.status === "DRAFT" || invoice.status === "SENT") && (
                                <DropdownMenuItem>
                                  <Send className="mr-2 h-4 w-4" />
                                  Send Invoice
                                </DropdownMenuItem>
                              )}
                              {(invoice.status === "SENT" || isInvoiceOverdue) && (
                                <DropdownMenuItem>
                                  <Calendar className="mr-2 h-4 w-4" />
                                  Mark as Paid
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <div className="text-center">
                  <h3 className="text-lg font-medium">No invoices found</h3>
                  <p className="text-sm text-muted-foreground mb-4">Get started by creating your first invoice</p>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Invoice
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default InvoicesPage; 