# Prototype 설계 계약

대상은 제품별 API와 디자인 체계가 정해지기 전의 `@pydemia/ui` 첫 vertical
slice입니다. 기존 repository와 brand palette가 제공되지 않아 color는 임시
내부 선택이며 사용자 승인 색상으로 기록하지 않습니다.

| ID | 조건과 결정 | 구현 | 확인 방법 |
| --- | --- | --- | --- |
| R1 | source를 직접 runtime에 혼합하지 않고 검토한 코드만 내부 소유 | `packages/ui`, `registry.json` | 패키지 의존성, source 경로 검사 |
| R2 | shadcn foundation 5–10개와 Origin/Kibo 각 1개 | 6개 foundation, AffixedInput, Snippet | exports와 provenance 대응 |
| R3 | 출처·license·의존성·profile·접근성 상태 기록 | `registry/provenance.json` | `registry:check` |
| R4 | 공통 시각 규칙과 light/dark, 줄어든 motion | `packages/ui/src/styles.css` | CSS 빌드·브라우저 확인 |
| R5 | 대표 profile page에서 실제 조합·상태 확인 | `apps/profile-demo` | 검색·탭·복사·입력·theme 조작 |
| C1 | 외부 source bulk import 금지 | 소스별 선택한 한 파일만 변형 | component 파일 목록 |
| C2 | 과도한 radius/shadow/motion 금지 | 5px radius, 얇은 border, 작은 shadow, 150ms | token 검사·시각 검토 |

## 화면과 상태

선택된 Developer Tool profile page의 DOM 순서는 header → 설명 → 목록 및
코드 → 입력 preview입니다. 넓은 화면은 2열이고 좁은 화면은 한 열입니다.
목록은 이름/source/category를 찾고, 결과가 없으면 빈 결과 문장을
표시합니다. Snippet은 두 탭을 선택해 해당 문자열을 복사합니다. 우측의
경로 입력과 검토 버튼은 local React state만 변경합니다. 실제 등록·권한
변경·네트워크 요청은 없습니다.

| State owner | 상태 | 경계 |
| --- | --- | --- |
| 페이지 | 검색어, 경로 입력, 데모 검토 표시, 현재 코드 탭, theme | 새로고침 후 초기화 |
| SnippetCopyButton | 현재 value에 대한 성공/실패 메시지 | 탭 변경 시 이전 메시지 숨김 |
| Radix Tabs | tab roles, focus, keyboard movement | package dependency |
| CSS | color, typography, spacing, radius, border, shadow, focus, motion, density | 외부 source 색상 미사용 |

## Token과 컴포넌트 계약

- Typography: `--font-ui`, `--type-body-size`, `--type-caption-size`,
  `--type-body-leading`. 숫자 표기는 데모의 경로를 제외하고 tabular data가
  없어 별도 숫자 token을 두지 않았습니다.
- Spacing: `--space-1/2/3/4/6`. 컴포넌트 내부는 이에 대응하는 Tailwind
  utility와 control padding을 사용합니다.
- Surface: `--background`, `--surface`, `--surface-subtle`, `--border`,
  `--overlay`, `--radius`, `--shadow-float`; border 두께는 1px입니다.
- Semantics: `--foreground`, `--muted`, `--accent`, `--accent-foreground`,
  `--focus`, `--danger`를 light/dark에 각각 할당합니다.
- Message: `--message-user-background`와 `--message-user-foreground`는
  두 테마에서 사용자 발화의 어두운 배경과 밝은 글씨를 유지합니다.
- Motion/density: `--motion-fast`, `--density-control-height`,
  `--density-row-block`. `prefers-reduced-motion`에서는 transition과
  animation을 줄입니다.

`AffixedInput`의 `label`은 필수이고 prefix/suffix는 장식적인 표시만 맡습니다.
실제 저장값이 prefix/suffix를 포함해야 하는 제품은 상위 form에서
명시적으로 합쳐야 합니다. `Snippet`은 Tabs를 조합하며 모든 trigger는
keyboard focus를 받고 복사 버튼은 이름과 상태 텍스트를 갖습니다.

## 선택과 보류

| 결정 | 상태 | 이유 |
| --- | --- | --- |
| shadcn convention + Radix Tabs | user-specified foundation / agent-selected primitive | 키보드 탭 동작을 검증된 primitive에 맡김 |
| Origin `comp-13` | agent-selected | 의존성이 작고 일반 Input variation을 입증 |
| Kibo `Snippet` | agent-selected | code/developer category를 채우며 탭/복사 상호작용 검증 |
| neutral teal palette | agent-selected provisional | 원본 브랜드 token 부재; 의미색 대비를 확보 |
| 대상 Git repository 연결 | completed 2026-09-28 | `pydemia/ui`에 prototype과 문서 사이트 편입 |
| Tremor, AI Elements 코드 편입 | pending requirement | prototype 이후 product profile 필요 시 개별 선정 |

## 참고한 대표 사례

| Source | 확인한 특성 | 전이한 범위 |
| --- | --- | --- |
| [Origin comp-13](https://github.com/shadcn/originui/blob/f4f366ae39759248d46b1252c52fbdc0bc01c285/registry/default/components/comp-13.tsx) | 입력 앞·뒤 affix, Label과 Input 조합 | 시각 배치, label 관계. 화폐 문구와 고정 색상은 제외 |
| [Kibo Snippet](https://www.kibo-ui.com/components/snippet) | tabbed code, copy action, Radix Tabs | 구획과 상호작용. hover에만 보이는 copy 버튼은 제외 |
| [shadcn registry schema](https://ui.shadcn.com/docs/registry/registry-item-json) | source item과 dependency 선언 | 정규화된 내부 registry 원본 |

코드와 문서로 본 특성입니다. 브라우저가 로컬 주소를 열지 못해 pixel,
hover, 실제 responsive 화면의 시각 관찰은 수행하지 못했습니다.

## 2026-09-28 폼 입력 확장

- `Field`는 자체 label이 없는 control에 `id`, 설명·오류 ID,
  `aria-invalid`, `aria-required`를 전달합니다. 실제 필수값·형식 검사는
  소비자 form이 맡습니다.
- `Select`는 검색 없는 단일 선택입니다. Radix Select가 option 탐색과
  form 값을 관리하며, `Field`는 trigger에 이름을 연결합니다.
- `DatePicker`는 `YYYY-MM-DD` 달력 날짜 또는 `null`만 받습니다.
  시각·시간대 값은 이 API에 넣지 않습니다. hidden input의 빈 값은
  빈 문자열이며, 오류 표시는 소비자 form과 `Field`가 맡습니다.
- registry 설치는 `pyd-tokens` stylesheet를 함께 설치하고 소비자 CSS에서
  import해야 공통 token을 적용합니다. 배포 JSON의 내부 의존성은
  공개 URL로 변환하고 파일 target은 소비자의 `@ui/` 경로로 지정합니다.
