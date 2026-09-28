import { useId, useState, type ComponentProps } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "./button";
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
    const statusId = useId();
    const [feedback, setFeedback] = useState<{ value: string; message: string } | null>(null);
    const message = feedback?.value === value ? feedback.message : "";

    async function copy() {
        try {
            await navigator.clipboard.writeText(value);
            setFeedback({ value, message: "복사되었습니다" });
        } catch {
            setFeedback({ value, message: "복사하지 못했습니다" });
        }
    }

    return (
        <div className="flex items-center gap-2">
            <span id={statusId} className="text-xs text-muted" role="status">
                {message}
            </span>
            <Button
                variant="ghost"
                size="icon"
                aria-label="현재 코드 복사"
                aria-describedby={message ? statusId : undefined}
                onClick={copy}
            >
                {message === "복사되었습니다" ? <Check aria-hidden size={16} /> : <Copy aria-hidden size={16} />}
            </Button>
        </div>
    );
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
