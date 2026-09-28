# shadcn/ui 기반 재사용 Component Library 구축 Handoff

> 목적: 다른 Codex/ChatGPT session이 현재 논의를 이어 받아 reference 조사, component taxonomy, API/interaction 설계, 구현, preview/QA까지 바로 시작할 수 있도록 하는 작업 명세.

## 1. 목표

`shadcn/ui`를 foundation으로 두고 MUI·Chakra UI·Mantine처럼 폭넓은 ready-made component coverage를 갖는 자체 재사용 component library를 구성한다.

초기 규모는 약 100개를 기준점으로 생각했지만 **상한은 없다**. component 수는 KPI가 아니다. 실제 재사용 가치, category coverage, semantic/interaction contract가 분명하면 100개를 넘어 확장하고, 중복이면 100개 미만으로 통합해도 된다.

핵심은 여러 외부 library를 runtime에서 섞어 쓰는 것이 아니라, 각 reference의 장점을 분해해 `shadcn/ui`/Base UI 기반의 일관된 내부 component contract로 재구성하는 것이다.

```text
MUI / Chakra / Mantine / Tremor / Origin / Kibo / AI Elements / React Aria / real products
                                  ↓
                         reference research
                                  ↓
              behavior / API / UX / visual decomposition
                                  ↓
                    shadcn/Base UI implementation
                                  ↓
                  reusable internal component library
```

## 2. 결정된 방향

- `shadcn/ui`는 foundation과 registry convention으로 사용한다.
- 외부 reference의 API를 그대로 노출하는 wrapper library를 만들지 않는다.
- MUI는 **breadth, enterprise/data-entry, state/API completeness**를 주로 참고한다.
- Chakra UI는 **composition, semantic API, accessible compound patterns**를 참고한다.
- Mantine은 **ready-made breadth, application productivity, form/date/component inventory**를 참고한다.
- Tremor는 **data/analytics/KPI/chart/filter/date-range/dashboard** 영역의 주요 reference다.
- Origin UI는 **일반 component의 다양한 실전 variation**을 찾는 reference다.
- Kibo UI는 **Gantt/Kanban/Dropzone/Code 등 복잡한 functional component** reference다.
- AI Elements는 **AI/Agent-native components**의 주요 reference다.
- React Aria는 복잡한 selection/focus/keyboard interaction의 accessibility reference다.
- TanStack은 DataTable/virtualized/headless behavior reference다.
- Magic UI와 Motion Primitives는 motion/marketing layer에 선택적으로 참고한다.
- Aceternity/Cult 등은 visual/experimental reference로 보되 license를 검증하지 않은 code를 internal registry에 복사하지 않는다.

## 3. Reference 사용 원칙

Reference는 gallery가 아니라 **구체적인 디자인·interaction 문제의 근거**로 사용한다. 한 source 전체를 그대로 따라가지 말고 source마다 소유 범위를 정한다.

예:

```text
DataTable
├─ shadcn + TanStack → headless composition / project ownership
├─ MUI Data Grid     → state/API completeness / enterprise behavior
├─ Chakra            → simple composition / readable API
├─ Mantine           → application ergonomics
└─ shipped products  → density / toolbar / selection / bulk-action UX
```

각 REF는 가능하면 다음을 기록한다.

```text
REF-ID
URL / repository / screenshot
확인일
관찰한 component/state
관찰 사실
적용할 특성
적용하지 않을 특성
code reuse 여부
license / use condition
연결된 internal component
```

## 4. 초기 Component Taxonomy

아래는 현재 **초기 후보 148개**다. 전체 개수는 완료 조건이 아니다. 조사 후 category gap은 추가하고, contract가 겹치는 항목은 variant/slot/composition으로 통합한다.

### Actions

역할: action/command primitives  
우선 reference: shadcn, MUI, Chakra

- `Button` · `IconButton` · `ButtonGroup` · `SplitButton`
- `Toggle` · `ToggleGroup` · `CopyButton` · `ActionMenu`

### Inputs & Selection

역할: data entry and selection  
우선 reference: MUI, Chakra, Mantine, shadcn/Base UI, React Aria

