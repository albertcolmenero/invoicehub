import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InvoiceHub - Professional Invoicing Made Simple",
  description: "Create, manage, and track invoices with ease. Perfect for freelancers and small businesses.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className={`${geistSans.variable} ${geistMono.variable}`}>
      {children}
    </main>
  )
}
