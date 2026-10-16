# R15 component variant source audit

- 범위: `.worknotes/browser-evidence/geometry-r14/inventory.json`의 Feedback, File & media, Developer tools, AI & agent, Content, Workflow. `markdown`만 제외하고 `markdown-editor` 포함, 총 47개.
- 제약: source-only 읽기 검수. 브라우저·build·Git 및 제품 파일은 건드리지 않음. 이전 R14의 144개 초기 geometry pass는 참고 evidence일 뿐 variants/open/error/disabled 전체 시각 검증으로 확대하지 않음.
- 판정법: `PASS (source geometry)`는 source에 대응하는 component surface/scroll/wrap/shape 역할이 있고 명백한 token/spacing/clipping defect를 찾지 못했다는 뜻. 각 컴포넌트의 live variant/state 렌더는 `UNVERIFIED`이며 catalog caller와 test file 존재는 별도로 표시. 테스트 파일 존재만 geometry 검증 증거로 해석하지 않음.
- 공유 CSS 기준: [design-modes.css](../packages/ui/src/design-modes.css) L1-L24의 scoped token 기본값, L147-L159 Material control/field radius, L450-L453와 L667-L671/L802-L804 scope boundaries, L803-L821 panel/well/reading-plane surface/overflow, L868-L880 card/message/media/dropzone/toast role, L894 stepper marker role, L904 kanban header role. Basic 격리 및 nested Basic scope 규칙을 보존.
- 카탈로그 호출은 [catalog.tsx](../apps/docs/src/catalog.tsx)에서 각 항목의 id 줄을 확인. 기존 source tests는 아래 이름 그대로 표시. 일부 구성요소에는 전용 test 파일이 없으나 이는 본 audit에서 곧바로 결함을 의미하지 않음.

