# Prototype 설계 계약

## 2026-10-03 BarList

`BarList`는 호출자가 전달한 범주의 순서를 유지합니다. 각 항목은
고유한 ID, 표시 이름, 음수가 아닌 유한한 수치를 갖습니다.
`max`를 주면 모든 값 이상인 양의 유한한 수여야 합니다. 없으면
가장 큰 항목을 막대의 기준으로 쓰며 전부 0일 때도 0건을
표시합니다. 빈 배열은 값 0인 항목과 구분해 빈 상태를 보여 줍니다.

`panel`·`plain`은 같은 데이터의 표시 형태입니다. 막대는 보조
시각 요소이며 `figure`의 제목과 native 목록에 범주·정확한 값을
텍스트로 둡니다. `valueText`는 소비자의 형식 지정에 사용하지만
막대 길이는 원래 `value`로 계산합니다. `DataChart`의 시계열·
다중 계열, `DataList`의 일반 key/value 표시는 그대로 담당합니다.

## 2026-10-03 AppFloatingDisclosure

`AppFloatingDisclosure`는 `AppShell` 안에서 기존 bubble·panel을
그대로 조합합니다. 이름 있는 native button은 `aria-expanded`와
`aria-controls`로 panel과 연결되고, 닫힌 panel은 `hidden`입니다.
열린 뒤에는 bubble에 focus를 두어 다음 Tab으로 panel의 동작에
진입합니다. 닫기 버튼과 panel 안의 Escape는 bubble로 focus를
돌립니다. 외부 pointer·focus 이동은 panel만 닫고 이동한 focus를
가져오지 않습니다. 원형·pill, 좌·우 위치를 고를 수 있습니다.
패널 내용은 호출자가 제공하고, 기존 저수준 부품을 사용한 별도
상태 제어도 유지합니다.

## 2026-10-03 FormWizard

`FormWizard`는 ID가 있는 단계 배열과 controlled `currentIndex`를
받습니다. 각 단계의 `content`는 현재 단계에서만 DOM에 둡니다.
호출자는 단계 입력값을 controlled 상태로 보관해 되돌아온 뒤에도
값을 유지합니다. 단계 content에 별도의 `form`을 중첩하지 않습니다.

다음·완료 버튼은 native form submit이므로 현재 단계의 `required` 등
브라우저 유효성 검사를 먼저 받습니다. 중간 단계의
`validateStep(index)`는 `true`를 반환해야 이동하며 Promise 동안
입력과 이동을 비활성화합니다. `false`와 throw/reject는 현재 단계에
머물면서 구분된 오류 문구를 표시합니다. 외부에서 단계가 바뀌면
이전 비동기 응답을 버립니다. 첫 단계의 이전 버튼은 비활성화합니다.
마지막 단계의 `onFinish`는 완료 요청만 전달하고, 서버 저장·권한·
오류·`submitting` 상태는 호출자가 소유합니다. 단계 변경 후 현재
제목으로 focus를 옮기며 가로·세로 단계와 panel·plain 외관은 같은
동작을 사용합니다. 기본 단계 배치는 좁은 폭에서도 전부 보이는
세로 방향입니다.

## 2026-10-03 DataTable 행 상세

`renderRowDetails(row)`를 제공하면 각 행 앞에 상세 펼침 버튼을
표시합니다. 버튼 이름은 `getRowLabel(row)` 또는 행 ID와 상세
동작을 합친 값입니다. 열린 상태는 행 ID별로 DataTable이 소유하며
버튼의 `aria-expanded`와 내용 ID를 연결합니다. 내용은 원래 데이터
행 바로 다음 `tr`의 전체 열 `td`에 배치합니다. 선택·정렬·검색·
페이지 구조를 바꾸지 않습니다.

로컬 모드에서는 페이지 밖의 행도 현재 `rows`에 남아 있으면 열림
상태를 유지합니다. `rows`에서 없어진 ID는 지웁니다. 원격 모드는
view나 loading·error 상태가 바뀌면 열림 상태를 지우고 현재 페이지
행만 렌더링합니다. 상세 callback이 없는 기존 사용처에는 토글 열이
생기지 않습니다. 상세 영역의 데이터 요청·저장·권한은 호출자가
소유합니다.

## 2026-10-02 BlockEditor 구조 변경 이력

`BlockEditor`의 추가·삭제·이동·형식 변경은 최근 50건까지 구조
이력으로 기록합니다. `구조 되돌리기`·`구조 다시 실행`은 현재 블록의
ID·순서·형식이 해당 작업의 예상 상태일 때만 활성화됩니다. 호출자가
외부에서 구조를 바꾸면 오래된 작업은 적용하지 않습니다. 일반 텍스트
수정은 구조 이력을 만들지 않고 native textarea의 undo를 사용합니다.

구조 작업을 되돌리거나 다시 실행할 때 남아 있는 블록의 최신 텍스트는
보존합니다. 추가한 블록을 되돌렸다가 다시 실행하면 되돌리기 직전의
텍스트를 복원합니다. 삭제를 되돌리면 삭제 당시의 블록을 복원합니다.
다른 문서를 불러오거나 form을 초기화할 때는 `BlockEditor`의 React
`key`를 바꿔 내부 구조 이력을 초기화합니다. 이 이력은 호출자 저장소나
브라우저 세션에 영속화하지 않습니다. 인라인 서식 편집은 여전히
`RichTextEditor` 후보의 별도 범위입니다.

## 2026-10-02 ArtifactViewer

`ArtifactViewer`는 오래된 것부터 나열한 `revisions`와 현재
`revisionId`를 받습니다. 목록이 비었을 때만 ID가 `null`이고,
목록이 있으면 고유한 ID 중 하나를 가리켜야 합니다. 선택 변경은
`onRevisionChange`로 요청하며 원본 내용·revision 저장은 호출자가
소유합니다. Markdown·code·일반 텍스트를 읽고 원문을 복사합니다.
Markdown만 미리보기와 원문을 전환합니다. 선택한 revision이 첫 번째가
아니면 바로 앞 revision과 line diff를 표시합니다. 선택 변경 시
보기 방식은 내용으로 돌아갑니다.

이 component는 결과물을 편집하거나 실행하지 않습니다. Markdown은
기존 안전한 부분집합만 렌더링하고 원문·code·일반 텍스트는 React
텍스트로 표시합니다. `panel`·`plain`은 같은 token을 사용합니다.
이름 있는 native revision `select`, `aria-pressed` 보기 버튼,
결과 region과 `DiffViewer`의 비교 표를 제공합니다. 닫기 요청이
있으면 호출자가 panel 제거와 focus 복귀를 처리합니다. 별도의
streaming 발표·저장·다운로드는 호출자 책임입니다.

## 2026-10-02 BlockEditor

`BlockEditor`는 문서의 제목·소제목·문단·글머리/번호 목록·인용·코드를
`{ id, kind, text }[]`로 편집합니다. `blocks`와 저장은 호출자가
소유하고, component는 `onBlocksChange`로 변경을 요청합니다. 각 ID는
문서 안에서 고유해야 합니다. 추가 시 기본 ID는 현재 배열에 없는
`block-N`을 고르며, 외부 저장소의 ID 정책이 있으면
`createBlockId`로 지정합니다. 형식 변경과 이동은 기존 ID를 유지합니다.
`name`이 있으면 현재 배열을 JSON 문자열로 form에 제출합니다.
controlled 값의 form reset은 호출자가 처리합니다.

각 블록은 이름 있는 native `textarea`와 형식 `select`, 이동·추가·삭제
버튼을 사용합니다. 추가 뒤 새 입력으로, 삭제 뒤 인접 입력으로 focus를
옮깁니다. `disabled`는 입력과 form 값을 함께 비활성화합니다.
일반 텍스트의 선택·붙여넣기·undo는 브라우저 입력이 담당합니다.
구조 변경은 위의 별도 이력으로 되돌립니다. HTML 붙여넣기 해석과
인라인 서식은 제공하지 않습니다. 이는 WYSIWYG `RichTextEditor`의
완료를 뜻하지 않습니다.

`BlockDocument`는 같은 배열을 읽기 전용으로 표시합니다. 인접한
동종 목록 블록을 하나의 native 목록으로 묶고 제목·문단·인용·코드에
해당하는 HTML을 렌더링합니다. `text`를 HTML로 해석하지 않으며
React의 텍스트 이스케이프를 사용합니다. `panel`과 `plain` 편집
표시는 같은 공통 token을 사용합니다.

## 2026-10-02 ResultState

`ResultState`는 한 비동기 작업의 `pending`·`success`·`error`를 같은
위치에 표시합니다. 상태와 요청 실행은 호출자가 소유합니다. 실패에서
`onRetry`가 있으면 이름 있는 native 버튼을 표시하고, 클릭은 재시도
요청만 전달합니다. 호출자는 재시도 시작 시 `pending`으로 바꾸고
완료 결과를 다시 전달합니다. `actions`는 상태별 후속 동작을 놓는
영역입니다.

`title`은 필수이며 상태 이름을 별도 텍스트로 표시합니다. 진행·성공은
`role="status"`, 실패는 `role="alert"`를 사용합니다. `panel`(기본값)과
`plain`은 기존 `Empty`의 표면을 사용합니다. `Empty`는 항목 부재,
`Alert`는 맥락 안의 안내를 담당하므로 작업 결과 전환이나 재시도
규칙을 소유하지 않습니다. 키보드로 재시도를 실행하면 버튼이 사라져도
focus가 결과 영역에 남도록 합니다.

## 2026-10-02 LogViewer

`LogViewer`는 호출자가 제공한 `LogEntry[]`를 검색·수준 선택으로
좁혀 보여줍니다. 검색어와 선택 수준은 component 내부 상태이며 로그의
추가·삭제·저장·원격 요청은 호출자가 맡습니다. 검색어 양끝 공백을
제거하고 timestamp·level·message에서 대소문자 구분 없이 찾습니다.
수준은 전체 또는 debug·info·warn·error 중 하나를 선택합니다.
각 entry는 고유한 ID, 문자열 message와 유효한 level을 가집니다.
원본이 비었을 때와 필터 결과가 없을 때는 다른 문구를 표시합니다.

표시 이름·검색·수준 select·결과 건수와 `role="log"` 영역을 함께
제공합니다. 필터 control은 native 입력을 사용하고 로그의 자동 음성
발표는 끕니다. 결과 건수는 `role="status"`입니다. `panel`(기본값)은
테두리 있는 표면, `flat`은 주변 화면에 붙는 투명 표면입니다.
기존 `LogConsole`도 같은 표시 형태를 받되 기본 모양을 유지합니다.

## 2026-10-02 AppShell 표시 형태

`AppShell.appearance`의 기본값 `framed`는 기존 border·radius를
유지합니다. `canvas`는 외부 border·radius 없이 전체 작업 화면을
채웁니다. header·좌우 sidebar·main·bottom·floating 영역의 DOM과
반응형 배치는 두 형태에서 같습니다.

`AppFloatingBubble.appearance`의 기본값 `circle`은 기존 40px 원형
버튼입니다. `pill`은 같은 높이에 텍스트가 들어갈 수 있는 너비와
수평 여백을 제공합니다. 두 형태 모두 이름 있는 native button이며
`side`에 따른 배치, `aria-expanded`·`aria-controls` 연결과 열림 상태는
호출자가 관리합니다. `AppFloatingPanel.side`는 bubble과 같은 값을
전달합니다. 닫기·Escape 후 focus 복귀도 호출자가 구현합니다.
Floating UI는 내용을 덮는 영역이므로 bottom panel에 상태 문구를
함께 놓으면 해당 쪽 여백을 확보합니다. 문서 preview는 bubble의
좌우 위치에 맞춰 bottom panel의 여백을 바꿉니다.

## 2026-10-02 Empty·Skeleton 표시 형태

`Empty.appearance`는 `dashed`(기본값), `panel`, `plain` 중 하나입니다.
기본값은 기존 점선 border와 `surface-subtle` 배경을 유지합니다.
`panel`은 실선 border와 `surface`, `plain`은 border 없는 투명 배경을
사용합니다. 세 형태 모두 같은 제목·설명·선택적 동작 구조를 씁니다.
상태 판정과 동작 실행은 소비자가 소유합니다.

`Skeleton.shape`는 `rectangle`(기본값), `line`, `circle` 중 하나입니다.
기본값은 기존 class를 유지하고, `line`은 텍스트 줄, `circle`은 아바타
자리를 표시합니다. 크기는 `className`으로 덮어쓸 수 있습니다.
Skeleton은 장식 요소이고 loading 상태 설명은 상위 영역이 제공합니다.
움직임 줄이기 설정에서는 pulse animation을 멈춥니다.

