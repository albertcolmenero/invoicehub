import { 
    LayoutDashboard,      
    FileText,
    Briefcase,
    Users,
    Receipt,
    Settings
} from "lucide-react";

export type Route = {
  href: string;
  label: string;
  icon: any; // Using any for Lucide icons type
};

export const getRoutes = (businessId: string) => [
  {
    href: `/app`,
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: `/app/invoices`,
    label: 'Invoices',
    icon: Receipt,
  },
  {
    href: `/app/clients`,
    label: 'Clients',
    icon: Users,
  },
  {
    href: `/app/settings`,
    label: 'Settings',
    icon: Settings,
  },
]; 