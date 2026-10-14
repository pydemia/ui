# 공유 구현 계약

## 경로와 타입

공통 source는 `packages/ui/src/components/foundation/`이며 설치 target도
`@ui/foundation/`을 보존한다. wrapper에서의 상대 import가 source와 설치 결과에서 같다.

- design-modes.ts: 21개 ID/definition, appearance/palette/color token 타입·metadata.
- design-mode-settings.ts: pure validation/URL/token 합성, DOM·storage·React 의존 없음.
- theme-dom.ts: resolved setting을 특정 HTMLElement에 적용·정리하는 adapter.
- portal-scope.tsx: React provider와 container 선택, design 데이터·CSS import 없음.
- theme-scope.tsx: settings 기반 지역 scope와 body host, stable DOM identity.
- packages/ui/src/design-modes.css: optional 재질/문서/recipe 스타일.

`Appearance = "light" | "dark"`.
`PaletteId = "design" | "neutral" | "pydemia" | "ocean" | "forest" | "violet"`.
`ColorToken`은 현재 14개 `--background`, `--surface`, `--surface-subtle`,
`--foreground`, `--muted`, `--border`, `--accent`, `--accent-foreground`,
`--focus`, `--danger`, `--success`, `--warning`, `--message-user-background`,
`--message-user-foreground`다.
`ColorOverrides = Record<Appearance, Partial<Record<ColorToken, string>>>`.
`ThemeSettings = { version: 1; design: DesignModeId; appearance: Appearance;
colormap: PaletteId; overrides: ColorOverrides }`.

`DesignModeDefinition`은 id/name/group/description/atlasCaseId/releaseStatus/
appearances/defaultAppearance/colormaps/recipe를 포함한다. recipe는
standard/bento/spatial이며 팔레트·형태 토큰 데이터를 metadata와 함께 소유한다.
Basic은 released, 나머지는 검증 전 ready 또는 draft. Released 목록은 단일 manifest로 얻는다.

## Pure 함수

- `colorTokens`: 기존 {name, token} 14개 label을 그대로 export.
- `colormaps`: 기존 5개 {id, name, description, colors:{light,dark}} metadata.
- `designModes`: 21개 definition 배열. `getDesignMode(id)`와 `isDesignModeId`.
- `resolveThemeSettings(input, options?)` → `{ settings, issues: string[] }`.
- `parseThemeUrl(url: URL, options?)` → 같은 resolution.
- `writeThemeUrl(url: URL, settings: ThemeSettings)` → 새 URL, 원본 변경 없음.
- `resolveThemeTokens(settings, options?)` → CSS custom property의 string map.
- `defaultThemeSettings`는 Basic/Light/Neutral/빈 override이며 소비자가 변경하지 않는다.

options의 `allowUnreleased`는 명시적 내부 preview/검증에만 사용한다.
일반 resolver/URL은 미출시 값을 Basic으로 정규화하고 issues를 반환한다.
신뢰 경계에서는 unknown input을 검사하며 version/hex/token/design/palette를 추정하지 않는다.

## 전환과 합성

Basic → 디자인 형태와 default palette → appearance → 명시 colormap → override.
bare /는 항상 Basic/Light/Neutral. design 없는 legacy URL도 유효한 mode/colormap/
override를 복원한다. 미지정 palette는 Basic이면 neutral, 그 외면 design.
Dark UI는 dark-only이고 명시적 Light 전환은 Basic Light로 정규화한다.
Cyber/Terminal은 먼저 dark-only로 구현하고 지원/검수 범위를 설명한다.
모드 선택 시 현재 appearance를 유지하되 unsupported는 mode 기본값과 안내를 사용한다.

URL owned key는 design/mode/colormap 및 허용 light.token/dark.token이다.
다른 key와 hash/component는 보존한다. bare defaults는 불필요한 query를 추가하지 않는다.
정규화된 잘못된 owned key는 정리한다. explicit URL 설정은 저장값보다 우선한다.

지역 scope/host에는 palette와 semantic alias, 전체 Basic 형태/density/shadow/overlay,
font와 color-scheme를 재정의한다. html에만 정의된 실제 font를 지역 scope에도 적용한다.
Basic 토큰과 5개 palette의 원래 색은 source CSS와 일치시킨다.

## root의 통합 소유권

사용자의 최신 지시: PRISM의 현재 디자인을 유지한다. `/prism`에 디자인 모드
선택 UI·토큰·재질·recipe를 추가하지 않는다. PRISM 검사는 기존 모습과 동작의
회귀 확인으로 한정한다. 적용 범위는 기본 pydemia UI 문서·컴포넌트·조합·profile이다.

root는 index/package export, registry/provenance/build checker, docs/profile 통합,
shared builds·Git·공개를 관리한다. leaf write scope는 개별 생성 요청에서 제한한다.
동시에 같은 파일을 수정하지 않고 중간 모듈이 불완전할 때 shared build를 시작하지 않는다.
