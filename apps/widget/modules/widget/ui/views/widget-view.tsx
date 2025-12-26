"use client";

// import { WidgetFooter } from "../components/widget-footer";
// import { WidgetHeader } from "../components/widget-header";
import { WidgetAuthScreen } from "@/modules/widget/ui/screens/widget-auth-screen";

interface Props {
    orgnizationId: string;
};

export const WidgetView = ({ orgnizationId }: Props) => {
    return (
        //TODO:Confirm whether or not "min-h-screen" and "min-h-screen" is needed
        <main className=" min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
            <WidgetAuthScreen/>

            {/* <WidgetFooter /> */}
        </main>
    );
};