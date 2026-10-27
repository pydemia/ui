# shadcn.io 대비 ui.pydemia.ai 구성 검토

기준일: 2026-10-27 (Asia/Seoul). 요청 범위는 공개된 두 사이트의 컴포넌트와 문서 구성 비교이며 구현·배포는 하지 않았다.

## 확인 방법과 범위

- `https://www.shadcn.io/ui`의 현재 HTML에 들어 있는 구조화 목록 175개와 개별 설명을 확인했다. shadcn.io는 `ui.shadcn.com`의 공식 shadcn/ui와 별개인 프로젝트다. shadcn.io 목록에는 기본 컨트롤뿐 아니라 AI 합성 패턴, 장식 효과, 기기 목업도 섞여 있다.
- `https://ui.pydemia.ai/r/registry.json`을 직접 조회했다. 175개 항목 중 `registry:ui` 172개, `registry:lib` 3개다. 레지스트리 항목 수를 컴포넌트 수로 간주하지 않는다. 공개 레지스트리 이름 목록은 로컬 `registry.json`과 일치했다.
- 실제 동작 차이는 `packages/ui/src/components/`의 구현과 `apps/docs/src/catalog.tsx`의 문서 구조를 확인했다. 단순 이름 정규화로 같은 이름 66개가 겹치지만, 이 수치로 기능 충족률을 계산하지 않는다.
- 대표 비교 대상인 ColorInput, Coachmark, Conversation, AnchorNav, CodeEditorShell, WorkPlan, ToolCallGroup의 공개 item JSON도 HTTP 200으로 확인했다. 공개 ColorInput의 `type=color`·hex 제한, Coachmark의 단계 표시, Conversation의 새 메시지 스크롤, AnchorNav의 현재 섹션 추적, CodeEditorShell의 textarea 사용이 로컬에서 확인한 계약과 일치했다. 공개 문서 JS에는 live preview·Usage·accessibility 표기가 있고 `API Reference` 표기는 없었다.
- 현재 작업 트리에는 다른 세션의 미커밋 변경이 많다. 이번 검토에서는 이를 수정하지 않았다. 공개 사이트에 없는 미래 변경 가능성은 판정에 넣지 않았다.

## 확인된 대응 관계

| shadcn.io | Pydemia | 판정 |
| --- | --- | --- |
| Sonner / Toast | Toast, Snackbar, NotificationCenter | 알림 기능 있음. 이름 차이를 결손으로 세지 않음 |
| Command | CommandPalette | 유사 기능 있음 |
| Input OTP | PinInput | 유사 기능 있음 |
| Sheet / Resizable / Steps | Drawer / ResizablePanels / Stepper | 유사 기능 있음 |
| Table of Contents | AnchorNav | 현재 섹션 추적, 계층·접기, 스크롤 컨테이너 지원. 실질적 대응 있음 |
| Message Scroller / Sources / Plan / Tool | Conversation / CitationList / WorkPlan / ToolCall·ToolCallGroup | 기본 대화 스크롤, 출처, 계획·도구 상태 이미 있음 |
| Chart | DataChart, DonutChart 외 여러 분석 차트 | Pydemia의 차트 종류가 더 세분화됨 |

## 실제 차이와 제안 우선순위

