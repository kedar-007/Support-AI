"use client";

import { useOrganization } from "@clerk/nextjs";
import { AuthLayout } from "../layouts/auth-layout";
import { OrgSelectionView } from "@/modules/auth/ui/views/org-selection-view";

export const OrginizationGuard = ({ children }: { children: React.ReactNode }) => {
    const { organization } = useOrganization();
    if (!organization) {
        return (
            <AuthLayout>
               <OrgSelectionView></OrgSelectionView>
            </AuthLayout>
        )
    }
    return (
        <>
            {children}
        </>
    )

}