## 2026-10-02 Lightbox

호출자가 고유한 `id`와 `src`·`alt`, 선택적 `caption`·`aspectRatio`를
가진 이미지 목록을 전달합니다. `open`·`activeId`는 호출자가 소유하고
`onOpenChange`·`onActiveIdChange`로 변경 요청을 받습니다. 열린 상태의
선택 ID는 목록에 있어야 합니다. 빈 목록은 닫힌 상태에서만 허용합니다.
컴포넌트는 업로드·이미지 저장·원격 요청을 수행하지 않습니다.

`frame`은 폭을 제한한 modal, `immersive`는 viewport 전체 modal입니다.
제목·순서·이미지 대체 텍스트·선택적 caption을 표시합니다. 이전·다음
버튼은 목록 끝에서 비활성화되고 ArrowLeft·ArrowRight로 같은 이동을
요청합니다. 썸네일은 기본으로 표시하며 `showThumbnails`로 숨길 수
있습니다. Escape와 닫기 버튼은 modal을 닫고 열었던 요소로 focus를
돌려줍니다. 로드·오류 표시는 기존 `Image`를 사용합니다.

## 2026-10-02 ModelSelector

호출자가 `models`의 ID·이름·제공자·설명과 선택 가능 여부,
`costLabel` 문구를 제공합니다. 실제 권한 판정·요금 계산·모델 호출은
호출자가 소유합니다. ID는 고유한 비공백 문자열이고 선택값은 목록에
있어야 합니다. 목록을 새로 불러오는 중이거나 오류가 난 동안에는
기존 선택 ID가 임시로 빠져도 허용하지만 form 값은 빈 문자열로
보냅니다. 권한이 없어 `disabledReason`이 붙은 선택값도 제출하지
않고 이유를 표시합니다. 목록이 복구되면 해당 ID의 표시가 돌아옵니다.

`value`를 주면 호출자가 선택값을 관리하고, 생략하면
`defaultValue`로 시작합니다. 값이 달라질 때만
`onValueChange(id | null)`를 호출합니다. 비제어 선택은 form reset에
따라 초기값으로 돌아갑니다. `name`의 hidden input은 선택 가능한
ID만 담습니다. 필수 선택은 내부 `Combobox`의 검증을 사용합니다.

검색·방향키·Enter·Escape와 비활성 option 건너뛰기는 기존
`Combobox`를 사용합니다. `panel`은 설명·기능·사용량 문구를,
`compact`는 제공자·사용량 문구를 보여줍니다. 공통 surface·border·
foreground token을 사용합니다. 실제 요금이나 제공자별 기능을
하드코딩하지 않습니다.

## 2026-10-02 DataTable 표시 선택

`density`의 기본값 `standard`는 기존 `--density-row-block` token을
그대로 사용합니다. `compact`는 `--space-1`, `comfortable`은
`--space-4`를 행의 세로 여백에 적용합니다. 이 값은 해당 표 안에서만
덮어쓰며 상위 화면의 밀도 token이나 다른 Table에는 영향을 주지
않습니다. `striped`는 기본 `false`이고 짝수 데이터 행의 배경에
`surface-subtle` token을 씁니다. 색상으로 상태를 전달하지 않으며
caption·heading·sort·selection·pagination 규칙은 바꾸지 않습니다.
두 속성은 전체 행 모드와 `remote` 모드에 동일하게 적용합니다.

## 2026-10-02 MasterDetail

`items`의 각 `id`와 `title`은 비어 있지 않고 ID는 고유해야 합니다.
`description`·`meta`는 선택 사항이며 `disabled` 항목은 선택할 수
없습니다. 목록은 전달받은 순서를 유지하고 자동 정렬·자동 선택을
하지 않습니다. 호출자는 `renderDetail(item)`으로 상세를 채우고
빈 목록·선택 전 표시는 바꿀 수 있습니다. 서버 요청·로딩·저장은
호출자가 관리합니다.

`selectedId`가 공급되면 호출자가 선택값을 소유하고, 없으면
`defaultSelectedId`에서 시작해 내부에서 관리합니다. 명시적인
`null`은 선택 없음이며, 현재 목록에 없는 ID도 다른 항목으로
대체하지 않습니다. 선택 버튼을 누르면 값이 달라졌을 때만
`onSelectedIdChange(id)`를 호출합니다. controlled 값이 아직
변경되지 않았다면 좁은 화면에서도 이전 상세를 새 선택으로
보여주지 않습니다.

42rem 이상인 component container에는 목록과 상세를 함께 표시합니다.
그보다 좁으면 목록에서 시작하고 항목 선택 시 상세만 표시합니다.
상세 영역으로 focus를 옮기며, 돌아가기는 선택 버튼으로 focus를
복원합니다. 선택 버튼은 native keyboard 동작과 `aria-current`를
사용합니다. 공통 surface·border·focus token을 사용하며 실제 touch·
screen reader·Safari·RTL 검사는 남았습니다.

## 2026-10-02 ImageCropper

`file`은 호출자가 선택한 로컬 `File | null`이며 PNG·JPEG·WebP만
디코딩합니다. MIME이 비어 있으면 파일 확장자로 형식을 판정한 뒤
브라우저 디코딩 성공을 확인합니다. null은 선택 전이고 지원하지 않는
형식과 읽기 실패는 서로 다른 표시 상태입니다. 원격 URL 입력은
제공하지 않아 Canvas의
cross-origin export 실패 경로를 만들지 않습니다. object URL은
파일 교체·unmount 때 해제합니다. 파일 선택과 업로드는 호출자가
관리하고, `onCrop`에는 완성된 PNG `Blob`만 전달합니다.

`aspectRatio`는 양의 유한수이며 기본 1입니다. 브라우저가 디코딩한
원본의 중앙에서 요청 비율로 들어가는 최대 사각형을 잡고 확대
1–3배에 따라 원본 사각형의 크기를 줄입니다. 가로·세로 위치는
남은 원본 길이의 0–100%로 정의하며 가장자리 밖으로 나가지
않습니다. 포인터로 이미지를 오른쪽·아래로 끌면 crop 영역은
원본에서 왼쪽·위쪽으로 이동합니다. native range의 키보드·
단일 pointer 조작도 같은 상태를 바꿉니다. 초기화는 확대 1배,
위치 50%로 돌아갑니다.

`outputWidth`는 기본 512px이고 1–4096 정수여야 합니다.
`round(outputWidth / aspectRatio)`로 계산한 높이도 1–4096px이어야
합니다. preview와 export는 같은 source rectangle을 `drawImage`에
전달합니다. `toBlob("image/png")` 실패와 canvas 오류는 보이는
`role="alert"`로 알리고 성공했을 때만 callback을 호출합니다.
파일 변경 중 완료된 이전 비동기 export는 전달하지 않습니다.

필수 `label`은 영역 제목, 필수 `alt`는 이름 있는 canvas preview에
사용합니다. 세 native range는 보이는 label과 현재 백분율을 가지며
파일 준비 전 또는 `disabled` 상태에는 조작되지 않습니다.
결과 이미지는 호출자가 보관·미리보기·제출합니다. 실제 touch·
screen reader·Safari·RTL 검사는 남았습니다.

## 2026-10-02 Card·Alert 표시 규칙

`Card.variant`는 `default`·`subtle`·`elevated` 표면을,
`Card.size`는 기본 16px·`compact` 12px 간격을 선택합니다.
기본값은 기존 border·surface·간격을 유지합니다. 간격은 Card
root의 `--card-spacing`에서 Header·Content·Footer로 전달하며,
그림자와 색은 공통 token을 사용합니다. `MetricCard.variant`는
기존의 `default`·`compact`·`featured` 의미를 유지합니다.

`Alert.variant`는 상태의 색과 발표 우선순위를 결정하고
`appearance`는 `outline`·`soft`·`plain` 표면만 바꿉니다.
기본 `outline`은 이전 표시와 같습니다. `soft`는 상태 색의
낮은 불투명도 배경을, `plain`은 투명 배경과 보이지 않는 border의
문장형 표시를 사용합니다. `destructive`만 `role="alert"`이며
나머지는 `role="status"`입니다.

## 2026-10-02 DataTable 원격 조회

기본 모드는 전달된 전체 `rows`를 내부에서 검색·필터·정렬·페이지로
나눕니다. `remote`를 전달하면 `rows`는 현재 페이지의 서버 응답이며
`remote.view`의 query·filterValue·sort·page·pageSize와
`remote.totalItems`는 호출자가 소유합니다. 입력 변경은
`onViewChange`로 완전한 다음 view를 전달합니다. 검색·필터·정렬·
페이지 크기 변경은 1페이지로 돌아갑니다. 호출자는 view에 맞는
요청을 보내고 최신 결과만 `rows`에 전달해야 합니다.

`loading`과 `error`에서는 이전 행을 숨기고 상태를 표 안에 표시합니다.
오류의 재시도 버튼은 `onRetry`가 있을 때만 표시합니다. 원격 선택은
현재 페이지 행에 한정하며 view나 로딩·오류 상태가 바뀌면 해제합니다.
서버 페이지를 넘나드는 선택 ID와 일괄 작업은 호출자가 별도로
관리해야 합니다. 원격 view의 page·pageSize는 양의 정수이고 총건수는
0 이상의 정수여야 합니다. 실제 HTTP 요청·취소·경합 처리는 이
component가 수행하지 않습니다.

## 2026-10-02 선택 작업과 복사 동작

`ActionBar`는 선택 상태를 소유하지 않습니다. 호출자가 선택 건수,
일괄 작업과 해제 callback을 전달합니다. `DataTable`은 기존의
`renderActions(selectedRows, clearSelection)` API를 유지하면서 같은
영역을 사용합니다. 배치는 inline·floating 중 선택하며 DOM 순서는
바꾸지 않습니다. `role="group"`과 필수 이름을 사용하고 숫자 변경은
`role="status"`로 알립니다. 선택이 0건일 때는 해제 버튼이
비활성화됩니다. 선택 해제 후 bar를 제거하는 화면은 호출자가 남아
있는 선택 control로 focus를 돌립니다.

`CopyButton`은 문자열 `value`와 동작의 accessible name을 필수로
받습니다. icon·text 모양 모두 native button이고 값이 달라지면 이전
성공·실패 문구를 표시하지 않습니다. 클립보드 Promise가 resolve하면
성공, reject하거나 API가 없으면 실패 상태를 표시합니다. 복사할 수
없는 값의 비활성화 여부는 호출자가 결정합니다. `CodeBlock`의 빈 코드
비활성화와 기존 성공·실패 문구, `SnippetCopyButton`의 icon 형태와
accessible name을 유지합니다. 복사 권한·secure context는 브라우저가
결정하며 component는 숨겨진 fallback을 실행하지 않습니다.

## 2026-10-01 TreeSelect 계층 form 선택 규칙

`TreeSelect`는 정적 계층의 단일 선택값을 가집니다. `id`는 전체
계층에서 고유하고 비어 있지 않아야 합니다. 비활성 노드와 그
후손은 선택·form option 대상에서 제외합니다. 외부 `value`가 있으면
소비자가 상태를 소유하고, 없으면 `defaultValue`로 시작해 내부에서
관리합니다. 선택한 항목은 조상 경로와 함께 표시해 같은 이름의
항목을 구분합니다.

표시되는 label은 button과 연결합니다. `name`을 주면 보조기술
트리에서 숨긴 native select가 선택한 `id`를 form 값으로 제출합니다.
`required`는 native select의 유효성 검사를 사용하고 오류를
표시하며 trigger에 초점을 둡니다. Uncontrolled 값은 form
reset 때 `defaultValue`로 돌아갑니다. Controlled 값의 reset은
소비자가 직접 처리합니다. Native reset은 이벤트 뒤 option의
`defaultSelected`를 읽으므로 component가 기본 option을 현재
기본값에 맞춰 둡니다. `Tree`의 단일 선택·방향키 이동과
`Popover`의 열기·닫기·Escape 동작을 유지합니다. 원격 로딩,
다중 선택, 계층 검색은 이 API에 포함하지 않습니다.

## 2026-10-01 DiffViewer 줄 비교 규칙

