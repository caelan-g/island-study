"use client";
import {
  TreePalm,
  Home,
  Table,
  GraduationCap,
  Settings,
  LogOut,
} from "lucide-react";
import { usePathname } from "next/navigation";
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

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Sessions",
    url: "/sessions",
    icon: Table,
  },
  {
    title: "Archipelago",
    url: "/archipelago",
    icon: TreePalm,
  },
  {
    title: "Courses",
    url: "/courses",
    icon: GraduationCap,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];
export function AppSidebar() {
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="2 2 20 15"
                stroke="currentColor"
                className="size-6 my-auto mr-2"
              >
                <path
                  d="m21 7.5-9-4.25L3 7.5v4l9 4.25 9-4.25z"
                  fill="#fff"
                  stroke="none"
                />
                <path
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 7.5-9-4.25L3 7.5m18 0-9 4.25m9-4.25v4l-9 4.25M3 7.5l9 4.25M3 7.5v4l9 4.25m0-4v4"
                />
              </svg>
              Islands
            </a>

            <span className="rounded-md bg-accent-foreground text-background font-bold p-2 text-xs my-auto">
              BETA
            </span>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="default">
                    <a
                      href={item.url}
                      className={cn(
                        "flex gap-2 text-foreground text-md",
                        pathname === item.url && "font-semibold bg-muted"
                      )}
                    >
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
