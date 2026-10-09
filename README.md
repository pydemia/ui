# pydemia UI

React 19, Tailwind CSS 4, TypeScript와 shadcn registry convention으로 만든
source-owned UI 컴포넌트 작업공간입니다. 현재 목록은 문서 사이트의
component catalog에서 확인할 수 있습니다.
shadcn/ui 기반 항목은 원본 revision과 MIT notice를 유지합니다. Origin UI,
Kibo UI, AI Elements, Tremor는 디자인·상호작용 reference로 기록하고
해당 항목의 구현 코드는 `pydemia/ui`에서 관리합니다.
이 저장소와 문서 사이트는 prototype 단계이며 Mantine/MUI 수준의 전체
component breadth를 제공하지는 않습니다.

## 시작하기

Node.js 22 이상이 필요합니다.

```bash
npm ci
npm run typecheck
npm run build
npm run registry:check
npm run dev
```

`registry:check`는 item·provenance 정합성과 생성 JSON의 파일 내용이
현재 원본 소스와 일치하는지 검사합니다. component 원본, 공개 export,
registry item, 문서 catalog ID의 1:1 대응도 확인합니다.
문서 Usage 코드의 TSX 구문도 검사합니다.

`npm run dev`는 문서 사이트를 `http://127.0.0.1:5173/`에서 실행합니다.
프로필 예시만 보려면 `npm run dev:example`을 사용합니다.
문서의 Operations workspace는 기존 component를 조합한 분석 화면입니다.
기간 전환, 실행 목록 검색·선택·재실행, 로그와 도움말 상태를 로컬에서
시험할 수 있습니다. 예시 원본은
[`apps/docs/src/analytics-workspace.tsx`](apps/docs/src/analytics-workspace.tsx)에
있으며 별도 registry item으로 세지 않습니다.
Review workspace는 요청 검색·상태 필터, 변경 비교, 대댓글,
승인·거절을 기존 component로 연결한 예시입니다. 원본은
[`apps/docs/src/review-workspace.tsx`](apps/docs/src/review-workspace.tsx)에
있으며 의견과 결정은 화면을 새로 고치면 초기화됩니다.
Intake workspace는 단계별 입력·기간 선택·첨부 예정 파일 목록과
접수 표를 연결합니다. 원본은
[`apps/docs/src/intake-workspace.tsx`](apps/docs/src/intake-workspace.tsx)에
있으며 파일 전송과 서버 저장은 실행하지 않습니다.

`@pydemia/ui`는 이 workspace 안에서 사용하는 **private 패키지**이며 npm에
게시되지 않았습니다. 컴포넌트 소스를 프로젝트에 편입할 때는 원하는
`docs/r/pyd-*.json` 항목을 shadcn registry로 설치합니다. token은
`pyd-tokens.json`을 함께 설치하고 소비자 CSS에서
`@import "./components/ui/tokens.css";`로 연결합니다. `npm run build`는
`docs/`에 게시용 사이트, `docs/r/`에 registry JSON, `docs/examples/profile/`에
실행 가능한 조합 예시를 생성합니다. import 경로는 소비자 프로젝트의
`components.json`에 지정한 `aliases.ui` 위치에 맞춰 조정합니다.

문서의 Usage 코드는 workspace 전용 `@pydemia/ui` import입니다. registry로
복사한 소비자는 설치된 파일에서 직접 import합니다. 예를 들어
`shadcn@4.21.0`과 `aliases.ui: "@/components/ui"` 설정으로 Badge와
DataList를 설치한 Vite 앱의 `src` 파일에서는 다음 경로를 사용합니다.

```tsx
import { Badge } from "./components/ui/badge";
import { DataList } from "./components/ui/data-list";
```

이 CLI 버전에서 `pyd-tokens`도 `src/components/ui/tokens.css`에
설치되는 것을 별도 소비자에서 확인했습니다. 이전 `shadcn@4.0.0`은
같은 `@ui/` target을 `src/@ui/`에 설치했으므로 경로를 확인하고
import해야 합니다. 버전 변경 시 설치 경로와 typecheck를 다시
검증합니다.