`DiffViewer`는 소비자가 소유한 `before`·`after` 문자열을 표시합니다.
CRLF와 CR은 LF로 통일해 줄을 비교하고, 끝 줄바꿈 유무는 별도 문장으로
표시합니다. 완전히 같은 앞뒤 문맥을 먼저 찾고 나머지에는 최장 공통
부분열을 사용합니다. 같은 점수일 때는 이전 줄 삭제를 먼저 선택해
결과를 일정하게 유지합니다. 표에서 삭제는 이전 줄 번호, 추가는 이후
줄 번호, 문맥은 두 번호를 가집니다.

중간 비교의 줄 수 곱이 100만을 넘으면 전체 최장 공통 부분열 계산을
생략하고 중간 줄을 모두 삭제·추가로 표시합니다. 이 표시는 실제
변경을 누락하지 않지만 최소 변경 집합은 아닙니다. 화면에 축약
비교임을 밝힙니다. `view="unified"`는 한 내용 열, `view="split"`은
이전·이후 두 내용 열을 사용합니다. 소비자가 외부에서 view와 줄바꿈
선택을 제어하며 component는 저장·patch 적용을 하지 않습니다.

원본 줄은 React text로 렌더링해 HTML로 실행하지 않습니다. native
table 열 제목과 변경 종류 텍스트, `tabIndex=0`인 이름 있는 스크롤
영역으로 읽기·키보드 탐색을 제공합니다. 대량의 행을 가상화하지
않으므로 매우 큰 파일의 렌더링 성능은 별도로 측정해야 합니다.

## 2026-09-30 Editable 값·포커스 규칙

`Editable`의 `value`는 소비자가 소유하는 controlled 문자열입니다.
`onSave`는 변경된 초안을 받으며, 비동기 저장이면 성공 시 `value`를
갱신한 뒤 resolve해야 합니다. component는 편집 중 초안·대기·오류를
관리합니다. Escape/취소는 저장 전 초안을 버리고 편집 버튼으로
포커스를 돌립니다. Enter/저장은 필수값과 `validate`를 확인합니다.
저장 실패는 초안을 보존하고 오류를 알립니다. 저장 중에는 중복 요청과
취소를 막으며 input은 read-only로 유지해 포커스를 보존합니다.
비활성 상태에서는 새 편집과 저장을 막습니다. 빈 값은 `required`가
아니면 허용하고 preview에 placeholder를 표시합니다. 다른 locale의
문구는 `label`, `placeholder`, `saveErrorMessage`, `validate`로 바꿀 수
있지만 기본 버튼 문구는 한국어입니다. RTL은 native 흐름을 따르며
별도 브라우저 검증 전까지 보장하지 않습니다.

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
  `--focus`, `--danger`, `--success`, `--warning`을 light/dark에 각각
  할당합니다.
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

## 2026-09-29 PageHeader 크기

`PageHeader`의 `size`는 compact·default·hero 중 제목과 부제목의 시각적
크기 및 간격만 선택합니다. 기본값은 기존 스타일입니다. 문서 계층은
별도 `level`(h1/h2)이 결정하며 크기로 heading 수준을 추론하지 않습니다.

## 2026-09-29 기간 선택

`DateRangePicker`는 `null`, `{ from, to: null }`, `{ from, to }`를
각각 미선택·부분 선택·완료 상태로 받습니다. 두 날짜는 `YYYY-MM-DD`
문자열이며 `startName`과 `endName`을 지정하면 별도 hidden input으로
제출합니다. 빈 값은 빈 문자열입니다. 완료된 기간의 필수값 검사는
소비자 form이 맡습니다. `minDate`·`maxDate`와 `minNights`·`maxNights`는
달력 선택과 전달된 값을 제한합니다. 완료 또는 초기화 시 popover를
닫고, 완료된 범위를 다시 선택하면 새 범위를 시작합니다.

## 2026-09-29 분석 필터

`FilterBar`는 이름 있는 form 안에 소비자가 제공한 필터 control을
배치합니다. `onApply`는 제출 시 `FormData`를 받고 기본 form 제출은
막습니다. `onClear`는 소비자의 draft/applied 상태를 지우며 native
form도 초기화합니다. `dirty=false`면 중복 적용을 막고, `pending` 중에는
두 동작을 비활성화합니다. 적용된 조건은 ID가 고유한 label·value
목록으로 표시합니다. bar·panel 표현은 같은 동작을 공유합니다.
실제 데이터 필터링은 소비자가 소유합니다.

## 2026-09-29 다중 계열 차트

`DataChart`의 기존 `points` 입력은 단일 계열로 유지합니다. 다중 계열은
공통 `categories`와 각 계열의 고유 `id`, 표시 `label`, 범주와 길이가
같은 `values`를 받습니다. 두 입력 방식은 함께 사용할 수 없습니다.
`null`은 0이 아닌 결측값으로, 선형·영역 경로를 끊고 막대는 생략합니다.
막대는 범주별로 그룹화하며 영역은 누적하지 않습니다. 모든 계열은
같은 Y축을 공유하고, 범례는 이름과 색을 표시합니다. 시각적인 선의
패턴도 계열별로 다르게 합니다. 숨겨진 데이터 표에는 범주별 모든
계열 값과 결측 상태가 포함됩니다. 계열 표시 toggle·tooltip·누적
영역은 현재 API에 포함하지 않습니다.

## 2026-09-29 콘텐츠 Carousel

`Carousel`은 고유 ID·이름·내용을 가진 슬라이드를 한 번에 하나씩
표시합니다. 처음에는 첫 항목을 선택하고 `activeId` 또는
`defaultActiveId`로 시작 위치를 지정할 수 있습니다. controlled
상태에는 변경 callback이 필요합니다. 선택 항목이 삭제된 uncontrolled
상태는 첫 남은 항목으로 돌아가며, 존재하지 않는 controlled ID는
오류로 알립니다. 빈 목록에는 메시지만 표시합니다.

이전·다음 버튼은 끝에서 비활성화하고 `loop`를 지정하면 순환합니다.
선택 버튼과 card/plain 변형은 선택 사항입니다. 터치의 수평 이동은
48px 이상이고 수직 이동보다 클 때만 처리하며, 슬라이드 안의 링크와
입력·버튼에서 시작한 동작은 가로채지 않습니다. 자동 재생과 시간 기반
전환은 제공하지 않습니다. 현재 슬라이드만 DOM에 있어 숨긴 내용의
focus 대상이 남지 않습니다.

## 2026-09-29 일반 이미지

`Image`는 `<img>`를 감싸 비율, cover/contain 맞춤, 선택적인 frame,
로딩·누락·오류 화면을 제공합니다. `src`는 비어 있지 않은 URL 또는
`null`입니다. `null`은 이미지가 아직 없음을 뜻하고 잘못된 URL의 로딩
실패와 구분합니다. `aspectRatio`는 square/video/portrait 또는 양의
유한한 숫자입니다. `srcSet`·`sizes`·`loading` 등 native 이미지 속성과
`onLoad`·`onError`는 이미지 요소로 전달합니다.

정보 이미지는 `alt`에 설명을, 장식 이미지는 빈 문자열을 전달합니다.
실패한 이미지는 접근성 트리에서 숨기고 오류 문구를 상태로 표시합니다.
로딩 화면은 장식 요소입니다. 이미지를 가져오는 일과 오류 복구는
브라우저와 소비자가 맡습니다.

## 2026-09-29 JSON 탐색

`JsonViewer`는 이름 있는 영역 안에서 JSON 값의 중첩 구조를
`details`·`summary`로 탐색합니다. `defaultExpandedDepth`는 최초
펼침 깊이, `pageSize`는 각 객체·배열에서 한 번에 추가할 항목 수입니다.
접힌 하위 항목은 DOM에 렌더링하지 않습니다. 원본 JSON 복사 성공·실패는
상태 문구로 표시합니다. frame/plain 표현은 공통 색상 token을 씁니다.

문자열, 유한한 숫자, boolean, null, 일반 객체, 빈틈 없는 배열만
받습니다. 순환 참조, `undefined`, `NaN`, class instance와 getter는
오류로 알립니다. 같은 객체를 여러 위치에서 참조하는 것은 허용합니다.
입력값은 React의 일반적인 불변 데이터 규칙에 따라 새 참조로 갱신합니다.

## 2026-09-29 색상 입력

`ColorInput`은 6자리 `#RRGGBB` 텍스트 필드와 native 색상 선택기를
한 값에 연결합니다. `value`·`onValueChange`로 제어하거나
`defaultValue`로 자체 상태를 사용합니다. 올바른 값은 소문자로
전달하고, 불완전하거나 잘못된 입력은 필드에만 남겨 오류를 알립니다.
blur 시 입력 전의 유효한 값으로 되돌립니다. form에는 텍스트 필드의
`name`으로 제출하며, 색상 선택기는 별도 값을 제출하지 않습니다.

표시 가능한 `label`이 필수이고 오류는 해당 텍스트 필드와 연결됩니다.
card/inline 표현은 공통 색상 token을 사용합니다. 문서 Colormap
편집기는 이 컴포넌트를 사용하며 밝은·어두운 모드의 값은 문서 앱에서
각각 관리합니다.

## 2026-09-29 검색 입력

`SearchInput`은 이름 있는 search landmark와 native `type=search`
필드, 제출·초기화 버튼을 묶습니다. `value`·`onValueChange`로 제어하거나
`defaultValue`를 사용합니다. `onSearch`가 있으면 form 제출을 막고
입력 문자열을 그대로 callback에 전달합니다. callback이 없으면
`action`·`method`·`name`에 따른 native form 제출을 유지합니다.

초기화 버튼과 Escape는 입력값을 비우고 `onSearch("")`를 호출한 뒤
입력 필드에 focus를 둡니다. field 표현은 label을 표시하고 toolbar
표현은 같은 label을 시각적으로만 숨깁니다. 제출·초기화 버튼의 문구는
각각 지정할 수 있습니다. 이 컴포넌트 자체가 form이므로
다른 form 안에 중첩하지 않습니다. 서버 검색 결과, 필터링과 URL 상태는
소비자가 관리합니다.

## 2026-09-29 계층형 리소스 탐색

`Tree`는 파일·리소스 계층의 노드 배열을 받습니다. 선택 ID와
확장 ID 목록은 controlled 또는 default 값으로 관리하고 callback으로
변경을 전달합니다. keyboard focus와 선택값은 별개입니다. 방향키는
보이는 항목 사이를 이동하며 disabled 노드와 그 하위는 조작에서
제외합니다. `ArrowRight`·`ArrowLeft`는 계층을 열고 닫거나 부모·
자식으로 이동하고 Enter·Space가 선택합니다. 일반 사이트 메뉴에는
기존 `Navigation`·`Sidebar`를 사용합니다. 원격 하위 항목은 children
대신 `childState`를 `unloaded`·`loading`·`error` 중 하나로 지정합니다.
`error`에는 이름 있는 `errorMessage`가 필요합니다. 소비자는
`onLoadChildren(id)`에서 로딩을 시작하고 새 items로 성공·실패 상태를
갱신합니다. 열린 `unloaded` 노드는 한 번 요청하며, 열린 오류 노드의
`ArrowRight` 또는 재시도 표시를 선택하면 다시 요청합니다. 닫힌 노드를
열면 focus는 부모에 남고, 로드 후 `ArrowRight`로 첫 자식에 이동합니다.
선택값은 요청 상태와 독립적입니다. drag 이동·다중 선택은 API에
포함하지 않습니다.

## 2026-09-29 대화 목록

`Conversation`은 안정적인 ID·발신자·내용을 가진 메시지 배열을 받아
기존 `Message`로 표시합니다. ID가 비었거나 중복되면 렌더링 오류로
알립니다. 이름이 있는 `log` 영역은 처음에 최신 메시지를 보여주고,
끝을 읽고 있을 때 추가된 메시지와 내용 높이 변화를 따라갑니다.
이전 내용을 읽는 동안에는 스크롤을 유지하고 새 메시지 수를 표시하며,
이동 버튼은 끝으로 스크롤한 뒤 `log`에 focus를 돌립니다. 배열이
교체되면 새 대화로 보고 최신 위치로 이동합니다. 과거 메시지
prepend와 가상 스크롤은 현재 API에 포함하지 않습니다.

## 2026-09-29 AI 작업 상태

`Reasoning`은 필수 label과 선택적인 생성 상태를 가진 disclosure입니다.
기존 `Collapsible`의 controlled·default open 동작을 그대로 전달하고,
inline 또는 card로 표시합니다. 내용을 닫아도 streaming·complete·
failed 상태는 보입니다. 펼친 내용만 streaming 중 `aria-busy`를
설정합니다.