- `Input` · `Textarea` · `NumberInput` · `PasswordInput`
- `SearchInput` · `InputGroup` · `Field` · `Select`
- `NativeSelect` · `Combobox` · `Autocomplete` · `MultiSelect`
- `TagsInput` · `Checkbox` · `CheckboxCard` · `RadioGroup`
- `RadioCard` · `Switch` · `Slider` · `RangeSlider`
- `SegmentedControl` · `PinInput` · `ColorInput` · `Rating`

### Date & Time

역할: date/time selection  
우선 reference: MUI X, Mantine, shadcn, Tremor

- `Calendar` · `DatePicker` · `DateRangePicker` · `TimePicker`
- `DateTimePicker` · `MonthPicker` · `YearPicker`

### Navigation

역할: global/local navigation  
우선 reference: shadcn, MUI, Chakra, Mantine

- `Link` · `Breadcrumb` · `Tabs` · `NavigationMenu`
- `Menubar` · `Pagination` · `Stepper` · `Sidebar`
- `BottomNavigation` · `AnchorNav` · `CommandPalette` · `TreeNav`

### Layout & Surfaces

역할: layout and visual grouping  
우선 reference: MUI, Chakra, Mantine, shadcn

- `Box` · `Stack` · `Inline` · `Flex`
- `Grid` · `Container` · `AspectRatio` · `ScrollArea`
- `Card` · `Panel` · `Separator` · `ResizablePanel`
- `AppShell`

### Overlay & Disclosure

역할: layered/disclosed interaction  
우선 reference: shadcn, MUI, Chakra

- `Dialog` · `AlertDialog` · `Drawer` · `Sheet`
- `Popover` · `Tooltip` · `HoverCard` · `DropdownMenu`
- `ContextMenu` · `Accordion` · `Collapsible`

### Feedback & Status

역할: system/user feedback  
우선 reference: shadcn, MUI, Chakra, Mantine

- `Alert` · `Toast` · `Progress` · `CircularProgress`
- `Spinner` · `Skeleton` · `Badge` · `StatusIndicator`
- `EmptyState` · `ResultState`

### Data Display

역할: structured information display  
우선 reference: MUI, Chakra, Mantine, TanStack, Kibo

- `Avatar` · `AvatarGroup` · `List` · `DataList`
- `Table` · `DataTable` · `Tree` · `Timeline`
- `Stat` · `KeyValue` · `Kbd` · `Code`

### Data & Analytics

역할: analytics and visualization  
우선 reference: Tremor, MUI X, shadcn Charts

- `MetricCard` · `ChartContainer` · `BarChart` · `StackedBarChart`
- `LineChart` · `AreaChart` · `DonutChart` · `Sparkline`
- `Legend` · `ChartTooltip` · `FilterBar` · `DateRangeFilter`

### File & Media

역할: file/media handling  
우선 reference: Kibo, Mantine, Chakra

- `FileUpload` · `Dropzone` · `Image` · `AvatarUploader`
- `ImageCropper` · `Carousel` · `Lightbox`

### Content & Developer Tools

역할: technical/content workspaces  
우선 reference: Kibo, AI Elements, Monaco/CodeMirror references

- `CodeBlock` · `CodeEditorShell` · `DiffViewer` · `JsonViewer`
- `Terminal` · `LogViewer` · `Markdown` · `RichTextEditor`

### AI & Agent

역할: LLM/agent interaction  
우선 reference: AI Elements, ChatGPT/Claude/Cursor product references

- `Conversation` · `Message` · `PromptInput` · `Reasoning`
- `ToolCall` · `Artifact` · `ModelSelector` · `Citation`
- `AgentStatus` · `ApprovalCard`

### Workflow & Productivity

역할: complex productivity workflows  
우선 reference: Kibo, React Flow, MUI/enterprise references

- `Kanban` · `Gantt` · `CalendarScheduler` · `TimelineEditor`
- `NodeCanvas` · `InspectorPanel` · `MasterDetail` · `SplitView`

### Marketing & Motion

역할: selective marketing/motion patterns  
우선 reference: Magic UI, Motion Primitives; Aceternity/Cult as reference-first

- `BentoGrid` · `Marquee` · `AnimatedNumber` · `MotionReveal`
- `Morph` · `TextEffect`

## 5. Component 추가/통합 기준

새 component를 추가할 조건:

