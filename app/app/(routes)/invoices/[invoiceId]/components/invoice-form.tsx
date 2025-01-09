"use client"

import React from "react";
import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { toast } from "sonner"
import { Trash, Plus, Share2, Eye, Clock } from "lucide-react"
import { Invoice, Client, InvoiceItem } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"
  
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"

const formSchema = z.object({
  clientId: z.string().min(1),
  invoiceNumber: z.string().min(1),
  invoiceDate: z.date(),
  dueDate: z.date(),
  status: z.string().min(1),
  items: z.array(z.object({
    description: z.string().min(1),
    quantity: z.number().min(0),
    unitPrice: z.number().min(0),
    tax: z.number().min(0),
  })),
  subtotal: z.number().min(0),
  taxRate: z.number().min(0),
  taxAmount: z.number().min(0),
  total: z.number().min(0),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
});

type InvoiceFormValues = z.infer<typeof formSchema>

interface InvoiceFormProps {
  initialData: (Invoice & { items: InvoiceItem[] }) | null;
  clients: Client[];
};

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  initialData,
  clients
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shareableLink, setShareableLink] = useState<string | null>(initialData?.shareableLink || null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const title = initialData ? 'Edit Invoice' : 'Create Invoice';
  const description = initialData ? 'Edit an invoice.' : 'Create a new invoice';
  const toastMessage = initialData ? 'Invoice updated.' : 'Invoice created.';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultDate = new Date();
  defaultDate.setHours(0, 0, 0, 0);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      clientId: initialData.clientId,
      invoiceNumber: initialData.invoiceNumber,
      invoiceDate: new Date(initialData.invoiceDate),
      dueDate: new Date(initialData.dueDate),
      status: initialData.status,
      items: initialData.items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        tax: item.tax,
      })),
      subtotal: initialData.subtotal,
      taxRate: initialData.taxRate,
      taxAmount: initialData.taxAmount,
      total: initialData.total,
      paymentTerms: initialData.paymentTerms || '',
      notes: initialData.notes || '',
    } : {
      clientId: '',
      invoiceNumber: '',
      invoiceDate: defaultDate,
      dueDate: defaultDate,
      status: 'DRAFT',
      items: [{
        description: '',
        quantity: 1,
        unitPrice: 0,
        tax: 0,
      }],
      subtotal: 0,
      taxRate: 0,
      taxAmount: 0,
      total: 0,
      paymentTerms: '',
      notes: '',
    }
  });

  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control,
  });

  const calculateTotals = React.useCallback((data: any) => {
    if (!data?.items) return;

    const subtotal = data.items.reduce((sum: number, item: any) => {
      const quantity = parseFloat(item?.quantity) || 0;
      const unitPrice = parseFloat(item?.unitPrice) || 0;
      return sum + (quantity * unitPrice);
    }, 0);

    const taxAmount = data.items.reduce((sum: number, item: any) => {
      const quantity = parseFloat(item?.quantity) || 0;
      const unitPrice = parseFloat(item?.unitPrice) || 0;
      const tax = parseFloat(item?.tax) || 0;
      return sum + (quantity * unitPrice * (tax / 100));
    }, 0);

    const total = subtotal + taxAmount;

    form.setValue("subtotal", subtotal, { shouldValidate: true });
    form.setValue("taxAmount", taxAmount, { shouldValidate: true });
    form.setValue("total", total, { shouldValidate: true });
  }, [form]);

  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      // Only recalculate if an item field changed
      if (name && (name.startsWith('items.') || name === 'items')) {
        calculateTotals(value);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, calculateTotals]);

  const onSubmit = async (data: InvoiceFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/invoices/${params.invoiceId}`, data);
      } else {
        await axios.post('/api/invoices', data);
      }
      router.refresh();
      router.push(`/app/invoices`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/invoices/${params.invoiceId}`);
      router.refresh();
      router.push(`/invoices`);
      toast.success('Invoice deleted.');
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  const onShare = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/invoices/${params.invoiceId}/share`);
      const { shareableLink } = response.data;
      setShareableLink(shareableLink);
      
      // Create the full URL
      const fullUrl = `${window.location.origin}/api/public/invoices/${shareableLink}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(fullUrl);
      setCopySuccess(true);
      toast.success("Link copied to clipboard!");
      
      setTimeout(() => {
        setCopySuccess(false);
      }, 3000);
    } catch (error) {
      toast.error("Failed to generate shareable link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal 
        isOpen={open} 
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <div className="flex items-center gap-x-2">
            <Button
              disabled={loading}
              variant="outline"
              size="sm"
              onClick={() => window.open(`/api/invoices/${initialData.id}/pdf`, '_blank')}
            >
              Download PDF
            </Button>
            <Button
              disabled={loading}
              variant="outline"
              size="sm"
              onClick={onShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              {shareableLink ? (copySuccess ? "Copied!" : "Copy Link") : "Share"}
            </Button>
            <Button
              disabled={loading}
              variant="destructive"
              size="sm"
              onClick={() => setOpen(true)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <Separator />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <Select 
                    disabled={loading} 
                    onValueChange={field.onChange} 
                    value={field.value} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a client" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="invoiceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Number</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="INV-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="invoiceDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Invoice Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {mounted && field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {mounted && field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    disabled={loading} 
                    onValueChange={field.onChange} 
                    value={field.value} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="SENT">Sent</SelectItem>
                      <SelectItem value="PAID">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Invoice Items</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({
                  description: '',
                  quantity: 1,
                  unitPrice: 0,
                  tax: 0,
                })}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-4">
                <FormField
                  control={form.control}
                  name={`items.${index}.description`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem className="w-[100px]">
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.unitPrice`}
                  render={({ field }) => (
                    <FormItem className="w-[150px]">
                      <FormLabel>Unit Price</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.tax`}
                  render={({ field }) => (
                    <FormItem className="w-[100px]">
                      <FormLabel>Tax %</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="paymentTerms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Terms</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4 mt-6">
            <div className="flex justify-end gap-x-2">
              <span className="text-sm">Subtotal:</span>
              <span className="text-sm font-semibold">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(form.watch('subtotal'))}
              </span>
            </div>
            <div className="flex justify-end gap-x-2">
              <span className="text-sm">Tax Amount:</span>
              <span className="text-sm font-semibold">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(form.watch('taxAmount'))}
              </span>
            </div>
            <div className="flex justify-end gap-x-2">
              <span className="text-sm">Total:</span>
              <span className="text-sm font-semibold">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(form.watch('total'))}
              </span>
            </div>
          </div>

          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
      {initialData?.shareableLink && (
        <div className="bg-slate-100 rounded-md p-4 mt-4">
          <div className="font-medium flex items-center">
            <Share2 className="h-4 w-4 mr-2" />
            Shareable Link Activity
          </div>
          <div className="mt-2 space-y-2 text-sm">
            <div className="flex items-center text-muted-foreground">
              <Eye className="h-4 w-4 mr-2" />
              {initialData.viewCount} {initialData.viewCount === 1 ? 'view' : 'views'}
            </div>
            {initialData.lastViewed && (
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                Last viewed {formatDistanceToNow(new Date(initialData.lastViewed), { addSuffix: true })}
              </div>
            )}
            <div className="flex items-center">
              <input 
                type="text" 
                value={`${window.location.origin}/api/public/invoices/${initialData.shareableLink}`}
                readOnly
                className="flex-1 bg-white border rounded-l-md px-3 py-2 text-sm"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="rounded-l-none"
                onClick={onShare}
              >
                {copySuccess ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 