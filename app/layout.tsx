import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { ClerkProvider } from '@clerk/nextjs';
import { AtlasClientProvider } from "@/components/atlas-provider";

export const metadata: Metadata = {
  title: "InvoiceHub",
  description: "Professional Invoicing Made Simple",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <AtlasClientProvider>
      <html lang="en" suppressHydrationWarning>
      
      <body className="antialiased">
        
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        
      </body>
    </html>
    </AtlasClientProvider>
    </ClerkProvider>
  )
}
