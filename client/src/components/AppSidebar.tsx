'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  Sparkles, 
  Image as ImageIcon, 
  Settings, 
  LogOut,
  Plus,
  History
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

export function AppSidebar() {
  const pathname = usePathname();

  const items = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Campaigns',
      url: '/campaigns',
      icon: Sparkles,
    },
    {
      title: 'Analyses',
      url: '/analyses',
      icon: History,
    },
    {
      title: 'Image Studio',
      url: '/studio',
      icon: ImageIcon,
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings,
    },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-sidebar transition-all duration-300">
      <SidebarHeader className="h-16 flex items-center px-4 group-data-[collapsible=icon]:!px-2">
        <div className="flex items-center gap-2 w-full">
          <div className="h-8 w-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center shrink-0">
            <span className="font-bold text-lg">B</span>
          </div>
          <span className="font-medium text-lg text-foreground hidden lg:block group-data-[collapsible=icon]:hidden">
            BrandForge
          </span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2 py-4">
        {/* FAB - Floating Action Button */}
        <div className="mb-6 px-2">
            <Link href="/analyze">
                <Button className="w-full h-10 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all flex items-center justify-center gap-2 group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:p-0">
                    <Plus className="h-4 w-4" />
                    <span className="hidden lg:inline font-medium text-sm group-data-[collapsible=icon]:hidden">New Analysis</span>
                </Button>
            </Link>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map((item) => {
                const isActive = pathname === item.url || pathname.startsWith(item.url + '/');
                return (
                    <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                        asChild 
                        className={`
                            h-10 rounded-lg px-3 justify-start group-data-[collapsible=icon]:!justify-center transition-colors duration-200
                            ${isActive 
                                ? 'bg-secondary text-secondary-foreground font-medium' 
                                : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                            }
                        `}
                    >
                        <Link href={item.url} className="flex items-center gap-3">
                        <item.icon className={`h-4 w-4 ${isActive ? 'text-foreground' : ''}`} />
                        <span className="hidden lg:inline text-sm group-data-[collapsible=icon]:hidden">{item.title}</span>
                        </Link>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 overflow-hidden p-2 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
            <UserButton afterSignOutUrl="/" />
            <div className="flex flex-col hidden lg:flex group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium text-foreground">My Account</span>
            </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