`ToolCall`은 도구 이름과 pending·running·succeeded·failed 상태를
표시합니다. 입력은 native `details`에서 펼치며, 결과는 성공 상태에서,
오류는 실패 상태에서만 표시합니다. 결과와 오류가 상태에 맞지 않으면
렌더링 오류로 알립니다. card 또는 compact로 배치합니다. 두 component는
`MessageContent` 안에 넣을 수 있지만 대화 저장과 도구 실행은
소비자가 맡습니다.

## 2026-09-29 Colormap preview

- `packages/ui/src/styles.css`의 semantic color token은 대응하는
  `--palette-*` 변수의 alias입니다. `data-colormap`과 `.dark`가 palette
  값을 정하며 attribute가 없는 소비자는 기존 Neutral 색상을 사용합니다.
  Pydemia preset은 승인된 로고의 네이비 `#103344`와 로즈 `#ba365b`를
  기준으로 합니다.
- 문서 사이트에는 별도 Colormap 영역을 둡니다. preset 선택은 직접
  조정값을 지우고, hex 입력은 현재 light/dark 모드의 palette 변수만
  덮어씁니다. 문서의 직접 조정값은 서버에 저장하지 않습니다.
- 문서의 조합 예시는 별도 iframe입니다. 같은 origin의 문서가 선택을
  `postMessage`로 전달하고, 예시는 허용된 palette 이름과 6자리 hex만
  적용합니다. 전체 화면 링크는 현재 선택을 URL query로 전달합니다.
- 본문, Accent, User message의 텍스트 대비를 화면에 표시합니다.
  사용자가 입력한 임의 색상의 대비를 자동 보정하지는 않습니다.

## 2026-09-29 source 표시와 구현 소유

- `registry/provenance.json`의 `source`는 현재 배포 코드의 구현
  출처입니다. `reference`는 디자인·동작 참고 자료를 가리킵니다.
  두 필드의 license를 합쳐 표시하지 않습니다.
- shadcn/ui source를 변형한 항목은 고정 revision, MIT notice를
  유지합니다. 기타 reference는 자체 구현으로 관리합니다.
- 문서의 SOURCE는 구현 코드로, DESIGN REFERENCE는 참고 자료로
  연결합니다. `project-owned` 항목은 공개 LICENSE가 아직 없어
  「공개 사용 조건 미지정」으로 표시합니다.

## 2026-09-29 ContextMenu

`ContextMenu`는 focus 가능한 trigger에서 우클릭과 `Shift+F10`으로
열리는 메뉴입니다. 일반 `DropdownMenu`처럼 클릭 버튼을 메뉴 호출의
기본 동작으로 삼지 않습니다. Root·Trigger·Content 외에 item,
checkbox, radio, group, separator, submenu를 제공하며 item의 `danger`
표현을 지원합니다. checked 값과 action 결과는 소비자가 소유합니다.
문서 preview에서는 native button을 trigger로 써 keyboard 호출 경로를
보장합니다. 메뉴 배경·경계·글자·그림자는 공통 semantic token을 씁니다.

## 2026-09-29 NumberInput

`NumberInput`은 `label`이 필수이며 `value`/`onValueChange` 또는
`defaultValue`로 `number | null`을 관리합니다. `null`은 빈 값입니다.
`min`·`max`는 허용 범위를, 양수 `step`은 증감 폭을 정합니다. 사용자가
입력한 유효한 수를 step 배수로 강제하지 않습니다. `locale`은 표시와
입력 구분자를 정하며 Latin 숫자를 사용합니다. `field`와 `stepper`
변형은 같은 값·검증 동작을 공유합니다.

입력 중인 문자열은 확정 값과 분리합니다. 잘못된 숫자, 범위 밖 값,
필수값 누락은 안내 문구와 `aria-invalid`로 표시하고 native form 제출을
막습니다. 유효한 값은 blur·Enter·증감 조작으로 확정합니다. 이름을
설정하면 form에는 locale과 무관한 표준 숫자 문자열을 제출합니다.
입력 필드는 이름이 연결된 `spinbutton`이고 현재 값·범위·표시 문자열을
ARIA 속성으로 노출합니다. 방향키는 step만큼 이동하고 Home/End는
각각 설정된 min/max로 이동합니다. 토큰으로 색상·경계·focus를
표시하며 server 저장이나 소수 정밀도 보존 API는 제공하지 않습니다.

## 2026-09-29 TagsInput

`TagsInput`은 보이는 `label`이 필수이고 문자열 배열을 controlled
`value`/`onValueChange` 또는 `defaultValue`로 관리합니다. 태그는 앞뒤
공백을 제거해 저장하며 대소문자를 무시해 중복을 거부합니다. `maxTags`는
추가 가능한 수를 제한합니다. Enter·쉼표로 현재 입력을 추가하고,
쉼표나 줄바꿈이 있는 붙여넣기는 여러 태그를 한 번에 추가합니다.
입력창이 비었을 때 Backspace는 마지막 태그를 삭제합니다. 각 태그의
삭제 버튼도 동일한 값을 변경하고 입력창으로 focus를 돌립니다.

`name`이 있으면 태그별 hidden input으로 같은 이름의 form 값을
반복 제출합니다. 미확정 입력 문자열은 제출값에 넣지 않고 native
validity 오류로 제출을 막습니다. `required`일 때 태그가 없으면
입력창의 validity와 오류 문구로 알립니다. 중복이나 개수 초과는
현재 draft를 유지해 사용자가 수정할 수 있습니다. `outline`과 `soft`
변형은 같은 상태·제출 동작을 사용하며 semantic token으로 표시합니다.

## 2026-09-29 Spinner 형태

`Spinner`는 `icon`, `ring`, `dots`, `bars`, `orbit`을 지원하며 기본값은
`icon`입니다. 모두 SVG의 `status`와 기본 접근 가능 이름을 가지며
소비자는 `aria-label`로 맥락에 맞는 이름을 지정합니다. `className`으로
크기를 바꿀 수 있고 색상은 공통 accent token을 따릅니다. 알 수 없는
variant를 런타임에 받으면 `RangeError`를 던집니다.

`icon`·`ring`·`orbit`은 회전하고 `dots`·`bars`는 opacity를 바꿉니다.
`prefers-reduced-motion: reduce`에서는 각 애니메이션을 중지하고
도형을 정적으로 표시합니다. 진행률 수치는 표현하지 않습니다.

## 2026-09-29 NavigationMenu

`NavigationMenu`는 이름이 필수인 가로 `nav`입니다. List·Item·Trigger·
Content·Link를 조합해 상단 링크와 그룹 popup을 만듭니다. `active`
Link는 `aria-current="page"`를 갖습니다. Link의 `trigger` 표현은
상단 단일 링크에, 기본 `content` 표현은 열린 그룹 안의 링크에 씁니다.
`value`·`defaultValue`·`onValueChange`는 Radix Root의 제어 경로를
그대로 전달합니다. 라우팅과 현재 페이지 상태는 소비자가 소유합니다.

가로 탐색만 제공하며 그룹 내용은 해당 trigger 아래에 표시합니다.
Radix primitive가 pointer 열기, 방향키·Home/End 이동, Escape 닫기와
focus 복귀를 처리합니다. 토큰은 surface·foreground·border·focus와
floating shadow를 사용합니다. 작은 화면의 별도 drawer 전환은 기존
`Sidebar`가 맡습니다.

## 2026-10-02 Menubar

`Menubar`는 화면 사이를 이동하는 링크가 아니라 편집기·관리 화면의
상시 명령 모음입니다. Root에는 접근 가능한 이름이 필수이며, 상위
`Menu`·`Trigger`마다 `Content`를 둡니다. 항목은 `onSelect`로 앱의
작업에 연결합니다. 체크·라디오의 값과 작업 결과는 소비자가 소유하고
`checked`·`onCheckedChange`, `value`·`onValueChange`로 전달합니다.

Radix primitive가 상위 trigger 간 방향키 이동, 메뉴 안의 방향키·
typeahead, submenu, Escape 닫기와 focus 복귀를 담당합니다. 래퍼는
`Menu`·`Group`·`Item`·`CheckboxItem`·`RadioGroup`·`RadioItem`·`Sub`를
token 색·간격·focus 표시로 조합합니다. Content는 Portal에 나타나며
좁은 화면에서는 상위 trigger 행만 가로로 스크롤합니다. `disabled`
항목은 실행되지 않습니다. 표시용 단축키와 전역 단축키 실행은
제공하지 않습니다.

## 2026-09-29 DataChart 누적 막대

`DataChart`의 `stacked-bar` variant는 기존 `categories`·`series` 또는
`points` 입력을 사용합니다. 같은 범주의 양수와 음수는 0축 양쪽에
따로 쌓으며, 축 범위는 각 범주의 양수 합계와 음수 합계로 정합니다.
결측값 `null`은 막대를 만들지 않고 숨겨진 데이터 표에
`데이터 없음`으로 남깁니다. 0은 표에 남기되 높이 0인 도형을
그리지 않습니다. 각 입력값은 유한해야 하며 합계가 수치 범위를
넘어가면 `RangeError`를 던집니다.

기존 선형·그룹 막대·영역 variant의 입력과 범례·데이터 표는
유지합니다. 문서 preview는 누적 막대를 다중 계열로 보여주고
빈 데이터 상태도 시험할 수 있습니다. 색상과 경계는 공통 token을
사용합니다.

## 2026-09-29 HoverCard

`HoverCard`는 실제 목적지가 있는 링크의 보조 미리보기를 표시합니다.
Trigger는 anchor를 `asChild`로 받아 링크 이동을 유지합니다.
내용은 목적지의 요약에 한정하며 필수 정보나 유일한 동작을 넣지
않습니다. 결정이 필요한 popup은 기존 `Popover`나 `Dialog`를 씁니다.

Radix Root의 `open`·`defaultOpen`·`onOpenChange`, 열림·닫힘 지연을
그대로 전달합니다. pointer 진입과 keyboard focus에서 열리고 이탈과
Escape에서 닫힙니다. Content는 Portal에 렌더링하고 `side`·`align` 등
Radix 위치 속성을 받습니다. 배경·글자·테두리·shadow는 공통 token을
사용합니다. screen reader에는 카드 내용이 숨겨지므로 링크의 접근
가능한 이름과 목적지 내용은 소비자 앱이 제공해야 합니다.

## 2026-09-29 Toast queue

기존 controlled `Toast`와 `ToastRegion` API를 유지합니다.
`useToastQueue(maxVisible)`은 기본 3건을 FIFO 순서로 표시하고 나머지
건수를 `pendingCount`로 돌려줍니다. `maxVisible`은 양의 정수여야
합니다. `enqueue`는 새 알림을 추가하며 `dedupeKey`가 기존 표시·대기
알림과 같으면 반복 추가를 무시합니다. 키가 없으면 같은 내용도 각각
별도 알림입니다. `dismiss(id)`는 그 알림만 제거하므로 대기 중인 첫
알림이 다음 빈 자리에 나타납니다.

`ToastQueue`는 hook의 `visible` 목록을 기존 `Toast`·`ToastRegion`으로
그립니다. 정보·성공·경고는 `status`, 오류는 `alert`이고 닫기 버튼은
접근 가능한 이름을 갖습니다. 열린 알림은 자동으로 사라지지 않습니다.
알림 내용과 대기열은 hook을 호출한 컴포넌트의 React state가 소유하며
페이지 이동이나 새로고침 뒤에는 복원하지 않습니다. 큐에 있던 알림은
실제로 표시될 때 DOM에 생성되므로 그 전에는 발표되지 않습니다.

## 2026-09-29 DataChart 구간 선택기

`DataChart`의 `inspectable`은 기본 `false`여서 기존 정적 차트 사용을
유지합니다. `true`면 첫 범주를 선택하고, 그래프의 범주 영역에
pointer를 올리거나 클릭하면 해당 범주를 선택합니다. 같은 선택은
이름이 연결된 native `<select>`에서 keyboard·touch로 바꿀 수
있습니다. 선택한 범주의 각 계열 원본 값·단위를 보이는 `<dl>`로
표시하며 `null`은 `데이터 없음`으로 구분합니다. 차트에는 선택 범주의
세로 안내선을 공통 focus token으로 그립니다.

SVG는 기존처럼 보조기술에서 숨기고, 전체 값은 숨겨진 의미 있는
`<table>`에 남깁니다. 빈 범주 목록에는 선택기를 그리지 않습니다.
모든 값이 `null`이지만 범주가 있으면 빈 그래프 안내와 값 선택기를
함께 표시합니다. 차트 값·범례·데이터 계산과 외부 `points`·`series`
입력 규칙은 유지합니다.

