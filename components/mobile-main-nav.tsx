"use client";

import Link from "next/link"
import { useParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"

import { Package2, PanelLeft } from "lucide-react";
import { getRoutes } from "@/config/routes";

export function MobileMainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  const routes = getRoutes(params.businessId as string).map(route => ({
    ...route,
    active: pathname === route.href
  }));

  return (
    <Sheet>
        <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
            </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
            <nav className="grid gap-6 text-lg font-medium">
            <Link
                key="logo"
                href="#"
                className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
                <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                <span className="sr-only">Acme Inc</span>
            </Link>
            
            {routes.map((route, index) => (
              <Link
                key={route.href}
                href={route.href}
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                  <route.icon className="h-5 w-5" />
                  {route.label}
              </Link>
            ))}
            </nav>
        </SheetContent>
    </Sheet>
  )
};
