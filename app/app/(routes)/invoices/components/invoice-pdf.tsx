import React from 'react';
import { Page, Text, View, StyleSheet, Document } from '@react-pdf/renderer';
import { Invoice, InvoiceItem, Client, User } from '@prisma/client';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  header: {
    marginBottom: 20,
    borderBottom: 1,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    height: 24,
    fontStyle: 'bold',
  },
  description: {
    width: '60%',
  },
  amount: {
    width: '15%',
    textAlign: 'right',
  },
  total: {
    marginTop: 20,
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    color: '#666',
  },
  companyDetails: {
    marginBottom: 20,
    fontSize: 12,
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

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>INVOICE</Text>
        {user.companyName && (
          <View style={styles.companyDetails}>
            <Text style={{ fontWeight: 'bold' }}>{user.companyName}</Text>
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
        <Text>Invoice Number: {invoice.invoiceNumber}</Text>
        <Text>Date: {formatDate(invoice.invoiceDate)}</Text>
        <Text>Due Date: {formatDate(invoice.dueDate)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>Bill To:</Text>
        <Text>{invoice.client.name}</Text>
        {invoice.client.address && <Text>{invoice.client.address}</Text>}
        {invoice.client.city && invoice.client.state && (
          <Text>{invoice.client.city}, {invoice.client.state} {invoice.client.zip}</Text>
        )}
        {invoice.client.email && <Text>{invoice.client.email}</Text>}
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.description}>Description</Text>
          <Text style={styles.amount}>Qty</Text>
          <Text style={styles.amount}>Price</Text>
          <Text style={styles.amount}>Tax</Text>
          <Text style={styles.amount}>Total</Text>
        </View>

        {invoice.items.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.amount}>{item.quantity}</Text>
            <Text style={styles.amount}>${item.unitPrice.toFixed(2)}</Text>
            <Text style={styles.amount}>{item.tax}%</Text>
            <Text style={styles.amount}>
              ${(item.quantity * item.unitPrice * (1 + item.tax / 100)).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      <View style={[styles.section, { alignItems: 'flex-end' }]}>
        <Text>Subtotal: ${invoice.subtotal.toFixed(2)}</Text>
        <Text>Tax Amount: ${invoice.taxAmount.toFixed(2)}</Text>
        <Text style={styles.total}>Total: ${invoice.total.toFixed(2)}</Text>
      </View>

      {(invoice.paymentTerms || invoice.notes) && (
        <View style={styles.section}>
          {invoice.paymentTerms && (
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>Payment Terms:</Text>
              <Text>{invoice.paymentTerms}</Text>
            </View>
          )}
          {invoice.notes && (
            <View>
              <Text style={{ fontWeight: 'bold' }}>Notes:</Text>
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