`hoverSummary`는 기본 `false`이고 `inspectable`이 `true`일 때만
사용합니다. mouse·pen이 범주 영역에 들어오면 그래프 안에 해당 범주의
값을 시각적으로 중복 표시합니다. 가로 스크롤 위치를 반영해 패널을
보이는 차트 영역 안에 둡니다. pointer가 차트 밖으로 나가거나 차트가
스크롤되거나 Escape를 누르면 패널을 닫습니다. 패널은 `aria-hidden`이며
native 구간 선택기와 데이터 표가 keyboard·보조기술 대체 경로입니다.
누적 영역의 합계는 보이는 계열 중 하나라도 `null`이면
`데이터 없음`으로 표시합니다. 별도 `ChartTooltip` API는 만들지 않습니다.

## 2026-09-29 ToggleGroup

`ToggleGroup`은 보기 모드처럼 즉시 적용되는 토글 묶음입니다.
`type="single"`은 한 문자열, `type="multiple"`은 문자열 배열을
사용합니다. Radix는 단일 항목을 radio, 복수 항목을 pressed button으로
노출하고 그룹 안의 focus를 방향키로 옮깁니다. 방향키 이동만으로
상태를 바꾸지 않으며 Space 또는 Enter로 선택합니다. 단일 모드도
기본적으로 다시 누르면 선택이 해제됩니다. 항상 하나가 필요하면
소비자가 빈 `onValueChange` 값을 거부해야 합니다.

Wrapper는 Radix의 `value`·`defaultValue`·`onValueChange`,
`orientation`, `disabled`, `rovingFocus`를 전달합니다. 색·간격·높이와
focus 표시에는 공통 token을 사용합니다. native form 값이 필요한
선택에는 기존 `RadioGroup`을 사용합니다.

## 2026-09-29 PinInput

`PinInput`은 숫자 확인 코드의 입력값 하나를 여러 칸으로 보여줍니다.
`label`은 필수이고 `name`, `required`, `disabled`, `readOnly` 등
native input 속성을 전달합니다. `length` 기본값은 6이며 양의
정수여야 합니다. `groupSize`는 1부터 `length`까지 허용합니다.
controlled `value`에는 `onValueChange`가 필요하고 uncontrolled
초기값은 `defaultValue`로 받습니다. 값은 길이 이하의 ASCII 숫자만
허용합니다.

하나의 `<input type="text">`가 focus, form 값, native 유효성 검사와
자동완성 속성을 소유합니다. 표시용 칸은 보조기술에서 숨깁니다.
붙여넣기에서 숫자 아닌 문자를 제거하고 최대 길이로 자릅니다.
완성된 코드의 칸을 클릭하면 해당 숫자를 교체할 수 있습니다.
`outline`·`soft`는 공통 색상·크기 token을 사용합니다. SMS 입력과
실제 보조기술 발화는 별도 검증 대상입니다.

## 2026-09-29 Rating

`Rating`은 하나의 점수를 입력하거나 표시합니다. 입력 모드는
`fieldset`의 `legend`로 그룹 이름을 표시하고, 같은 `name`을 가진
native radio를 1부터 `max`까지 만듭니다. `name`을 생략해도 인스턴스별
이름을 생성해 radio가 한 그룹으로 동작합니다. `required`는 미선택
상태의 form 제출을 막습니다. `value`·`onValueChange`는 controlled,
`defaultValue`는 uncontrolled 사용을 위한 속성입니다.

`max`는 1~10의 정수이고 기본값은 5입니다. 점수 0은 미선택을 뜻하며
입력값은 정수여야 합니다. 선택한 점수와 최대치를 화면에 숫자로도
표시합니다. `stars`와 `segments`는 시각적 모양만 바꿉니다.
`readOnly`는 radio와 form 값을 만들지 않고 현재 점수를 이름 있는
이미지와 보이는 숫자로 표시합니다. `name`·`required`와 함께 쓰면
오류로 알립니다. 색상·focus에는 공통 token을
사용합니다. 실제 screen reader 발표는 확인하지 않았습니다.

## 2026-09-29 DataChart 누적 영역

`stacked-area`는 기존 `DataChart`의 `points` 또는
`categories`·`series` 입력을 사용합니다. 모든 값은 0 이상인 유한한
수 또는 `null`이어야 합니다. 음수와 합계 overflow는 `RangeError`로
거부합니다. 각 범주의 계열을 입력 순서대로 더해 누적 경계를 만듭니다.
영역은 공통 색상 token에서 가져온 계열별 색으로 채웁니다.

범주의 계열 중 하나라도 `null`이면 그 범주의 전체 합계는 알 수
없습니다. 모든 계열의 영역을 그 범주에서 끊고, 인접한 완전한
구간끼리만 영역을 연결합니다. 완전한 범주가 하나만 고립되면 점은
표시하지만 넓이가 없는 영역 polygon은 만들지 않습니다. 값이 일부
있어도 완전한 범주가 없으면 그릴 수 없다는 상태를 표시합니다.
숨긴 데이터 표는 원본 계열 값과 완전한 범주의 합계를 함께 담습니다.
`inspectable` 선택기에도 합계를 표시하며, 불완전한 범주는
`데이터 없음`으로 표시합니다. SVG는 장식으로 숨기고 표와 선택기에
값을 남깁니다.

## 2026-09-29 TimePicker

`TimePicker`는 `value: string | null`과 `onValueChange`로 제어합니다.
완성 값은 날짜·시간대 정보가 없는 로컬 시각 `HH:mm`입니다. `null`은
미선택이며 빈 문자열은 유효한 값으로 취급하지 않습니다. `name`을
주면 하나의 hidden input이 완성 값을 form에 전달합니다.
`null`은 form에서 빈 문자열로 직렬화합니다.

시·분·필요하면 오전/오후를 각각 이름 있는 native `<select>`에서
고릅니다. 일부만 고른 상태는 내부 draft로 유지하고 값으로 전달하지
않습니다. 이전 완성 값에서 한 부분을 지우면 `onValueChange(null)`로
form 값을 지웁니다. `required`이거나 부분 입력이 있으면 빈 select가
native form 제출을 막습니다. `fieldset`의 `legend`가 전체 이름을
제공하고, disabled 상태에서는 select와 form 값이 비활성화됩니다.

`hourCycle`은 `h12` 또는 `h23`이며 생략하면 locale의 기본값에서
결정합니다. `locale`은 숫자와 오전/오후 표시를 바꾸지만 form 값은
ASCII `HH:mm`으로 유지합니다. segment 이름은 한국어·영어 기본값을
두고 다른 언어는 `segmentLabels`로 지정할 수 있습니다.
`minuteStep`은 60의 양의 정수 약수이고 기본값은 5입니다. 입력값이
형식이나 step에 맞지 않으면 오류로 알립니다. 다른 시간대로의 변환과
날짜를 포함한 유효성 정책은 이 component의 범위가 아닙니다.

## 2026-09-29 ScrollArea

`ScrollArea`는 높이·너비가 정해진 부모 또는 자신의 `className` 안에서
내용을 스크롤합니다. `orientation`은 `vertical`(기본값), `horizontal`,
`both` 중 하나이며 대응하는 Radix scrollbar만 렌더링합니다. `type`은
Radix의 표시 정책을 그대로 받고 기본값은 `auto`입니다. 지원하지 않는
orientation과 비어 있는 label은 오류로 알립니다.

필수 `label`은 스크롤되는 viewport에 `aria-label`로 전달합니다.
viewport는 이름이 있는 `region`이고 `tabIndex=0`으로 키보드에서
초점을 받을 수 있습니다. focus ring과 scrollbar thumb는 공통 token을
사용합니다. `viewportRef`로 실제 스크롤 DOM을 참조할 수 있고 `dir`은
Radix root에 전달됩니다. 이 component는 스크롤 위치를 소유하지
않습니다. 내부 대화형 요소의 focus와 내용 순서는 소비자가 관리합니다.

## 2026-09-29 ButtonGroup

`ButtonGroup`은 별개의 작업 버튼을 하나의 이름 있는 그룹으로 묶습니다.
필수 `label`을 `aria-label`로 사용하고, `orientation`은 가로(기본값)와
세로만 허용합니다. 각 `Button`은 native click·Tab·Enter/Space·
disabled 동작을 유지합니다. 그룹은 선택값이나 실행 상태를 소유하지
않습니다. `ButtonGroupSeparator`는 시각적 구분선으로 `aria-hidden`을
사용합니다. 연결된 모서리·테두리와 focus 순서는 배치 방향에 맞춥니다.

## 2026-09-29 DateTimePicker

`DateTimePicker`는 `DateTimeSelection`의 `date`·`time`을 각각
`string | null`로 받는 controlled 조합입니다. 필수 `timeZone`은
`Intl.DateTimeFormat`이 지원하는 IANA 이름이어야 합니다. 이름이 있는
그룹 안에 기존 `DatePicker`와 `TimePicker`를 놓고 각 부분의 변경은
다른 부분의 값을 보존한 채 `onValueChange`로 전달합니다.

`name`을 주면 두 부분이 모두 완성됐을 때만 `YYYY-MM-DDTHH:mm`과
시간대 이름을 별도 hidden input에 씁니다. 일부만 선택됐으면 두 값은
모두 빈 문자열입니다. 두 번째 이름은 기본적으로 `${name}TimeZone`이며
`timeZoneName`으로 지정할 수 있습니다. disabled 상태에서는 두 form
값도 비활성화됩니다. 날짜 범위와 시각 형식·minute step은 기존 두
control의 규칙을 따릅니다.

이 값은 특정 UTC instant가 아니라 시간대가 명시된 로컬 날짜시각입니다.
DST 때문에 존재하지 않거나 둘로 해석되는 시각을 자동 보정하지
않습니다. 제출을 받는 앱이 해당 시간대의 날짜시각을 해석·검증하고
필요하면 중복 시각의 선택 정책을 정해야 합니다. 실제 screen reader
발표와 전체 keyboard 탐색은 별도 검증 대상입니다.

## 2026-09-29 CodeBlock

`CodeBlock`은 탭 없이 하나의 코드 문자열을 표시합니다. 필수 `label`은
보이는 `figcaption`과 코드 영역의 이름에 쓰며, `language`는
보이는 텍스트로만 표시합니다. 문자열은 React 텍스트 노드로 렌더링해
HTML로 해석하지 않습니다. 빈 코드는 허용하지만 복사 버튼은
비활성화합니다.

`wrap={false}`(기본값)는 `pre`의 공백·줄바꿈을 보존하고 긴 줄을
블록 안에서 가로 스크롤합니다. `wrap={true}`는 공백을 보존하면서
긴 줄을 접습니다. `pre`는 focus를 받아 키보드로 스크롤할 수
있습니다. `copyable={false}`면 복사 버튼과 상태 메시지를 렌더링하지
않습니다. 복사 요청의 성공·실패는 이름 있는 버튼 옆의 `role=status`로
알립니다. Clipboard API가 없는 환경도 실패 상태로 처리합니다.

`Snippet`은 여러 코드 탭을 조합할 때 사용하고 `CodeBlock`은 단일
코드·파일·응답 본문을 보여줄 때 사용합니다. syntax highlighting과
코드 실행은 현재 API에 포함하지 않습니다.

## 2026-09-29 Markdown

`Markdown`은 필수 `source` 문자열을 받아 안전한 문법 부분집합을
표시합니다. `#`~`###` 제목은 문서·메시지 안에 들어갈 수 있도록
`h2`~`h4`로 렌더링합니다. 빈 줄로 문단을 나누고, 연속한 줄의
`-`·`*`·`+` 또는 숫자 목록은 단층 목록으로 묶습니다. `**굵게**`,
`*강조*`, 단일 백틱 인라인 코드, 세 개 이상의 백틱·물결표 코드
블록과 `[이름](절대 URL)` 링크를 지원합니다. 코드 블록의 줄바꿈을
보존하고 키보드 스크롤을 위해 `pre`에 focus를 허용합니다.

링크는 사용자 정보와 제어 문자·역슬래시가 없는 절대 HTTP(S) 주소만
실제 `a` 요소로 만듭니다. 그 외 링크 문법, 이미지, 원시 HTML과
미지원 문법은 텍스트로 표시합니다. React가 텍스트를 escape하며
HTML 문자열을 직접 삽입하지 않고 `dangerouslySetInnerHTML` prop도
타입과 실행 시점에서 거부합니다. 상대 링크·복잡한 괄호가
있는 URL·중첩 목록·표·인용·reference link·HTML 렌더링은 지원하지
않습니다. 닫히지 않은 코드 fence는 남은 원문을 코드로 표시합니다.
강조의 재귀 깊이는 8단계로 제한합니다.