- semantic role이 기존 component와 다르다.
- focus/keyboard/selection interaction이 독립 contract를 요구한다.
- state model이 충분히 복잡하고 여러 화면에서 반복된다.
- 반복되는 조합을 reusable API로 묶으면 오류·불일치가 줄어든다.
- domain-specific behavior가 primitive composition만으로 매번 재작성되고 있다.
- accessibility behavior를 중앙에서 보장할 가치가 있다.

새 component 대신 기존 component의 variant/slot/composition을 우선할 조건:

- color/radius/shadow/spacing만 다르다.
- 동일한 semantic action을 화면별 명칭으로 나누려 한다.
- 단일 페이지에서만 필요한 layout 조합이다.
- marketing 장식 때문에 generic API가 오염된다.

## 6. 각 Component의 Contract

최종 component는 최소한 다음을 정의한다.

```text
name / category / purpose
semantic role
props / slots / composition model
variants / sizes
states
events
controlled / uncontrolled model
tokens
responsive behavior
keyboard interaction
focus entry / containment / restore
accessible name / description
loading / empty / error / disabled
long text / localization / RTL
reduced-motion behavior
source references
license / provenance
tests / visual QA
```

### Metadata 예시

```yaml
name: DateRangePicker
category: date-time
status: candidate
references:
  - source: MUI X
    role: interaction-state-api
  - source: Tremor
    role: analytics-usage
  - source: shadcn
    role: primitive-visual-base
implementation:
  foundation: shadcn/Base UI
license:
  code_origin: internal
  references_are_not_code_dependencies: true
accessibility:
  keyboard: required
  focus: required
  screen_reader: required
```

## 7. Visual/Design Normalization

외부 reference가 달라도 최종 library는 하나의 visual language를 가져야 한다.

기본 방향:

- 낮거나 중간 수준의 radius
- 절제된 shadow
- 명확하지만 과도하지 않은 border
- compact ~ moderate density
- neutral product typography
- semantic design tokens
- restrained motion + reduced-motion 대안
- 동일 icon family와 icon sizing grammar

필수 token domain:

```text
color
typography
spacing
control-size / density
radius
border
shadow/elevation
z-index
motion duration/easing
focus ring
data-viz palette
```

특정 upstream의 visual identity(Material, Mantine 기본 rounded SaaS, Tremor theme 등)를 그대로 복제하지 않는다.

## 8. License / Provenance

- 공식 docs/repository에서 **작업 시점의 현재 license를 다시 검증**한다.
- reference로 학습한 것과 source code를 복사/수정한 것을 구분한다.
- vendored/copied code는 원 repository/path와 가능하면 tag/commit을 기록한다.
- MIT/Apache-2.0 등 notice 조건을 dependency/license inventory에 남긴다.
- custom/commercial/restricted license source는 명시적 검토 없이 internal registry에 복사하지 않는다.
- community registry는 shadcn-compatible이라는 이유로 MIT라고 가정하지 않는다.

현재 대화에서 확인해 온 방향은 다음과 같지만 handoff를 실행하는 session에서 재검증한다.

```text
shadcn/ui          → MIT
Kibo UI            → MIT
Magic UI           → MIT
Cult UI            → MIT
Motion Primitives  → MIT
AI Elements        → Apache-2.0
Tremor             → artifact/repository별 확인
Aceternity UI      → custom/restricted; reference-first
```

## 9. 구현 구조

기존 repository convention이 있으면 우선한다. 신규 구조 후보:

```text
src/
  components/
    ui/            # generic reusable components
    data/          # analytics/data-viz
    ai/            # AI/agent
    workflow/      # kanban/gantt/canvas
    content/       # code/markdown/editor
  blocks/          # page-level reusable compositions
  hooks/
  tokens/
  registry/

docs/ui/
  COMPONENTS.md
  REFERENCES.md
  LICENSES.md
  DECISIONS.md
  QA.md
```

shadcn Registry로 배포할 계획이면 registry schema와 install/copy workflow를 초기부터 고려한다.

## 10. 구현 순서

### Phase 0 — Baseline

- framework/package manager/React/Tailwind 확인
- `components.json` 확인
- Base UI/Radix 사용 상태 확인
- 현재 tokens/theme/components inventory 확인
- build/lint/typecheck/test/preview 방법 확인

### Phase 1 — Taxonomy & Matrix

