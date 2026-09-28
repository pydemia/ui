# Component taxonomy와 source 검토

2026-09-27 UTC에 각 source의 공식 사이트, upstream repository와 license
원문을 확인했습니다. 이 표는 category coverage 지도입니다. 같은 category에
표시된 source가 동일한 API나 접근성 품질을 제공한다는 뜻은 아닙니다.
비교 기준은 [MUI 전체 목록](https://mui.com/material-ui/all-components/)과
[Mantine 공식 사이트](https://mantine.dev/)의 일반 제품 UI 범주입니다.
MUI X 같은 유료·추가 제품을 core component 수에 합산하지 않았습니다.

| 범주 | shadcn | Origin snapshot | Kibo | Tremor Raw/Blocks | AI Elements | 이번 내부 구현 |
| --- | --- | --- | --- | --- | --- | --- |
| Actions | Button, Toggle | Button 변형 | Choicebox, Pill | Button | Prompt actions | Button |
| Text inputs | Input, Textarea | Input 변형 | Tags, Combobox | Text Input | Prompt Input | Input, AffixedInput |
| Selection | Checkbox, Radio, Select | 여러 Select 변형 | Choicebox | Select, Date Picker | Model Selector | 없음 |
| Date & time | Calendar, Date Picker | Calendar 변형 | Calendar, Mini Calendar | Date Range, blocks | 없음 | 없음 |
| Navigation | Tabs, Sidebar, Menu | Tabs, Navbar 변형 | 없음 | Page Shell | Conversation navigation | Tabs |
| Layout | Card, Separator, Resizable | Banner, layout 변형 | Deck | Page Shell, Grid Lists | Panel/Canvas | 데모 조합만 |
| Overlays | Dialog, Drawer, Tooltip | Dialog, Popover 변형 | Dialog Stack | Dialog blocks | Artifact | 없음 |
| Feedback | Alert, Progress, Toast | Alert, Notification 변형 | Status, Spinner | Status Monitoring | Tool state | Badge 텍스트 상태 |
| Data display | Badge, Table, Typography | Badge, Table 변형 | Comparison, Rating | KPI Cards, Bar Lists | Sources | Badge, Table |
| Data tables | Data Table pattern | Table 변형 | Table, List | Table Actions/Pagination | 없음 | 단순 Table만 |
| Charts | Chart/Recharts | chart examples | Contribution Graph, Ticker | Area/Line/Bar/Donut | 없음 | 없음 |
| Files & images | Attachment | Upload/Crop examples | Dropzone, Image Crop/Zoom | File Upload blocks | Attachments | 없음 |
| Editor | Textarea | Text editor example | Editor | 없음 | Prompt Input | 없음 |
| Tree & hierarchy | 일반 navigation | Tree example | Tree | 없음 | Node/Canvas | 없음 |
| Workflow | 일반 form | Stepper/Timeline | Kanban, Gantt | Filterbar | Tool, Reasoning | 없음 |
| Code/dev tools | Command | 없음 | Code Block, Snippet | 없음 | Code Block, Artifact | Snippet |
| AI/agent | Message 등 일부 | 없음 | 전문 영역 아님 | 없음 | Conversation, Message, Tool | 없음 |
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
