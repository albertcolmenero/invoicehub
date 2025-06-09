"use client"

import { BarChart3, ChevronUp, FileText, Home, Settings, User, Users, CreditCard, UserCog } from "lucide-react"
import { usePathname } from "next/navigation"
import { useUser, SignOutButton } from "@clerk/nextjs"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/ui/sidebar"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const items = [
  {
    title: "Dashboard",
    url: "/app",
    icon: Home,
  },    
  {
    title: "Invoices",
    url: "/app/invoices",
    icon: FileText,
  },
  {
    title: "Customers",
    url: "/app/clients",
    icon: Users,
  },
  {
    title: "Pricing",
    url: "/app/pricing",
    icon: CreditCard,
  },
  {
    title: "Customer Portal",
    url: "/app/customer-portal",
    icon: UserCog,
  },
  {
    title: "Settings",
    url: "/app/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useUser()
  
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <BarChart3 className="h-6 w-6" />
          <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">InvoiceApp</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user?.imageUrl} alt={user?.fullName || ""} />
                    <AvatarFallback className="rounded-lg">
                      {user?.firstName?.charAt(0) || user?.fullName?.charAt(0) || <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.fullName || user?.firstName || "User"}</span>
                    <span className="truncate text-xs">{user?.primaryEmailAddress?.emailAddress || ""}</span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <SignOutButton>
                    <span className="w-full text-left cursor-pointer">Log out</span>
                  </SignOutButton>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
