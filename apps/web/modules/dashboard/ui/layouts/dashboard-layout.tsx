import { AuthGuard } from "@/modules/auth/ui/components/auth-guard"
import { OrginizationGuard } from "@/modules/auth/ui/components/orgnization-guard"
import { SidebarProvider } from "@workspace/ui/components/sidebar";
import { cookies } from "next/headers";
import { DashboardSidebar } from "@/modules/dashboard/ui/componets/dashboard-sidebar";
import { Provider } from "jotai";

export const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    const cookieStore = await cookies();
    //Using SIDEBAR_COOKIE_NAME from sidebar component does not work due to monorepo and SSR
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
    return (

        <AuthGuard>
            <OrginizationGuard>
                <Provider>
                    <SidebarProvider defaultOpen={defaultOpen}>
                        <DashboardSidebar></DashboardSidebar>
                        <main className="flex flex-1 flex-col">{children}</main>
                    </SidebarProvider>
                </Provider>
            </OrginizationGuard>
        </AuthGuard>

    );

};