| ID | Source evidence / shape·layout | Catalog / test | 판정 |
|---|---|---|---|
| alert | `alert.tsx` L6,L60-L61: `rounded-sm`, variant/appearance data hooks | catalog L6047; no dedicated test | PASS source geometry; soft/outline/destructive state rendering UNVERIFIED |
| progress | `progress.tsx` L6,L32-L35,L72-L78: linear track clips rounded indicator; circular is fixed 48px, shrink-0 | catalog L6206; no dedicated test | PASS; linear/circular/indeterminate and narrow container visuals UNVERIFIED |
| skeleton | `skeleton.tsx` L21-L23: rectangle/line/circle shapes, intentional pill/circle | catalog L6220; no dedicated test | PASS; shape appearances UNVERIFIED |
| empty | `empty.tsx` L17,L22: min-w-0 stack, rounded surface | catalog L6383; no dedicated test | PASS; action/empty content variants UNVERIFIED |
| result-state | `result-state.tsx` L65-L78,L96-L112: status semantics and delegated Empty/actions | catalog L6403; `result-state.test.mjs` | PASS; pending/success/error and retry rendering UNVERIFIED |
| spinner | `spinner.tsx` L23,L38: named icon/ring/dots/bars/orbit variants | catalog L6435; no dedicated test | PASS; motion/variant visuals UNVERIFIED |
| image | `image.tsx` L78-L123: ratio frame, intentional overflow clip; object-cover/contain; loading/error/missing placeholders | catalog L6577; no dedicated test | PASS; media crop is intentional; image network states UNVERIFIED |
| lightbox | `lightbox.tsx` L80-L96,L122-L154: frame/immersive, viewport-height immersive branch, bounded image, horizontal thumbnail scroller | catalog L6580; `lightbox.test.mjs` | PASS source geometry; open/close, small-height composition and selection states UNVERIFIED |
| image-cropper | `image-cropper.tsx` L262-L274,L302-L356: min-w-0 crop frame/intentional clip, truncated filename, edit controls disable when unavailable | catalog L6608; `image-cropper.test.mjs` | PASS; loaded/error/busy/disabled visuals UNVERIFIED |
| avatar-uploader | `avatar-uploader.tsx` L146-L188: min-w-0 wrapping layout and details capped at 220px; full-width native file input in scoped CSS L901-L903 | catalog L6637; `avatar-uploader.test.mjs` | PASS; selected-image/error/disabled visuals UNVERIFIED |
| dropzone | `dropzone.tsx` L145-L177: status/data hooks, dashed target, break-words error text; drag hook in CSS L875-L876 | catalog L6658; no dedicated test | PASS; empty/dragging/error/disabled visuals UNVERIFIED |
| file-upload | `file-upload.tsx` L64-L139: min-w-0 list and per-file action states | catalog L6676; no dedicated test | PASS; upload/progress/error/disabled row rendering UNVERIFIED |
| message | `message.tsx` L19-L37: max 92% bubble, min-w-0 and anywhere wrapping; design surface hook | catalog L6702; no dedicated test | PASS; user/assistant long-token wrap and appearance UNVERIFIED |
| conversation | `conversation.tsx` L94-L110,L129: fixed 20rem preview viewport with min-h-0 flex log and intentional overflow clipping; scroll region | catalog L6717; no dedicated test | PASS; empty/populated/scroll-to-latest live states UNVERIFIED |
| citation-list | `citation-list.tsx` L17,L61-L104: compact/card variants, flex-wrapped link, compact line clamp 2 | catalog L6739; `citation-list.test.mjs` | PASS; long citation wrapping/clamp visuals UNVERIFIED |
| artifact-viewer | `artifact-viewer.tsx` L107-L124,L163,L212: min-w-0 surface, bounded action, code area scroll | catalog L6759; `artifact-viewer.test.mjs` | PASS; artifact variants/long metadata state visuals UNVERIFIED |
| reasoning | `reasoning.tsx` L36-L72: inline/card; min-w-0, expandable body wraps anywhere, title truncates | catalog L6781; no dedicated test | PASS; open/closed and long-label states UNVERIFIED |
| tool-call | `tool-call.tsx` L42-L87: card/compact; title truncates, input/output pre-wrap and break-word | catalog L6794; no dedicated test | PASS; expanded output/error states UNVERIFIED |
| agent-status | `agent-status.tsx` L80-L126: panel/compact; status and progress roles | catalog L6807; `agent-status.test.mjs` | PASS; active/complete/error/cancel states UNVERIFIED |
| approval-card | `approval-card.tsx` L76-L108: min-w-0 card and pending/sent/error phase actions | catalog L6824; `approval-card.test.mjs` | PASS; pending/sent/error live layout UNVERIFIED |
| prompt-input | `prompt-input.tsx` L43-L62: min-w-0 column, disabled-aware textarea and submit | catalog L6847; no dedicated test | PASS; empty/disabled/submitting layouts UNVERIFIED |
| model-selector | `model-selector.tsx` L22,L120-L146,L155-L174: panel/compact, loading/error/disabled/empty handling; model rows | catalog L6855; `model-selector.test.mjs` | PASS; dropdown/state visuals and narrow labels UNVERIFIED |
| snippet | `snippet.tsx` L9-L34: rounded clipped shell, inner pre scrolls horizontally | catalog L6976; no dedicated test | PASS; very long lines remain in intentional inner scroller; rendered state UNVERIFIED |
| code-block | `code-block.tsx` L40-L69: panel header, title truncation and selectable wrap vs horizontal-scroll code | catalog L6995; `code-block.test.mjs` | PASS; wrap toggle/narrow rendering UNVERIFIED |
| code-editor-shell | `code-editor-shell.tsx` L80-L106,L115-L143: panel/flat, line-number rail shrink-0, editor flex min-w-0/overflow-hidden | catalog L7009; `code-editor-shell.test.mjs` | PASS; disabled and narrow editor rendering UNVERIFIED |
| diff-viewer | `diff-viewer.tsx` L205-L242: table uses 40rem minimum in split view and outer max-height scroll | catalog L7034; `diff-viewer.test.mjs` | PASS; 40rem split content is an intentional horizontal-scroll candidate; narrow split/inline states UNVERIFIED |
| markdown-editor | `markdown-editor.tsx` L69-L117: min-w-0 clipped shell with split/edit/preview regions | catalog L7066; `markdown-editor.test.mjs` | PASS; edit/preview and narrow state composition UNVERIFIED |
| calendar-scheduler | `calendar-scheduler.tsx` L128-L140,L181-L241: container query, min-w-0 cards, event wraps, scroll/grid roles | catalog L7683; `calendar-scheduler.test.mjs` | PASS; day/week/event states and compact width visuals UNVERIFIED |
| stepper | `stepper.tsx` L68-L73,L95-L153: horizontal variant scrolls, 24px circular marker, labels min-w-0 | catalog L7705; no dedicated test | PASS; horizontal/vertical and disabled/completed states UNVERIFIED |
| form-wizard | `form-wizard.tsx` L128-L151: min-w-0 form body, embedded child form boundary | catalog L7726; `form-wizard.test.mjs` | PASS; validation/step transitions and narrow form UNVERIFIED |
| timeline | `timeline.tsx` L47-L77,L110: rounded panel, shrink-0 marker, min-w-0 content | catalog L7756; no dedicated test | PASS; long event/status text wrapping UNVERIFIED |
| kanban | `kanban.tsx` L206-L218,L239-L259: outer x-scroll; fixed 16rem shrink-0 columns and dashed empty drop target | catalog L7770; `kanban.test.mjs` | PASS; fixed column width is intentional; drag/empty states and viewport scrollbar visuals UNVERIFIED |
| gantt | `gantt.tsx` L228-L281,L407: min-w-0 chart shell, task-empty state, explicitly scrollable fixed chart canvas | catalog L7792; `gantt.test.mjs` | PASS; horizontal timeline is intentional; selected/drag proposals and compact viewport UNVERIFIED |
| node-canvas | `node-canvas.tsx` L271-L305,L323,L355-L454: bounded overflow-hidden shell; internal 16–30rem scroll canvas and nodes | catalog L7815; `node-canvas.test.mjs` | PASS; internal scrolling is intentional; zoom/selection/disabled state visuals UNVERIFIED |
| log-console | `log-console.tsx` L16,L48-L60,L73-L84: panel/flat; bounded scroll console, shrink-0 timestamp/level columns | catalog L8140; no dedicated test | PASS; dense log rows and empty state at mobile width UNVERIFIED |
| log-viewer | `log-viewer.tsx` L12,L88-L95,L120-L148: panel/flat, container query, clipped shell with inner controls | catalog L8153; `log-viewer.test.mjs` | PASS; filter/empty/error and narrow variants UNVERIFIED |
| terminal | `terminal.tsx` L101-L107,L126-L169: panel/flat clipped shell, bounded scroll output and min-w-0 input | catalog L8175; `terminal.test.mjs` | PASS; output/disabled/error states UNVERIFIED |
| json-viewer | `json-viewer.tsx` L22,L103-L138,L236-L261: plain/frame, min-w-0 tree values and scrollable control area | catalog L8200; no dedicated test | PASS; expanded/collapsed/deep/long-value states UNVERIFIED |
| page-header | `page-header.tsx` L50-L65: min-w-0 title, wrapping action row | catalog L8397; no dedicated test | PASS; long title/actions wrapping UNVERIFIED |
| content-list | `content-list.tsx` L5,L17-L24: bullet/numbered/plain list structure, relaxed line height and spacing; no framed surface | catalog L8412; no dedicated test | PASS (intrinsic text/list geometry); long content/wrap rendering UNVERIFIED |
| block-editor | `block-editor.tsx` L241-L297,L377-L419: min-w-0 editor, individual block shells and wrapped markdown/code | catalog L8432; `block-editor.test.mjs` | PASS; edit/selection/empty and narrow layouts UNVERIFIED |
| carousel | `carousel.tsx` L143-L172,L221-L226: card/plain variants, min-w-0 slide, circular indicators | catalog L8462; no dedicated test | PASS; nav/edge/long-slide state visuals UNVERIFIED |
| toast | `toast.tsx` L37,L72-L109: info/success/warning/error variants, min-w-0, wrapped content and close action | catalog L8625; no dedicated test | PASS; stacked/long-message/dismissed variants UNVERIFIED |
| notification-center | `notification-center.tsx` L79-L95,L164-L205,L237: min-w-0 shell, wrapped title/message, shrink-0 timestamp/actions | catalog L8649; `notification-center.test.mjs` | PASS; filters/read/unread/empty state visuals UNVERIFIED |
| response-feedback | `response-feedback.tsx` L13-L19,L34-L55: wrapping button row, disabled/pending paths and selected press states; no outer frame | catalog L8679; no dedicated test | PASS (intrinsic controls); selection/submitted state rendering UNVERIFIED |
| board | `board.tsx` L45-L85: min-w-0 panel, wrapped title/status; column/task density represented by grid | catalog L8707; no dedicated test | PASS; dense/empty board and narrow column rendering UNVERIFIED |
| thread | `thread.tsx` L155-L187,L220-L223: composer/error, empty text, reply controls and disabled/pending state paths | catalog L8764; no dedicated test | PASS; reply/editor/error/pending state layout UNVERIFIED |

