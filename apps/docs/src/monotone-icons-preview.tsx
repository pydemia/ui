import { useState, type ReactElement } from "react";
import {
    ArrowLeftIcon, ArrowRightIcon, BellIcon, CalendarIcon, CheckIcon,
    ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon,
    CircleCheckIcon, CircleXIcon, CopyIcon, EllipsisIcon, ExternalLinkIcon,
    EyeIcon, EyeOffIcon, FileIcon, FileTextIcon, FilterIcon, FolderIcon,
    FolderOpenIcon, HelpCircleIcon, InfoIcon, LoaderIcon, LockIcon,
    MenuIcon, MinusIcon, PanelLeftIcon, PencilIcon, PlusIcon,
    RedoIcon, RefreshIcon, SearchIcon, StarIcon, TrashIcon,
    TriangleAlertIcon, UndoIcon, UploadIcon, XIcon,
    type MonotoneIconProps,
} from "@pydemia/ui";

type IconComponent = (props: MonotoneIconProps) => ReactElement;
type IconEntry = { id: string; label: string; category: string; Icon: IconComponent };

const icons: readonly IconEntry[] = [
    { id: "chevron-left", label: "계층 왼쪽", category: "탐색", Icon: ChevronLeftIcon },
    { id: "chevron-right", label: "계층 오른쪽", category: "탐색", Icon: ChevronRightIcon },
    { id: "chevron-up", label: "계층 위쪽", category: "탐색", Icon: ChevronUpIcon },
    { id: "chevron-down", label: "계층 아래쪽", category: "탐색", Icon: ChevronDownIcon },
    { id: "arrow-left", label: "왼쪽 이동", category: "탐색", Icon: ArrowLeftIcon },
    { id: "arrow-right", label: "오른쪽 이동", category: "탐색", Icon: ArrowRightIcon },
    { id: "menu", label: "메뉴", category: "탐색", Icon: MenuIcon },
    { id: "ellipsis", label: "더 보기", category: "탐색", Icon: EllipsisIcon },
    { id: "external-link", label: "외부 링크", category: "탐색", Icon: ExternalLinkIcon },
    { id: "panel-left", label: "왼쪽 패널", category: "탐색", Icon: PanelLeftIcon },
    { id: "plus", label: "추가", category: "조작", Icon: PlusIcon },
    { id: "minus", label: "제거", category: "조작", Icon: MinusIcon },
    { id: "x", label: "닫기", category: "조작", Icon: XIcon },
    { id: "check", label: "선택 확인", category: "조작", Icon: CheckIcon },
    { id: "pencil", label: "편집", category: "조작", Icon: PencilIcon },
    { id: "copy", label: "복사", category: "조작", Icon: CopyIcon },
    { id: "trash", label: "삭제", category: "조작", Icon: TrashIcon },
    { id: "refresh", label: "새로고침", category: "조작", Icon: RefreshIcon },
    { id: "undo", label: "실행 취소", category: "조작", Icon: UndoIcon },
    { id: "redo", label: "다시 실행", category: "조작", Icon: RedoIcon },
    { id: "search", label: "검색", category: "조작", Icon: SearchIcon },
    { id: "filter", label: "필터", category: "조작", Icon: FilterIcon },
    { id: "upload", label: "업로드", category: "조작", Icon: UploadIcon },
    { id: "file", label: "파일", category: "콘텐츠", Icon: FileIcon },
    { id: "file-text", label: "문서", category: "콘텐츠", Icon: FileTextIcon },
    { id: "folder", label: "폴더", category: "콘텐츠", Icon: FolderIcon },
    { id: "folder-open", label: "열린 폴더", category: "콘텐츠", Icon: FolderOpenIcon },
    { id: "calendar", label: "달력", category: "콘텐츠", Icon: CalendarIcon },
    { id: "eye", label: "보임", category: "콘텐츠", Icon: EyeIcon },
    { id: "eye-off", label: "숨김", category: "콘텐츠", Icon: EyeOffIcon },
    { id: "star", label: "별", category: "콘텐츠", Icon: StarIcon },
    { id: "bell", label: "알림", category: "콘텐츠", Icon: BellIcon },
    { id: "circle-check", label: "성공", category: "상태", Icon: CircleCheckIcon },
    { id: "triangle-alert", label: "경고", category: "상태", Icon: TriangleAlertIcon },
    { id: "circle-x", label: "오류", category: "상태", Icon: CircleXIcon },
    { id: "info", label: "정보", category: "상태", Icon: InfoIcon },
    { id: "help-circle", label: "도움말", category: "상태", Icon: HelpCircleIcon },
    { id: "lock", label: "잠금", category: "상태", Icon: LockIcon },
    { id: "loader", label: "진행 중", category: "상태", Icon: LoaderIcon },
];

export function MonotoneIconsPreview() {
    const [query, setQuery] = useState("");
    const filtered = icons.filter(({ id, label, category }) =>
        `${id} ${label} ${category}`.toLocaleLowerCase().includes(
            query.trim().toLocaleLowerCase(),
        ),
    );
    return <div className="monotone-catalog">
        <div className="monotone-catalog-header">
            <div>
                <strong>39개 아이콘 · 각 16 / 24px 도안</strong>
                <p>한 색으로 표시하고, 실제 버튼에는 행동 이름을 붙입니다.</p>
            </div>
            <input type="search" aria-label="아이콘 검색"
                placeholder="이름·뜻으로 검색" value={query}
                onChange={(event) => setQuery(event.target.value)} />
        </div>
        <p className="monotone-catalog-count" role="status">
            {filtered.length}개 표시
        </p>
        {filtered.length ? <div className="monotone-catalog-grid">
            {filtered.map(({ id, label, category, Icon }) =>
                <div className="monotone-catalog-item" key={id}>
                    <div className="monotone-catalog-glyphs" aria-hidden="true">
                        <span><Icon size={16} /></span><span><Icon size={24} /></span>
                    </div>
                    <strong>{label}</strong>
                    <code>{id}</code>
                    <small>{category}</small>
                </div>,
            )}
        </div> : <p className="monotone-catalog-empty">일치하는 아이콘이 없습니다.</p>}
        <div className="monotone-catalog-note">
            <ChevronRightIcon size={20} aria-hidden="true" />
            <ChevronDownIcon size={20} aria-hidden="true" />
            <span>트리 펼침에는 별도 20px 강조 도안을 제공합니다.</span>
        </div>
    </div>;
}