- 위 taxonomy를 실제 repository 요구에 맞게 수정
- MUI/Chakra/Mantine/Tremor 등 source별 mapping
- missing / duplicate / specialized component 분류
- reference 및 license matrix 작성

### Phase 2 — Foundation

가장 자주 쓰는 약 20~30개부터 구현/정규화한다. 예:

```text
Button IconButton
Input Textarea Field
Select Combobox Checkbox RadioGroup Switch
Tabs Pagination
Dialog Drawer Popover Tooltip DropdownMenu
Card Stack Grid Container Separator
Alert Toast Progress Skeleton Badge
Table
```

### Phase 3 — Application breadth

Date/Time, advanced inputs, navigation, richer data display, files/media를 추가한다.

### Phase 4 — Specialized

- Tremor reference 기반 Data/Analytics
- AI Elements reference 기반 AI/Agent
- Kibo/React Flow reference 기반 Workflow/Developer Tools
- React Aria/TanStack reference 기반 complex interaction

### Phase 5 — Blocks / Profiles

개별 component가 실제 화면에서 일관되게 조합되는지 검증할 reusable profile/block을 만든다.

최소 profile:

1. Neutral Product
2. Dense Enterprise
3. Data / Analytics
4. AI Workspace
5. Developer Tool
6. Editorial / Research

## 11. Preview / Component Library Site

Component library 사이트는 사람과 AI 모두가 reference로 사용할 수 있게 한다.

각 component page:

- rendered preview
- variants / sizes / states
- light / dark
- code snippet
- props/contract
- keyboard/accessibility notes
- source/reference/provenance
- related components
- copy/install command

검색 축:

- component name
- category
- tag
- use case
- reference source

AI가 component를 검색·선택할 수 있도록 semantic metadata와 registry index를 제공한다.

## 12. QA

각 component는 가능한 범위에서 아래를 확인한다.

- TypeScript typecheck
- lint / format
- production build
- primary interaction
- keyboard navigation
- visible focus
- disabled/loading/error states
- light/dark
- long text / localization
- narrow/wide container
- reduced motion
- 실제 browser screenshot visual review

실행하지 않은 검증을 pass로 기록하지 않는다. 자동 accessibility test 하나로 전체 접근성 준수를 주장하지 않는다.

## 13. 첫 Milestone

첫 session에서 전체 inventory를 한 번에 구현하지 않는다.

```text
✓ repository baseline 확인
✓ component taxonomy/reference/license matrix 초안
✓ shared design token grammar
✓ foundation component 약 20~30개
✓ MUI/Chakra/Mantine/Tremor 등 최소 3개 reference family의 실제 비교 기록
✓ preview/demo
✓ keyboard/focus + light/dark 확인
✓ build/typecheck/lint 실행
✓ provenance/license 기록
```

이후 category 단위로 확장한다. 100개 도달 여부가 milestone이 아니다.

## 14. 적용할 pydemia Skills

작업 시작 시 `https://skills.pydemia.ai/skills`의 현재 원문을 확인하고 필요한 것만 적용한다.

- `frontend-design-workflow`
- `product-ui-ux-design`
- `reference-research`
- `frontend-development`
- `software-engineering`
- 필요 시 `web-publishing`, `editorial-frontend-ui`, `pydemia-coding-style`

Reference는 구체적 디자인 질문의 근거로 쓰고, source authority·공개 접근성·유지보수성·license를 확인한다.

## 15. Non-goals

- component 개수를 목표로 맞추지 않는다.
- MUI/Chakra/Mantine wrapper를 만들지 않는다.
- 외부 design identity를 그대로 복제하지 않는다.
- community registry를 bulk mirror하지 않는다.
- style variation마다 별도 component를 만들지 않는다.
- page-specific UI를 무조건 generic component로 승격하지 않는다.
- license가 불명확한 code를 vendoring하지 않는다.

## 16. 최종 목표

```text
broad reference pool
        ↓
component taxonomy
        ↓
reference-by-role
        ↓
shadcn/Base UI implementation
        ↓
normalized design + accessibility contract
        ↓
pre-defined reusable components
        ↓
blocks / profiles / AI-readable registry
```

개발자 입장에서는 MUI/Mantine처럼 **필요한 component가 이미 준비되어 있는 경험**을 제공하되, 실제 source, visual system, API contract, long-term maintenance ownership은 자체 shadcn 기반 library가 갖도록 만든다.