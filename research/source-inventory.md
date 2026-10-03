# Component taxonomy와 source 검토

## 2026-10-03 FunnelChart

가입·구매 등의 단계별 도달률은 `BarList`의 독립 범주 비교나
`BulletChart`의 단일 목표 비교와 다릅니다. `FunnelChart`는
pydemia/ui 원본 React·Tailwind 코드입니다. 외부 component 소스를
복사하지 않았고 새 npm 의존성도 없습니다. registry 의존성은
기존 `pyd-utils`뿐입니다. 외부 component upstream은 없으므로
동일 revision의 소스·LICENSE 대조 대상도 없습니다.

[W3C WAI의 Use of Color 해설](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color)을
확인했습니다. 색·막대 길이만으로 전환 정보를 전하지 않도록 단계명,
정확한 건수와 도달률을 텍스트로 표시합니다. W3C 예제 코드는
복사하지 않았습니다.

## 2026-10-03 BulletChart

운영 화면에서는 범주 간 크기(`BarList`)와 별개로 한 실적을 목표와
비교해야 합니다. `Progress`의 작업 진행률은 이 목표 표시와 의미가
다릅니다. `BulletChart`는 pydemia/ui 원본 React·Tailwind 코드로
만들었고 외부 component source와 새 npm 의존성은 없습니다.
registry 의존성은 기존 `pyd-utils`뿐입니다.
[W3C WAI의 Use of Color 해설](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color)을
참고해 현재 값·목표·최대를 텍스트로 표시하고 막대와 목표선을
장식으로 처리했습니다. 문서의 예제 코드는 복사하지 않았습니다.

## 2026-10-03 BarList

`DataChart`는 시계열·다중 계열 차트에 맞고 `DataList`에는 크기
비교가 없습니다. 긴 범주 이름과 단일 수치를 운영 화면에서 함께
비교하도록 `BarList`를 원본 React·Tailwind로 구현했습니다.
외부 component 소스를 복사하지 않았고 새 npm 의존성도 없습니다.
registry 의존성은 기존 `pyd-utils`뿐입니다.
[W3C WAI의 Use of Color 해설](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color)을
참고해 범주 이름과 정확한 값을 항상 텍스트로 보여 주고 막대는
장식으로 처리했습니다. 이 문서의 예제 코드는 사용하지 않았습니다.
실제 screen reader·touch·Safari는 아직 확인하지 않았습니다.

## 2026-10-03 AppShell floating disclosure

문서 preview와 분석 화면이 같은 floating bubble·panel의 열림 상태,
Escape 닫기와 focus 복귀를 각각 구현하고 있었습니다. 기존
`AppFloatingBubble`·`AppFloatingPanel`을 조합한
`AppFloatingDisclosure`로 공통 동작을 공급합니다. pydemia/ui 원본
React·Tailwind 코드이며 새 npm 의존성이나 외부 component source는
없습니다. 기존 `pyd-utils`만 사용합니다.
[WAI APG Disclosure Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)의
button·`aria-expanded`·`aria-controls`·Enter/Space 동작을 확인했고
source는 복사하지 않았습니다. 실제 screen reader·touch·Safari는
검사하지 않았습니다.

## 2026-10-03 FormWizard source 확인

