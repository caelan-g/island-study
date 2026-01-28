"use client";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { logout } from "@/lib/user/logout";
import { cn } from "@/lib/utils";
import { useSubscription } from "@/contexts/subscription-context";
import TrialCounter from "@/components/ui/trial-counter";
import InfluencerBadge from "./influencer-badge";
import { navItems } from "@/app/data/nav-items";

export function AppSidebar() {
  const { user: authUser, loading: authLoading } = useAuth();
  const { subscriptionStatus, endDate, subscriptionLoading } =
    useSubscription();
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="floating" className="text-foreground">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex flex-row justify-between">
            <a
              href="/dashboard"
              className="text-2xl font-semibold tracking-tight mx-2 mt-1 flex flex-row"
            >
              Islands.
            </a>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="default">
                    <a
                      href={item.url}
                      className={cn(
                        "flex justify-between text-foreground",
                        pathname === item.url && "font-semibold bg-muted",
                      )}
                    >
                      <div className="flex gap-2 text-md items-center">
                        <item.icon
                          strokeWidth={pathname === item.url ? "2.5" : "2"}
                          size={16}
                        />
                        <span>{item.title}</span>
                      </div>
                      {item.status === "new" && (
                        <span className="text-[0.7rem] font-semibold rounded-full bg-[var(--chart-green)]/20 border-[var(--chart-green)] border text-[var(--chart-green)] px-2 py-0.5">
                          NEW
                        </span>
                      )}
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
          {subscriptionStatus == "active" && (
            <SidebarMenuItem className="flex">
              <span className="text-xs font-semibold items-center flex rounded-full px-2 py-1 bg-[var(--chart-green)]/20 border-[var(--chart-green)] border text-[var(--chart-green)]">
                Subscribed
              </span>
            </SidebarMenuItem>
          )}
          {subscriptionStatus == "influencer" && (
            <SidebarMenuItem className="flex">
              <InfluencerBadge />
            </SidebarMenuItem>
          )}
          {authUser &&
            !authLoading &&
            !subscriptionLoading &&
            (subscriptionStatus === "trialing" ||
              subscriptionStatus === "expired") && (
              <SidebarMenuItem className="flex">
                <TrialCounter
                  subscriptionStatus={subscriptionStatus}
                  endDate={endDate}
                />
              </SidebarMenuItem>
            )}

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button className="cursor-pointer" onClick={logout}>
                <LogOut />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
            {/*<SidebarTrigger />*/}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
