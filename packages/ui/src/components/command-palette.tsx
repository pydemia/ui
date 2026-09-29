import {
    useEffect, useId, useState,
    type KeyboardEvent, type ReactElement,
} from "react";
import {
    Dialog, DialogContent, DialogDescription, DialogTitle,
    DialogTrigger,
} from "./dialog";
import { Input } from "./input";

type CommandPaletteItem = {
    id: string;
    label: string;
    group?: string;
    keywords?: readonly string[];
    disabled?: boolean;
};

type CommandPaletteProps = {
    commands: readonly CommandPaletteItem[];
    trigger: ReactElement;
    onSelect: (id: string) => void;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    keyboardShortcut?: boolean;
    title?: string;
    searchLabel?: string;
    placeholder?: string;
    emptyMessage?: string;
};

function CommandPalette({
    commands,
    trigger,
    onSelect,
    open,
    defaultOpen = false,
    onOpenChange,
    keyboardShortcut = false,
    title = "빠른 명령",
    searchLabel = "명령 검색",
    placeholder = "명령 검색...",
    emptyMessage = "일치하는 명령이 없습니다.",
}: CommandPaletteProps) {
    const generatedId = useId();
    const listId = `${generatedId}-commands`;
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const [query, setQuery] = useState("");
    const [activeId, setActiveId] = useState<string | null>(null);
    const isOpen = open ?? internalOpen;

    const ids = new Set<string>();
    for (const command of commands) {
        if (!command.id.trim() || /\s/.test(command.id) ||
            !command.label.trim() ||
            ids.has(command.id)) {
            throw new Error(
                "CommandPalette commands need unique IDs and labels.",
            );
        }
        ids.add(command.id);
    }

    const search = query.trim().toLocaleLowerCase();
    const filtered = commands.filter((command) =>
        [command.label, ...(command.keywords ?? [])].some((part) =>
            part.toLocaleLowerCase().includes(search),
        ),
    );
    const enabled = filtered.filter((command) => !command.disabled);
    const currentId = enabled.some((command) => command.id === activeId)
        ? activeId : enabled[0]?.id ?? null;
    const groups = new Map<string, CommandPaletteItem[]>();
    for (const command of filtered) {
        const group = command.group ?? "";
        const items = groups.get(group) ?? [];
        items.push(command);
        groups.set(group, items);
    }

    function changeOpen(next: boolean) {
        if (open === undefined) setInternalOpen(next);
        if (!next) {
            setQuery("");
            setActiveId(null);
        }
        onOpenChange?.(next);
    }

    function choose(command: CommandPaletteItem) {
        if (command.disabled) return;
        onSelect(command.id);
        changeOpen(false);
    }

    function onSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            if (enabled.length === 0) return;
            const current = enabled.findIndex((item) =>
                item.id === currentId,
            );
            const direction = event.key === "ArrowDown" ? 1 : -1;
            const next = (current + direction + enabled.length) %
                enabled.length;
            setActiveId(enabled[next].id);
        } else if (event.key === "Enter" && currentId) {
            event.preventDefault();
            const command = enabled.find((item) => item.id === currentId);
            if (command) choose(command);
        }
    }

    useEffect(() => {
        if (!keyboardShortcut) return;
        const onKeyDown = (event: globalThis.KeyboardEvent) => {
            if (!event.defaultPrevented &&
                (event.ctrlKey || event.metaKey) && !event.altKey &&
                !event.shiftKey && event.key.toLocaleLowerCase() === "k") {
                event.preventDefault();
                if (!isOpen) {
                    if (open === undefined) setInternalOpen(true);
                    onOpenChange?.(true);
                }
            }
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [isOpen, keyboardShortcut, onOpenChange, open]);

    useEffect(() => {
        if (!isOpen || !currentId) return;
        document.getElementById(`${listId}-${currentId}`)?.scrollIntoView({
            block: "nearest",
        });
    }, [currentId, isOpen, listId]);

    return (
        <Dialog open={isOpen} onOpenChange={changeOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-w-xl p-0">
                <DialogTitle className="px-4 pt-4">{title}</DialogTitle>
                <DialogDescription className="sr-only">
                    검색어를 입력하고 방향키로 명령을 고른 뒤 Enter로 실행합니다.
                </DialogDescription>
                <Input type="search" role="combobox"
                    aria-label={searchLabel}
                    aria-autocomplete="list"
                    aria-expanded={isOpen}
                    aria-controls={listId}
                    aria-activedescendant={currentId
                        ? `${listId}-${currentId}` : undefined}
                    autoComplete="off"
                    autoFocus
                    placeholder={placeholder}
                    value={query}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setActiveId(null);
                    }}
                    onKeyDown={onSearchKeyDown}
                    className="mx-4 mb-2 w-[calc(100%-2rem)]" />
                <div id={listId} role="listbox" aria-label={title}
                    className="max-h-72 overflow-y-auto border-t border-border p-2">
                    {[...groups].map(([group, items]) => (
                        <div key={group} role="group"
                            aria-label={group || "명령"}>
                            {group && <p className={
                                "m-0 px-2 pb-1 pt-2 text-xs " +
                                "font-medium text-muted"
                            }>{group}</p>}
                            {items.map((command) => (
                                <button key={command.id} type="button"
                                    id={`${listId}-${command.id}`}
                                    role="option" tabIndex={-1}
                                    aria-selected={command.id === currentId}
                                    disabled={command.disabled}
                                    onMouseEnter={() => {
                                        if (!command.disabled) {
                                            setActiveId(command.id);
                                        }
                                    }}
                                    onClick={() => choose(command)}
                                    className={
                                        "flex w-full items-center rounded-sm " +
                                        "px-2 py-2 text-left text-sm " +
                                        "text-foreground " +
                                        "aria-selected:bg-surface-subtle " +
                                        "disabled:opacity-50"
                                    }>
                                    {command.label}
                                </button>
                            ))}
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <p role="status" className="m-0 px-2 py-3 text-sm text-muted">
                            {emptyMessage}
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export { CommandPalette };
export type { CommandPaletteItem, CommandPaletteProps };