## Findings and follow-up candidates

No source-proven invalid multi-corner radius, unintended radius escalation, outer horizontal overflow, or missing text-wrap path was found in these 47 components. Their source geometry uses scoped surface hooks and standard spacing tokens, fixed-size shapes where semantically intended, and local scroll containers for oversized timelines/code/boards.

Prioritized visual follow-up candidates are limited to confirming intended internal scrolling at narrow widths or short heights: (1) Lightbox immersive on a short viewport with thumbnails enabled; (2) DiffViewer split mode with its 40rem minimum; (3) CalendarScheduler, Gantt, Kanban and NodeCanvas internal scroll regions; (4) Conversation's fixed-height log and LogConsole/LogViewer/Terminal dense rows; (5) multi-line/wide error or metadata strings in FileUpload, ModelSelector, NotificationCenter, Board and Thread. These are targeted state/viewport checks, not confirmed defects.

Counts: 47/47 source surfaces reviewed; 47 PASS at source-static geometry level; 0 source-proven improve findings; 47 have at least one live visual state or interaction that remains UNVERIFIED here. The previous R14 initial geometry matrices remain broad initial-state evidence only. Parent integration should retain this separation and may reuse the prioritized candidates for additional browser state coverage.

## Handoff

This leaf changed only this note. No product source, shared CSS, catalog, tests, build outputs or Git state were modified. Findings are ready to merge into the parent audit; interactive visual checks remain the parent's runtime scope.
