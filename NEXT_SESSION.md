# Component 확장 작업 인계

기준: 2026-09-28, `main`의 `3abb10f` 이후. 새 세션에서는 먼저 최신 `main`과
`git status`를 확인하세요. 이 문서는 현재 prototype에서 다음 component를
편입하기 위한 작업 맥락이며, 최신 상태는 저장소의 코드와 metadata가 우선합니다.

## 목표와 현재 범위

목표는 Mantine/MUI에 견줄 만한 component coverage를 점진적으로 확보하면서
shadcn/ui의 Open Code, source ownership, 디자인 자유도를 유지하는 것입니다.
외부 registry들을 runtime에 합치는 대신, 필요한 소스를 개별 검토하고
`@pydemia/ui`와 내부 shadcn registry에 정규화해 편입합니다. bulk import나
범용 추상화를 먼저 만들지 마세요.

현재 React 19, TypeScript, Tailwind CSS 4, Vite 7, npm workspaces를 사용합니다.
`components.json`은 shadcn `new-york`, `rsc: false`, CSS variables 설정입니다.
`@pydemia/ui`는 private workspace package이며 npm에 게시되지 않았습니다.

| 위치 | 내용 |
| --- | --- |
| `packages/ui/src/components/`, `index.ts` | 배포할 component 원본과 public export |
| `packages/ui/src/styles.css` | light/dark color, type, spacing, radius, border, shadow, focus, motion, density token |
| `registry.json` | shadcn item의 파일과 직접·registry 의존성 |
| `registry/provenance.json` | 출처, 고정 upstream revision, license, 의존성, profile, 접근성 상태 |
| `THIRD_PARTY_NOTICES.md` | 편입한 제3자 source의 notice |
| `apps/docs/src/catalog.tsx` | component별 preview, 설명, 사용 코드 |
| `apps/profile-demo` | foundation과 curated component를 함께 쓰는 예시 |
| `research/source-inventory.md` | MUI/Mantine taxonomy, source별 coverage·gap·license 조사 |
| `research/design-contract.md` | 첫 prototype의 시각·상호작용 결정 |
| `research/verification.md` | 실행한 검증과 미검증 항목 |

현재 9개 registry item은 `pyd-utils`와 8개 component입니다. Foundation은
Button, Input, Label, Badge, Tabs, Table이며, Origin UI의 AffixedInput과
Kibo UI의 Snippet을 편입했습니다. 문서 사이트는
<https://pydemia-ui.vercel.app/>, 조합 예시는
<https://pydemia-ui.vercel.app/examples/profile/>에서 볼 수 있습니다.

## 다음 편입 범위

먼저 `research/source-inventory.md`의 gap을 기준으로 실제 사용처가 있는
서로 다른 범주의 component 2–4개를 고르세요. 현재 비어 있는 범주에는
Selection, Overlays, Feedback, Date & time, Charts가 있습니다. 예를 들어
Checkbox/Select, Dialog, Alert 같은 foundation을 먼저 검토할 수 있지만,
선정 결과는 의존성·접근성·문서 예시의 필요에 따라 결정하세요.

shadcn/ui는 일반 foundation, Origin UI는 선택한 일반 UI 변형, Kibo UI는
특정 기능 component의 주력 source입니다. Tremor는 analytics 화면에,
AI Elements는 AI interface에 실제 요구가 생기면 item 단위로 확장합니다.
Magic UI, Motion Primitives, Cult UI, Aceternity UI는 visual/reference로만
취급합니다. 특히 Aceternity Pro 코드를 공개 registry로 재배포하지 마세요.

새 component마다 다음 순서로 작업하세요.

1. upstream 공식 docs, 동일 revision의 코드와 LICENSE 원문을 다시 확인하고
   직접·전이 의존성, 유지 상태, 키보드/focus/screen reader 동작을 평가합니다.
   기존 조사 날짜나 검색 결과만으로 license를 확정하지 않습니다.
2. 기존 API와 중복을 확인하고 `packages/ui/src/components/`에 필요한 코드만
   편입합니다. 색상·간격·radius·shadow·focus·motion은 공통 token을 사용하고,
   접근성에 필요한 semantics와 상태를 보존합니다.
3. `packages/ui/src/index.ts`, `registry.json`, `registry/provenance.json`,
   필요 시 `THIRD_PARTY_NOTICES.md`를 함께 수정합니다. registry dependency는
   명시하고 source의 license와 npm dependency의 license를 구분합니다.
4. `apps/docs/src/catalog.tsx`에 동작하는 preview와 사용 코드를 추가합니다.
   필요할 때만 `apps/profile-demo`에 실제 조합을 추가합니다. 단순 카드나
   모형이 아니라 구현된 component를 사용합니다.
5. 키보드·focus·상태 발표·light/dark·좁은 화면을 확인하고
   `research/verification.md`에 실행한 검사와 미검증 항목을 구분해 기록합니다.

기본 시각 방향은 낮거나 중간 radius, 얇고 분명한 border, 절제된 shadow,
compact–moderate density, semantic color token, 짧고 절제된 motion입니다.
현재 `--radius: 5px`, `--density-control-height: 36px`,
`--motion-fast: 150ms`이며 색상은 브랜드 확정값이 아닌 임시 선택입니다.

## 설치·검증·배포

```bash
npm ci
npm run typecheck
npm run build
npm run registry:check
npm run dev
```

`npm run build`는 `docs/`의 정적 사이트와 `docs/r/`의 registry JSON을
생성합니다. 빌드 후 생성물 diff를 확인하고 필요한 변경만 commit하세요.
새 component는 가능하면 별도 소비자 프로젝트에서 실제 `shadcn add` 설치도
확인하세요. 이전 환경에서는 CLI의 필수 색상 파일 fetch가 proxy에서 막혀
수동 source 복사/typecheck까지만 검증했습니다. 공개 registry JSON URL의
브라우저 직접 탐색도 당시 `ERR_BLOCKED_BY_CLIENT`로 확인하지 못했습니다.
모바일·키보드 focus의 정식 검사와 screen reader 검증 역시 남아 있습니다.

GitHub `pydemia/ui`의 `main`에 push하면 Vercel 프로젝트 `pydemia-ui`가
`vercel.json`에 따라 `npm ci`, `npm run build`를 실행해 `docs/`를 게시합니다.
`ui.pydemia.ai`는 Vercel에 등록했으나 Squarespace DNS 전환이 아직 확인되지
않았습니다. 기존 GitHub Pages 설정과 `docs/CNAME`은 전환 전 상태로 남아
있으므로 component 확장 작업에서 도메인 설정을 임의로 변경하지 마세요.

작업 시작 시 저장소의 `README.md`, 위 `research/` 문서, 관련 component 및
registry metadata를 먼저 읽으세요. 새 source를 편입할 때는
`software-engineering`, `reference-research`, `product-ui-ux-design`,
`frontend-design-workflow`, `frontend-development` 중 해당 작업에 필요한
pydemia skill의 실제 원문도 확인하세요.
