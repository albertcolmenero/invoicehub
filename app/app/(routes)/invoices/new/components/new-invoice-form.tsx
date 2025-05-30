"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Trash2, Save, Send, Calculator, Calendar, User, FileText } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
}

interface NewInvoiceFormProps {
  clients: Client[];
}

export function NewInvoiceForm({ clients }: NewInvoiceFormProps) {
  const [lineItems, setLineItems] = useState([
    { id: 1, description: "", quantity: 1, rate: 0, amount: 0 },
  ])

  const addLineItem = () => {
    const newId = Math.max(...lineItems.map(item => item.id)) + 1
    setLineItems([...lineItems, { id: newId, description: "", quantity: 1, rate: 0, amount: 0 }])
  }

  const removeLineItem = (id: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id))
    }
  }

  const updateLineItem = (id: number, field: string, value: string | number) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate
        }
        return updatedItem
      }
      return item
    }))
  }

  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0)
  const taxRate = 0.08 // 8% tax
  const taxAmount = subtotal * taxRate
  const total = subtotal + taxAmount

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const generateInvoiceNumber = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `INV-${year}${month}${day}-${random}`
  }

  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0]
  }

  const getDueDate = () => {
    const date = new Date()
    date.setDate(date.getDate() + 30) // 30 days from now
    return date.toISOString().split('T')[0]
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Button variant="ghost" size="sm" className="gap-2" asChild>
          <a href="/app/invoices">
            <ArrowLeft className="h-4 w-4" />
            Back to Invoices
          </a>
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">New Invoice</h1>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6 max-w-4xl mx-auto">
        {/* Invoice Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Invoice Details
            </CardTitle>
            <CardDescription>Basic information for your invoice</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoice-number">Invoice Number</Label>
                <Input
                  id="invoice-number"
                  defaultValue={generateInvoiceNumber()}
                  placeholder="INV-001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoice-date">Invoice Date</Label>
                <Input
                  id="invoice-date"
                  type="date"
                  defaultValue={getCurrentDate()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="due-date">Due Date</Label>
                <Input
                  id="due-date"
                  type="date"
                  defaultValue={getDueDate()}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
            <CardDescription>Select the customer for this invoice</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{customer.name}</span>
                        <span className="text-sm text-muted-foreground">{customer.email || "No email"}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billing-address">Billing Address</Label>
                <Textarea
                  id="billing-address"
                  placeholder="Enter billing address..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-description">Project Description</Label>
                <Textarea
                  id="project-description"
                  placeholder="Brief description of the project..."
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Line Items */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Line Items
                </CardTitle>
                <CardDescription>Add services or products to your invoice</CardDescription>
              </div>
              <Button onClick={addLineItem} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Description</TableHead>
                  <TableHead className="w-[15%]">Quantity</TableHead>
                  <TableHead className="w-[20%]">Rate</TableHead>
                  <TableHead className="w-[20%]">Amount</TableHead>
                  <TableHead className="w-[5%]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lineItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input
                        placeholder="Description of service or product"
                        value={item.description}
                        onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={item.rate}
                        onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{formatCurrency(item.amount)}</div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLineItem(item.id)}
                        disabled={lineItems.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Totals */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Tax (8%):</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes and Terms */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>Notes, terms, and payment instructions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes for the customer..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="terms">Terms & Conditions</Label>
              <Textarea
                id="terms"
                placeholder="Payment terms, late fees, etc..."
                rows={3}
                defaultValue="Payment is due within 30 days of invoice date. Late payments may incur a 1.5% monthly service charge."
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <Button variant="outline" className="gap-2">
            <Save className="h-4 w-4" />
            Save as Draft
          </Button>
          <Button className="gap-2">
            <Send className="h-4 w-4" />
            Send Invoice
          </Button>
        </div>
      </div>
    </SidebarInset>
  )
} 