## 2026-09-29 MetricCard 표시 형태

`MetricCard`의 `variant`는 `default`, `compact`, `featured` 중 하나이며
기본값은 이전 배치를 유지합니다. `compact`는 label과 수치를 한 행에
놓고 보조 설명을 다음 행에 표시합니다. `featured`는 accent 배경과
큰 수치로 대표 지표를 구분합니다. 색상은 `--accent`와
`--accent-foreground` token을 사용합니다. 어느 형태든 label, 값,
변화, 기간의 텍스트와 이름 있는 group을 유지합니다. 지원하지 않는
variant는 `RangeError`로 알립니다. 값의 단위·변화 방향·기간의
의미는 호출자가 명시하며 component가 문자열에서 추론하지 않습니다.

## 2026-09-29 DataList

`DataList`는 필수 `label`로 이름 붙인 그룹 안에 전달 순서 그대로
`dl`의 `dt`/`dd` 쌍을 표시합니다. `items`의 각 항목은 고유한
`id`, 비어 있지 않은 `label`, 명시한 `value`가 필요합니다. 값은
ReactNode이며 `null`이면 `missingText`(기본 `값 없음`)로
표시합니다. 빈 문자열은 누락값으로 바꾸지 않습니다. 빈 목록은
`emptyText`(기본 `표시할 정보가 없습니다.`)를 표시하며 `dl`은
렌더링하지 않습니다. 중복 ID, 누락 필드, 지원하지 않는 layout은
오류로 알립니다.

`layout="rows"`(기본값)는 이름과 값을 한 행의 두 열에 놓습니다.
`layout="grid"`는 container 너비 320px부터 항목을 두 열로 놓고,
그보다 좁으면 한 열로 표시합니다. 순서·값·단위의 의미와 갱신 상태는
호출자가 소유합니다. 이 component 자체는 조작 요소가 없어 keyboard
interaction을 추가하지 않습니다. 실제 screen reader 발표는
확인하지 않았습니다.

## 2026-09-29 Badge 표시 형태

`Badge`는 기존 native `span`과 전달된 텍스트를 유지합니다.
`variant`의 기본값 `default`는 기존 중립색 class를 사용합니다.
`outline`은 투명 배경, `accent`는 accent 배경과 대응 foreground,
`danger`는 surface 배경과 danger 텍스트·테두리를 사용합니다.
지원하지 않는 variant는 `RangeError`입니다. variant는 시각 표현만
정하고 상태 이름은 호출자가 텍스트로 제공해야 합니다. component는
상태를 추론하거나 `role=status`를 임의로 추가하지 않습니다.

Operations workspace는 완료·실행 중·실패 각각에 기본·강조·위험
variant를 지정하며 모든 셀에 상태 이름을 표시합니다. 별도
`StatusIndicator` component는 만들지 않습니다. 실제 screen reader
발표와 모든 colormap의 대비는 별도로 검사해야 합니다.

## 2026-09-29 하단 탐색

`BottomNav`는 기존 `Navigation` item에 포함된 이름 있는 `<nav>`입니다.
`BottomNavLink`는 실제 `href`와 항상 보이는 `label`을 필수로 받는
native `<a>`입니다. icon은 선택적 장식으로 접근성 트리에서 숨깁니다.
현재 경로를 아는 호출자가 해당 링크에 `aria-current="page"`를
지정합니다. `BottomNav`는 URL, route 상태, fixed positioning을 소유하지
않으며 `AppBottomPanel` 안이나 화면 하단에 배치할 수 있습니다.
좁은 영역에서 목적지가 많으면 링크를 숨기지 않고 내부 가로 scroll을
사용합니다. Tab·Enter는 native 링크 동작입니다. label 또는 href가
공백이면 오류로 알립니다. 실제 화면 판독기와 touch 조작은 별도
검증 대상입니다.

## 2026-09-29 Navigation 링크 표시 형태

`GlobalNavLink`의 기본 `surface`와 선택적 `underline`,
`SideNavLink`의 기본 `rail`과 선택적 `filled`는 같은 native 링크에
적용하는 표시 형태입니다. 현재 페이지는 호출자가
`aria-current="page"`로 지정합니다. 밑줄형은 accent 테두리와 글자,
채움형은 accent 배경과 accent foreground를 사용합니다. variant는
목적지나 현재 route를 바꾸지 않습니다.

## 2026-09-29 SegmentedControl

`SegmentedControl`은 `label`, `name`, text가 있는 item과 고유한
`value`를 받습니다. `fieldset`·`legend`가 그룹 이름을 제공하고 각
item의 native radio가 선택값을 form에 전달합니다. item은 그룹의 직접
자식이어야 하며 빈 그룹과 중복 값은 오류입니다. controlled `value`와
uncontrolled `defaultValue`를 지원하며 선택 시 `onValueChange`를
호출합니다. `required`와 그룹·item의 `disabled`는 native 입력 규칙을
따릅니다. `name`을 생략하거나 공백으로 주면 오류로 알립니다.

기존 `RadioGroup`은 원형 표시와 별도 `Label` 조합을 유지하고,
`ToggleGroup`은 누름 상태를 다룹니다. 화면 밀도처럼 가로로 붙은
선택지를 form에 제출하는 경우에 이 component를 사용합니다. 그룹이
서버 저장이나 제출 결과를 소유하지 않습니다. 좁은 공간에서는
항목을 숨기지 않고 그룹 내부를 가로로 스크롤합니다. 실제 screen
reader 발표와 RTL은 아직 검증하지 않았습니다.

## 2026-09-29 SplitButton 조합 예시

`ButtonGroup`의 기본 `Button`은 즉시 실행합니다. `DropdownMenuTrigger`
안의 두 번째 `Button`은 대체 작업 메뉴를 열고 고유한 접근성 이름을
가집니다. `ButtonGroupSeparator`는 장식이며 메뉴 항목은 대체 작업을
실행합니다. 실행 상태와 결과 메시지는 예시 화면의 React state가
소유합니다. 그룹이나 메뉴가 해당 상태를 저장하지 않습니다.
별도의 `SplitButton` public API나 registry item은 만들지 않습니다.

## 2026-09-29 CitationList

`CitationList`는 필수 `label`로 section 이름을 정하고 전달된
`sources` 순서대로 native ordered list를 표시합니다. 출처마다 고유
`id`, 비어 있지 않은 `title`, 절대 HTTP(S) `href`가 필요합니다.
`location`·`excerpt`는 선택적이며 title·location·`새 탭` 문구가
링크 안에 보입니다. 링크는 `noopener noreferrer`와 함께 새 탭에서
열립니다. 빈 배열은 `emptyText`를 표시하고 목록을 만들지 않습니다.
`compact`·`card`는 표현만 다르며 출처의 내용과 순서는 같습니다.
잘못된 URL scheme·중복 ID·빈 이름은 오류로 알립니다. 네트워크
확인, 출처의 신뢰도 판단, 답변 문장과 인용의 연결은 호출자가
소유합니다. 실제 screen reader 발표는 별도 검증 대상입니다.

## 2026-09-30 Sidebar 섹션 탐색

`Sidebar`는 기존 `items` 평면 목록 또는 `sections` 목록 중 하나를
받습니다. `SidebarSection`은 고유 `id`, 비어 있지 않은 `label`, 최소
한 개의 `SidebarItem`을 가집니다. 항목 `id`는 섹션을 넘어 고유해야
합니다. 두 입력을 함께 주거나 둘 다 생략하면 오류로 알립니다.

각 섹션은 제목이 연결된 `role="group"`으로 표시됩니다. 데스크톱
Sidebar를 접어도 제목은 화면 판독기용 텍스트로 남고, 모바일 Drawer에는
제목을 보여줍니다. 링크의 `current`와 `onNavigate`, 접힘·Drawer
제어 방식은 기존과 같습니다. 라우팅과 현재 항목 상태는 호출자가
소유합니다. `items` 사용 코드는 수정할 필요가 없습니다.

## 2026-09-30 기간 필터 조합

문서의 `FilterBar` 예시는 기존 `DateRangePicker`의 controlled draft
값과 별도의 applied 값을 사용합니다. `FilterBar` 제출 때
`FormData`의 `periodStart`·`periodEnd`가 모두 비어 있지 않아야
적용합니다. 부분 선택은 오류를 표시하고 이전 applied 값과 결과
목록을 유지합니다. 초기화는 draft·applied·오류를 함께 지웁니다.

예제 행은 날짜만 담은 `YYYY-MM-DD` 값이므로 완성된 기간의 양끝을
포함해 문자열로 비교합니다. 서버 timestamp나 일광 절약 시간이
있는 데이터의 날짜 구간은 소비자가 사용하는 시간대와 끝 경계를
정해 변환해야 합니다. `오늘`·`최근 7일` 같은 preset도 소비자 앱이
기준일과 시간대를 정한 뒤 draft에 넣습니다. 이 조합은 새 public
component나 registry item을 만들지 않습니다.

## 2026-09-30 Gantt 일정 시간축

`Gantt`는 호출자가 소유한 `tasks`와 `rangeStart`·`rangeEnd`를 받습니다.
작업의 시작·끝은 `YYYY-MM-DD` 달력 날짜이며 양 끝을 포함합니다.
timestamp의 시간대 변환이나 현재 날짜의 자동 선택은 하지 않습니다.
표시 구간은 1~366일이고 모든 작업이 구간 안에 있어야 합니다. `day`는
하루씩, `week`는 `rangeStart`에서 시작하는 7일씩 묶어 표시합니다.
작업 ID와 제목은 필수·고유하고, 진행률은 생략하거나 0~100의 유한한
값이어야 합니다. 생략과 0%는 서로 다른 상태로 표시합니다.

`dependsOn`은 같은 목록의 선행 작업 ID입니다. 선행 작업의 끝 날짜는
후속 작업의 시작 날짜보다 앞서야 합니다. 알 수 없는 ID, 자기 참조,
중복 참조, 역전된 날짜·의존 관계는 설정 오류로 알립니다. 연결선은
시간축에 그리되 장식 정보로 처리하고, 작업 버튼은 선행 작업의 이름을
텍스트로 제공합니다. 각 작업은 한 행을 차지합니다.

작업 이름 버튼이나 시간축의 행을 선택한 뒤 native 버튼으로 시작·끝을
함께 하루 이동하거나
끝만 하루 늘리고 줄입니다. 범위·최소 1일 기간·선행/후속 작업 조건을
깨는 버튼은 비활성화합니다. `changeGanttTask`는 같은 규칙으로 새
작업 배열과 변경 내용을 반환하고 입력을 수정하지 않습니다. 가능한
변경이 없으면 `null`, 없는 작업 ID나 잘못된 초기 일정은 오류입니다.
`onTasksChange`가 있으면 컴포넌트가 변경 제안을 전달하고 호출자가
새 `tasks`를 다시 전달합니다. 콜백이 없으면 시간축은 read-only입니다.
이동 후 요청한 날짜를 live region에 알립니다. 저장·실패 복구는
호출자가 맡습니다. drag, marker, grouping, 다중 행 배치는 이 API에
포함되지 않습니다.

## 2026-09-30 Kanban 작업 보드

`Kanban`은 이름 있는 열과 고유 ID를 가진 카드를 순서대로 받습니다.
`columns`는 호출자가 소유하며, 이동 시 `onColumnsChange`에 새 열 목록과
출발·도착 열/인덱스를 전달합니다. 컴포넌트는 입력 배열을 수정하지
않습니다. 열·카드의 중복/빈 ID 또는 빈 제목과 빈 열 목록은 설정 오류로
알립니다. 카드를 0개 가진 열은 유효한 드롭 대상입니다.

포인터는 native drag/drop으로 카드 앞 또는 열 끝에 놓습니다. 열 사이
이동과 같은 열 안의 한 칸 이동은 각 카드의 native 버튼으로도 가능해
키보드와 touch 조작에서 drag에 의존하지 않습니다. 이동 후 버튼 focus를
복원하고 새 위치를 live region으로 알립니다. 카드 데이터의 서버 저장과
실패 시 복구는 호출자가 맡습니다. 현재 구현은 한 번에 카드 한 개를
이동하며 열 재정렬·다중 선택은 제공하지 않습니다.

## 2026-09-30 InputGroup

