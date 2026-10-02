import { useEffect, useId, useRef, useState } from "react";
import { Combobox } from "./combobox";
import { cn } from "./utils";

type ModelChoice = {
    id: string;
    label: string;
    provider: string;
    description: string;
    capabilities?: readonly string[];
    costLabel?: string;
    disabledReason?: string;
};

type ModelSelectorProps = {
    label: string;
    name: string;
    models: readonly ModelChoice[];
    value?: string | null;
    defaultValue?: string | null;
    onValueChange?: (value: string | null) => void;
    variant?: "panel" | "compact";
    required?: boolean;
    disabled?: boolean;
    loading?: boolean;
    errorMessage?: string | null;
    className?: string;
};

function ModelSelector({
    label, name, models, value, defaultValue = null, onValueChange,
    variant = "panel", required = false, disabled = false,
    loading = false, errorMessage = null, className,
}: ModelSelectorProps) {
    const inputId = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const [internalValue, setInternalValue] = useState<string | null>(
        defaultValue,
    );
    const [resetKey, setResetKey] = useState(0);
    const selectedId = value === undefined ? internalValue : value;

    useEffect(() => {
        if (value !== undefined) return;
        const form = containerRef.current?.querySelector<HTMLInputElement>(
            'input[type="hidden"]',
        )?.form;
        const reset = () => {
            setInternalValue(defaultValue);
            setResetKey((current) => current + 1);
        };
        form?.addEventListener("reset", reset);
        return () => form?.removeEventListener("reset", reset);
    }, [defaultValue, value]);

    if (typeof label !== "string" || !label.trim() ||
        typeof name !== "string" || !name.trim()) {
        throw new Error("ModelSelector requires a label and form name.");
    }
    if (!Array.isArray(models)) {
        throw new Error("ModelSelector requires a model list.");
    }
    if (variant !== "panel" && variant !== "compact") {
        throw new Error("ModelSelector variant is not supported.");
    }
    if (loading && errorMessage) {
        throw new Error("ModelSelector cannot load and show an error together.");
    }
    const ids = new Set<string>();
    for (const model of models) {
        if (!model || typeof model.id !== "string" || !model.id.trim() ||
            ids.has(model.id) || typeof model.label !== "string" ||
            !model.label.trim() || typeof model.provider !== "string" ||
            !model.provider.trim() ||
            typeof model.description !== "string" ||
            !model.description.trim() ||
            (model.costLabel !== undefined &&
                (typeof model.costLabel !== "string" ||
                    !model.costLabel.trim())) ||
            (model.disabledReason !== undefined &&
                (typeof model.disabledReason !== "string" ||
                    !model.disabledReason.trim())) ||
            (model.capabilities !== undefined &&
                (!Array.isArray(model.capabilities) ||
                    model.capabilities.some((capability: unknown) =>
                        typeof capability !== "string" ||
                        !capability.trim()) ||
                    new Set(model.capabilities).size !==
                        model.capabilities.length))) {
            throw new Error(
                "ModelSelector models need unique IDs, names, providers, " +
                "descriptions, and valid metadata.",
            );
        }
        ids.add(model.id);
    }
    if (selectedId !== null && !ids.has(selectedId) &&
        !loading && !errorMessage) {
        throw new Error("ModelSelector value must match a model.");
    }

    const selected = models.find((model) => model.id === selectedId);
    const availableValue = selected && !selected.disabledReason
        ? selectedId : null;
    const options = models.map((model) => ({
        value: model.id,
        label: `${model.provider} · ${model.label}` +
            (model.disabledReason ? " · 사용 불가" : ""),
        disabled: model.disabledReason !== undefined,
    }));
    const noAvailableModel = !loading && !errorMessage &&
        models.every((model) => model.disabledReason !== undefined);

    function changeValue(next: string | null) {
        if (value === undefined) setInternalValue(next);
        if (next !== selectedId) onValueChange?.(next);
    }

    return (
        <div ref={containerRef}
            className={cn("grid min-w-0 gap-2", className)}>
            <label htmlFor={inputId}
                className="text-sm font-medium text-foreground">
                {label}
            </label>
            <Combobox key={resetKey} id={inputId} name={name} options={options}
                value={availableValue} onValueChange={changeValue}
                required={required} disabled={disabled} loading={loading}
                errorMessage={errorMessage}
                placeholder="모델을 검색하거나 선택하세요"
                emptyMessage="일치하는 모델이 없습니다." />
            {loading && <p role="status" className="m-0 text-xs text-muted">
                모델을 불러오는 중입니다.
            </p>}
            {errorMessage && <p role="alert"
                className="m-0 text-xs text-danger">{errorMessage}</p>}
            {noAvailableModel && <p role="status"
                className="m-0 text-xs text-muted">
                현재 선택 가능한 모델이 없습니다.
            </p>}
            {selected?.disabledReason && <p role="alert"
                className="m-0 text-xs text-danger">
                {selected.label}: {selected.disabledReason}
            </p>}
            {selected && !selected.disabledReason && (
                variant === "compact" ? (
                    <p className="m-0 text-xs text-muted">
                        {selected.provider}
                        {selected.costLabel && ` · ${selected.costLabel}`}
                    </p>
                ) : (
                    <section aria-label={`${selected.label} 모델 정보`}
                        className={
                            "grid gap-2 rounded-sm border border-border " +
                            "bg-surface-subtle p-[var(--space-3)] text-sm"
                        }>
                        <div className="flex flex-wrap justify-between gap-2">
                            <strong>{selected.label}</strong>
                            <span className="text-muted">
                                {selected.provider}
                            </span>
                        </div>
                        <p className="m-0 text-muted">
                            {selected.description}
                        </p>
                        {selected.capabilities &&
                            selected.capabilities.length > 0 && (
                            <ul aria-label="지원 기능"
                                className="m-0 flex list-none flex-wrap gap-1 p-0">
                                {selected.capabilities.map((capability: string) => (
                                    <li key={capability}
                                        className={
                                            "rounded-sm border border-border " +
                                            "bg-surface px-2 py-0.5 text-xs"
                                        }>{capability}</li>
                                ))}
                            </ul>
                        )}
                        {selected.costLabel && <p
                            className="m-0 text-xs text-muted">
                            사용량: {selected.costLabel}
                        </p>}
                    </section>
                )
            )}
        </div>
    );
}

export { ModelSelector };
export type { ModelChoice, ModelSelectorProps };