shadcn/ui 소스를 수정한 registry 항목은 설치할 때
`aliases.ui/SHADCN_UI_LICENSE.md`도 복사합니다. 이 파일에는 사용한
revision의 MIT 고지가 있으므로 설치한 코드를 배포할 때 함께 유지하세요.
고지는 shadcn/ui를 수정한 항목의 source 목록을 고정된 commit과
SHA-256으로 기록합니다. `registry:check`는
`registry/shadcn-sources.json`을 현재 provenance의 해당 항목과
대조합니다. 원본 component 추가로 고지 내용이 바뀌지는 않습니다.
저장소 전체의 출처 기록은 `registry/provenance.json`과
[`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md)에 있습니다.

생성된 JSON의 내부 의존성은 공개 registry URL을 가리킵니다. 별도 소비자
프로젝트에서 로컬 registry를 시험할 때는 먼저
`PYDEMIA_REGISTRY_BASE_URL=http://127.0.0.1:5173/r/`를 설정하고
`npm run build`를 실행하세요. 환경 변수를 지정하지 않은 빌드는
`https://pydemia-ui.vercel.app/r/`를 사용합니다.

## Registry snapshot

registry JSON과 내부 의존성, token 파일을 같은 내용 해시로 묶을 수
있습니다. 현재 `/r/pyd-*.json`은 빌드할 때 갱신되는 최신 경로이고,
`/r/releases/sha256-<digest>/pyd-*.json`은 해당 시점의 고정 경로입니다.
snapshot 디렉터리의 `manifest.json`은 각 파일의 SHA-256을 기록합니다.
77번째부터 snapshot의 `baseUrl`과 내부 의존성은
`raw.githubusercontent.com/pydemia/ui/main/docs/r/releases/`를
사용합니다. Vercel Instant Rollback으로 사이트를 이전 배포로
돌려도 새 형식의 설치 URL은 `main`에 남은 파일을 읽습니다. 과거
76개 snapshot의 Vercel URL은 이전 배포에서 404가 될 수 있습니다.
복구할 때는 현재 `main`에서 새
커밋으로 문제 변경을 되돌리고, 기존 `registry/releases/`와
`docs/r/releases/`는 되돌리기 전 `main` commit에서 유지합니다.
필요하면 다음 명령으로 두 디렉터리를 복원합니다. `COMMIT_SHA`는
되돌리기 전 `main`의 commit으로 바꿉니다.

```bash
git restore --source=COMMIT_SHA --staged --worktree -- registry/releases docs/r/releases
```

이후 아래 순서로 빌드·snapshot·검사를 수행하고 새
배포를 게시합니다. 공개 후 현재·이전 release의 manifest와 대표 item
URL을 확인합니다. CI는 기존 release 파일의 수정·삭제를 거부합니다.
이 절차는 `main`의 기존 release 파일 보존을 검사합니다. Vercel에
묶인 이전 snapshot의 Instant Rollback 중 일시적인 404는 막지 못합니다.

```bash
npm run build
npm run registry:snapshot
npm run build
npm run registry:release-check
```

`registry:snapshot`은 기본 공개 URL로 빌드된 item을 받아 의존성을
고정된 release 경로로 바꿉니다. 같은 내용과 공급 형식이면 기존
snapshot을 확인하고 유지하며, 내용이나 형식이 바뀌면 새 식별자를
만듭니다. `registry:check`는 snapshot의 파일 해시·내부
의존성·`docs/r/releases/` 복사본을 확인합니다. 이전 snapshot을 수정하지
않고 새 경로를 추가합니다. `registry:release-check`는 현재 빌드의 내용
해시 ID를 계산해 해당 snapshot과 `docs/r/`의 최신 JSON을 대조합니다.
특정 후보를 검사할 때는 `-- sha256-<digest>`를 덧붙일 수 있습니다.
전달한 ID가 현재 빌드와 다르면 실패합니다. 배포 전 변경 내용은
[CHANGELOG.md](CHANGELOG.md)에 기록하고, 배포 후 공개 manifest와
변경 item URL을 확인합니다. 설치 형식·target·의존 경로가 바뀌면
해당 경로의 별도 소비자 설치·typecheck·build도 확인합니다.
다음은 GitHub raw 경로의 `TransferList`와 token을 별도 소비자에
설치하는 예시입니다. `main`에 release가 병합된 뒤 사용할 수 있습니다.

```bash
npx shadcn@4.21.0 add https://raw.githubusercontent.com/pydemia/ui/main/docs/r/releases/sha256-c4275e165672ed0ab23e640a160305ac6949384bb206a1424243efc8851b8857/pyd-transfer-list.json https://raw.githubusercontent.com/pydemia/ui/main/docs/r/releases/sha256-c4275e165672ed0ab23e640a160305ac6949384bb206a1424243efc8851b8857/pyd-tokens.json
```

문서 사이트 배포가 지연돼도 `main`에 병합된 schema 2 snapshot은
GitHub raw에서 설치할 수 있습니다. 다음 83번째 release는
`DialogContent`의 기본·넓은·전체 화면 크기를 포함합니다. 고정된
release URL이므로 이후 버전으로 자동 갱신되지는 않습니다.

```bash
npx shadcn@4.21.0 add https://raw.githubusercontent.com/pydemia/ui/main/docs/r/releases/sha256-25ca4393b38b8fcebbbd34ca3d8c73475e773a766e971da004f94e40728bc896/pyd-dialog.json https://raw.githubusercontent.com/pydemia/ui/main/docs/r/releases/sha256-25ca4393b38b8fcebbbd34ca3d8c73475e773a766e971da004f94e40728bc896/pyd-tokens.json
```

이 명령은 최소 Vite·React·Tailwind 소비자에서 실행해 Radix Dialog,
`clsx`, `tailwind-merge`의 자동 설치와 typecheck·build를 확인했습니다.
별도 소비자 브라우저에서는 세 크기의 표시와 focus 복원을 확인했습니다.

이전 DataChart snapshot
`sha256-212e10face340c8a0d867de1ea5ace2c1490e102dfec7d09f8ca97e999cae331`은
공개 URL 소비자의 소스 일치·typecheck·build를 확인했습니다.

기존 registry 설치물을 갱신할 때는 소비자 저장소의 변경을 먼저
commit하거나 백업하세요. `shadcn@4.21.0 add <item URL> --diff`로
차이를 확인할 수 있습니다. 덮어쓰기를 거절하면 수정 파일이 남지만
새 API도 들어오지 않습니다. `--overwrite`는 새 파일로 교체하므로
소비자 수정은 백업에서 다시 적용하고 typecheck·build를 실행해야
합니다. 공개 40개 item에서 91개로 갱신한 격리 소비자와 수정된
Badge에서 이 경로를 확인했습니다. [shadcn CLI 옵션](https://ui.shadcn.com/docs/cli)을
참고하세요.

## Colormap

문서 사이트의 Colormap 영역에서 Neutral, Pydemia, Ocean, Forest,
Violet을 선택하거나 각 색을 `#RRGGBB`로 조정할 수 있습니다. 조정값은 현재
light/dark 모드에 따로 적용되며 새로고침하면 초기화됩니다. 조합 예시의
iframe에도 적용되고, 「전체 화면으로 열기」 링크에는 현재 선택이 담깁니다.

공통 stylesheet는 `--accent`, `--background`, `--success`,
`--warning` 같은 semantic token을
`--palette-accent`, `--palette-background`의 alias로 선언합니다. 소비자
앱에서도 root의 `data-colormap`을 설정하거나 palette 변수를 덮어써
같은 컴포넌트의 색을 바꿀 수 있습니다.

```js
document.documentElement.dataset.colormap = "forest";
document.documentElement.style.setProperty("--palette-accent", "#25684a");
```

직접 지정한 색은 문서 사이트의 본문, Accent, Success, Warning,
User message 대비 표시를
확인하세요. 색상을 바꿔도 컴포넌트 소스나 registry metadata는 변하지
않습니다.

## 구조

| 경로 | 역할 |
| --- | --- |
| `packages/ui` | 컴포넌트 원본과 light/dark design tokens |
| `packages/prism` | PRISM light profile과 독립 React 컴포넌트 |
| `registry.json`, `registry/provenance.json` | registry 항목, 출처·라이선스·의존성·접근성 metadata |
| `apps/docs` | 컴포넌트 미리보기, 사용 코드, palette, 예시 사이트의 원본 |
| `apps/docs/src/prism`, `apps/docs/public/prism` | `/prism` 카탈로그·조합 예시·AI manifest·별도 registry·참조 검증 자료 |
| `apps/profile-demo` | 실제 컴포넌트를 조합한 프로필 예시 |
| `docs/` | Vercel 정적 배포용 빌드 결과 (`npm run build`로 갱신) |
| `research/` | source inventory, taxonomy, 검증 기록 |
| `.worknotes/` | 세션 인계, [확장 계획](.worknotes/component-roadmap.md), 검토 기록 |

새 component의 디자인 reference와 실제 코드 출처는
`registry/provenance.json`에서 별도로 기록합니다. shadcn/ui source를
변형한 항목은 revision·license·notice를 유지합니다. 다른 library는
구현 source로 복사하지 않고 필요한 동작을 자체 코드로 작성합니다.
dependency의 license는 component source license와 구분합니다.
외부 source notice는 [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md)에
보관합니다. 이전 adaptation의 귀속 notice도 보존합니다.
이 저장소에는 아직 전체 코드에 적용할 공개 LICENSE가
없으므로 문서의 「공개 사용 조건 미지정」은 재사용 허가를 뜻하지 않습니다.

## 문서 사이트 게시

문서 사이트는 GitHub에 연결된 Vercel 프로젝트
[`pydemia-ui`](https://vercel.com/pydemia-7822/pydemia-ui)에 배포됩니다. 현재
공개 주소는 [`https://pydemia-ui.vercel.app`](https://pydemia-ui.vercel.app/)입니다.
[`vercel.json`](vercel.json)은 저장소 루트에서 `npm ci`와 `npm run build`를
실행하고 `docs/`를 정적 사이트로 게시하도록 지정합니다. `main`에 push하면
Vercel이 다시 배포합니다.

`ui.pydemia.ai`는 Vercel 프로젝트에 등록되어 있으며 Squarespace DNS 연결을
기다리는 중입니다. Squarespace에서 `ui`의 CNAME을 프로젝트의 Vercel
[Domains 설정](https://vercel.com/pydemia-7822/pydemia-ui/settings/domains)에
표시되는 대상으로 지정해야 합니다. 기존 GitHub Pages 배포 설정은 도메인
전환이 확인될 때까지 남아 있습니다. 따라서 이전 대상인
`pydemia.github.io`로 CNAME을 새로 지정하지 마세요.

접근성과 브라우저 검증의 현재 상태는 [`research/verification.md`](research/verification.md)에
기록했습니다. 화면의 상태 변경과 복사는 데모 기능이며 서버 데이터가 아닙니다.

## PRISM profile

`/prism`은 PRISM-DEV의 색상·Pretendard·컴포넌트 규격과 기능 목적을
재현하는 별도 카탈로그입니다. `Workspace`에서 채팅·후보 목록·즐겨찾기·상세·비교를
가상 데이터로 실행할 수 있습니다. 서버 조회·인사 평가·권한·저장은 소비자가 소유합니다.
38개 typed group과 토큰을 포함한 39개 registry 항목을 제공합니다. 원본 269개 항목의 목적별 대응을 기록했으며 원본 벡터 87개는 권리 고지와 함께 보존합니다. 반응형 탐색 Drawer, 직접 패널 크기 조절, PDF 맞춤·높이·배율 확장을 제공합니다. `Responsive` 화면의 실제 iframe으로 320–1200px 너비를 확인할 수 있습니다. 전체 상태별 원본 디자인 비교는 진행 중입니다. 매핑 수는 검증 완료 수가 아닙니다.

- 계약·원본 대응: `apps/docs/public/prism/components.json`
- AI 안내: `apps/docs/public/prism/llms.txt`
- 디자인 규칙과 검증: `apps/docs/public/prism/research/`
- Registry: `/prism/r/registry.json`; 단위 항목은 `/prism/r/prism-*.json`

Workspace에서는 `@pydemia/prism`을 import합니다. 독립 소비자는 카탈로그에 표시된
`shadcn add` 명령으로 소스와 의존성을 설치하고 로컬 `components/ui/prism-*.tsx`를
import합니다. Usage의 기본값은 registry 설치 경로이며 Workspace 경로로 전환할 수
있습니다. AI manifest의 `registryUsage`는 `@/components/ui/prism-*`를 사용하므로
설치 경로를 바꿨다면 `components.json`의 `aliases.ui`에 맞춰 수정합니다.
`usage`는 workspace import를 사용합니다. `usageKind: component-example`은 합성
데이터·상태를 포함한 독립 React 예시이고 `integration-fragment`는 소비자가 데이터와
callback을 정의해야 하는 연동 코드 일부입니다.
`prism.css`는 설치한 Pretendard variable font를 함께 로드합니다.
벡터 자산의 출처와 권리 고지는 설치되는 `PRISM_ASSET_NOTICES.md`에 있습니다.
`tokens.css` 다음에 `prism.css`를 로드하고 앱 root에
`data-prism="light"`를 지정합니다. PDF viewer의 `workerUrl`은 설치된 `pdfjs-dist`와
같은 버전이어야 합니다. Vite는 `pdf.worker.min.mjs?url` import를 지원하며 다른
bundler는 해당 worker를 자체 정적 경로로 제공합니다.

`npm run registry:prism`으로 계약과 registry를 갱신하고 `npm run prism:check`로
구조·동작 계약을 검사합니다. `node scripts/verify-prism-consumer.mjs`는 임시 프로젝트에
전체 PRISM registry를 실제 설치하고 TypeScript와 Vite 빌드를 검증합니다.
`component-example`으로 표시한 사용 예시도 설치된 소스와 함께 타입 검사합니다.
공개 배포 후 `node scripts/verify-prism-consumer.mjs --public`을 실행하면 로컬
mirror 대신 `https://ui.pydemia.ai`의 registry에서 설치합니다.
이 검사는 브라우저 실행이나 원본과의 시각 일치를 확인한 결과가 아닙니다.
