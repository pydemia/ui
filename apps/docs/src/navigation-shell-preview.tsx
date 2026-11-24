import { useId, useState } from "react";
import {
    BottomNav, BottomNavLink, Button, FooterNav, FooterNavLink,
    GlobalNav, GlobalNavLink, LocalNav, LocalNavLink, NavigationShell, Sidebar,
} from "@pydemia/ui";

const products = [
    { name: "Projects", places: ["전체 작업", "프로젝트", "테스트"], detail: "상태 · 진행 중", list: "검토 대기 작업 3건", activity: "오늘 완료 2건" },
    { name: "Note", places: ["모든 페이지", "즐겨찾기", "최근 문서"], detail: "형식 · Markdown", list: "제품 회의 기록과 릴리스 메모", activity: "오늘 문서 2개 수정" },
    { name: "Skills Hub", places: ["작업공간", "Skills", "Prompts"], detail: "설치 · Registry", list: "즐겨찾는 스킬 4개", activity: "스킬 1개 업데이트" },
] as const;
const views = ["목록", "최근 활동"] as const;

export function NavigationShellPreview() {
    const [productIndex, setProductIndex] = useState(0);
    const [placeIndex, setPlaceIndex] = useState(0);
    const [view, setView] = useState<(typeof views)[number]>("목록");
    const [detailsOpen, setDetailsOpen] = useState(true);
    const id = useId();
    const product = products[productIndex]!;
    const href = `#${id}-main`;

    return (
        <div className="grid gap-3">
            <nav aria-label="개별 탐색 컴포넌트" className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <a href="?component=global-nav#components">GNB</a>
                <a href="?component=sidebar#components">왼쪽 SNB</a>
                <a href="?component=local-nav#components">LNB</a>
                <a href="?component=right-panel#components">오른쪽 패널</a>
                <a href="?component=footer-nav#components">FNB</a>
            </nav>
            <NavigationShell mainProps={{ as: "div", id: `${id}-main` }}
                globalNav={<>
                    <GlobalNav aria-label="앱 선택" className="max-w-full">
                        {products.map(({ name }, index) => (
                            <GlobalNavLink key={name} href={href}
                                className="whitespace-nowrap"
                                aria-current={index === productIndex ? "page" : undefined}
                                onClick={event => {
                                    event.preventDefault();
                                    setProductIndex(index);
                                    setPlaceIndex(0);
                                    setView("목록");
                                }}>{name}</GlobalNavLink>
                        ))}
                    </GlobalNav>
                    <Button className="ml-auto shrink-0" variant="ghost"
                        aria-expanded={detailsOpen} aria-controls={`${id}-details`}
                        onClick={() => setDetailsOpen(open => !open)}>상세 정보</Button>
                </>}
                sideNav={<Sidebar label={`${product.name} 탐색`}
                    resizeStorageKey="pydemia-ui:navigation-shell:width"
                    items={product.places.map((label, index) => ({
                        id: String(index), label, href, current: index === placeIndex,
                    }))}
                    onNavigate={value => setPlaceIndex(Number(value))} />}
                localNav={<LocalNav aria-label="현재 화면 보기">
                    {views.map(label => <LocalNavLink key={label} href={href}
                        aria-current={view === label ? "page" : undefined}
                        onClick={event => { event.preventDefault(); setView(label); }}>
                        {label}
                    </LocalNavLink>)}
                </LocalNav>}
                rightPanel={{
                    id: `${id}-details`, "aria-label": "상세 정보", hidden: !detailsOpen,

                    children: <>
                        <h3 className="m-0 text-sm font-semibold">상세 정보</h3>
                        <p className="mb-0 mt-2 text-sm text-muted">{product.detail}</p>
                    </>,
                }}
                mobileNav={<BottomNav aria-label="모바일 주요 탐색">
                    {product.places.map((label, index) => <BottomNavLink key={label}
                        href={href} label={label} aria-current={index === placeIndex ? "page" : undefined}
                        onClick={event => { event.preventDefault(); setPlaceIndex(index); }} />)}
                </BottomNav>}
                footerNav={<FooterNav aria-label="이용 안내">
                    <FooterNavLink href="?component=app-shell#components">레이아웃 사용법</FooterNavLink>
                    <FooterNavLink href="?component=sidebar#components">사이드바 사용법</FooterNavLink>
                </FooterNav>}
            >
                <h3 className="m-0 text-base font-semibold">{product.places[placeIndex]}</h3>
                <div className="mt-3 min-h-40 rounded-sm border border-border bg-surface p-3">
                    {view === "목록" ? product.list : product.activity}
                </div>
            </NavigationShell>
        </div>
    );
}
