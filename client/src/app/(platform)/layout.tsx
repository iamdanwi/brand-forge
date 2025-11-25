'use client';

import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { getToken, userId } = useAuth();
  const [breadcrumbLabel, setBreadcrumbLabel] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrandName = async () => {
      const segments = pathname.split('/').filter(Boolean);
      // Check if we are on /dashboard/[id]
      if (segments[0] === 'dashboard' && segments[1] && segments[1].length > 10) {
        try {
            const token = await getToken();
            if (!token) return;
            const response = await axios.get(`http://localhost:5001/api/brand/${segments[1]}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBreadcrumbLabel(response.data.brandName);
        } catch (error) {
            console.error('Failed to fetch brand name for breadcrumb');
            setBreadcrumbLabel(null);
        }
      } else {
        setBreadcrumbLabel(null);
      }
    };

    fetchBrandName();
  }, [pathname, getToken]);
  
  // Simple breadcrumb logic
  const pathSegments = pathname.split('/').filter(Boolean);
  const currentPage = pathSegments[pathSegments.length - 1];
  
  let formattedPage = currentPage ? currentPage.charAt(0).toUpperCase() + currentPage.slice(1) : 'Dashboard';
  
  // Override if we have a brand name and we are on the detail page
  if (breadcrumbLabel && pathSegments[0] === 'dashboard' && pathSegments.length === 2) {
      formattedPage = breadcrumbLabel;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">BrandForge</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{formattedPage}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
