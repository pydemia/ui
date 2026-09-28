# Component taxonomy와 source 검토

2026-09-27 UTC에 각 source의 공식 사이트, upstream repository와 license
원문을 확인했습니다. 이 표는 category coverage 지도입니다. 같은 category에
표시된 source가 동일한 API나 접근성 품질을 제공한다는 뜻은 아닙니다.
비교 기준은 [MUI 전체 목록](https://mui.com/material-ui/all-components/)과
[Mantine 공식 사이트](https://mantine.dev/)의 일반 제품 UI 범주입니다.
MUI X 같은 유료·추가 제품을 core component 수에 합산하지 않았습니다.

| 범주 | shadcn | Origin snapshot | Kibo | Tremor Raw/Blocks | AI Elements | 이번 내부 구현 |
| --- | --- | --- | --- | --- | --- | --- |
| Actions | Button, Toggle | Button 변형 | Choicebox, Pill | Button | Prompt actions | Button, Toggle |
| Text inputs | Input, Textarea | Input 변형 | Tags, Combobox | Text Input | Prompt Input | Input, Textarea, AffixedInput |
| Selection | Checkbox, Radio, Select | 여러 Select 변형 | Choicebox | Select, Date Picker | Model Selector | Checkbox, NativeSelect, Switch, RadioGroup, Slider |
| Date & time | Calendar, Date Picker | Calendar 변형 | Calendar, Mini Calendar | Date Range, blocks | 없음 | Calendar |
| Navigation | Tabs, Sidebar, Menu | Tabs, Navbar 변형 | 없음 | Page Shell | Conversation navigation | Tabs, Breadcrumb |
| Layout | Card, Separator, Resizable | Banner, layout 변형 | Deck | Page Shell, Grid Lists | Panel/Canvas | Card, Separator |
| Overlays | Dialog, Drawer, Tooltip | Dialog, Popover 변형 | Dialog Stack | Dialog blocks | Artifact | Dialog, Tooltip, Accordion, Collapsible, Popover, AlertDialog |
| Feedback | Alert, Progress, Toast | Alert, Notification 변형 | Status, Spinner | Status Monitoring | Tool state | Alert, Progress, Skeleton, Spinner, Empty, Badge 텍스트 상태 |
| Data display | Badge, Table, Typography | Badge, Table 변형 | Comparison, Rating | KPI Cards, Bar Lists | Sources | Badge, Table, Avatar |
| Data tables | Data Table pattern | Table 변형 | Table, List | Table Actions/Pagination | 없음 | 단순 Table만 |
| Data & analytics | Chart/KPI examples | 없음 | Ticker | KPI cards | 없음 | MetricCard |
| Charts | Chart/Recharts | chart examples | Contribution Graph, Ticker | Area/Line/Bar/Donut | 없음 | 없음 |
| Files & images | Attachment | Upload/Crop examples | Dropzone, Image Crop/Zoom | File Upload blocks | Attachments | Dropzone |
| Editor | Textarea | Text editor example | Editor | 없음 | Prompt Input | 없음 |
| Tree & hierarchy | 일반 navigation | Tree example | Tree | 없음 | Node/Canvas | 없음 |
| Workflow | 일반 form | Stepper/Timeline | Kanban, Gantt | Filterbar | Tool, Reasoning | 없음 |
| Code/dev tools | Command | 없음 | Code Block, Snippet | 없음 | Code Block, Artifact | Snippet |
| AI/agent | Message 등 일부 | 없음 | 전문 영역 아님 | 없음 | Conversation, Message, Tool | Message, PromptInput |
| Marketing/motion | Blocks | 일부 변형 | Marquee | Blocks | 없음 | 없음 |
| Accessibility | 기본 primitive | 예제별 확인 | 예제별 확인 | 예제별 확인 | 예제별 확인 | 수동 점검 중 |

`없음`은 이 조사에서 해당 역할을 확인하지 못했거나 아직 편입하지 않았음을
뜻합니다. 개별 component의 완전한 개수·기능·WCAG 적합성을 주장하지
않습니다. 특히 DataGrid의 가상화/편집, 복잡한 form validation, Tree의
키보드 조작, 차트의 데이터 접근성은 첫 milestone에 남은 gap입니다.

## Source 역할과 상태

| Source | 확인한 공식 근거 | 역할과 의존성 경계 | 정확한 license / 유지 상태 |
| --- | --- | --- | --- |
| shadcn/ui | [components](https://ui.shadcn.com/docs/components), [registry](https://ui.shadcn.com/docs/registry/getting-started), [repository](https://github.com/shadcn-ui/ui) | Foundation 및 registry schema; 각 item의 Radix/Base UI 의존성은 별도 확인 | [MIT](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md); main 최신 commit 2026-09-21 |
| Origin UI snapshot | [repository](https://github.com/shadcn/originui), [category mapping](https://github.com/shadcn/originui/blob/main/config/components.ts) | general-purpose 변형; 선택한 comp-13은 Input/Label을 참조 | [MIT](https://github.com/shadcn/originui/blob/main/LICENSE.md); 최신 commit 2025-07-25, [기존 주소](https://originui.com/)는 coss UI로 이동 |
| Kibo UI | [component index](https://www.kibo-ui.com/), [Snippet](https://www.kibo-ui.com/components/snippet), [repository](https://github.com/shadcnblocks/kibo) | functional/domain source; Snippet은 Tabs, Button, lucide에 의존 | [MIT](https://github.com/shadcnblocks/kibo/blob/main/license.md); 최신 commit 2026-05-04 |
| Tremor Raw | [docs](https://www.tremor.so/), [repository](https://github.com/tremorlabs/tremor) | data intelligence; chart utils/Recharts/Radix를 item 단위 검토 | [Apache-2.0](https://github.com/tremorlabs/tremor/blob/main/LICENSE); 최신 commit 2025-10-10 |
| Tremor Blocks | [blocks](https://blocks.tremor.so/), [license](https://blocks.tremor.so/license) | 대시보드 조합 참고; Raw repo와 artifact를 혼동하지 않음 | 공식 Blocks 페이지는 MIT; 개별 artifact source 확인 필요 |
| AI Elements | [docs](https://elements.ai-sdk.dev/), [repository](https://github.com/vercel/ai-elements) | AI workspace; item별 AI SDK·motion 등 의존성 별도 검토 | [Apache-2.0](https://github.com/vercel/ai-elements/blob/main/LICENSE); 최신 commit 2026-08-21 |
| Magic UI | [docs](https://magicui.design/), [repository](https://github.com/Mucrypt/magic-ui) | marketing visual 참고 | [MIT](https://github.com/Mucrypt/magic-ui/blob/main/LICENSE.md); 확인한 main 최신 commit 2024-12-07 |
| Motion Primitives | [docs](https://motion-primitives.com/), [repository](https://github.com/ibelick/motion-primitives) | 절제된 motion reference; `motion` 등 실제 item별 확인 | [MIT](https://github.com/ibelick/motion-primitives/blob/main/LICENCE.md); 최신 commit 2026-09-16 |
| Cult UI | [docs](https://cult-ui.com/), [repository](https://github.com/nolly-studio/cult-ui) | 실험적인 interaction reference | [MIT](https://github.com/nolly-studio/cult-ui/blob/main/LICENSE.md); 최신 commit 2026-09-23 |
| Aceternity UI Pro | [license](https://ui.aceternity.com/licence) | visual reference 전용; 상품/item별 권리 확인 | Aceternity License는 source 재배포·marketplace 배포 제한. 무료 항목의 license를 여기서 확정하지 않음 |

최신 commit 날짜는 조회한 시점의 default branch 관찰치이며 유지보수의
품질을 보증하지 않습니다. Origin의 redirect와 오래된 commit, Tremor Raw의
최근 commit 공백, Magic UI의 commit 공백은 신규 vendoring 전 개별 재확인
사유입니다. 각 source의 접근성 설명은 자체 선언일 수 있으므로 실제
component는 키보드, focus, screen reader, reduced motion을 별도로 확인합니다.

## 선택과 중복 처리

1. shadcn의 기본 Button/Input/Tabs를 한 번만 소유합니다. Origin의 같은
   Button 전체를 또 설치하지 않고 특정 변형만 채택합니다.
2. Kibo는 일반 Input을 대체하기보다 Snippet, Kanban, Gantt, Dropzone처럼
   명확한 추가 기능이 필요할 때 검토합니다.
3. Tremor/AI Elements는 각각 analytics/AI profile의 요구가 생겼을 때만
   후보를 찾습니다. 두 source를 현재 runtime dependency에 추가하지 않았습니다.
4. Magic/Motion/Cult/Aceternity는 기본 선택 경로에서 제외합니다. 특히
   Aceternity Pro source는 공개 internal registry에 편입하지 않습니다.
5. 설치 전 원본 파일과 LICENSE를 같은 revision으로 확인합니다. npm 패키지의
   license는 source license와 별도로 기록합니다.

## 첫 milestone에서 확인한 dependency license

설치된 package manifest를 확인했습니다. 직접 runtime dependency 중
`@radix-ui/react-tabs@1.1.21` MIT, `class-variance-authority@0.7.1`
Apache-2.0, `clsx@2.1.1` MIT, `lucide-react@0.468.0` ISC,
`tailwind-merge@3.7.0` MIT, `react@19.3.0` MIT입니다. 코드에 번들로
포함하지 않고 package dependency로 참조합니다. 전이 의존성 전수 검토와
법률 검토는 수행하지 않았습니다.

## 2026-09-28 foundation 확장

Selection의 Checkbox·NativeSelect·Switch·RadioGroup, Overlays의
Dialog·Tooltip, Feedback의 Alert·Progress·Skeleton, Inputs의 Textarea,
Layout의 Card·Separator를 편입했습니다. 12개 모두 기존 foundation과 같은
shadcn/ui revision
`98a1fe67b439324ddc857f47fbdce056600a4329`에서 원본과
[MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)를
직접 확인했습니다. 사용 사례는 공식
[Checkbox](https://ui.shadcn.com/docs/components/radix/checkbox),
[Dialog](https://ui.shadcn.com/docs/components/radix/dialog),
[Alert](https://ui.shadcn.com/docs/components/radix/alert),
[Textarea](https://ui.shadcn.com/docs/components/radix/textarea),
[Native Select](https://ui.shadcn.com/docs/components/radix/native-select),
[Switch](https://ui.shadcn.com/docs/components/radix/switch),
[Radio Group](https://ui.shadcn.com/docs/components/radix/radio-group),
[Card](https://ui.shadcn.com/docs/components/radix/card),
[Separator](https://ui.shadcn.com/docs/components/radix/separator),
[Skeleton](https://ui.shadcn.com/docs/components/radix/skeleton),
[Progress](https://ui.shadcn.com/docs/components/radix/progress),
[Tooltip](https://ui.shadcn.com/docs/components/radix/tooltip) 문서와
대조했습니다.
원본 파일 경로는 `registry/provenance.json`에 항목별로 고정했습니다.

Checkbox는 [Radix Checkbox](https://www.radix-ui.com/primitives/docs/components/checkbox)의
checked/unchecked/indeterminate 상태와 Space 조작을 사용합니다. Dialog는
[Radix Dialog](https://www.radix-ui.com/primitives/docs/components/dialog)의
modal focus containment, Escape 닫기, trigger로 focus 복원을 사용합니다.
Alert는 안내에 `role="status"`, 오류에 `role="alert"`를 사용합니다.
이 역할 구분은 원본 Alert의 일괄 `role="alert"`에서 조정한 사항입니다.
Switch는 [Radix Switch](https://www.radix-ui.com/primitives/docs/components/switch),
RadioGroup은 [Radix Radio Group](https://www.radix-ui.com/primitives/docs/components/radio-group)의
선택·키보드 동작을 사용합니다. Separator는
[Radix Separator](https://www.radix-ui.com/primitives/docs/components/separator)를
장식 요소로 기본 설정합니다. Progress는
[Radix Progress](https://www.radix-ui.com/primitives/docs/components/progress)의
progressbar 값과 이름을 사용합니다. Tooltip은
[Radix Tooltip](https://www.radix-ui.com/primitives/docs/components/tooltip)의
focus/hover 열기와 Escape 닫기를 사용합니다. NativeSelect와 Textarea는
native control을 유지합니다. Skeleton에는 상위 loading 상태 설명이
필요합니다.

새 Radix 직접 의존성은 `@radix-ui/react-checkbox@1.3.11`,
`@radix-ui/react-dialog@1.1.23`, `@radix-ui/react-switch@1.3.7`,
`@radix-ui/react-radio-group@1.4.7`, `@radix-ui/react-separator@1.1.15`,
`@radix-ui/react-progress@1.1.16`, `@radix-ui/react-tooltip@1.2.16`입니다.
각 설치 패키지의 `package.json`과 LICENSE는 MIT입니다. lockfile에서
일곱 패키지의 직접·전이 의존성 45개를 추적했습니다. 44개의 license
metadata는 MIT, `tslib@2.8.1`은 0BSD입니다.
`react-remove-scroll-bar`에는 설치된 패키지의 별도 LICENSE 파일이 없어
lockfile의 MIT metadata만 확인했습니다. `lucide-react@0.468.0`은 ISC,
`class-variance-authority@0.7.1`은 Apache-2.0이며 두 항목 모두 기존
의존성을 재사용합니다. 패키지 소스를 registry에 복사하지 않습니다.

## 2026-09-28 두 번째 foundation 묶음

Accordion·Collapsible·Popover·AlertDialog, Avatar·Breadcrumb,
Empty·Spinner·Toggle·Slider를 추가했습니다. 공식 shadcn 문서의
[Accordion](https://ui.shadcn.com/docs/components/radix/accordion),
[Collapsible](https://ui.shadcn.com/docs/components/radix/collapsible),
[Popover](https://ui.shadcn.com/docs/components/radix/popover),
[Alert Dialog](https://ui.shadcn.com/docs/components/radix/alert-dialog),
[Avatar](https://ui.shadcn.com/docs/components/radix/avatar),
[Breadcrumb](https://ui.shadcn.com/docs/components/radix/breadcrumb),
[Empty](https://ui.shadcn.com/docs/components/radix/empty),
[Spinner](https://ui.shadcn.com/docs/components/radix/spinner),
[Toggle](https://ui.shadcn.com/docs/components/radix/toggle),
[Slider](https://ui.shadcn.com/docs/components/radix/slider)를 확인했습니다.
각 원본 파일은 위와 같은 고정 revision의
`apps/v4/registry/bases/radix/ui/`에서 직접 읽었습니다. 동일 revision의
[MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)도
다시 확인했습니다. 개별 원본 URL은 `registry/provenance.json`에 있습니다.

[Radix Accordion](https://www.radix-ui.com/primitives/docs/components/accordion)은
heading과 방향키 이동,
[Collapsible](https://www.radix-ui.com/primitives/docs/components/collapsible)은
disclosure 상태,
[Popover](https://www.radix-ui.com/primitives/docs/components/popover)와
[Alert Dialog](https://www.radix-ui.com/primitives/docs/components/alert-dialog)는
focus 이동과 닫기 동작을 제공합니다.
[Slider](https://www.radix-ui.com/primitives/docs/components/slider)는
thumb의 값과 방향키 조작,
[Toggle](https://www.radix-ui.com/primitives/docs/components/toggle)은
눌림 상태를 제공합니다. 브라우저 관찰은 `verification.md`에 기록했습니다.
Breadcrumb는 native link와 `aria-current="page"`를 사용하고, Empty의
media는 장식으로 숨깁니다. Spinner는 이름 있는 status를 사용합니다.

추가한 직접 의존성은 `@radix-ui/react-accordion@1.2.20`,
`@radix-ui/react-collapsible@1.1.20`,
`@radix-ui/react-popover@1.1.23`,
`@radix-ui/react-alert-dialog@1.1.23`,
`@radix-ui/react-avatar@1.2.6`,
`@radix-ui/react-slider@1.4.7`,
`@radix-ui/react-toggle@1.1.18`입니다. 설치된 일곱 패키지의
`package.json`과 LICENSE는 모두 MIT입니다. lockfile에서 이 일곱
패키지의 의존성 closure 46개를 추적했으며 license metadata는
MIT 45개, 0BSD 1개입니다. 실제 보조기술 발표는 확인하지 못했습니다.

## 2026-09-28 빈 범주 편입

Date & time의 Calendar는 공식
[shadcn Calendar](https://ui.shadcn.com/docs/components/radix/calendar)와
고정 revision의
[원본](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/bases/radix/ui/calendar.tsx),
[MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)를
확인해 `react-day-picker@9.14.0` 위에 간소화했습니다.
[DayPicker 접근성 문서](https://daypicker.dev/guides/accessibility)의
날짜 grid, 방향키 이동, 선택 발표와 실제 preview를 대조했습니다.

Data & analytics의 MetricCard는
[Tremor Card 문서](https://www.tremor.so/docs/ui/card)를 참고해 기존
`pyd-card`로 새로 조합했습니다. Tremor
[원본](https://github.com/tremorlabs/tremor/blob/ca4d588f47820ff3d514d37fa4ee08a4222dec11/src/components/Card/Card.tsx)과
[Apache-2.0 LICENSE](https://github.com/tremorlabs/tremor/blob/ca4d588f47820ff3d514d37fa4ee08a4222dec11/LICENSE)를
확인했으며 해당 source 코드는 복사하지 않았습니다. 변화량을 색상에만
의존하지 않고 텍스트로 표시합니다.

File & media의 Dropzone은
[Kibo 문서](https://www.kibo-ui.com/components/dropzone),
[고정 원본](https://github.com/shadcnblocks/kibo/blob/3d63cdb15b79d972e3dc38a10997987672f9b263/packages/dropzone/index.tsx),
[MIT LICENSE](https://github.com/shadcnblocks/kibo/blob/3d63cdb15b79d972e3dc38a10997987672f9b263/license.md)를
확인했습니다. 원본의 `react-dropzone` 사용을 유지하고 내부 context와
미리보기 조합은 현재 필요하지 않아 제외했습니다.
[react-dropzone 공식 README](https://github.com/react-dropzone/react-dropzone/blob/master/README.md)의
`getRootProps`/`getInputProps` 규칙에 맞춰 이름 있는 drop target과
숨겨진 file input을 연결했습니다. 파일 선택·형식·크기 검증만 담당하며
서버 업로드는 하지 않습니다.

AI & agent의 Message와 PromptInput은 AI Elements의
[Message 문서](https://elements.ai-sdk.dev/components/message),
[Prompt Input 문서](https://elements.ai-sdk.dev/components/prompt-input),
[고정 Message 소스](https://github.com/vercel/ai-elements/blob/6a9d5b1822ffb10bba4bd97175f01edd7d8651cd/packages/elements/src/message.tsx),
[고정 Prompt Input 소스](https://github.com/vercel/ai-elements/blob/6a9d5b1822ffb10bba4bd97175f01edd7d8651cd/packages/elements/src/prompt-input.tsx),
동일 revision의
[Apache-2.0 LICENSE](https://github.com/vercel/ai-elements/blob/6a9d5b1822ffb10bba4bd97175f01edd7d8651cd/LICENSE)를
확인했습니다. 메시지 발신자 구분과 입력·전송 동작만 간소화해 편입했고
AI SDK, Streamdown, 첨부파일·모델 선택은 포함하지 않았습니다.
Apache notice와 license 사본은 `THIRD_PARTY_NOTICES.md`와
`licenses/Apache-2.0.txt`에 있습니다.

설치된 `react-day-picker@9.14.0`과 `react-dropzone@14.4.1`의 manifest와
LICENSE는 MIT입니다. lockfile의 두 패키지 의존성 closure 14개에서
license metadata는 MIT 13개, 0BSD 1개입니다. `react-dropzone`은
전송 기능이 없으므로 이 항목을 FileUpload로 표시하지 않았습니다.

## 2026-09-28 폼 입력 묶음

Field는 기존 Label과 control의 연결 규칙을 이 저장소에서 작성했습니다.
Select는 [Radix Select 공식 문서](https://www.radix-ui.com/primitives/docs/components/select)의
trigger, option 키보드 탐색, form value 규칙을 참고했습니다. 설치된
`@radix-ui/react-select@2.3.7`의 `dist/index.mjs`, manifest, MIT LICENSE를
같은 npm release에서 확인했습니다. wrapper 코드는 새로 작성했습니다.
lockfile에서 해당 패키지의 의존성 closure 39개를 추적했으며 license
metadata는 MIT 38개, 0BSD 1개(`tslib@2.8.1`)였습니다.

DatePicker는 기존 Calendar와 Popover를 조합한 원본 코드입니다.
[DayPicker 선택 문서](https://daypicker.dev/selections/selection-modes)와
[Radix Popover 문서](https://www.radix-ui.com/primitives/docs/components/popover)를
확인했습니다. Calendar가 사용하는 `react-day-picker@9.14.0`의
[고정 소스](https://github.com/gpbl/react-day-picker/tree/a5b0c43c0aec821d24d58ed7e274db54a9a38b11)와
설치된 release의 MIT LICENSE를 대조했습니다. 값은 로컬 시각이 아닌
`YYYY-MM-DD` 달력 날짜로 정했고, form 전송은 hidden input으로 처리합니다.
