import { useLayoutEffect, useState, type ComponentProps } from "react";
import { PrismAttitudeSection } from "./prism-profile-sections";
import { PrismPdfDialog, type PrismPdfViewerProps } from "./prism-document";
import { PrismButton } from "./prism-button";
export type PrismAttitudeReportDocument<T = PrismPdfViewerProps> = T extends unknown ? Omit<T,"title"> & { title?: string; buttonLabel?: string; width?: number } : never;
export type PrismAttitudeReportProps = Omit<ComponentProps<typeof PrismAttitudeSection>,"documentAction"> & { report?: PrismAttitudeReportDocument; subjectId?: string };
export function PrismAttitudeReport({ report, subjectId, diagnosis, ...sections }: PrismAttitudeReportProps) {
    const [open,setOpen] = useState(false);
    const available = !!report && (report.data !== undefined || !!report.url?.trim());
    useLayoutEffect(() => setOpen(false), [subjectId,report?.url,report?.data]);
    const action = available && <PrismButton variant="line" size="small" onClick={() => setOpen(true)}>{report.buttonLabel || "심리적강인함 결과 보기"}</PrismButton>;
    return <><PrismAttitudeSection {...sections} diagnosis={{ ...diagnosis, action: action || diagnosis.action }}/>
        {available && <PrismPdfDialog {...report} title={report.title || "심리적강인함 결과"} open={open} onOpenChange={setOpen}/>}
    </>;
}
