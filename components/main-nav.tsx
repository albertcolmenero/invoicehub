"use client";

import Link from "next/link"
import { useParams, usePathname } from "next/navigation";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"

import { cn } from "@/lib/utils"
import { Package2 } from "lucide-react";
import { getRoutes } from "@/config/routes";

export function MainNav({
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
    <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
      <Link
        href="#"
        className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
      >
        <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
        <span className="sr-only">Acme Inc</span>
      </Link>
    
      {routes.map((route) => (
        <TooltipProvider key={route.href}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={route.href}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <route.icon className="h-5 w-5" />
                <span className="sr-only">{route.label}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{route.label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </nav>
  )
};