여러 단계의 입력·검증·완료 요청은 기존 `Stepper`의 상태 표시와
구분됩니다. pydemia/ui의 원본 React·Tailwind 구현이며 외부
component source를 복사하지 않았습니다. 기존 `pyd-stepper`·
`pyd-button`·`pyd-utils`만 사용하고 새 npm 의존성은 없습니다.
native form의 constraint validation과 submit 순서는
[WHATWG HTML Standard](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#constraint-validation)에서
확인했습니다. 입력값과 완료 저장은 호출자가 관리하며 실제 screen
reader·touch·Safari 검증은 남았습니다.

## 2026-10-03 DataTable 행 상세 source 확인

기존 `DataTable`의 pydemia/ui 원본 React 구현을 확장했습니다.
Table·Button 등 기존 registry dependency만 사용하며 새 npm
의존성이나 외부 component source는 없습니다. 이름 있는 native
버튼의 열림 상태와 키보드 활성화는
[WAI-ARIA APG Disclosure Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)을
참고했습니다. `renderRowDetails`의 내용은 호출자가 제공하고
DataTable은 임의 HTML을 해석하지 않습니다. 실제 screen reader
발표는 검사하지 않았습니다.

## 2026-10-02 BlockEditor 구조 이력 source 확인

구조 변경 이력은 기존 `BlockEditor`의 원본 React 구현입니다. 새
npm 의존성이나 외부 editor source를 추가하지 않았습니다. native
textarea의 입력·붙여넣기·undo는 그대로 두고 블록의 추가·삭제·이동·
형식 변경만 별도 이력으로 기록합니다. [W3C Input Events Level 2](https://www.w3.org/TR/input-events-2/)와
[Selection API](https://www.w3.org/TR/selection-api/),
[WHATWG contenteditable 명세](https://html.spec.whatwg.org/multipage/interaction.html#making-document-regions-editable-the-contenteditable-content-attribute)를
검토했습니다. `contenteditable`의 선택·입력·undo를 섞어 반쪽짜리
WYSIWYG를 제공하지 않으며, `RichTextEditor`의 별도 조사 대상으로
남깁니다.

## 2026-10-02 ArtifactViewer source 확인

AI 초안·코드 결과물의 revision을 읽고 직전 revision과 비교하는
사용처입니다. `ToolCall`의 일회성 결과나 `CodeBlock`의 단일 소스와
달리 선택한 revision·보기 방식을 함께 관리합니다. React·Tailwind
원본 구현이며 외부 component 코드를 복사하지 않았습니다.
기존 `Button`·`CopyButton`·`DiffViewer`·`Markdown`·`utils`만
사용하고 새 npm 의존성은 없습니다. shadcn/ui에서 수정한 하위
component의 고정 revision·MIT 고지는 기존 provenance를 재사용합니다.

[WAI-ARIA APG Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)의
native 버튼과 `aria-pressed` 의미만 참고했습니다. 결과물은 React
텍스트와 저장소의 안전한 Markdown 부분집합으로 표시하고 임의 HTML을
실행하지 않습니다. 실제 screen reader 발표는 확인하지 않았습니다.

## 2026-10-02 BlockEditor source 확인

공지·운영 문서를 작성할 때 제목·문단·목록의 순서를 구조화해 저장하는
사용처입니다. Markdown 문자열을 입력하는 `MarkdownEditor`와 데이터
형식이 다릅니다. pydemia/ui에서 React·Tailwind로 원본 구현했으며
외부 editor source를 복사하지 않았습니다. `pyd-button`·
`pyd-textarea`·`pyd-utils`를 사용하고 새 npm 의존성은 없습니다.
의존한 shadcn/ui 수정 component의 기존 고정 revision·MIT 고지는
provenance 기록을 재사용합니다.

[WHATWG HTML textarea 명세](https://html.spec.whatwg.org/multipage/form-elements.html#the-textarea-element)는
native 다중 행 일반 텍스트 편집의 의미를 확인하는 참고 자료입니다.
블록 작성과 읽기 전용 렌더링은 이 저장소의 원본이며 upstream
component revision이나 별도 upstream LICENSE를 새로 가져오지
않았습니다. 이름 있는 입력·형식 선택·버튼과 native heading/list를
사용합니다. 실제 screen reader 발표는 확인하지 않았습니다.

## 2026-10-02 ResultState source 확인

저장·가져오기 등 비동기 작업의 진행·성공·실패와 재시도를 반복해
구성하는 사용처입니다. `ResultState`는 pydemia/ui의 원본 React·
Tailwind 조합이며 외부 component 코드를 복사하지 않았습니다.
기존 `pyd-empty`·`pyd-spinner`·`pyd-button`·`pyd-utils`만 사용하고
새 npm 의존성은 없습니다. 의존 component의 shadcn/ui 고정 revision
`98a1fe67b439324ddc857f47fbdce056600a4329` source와 MIT
LICENSE는 기존 provenance·소비자 고지를 재사용합니다. 이름 있는
상태·오류와 native 재시도 버튼을 제공하며 실제 screen reader
발화는 미검증입니다.

## 2026-10-02 NotificationCenter source 확인

제품 화면에서 다시 확인할 알림의 읽음 상태와 필터를 유지하는 용례입니다.
기존 `Toast`는 일시적인 안내이며 `Timeline`은 사건을 읽는 목록입니다.
`NotificationCenter`는 pydemia/ui에서 작성한 React·Tailwind 원본으로
외부 component source를 복사하지 않았습니다. `pyd-utils`와 공통 token만
사용하며 새 npm 의존성은 없습니다. 고정 upstream source·LICENSE를 새로
대조할 대상은 없습니다. 목록·상태 텍스트·native button/link를 사용했고
Chromium에서 필터·읽음·초점과 390px·dark 배치를 확인했습니다. 실제
screen reader 발화는 확인하지 않았습니다.

## 2026-10-02 LogViewer source 확인

운영·배포 화면은 시간순 로그를 읽는 것 외에 메시지 검색과 수준별
검토가 필요합니다. 기존 `LogConsole`은 로그 표시만 제공하고
`Terminal`은 명령 실행을 요청하므로, 이 사용처를 `LogViewer`로
묶었습니다. pydemia/ui에서 작성한 원본 React 조합이며 외부 source
코드를 복사하지 않았습니다.

기존 `pyd-log-console`·`pyd-input`·`pyd-native-select`·`pyd-utils`에
의존하고 새 npm 패키지는 없습니다. 의존 component의 고정 upstream
revision과 LICENSE는 기존 provenance와 소비자 고지를 재사용합니다.
이름 있는 로그와 검색·수준 control, 결과 건수, 빈 원본·빈 결과를
구분합니다. 실제 screen reader·touch·Safari·RTL은 미검증입니다.

## 2026-10-02 AppShell 표시 형태

기존 `AppShell`은 border·radius를 직접 덮어써 전체 화면에 넣었고,
floating 도움말은 원형 버튼만 제공했습니다. 이 저장소의 원본
React·Tailwind 구현에 `canvas`와 `pill` 표시를 추가했습니다. 기존
`pyd-utils`와 공통 token만 사용하며 새 npm 의존성이나 외부 component
source는 없습니다. provenance의 원본 출처·의존성·접근성 설명은
그대로 정확해 수정하지 않았습니다.

## 2026-10-02 Empty·Skeleton 표시 형태

기존 `Empty`·`Skeleton`의 표시 선택을 확장했습니다. 두 component는
이미 조사한 shadcn/ui revision
`98a1fe67b439324ddc857f47fbdce056600a4329`의 수정본입니다.
공식 문서·같은 revision의 원본 파일과 MIT LICENSE는 아래 foundation
조사와 `registry/provenance.json`에 기록돼 있습니다. 이번 변경은 새
upstream code를 가져오지 않고 기존 React·`pyd-utils`와 공통 token만
사용합니다. media의 장식 처리와 상위 loading 설명 규칙도 유지합니다.

## 2026-10-02 Lightbox source 확인

갤러리 이미지 확대·이전/다음 탐색·닫은 뒤 focus 복귀가 반복되는
사용처입니다. 기존 `Image`는 단일 그림의 로드 상태, `Carousel`은
페이지 내 슬라이드, `Dialog`는 일반 modal이므로 이 조합의 사용
규칙을 `Lightbox`로 제공합니다. 이 저장소에서 작성한 원본 구현이며
외부 component 코드를 복사하지 않았습니다.

registry 의존성은 기존 `pyd-button`·`pyd-dialog`·`pyd-image`·
`pyd-utils`이며 새 npm 의존성은 없습니다. `Dialog`가 사용하는
`@radix-ui/react-dialog@1.1.23`과 shadcn/ui 수정 source의 고정
revision `98a1fe67b439324ddc857f47fbdce056600a4329`·MIT
LICENSE는 기존 provenance와 소비자 고지를 재사용합니다. 새로운
upstream 코드를 도입하지 않았으므로 별도의 upstream revision
대조 대상은 없습니다.

제목 있는 modal, 이미지 alt·caption, 현재 위치, native 탐색 버튼과
썸네일의 현재 상태를 제공합니다. Chromium에서 방향키·Escape·focus
복귀와 좁은 화면을 확인했습니다. 실제 screen reader·touch·Safari·
RTL은 검증하지 않았습니다.

## 2026-10-02 ModelSelector source 확인

AI 작업 화면의 `PromptInput` 앞에서 모델을 고르고, 제공자·기능·
사용량 문구와 사용할 수 없는 이유를 확인하는 용례입니다. 일반
`Combobox`는 검색·선택과 form 값을 제공하지만 이 메타데이터와
권한 변경 시 제출 차단은 제공하지 않습니다. `ModelSelector`는
이 저장소에서 작성한 원본 조합이며 외부 component 코드를
복사하지 않았습니다. 외부 구현의 동일 revision source·LICENSE를
새로 대조할 대상은 없습니다.

직접 registry 의존성은 기존 `pyd-combobox`·`pyd-utils`이며 새 npm
의존성은 없습니다. `Combobox`는 원본 구현으로
[WAI-ARIA APG Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)을
동작 지침으로 참고한 기존 조사 결과를 재사용합니다. 그 내부의
`pyd-input`은
[고정 shadcn/ui source](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/new-york-v4/ui/input.tsx)와
[같은 revision MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)를
기존 provenance·고지에 기록했습니다. 새 source 도입은 없습니다.

보이는 label이 검색 input을 지칭하고 listbox option의 비활성 상태는
기존 `Combobox`가 전달합니다. 선택 불가 이유와 로딩·오류는 문자
상태로 표시합니다. 실제 screen reader·touch·Safari·RTL은 별도로
검사하지 않았습니다.

## 2026-10-02 MasterDetail source 확인

`MasterDetail`은 handoff의 Workflow & Productivity 후보이며 요청·
파일·알림 목록에서 선택한 항목의 상세를 보이는 반복 용례입니다.
기존 `AppShell`은 영역만 배치하고 `Board`는 게시글 메타데이터를
고정하므로, 목록 선택·상세 전환·모바일 focus 복귀는 별도 구현이
필요합니다. 외부 component 소스는 복사하지 않았습니다.

[W3C WAI Reflow 지침](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)의
좁은 폭 단일 열 배치와
[WHATWG button 명세](https://html.spec.whatwg.org/dev/form-elements.html#the-button-element)의
native 활성화 동작을 참고했습니다. 플랫폼 명세를 소스로 편입하지
않았습니다. React와 기존 `pyd-button`·`pyd-utils`만 사용하며 새 npm
의존성은 없습니다. `pyd-button`의 [공식 문서](https://ui.shadcn.com/docs/components/radix/button),
[고정 source](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/new-york-v4/ui/button.tsx),
[같은 revision MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)는
기존 조사·고지를 재사용합니다. 이 item의 registry 의존성은
`pyd-button`과 `pyd-utils`이며 Button의 npm 의존성은 기존
`class-variance-authority@0.7.1`입니다.

목록은 native button과 현재 항목 표시를, 상세는 이름 있는 영역을
사용합니다. 좁은 화면에서 선택 후 상세로 focus를 이동하고 돌아갈
때 선택 버튼으로 복원합니다. 실제 screen reader·touch·Safari·RTL은
미검증입니다.

## 2026-10-02 ImageCropper source 확인

`ImageCropper`는 `.worknotes/shadcn-component-library-handoff.md`의
File & media 후보입니다. 파일 선택 뒤 프로필·게시물 이미지를
정사각형이나 가로형으로 자르는 작업은 기존 `Image`의 표시나
`FileUpload`의 전송 상태와 다릅니다. 구현은 pydemia/ui 원본이며
외부 component 코드를 복사하지 않았습니다.

[WHATWG HTML Canvas](https://html.spec.whatwg.org/multipage/canvas.html)의
`drawImage` source rectangle·`toBlob` PNG 직렬화,
[W3C File API](https://www.w3.org/TR/FileAPI/)의 blob URL 생성·해제,
[W3C Pointer Events](https://www.w3.org/TR/pointerevents4/)의 pointer
capture를 확인했습니다. [WAI form label 지침](https://www.w3.org/WAI/tutorials/forms/labels/)과
[drag 대체 조작 지침](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements)은
보이는 label과 native range 조작의 근거입니다. 이 자료는 웹 API·
접근성 규칙의 참고 문서이고 component source로 복사하지 않았습니다.

직접 의존성은 React와 기존 `pyd-button`·`pyd-utils`입니다. 새 npm
의존성은 없습니다. `pyd-button`은 기존 shadcn/ui 수정 소스로,
[공식 Button 문서](https://ui.shadcn.com/docs/components/radix/button),
[고정 source](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/new-york-v4/ui/button.tsx),
[같은 revision의 MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)를
기존 provenance·고지와 함께 재사용합니다. 해당 registry item의
직접 npm 의존성은 `class-variance-authority@0.7.1`이고 `pyd-utils`를
거쳐 `clsx`·`tailwind-merge`를 사용합니다. ImageCropper 자체에는
제3자 source notice가 추가되지 않습니다.

보이는 세 range label과 native 버튼은 키보드 조작을 제공하며
canvas의 포인터 끌기에는 같은 결과를 얻는 range 대안을 둡니다.
실제 screen reader·touch·Safari 발표·조작은 미검증입니다.

## 2026-10-02 Card·Alert 표시 형태 source 확인

기존 `Card`와 `Alert`는 shadcn/ui 고정 revision의 수정 소스입니다.
[Card 공식 문서](https://ui.shadcn.com/docs/components/radix/card)와
[Alert 공식 문서](https://ui.shadcn.com/docs/components/radix/alert),
같은 revision `98a1fe67b439324ddc857f47fbdce056600a4329`의
[Card source](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/bases/radix/ui/card.tsx),
[Alert source](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/bases/radix/ui/alert.tsx),
[MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)를
확인했습니다. 이 작업의 표면·간격 선택은 pydemia/ui token으로
작성했으며 새 upstream source나 runtime dependency를 가져오지
않았습니다. Card는 React와 기존 `pyd-utils`, Alert는 여기에
기존 `class-variance-authority@0.7.1`을 사용합니다.

Card는 div 조합 요소로 남아 자동 landmark나 heading level을
부여하지 않습니다. Alert의 일반 상태는 `role="status"`, 오류는
`role="alert"`이고 표면을 바꿔도 제목·설명과 발표 역할을
유지합니다. 실제 screen reader 발표는 미검증입니다.

## 2026-10-02 ActionBar·CopyButton source 확인

`ActionBar`는 기존 `DataTable.renderActions`의 선택 건수·해제 영역을
표 밖의 카드·파일 목록에서도 쓰기 위해 직접 작성했습니다.
[WAI-ARIA APG Toolbar](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)는
toolbar 역할에 단일 Tab 진입과 방향키 이동을 요구합니다. 여기서는
일괄 작업이 1~2개일 수 있고 각 native button의 Tab 이동을 유지하므로
이름 있는 `group`을 사용합니다. 상태 숫자는 `role="status"`입니다.
외부 component source를 가져오지 않았고 직접 의존성은 기존
`pyd-button`·`pyd-utils`뿐입니다.

`CopyButton`은 기존 `CodeBlock`과 `SnippetCopyButton`의 중복된
`navigator.clipboard.writeText`·상태 처리를 공통화한 원본입니다.
[W3C Clipboard API 2026-06-24 초안](https://www.w3.org/TR/2026/WD-clipboard-apis-20260624/)의
비동기 쓰기·권한 거부 동작을 참고했습니다. 브라우저 API의 성공은
Promise resolve 뒤에만 표시하고 rejection은 실패 상태로 알립니다.
기존 `pyd-button`·`pyd-utils`, `lucide-react@0.468.0`의 Copy·Check
아이콘만 사용합니다. 정확한 npm 배포본
[`lucide-react@0.468.0`](https://registry.npmjs.org/lucide-react/-/lucide-react-0.468.0.tgz)의
package manifest, `dist/esm/icons/copy.js`·`check.js`와 ISC LICENSE를
확인했습니다. 해당 manifest의 React peer 범위도 확인했습니다.
shadcn Button의 기존 [고정 source](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/new-york-v4/ui/button.tsx)와
같은 revision의 [MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)는
기존 `pyd-button` 고지로 유지합니다. 새 component에 upstream 구현을
복사하지 않았습니다. 실제 screen reader 검사는 미검증입니다.

## 2026-10-01 TreeSelect reference 확인

[Ant Design TreeSelect 공식 문서](https://github.com/ant-design/ant-design/blob/820e1a8c2dbb508b15e5ad0fc3eedcdef869d98b/components/tree-select/index.en-US.md)는
기업 조직·디렉터리 같은 계층 데이터를 단일 선택기에 쓰는 경우를
설명합니다. 동일 revision
[`820e1a8`](https://github.com/ant-design/ant-design/commit/820e1a8c2dbb508b15e5ad0fc3eedcdef869d98b)의
[component source](https://github.com/ant-design/ant-design/blob/820e1a8c2dbb508b15e5ad0fc3eedcdef869d98b/components/tree-select/index.tsx),
[package manifest](https://github.com/ant-design/ant-design/blob/820e1a8c2dbb508b15e5ad0fc3eedcdef869d98b/package.json),
[LICENSE](https://github.com/ant-design/ant-design/blob/820e1a8c2dbb508b15e5ad0fc3eedcdef869d98b/LICENSE)를
확인했습니다. MIT이고 해당 구현은 `@rc-component/tree-select`와
`@rc-component/select`, `@rc-component/trigger` 등에 의존합니다.

`pyd-tree-select`는 선택기 용례만 참고하고 기존 pydemia/ui `Tree`와
`Popover`, React, 공통 token으로 작성했습니다. 새로 추가되는 직접
의존성은 기존 `lucide-react` 아이콘뿐입니다.
[WAI-ARIA APG Tree View](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/)의
키보드·선택 패턴을 기존 `Tree`에서 사용합니다. 실제 screen reader
발표는 미검증입니다.

## 2026-10-01 DiffViewer reference 확인

[React Diff Viewer 공식 README](https://github.com/praneshr/react-diff-viewer/blob/5572d1c121ea095fe913a862b9e89e46a45f2599/README.md)는
통합·좌우 비교, 줄 번호와 접힌 문맥을 설명합니다. 동일 revision
[`5572d1c`](https://github.com/praneshr/react-diff-viewer/commit/5572d1c121ea095fe913a862b9e89e46a45f2599)의
[component source](https://github.com/praneshr/react-diff-viewer/blob/5572d1c121ea095fe913a862b9e89e46a45f2599/src/index.tsx),
[line computation](https://github.com/praneshr/react-diff-viewer/blob/5572d1c121ea095fe913a862b9e89e46a45f2599/src/compute-lines.ts),
[package manifest](https://github.com/praneshr/react-diff-viewer/blob/5572d1c121ea095fe913a862b9e89e46a45f2599/package.json),
[LICENSE](https://github.com/praneshr/react-diff-viewer/blob/5572d1c121ea095fe913a862b9e89e46a45f2599/LICENSE)를
확인했습니다. MIT이며 upstream은 `diff`, `classnames`, Emotion,
`memoize-one`, `prop-types`와 React에 의존합니다.

`pyd-diff-viewer`는 비교 용례만 참고해 새 줄 비교와 native table을
작성했습니다. upstream source를 복사하지 않았고 새 runtime dependency
없이 React·기존 `pyd-utils`·공통 token을 사용합니다.
[W3C WAI table 지침](https://www.w3.org/WAI/tutorials/tables/)의
열 제목과 [W3C Design System의 스크롤 가능한 표](https://design-system.w3.org/styles/tables.html)를
접근성 참고 자료로 확인했습니다. 실제 screen reader 발표는
미검증입니다.

## 2026-10-01 ApprovalCard reference 확인

[AI Elements Confirmation 공식 문서](https://elements.ai-sdk.dev/components/confirmation)
에서 도구 호출 승인 요청, 승인·거절과 응답 상태를 확인했습니다. 동일
revision [`6a9d5b1`](https://github.com/vercel/ai-elements/tree/6a9d5b1822ffb10bba4bd97175f01edd7d8651cd)의
[source](https://github.com/vercel/ai-elements/blob/6a9d5b1822ffb10bba4bd97175f01edd7d8651cd/packages/elements/src/confirmation.tsx),
[package manifest](https://github.com/vercel/ai-elements/blob/6a9d5b1822ffb10bba4bd97175f01edd7d8651cd/packages/elements/package.json),
[LICENSE](https://github.com/vercel/ai-elements/blob/6a9d5b1822ffb10bba4bd97175f01edd7d8651cd/LICENSE)를
확인했습니다. LICENSE는 Apache-2.0입니다. upstream source는 내부
shadcn Alert·Button·utils, React와 AI SDK `ToolUIPart`를 사용하고,
manifest는 `ai`, `lucide-react` 등 추가 의존성을 포함합니다.

`pyd-approval-card`는 승인 상태의 용도만 참고해 새로 작성했습니다.
`ToolCall`의 실행 상태와 별도이며 기존 `pyd-button`, `pyd-utils`와
React만 사용합니다. native button, 이름·설명이 있는 section, 별도
status·alert를 둡니다. [WAI-ARIA 1.2 status](https://www.w3.org/TR/wai-aria-1.2/#status)와
[alert](https://www.w3.org/TR/wai-aria-1.2/#alert)의 발표 의미를
참고했습니다. 실제 screen reader 발표는 아직 확인하지 않았습니다.

## 2026-09-30 Editable reference 확인

[Chakra UI Editable 공식 문서](https://chakra-ui.com/docs/components/editable)는
인라인 이름 수정과 명시적 편집·저장·취소 control, controlled 값을
설명합니다. 같은 revision
[`9611614`](https://github.com/chakra-ui/chakra-ui/tree/961161428b8c59157ad921dd23303b73c294d73f)의
[component source](https://github.com/chakra-ui/chakra-ui/blob/961161428b8c59157ad921dd23303b73c294d73f/packages/react/src/components/editable/editable.tsx),
[package manifest](https://github.com/chakra-ui/chakra-ui/blob/961161428b8c59157ad921dd23303b73c294d73f/packages/react/package.json),
[LICENSE](https://github.com/chakra-ui/chakra-ui/blob/961161428b8c59157ad921dd23303b73c294d73f/LICENSE)를
확인했습니다. MIT이며 source는 `@ark-ui/react/editable`, Chakra의
스타일·prop 합성 계층과 React에 의존합니다. package manifest에는
Ark UI, Emotion 계열, PandaCSS prop 검사와 React peer 의존성이
있습니다. `pyd-editable`은 사용 사례와 명시적 control만 참고한
원본 React 구현입니다. source를 복사하지 않았고 기존 `pyd-button`,
`pyd-input`, `pyd-utils`만 registry 의존성으로 사용합니다.
native input의 label, button, `aria-busy`, alert를 사용합니다.
실제 screen reader 발표는 별도 검증 대상으로 남깁니다.

## 2026-09-30 Gantt reference 확인

[Kibo Gantt 공식 문서](https://www.kibo-ui.com/components/gantt)는 일정
시간축, drag·resize, 날짜 marker, 작업 grouping, 같은 행의 여러 항목과
read-only 예시를 제공합니다. 같은 revision
[`3d63cdb`](https://github.com/shadcnblocks/kibo/tree/3d63cdb15b79d972e3dc38a10997987672f9b263)의
[소스](https://github.com/shadcnblocks/kibo/blob/3d63cdb15b79d972e3dc38a10997987672f9b263/packages/gantt/index.tsx),
[package manifest](https://github.com/shadcnblocks/kibo/blob/3d63cdb15b79d972e3dc38a10997987672f9b263/packages/gantt/package.json),
[LICENSE](https://github.com/shadcnblocks/kibo/blob/3d63cdb15b79d972e3dc38a10997987672f9b263/license.md)를
확인했습니다. LICENSE는 MIT입니다. upstream Gantt는 dnd-kit core와
modifiers, date-fns, jotai, `@uidotdev/usehooks`, `lodash.throttle`,
lucide-react, React·react-dom 및 내부 shadcn-ui에 의존합니다.

`pyd-gantt`는 일정·의존 관계라는 용도만 참고한 원본 React·Tailwind
구현입니다. upstream 코드를 복사하지 않았고 직접 registry 의존성은
기존 `pyd-utils`뿐입니다. 현재 범위는 단일 행에 작업 하나, 명시한
1~366일 구간, 일·7일 단위 표시, 버튼을 통한 하루 단위 이동·기간
조정입니다. drag, marker, grouping, 같은 행의 여러 작업은 제공하지
않습니다. [W3C APG grid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)의
셀 방향키 이동을 구현하지 않았으므로 chart를 ARIA grid로 표시하지
않습니다. 이름 있는 스크롤 영역과 native 작업·조작 버튼을 사용합니다.

## 2026-09-30 Heatmap reference 확인

[Kibo Contribution Graph 공식 문서](https://www.kibo-ui.com/components/contribution-graph)는
시간별 활동 강도, 명시한 값, 좁은 화면의 내부 가로 스크롤을 보여 줍니다.
같은 revision [`3d63cdb`](https://github.com/shadcnblocks/kibo/tree/3d63cdb15b79d972e3dc38a10997987672f9b263)의
[소스](https://github.com/shadcnblocks/kibo/blob/3d63cdb15b79d972e3dc38a10997987672f9b263/packages/contribution-graph/index.tsx),
[package manifest](https://github.com/shadcnblocks/kibo/blob/3d63cdb15b79d972e3dc38a10997987672f9b263/packages/contribution-graph/package.json),
[LICENSE](https://github.com/shadcnblocks/kibo/blob/3d63cdb15b79d972e3dc38a10997987672f9b263/license.md)를
확인했습니다. MIT이며 React·react-dom·date-fns·내부 shadcn-ui에
의존합니다. `pyd-heatmap`은 이 소스를 복사하지 않았습니다. 달력 날짜를
계산하는 대신 호출자가 두 범주의 행렬을 전달하는 원본 React·Tailwind
구현입니다. 직접 의존성은 기존 `pyd-utils`뿐입니다.

[W3C WAI 표 지침](https://www.w3.org/WAI/tutorials/tables/)의 행·열
헤더 연결을 참고해 native table과 `scope`를 사용했습니다. 색만으로
값을 전달하지 않도록 모든 숫자를 셀 텍스트로 표시합니다. 실제 screen
reader 검사는 별도 기록합니다.

## 2026-09-30 Kanban reference 확인

[Kibo Kanban 공식 문서](https://www.kibo-ui.com/components/kanban)는 열 사이
카드 끌기와 카드 내용 사용자 정의를 설명합니다. 같은 revision
[`3d63cdb`](https://github.com/shadcnblocks/kibo/tree/3d63cdb15b79d972e3dc38a10997987672f9b263)의
[소스](https://github.com/shadcnblocks/kibo/blob/3d63cdb15b79d972e3dc38a10997987672f9b263/packages/kanban/index.tsx),
[package manifest](https://github.com/shadcnblocks/kibo/blob/3d63cdb15b79d972e3dc38a10997987672f9b263/packages/kanban/package.json),
[LICENSE](https://github.com/shadcnblocks/kibo/blob/3d63cdb15b79d972e3dc38a10997987672f9b263/license.md)를
확인했습니다. LICENSE는 MIT이고 소스는 dnd-kit core/sortable/utilities,
React, react-dom, 내부 shadcn-ui와 tunnel-rat에 의존합니다.
`pyd-kanban`은 열·카드 역할과 이동 동작만 참고해 React의 native
drag/drop과 버튼으로 직접 작성했습니다. Kibo 코드를 복사하거나 위
런타임 의존성을 추가하지 않았습니다. touch에서 drag 지원을 전제로
하지 않고 버튼으로 같은 이동을 수행하도록 설계했습니다.

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
의존하지 않고 텍스트로 표시합니다. 2026-09-29에 기존 `MetricCard`에
`compact`와 `featured` 표시 형태를 추가했습니다. `Card`와 공통 token만
사용하며 새 upstream source나 dependency를 편입하지 않았습니다.
세 형태는 같은 수치·변화·기간 텍스트를 유지합니다.

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

DateRangePicker도 기존 Calendar와 Popover를 조합한 원본 코드입니다.
[DayPicker v9.14.0 range mode 문서](https://daypicker.dev/v9/selections/range-mode)와
[접근성 문서](https://daypicker.dev/guides/accessibility)의 range 선택,
`resetOnSelect`, `excludeDisabled`, keyboard 규칙을 확인했습니다.
설치된 `react-day-picker@9.14.0`의 `useRange.js`, `addToRange.js`,
manifest와 같은 release의
[MIT LICENSE](https://github.com/gpbl/react-day-picker/blob/v9.14.0/LICENSE)를
검사했습니다. 기존 Calendar의 DayPicker와 Popover의
`@radix-ui/react-popover@1.1.23`을 재사용하며 새로운 외부 runtime
dependency는 없습니다. 두 날짜의 파싱·포맷은 DatePicker와 공유하는
저장소 원본 `calendar-date.ts`가 맡습니다. 실제 접근성 확인 범위는
`verification.md`에 기록합니다.

## 2026-09-29 계층형 리소스 탐색

Tree는 기존 React와 Tailwind, `pyd-utils`만 사용하는 저장소 원본
구현입니다. 외부 component source를 복사하지 않았습니다.
[W3C WAI-ARIA Tree View Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/)에서
treeitem·group 관계, focus와 선택의 구분, 키보드 규칙을 확인했습니다.
같은 패턴의 동적 로딩 설명에 따라 `aria-level`·`aria-posinset`·
`aria-setsize`를 로드 전후 노드에 명시하고, 부모의 확장 상태와
로딩·오류 설명을 별도로 표시합니다. 비동기 데이터 요청과 오류
메시지는 소비자가 관리하며 Tree는 외부 source를 복사하지 않습니다.
[W3C Navigation Treeview Example](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/examples/treeview-navigation/)은
일반 사이트 탐색에서는 disclosure 패턴이 더 적합할 수 있고 실제
보조기술 테스트가 필요하다고 설명합니다. Tree의 사용처를 파일·리소스
계층으로 제한하고, 기존 `Navigation`·`Sidebar`와 용도를 구분했습니다.
새 외부 runtime dependency는 없습니다. 실제 browser 확인 범위는
`verification.md`에 기록합니다.

## 2026-09-29 대화 목록

Conversation은 기존 `Message`, React, Tailwind와 `pyd-utils`를
사용하는 저장소 원본 구현입니다. 외부 component source를 복사하거나
runtime dependency를 추가하지 않았습니다.
[WAI-ARIA 1.2 log role](https://www.w3.org/TR/wai-aria-1.2/#log)은
순서대로 새 항목이 추가되는 채팅 기록을 `log`의 예시로 제시하며,
기본 live 상태는 `polite`입니다. 실제 보조기술의 발표 결과는
검증하지 않았습니다.

## 2026-09-29 AI 작업 상태

Reasoning과 ToolCall은 저장소 원본 구현입니다. Reasoning은 기존
shadcn 기반 `Collapsible`, lucide, utils를 조합하고 ToolCall은 React와
utils만 사용합니다. 새로운 외부 runtime dependency는 없습니다.
[shadcn/ui Collapsible 문서](https://ui.shadcn.com/docs/components/radix/collapsible),
[고정 revision의 source](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/bases/radix/ui/collapsible.tsx),
[동일 revision의 MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)를
직접 확인했습니다. 설치본에는 MIT 고지 파일이 함께 생성됩니다.
기존 package의 `@radix-ui/react-collapsible@1.1.20`과
`lucide-react@0.468.0` 설치 상태를 확인했습니다.
[W3C WAI-ARIA APG Disclosure Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)에서
button의 `aria-expanded`와 Enter·Space 동작을 확인했고,
[W3C WAI-ARIA status role](https://www.w3.org/TR/wai-aria-1.2/#status)에서
polite live 발표 규칙을 확인했습니다. 두 문서는 동작·접근성
reference이며 component source를 복사하지 않았습니다. 실제 보조기술
발표 결과는 검증하지 않았습니다.

## 2026-09-29 구현 출처 재분류

위 2026-09-28 기록은 당시 편입 방식과 의존성 조사입니다. 현재
Dropzone은 native file input과 drag/drop 이벤트로 직접 구현했고
`react-dropzone` 의존성을 제거했습니다. Origin UI, Kibo UI,
AI Elements, Tremor는 구현 출처가 아닌 디자인·동작 reference로
`registry/provenance.json`에 별도로 기록합니다. 문서 사이트도
현재 코드의 출처와 디자인 reference를 분리해 표시합니다.

## 2026-09-29 차트·대시보드·알림 reference

DataChart, Dashboard, Toast는 이 저장소에서 직접 작성했습니다.
[shadcn/ui Chart 공식 문서](https://ui.shadcn.com/docs/components/base/chart)의
조합 방식을 참고했지만 해당 구현의 Recharts와 component source는
사용하지 않았습니다. Toast의 발표 수준과 focus 정책은
[WAI-ARIA status](https://www.w3.org/TR/wai-aria/#status)와
[WAI Alert Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)을
참고했습니다. 세 component의 신규 직접·전이 npm dependency는
없습니다. 코드 출처와 reference는 `registry/provenance.json`에서
구분합니다.

## 2026-09-29 목록·패널 reference

Pagination과 DataTable은 native table, React state, 기존 내부
component로 직접 작성했습니다.
[WAI sortable table 예시](https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/)의
정렬 버튼·`aria-sort` 의미와
[modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)의
focus 이동을 확인했습니다. Drawer는 기존
`@radix-ui/react-dialog@1.1.23`을 조합한 자체 wrapper입니다.
[공식 Dialog 문서](https://www.radix-ui.com/primitives/docs/components/dialog)와
설치된 1.1.23의 배포 소스 `dist/index.mjs`, package manifest,
같은 release의 MIT LICENSE를 직접 확인했습니다. 웹 문서가 표시하는
버전 1.1.20과 설치된 release를 구분합니다. 새 npm dependency는
없습니다.

## 2026-09-29 작업 메뉴·비밀번호·차트 reference

DropdownMenu와 PasswordInput은 이 저장소에서 직접 작성했습니다.
[Radix Dropdown Menu 문서](https://www.radix-ui.com/primitives/docs/components/dropdown-menu)의
키보드·checked·submenu 동작과
[WAI Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)의
고정 이름 toggle 규칙을 참고했습니다. 설치된
`@radix-ui/react-dropdown-menu@2.1.22`의 배포 소스, manifest와 MIT
LICENSE를 같은 release에서 확인했습니다. npm lockfile의 전이 closure
47개에는 MIT metadata 46개와 0BSD 1개가 있습니다.
`react-remove-scroll-bar@2.3.8`의 설치 파일에는 LICENSE가 없고
manifest와 upstream 저장소는 MIT로 표기합니다. 동일 revision의
LICENSE 파일 확인은 남아 있습니다. DataChart의 `area` variant는
원본 SVG 구현을 확장했으며 추가 npm dependency가 없습니다.

## 2026-09-29 검색 선택·구성비 차트 reference

Combobox와 DonutChart는 이 저장소에서 직접 작성했습니다.
[WAI-ARIA Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)의
role·keyboard 규칙과
[shadcn/ui Pie Chart](https://ui.shadcn.com/charts/pie)의 시각 표현을
참고했지만 두 source의 구현 코드는 편입하지 않았습니다. 따라서
복사한 upstream 소스의 동일 revision LICENSE는 이번 두 item에
해당하지 않습니다. 직접·전이 npm dependency도 추가하지 않았습니다.
registry에서는 기존 `pyd-input`과 `pyd-utils`만 참조합니다. 원본
SVG·입력 상태 구현과 미검증 범위는
`.worknotes/component-combobox-donut-2026-09-29.md`에 기록했습니다.

## 2026-09-29 크기 조절 패널·원형 진행 표시 reference

`ResizablePanels`는 이 저장소에서 직접 작성했습니다.
[WAI-ARIA APG Window Splitter](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/)의
separator 이름·값·키보드 규칙을 참고했습니다. APG 문서는 예시의
기능 검토가 아직 완료되지 않았다고 명시하므로 동작은 브라우저에서
별도로 확인합니다. shadcn/ui Resizable의
`react-resizable-panels` 코드는 사용하지 않았습니다.

`Progress`의 `circular` variant는 기존 Radix progressbar wrapper에
원본 SVG를 추가했습니다.
[Radix Progress 공식 문서](https://www.radix-ui.com/primitives/docs/components/progress)의
값·indeterminate 의미를 따릅니다. 기존 shadcn/ui 변형 코드의
revision과 MIT LICENSE는 `registry/provenance.json`에 기록된 것을
유지합니다. 두 변경 모두 새 npm dependency는 없습니다.

## 2026-09-29 접힘식 Sidebar reference

`Sidebar`는 내부 `Button`, `SideNav`, `Drawer`를 조합한 원본
구현입니다. [shadcn/ui Sidebar 공식 문서](https://ui.shadcn.com/docs/components/aria/sidebar)의
접힘·모바일 구성을 디자인 reference로, [WAI Navigation Landmark](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/navigation.html)의
이름 규칙을 접근성 reference로 확인했습니다. upstream source 코드를
복사하지 않았습니다.

모바일 Drawer가 사용하는 `@radix-ui/react-dialog@1.1.23`의 설치
manifest, 배포 소스 `dist/index.mjs`, 동일 설치 패키지의 MIT LICENSE를
확인했습니다. 공식 [Radix Dialog 문서](https://www.radix-ui.com/primitives/docs/components/dialog)는
modal focus와 Escape 동작을 설명합니다. 새 npm dependency는 없으며
registry 전이 항목은 `pyd-button`, `pyd-drawer`, `pyd-navigation`,
`pyd-utils`입니다.

2026-09-30 섹션 탐색은 같은
[shadcn/ui Sidebar 공식 문서](https://ui.shadcn.com/docs/components/aria/sidebar)의
`SidebarGroup` 구성을 reference로 확인했습니다. `SidebarSection` 타입과
렌더링·검증은 기존 `Sidebar` 원본 구현에 직접 추가했고 upstream 코드를
복사하지 않았습니다. 기존 Radix Dialog revision·MIT LICENSE와 registry
전이 항목은 그대로이며 새 npm dependency는 없습니다.

## 2026-09-29 단계·활동 표시 reference

`Stepper`와 `Timeline`은 이 저장소의 원본 구현입니다.
[W3C ARIA26](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA26)의
순서 목록과 `aria-current="step"` 예시,
[WHATWG HTML Standard](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-time-element)의
`time` 요소 규칙을 참고했습니다. upstream component source를 복사하지
않았으므로 편입한 upstream revision·LICENSE는 없습니다. 두 item의
직접 registry 의존성은 기존 `pyd-utils` 하나이며 새 npm dependency는
없습니다. 상세 동작과 제한은
`.worknotes/component-workflow-2026-09-29.md`에 기록했습니다.

## 2026-09-29 파일 전송 상태 reference

`FileUpload`는 기존 `Dropzone`과 `Progress`를 조합한 원본
구현입니다. [WHATWG file input](<https://html.spec.whatwg.org/multipage/input.html#file-upload-state-(type=file)>)의
파일 선택 모델과 [WAI-ARIA APG progress 값](https://www.w3.org/WAI/ARIA/apg/practices/range-related-properties/)을
확인했습니다. 외부 component source를 새로 복사하지 않았습니다.
`Progress`의 [shadcn/ui 고정 source](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/bases/radix/ui/progress.tsx)와
[동일 revision MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)를
확인했습니다. 고정 revision은 `registry/provenance.json`의
`pyd-progress` 항목에도 있습니다.
설치된 `@radix-ui/react-progress@1.1.16`의 package manifest,
`dist/index.mjs`와 MIT LICENSE도 확인했습니다. 직접 registry
의존성은 `pyd-dropzone`, `pyd-progress`, `pyd-utils`이며 새 npm
dependency는 없습니다.

## 2026-09-29 다중 선택 reference

`MultiSelect`는 이 저장소의 원본 구현입니다.
[W3C WAI의 form control 그룹 지침](https://www.w3.org/WAI/tutorials/forms/grouping/)을
native checkbox 묶음과 fieldset·legend 구성에 참고했습니다.
[Radix Popover 공식 문서](https://www.radix-ui.com/primitives/docs/components/popover)의
focus·Escape 동작을 확인하고 기존 `pyd-popover`를 조합했습니다.
그 wrapper의
[shadcn/ui 고정 source](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/bases/radix/ui/popover.tsx)와
[동일 revision MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)를
확인했습니다. 설치된 `@radix-ui/react-popover@1.1.23`의 manifest,
`dist/index.mjs`, MIT LICENSE도 확인했습니다. `MultiSelect`에 외부
component source를 복사하지 않았고 새 npm dependency는 없습니다.
직접 registry 의존성은 `pyd-input`, `pyd-popover`, `pyd-utils`입니다.

## 2026-09-29 명령 팔레트 reference

`CommandPalette`는 이 저장소의 원본 구현입니다.
[WAI-ARIA APG Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)의
검색 중 focus 유지, `aria-activedescendant`, 방향키와 Enter 동작을
참고했습니다. modal focus·Escape에는 기존 `pyd-dialog`를 사용합니다.
[Radix Dialog 공식 문서](https://www.radix-ui.com/primitives/docs/components/dialog)와
wrapper의 [shadcn/ui 고정 source](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/bases/radix/ui/dialog.tsx),
[동일 revision MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)를
확인했습니다. 설치된 `@radix-ui/react-dialog@1.1.23`의 manifest,
`dist/index.mjs`, MIT LICENSE도 확인했습니다. 외부 Command 구현
소스는 복사하지 않았으며 직접 registry 의존성은 `pyd-dialog`,
`pyd-input`입니다. 새 npm dependency는 없습니다.

## 2026-09-29 shadcn/ui 고지의 소비자 전달

shadcn/ui에서 수정한 26개 source는
[고정 revision의 MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)를
사용합니다. [공식 registry item 명세](https://ui.shadcn.com/docs/registry/registry-item-json)의
`registry:file`과 `target`을 사용해 각 item의 설치 결과에
`SHADCN_UI_LICENSE.md`를 포함했습니다. 이 파일은 같은 revision의
copyright와 MIT 허가·면책 문구를 담습니다. item별 소비자 전달 경로는
`registry.json`과 `registry/provenance.json`의 `consumer_notice`에
기록했습니다. 기존 `THIRD_PARTY_NOTICES.md`는 저장소 차원의 출처
기록으로 유지합니다.

## 2026-09-29 분석 필터 reference

`FilterBar`는 이 저장소의 원본 구현입니다.
[W3C WAI-ARIA APG Landmark Regions](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/)에서
이름이 있는 form의 landmark 동작을 확인했고,
[W3C Form Labels](https://www.w3.org/WAI/tutorials/forms/labels/)에서
입력 control의 label 연결을 확인했습니다. 외부 component source를
복사하지 않아 편입한 upstream revision·LICENSE는 없습니다. 직접
registry 의존성은 기존 `pyd-button`, `pyd-utils`이며 새 npm dependency는
없습니다. `Field`, `Input`, `NativeSelect` 등은 사용 예시에만 필요합니다.

## 2026-09-29 다중 계열 차트 reference

기존 `DataChart` 원본 구현을 확장했습니다.
[shadcn/ui Chart 공식 문서](https://ui.shadcn.com/docs/components/base/chart)의
다중 계열·범례 표현은 디자인 reference입니다. 공식 구현의 Recharts
source를 복사하지 않았고 새 package도 설치하지 않았으므로 편입한
upstream revision·LICENSE는 없습니다.
[W3C WAI Complex Images](https://www.w3.org/WAI/tutorials/images/complex/)에서
차트의 짧은 설명과 상세 데이터 대안을 확인했습니다. 기존
`pyd-utils` 외 직접 registry 의존성은 없습니다.

## 2026-09-29 콘텐츠 Carousel reference

`Carousel`은 이 저장소에서 직접 구현했습니다.
[WAI-ARIA APG Carousel 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/)의
이름 있는 영역·슬라이드, 이전·다음 native button, 수동 전환의
`aria-live="polite"`, 현재 선택 버튼의 `aria-disabled`를 확인했습니다.
[shadcn/ui Carousel 공식 문서](https://ui.shadcn.com/docs/components/base/carousel)는
기능 범위만 비교했습니다. 그 구현은 Embla를 사용하며 source를
복사하거나 Embla를 설치하지 않았습니다. 따라서 `Carousel` 자체에
편입한 외부 revision·LICENSE는 없습니다.

직접 registry 의존성은 기존 `pyd-button`과 `pyd-utils`입니다.
`pyd-button`의 [고정 shadcn/ui source](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/new-york-v4/ui/button.tsx)와
[동일 revision MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)를
재확인했습니다. 소비자 설치에는 그 MIT 고지 파일이 함께 들어갑니다.
새 npm dependency는 없습니다.

## 2026-09-29 일반 이미지 reference

`Image`는 이 저장소에서 직접 구현했습니다.
[W3C WAI Images Tutorial](https://www.w3.org/WAI/tutorials/images/)의
정보 이미지 설명과 장식 이미지의 빈 `alt` 지침,
[WHATWG HTML 이미지 명세](https://html.spec.whatwg.org/multipage/embedded-content.html#the-img-element)의
native `<img>` 속성을 확인했습니다. 외부 component source를 복사하지
않아 편입한 upstream revision·LICENSE는 없습니다. 직접 registry
의존성은 기존 `pyd-utils`뿐이며 새 npm dependency는 없습니다.

## 2026-09-29 JSON 탐색 reference

`JsonViewer`는 이 저장소에서 직접 구현했습니다.
[WHATWG HTML details 명세](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-details-element)의
native disclosure와 summary 동작을 확인했습니다.
[ECMA-404](https://ecma-international.org/publications-and-standards/standards/ecma-404/)는
허용할 JSON 값의 범위를 정하는 데 참고했습니다. 외부 component
source를 복사하지 않아 편입한 upstream revision·LICENSE는 없습니다.
직접 registry 의존성은 기존 `pyd-utils`뿐이며 새 npm dependency는
없습니다.

## 2026-09-29 색상 입력 reference

`ColorInput`은 문서 사이트의 기존 Colormap 편집 요구를 분리해 이
저장소에서 직접 구현했습니다. native 색상 입력의 동작 범위는
[WHATWG HTML color state](https://html.spec.whatwg.org/multipage/input.html#color-state-(type=color))를,
두 필드의 이름과 연결은
[W3C WAI form labels](https://www.w3.org/WAI/tutorials/forms/labels/)를
참고했습니다. 외부 component source를 복사하지 않아 편입한 upstream
revision·LICENSE는 없습니다. 직접 registry 의존성은 기존
`pyd-utils`뿐이며 새 npm dependency는 없습니다.

## 2026-09-29 검색 입력 reference

`SearchInput`은 이 저장소에서 직접 구현했습니다.
[WHATWG HTML Search state](https://html.spec.whatwg.org/multipage/input.html#text-(type=text)-state-and-search-state-(type=search))의
native 검색 필드·form 제출과
[W3C WAI search landmark](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/)의
이름 있는 검색 영역을 참고했습니다. 외부 component source를 복사하지
않아 편입한 upstream revision·LICENSE는 없습니다. 직접 registry
의존성은 기존 `pyd-input`·`pyd-button`이며 새 npm dependency는
없습니다. 이 두 항목의 shadcn/ui MIT 고지는 registry 설치 시 함께
전달합니다.

## 2026-09-29 ContextMenu reference

`ContextMenu`는 기존 `DropdownMenu`의 token과 표현 규칙에 맞춰 이
저장소에서 직접 구현했습니다. 별도 primitive를 쓰는 이유는 메뉴를
pointer 위치의 우클릭 또는 focus 가능한 대상의 `Shift+F10`으로 열어야
하기 때문입니다. [shadcn/ui Context Menu 공식 문서](https://ui.shadcn.com/docs/components/radix/context-menu),
[고정 revision의 source](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/new-york-v4/ui/context-menu.tsx),
[같은 revision의 MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)를
확인했습니다. source를 복사하지 않아 shadcn notice를 이 item에
포함하지 않습니다.

[Radix Context Menu 공식 문서](https://www.radix-ui.com/primitives/docs/components/context-menu)의
우클릭·길게 누르기, item 탐색·활성화·submenu·Escape 규칙을
확인했습니다. 실제 의존성 `@radix-ui/react-context-menu@2.3.7`의
설치 패키지 `dist/index.mjs`, `LICENSE`와 package metadata를 같은
버전에서 확인했습니다. MIT LICENSE는 WorkOS copyright를 포함하며
패키지 자체가 npm dependency로 설치됩니다. 직접 registry 의존성은
`pyd-utils`, npm dependency는 해당 Radix 패키지와
`lucide-react@0.468.0`입니다. 추가 UI reference library 코드는
사용하지 않았습니다.

## 2026-09-29 숫자 입력 reference

`NumberInput`은 이 저장소에서 직접 구현했습니다.
[WAI-ARIA APG Spinbutton](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/)의
이름·범위·값 표현과 방향키, Home/End 조작을 참고했습니다.
[WHATWG HTML Number state](https://html.spec.whatwg.org/multipage/input.html#number-state-(type=number))의
숫자값 직렬화와 native form 동작도 확인했습니다. 외부 component
source를 복사하지 않아 편입한 upstream revision·LICENSE는 없습니다.
직접 registry 의존성은 기존 `pyd-input`이며 새 npm dependency는
없습니다. `pyd-input`의 shadcn/ui MIT 고지는 registry 설치 시 함께
전달합니다.

## 2026-09-29 태그 입력 reference

`TagsInput`은 이 저장소에서 직접 구현했습니다.
[W3C WAI form labels](https://www.w3.org/WAI/tutorials/forms/labels/)의
명시적으로 연결된 label과
[W3C WAI form instructions](https://www.w3.org/WAI/tutorials/forms/instructions/)의
키보드 조작 안내,
[W3C WAI form validation](https://www.w3.org/WAI/tutorials/forms/validation/)의
오류 설명을 참고했습니다. 외부 component source를 복사하지 않아
편입한 upstream revision·LICENSE는 없습니다. 직접 registry 의존성은
기존 `pyd-utils`뿐이고, 새 npm dependency는 없습니다.

## 2026-09-29 Spinner 형태 확장

기존 Spinner의 shadcn/ui 기반 icon 형태에 `ring`, `dots`, `bars`,
`orbit` 표현을 추가했습니다. [공식 Spinner 문서](https://ui.shadcn.com/docs/components/radix/spinner),
[고정 revision의 source](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/bases/radix/ui/spinner.tsx),
[같은 revision의 MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)를
확인했습니다. 추가 형태의 SVG는 이 저장소에서 직접 작성했습니다.
움직임 줄이기 처리는 [W3C WAI C39](https://www.w3.org/WAI/WCAG22/Techniques/css/C39)의
`prefers-reduced-motion` 사용 지침을 참고했습니다.

새 npm dependency는 없습니다. 기존 `lucide-react@0.468.0`과
`pyd-utils`를 사용하며, registry 설치 시 shadcn/ui MIT 고지를
함께 전달합니다. 접근 가능한 이름을 가진 `status` semantics를
모든 형태에 적용합니다.

## 2026-09-29 NavigationMenu reference

`NavigationMenu`는 이 저장소에서 직접 작성한 Radix primitive 조합입니다.
[shadcn/ui 공식 문서](https://ui.shadcn.com/docs/components/radix/navigation-menu),
[고정 revision의 source](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/bases/radix/ui/navigation-menu.tsx),
[같은 revision의 MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)를
확인했습니다. shadcn source는 복사하지 않았고 compound 구성만
참고했습니다. [Radix Navigation Menu 문서](https://www.radix-ui.com/primitives/docs/components/navigation-menu)의
Link·Trigger·Content 관계, 방향키·Escape 규칙을 확인했습니다.

직접 npm dependency는 `@radix-ui/react-navigation-menu@1.2.22`와
기존 `lucide-react@0.468.0`입니다. 설치된 Radix 1.2.22의
`package.json`, `dist/index.mjs`, MIT `LICENSE`를 같은 버전에서
확인했습니다. LICENSE에는 WorkOS copyright가 있습니다. 직접
registry 의존성은 `pyd-utils`이며 추가 UI reference library 코드는
사용하지 않았습니다.

## 2026-10-02 Menubar reference

`Menubar`는 이 저장소에서 직접 작성한 Radix primitive 조합입니다.
[shadcn/ui 공식 문서](https://ui.shadcn.com/docs/components/radix/menubar),
[고정 revision의 source](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/bases/radix/ui/menubar.tsx),
[같은 revision의 MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)를
확인했습니다. 메뉴 구성과 사용처만 참고했으며 source는 복사하지
않았습니다. [Radix Menubar 공식 문서](https://www.radix-ui.com/primitives/docs/components/menubar)의
상위 trigger 방향키 이동, 항목 탐색, submenu와 Escape 규칙을
확인했습니다.

직접 npm dependency는 `@radix-ui/react-menubar@1.1.24`와 기존
`lucide-react@0.468.0`입니다. Radix 1.1.24의
[배포 소스·manifest·MIT LICENSE](https://registry.npmjs.org/@radix-ui/react-menubar/-/react-menubar-1.1.24.tgz)를
같은 tarball에서 확인했습니다. manifest에는 `@radix-ui/react-menu@2.1.24`,
`@radix-ui/react-roving-focus@1.1.19` 등 직접 의존성이 있고 LICENSE에는
WorkOS copyright가 있습니다. 직접 registry 의존성은 `pyd-utils`입니다.
실제 보조기술 발표는 별도 미검증 항목입니다.

## 2026-09-29 DataChart 누적 막대

기존 프로젝트 소유 `DataChart`에 누적 막대 계산과 SVG 도형을 직접
추가했습니다. 기존에 기록한
[shadcn/ui Chart 공식 문서](https://ui.shadcn.com/docs/components/base/chart)는
차트 조합의 디자인 reference이며, 해당 component source나
Recharts 구현을 가져오지 않았습니다. 따라서 이번 variant에 편입한
외부 source revision이나 새 LICENSE는 없습니다. 직접 registry
의존성은 기존 `pyd-utils`뿐이며 새 npm dependency도 없습니다.
접근 가능한 값 목록은 기존 숨겨진 데이터 표를 그대로 사용합니다.

## 2026-09-29 HoverCard reference

`HoverCard`는 이 저장소의 `Popover` 관례에 맞춰 직접 작성했습니다.
[shadcn/ui 공식 문서](https://ui.shadcn.com/docs/components/radix/hover-card),
[고정 revision의 source](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/bases/radix/ui/hover-card.tsx),
[같은 revision의 MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)를
확인했습니다. 해당 source를 복사하지 않고 Root·Trigger·Content 구성과
링크 미리보기 용례만 참고했습니다.

[Radix Hover Card 문서](https://www.radix-ui.com/primitives/docs/components/hover-card)는
시각 사용자가 링크 목적지를 미리 보는 용도이며, 내용은 screen reader에
노출되지 않고 keyboard focus에서 열릴 수 있다고 설명합니다. 따라서
필수 정보는 카드 안에만 두지 않습니다. 직접 npm dependency는
`@radix-ui/react-hover-card@1.1.23`, registry 의존성은 `pyd-utils`입니다.
설치된 1.1.23의 `package.json`, `dist/index.mjs`, MIT `LICENSE`를
같은 버전에서 확인했습니다. LICENSE에는 WorkOS copyright가 있습니다.
추가 UI reference library 코드는 사용하지 않았습니다.

## 2026-09-29 Toast queue 확장

기존 프로젝트 소유 `Toast`에 queue hook과 표시 컴포넌트를 직접
추가했습니다. [WAI Alert Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)은
알림이 작업 focus를 방해하지 않아야 하며 너무 빠른 자동 소멸과 잦은
발표를 피하라고 설명합니다. 기존 `status`·`alert` 구분과 수동 닫기를
유지하고, 같은 `dedupeKey`가 대기열에 있으면 반복 추가를 무시합니다.
외부 component source를 편입하지 않았고 새 npm dependency도 없습니다.
직접 registry 의존성은 기존 `pyd-utils`뿐입니다.

## 2026-09-29 TimePicker

`TimePicker`의 시·분 조합, 부분 입력과 `HH:mm` 변환은 프로젝트에서
직접 작성했습니다. [React의 select 문서](https://react.dev/reference/react-dom/components/select)는
controlled 값·변경 이벤트·form과 label 연결의 근거입니다.
[MDN의 time input 문서](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/time)는
화면 형식과 독립된 24시간 `HH:mm` 값의 의미를 확인하는 reference입니다.
[Intl.DateTimeFormat 문서](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat)는
locale별 hour cycle과 day period 표기를 확인하는 reference입니다.
[W3C WAI의 form grouping 지침](https://www.w3.org/WAI/tutorials/forms/grouping/)에
따라 관련 select를 `fieldset`·`legend`로 묶고 각 select에도 이름을
제공했습니다.
이 문서들의 source는 복사하지 않았습니다.

표시용 `NativeSelect`는 이미 편입된 shadcn/ui 기반 component를
재사용합니다. [공식 문서](https://ui.shadcn.com/docs/components/radix/native-select),
[고정 revision의 source](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/bases/radix/ui/native-select.tsx),
[같은 revision의 MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)를
다시 확인했습니다. 새 소비자 설치에 NativeSelect와 MIT 고지 파일이
함께 생성됐습니다. 직접 registry 의존성은 `pyd-native-select`와
`pyd-utils`입니다. `NativeSelect`의 아이콘에 쓰이는 설치 버전
`lucide-react@0.468.0`의 package manifest와 ISC LICENSE를
소비자 fixture에서 확인했습니다. 이번 변경으로 새 npm dependency는
추가하지 않았습니다.

## 2026-09-29 DataChart 구간 선택기

기존 프로젝트 소유 `DataChart`에 native `<select>`와 SVG pointer
영역을 직접 추가했습니다.
[shadcn/ui Chart 공식 문서](https://ui.shadcn.com/docs/components/base/chart)는
차트와 값 표시의 조합 reference이며 Recharts나 `ChartTooltip` source는
편입하지 않았습니다.
[W3C 데이터 표 지침](https://www.w3.org/WAI/tutorials/tables/)에 맞춰
기존 `<table>`의 범주·계열 머리글과 모든 값을 유지합니다. 따라서
이번 확장에 편입한 외부 source revision이나 새 LICENSE는 없습니다.
직접 registry 의존성은 기존 `pyd-utils`뿐이고 새 npm dependency도
없습니다.

## 2026-09-29 ToggleGroup reference

`ToggleGroup`은 기존 토큰과 `utils`를 쓰는 프로젝트 소유 wrapper로
작성했습니다. [shadcn/ui 공식 문서](https://ui.shadcn.com/docs/components/radix/toggle-group),
[고정 revision의 source](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/bases/radix/ui/toggle-group.tsx),
[같은 revision의 MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)를
확인했습니다. 코드를 복사하지 않고 단일·복수 그룹의 용례만
참고했습니다.

[Radix Toggle Group 문서](https://www.radix-ui.com/primitives/docs/components/toggle-group)는
controlled·uncontrolled 값, 방향키 탐색과 비활성 항목을 명시합니다.
직접 npm dependency는 `@radix-ui/react-toggle-group@1.1.19`, registry
의존성은 `pyd-utils`입니다. 설치된 1.1.19의 `package.json`,
`dist/index.mjs`, WorkOS copyright의 MIT `LICENSE`를 확인했습니다.
해당 버전의 직접 의존성은 Radix primitive, context, direction,
roving focus, toggle, controllable state 패키지입니다.

## 2026-09-29 PinInput reference

`PinInput`은 native React input과 Tailwind로 직접 작성했습니다.
[shadcn/ui 공식 Input OTP 문서](https://ui.shadcn.com/docs/components/radix/input-otp),
[고정 revision의 source](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/bases/radix/ui/input-otp.tsx),
[같은 revision의 MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)를
확인했습니다. upstream의 `input-otp` source나 패키지는 편입하지
않았습니다. 분리된 칸의 표현만 참고했습니다.

[MDN OTP 입력 안내](https://developer.mozilla.org/en-US/docs/Web/Security/Authentication/OTP)의
native 입력 속성을 적용했습니다. 직접 registry 의존성은 기존
`pyd-utils`이고 새 npm dependency는 없습니다. 실제 SMS 자동완성은
확인하지 않았습니다.

## 2026-09-29 Rating reference

`Rating`은 native React radio와 Tailwind로 직접 작성했습니다.
[W3C WAI Rating Radio Group 예시](https://www.w3.org/WAI/ARIA/apg/patterns/radio/examples/radio-rating/)에서
점수를 radio로 선택하는 구조와 키보드 동작을 확인했습니다. 이 예시는
자체 코드를 production용으로 제공하지 않는다고 명시합니다. 예시
source는 사용하지 않았으므로 외부 component source revision이나
LICENSE는 편입하지 않았습니다.

[MDN radio 문서](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/radio)의
같은 이름을 가진 input과 `required` 규칙을 적용했습니다. 직접 registry
의존성은 기존 `pyd-utils`뿐이고 새 npm dependency는 없습니다.

## 2026-09-29 DataChart 누적 영역

기존 프로젝트 소유 `DataChart`에 `stacked-area` 계산과 SVG 도형을
직접 추가했습니다. [Vega의 공식 누적 영역 예시](https://vega.github.io/vega/examples/stacked-area-chart/)는
여러 계열의 누적값을 영역으로 표시하는 용례를 확인하는 데 사용했습니다.
[Vega-Lite의 invalid data 문서](https://vega.github.io/vega-lite/docs/invalid-data.html)는
결측값을 0으로 취급하거나 경로를 끊는 선택의 의미를 검토하는 데
참고했습니다. 이번 구현은 범주 안의 계열 하나라도 `null`이면 그
범주의 합계를 알 수 없는 값으로 표시하고 영역 경로를 끊습니다.

참고 문서의 source를 복사하거나 Vega, Vega-Lite, Recharts package를
설치하지 않았습니다. 따라서 새로 편입된 upstream revision·LICENSE는
없습니다. 직접 registry 의존성은 기존 `pyd-utils`뿐입니다.

## 2026-09-30 DataChart 선택형 범례

프로젝트 소유 `DataChart`에 `toggleableSeries` 옵션을 직접
추가했습니다. 기존 정적 범례를 기본값으로 유지하며, 선택형 범례는
native checkbox로 계열을 숨깁니다. 축·막대 배치·누적값·구간 값
패널·접근 가능한 데이터 표는 표시 중인 계열로 다시 계산합니다.
원래 계열 순서의 색과 선 모양은 유지합니다. 모든 계열을 숨기면
안내와 checkbox만 남겨 다시 선택할 수 있습니다.

[shadcn/ui Chart 공식 문서](https://ui.shadcn.com/docs/components/base/chart)는
기존 데이터 표시 reference입니다. 새 외부 source를 복사하거나
package를 추가하지 않았으므로 새 upstream revision·LICENSE는
없습니다. registry 직접 의존성은 기존 `pyd-utils`뿐입니다.

## 2026-09-29 ScrollArea

[shadcn/ui Scroll Area 공식 문서](https://ui.shadcn.com/docs/components/radix/scroll-area),
[고정 revision의 source](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/new-york-v4/ui/scroll-area.tsx),
[같은 revision의 MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)를
확인했습니다. root·viewport·scrollbar·thumb 구성을 이 저장소의
token과 `@radix-ui/react-scroll-area` 패키지에 맞게 수정했습니다.
viewport에 이름, `role=region`, keyboard focus를 추가했습니다.
registry 설치 시 shadcn/ui MIT 고지 파일도 전달합니다.

[Radix Scroll Area 문서](https://www.radix-ui.com/primitives/docs/components/scroll-area)는
native 스크롤과 keyboard 조작을 명시합니다. 직접 npm 의존성은
`@radix-ui/react-scroll-area@1.2.18`이며 설치된 package manifest와
LICENSE는 MIT, copyright는 WorkOS 2022입니다. 그 패키지의 직접 전이
의존성 9개 manifest도 모두 MIT로 확인했습니다. registry 내부 의존성은
`pyd-utils`이고 새로운 icon package는 없습니다. 실제 screen reader
발표, touch와 RTL 동작은 별도 검증이 필요합니다.

## 2026-09-29 AvatarGroup

`AvatarGroup`의 목록·표시 제한·남은 인원 표현은 이 저장소에서 직접
작성했습니다. [shadcn/ui Avatar 공식 문서](https://ui.shadcn.com/docs/components/radix/avatar)는
기존 `Avatar` 사용법의 reference입니다.
[고정 revision의 Avatar source](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/bases/radix/ui/avatar.tsx)와
[같은 revision의 MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)를
확인했습니다. 새 group에 외부 source를 복사하지 않았습니다.

직접 registry 의존성은 기존 `pyd-avatar`, `pyd-utils`입니다. 새 npm
dependency는 없습니다. 격리 소비자에 설치된
`@radix-ui/react-avatar@1.2.6`의 package manifest와 MIT LICENSE를
확인했습니다. 실제 screen reader와 이미지 요청 실패 후 fallback은
검증하지 않았습니다.

## 2026-09-29 ButtonGroup

`ButtonGroup`의 연결 배치와 장식 분리선은 프로젝트에서 직접
작성했습니다. [shadcn/ui 공식 문서](https://ui.shadcn.com/docs/components/radix/button-group),
[고정 revision의 source](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/new-york-v4/ui/button-group.tsx),
[같은 revision의 MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)를
확인했습니다. 작업 버튼과 상태 toggle의 사용처 구분, 이름 있는
그룹의 native keyboard 조작을 참고했으며 upstream source는
복사하지 않았습니다.

새 npm dependency는 없습니다. 직접 registry 의존성은 기존
`pyd-button`과 `pyd-utils`입니다. 격리 소비자에서 기존 `Button`에
필요한 `class-variance-authority@0.7.1`(Apache-2.0),
`clsx@2.1.1`(MIT), `tailwind-merge@3.7.0`(MIT)의 package
manifest와 LICENSE 파일을 확인했습니다. shadcn/ui 기반 `Button`의
MIT 고지 파일도 함께 설치됐습니다.

## 2026-09-29 DateTimePicker

`DateTimePicker`는 프로젝트 소유 `DatePicker`와 `TimePicker`를
조합해 직접 작성했습니다. 외부 component source를 복사하거나 새
npm dependency를 추가하지 않았습니다. 날짜 선택의 공식 문서·고정
source·MIT LICENSE는 위 DatePicker와 Calendar 조사에, 시각 선택의
native `<select>` 근거는 위 TimePicker 조사에 기록했습니다.

직접 registry 의존성은 `pyd-date-picker`, `pyd-time-picker`,
`pyd-utils`입니다. 격리 소비자 설치에서 이 항목과 전이 의존성을
포함한 10개 파일이 생성됐고 원본과 일치했습니다. 설치된 외부 runtime
패키지는 `react-day-picker@9.14.0`, `@radix-ui/react-popover@1.1.23`,
`lucide-react@0.468.0`, React·`clsx`·`tailwind-merge`입니다.
새로 작성한 조합에는 별도 upstream revision이나 LICENSE가 없습니다.

## 2026-09-29 CodeBlock

`CodeBlock`은 native `<figure>`·`<figcaption>`·`<pre>`·`<code>`와
기존 `Button`으로 직접 작성했습니다.
[MDN의 `pre` 문서](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/pre)에서
공백 보존과 긴 줄의 CSS 처리 원칙을,
[Clipboard `writeText()` 문서](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText)에서
secure context와 Promise 실패 처리를 확인했습니다. MDN의 예시
source는 복사하지 않았으므로 새로 편입된 upstream revision·LICENSE는
없습니다.

직접 registry 의존성은 기존 `pyd-button`, `pyd-utils`이고 새 외부
npm dependency는 없습니다. 격리 소비자 설치에서 CodeBlock, Button,
utils, token CSS, shadcn/ui MIT 고지 5개 파일을 원본과 대조했습니다.
Button의 source·LICENSE·전이 의존성 조사는 앞선 기록을 따릅니다.

## 2026-09-29 Markdown

`Markdown`은 React 텍스트 노드와 native heading·paragraph·list·link·
`pre`/`code` 요소로 직접 작성했습니다. 문법 범위를 정할 때
[CommonMark 0.31.2 명세](https://spec.commonmark.org/0.31.2/)를
참고했습니다. 명세의 문장·예제·파서 소스를 복사하지 않았으며,
전체 CommonMark 호환을 주장하지 않습니다. 명세 문서의 라이선스는
CC BY-SA 4.0이고 새 component 구현은 프로젝트 소유입니다.

직접 registry 의존성은 `pyd-utils`입니다. 추가 npm 패키지는 없으며
React와 기존 token stylesheet를 사용합니다. 보안상 링크는 절대
HTTP(S) 주소만 허용하고 원시 HTML은 React 텍스트로 남깁니다. 실제
screen reader와 개별 registry 소비자 설치는 검증 기록에 구분합니다.

## 2026-09-29 DataList

`DataList`는 프로젝트에서 native `<dl>`·`<dt>`·`<dd>`를 사용해 직접
작성했습니다. [MDN의 `dl` 문서](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dl)와
[HTML Living Standard의 description list 규칙](https://html.spec.whatwg.org/multipage/grouping-content.html#the-dl-element)을
확인했습니다. 이름/값 쌍과 `div`를 통한 묶음만 참고했으며 외부
source는 복사하지 않았습니다. 따라서 편입한 upstream revision이나
LICENSE는 없습니다.

직접 registry 의존성은 `pyd-utils`이고 새 npm dependency는 없습니다.
문서 예시에서 쓰는 `Badge`는 별도 기존 component이며 `DataList`
자체의 의존성은 아닙니다. 격리 소비자에 설치된 DataList·Badge·utils·
token CSS의 원본 일치를 확인했습니다. 실제 screen reader 발표는
별도 검증 대상입니다.

## 2026-09-29 Badge 표시 형태

기존 프로젝트 소유 `Badge`의 `variant`를 확장했습니다.
[shadcn/ui Badge 공식 문서](https://ui.shadcn.com/docs/components/radix/badge),
[고정 revision의 Badge source](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/new-york-v4/ui/badge.tsx),
[같은 revision의 MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)를
확인했습니다. variant 개념을 참고했지만 source는 복사하지 않았습니다.
새 `Badge` 코드의 색과 형태는 pydemia token으로 직접 정했습니다.

직접 registry 의존성은 기존 `pyd-utils`이고 새 npm dependency는
없습니다. 설치된 `clsx@2.1.1`과 `tailwind-merge@3.7.0`의 package
manifest와 LICENSE 파일에서 모두 MIT를 확인했습니다. React는
peer dependency입니다. 격리 소비자의 Badge·utils·token CSS 3개
파일을 원본과 대조했습니다. 실제 screen reader 발표는 미검증입니다.

## 2026-09-29 registry target 경로

[shadcn registry item 문서](https://ui.shadcn.com/docs/registry/registry-item-json)는
`@ui/` target이 소비자의 `components.json`에서 `aliases.ui`로 지정한
디렉터리에 설치되는 placeholder라고 설명합니다. 현재
`shadcn@4.21.0` 새 소비자에서 `@ui/`가
`src/components/ui/`에 설치되는 것을 확인했습니다. 같은 registry
JSON을 `shadcn@4.0.0`으로 설치하면 `src/@ui/`에 생성됐습니다.
따라서 문서의 설치 명령을 확인한 CLI 버전으로 고정했습니다.
이 조사는 source code 편입이나 npm runtime dependency 변경이
아닙니다.

## 2026-09-29 하단 탐색 참고 범위

[MUI Bottom Navigation 공식 문서](https://mui.com/material-ui/react-bottom-navigation/)의
주요 목적지 배치와 아이콘·이름 표시 사례를 확인했습니다. 같은
`v9.4.0` revision(`ce3c596185a73b3c85b7702c0297163096b2e6c4`)의
[BottomNavigation source](https://github.com/mui/material-ui/blob/ce3c596185a73b3c85b7702c0297163096b2e6c4/packages/mui-material/src/BottomNavigation/BottomNavigation.js),
[BottomNavigationAction source](https://github.com/mui/material-ui/blob/ce3c596185a73b3c85b7702c0297163096b2e6c4/packages/mui-material/src/BottomNavigationAction/BottomNavigationAction.js),
[MIT LICENSE](https://github.com/mui/material-ui/blob/ce3c596185a73b3c85b7702c0297163096b2e6c4/LICENSE)를
대조했습니다. MUI의 source와 dependency는 편입하지 않았습니다.
`BottomNav`는 기존 React·Tailwind·`pyd-utils`만 사용하며 npm runtime
dependency를 추가하지 않습니다. 접근성 규칙은
[W3C navigation landmark 예시](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/navigation.html)와
[W3C `aria-current` 기법](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA26)을
확인했습니다. 실제 screen reader 발표는 아직 확인하지 않았습니다.

## 2026-09-29 SegmentedControl 참고 범위

`SegmentedControl`은 프로젝트에서 작성한 native `fieldset`·`legend`·
radio 입력입니다. [W3C WAI-ARIA radio group 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)의
단일 선택과 방향키 규칙을 참고했습니다. 외부 component source를
복사하지 않았으므로 편입한 upstream revision이나 LICENSE는 없습니다.

처음 검토한 [Radix Radio Group 공식 문서](https://www.radix-ui.com/primitives/docs/components/radio-group/)와
설치된 `@radix-ui/react-radio-group@1.4.7`의 배포 source
(`node_modules/@radix-ui/react-radio-group/dist/index.mjs`)·MIT
LICENSE를 대조했습니다. 그러나 문서 preview에서 이 구현의 방향키가
focus만 옮기고 선택값을 갱신하지 않아 최종 코드에서 사용하지
않았습니다. 최종 registry 직접 의존성은 `pyd-utils`이며 새로운 npm
dependency는 없습니다. `pyd-utils`가 사용하는 `clsx`와
`tailwind-merge`는 기존 의존성입니다.

## 2026-09-29 SplitButton 조합 예시

별도 source 편입 없이 기존 `ButtonGroup`·`Button`·`DropdownMenu`를
조합했습니다. 분할 작업 구성은 [shadcn/ui Button Group 문서](https://ui.shadcn.com/docs/components/radix/button-group)를
참고했습니다. 해당 `ButtonGroup`의 고정 source revision과 같은
revision의 MIT LICENSE는 위 ButtonGroup 절에 기록했습니다.
[Radix Dropdown Menu 문서](https://www.radix-ui.com/primitives/docs/components/dropdown-menu)와
[W3C Menu Button 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/)도
확인했습니다. 설치된 `@radix-ui/react-dropdown-menu@2.1.22`의
package manifest, `dist/index.mjs`, MIT LICENSE를 확인했습니다.
새 npm dependency나 registry item은 없습니다. 실제 screen reader
발표와 touch·RTL 동작은 검증하지 않았습니다.

## 2026-09-29 CitationList 참고 범위

`CitationList`는 프로젝트가 작성한 출처 목록입니다.
[AI Elements Inline Citation 문서](https://elements.ai-sdk.dev/components/inline-citation),
revision `6a9d5b1822ffb10bba4bd97175f01edd7d8651cd`의
[inline-citation source](https://github.com/vercel/ai-elements/blob/6a9d5b1822ffb10bba4bd97175f01edd7d8651cd/packages/elements/src/inline-citation.tsx),
[sources source](https://github.com/vercel/ai-elements/blob/6a9d5b1822ffb10bba4bd97175f01edd7d8651cd/packages/elements/src/sources.tsx),
[같은 revision의 Apache-2.0 LICENSE](https://github.com/vercel/ai-elements/blob/6a9d5b1822ffb10bba4bd97175f01edd7d8651cd/LICENSE)를
확인했습니다. upstream source는 HoverCard·Carousel·Badge·
lucide-react 등을 사용하지만 복사하거나 dependency로 편입하지
않았습니다. 링크 이름은 [W3C H30](https://www.w3.org/WAI/WCAG21/Techniques/html/H30)을
참고했습니다.

새 registry item의 직접 의존성은 기존 `pyd-utils`뿐입니다.
React와 Tailwind 외 새 npm runtime dependency는 없습니다. 실제
screen reader 발표와 외부 링크 이동은 검증하지 않았습니다.

## 2026-09-30 Feedback 상태별 표시 확장

기존 Alert는 shadcn/ui의
[공식 문서](https://ui.shadcn.com/docs/components/radix/alert),
[고정 소스](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/bases/radix/ui/alert.tsx),
[동일 revision MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)를
다시 확인했습니다. 공식 문서는 custom color 사례를 제공합니다.
Alert의 info·success·warning 색상과 Toast의 상태색은 이 저장소에서
구현했으며 새 외부 코드나 runtime 의존성을 편입하지 않았습니다.
`status`와 `alert` 역할은
[WAI Alert Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)과
기존 역할 구분을 참고했습니다. 실제 screen reader 검사는 남았습니다.

## 2026-09-30 InputGroup

[shadcn/ui Input Group 공식 문서](https://ui.shadcn.com/docs/components/radix/input-group),
revision `98a1fe67b439324ddc857f47fbdce056600a4329`의
[Input Group source](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/bases/radix/ui/input-group.tsx),
[동일 revision MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)를
확인했습니다. upstream은 React, `class-variance-authority`, 내부
`Button`·`Input`·`Textarea`·`cn`을 사용합니다. 입력 옆·위·아래 addon과
버튼 조합을 참고해 공통 token 및 기존 `@pydemia/ui` 컴포넌트로
수정했습니다. 새 npm runtime dependency는 없습니다. registry 직접
의존성은 `pyd-input`·`pyd-textarea`·`pyd-button`·`pyd-utils`입니다.

입력과 textarea의 label 연결, 별도 버튼의 DOM·Tab 순서, Enter 제출은
SSR과 Chromium에서 확인했습니다. 실제 screen reader·touch·Safari·RTL은
검증하지 않았습니다.

## 2026-09-30 RangeSlider

기존 `Slider`는 shadcn/ui의
[공식 문서](https://ui.shadcn.com/docs/components/radix/slider),
revision `98a1fe67b439324ddc857f47fbdce056600a4329`의
[Slider source](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/bases/radix/ui/slider.tsx),
[동일 revision MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)를
수정해 사용합니다. 기존 registry item의 MIT 고지 전달을 유지합니다.
[Radix Slider 공식 문서](https://www.radix-ui.com/primitives/docs/components/slider)는
다중 thumb, 키보드, 최소 간격과 form 동작을 설명합니다. 설치된
`@radix-ui/react-slider@1.4.7`의 package manifest, `dist/index.mjs`,
MIT LICENSE를 확인했습니다. Root의 단일 `name`으로는 두 endpoint를
각각 이름 붙여 제출할 수 없으므로 `RangeSlider`에 두 hidden input을
추가했습니다. 두 입력은 새 이름으로 제출되고 Radix 내부 입력은
이름 없이 남습니다.

접근성 기준은
[WAI-ARIA APG 다중 thumb 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/)을
참고했습니다. `RangeSlider`는 프로젝트의 원본 조합이며 upstream
source를 복사하지 않았습니다. registry 의존성은 `pyd-slider`와
`pyd-utils`, 새 npm runtime 의존성은 없습니다. 실제 touch 보조기술,
screen reader, Safari, RTL은 검증하지 않았습니다.

## 2026-09-30 ScatterChart 참고 범위

두 연속 수치의 관계는 기존 `DataChart`의 범주형 x축으로 표현하기
어려워 `ScatterChart`를 별도 component로 작성했습니다.
[Recharts ScatterChart 공식 문서](https://recharts.github.io/en-US/api/ScatterChart/)와
revision `44bba29e74bbfdfc6715176f3eecea0392a95080`의
[ScatterChart source](https://github.com/recharts/recharts/blob/44bba29e74bbfdfc6715176f3eecea0392a95080/src/chart/ScatterChart.tsx),
[Scatter source](https://github.com/recharts/recharts/blob/44bba29e74bbfdfc6715176f3eecea0392a95080/src/cartesian/Scatter.tsx),
[package manifest](https://github.com/recharts/recharts/blob/44bba29e74bbfdfc6715176f3eecea0392a95080/package.json),
[MIT LICENSE](https://github.com/recharts/recharts/blob/44bba29e74bbfdfc6715176f3eecea0392a95080/LICENSE)를
같은 revision에서 확인했습니다. manifest의 runtime 의존성은
`@reduxjs/toolkit`, `clsx`, `decimal.js-light`, `es-toolkit`,
`eventemitter3`, `immer`, `react-redux`, `reselect`,
`tiny-invariant`, `use-sync-external-store`, `victory-vendor`입니다.
좌표축과 산점도 개념만 참고했고 소스·의존성은 편입하지 않았습니다.

정확한 좌표는 native 선택기와 표로 제공합니다.
[W3C APG Table Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/table/)의
행·열 관계와
[accessible name 지침](https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/)을
참고했습니다. SVG는 장식으로 숨기며 pointer 점 선택에 대응하는
native 선택기를 제공합니다. 새 registry 직접 의존성은 `pyd-utils`,
새 npm runtime 의존성은 없습니다. 실제 screen reader·touch·Safari·
RTL은 검증하지 않았습니다.

## 2026-09-30 MonthPicker

월 단위 보고·필터에 `YYYY-MM` 값을 직접 쓰기 위해 새 원본
`MonthPicker`를 작성했습니다. 기존 `DatePicker`는 일자를 포함한
`YYYY-MM-DD` 값이므로 월만 필요한 form에서 대체할 수 없습니다.
[MUI X MonthCalendar API](https://mui.com/x/api/date-pickers/month-calendar/)의
월 그리드, 선택·비활성 상태를 참고했습니다. 동일 revision
`a87939ed420ab1d77102a3db121fdc918080c5c3`의
[MonthCalendar 소스](https://github.com/mui/mui-x/blob/a87939ed420ab1d77102a3db121fdc918080c5c3/packages/x-date-pickers/src/MonthCalendar/MonthCalendar.tsx),
[package manifest](https://github.com/mui/mui-x/blob/a87939ed420ab1d77102a3db121fdc918080c5c3/packages/x-date-pickers/package.json),
[MIT LICENSE](https://github.com/mui/mui-x/blob/a87939ed420ab1d77102a3db121fdc918080c5c3/packages/x-date-pickers/LICENSE)를
직접 확인했습니다. MUI 구현은 `@mui/utils`, `@mui/x-internals`,
`clsx`, `prop-types`, `react-transition-group` 등을 사용하고
`@mui/material`과 date adapter를 peer로 받습니다. 그 코드와
의존성은 편입하지 않았습니다.

새 구현은 기존 `pyd-popover`, `pyd-utils`, `lucide-react`를 사용합니다.
Popover의 Radix 의존성과 라이선스는 기존 Popover 조사에 따릅니다.
이름 있는 native 버튼, disabled 월, 선택 상태, Escape 닫기와 trigger
포커스 복귀를 사용하며 키보드·브라우저 확인 범위는
`research/verification.md`에 기록합니다.

## 2026-09-30 답변 평가·즐겨찾기·게시판·대댓글

`ResponseFeedback`, `FavoriteToggle`, `Board`, `Thread`의 소스는
프로젝트에서 새로 작성했습니다. 외부 component 소스는 복사하지
않았습니다. 답변 평가와 즐겨찾기는 기존 `Button`·`Toggle` 및
`lucide-react@0.468.0` 아이콘을, 게시판과 댓글은 `Button`·`Textarea`를
사용합니다. 새 npm runtime 의존성은 없습니다. 게시글 작성 modal은
기존 `Dialog`를 조합합니다.

기존 Dialog의 [공식 사용 문서](https://ui.shadcn.com/docs/components/radix/dialog),
registry에 기록된 revision `98a1fe67b439324ddc857f47fbdce056600a4329`의
[소스](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/new-york-v4/ui/dialog.tsx)와
[MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)를
다시 확인했습니다. 해당 Dialog는 `@radix-ui/react-dialog`와
`lucide-react`를 사용하며 MIT notice는 기존 registry 전달 경로를
따릅니다. 새 네 컴포넌트 자체의 provenance는 `pydemia/ui` 원본으로
기록했습니다. 공개 사용 조건은 저장소에서 아직 지정하지 않았습니다.

[W3C WAI의 접근성 이름·설명 지침](https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/)에
맞춰 평가·즐겨찾기의 안정적인 버튼 이름과 집계 설명, 게시판의 이름
있는 section, 댓글 작성 field의 연결된 label을 사용합니다. 키보드와
화면 낭독기 검증 범위는 `research/verification.md`에 구분합니다.

## 2026-10-01 Combobox 원격 결과 갱신

기존 `Combobox`의 옵션 목록 교체·로딩·오류 상태를 프로젝트 원본
소스에서 확장했습니다. 2026-10-01에
[WAI-ARIA APG Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)의
입력·listbox 역할, `aria-activedescendant`와 방향키·Enter·Escape 규칙을
다시 확인했습니다. APG 구현 코드는 복사하지 않았습니다. 신규 npm
dependency는 없으며 registry 의존성도 `pyd-input`·`pyd-utils` 그대로입니다.
로딩·오류 발표의 실제 screen reader 확인은 남아 있습니다.
## 2026-10-01 Checkbox·RadioGroup 카드 표시 형태

기존 `pyd-checkbox`·`pyd-radio-group` item에 자체 카드 표시를
추가했습니다. 별도 component나 npm 의존성은 없습니다. 기존
shadcn/ui 고정 revision
`98a1fe67b439324ddc857f47fbdce056600a4329`의
[Checkbox source](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/bases/radix/ui/checkbox.tsx),
[Radio Group source](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/bases/radix/ui/radio-group.tsx),
[MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)를
다시 확인했습니다. 공식 [Checkbox](https://ui.shadcn.com/docs/components/radix/checkbox)와
[Radio Group](https://ui.shadcn.com/docs/components/radix/radio-group),
Radix [Checkbox](https://www.radix-ui.com/primitives/docs/components/checkbox)·
[Radio Group](https://www.radix-ui.com/primitives/docs/components/radio-group)의
상태·Space·방향키 규칙을 확인했습니다. 카드의 레이아웃과 이름·설명
연결은 pydemia/ui에서 작성한 확장입니다.

설치된 `@radix-ui/react-checkbox@1.3.11`의 직접 의존성 7개와
`@radix-ui/react-radio-group@1.4.7`의 직접 의존성 9개를 해당
package manifest에서 확인했습니다. 두 패키지의 LICENSE 파일과
license metadata는 MIT이며 기존 lockfile의 전이 의존성 검토 범위를
사용합니다. 이번 변경으로 전이 의존성은 늘지 않았습니다.

## 2026-10-01 YearPicker

`YearPicker`의 10년 탐색과 `YYYY` 값 처리는 pydemia/ui에서
작성했습니다. `MonthPicker`의 controlled form 값과 기존 Popover
조합을 참고했으며 외부 YearPicker 소스를 복사하지 않았습니다.
별도 npm runtime 의존성은 없습니다.

사용한 Popover의 [shadcn/ui 공식 문서](https://ui.shadcn.com/docs/components/radix/popover),
고정 revision `98a1fe67b439324ddc857f47fbdce056600a4329`의
[Popover 소스](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/bases/radix/ui/popover.tsx)와
[MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)를
직접 확인했습니다. [Radix Popover 문서](https://www.radix-ui.com/primitives/docs/components/popover)의
열기·닫기·focus 동작도 확인했습니다. 설치된
`@radix-ui/react-popover@1.1.23`의 manifest와 LICENSE는 MIT이고
직접 의존성은 15개입니다. `lucide-react@0.468.0`의 manifest는
ISC입니다. 두 package 모두 기존 의존성이며 lockfile을 변경하지
않습니다. Popover의 수정 소스·MIT 고지는 기존 registry item이
전달합니다.

## 2026-10-02 IconButton·Tabs 표시 형태

`IconButton`은 pydemia/ui에서 작성한 원본 wrapper입니다.
[shadcn/ui Button 공식 문서](https://ui.shadcn.com/docs/components/radix/button),
[고정 revision의 Button source](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/new-york-v4/ui/button.tsx),
[같은 revision의 MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)를
대조했습니다. 기존 `pyd-button`의 `size="icon"`을 조합하며 upstream
소스를 새로 복사하지 않습니다.
[WAI-ARIA APG Button 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/button/)의
접근 가능한 이름과 Enter·Space 규칙을 적용했습니다. 직접 registry
의존성은 `pyd-button`이고 새 npm 의존성은 없습니다.

`Tabs`는 기존 shadcn/ui 기반 수정 source에 pydemia/ui의 token
표시 형태를 추가했습니다.
[shadcn/ui Tabs 공식 문서](https://ui.shadcn.com/docs/components/radix/tabs),
[고정 revision의 Tabs source](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/bases/radix/ui/tabs.tsx),
위 MIT LICENSE와
[Radix Tabs 공식 문서](https://www.radix-ui.com/primitives/docs/components/tabs),
[WAI-ARIA APG Tabs 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)을
확인했습니다. 설치된 `@radix-ui/react-tabs@1.1.21`의
`package.json`·`dist/index.mjs`·MIT `LICENSE`는 같은 배포판의
파일입니다. manifest의 직접 의존성은 Radix context 1.2.2,
direction 1.1.4, id 1.1.4, react-primitive 2.1.10,
presence 1.1.10, roving-focus 1.1.19,
use-controllable-state 1.2.6과 primitive 1.1.7입니다.
React·React DOM은 peer dependency입니다. 새 npm 의존성은 없습니다.

## 2026-10-02 CodeEditorShell

`CodeEditorShell`은 pydemia/ui에서 작성한 원본입니다. SQL·설정 조각의
일반 텍스트 편집 화면을 구성하며 외부 editor 구현 코드는 복사하지
않았습니다. 기존 `Textarea`를 사용합니다. 이 dependency는
[shadcn/ui 공식 Textarea 문서](https://ui.shadcn.com/docs/components/radix/textarea),
[고정 revision의 source](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/bases/radix/ui/textarea.tsx),
[같은 revision의 MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)를
직접 확인했습니다. 수정된 `pyd-textarea` item이 원본 고지를
소비자에게 전달합니다.

[WHATWG HTML textarea 명세](https://html.spec.whatwg.org/multipage/form-elements.html#the-textarea-element)의
multiline 값·form 제출·readonly·disabled와
[W3C WAI label 지침](https://www.w3.org/WAI/tutorials/forms/labels/)의
명시적 label 연결을 참고했습니다. 두 문서는 동작·접근성 참고이며
소스 코드를 복사하지 않았습니다. 직접 registry dependency는
`pyd-textarea`와 `pyd-utils`입니다. React 19는 기존 peer dependency,
`clsx`·`tailwind-merge`는 기존 `pyd-utils`의 의존성입니다.
새 npm 또는 전이 dependency는 없습니다. 화면 낭독기 발표는
직접 확인하지 않았습니다.

## 2026-10-02 CalendarScheduler

`CalendarScheduler`는 pydemia/ui 원본입니다. 날짜와 시간순 일정 목록을
묶고 선택·추가 callback만 호출합니다. 외부 일정 component 코드는
복사하지 않았습니다. 기존 `pyd-calendar`·`pyd-button`·`pyd-utils`와
`react-day-picker@9.14.0`의 공개 `labelDayButton`을 사용합니다. 새 npm
runtime dependency는 없습니다.

[DayPicker v9.14.0 custom modifiers](https://daypicker.dev/v9/guides/custom-modifiers)와
[접근성 지침](https://daypicker.dev/v9/guides/custom-components#keep-accessibility-and-behavior-intact)의
날짜 표시·이름 규칙을 확인했습니다. 설치된 v9.14.0의
`DayButton.d.ts`·`DayButton.js`·`labelDayButton.d.ts`와
[같은 태그의 원본](https://github.com/gpbl/react-day-picker/blob/v9.14.0/src/labels/labelDayButton.ts),
[MIT LICENSE](https://github.com/gpbl/react-day-picker/blob/v9.14.0/LICENSE)를
대조했습니다. 이미 고정한 `pyd-calendar`의 shadcn/ui 원본과 고지는
기존 registry dependency가 전달합니다. 직접 registry dependency는
`pyd-calendar`·`pyd-button`·`pyd-utils`이며 DayPicker 패키지 버전도
item에 고정했습니다. 실제 screen reader·touch·Safari·RTL은
검증하지 않았습니다.
## 2026-10-02 QueryBuilder

`QueryBuilder`는 pydemia/ui 원본 구현입니다. 외부 component 소스를
복사하지 않았습니다. 직접 registry dependency는 `pyd-button`,
`pyd-input`, `pyd-native-select`, `pyd-utils`입니다. 날짜 값 검사에
기존 `calendar-date.ts`를 사용하며 새 npm 의존성은 없습니다.

[W3C WAI의 form grouping 지침](https://www.w3.org/WAI/tutorials/forms/grouping/)에서
관련 입력을 `fieldset`·`legend`로 묶는 방식을 참고했습니다. 명세
설명만 참고했으며 예제 코드를 복사하지 않았습니다. 기존 Button·Input·
NativeSelect의 source와 고지는 해당 registry item이 전달합니다.
실제 screen reader·touch·Safari·RTL은 검증하지 않았습니다.
## 2026-10-02 AgentStatus

`AgentStatus`는 pydemia/ui 원본 구현입니다. 외부 component 코드는
복사하지 않았습니다. 기존 `pyd-button`·`pyd-utils`만 registry
dependency로 사용하며 새 npm 의존성은 없습니다. 전체 상태와 단계
상태의 표시는 native section·ordered list·progress·button을
사용합니다. 기존 Button의 source와 고지는 해당 registry item이
전달합니다. 실제 screen reader·touch·Safari·RTL은 미검증입니다.

## 2026-10-02 AnchorNav

`AnchorNav`는 pydemia/ui 원본 구현입니다. 외부 component 소스는
복사하지 않았습니다. native nav·a와 React state, 기존
`pyd-utils`만 사용하며 새 npm 의존성은 없습니다.

[W3C WAI의 `aria-current` 지침](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA26)을
현재 위치 링크의 의미 참고 자료로 확인했습니다. 문서의 예제
코드는 복사하지 않았습니다. 내부 스크롤과 hash 이동은 브라우저
동작으로 확인했으며 실제 보조기술 발표는 검사하지 않았습니다.

## 2026-10-02 TreeNav

`TreeNav`는 pydemia/ui 원본 구현입니다. 외부 component 소스를
복사하지 않았습니다. React와 native nav·ul·a·button, 기존
`pyd-utils`를 사용하며 새 npm 의존성은 없습니다.

[W3C WAI-ARIA APG의 disclosure navigation 예시](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation-hybrid/)에서
페이지 링크와 하위 목록 버튼을 분리하는 의미 구조만 참고했습니다.
예제 코드는 복사하지 않았습니다. Chromium에서 native keyboard
조작과 현재 링크 표시를 확인했으며 실제 보조기술 발표는
검사하지 않았습니다.

## 2026-10-02 AvatarUploader

`AvatarUploader`는 pydemia/ui 원본 조합입니다. 외부 component
코드를 복사하지 않았고 새 npm 의존성도 없습니다. 기존 `Avatar`
item은 shadcn/ui의 고정 revision
`98a1fe67b439324ddc857f47fbdce056600a4329`를 기준으로
[공식 문서](https://ui.shadcn.com/docs/components/radix/avatar),
[source](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/bases/radix/ui/avatar.tsx),
[같은 revision의 MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)를
확인했습니다. pydemia/ui의 기존 `Avatar` item에는
`@radix-ui/react-avatar@1.2.6` 의존성이 기록돼 있습니다.
`ImageCropper`·`Button`·`pyd-utils`도 기존 item을
재사용합니다.

[WHATWG HTML 파일 입력 명세](https://html.spec.whatwg.org/multipage/input.html#file-upload-state-(type=file))와
[W3C File API의 Blob URL 생성·해제](https://w3c.github.io/FileAPI/#dfn-createObjectURL)를
native 동작 참고 자료로 확인했습니다. 파일 입력·버튼의 native
keyboard 동작, 결과와 오류의 표시를 Chromium에서 확인했습니다.
실제 screen reader 발표는 검사하지 않았습니다.

## 2026-10-02 Terminal

`Terminal`은 pydemia/ui 원본 구현입니다. 외부 component 소스를
복사하지 않았고 React, 기존 `pyd-button`·`pyd-utils` 외에 새 npm
의존성이 없습니다. `pyd-button`의
[공식 문서](https://ui.shadcn.com/docs/components/radix/button),
[고정 source](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/new-york-v4/ui/button.tsx),
[같은 revision의 MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)는
기존 조사를 재사용합니다. Button의 npm 의존성은 기존
`class-variance-authority@0.7.1`입니다.

[W3C WAI의 log role 지침](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA23.html)에서
순차적 출력의 의미 구조를 확인했습니다. 예제 코드는 복사하지
않았습니다. 명령 입력은 native form을 사용하고 출력의 음성 발표는
빠른 로그가 많을 수 있어 기본으로 끕니다. 실제 screen reader
발표는 검사하지 않았습니다.

로컬 Chromium에서 native Enter 제출과 위·아래 방향키 이력,
390px dark 화면을 확인했습니다. 빠른 출력의 실제 보조기술 발표는
확인하지 않았습니다.

## 2026-10-02 NodeCanvas

`NodeCanvas`는 pydemia/ui 원본 React·Tailwind 구현입니다. 외부
component 소스를 복사하지 않았습니다. 새 npm 의존성은 없으며
기존 `pyd-button`·`pyd-utils`만 registry 의존성으로 사용합니다.
`pyd-button`의 공식 문서, 고정 source·같은 revision의 MIT LICENSE,
`class-variance-authority@0.7.1` 의존성은 위 Terminal 조사와
동일한 item을 재사용합니다.

[W3C WCAG 2.2의 dragging movements 해설](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements)은
끌기 외에 단일 pointer 조작 수단도 필요하다고 설명합니다.
노드 이동은 pointer 끌기와 함께 X·Y native 숫자 입력·적용 버튼,
키보드 방향키를 제공합니다. 연결은 native select와 버튼으로
추가하고 목록의 버튼으로 제거합니다. 이 자료의 예제 코드는
복사하지 않았습니다. Chromium에서 조작을 확인했지만 실제
screen reader 발표와 touch·Safari·RTL은 검사하지 않았습니다.
## 2026-10-02 MarkdownEditor

`MarkdownEditor`는 pydemia/ui 원본 React·Tailwind 구현입니다. 외부
editor 코드를 복사하지 않았습니다. 기존 `pyd-markdown`·
`pyd-textarea`·`pyd-utils`를 조합하며 새 npm 의존성은 없습니다.
WHATWG [textarea 명세](https://html.spec.whatwg.org/multipage/form-elements.html#the-textarea-element)의
native multiline 값·form control을 참고했습니다. 원문은
`onValueChange`로 호출자에게 전달합니다. 미리보기 문법과 안전한
링크 처리는 기존 `Markdown`의
범위를 그대로 사용합니다. 실제 screen reader·touch·Safari·RTL은
검증하지 않았습니다.

## 2026-10-03 BoxPlotChart

`BoxPlotChart`는 pydemia/ui에서 새로 작성한 React·Tailwind 원본입니다.
외부 component 소스·그림을 복사하지 않았고 새 npm 의존성도 없습니다.
registry 의존성은 기존 `pyd-utils`뿐입니다. 따라서 편입한 upstream
revision이나 외부 component LICENSE는 없습니다. 현재 공급물의
소스 표기는 `project-owned`이며 공개 사용 조건은 별도로 정하지
않았습니다.

[NIST의 Box Plot 설명](https://itl.nist.gov/div898/handbook/eda/section3/boxplot.htm)에서
사분위 상자와 최솟값·최댓값 수염의 의미를 확인했습니다. NIST가
설명하는 이상치 fence 변형은 구현하지 않습니다.
[W3C WAI의 표 지침](https://www.w3.org/WAI/tutorials/tables/)을
참고해 도형과 별도로 제목·열/행 머리글이 있는 정확한 값 표를
제공합니다. 실제 screen reader 발표는 아직 확인하지 않았습니다.

## 2026-10-03 HistogramChart

`HistogramChart`는 pydemia/ui에서 새로 작성한 React·Tailwind 원본입니다.
외부 component 코드·그림을 복사하지 않았고 새 npm 의존성도 없습니다.
registry 의존성은 기존 `pyd-utils`뿐입니다. 따라서 편입한 upstream
revision이나 외부 component LICENSE는 없습니다. 현재 공급물의
소스 표기는 `project-owned`이며 공개 사용 조건은 별도로 정하지
않았습니다.

[NIST의 Histogram 설명](https://www.itl.nist.gov/div898/handbook/eda/section3/eda33e.htm)에서
연속 수치의 동일 너비 구간과 빈도 축을 확인했습니다. 누적 빈도와
상대 빈도는 현재 API에 포함하지 않습니다.
[W3C WAI의 표 지침](https://www.w3.org/WAI/tutorials/tables/)에 따라
막대와 별도로 제목·행/열 머리글이 있는 정확한 값 표를 제공합니다.
실제 screen reader 발표는 아직 확인하지 않았습니다.

## 2026-10-03 PivotTable

`PivotTable`은 pydemia/ui에서 새로 작성한 React·Tailwind 원본입니다.
외부 component 코드·스타일·집계 함수를 복사하지 않았고 새 npm
의존성도 없습니다. registry 의존성은 `pyd-utils`뿐입니다. 편입한
upstream revision이나 외부 component LICENSE는 없습니다. 현행
소스 표기는 `project-owned`이며 공개 사용 조건은 별도로 정하지
않았습니다.

[Microsoft의 PivotTable 설명](https://support.microsoft.com/en-us/excel/calculate-values-in-a-pivottable)은
행·열 교차점에서 합계를 계산하는 사용 사례만 확인하는 데 사용했습니다.
[W3C WAI의 두 머리글 표 지침](https://www.w3.org/WAI/tutorials/tables/two-headers/)에
따라 native 행·열 머리글과 caption을 제공합니다. 두 문서의 코드와
화면 디자인은 편입하지 않았습니다. 실제 screen reader 발표는
아직 확인하지 않았습니다.

## 2026-10-03 TreemapChart

`TreemapChart`는 pydemia/ui에서 새로 작성한 React·Tailwind 원본입니다.
외부 component 코드·그림·layout 함수를 복사하지 않았고 새 npm
의존성도 없습니다. registry 의존성은 `pyd-utils`뿐입니다. 편입한
upstream revision이나 외부 component LICENSE는 없습니다. 현재
공급물의 소스 표기는 `project-owned`이며 공개 사용 조건은 별도로
정하지 않았습니다.

[Vega의 treemap 명세](https://vega.github.io/vega/docs/transforms/treemap/)에서
계층 값에 비례해 영역을 재귀 분할하는 개념을 확인했습니다.
[D3의 treemap 설명](https://d3js.org/d3-hierarchy/treemap)은 정사각형에
가까운 배치와 단순한 교차 분할의 시각적 차이를 설명합니다. 구현은
입력 순서를 보존하는 자체 이진 분할이며 두 library의 알고리즘이나
source를 사용하지 않습니다.
[W3C WAI의 표 지침](https://www.w3.org/WAI/tutorials/tables/)과
[색상 사용 지침](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)을
참고해 시각 영역과 별개로 경로·값·비율을 native 표에 제공합니다.
실제 screen reader 발표는 아직 확인하지 않았습니다.
