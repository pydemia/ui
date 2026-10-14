import { useLayoutEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import { Table, TableCell, TableHead } from "./components/ui/table";
import {
    Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle,
    DialogTrigger,
} from "./components/ui/dialog";
import {
    designModes, getDesignMode, releasedDesignModes, type DesignModeId,
} from "./components/ui/foundation/design-modes";
import {
    resolveThemeSettings, resolveThemeTokens, parseThemeUrl, writeThemeUrl,
} from "./components/ui/foundation/design-mode-settings";
import { applyThemeToElement } from "./components/ui/foundation/theme-dom";
import { ThemeScope } from "./components/ui/foundation/theme-scope";
import { PortalScope } from "./components/ui/foundation/portal-scope";
import "./style.css";

// Private QA can inspect ready modes; ordinary consumers remain release gated.
const allowUnreleased = new URL(location.href).searchParams.has("qa");
const options = { allowUnreleased };

function App() {
    const [design, setDesign] = useState<DesignModeId>("basic");
    const [draft, setDraft] = useState("Preserve this input while switching");
    const [open, setOpen] = useState(false);
    const modes = allowUnreleased ? designModes : releasedDesignModes;
    const resolved = resolveThemeSettings({
        design, appearance: "light", colormap: "forest",
    }, options);
    const settings = resolved.settings;
    const definition = getDesignMode(settings.design);
    const tokens = resolveThemeTokens(settings, options);
    const shared = writeThemeUrl(new URL(location.href), settings, options);
    const roundTrip = parseThemeUrl(shared, options);
    useLayoutEffect(() => applyThemeToElement(document.documentElement, {
        design, appearance: "dark", colormap: "design",
    }, options), [design]);

    return (
        <main className="mx-auto grid max-w-4xl gap-6 p-6">
            <h1 className="text-2xl font-semibold">Independent registry consumer</h1>
            <p>Dark root / regional Light scope. Ready modes require private ?qa.</p>
            <label className="grid gap-2">
                Design mode
                <select aria-label="Design mode" value={design}
                    className="border border-border bg-surface p-2"
                    onChange={(event) => setDesign(event.target.value as DesignModeId)}>
                    {modes.map((mode) => <option key={mode.id} value={mode.id}>
                        {mode.name} ({mode.releaseStatus})
                    </option>)}
                </select>
            </label>
            <ThemeScope settings={settings} options={options}
                className="grid gap-4 border border-border bg-background p-6">
                <h2 className="text-lg font-semibold">{definition.name} scope</h2>
                <Badge>Installed source</Badge>
                <Input aria-label="Preserved draft" value={draft}
                    onChange={(event) => setDraft(event.target.value)} />
                <Table>
                    <thead><tr><TableHead>Mode</TableHead>
                        <TableHead>Appearance</TableHead></tr></thead>
                    <tbody><tr><TableCell>{settings.design}</TableCell>
                        <TableCell>{settings.appearance}</TableCell>
                    </tr></tbody>
                </Table>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild><Button>Open scoped Dialog</Button></DialogTrigger>
                    <DialogContent>
                        <DialogTitle>Stable scoped portal</DialogTitle>
                        <DialogDescription>Change the theme without replacing the host.</DialogDescription>
                        <label className="my-4 grid gap-2">Design while open
                            <select aria-label="Dialog design mode" value={design}
                                className="border border-border bg-surface p-2"
                                onChange={(event) => setDesign(event.target.value as DesignModeId)}>
                                {modes.map((mode) => <option key={mode.id} value={mode.id}>
                                    {mode.name}
                                </option>)}
                            </select>
                        </label>
                        <Input aria-label="Dialog draft" value={draft}
                            onChange={(event) => setDraft(event.target.value)} />
                        <DialogClose asChild><Button className="mt-4">Close</Button></DialogClose>
                    </DialogContent>
                </Dialog>
                <output aria-label="Resolved theme">{JSON.stringify({
                    design: roundTrip.settings.design,
                    appearance: settings.appearance, radius: tokens["--radius"],
                    releaseStatus: definition.releaseStatus, issues: resolved.issues,
                })}</output>
            </ThemeScope>
            <PortalScope><p>PortalScope is separately installable.</p></PortalScope>
        </main>
    );
}

createRoot(document.getElementById("root")!).render(<App />);
