"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useThreadMessages, toUIMessages } from "@convex-dev/agent/react";
import { useAtomValue, useSetAtom } from "jotai";
import { contactSessionIdAtomFamily, conversationIdAtom, errorMessageAtom, organizationIdAtom, screenAtom } from "@/modules/widget/atoms/widget-atoms";
import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeftIcon, MenuIcon } from "lucide-react";
import { useAction, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { AIConversation, AIConversationContent, AIConversationScrollButton } from '@workspace/ui/components/ai/conversation';
import { AIInput, AIInputSubmit, AIInputTextarea, AIInputToolbar, AIInputTools } from '@workspace/ui/components/ai/input';
import { AIMessage, AIMessageContent } from '@workspace/ui/components/ai/message';
import { Form, FormField } from "@workspace/ui/components/form";
import { useInfiniteScroll } from '@workspace/ui/hooks/use-infinite-scroll';
import { InfiniteScrollTrigger } from '@workspace/ui/components/infinite-scroll-trigger';
import { DicebearAvtar } from '../../../../../../packages/ui/src/components/dicebar-avatar';

// form Schema
const formSchema = z.object({
    message: z.string().min(1, "Message required"),
});


export const WidgetChatScreen = () => {
    const setScreen = useSetAtom(screenAtom);
    const setConversationId = useSetAtom(conversationIdAtom);
    const conversationId = useAtomValue(conversationIdAtom);
    const organizationId = useAtomValue(organizationIdAtom);
    const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ""));
    const onBack = () => {
        setConversationId(null);
        setScreen("selection");
    }


    const conversation = useQuery(api.public.conversations.getOne, conversationId && contactSessionId ? {
        conversationId,
        contactSessionId
    } : "skip");


    const messages = useThreadMessages(
        api.public.messages.getMany,
        conversation?.threadId && contactSessionId
            ? {
                threadId: conversation.threadId,
                contactSession: contactSessionId,
            }
            : "skip",
        { initialNumItems: 10 }
    );

    const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } = useInfiniteScroll({
        status: messages.status,
        loadMore: messages.loadMore,
        loadSize: 10
    })


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            message: "",
        },
    });

    //create message
    const createMessage = useAction(api.public.messages.create);
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!conversation || !contactSessionId) {
            return
        };
        form.reset();

        await createMessage({
            threadId: conversation.threadId,
            prompt: values.message,
            contactSessionId
        })
    }


    return (
        <>
            <WidgetHeader className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <Button size="icon" variant="transparent" onClick={onBack}>
                        <ArrowLeftIcon />
                    </Button>
                    <p>Chat</p>
                </div>
                <Button size="icon" variant="transparent">
                    <MenuIcon />
                </Button>
            </WidgetHeader>
            <AIConversation>
                <AIConversationContent>
                    <InfiniteScrollTrigger canLoadMore={canLoadMore}
                        isLoadingMore={isLoadingMore}
                        onLoadMore={handleLoadMore}
                        ref={topElementRef} />
                    {toUIMessages(messages?.results ?? [])
                        .filter(
                            (msg): msg is typeof msg & { role: "user" | "assistant" } =>
                                msg.role === "user" || msg.role === "assistant"
                        )
                        .map((message) => (
                            <AIMessage
                                key={message.id}
                                from={message.role === "user" ? "user" : "assistant"}
                            >
                                {/* Message bubble */}
                                <AIMessageContent>
                                    {message.parts.map((part, idx) =>
                                        part.type === "text" ? (
                                            <span key={idx}>{part.text}</span>
                                        ) : null
                                    )}
                                </AIMessageContent>

                                {/* Avatar AFTER content (THIS IS THE MAGIC) */}
                                {message.role === "assistant" && (
                                    <DicebearAvtar
                                        imageUrl="/logo.svg"
                                        seed="assistant"
                                        size={32}
                                       
                                    />
                                )}
                            </AIMessage>
                        ))}

                </AIConversationContent>
            </AIConversation>
            <Form {...form}>
                <AIInput className="rounded-none border-x-0 border-b-0" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="message"
                        disabled={conversation?.status === "resolved"}
                        render={({ field }) => (
                            <AIInputTextarea
                                {...field}
                                disabled={conversation?.status === "resolved"}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        form.handleSubmit(onSubmit)();
                                    }
                                }}
                                placeholder={
                                    conversation?.status === "resolved" ? "This conversation has been resolved." : "Type your message... "
                                }
                                value={field.value}
                            />
                        )}
                    />
                    <AIInputToolbar>
                        <AIInputTools>
                            <AIInputSubmit disabled={conversation?.status === "resolved" || !form.formState.isValid} status="ready" type="submit" />
                        </AIInputTools>
                    </AIInputToolbar>
                </AIInput>
            </Form>
        </>
    );
};