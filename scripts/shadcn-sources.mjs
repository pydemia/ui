export function shadcnSourceRecords(provenance) {
    return provenance.items
        .filter((record) => record.source?.provider === "shadcn/ui")
        .map(({ name, source }) => ({ name, source }))
        .sort((left, right) => left.name < right.name ? -1 :
            left.name > right.name ? 1 : 0);
}
