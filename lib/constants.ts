export enum InvoiceStatus {
  DRAFT = "DRAFT",
  SENT = "SENT",
  PAID = "PAID",
}

export const INVOICE_STATUS_OPTIONS = [
  {
    label: "Draft",
    value: InvoiceStatus.DRAFT,
  },
  {
    label: "Sent",
    value: InvoiceStatus.SENT,
  },
  {
    label: "Paid",
    value: InvoiceStatus.PAID,
  },
]; 