`InputGroup`은 기존 `Input`·`Textarea`와 addon을 한 테두리 안에
배치합니다. `InputGroupAddon`의 `align`은 `inline-start`,
`inline-end`, `block-start`, `block-end` 중 하나입니다. 잘못된 값은
설정 오류로 알립니다. addon은 텍스트와 `InputGroupButton` 같은
독립 동작을 담을 수 있습니다. 버튼 기본 `type`은 `button`이며
form 제출은 `type="submit"`을 명시합니다.

입력값과 유효성 검사는 native control 또는 호출자가 소유합니다.
`Field`와 조합하면 label·설명을 control에 연결합니다. DOM에서는
control 다음에 addon이 오고 CSS `order`가 시각적 위치를 정합니다.
그러므로 키보드는 control 다음 addon 버튼으로 이동합니다. 공유
테두리에 `focus-within` 표시를 하고 control의 중복 outline을 지웁니다.
실제 screen reader와 RTL 시각 순서는 별도 확인이 필요합니다.

## 2026-09-30 RangeSlider

`RangeSlider`는 가격·수치 필터처럼 두 endpoint를 이름 붙여 제출할 때
사용합니다. 기존 `Slider`의 두 thumb에 `minLabel`·`maxLabel`을 연결하고
각각 `minName`·`maxName`의 hidden input으로 현재 숫자를 제출합니다.
`label`은 전체 그룹의 이름입니다. `form`으로 외부 form을 지정할 수
있으며 `disabled`면 두 값을 제출하지 않습니다. 기본값은 `[min, max]`,
`defaultValue`는 내부 상태, `value`와 `onValueChange`는 호출자 상태를
사용합니다. `formatValue`는 표시 문자열만 바꾸고 제출 값은 숫자입니다.

두 값은 항상 오름차순이며 `minStepsBetweenThumbs`는 `step` 단위로
최소 간격을 정합니다. Radix Slider는 thumb를 반대편으로 넘기면 값을
정렬하고 focus를 이동합니다. 따라서 두 이름은 현재 작은 값과 큰 값에
붙고, 이동 중 조작하는 endpoint가 바뀔 수 있습니다. 실제 screen
reader가 이 전환을 어떻게 알리는지는 별도 검증 대상입니다. 전달된
범위·이름·간격이 잘못되면 렌더링 단계에서 오류를 알립니다.

## 2026-09-30 Heatmap

`Heatmap`은 `columns`와 고유 `id`·`label`을 가진 `rows`의 행렬을
받습니다. 각 행의 `values`는 열 수만큼 있고 유한한 숫자 또는
`null`입니다. `0`은 관측값, `null`은 결측값으로 구분합니다. 빈 행
목록은 상태 문구를 표시하고, 숫자가 전혀 없는 행렬은 표와 `값 없음`을
표시합니다. 중복·빈 이름, 값 개수 불일치, 무한대와 NaN은 오류입니다.

범위를 생략하면 0을 포함한 관측 최솟값·최댓값을 사용합니다. 명시적
`minValue`·`maxValue`는 함께 지정해야 하며 모든 값이 범위 안에 있어야
합니다. 값·단위는 모든 셀에 텍스트로 남고 색 농도는 보조 표현입니다.
`compact`·`comfortable`는 셀 크기만 바꾸며 데이터와 표 구조는 같습니다.
표의 caption·행/열 `scope`와 이름 있는 가로 스크롤 영역을 제공합니다.
데이터 취득·정렬·집계는 호출자가 소유합니다. 실제 screen reader와
touch 스크롤은 별도 확인 대상입니다.

## 2026-09-30 ScatterChart

`ScatterChart`는 고유 `id`와 이름, 두 연속 좌표를 가진 `points`를
받습니다. 각 좌표는 유한한 숫자 또는 `null`이며 `0`과 결측값을
구분합니다. 두 좌표가 모두 있는 점만 SVG에 그리지만 펼칠 수 있는
native 표에는 입력한 모든 행을 남깁니다. 빈 목록과 결측값만 있는
목록은 서로 다른 상태 문구를 표시합니다.

표시 범위를 생략하면 그릴 수 있는 점의 최솟값·최댓값을 사용하고,
상수축에는 여백을 둡니다. `xDomain`·`yDomain`을 지정하면 두 유한한
오름차순 값이어야 하며 그릴 점이 모두 포함돼야 합니다. 입력 오류는
렌더링에서 알립니다. 포인터는 점을 선택하고 키보드는 이름 있는
native 선택기를 사용합니다. 선택된 점의 정확한 값은 설명 목록에
보입니다. `selectedId`를 생략하면 component가 선택 상태를 소유하고,
지정하면 `onPointSelect`가 필요합니다. `null`은 선택하지 않은 상태입니다.
데이터 취득·분석·저장은 호출자가 소유합니다. 실제 screen reader와
touch·RTL의 동작은 별도 검증 대상입니다.

## 2026-09-30 월 선택

`MonthPicker`는 `YYYY-MM` 또는 `null`을 controlled 값으로 받습니다.
날짜와 시각을 포함하지 않으며 hidden input에는 선택 월 또는 빈 문자열을
전달합니다. `min`·`max`는 월 단위의 포함 경계입니다. 연도 이동은
허용된 연도 안에서만 가능하고 경계 밖 월은 disabled입니다. 월을 선택하면
popover를 닫습니다. `required=false`면 선택한 월을 다시 눌러 지울 수
있습니다. 필수값 오류는 `Field`를 사용하는 소비자 form이 검사합니다.
각 월은 이름과 선택 상태가 있는 native 버튼입니다. Tab으로 이동하고
Enter·Space로 고르며 Escape는 popover를 닫고 trigger로 돌아갑니다.
별도의 날짜·시간대 변환은 하지 않습니다.

## 2026-09-30 평가·즐겨찾기·게시판·대댓글

`ResponseFeedback`은 `up | down | null` 값을 받는 controlled
선택입니다. 같은 선택을 다시 누르면 `null`이 됩니다. 두 버튼은
서로 배타적이며 `pending`·`disabled`일 때 변경을 막습니다. 집계 수는
선택 사항이고 컴포넌트는 집계를 직접 바꾸지 않습니다.
`FavoriteToggle`은 `Toggle`의 controlled/uncontrolled 눌림 상태를
그대로 사용합니다. 선택 사항인 집계 수는 상태 변경과 별개입니다.

`Board`는 고유 ID를 가진 게시글 목록을 렌더링하고 선택한 ID와
글쓰기 action을 호출자에게 전달합니다. 검색, 페이지, 작성 form,
저장과 권한은 호출자가 구현합니다. 문서 예제는 기존 `Dialog`로
작성 form을 엽니다. `Thread`는 고유 댓글 ID와 `parentId`로
대댓글 관계를 구성합니다. 부모 댓글이 입력 목록에서 뒤에 있어도
부모 다음에 표시합니다. 없는 부모나 순환 관계는 오류로 알립니다.
답글 작성은 `onReply(parentId, content)`로 전달합니다. 비동기 저장이
실패하면 초안을 유지하고 오류를 표시합니다. 데이터 저장·수정·삭제와
사용자 권한은 호출자가 소유합니다.

네 컴포넌트는 공통 색상·간격 token을 사용합니다. 게시판은 native
목록·버튼으로 선택하고 댓글은 부모 작성자를 텍스트로 명시합니다.
실제 screen reader·touch·Safari·RTL은 별도 검증 대상입니다.
## 2026-10-01 선택 카드 표시 형태

`Checkbox`와 `RadioGroupItem`의 `variant="card"`는 기존 선택 상태와
form 동작을 유지하면서 전체 카드 면적을 누를 수 있게 합니다.
`label`은 필수인 보이는 이름이고 `description`은 선택적 보조 설명입니다.
기본 표시 형태는 기존 외부 `Label` 연결을 유지합니다. 카드의 이름은
`aria-labelledby`, 설명은 `aria-describedby`로 연결하며 호출자의
`aria-label`·`aria-labelledby`를 우선합니다. 기존 `aria-describedby`가
있으면 카드 설명 ID를 이어 붙입니다.

RadioGroup은 단일 값과 방향키 이동을 Radix가 소유하고, 그룹 이름은
호출자가 지정합니다. Checkbox는 독립된 값과 Space 전환을 Radix가
소유합니다. 카드 안에 다른 버튼·링크를 중첩하지 않습니다. disabled는
선택과 제출에서 제외됩니다. 좁은 화면에서도 카드는 한 열로 쌓이고
색 외에 indicator와 텍스트로 상태를 구분합니다.

## 2026-10-01 YearPicker

`YearPicker`는 연간 보고·예산의 연도 하나를 `YYYY` 문자열로
선택합니다. `value: string | null`은 호출자가 소유하고 빈 값은
`null`입니다. `0001`부터 `9999`까지 허용하며 `min`·`max`도 같은
형식입니다. 역전된 범위와 범위 밖 값은 오류로 알립니다. 이름을
주면 hidden input 하나에 선택값 또는 빈 문자열을 넣습니다.

Popover는 선택 연도가 속한 10년 구간을 열고 이전·다음 10년으로
이동합니다. 범위 밖 연도와 해당 범위에 선택 가능한 연도가 없는
이동 버튼은 비활성화합니다. 연도는 native 버튼이며 선택 상태를
`aria-pressed`로 표시합니다. 필수가 아니면 선택 연도를 다시 눌러
해제할 수 있고, `required`면 유지합니다. `required`는 선택 정책이며
hidden input의 native 필수값 검사를 대신하지 않습니다. Field나
소비자 form이 제출 시 빈 값을 검사합니다.

Popover의 Escape·focus 복귀는 기존 Radix 기반 구현을 사용합니다.
연도 그룹은 Tab으로 이동하고 Enter·Space로 선택합니다. 방향키로
연도를 바꾸는 별도 grid 규칙은 제공하지 않습니다. 표시와 focus
스타일은 공통 token을 사용하며 실제 screen reader·touch·Safari·
RTL 동작은 별도 검증 대상입니다.

## 2026-10-02 IconButton·Tabs 표시 형태

`IconButton`은 아이콘 전용 native 버튼입니다. 호출자는 `label`과
`icon`을 제공해야 합니다. `Button`의 `size="icon"`과 공통 token을
사용하고 `variant`·disabled·`aria-pressed` 등 버튼 속성을 전달합니다.
아이콘은 발표에서 숨기며 `label`을 접근 가능한 이름으로 설정합니다.
빈 이름과 빈 아이콘은 오류로 알립니다. 기본 variant는 `ghost`입니다.

`TabsList.variant`는 `default | line | contained`입니다. 생략하면
기존 표시를 유지합니다. `line`은 활성 탭에 token 색상의 밑줄을,
`contained`는 옅은 목록 표면과 활성 탭 표면을 적용합니다. 선택 상태,
방향키, panel 연결은 기존 Radix primitive가 소유합니다. 한 목록의
trigger는 목록 variant를 공유합니다. 실제 screen reader·touch·
Safari·RTL 발표와 조작은 미검증입니다.

## 2026-10-02 CodeEditorShell

`CodeEditorShell`은 SQL·설정 조각의 일반 텍스트 값을 편집합니다.
`value`와 `onValueChange`는 필수이며 상태는 호출자가 소유합니다.
`name`을 주면 native textarea 값이 form에 제출됩니다. reset 시
호출자가 controlled 값을 되돌립니다. `required`, `disabled`,
`readOnly`는 native textarea 규칙을 따릅니다. 빈 문자열은 편집 가능한
값이며 필수값 판단은 native form 또는 호출자가 담당합니다.

보이는 `label`은 textarea의 `id`와 연결합니다. 선택적 설명과 오류는
`aria-describedby`에 연결하고 오류는 `aria-invalid` 및 `role="alert"`로
표시합니다. 줄 번호는 현재 값의 LF 개수에 1을 더해 표시하되
발표에서 숨깁니다. `wrap="off"`로 코드의 원본 줄바꿈을 유지하고
textarea와 줄 번호 gutter의 세로 scroll을 동기화합니다. Tab은 다음
focus 대상으로 이동하며 editor 안에 가두지 않습니다. `rows`는
보이는 줄 수를 정하고 양의 정수여야 합니다.

`panel`과 `flat`은 공통 token의 두 표시 형태입니다. 언어 이름은
선택적 표시 텍스트이고 parsing·구문 강조·실행을 하지 않습니다.
`actions`에는 호출자 버튼을 넣으며 실행 결과와 오류 처리는 호출자가
소유합니다. 실제 screen reader·touch·Safari·RTL 검사는 남았습니다.

