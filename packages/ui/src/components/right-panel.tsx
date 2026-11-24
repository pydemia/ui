import type { ComponentProps } from "react";
import { AppSidebar } from "./app-shell";
import { cn } from "./utils";

type RightPanelProps = Omit<ComponentProps<typeof AppSidebar>, "side">;

function RightPanel({ className, appearance = "attached", ...props }: RightPanelProps) {
    return (
        <AppSidebar {...props} side="right" appearance={appearance}
            data-panel-side="right" className={cn(
                "@3xl:w-auto @5xl:w-52",
                appearance === "attached" &&
                    "border-b-0 border-t @3xl:border-l-0 @5xl:border-t-0 @5xl:border-l",
                className,
            )} />
    );
}

export { RightPanel };
export type { RightPanelProps };
