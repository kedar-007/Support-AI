import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@workspace/ui/components/form";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { platform } from "os";
import { Doc } from "@workspace/backend/_generated/dataModel";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
});

//Tempory test orgnizationId , before we add the state management
const orgnizationId = "123";

export const WidgetAuthScreen = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
        },
    });
    const createContactSession = useMutation(api.public.contactSessions.create);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!orgnizationId) {
            return;
        }

        const metadata :Doc<"contactSessions">["metadata"] ={
                userAgent: navigator.userAgent,
                language: navigator.language,
                languages: navigator.languages?.join(","),
                platform: navigator.platform,
                vendor: navigator.vendor,
                screenResolution: `${window.screen.width}x${window.screen.height}`,
                viewportSize: `${window.innerWidth}x${window.innerHeight}`,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                timezoneOffset:new Date().getTimezoneOffset(),
                cookieEnabled:navigator.cookieEnabled,
                referer:document.referrer || "direct",
                currentUrl:window.location.href,
            }

        const contactSessionId = await createContactSession({
            ...values,
            orgnizationId,
            metadata,
        })

        console.log("ContactSession Id",contactSessionId);
    };

    return (
        <>
            <WidgetHeader>
                <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
                    <p className="text-3xl">Hi there! 👋</p>
                    <p className="text-lg">Let&apos;s get you started</p>
                </div>
            </WidgetHeader>

            <Form {...form}>
                <form
                    className="flex flex-1 flex-col gap-y-4 p-4"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    {/* NAME */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        className="h-10 bg-background"
                                        placeholder="e.g John Doe"
                                        type="text"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        className="h-10 bg-background"
                                        placeholder="e.g johndoe@example.com"
                                        type="email"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        disabled={form.formState.isSubmitting}
                        size="lg"
                        type="submit"
                    >
                        Continue
                    </Button>
                </form>
            </Form>
        </>
    );
};
