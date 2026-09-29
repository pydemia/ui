import type { ComponentProps } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { cn } from "./utils";

type AvatarGroupMember = {
    id: string;
    name: string;
    fallback: string;
    src?: string;
};

type AvatarGroupProps = Omit<ComponentProps<"ul">, "children"> & {
    label: string;
    members: readonly AvatarGroupMember[];
    maxVisible?: number;
    size?: "sm" | "default";
    emptyText?: string;
    overflowLabel?: string;
};

function AvatarGroup({
    label,
    members,
    maxVisible = 4,
    size = "default",
    emptyText = "No people",
    overflowLabel,
    className,
    ...props
}: AvatarGroupProps) {
    if (typeof label !== "string" || !label.trim()) {
        throw new Error("AvatarGroup requires a label.");
    }
    if (!Array.isArray(members)) {
        throw new TypeError("AvatarGroup members must be an array.");
    }
    if (!Number.isSafeInteger(maxVisible) || maxVisible < 1) {
        throw new RangeError("AvatarGroup maxVisible must be a positive integer.");
    }
    if (size !== "sm" && size !== "default") {
        throw new RangeError("AvatarGroup size is not supported.");
    }

    const ids = new Set<string>();
    for (const member of members) {
        if (!member || typeof member.id !== "string" || !member.id.trim() ||
            typeof member.name !== "string" || !member.name.trim() ||
            typeof member.fallback !== "string" || !member.fallback.trim()) {
            throw new TypeError(
                "AvatarGroup members need an id, name and fallback.",
            );
        }
        if (ids.has(member.id)) {
            throw new RangeError("AvatarGroup member ids must be unique.");
        }
        ids.add(member.id);
    }

    const visible = members.slice(0, maxVisible);
    const hidden = members.slice(maxVisible);
    const avatarSize = size === "sm" ? "size-7" : "size-9";
    const hiddenNames = hidden.map((member) => member.name).join(", ");
    const hiddenLabel = overflowLabel ??
        `${hidden.length} more people: ${hiddenNames}`;

    if (hidden.length > 0 && !hiddenLabel.trim()) {
        throw new Error("AvatarGroup overflow needs an accessible label.");
    }

    return (
        <ul
            {...props}
            role="list"
            aria-label={label}
            className={cn(
                "flex list-none items-center p-0",
                size === "sm" ? "-space-x-1.5" : "-space-x-2",
                className,
            )}
        >
            {members.length === 0 && (
                <li className="text-sm text-muted">{emptyText}</li>
            )}
            {visible.map((member) => (
                <li key={member.id} aria-label={member.name}
                    className="relative shrink-0">
                    <Avatar className={cn(
                        "ring-2 ring-surface",
                        avatarSize,
                    )}>
                        {member.src && (
                            <AvatarImage src={member.src} alt="" />
                        )}
                        <AvatarFallback aria-hidden="true">
                            {member.fallback}
                        </AvatarFallback>
                    </Avatar>
                </li>
            ))}
            {hidden.length > 0 && (
                <li aria-label={hiddenLabel} title={hiddenNames}
                    className={cn(
                        "relative flex shrink-0 items-center justify-center " +
                        "rounded-full border border-border bg-surface-subtle " +
                        "text-xs font-medium text-foreground ring-2 " +
                        "ring-surface",
                        avatarSize,
                    )}>
                    <span aria-hidden="true">+{hidden.length}</span>
                </li>
            )}
        </ul>
    );
}

export { AvatarGroup };
export type { AvatarGroupMember, AvatarGroupProps };