## 2026-10-02 CalendarScheduler

`CalendarScheduler`는 `initialDate`로 최초 선택일과 표시 월을
고정합니다. 날짜는 `YYYY-MM-DD` 달력 날짜이며 `selectedDate`가 있으면
호출자가 선택을 소유합니다. 없으면 내부 상태로 선택합니다.
`onSelectedDateChange`는 다른 날짜를 선택할 때만 호출합니다. 월 이동은
선택 날짜를 임의로 바꾸지 않습니다. 외부에서 controlled 날짜를 바꾸면
그 날짜의 월을 표시합니다.

`events`는 고유 ID·날짜·제목을 가진 단일 날짜 일정입니다. `startTime`과
`endTime`은 24시간제 `HH:mm`이며 종료는 시작보다 늦어야 합니다.
시간이 없으면 종일 일정입니다. 시간이 있는 일정에는 IANA
`timeZone`을 지정합니다. 컴포넌트는 값을 변환하지 않고 이 시간대를
일정 목록에 표시합니다. 시간·ID 순서로 목록을 안정적으로 정렬하고
빈 날짜는 별도 문구를 표시합니다. 반복 일정, 여러 날에 걸친 일정,
시간대 변환, 저장, 충돌·권한 판단은 호출자가 맡습니다.

Calendar의 날짜 버튼에는 일정 건수를 읽을 수 있는 이름과 시각적
밑줄을 제공합니다. 선택한 날짜의 agenda는 이름 있는 영역이며
`onEventSelect`가 있으면 일정은 native 버튼이 됩니다.
`onCreateEvent`가 있으면 해당 날짜의 추가 버튼을 표시합니다.
Calendar의 keyboard·focus는 기존 DayPicker가 소유합니다.
실제 브라우저·screen reader·touch·Safari·RTL 동작은 미검증입니다.
## 2026-10-02 QueryBuilder

`fields`는 text·number·date·select 필드와 선택지를 정의합니다.
`value`는 고유 ID를 가진 조건과 `all`/`any` 그룹의 controlled 트리입니다.
추가·편집·삭제·순서 변경은 완전한 다음 트리를 `onValueChange`로
전달합니다. 호출자는 값 보존, 조회·저장과 실제 필터 실행을 맡습니다.

값 없는 연산자를 제외한 미완성·잘못된 조건은 편집 중 보존합니다.
적용 시 각 조건의 오류를 표시하고, 전체 트리가 유효할 때만 `onApply`를
호출합니다. 조건이 없는 최상위 그룹은 전체 결과를 뜻하는 빈
쿼리로 허용합니다. 중첩 그룹은 비어 있으면 오류입니다. 그룹 깊이는
기본 4단계, 최대 8단계입니다.

form과 중첩 fieldset에 이름을 붙이고 native 입력·선택·버튼을
사용합니다. 위·아래 버튼으로 순서를 바꾸므로 drag 동작이나 별도
키보드 패턴은 필요하지 않습니다. `panel`·`plain`은 공통 token을
사용합니다. 실제 보조기술 발표는 미검증입니다.
## 2026-10-02 AgentStatus

`AgentStatus`는 호출자가 소유한 전체 작업 상태와 단계 목록을
표시합니다. 전체 상태는 `queued`·`running`·`completed`·`failed`·
`cancelled`, 단계 상태는 `pending`·`running`·`completed`·`failed`·
`skipped`입니다. 단계는 고유 ID와 이름이 필요하며 한 개 이상이어야
합니다. 완료와 건너뜀을 처리된 단계로 세어 전체 수와 함께 native
progress에 전달합니다.

대기·실행 중에는 `onCancelTask`, 실패·취소 후에는 `onRetryTask`가
있을 때만 버튼을 표시합니다. `actionPending`은 해당 버튼을
비활성화합니다. callback은 요청만 전달하며 실제 취소·재시도와
상태 갱신은 호출자가 맡습니다. 전체 상태와 단계별 상태가 일시적으로
다르면 내부에서 추측해 바꾸지 않습니다. `panel`과 `compact`는
같은 이름·진행·작업 규칙을 공유하는 표시 형태입니다.

## 2026-10-02 AnchorNav

`AnchorNav`는 한 문서의 섹션 ID와 표시 이름을 문서 순서대로
받습니다. `depth: 2`는 rail 표시의 들여쓰기이며 별도 중첩
목록 의미를 만들지 않습니다. 호출자는 대상 섹션을 DOM에 두고
ID를 고유하게 유지합니다.

native hash 링크로 이동하고 현재 섹션에는
`aria-current="location"`을 붙입니다. window 또는
`scrollRootId`로 지정한 내부 스크롤 영역의 위치를 읽습니다.
내부 영역의 링크는 그 영역만 스크롤하고 hash를 갱신합니다.
뒤로 가기와 외부 hash 변경도 같은 대상에 반영합니다. 클릭 후
focus는 강제로 옮기지 않습니다. `onCurrentIdChange`는 현재
섹션이 달라질 때만 알리며 스크롤 상태 자체는 component가
관리합니다. `rail`·`inline`은 공통 token을 쓰는 표시 형태입니다.

## 2026-10-02 TreeNav

`TreeNav`는 여러 단계의 페이지 링크를 이름 있는 native nav·중첩
목록으로 표시합니다. 호출자가 페이지 ID·label·href와 현재 페이지
ID를 제공합니다. 실제 라우팅은 링크와 소비자 앱이 담당하며
`onNavigate`는 클릭한 ID만 알립니다. 현재 링크에는
`aria-current="page"`를 붙입니다.

자식이 있는 페이지는 링크와 별도의 disclosure 버튼을 가집니다.
href가 없는 그룹은 이름 있는 버튼 자체가 자식을 펼칩니다.
버튼은 `aria-expanded`·`aria-controls`로 자식 목록을 연결하며
native Tab·Enter·Space를 사용합니다. 초기에는 현재 페이지의
조상 경로를 열고, 현재 ID가 바뀌면 새 경로를 엽니다. 사용자가
현재 경로를 접는 것은 허용합니다.

확장 상태는 기본적으로 component가 소유하고 `expandedIds`를
제공하면 호출자가 소유합니다. controlled 상태에는
`onExpandedIdsChange`가 필요하며, 이 경우 현재 경로를 여는
책임도 호출자에게 있습니다. `rail`·`filled`는 같은 링크·확장
동작에 공통 token을 적용한 표시 형태입니다. 중복 ID, 순환
구조, 대상 없는 그룹, 잘못된 현재 ID와 지원하지 않는 URL
scheme은 오류로 알립니다.

## 2026-10-02 AvatarUploader

`AvatarUploader`는 기존 `Avatar`와 `ImageCropper`를 프로필 사진의
선택·정사각형 자르기·미리보기·제거 흐름으로 묶습니다. 이름 있는
native 파일 입력은 PNG·JPEG·WebP를 받고 빈 파일과 선택적
`maxBytes` 초과를 구분해 알립니다. 자르기 전에는 앱의 원본
`src`를 유지하며, 자른 PNG는 로컬 Blob URL로 미리 봅니다.

`onImageChange`는 자른 `Blob`이나 제거를 뜻하는 `null`을
전달합니다. 호출자는 업로드·저장·실패·재시도를 소유합니다.
`src`가 바뀌면 로컬 미리보기와 제거 상태를 비웁니다. Blob URL은
교체·제거·unmount 때 해제합니다. 취소·자르기 완료·제거 뒤
파일 입력으로 focus를 돌립니다. 실제 사진이 없으면 읽을 수 있는
fallback을 표시합니다.

## 2026-10-02 Terminal

`Terminal`은 순서 있는 명령·출력·오류·안내 줄과 입력을 결합합니다.
`lines`는 호출자가 소유하며 고유한 ID와 `kind`, 문자열 `text`를
전달합니다. 실제 명령 실행, 권한 확인, 결과 저장과 실패 처리는
호출자가 맡습니다. `onCommand`는 공백만 있는 입력을 제외한 원문을
전달합니다. 호출자가 실행한 명령을 `kind: "command"` 줄로 추가하면
위·아래 방향키의 이력으로 사용됩니다. 이력 탐색 전 작성 중이던
문구는 마지막 이력에서 아래 방향키를 누르면 복원됩니다.

출력은 이름 있는 `log`에 순서대로 표시합니다. 연속 출력의 과도한
음성 발표를 피하려고 `aria-live="off"`가 기본이며 필요한 화면에서
`polite`로 바꿀 수 있습니다. 입력은 native text control과 submit
버튼을 사용합니다. `pending`은 추가 제출을 막되 입력 focus와 draft를
유지합니다. `disabled`는 입력·실행을 모두 막습니다. `panel`·`flat`은
같은 동작의 표시 형태입니다.

## 2026-10-02 NodeCanvas

`NodeCanvas`는 고정 크기 작업 영역의 노드 위치와 방향 있는 연결을
표시·편집합니다. 호출자가 `nodes`와 `edges`를 소유합니다.
`onNodesChange`는 변경된 배열과 node ID·최종 좌표·입력 방식을
전달하고, `onConnect`·`onDisconnect`는 연결 요청만 전달합니다.
저장, 노드 생성·삭제, 연결 ID 부여, 실행, 자동 배치와 권한은
호출자가 담당합니다. 콜백이 없는 편집 기능은 표시하지 않습니다.

좌표는 작업 영역의 CSS pixel 단위입니다. 노드는 176×96px이고
보이는 영역 안에 있어야 합니다. ID는 각각 고유해야 하며 연결
양끝은 서로 다른 기존 노드를 가리켜야 합니다. 작업 영역 크기는
320–5000px 정수입니다. 좌표 적용은 정수·범위 검증 후 한 번
전달합니다. 키보드는 기본 10px, Shift와 함께 1px 이동하고
pointer 이동량은 현재 zoom으로 나눕니다. 호출자가 상태를 갱신하지
않으면 위치는 원래 값으로 돌아갑니다.

`grid`·`plain`은 공통 token을 사용하는 배경 표시 형태입니다.
연결선 SVG는 장식이며, 연결 방향·label과 제거 동작은 텍스트
목록에 따로 노출합니다. zoom은 버튼으로 75–150%를 선택하고
작업 영역을 native scroll로 탐색합니다. 실제 보조기술 발표,
touch·Safari·RTL은 아직 확인하지 않았습니다.
## 2026-10-02 MarkdownEditor

`MarkdownEditor`는 게시글·문서 원문을 Markdown으로 작성하고
결과를 같은 화면에서 확인합니다. 호출자가 `value`와 `onValueChange`로 원문을
소유하며 저장·권한·서버 검증도 호출자가 담당합니다. `name`을
주면 native textarea가 form에 현재 원문을 제출합니다.

textarea는 미리보기 표시 여부와 관계없이 화면에
남습니다. 따라서 입력 focus와 form validation이 preview 전환으로
사라지지 않습니다. 미리보기는 `Markdown`이 지원하는 제목 1–3,
단층 목록, 강조, 인라인·블록 코드, 절대 HTTP(S) 링크만 렌더링합니다.
원시 HTML과 지원하지 않는 문법은 텍스트로 남깁니다. WYSIWYG,
문서 모델 변환, 이미지 업로드, 공동 편집은 이 API에 포함되지
않습니다. 별도 `RichTextEditor` 후보는 유지합니다.

label·description·error는 textarea에 연결되고 preview는 제목이
있는 region입니다. 기본 입력·붙여넣기·선택·undo는 native
textarea의 동작을 따릅니다. 별도 WYSIWYG 서식 버튼은 제공하지
않습니다.

## 2026-10-02 NotificationCenter

`NotificationCenter`는 호출자가 제공하는 `notifications`를 전달 순서로
표시합니다. 항목 ID는 고유하고 제목·시간 표시·읽음 상태가 필요합니다.
`onReadChange`와 선택적인 `onMarkAllRead`·`onOpen`은 변경 요청을
전달합니다. 저장·동기화·읽음 상태 갱신은 호출자가 맡습니다. 열기
요청만으로 읽음 상태를 바꾸지 않습니다.

전체·읽지 않음 필터는 component 내부 상태이며 읽지 않음 목록에서
항목을 읽음으로 바꾸거나 모두 읽음 처리하면 필터 버튼으로 focus를
옮깁니다. 목록이 비어 있을 때와 읽지 않은 항목이 없을 때의 안내를
구분합니다. `panel`·`plain`은 같은 동작을 공유합니다. 실제 보조기술
발화는 아직 검증하지 않았습니다.
