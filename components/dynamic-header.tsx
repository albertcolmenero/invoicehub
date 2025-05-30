"use client"

import { usePathname } from "next/navigation"

const sectionNames: { [key: string]: string } = {
  "/app": "Dashboard",
  "/app/invoices": "Invoices", 
  "/app/clients": "Customers",
  "/app/settings": "Settings",
}

export function DynamicHeader() {
  const pathname = usePathname()
  const sectionName = sectionNames[pathname] || "Dashboard"

  return (
    <h1 className="text-lg font-semibold">{sectionName}</h1>
  )
} 