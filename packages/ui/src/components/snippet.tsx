import type { ComponentProps } from "react";
import { CopyButton } from "./copy-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { cn } from "./utils";

function Snippet({ className, ...props }: ComponentProps<typeof Tabs>) {
    return (
        <Tabs
            className={cn("overflow-hidden rounded-sm border border-border bg-surface", className)}
            {...props}
        />
    );
}

function SnippetHeader({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cn("flex items-center justify-between gap-2 border-b border-border bg-surface-subtle px-2 py-1", className)}
            {...props}
        />
    );
}

function SnippetCopyButton({ value }: { value: string }) {
    return <CopyButton value={value} label="현재 코드 복사" />;
}

function SnippetContent({ className, children, ...props }: ComponentProps<typeof TabsContent>) {
    return (
        <TabsContent className={cn("m-0", className)} {...props}>
            <pre tabIndex={0} className="overflow-x-auto p-[var(--space-4)] text-xs leading-6"><code>{children}</code></pre>
        </TabsContent>
    );
}

export {
    Snippet,
    SnippetHeader,
    SnippetCopyButton,
    SnippetContent,
    TabsList as SnippetTabsList,
    TabsTrigger as SnippetTabsTrigger,
};