| 우선 | 차이 | 근거와 제안 |
| --- | --- | --- |
| 높음 | 문서 깊이 | Pydemia 카탈로그 계약은 항목당 설명·Usage 코드·preview 하나를 기본으로 한다. 개별 preview가 상태 전환을 보여주기도 하지만 props/API 표, 키보드 조작, 대표 상태별 예시가 표준화돼 있지 않다. shadcn.io 개별 페이지는 여러 demo, 접근성, API reference를 제공한다. 새 항목을 대량 추가하기 전에 자주 쓰는 입력·오버레이·데이터 컴포넌트부터 문서 계약을 확장하는 편이 사용성에 직접적이다. |
| 높음 | 고급 Color Picker | `ColorInput`은 브라우저 `type=color`와 `#RRGGBB` 텍스트 입력이다. shadcn.io Color Picker는 색상 영역, hue/alpha 채널, 포맷 전환, eyedropper, swatch 등을 제공한다. 디자인 편집 용례가 있다면 기존 `ColorInput` 확장 또는 별도 `ColorPicker` 계약을 검토한다. |
| 중간 | 제품 둘러보기 Tour | `Coachmark`는 개별 대상의 안내·단계 표시·다음 동작을 제공하나 현재 단계 배열, 대상 간 자동 이동, 이전·건너뛰기·완료 상태, 대상 스포트라이트를 내부에서 관리하지 않는다. shadcn.io Tour는 이 흐름을 제공한다. 여러 기능을 연결해 안내해야 하는 제품 화면이 있다면 별도 합성 컴포넌트가 유용하다. |
| 중간 | AI 대화의 일부 고급 표현 | Pydemia에는 기본 대화, 도구 호출, 계획, 팀 상태, 출처 목록, ArtifactViewer가 있다. shadcn.io의 Message Branch(재생성 버전 전환), Generated Image, Speech Input·Transcription, Audio Player, Sandbox Run·Web Preview처럼 특정 결과 형식을 다루는 항목은 공개 레지스트리에서 대응 항목을 확인하지 못했다. AI 제품 사용처가 있는 것부터 묶어 추가한다. |
| 중간 | 선택·입력의 특수 계약 | 항상 펼쳐진 단일/다중 선택 Listbox, 필기 서명 Signature Pad, QR Code 등은 직접 대응 항목이 없다. 사용 화면이 확인되면 추가하되 목록 수를 맞추려고 모두 편입할 이유는 없다. |
| 중간 | 개발자·파일 작업 표현 | `Tree`는 일반 계층 탐색이고 File Tree의 파일별 상태·변경 표시와는 범위가 다르다. `CodeEditorShell`은 textarea 기반이며 shadcn.io Code Editor의 입력 중 syntax highlighting·Tab 들여쓰기는 없다. 개발자 도구 화면에서 반복 사용되면 확장 후보가 된다. |
| 별도 제품 범위 | 설치 가능한 화면 블록 | Pydemia 문서에는 Profile, Operations, Review, Agent 등 합성 예시가 있다. 공개 registry는 UI/lib 항목이고 설치 가능한 블록 카탈로그는 확인되지 않는다. shadcn.io의 Blocks는 화면 섹션을 모아 검색·미리보기·설치하게 한다. 이 영역은 컴포넌트 부족과 구분해야 하며 shadcn.io 블록 코드 다수는 Pro 대상이다. |

3D Card, Animated Beam, device mockup 등 장식·마케팅 항목은 현재 Pydemia의 범용 제품 UI 목적에 비춰 직접적인 결손으로 판단하지 않았다. React 외 Vue/Svelte/Solid 지원도 컴포넌트 단위 결손이 아닌 플랫폼 범위 결정이다.

## 출처

- shadcn.io 목록: https://www.shadcn.io/ui
- shadcn.io Color Picker: https://www.shadcn.io/ui/color-picker
- shadcn.io Tour: https://www.shadcn.io/ui/tour
- shadcn.io AI 목록: https://www.shadcn.io/ai
- shadcn.io Message Branch: https://www.shadcn.io/ui/message-branch
- shadcn.io Code Editor: https://www.shadcn.io/ui/code-editor
- shadcn.io Blocks: https://www.shadcn.io/blocks
- Pydemia 공개 레지스트리: https://ui.pydemia.ai/r/registry.json
- Pydemia 구현·문서: `packages/ui/src/components/color-input.tsx`, `coachmark.tsx`, `conversation.tsx`, `anchor-nav.tsx`, `code-editor-shell.tsx`, `apps/docs/src/catalog.tsx`, `apps/docs/src/main.tsx`.

## 검증 상태와 인계

공개 URL과 레지스트리 응답, 로컬 구현·문서 계약을 확인했다. 전체 175개 항목의 개별 동작, 유료 블록의 소스, 양쪽 사이트의 모든 브라우저·보조기술 동작은 검증하지 않았다. 후속 작업은 실제 소비자 화면의 필요성을 확인하고, 위 표의 후보별로 `기존 API 확장 / 새 컴포넌트 / 설치 가능한 조합 예시 / 보류`를 판정하면 된다. 이번에는 코드·배포·기존 기록을 변경하지 않았다.
