import React from 'react';
import { Page, Text, View, StyleSheet, Document, Image } from '@react-pdf/renderer';
import { Invoice, InvoiceItem, Client, User } from '@prisma/client';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontSize: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  headerLeft: {
    flexDirection: 'column',
    width: '50%',
  },
  logo: {
    width: 120,
    height: 'auto',
    marginBottom: 20,
    objectFit: 'contain',
  },
  headerRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: '50%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2563eb', // Blue color
  },
  companyDetails: {
    marginBottom: 20,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  invoiceDetails: {
    marginBottom: 4,
  },
  invoiceNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4b5563', // Gray color
    textTransform: 'uppercase',
  },
  table: {
    flexDirection: 'column',
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  description: {
    width: '40%',
  },
  quantity: {
    width: '15%',
    textAlign: 'center',
  },
  price: {
    width: '15%',
    textAlign: 'right',
  },
  tax: {
    width: '15%',
    textAlign: 'right',
  },
  amount: {
    width: '15%',
    textAlign: 'right',
  },
  summarySection: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  summaryTable: {
    width: '40%',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 2,
    borderTopColor: '#e5e7eb',
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    color: '#6b7280',
  },
  termsSection: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
});

interface InvoicePDFProps {
  invoice: Invoice & {
    items: InvoiceItem[];
    client: Client;
  };
  user: User;
}

export const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice, user }) => {
  const formatDate = (date: Date) => {
    return format(new Date(date), 'PPP');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {user.logo && (
            <Image
              src={user.logo}
              style={styles.logo}
            />
          )}
          <Text style={styles.title}>INVOICE</Text>
          {user.companyName && (
            <View style={styles.companyDetails}>
              <Text style={styles.companyName}>{user.companyName}</Text>
              {user.address && <Text>{user.address}</Text>}
              {(user.city || user.state || user.zipCode) && (
                <Text>
                  {[user.city, user.state, user.zipCode].filter(Boolean).join(', ')}
                </Text>
              )}
              {user.country && <Text>{user.country}</Text>}
              {user.phone && <Text>Phone: {user.phone}</Text>}
            </View>
          )}
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.invoiceNumber}>#{invoice.invoiceNumber}</Text>
          <Text style={styles.invoiceDetails}>Issue Date: {formatDate(invoice.invoiceDate)}</Text>
          <Text style={styles.invoiceDetails}>Due Date: {formatDate(invoice.dueDate)}</Text>
          <Text style={styles.invoiceDetails}>Status: {invoice.status}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bill To</Text>
        <Text style={{ fontWeight: 'bold' }}>{invoice.client.name}</Text>
        {invoice.client.address && <Text>{invoice.client.address}</Text>}
        {invoice.client.city && invoice.client.state && (
          <Text>{invoice.client.city}, {invoice.client.state} {invoice.client.zip}</Text>
        )}
        {invoice.client.email && <Text>{invoice.client.email}</Text>}
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.description}>Description</Text>
          <Text style={styles.quantity}>Quantity</Text>
          <Text style={styles.price}>Price</Text>
          <Text style={styles.tax}>Tax</Text>
          <Text style={styles.amount}>Total</Text>
        </View>

        {invoice.items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.quantity}>{item.quantity}</Text>
            <Text style={styles.price}>{formatCurrency(item.unitPrice)}</Text>
            <Text style={styles.tax}>{item.tax}%</Text>
            <Text style={styles.amount}>
              {formatCurrency(item.quantity * item.unitPrice * (1 + item.tax / 100))}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.summarySection}>
        <View style={styles.summaryTable}>
          <View style={styles.summaryRow}>
            <Text>Subtotal:</Text>
            <Text>{formatCurrency(invoice.subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Tax Amount:</Text>
            <Text>{formatCurrency(invoice.taxAmount)}</Text>
          </View>
          <View style={styles.summaryTotal}>
            <Text>Total:</Text>
            <Text>{formatCurrency(invoice.total)}</Text>
          </View>
        </View>
      </View>

      {(invoice.paymentTerms || invoice.notes) && (
        <View style={styles.termsSection}>
          {invoice.paymentTerms && (
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Payment Terms</Text>
              <Text>{invoice.paymentTerms}</Text>
            </View>
          )}
          {invoice.notes && (
            <View>
              <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Notes</Text>
              <Text>{invoice.notes}</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.footer}>
        <Text>Thank you for your business!</Text>
      </View>
    </Page>
  );
}; 