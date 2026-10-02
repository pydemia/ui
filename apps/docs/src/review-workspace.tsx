import { useId, useState } from "react";
import {
    ApprovalCard, Badge, DiffViewer, MasterDetail, NativeSelect,
    PageHeader, SearchInput, Thread,
    type ApprovalStatus, type ThreadComment,
} from "@pydemia/ui";

type ReviewRequest = {
    id: string;
    title: string;
    author: string;
    summary: string;
    before: string;
    after: string;
};

const requests: ReviewRequest[] = [
    {
        id: "review-21", title: "알림 보존 기간", author: "운영팀",
        summary: "알림 기록의 보존 기간을 30일로 조정합니다.",
        before: "retentionDays: 14\nnotifyOwner: true\n",
        after: "retentionDays: 30\nnotifyOwner: true\n",
    },
    {
        id: "review-22", title: "보고서 공개 범위", author: "분석팀",
        summary: "공유 보고서의 기본 공개 범위를 팀으로 제한합니다.",
        before: "defaultAudience: organization\nexportEnabled: true\n",
        after: "defaultAudience: team\nexportEnabled: true\n",
    },
    {
        id: "review-23", title: "점검 알림 주기", author: "제품팀",
        summary: "예약 점검 알림을 하루 전에 발송합니다.",
        before: "reminderHours: 2\nchannel: email\n",
        after: "reminderHours: 24\nchannel: email\n",
    },
];

const initialStatus: Record<string, ApprovalStatus> = {
    "review-21": "requested",
    "review-22": "requested",
    "review-23": "approved",
};

const statusText: Record<ApprovalStatus, string> = {
    requested: "검토 대기",
    approved: "승인됨",
    rejected: "거절됨",
    expired: "만료됨",
};

const initialComments: Record<string, ThreadComment[]> = {
    "review-21": [
        { id: "comment-1", parentId: null, author: "민지",
            content: "보존 기간 변경이 운영 화면에도 반영되나요?",
            createdAt: "2026-10-01" },
        { id: "comment-2", parentId: "comment-1", author: "도윤",
            content: "설정 화면의 설명도 함께 수정합니다.",
            createdAt: "2026-10-02" },
    ],
    "review-22": [
        { id: "comment-3", parentId: null, author: "서연",
            content: "기존 공개 보고서에는 소급 적용하지 않습니다.",
            createdAt: "2026-10-01" },
    ],
    "review-23": [],
};

function ReviewWorkspace() {
    const statusFilterId = useId();
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedId, setSelectedId] = useState<string | null>(
        "review-21",
    );
    const [statuses, setStatuses] = useState(initialStatus);
    const [comments, setComments] = useState(initialComments);
    const [nextCommentId, setNextCommentId] = useState(4);
    const visibleRequests = requests.filter((request) => {
        const matchesQuery = `${request.title} ${request.author} ` +
            request.summary;
        return matchesQuery.toLowerCase().includes(
            query.trim().toLowerCase(),
        ) && (statusFilter === "all" ||
            statuses[request.id] === statusFilter);
    });

    function addReply(requestId: string, parentId: string | null,
        content: string) {
        const id = `comment-${nextCommentId}`;
        setNextCommentId((current) => current + 1);
        setComments((current) => ({
            ...current,
            [requestId]: [...(current[requestId] ?? []), {
                id, parentId, content, author: "나",
                createdAt: new Date().toISOString().slice(0, 10),
            }],
        }));
    }

    return (
        <div className="min-w-0 space-y-4 p-[var(--space-4)]">
            <PageHeader level={2} size="compact" title="변경 요청 검토"
                subtitle="변경 내용을 비교하고 의견과 결정을 남깁니다." />
            <div className="flex min-w-0 flex-wrap items-end gap-3">
                <SearchInput label="검토 요청 검색" value={query}
                    onValueChange={setQuery} onSearch={setQuery}
                    placeholder="제목 또는 담당 팀"
                    variant="toolbar" className="min-w-48 flex-1" />
                <div className="grid min-w-40 gap-2">
                    <label htmlFor={statusFilterId} className="text-sm">
                        상태
                    </label>
                    <NativeSelect id={statusFilterId} value={statusFilter}
                        onChange={(event) => setStatusFilter(
                            event.target.value,
                        )}>
                        <option value="all">모든 상태</option>
                        <option value="requested">검토 대기</option>
                        <option value="approved">승인됨</option>
                        <option value="rejected">거절됨</option>
                    </NativeSelect>
                </div>
            </div>
            <MasterDetail label="변경 요청"
                items={visibleRequests.map((request) => ({
                    id: request.id,
                    title: request.title,
                    description: request.summary,
                    meta: `${request.author} · ${statusText[
                        statuses[request.id]
                    ]}`,
                }))}
                selectedId={selectedId}
                onSelectedIdChange={setSelectedId}
                emptyList="검색 결과가 없습니다."
                emptyDetail="검토할 요청을 선택하세요."
                renderDetail={(item) => {
                    const request = requests.find((entry) =>
                        entry.id === item.id);
                    if (!request) {
                        throw new Error("Unknown review request.");
                    }
                    return (
                        <div key={request.id}
                            className="min-w-0 space-y-5">
                            <div className={
                                "flex flex-wrap items-center " +
                                "justify-between gap-2"
                            }>
                                <h3 className="m-0 text-base font-semibold">
                                    {request.title}
                                </h3>
                                <Badge>{statusText[statuses[request.id]]}</Badge>
                            </div>
                            <p className="m-0 text-sm text-muted">
                                {request.summary}
                            </p>
                            <DiffViewer label={`${request.title} 변경 내용`}
                                before={request.before} after={request.after} />
                            <Thread label="검토 의견"
                                comments={comments[request.id] ?? []}
                                onReply={(parentId, content) => addReply(
                                    request.id, parentId, content,
                                )} />
                            <ApprovalCard
                                requestId={request.id}
                                title={`${request.title} 결정`}
                                description={request.summary}
                                status={statuses[request.id]}
                                onDecision={(decision) => setStatuses(
                                    (current) => ({
                                        ...current,
                                        [request.id]: decision === "approve"
                                            ? "approved" : "rejected",
                                    }),
                                )} />
                        </div>
                    );
                }} />
            <p className="m-0 text-xs text-muted">
                예시 데이터입니다. 의견과 결정은 이 화면에서만 유지됩니다.
            </p>
        </div>
    );
}

export { ReviewWorkspace };
