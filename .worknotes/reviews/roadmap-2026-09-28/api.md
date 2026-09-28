# Component API·접근성 관점 독립 검토

## 검토 범위와 입력

`input/`의 고정 복사본을 대상으로 `component-roadmap.md` 전체,
handoff 전체, `source-inventory.md` 전체, `verification.md` 전체,
`index.ts`, `registry.json`, 복사된 컴포넌트 소스 11개를 읽었습니다.
다른 reviewer의 보고서는 읽지 않았습니다. 관점은 컴포넌트별 의미·상태·
상호작용 규칙, 조합 경계, 구현 순서, 접근성 의무입니다. 아래 지적은
문서와 코드의 정적 검토이며 새 런타임 검증 결과가 아닙니다.

입력 식별용 SHA-256은 `component-roadmap.md`
`9424ad06af107433714de290110e9053b29dbadddee750e4380868d063f8aba7`,
handoff `1c0f7c9f6eae6aaf2398c8da358289ff8acab50be088fe62f960f252b408c258`,
`source-inventory.md`
`6f99dab1a2e8a117c0f76e741deb0e494c621b0dcfe9f3a66c1c85f2a989975b`,
`verification.md`
`e0966698d7398eb9d9d8c1578b32cfe0ae2e8faa679d16f071702f237ec52b7e`,
`index.ts` `0f08b836ac79294256e5a0c949353ab2bb27d5a98e91416db9a0a11bb63b8d36`
입니다. 나머지 읽은 파일의 SHA-256은 다음과 같습니다. 파일 경로는
아래에서 모두 `input/` 기준입니다. 원문은 이 snapshot에 보존되어
있습니다.

| 파일 | SHA-256 |
| --- | --- |
| `registry.json` | `b9944880fa51a8e0c793844fa87f4dd6e29a975c3c8d16c385d96dc4186a7d32` |
| `affixed-input.tsx` | `a6b41558f9f98aef15280e560416af765f3403be886adda095868b5f8949d90e` |
| `badge.tsx` | `d14db040ee085571ff1882d063f02511366a53cff84ea156a049a03cb0ca8074` |
| `button.tsx` | `9166cf9ebe34244e0203ed5065a0cf157b8b1e54e5026224a386b2b4cf5748b4` |
| `calendar.tsx` | `b62e01bc77539c1bc2abd675a67f66aa995fd1b370e5fa760e1c14914ca1cec5` |
| `dropzone.tsx` | `46d6eafa650d621e2f036404dcb9ceca57f55551ce5e33b48df37ed1b9167a81` |
| `empty.tsx` | `38a66395b54d31c850d2adf7d55e8b53edea82ee6843b8f11f0cace5bfde4778` |
| `metric-card.tsx` | `cf17c8ba72f2c2c7d7912dca52e18d3265318ed8466d6126017951a54c408899` |
| `progress.tsx` | `6ff1fbba905237cfdc3f409f4ebacd0cc8382005f26a2c5d6dbc19b586777d21` |
| `slider.tsx` | `03ec9b0044aa1b015338250eedbce5526d6d6deee4807f5335dcd2f02b01738e` |
| `snippet.tsx` | `b0ccc9c41ee7ca6f849f769cb08c1487972381eabc2a1f4d9175afca9ee22040` |
| `table.tsx` | `81210518fb04c92f074e2af1d63aa33913dd3c587b644ebf5786685c9b29d49d` |

## 지적

### API-01 · design prerequisite · `Field`와 자체 label을 가진 control의 연결 규칙

- **유형·근거:** 빠진 조합 규칙입니다. `research/component-roadmap.md:44-51`
  은 `Field`를 입력 control과 연결한 다음 선택·검색·다중 선택 control을
  배치하고, `:153-155`는 각 컴포넌트의 값과 focus 규칙을 정하도록 합니다.
  현재 `packages/ui/src/components/affixed-input.tsx:6-8,24-36`은
  자체 label과 input ID를 갖고, `dropzone.tsx:6-8,61-80`도 label을
  필수로 받습니다. `slider.tsx:5-7,43-50`은 accessible name을
  thumb에 직접 붙입니다.
- **실패 조건:** 공통 `Field`가 label·설명·오류를 props로 전달하는
  방식만 제공하면, 자체 label을 가진 control에는 이름이 중복되거나
  오류 설명이 실제 focus 대상에 연결되지 않을 수 있습니다. 복합
  `Select`·`Combobox`의 trigger와 form 값 연결도 native `input`과
  같다고 가정하면 실제 조합 화면에서 어긋날 수 있습니다. 아직
  `Field` 구현이 없으므로 이는 발생 확인이 아닌 설계 위험입니다.
- **기존 보호 장치:** 로드맵 `:149-155,160-163`은 의미·접근성 검토와
  조합 화면에서의 오류·focus 확인을 요구합니다. handoff
  `.worknotes/shadcn-component-library-handoff.md:217-239`에도 이름·설명·
  focus 명세 항목이 있습니다. 다만 어떤 control이 label을 소유하고
  오류 ID를 focus 대상에 전달하는지는 아직 정하지 않았습니다.
- **최소 변경:** A1 착수 전에 `Field` 연결 표를 한 장으로 정합니다.
  native 입력, 자체 label을 가진 기존 control, trigger 기반 선택기마다
  label 소유자, `id`/`htmlFor` 또는 `aria-labelledby`, 설명·오류 ID,
  `aria-invalid`, form 값 전달 경로를 명시합니다. 기존 control을 모두
  `Field`로 감싸도록 강제할 필요는 없습니다.
- **수용 사례:** `Field`와 `Input`·`Select`·`Combobox` 조합 및 기존
  `AffixedInput`·`Dropzone` 사용 예에서 focus 대상마다 이름이 하나로
  읽히고, 오류가 그 대상에 연결되며, 제출 값과 오류 focus가 일치합니다.

### API-02 · design prerequisite · 날짜 값의 의미를 A1에서 고정해야 함

- **유형·근거:** 단계 사이의 빠진 값 규칙입니다. `DatePicker`는 A1
  (`research/component-roadmap.md:59,133`), `DateRangePicker`는 A4
  (`:60,136`), `TimePicker`·`DateTimePicker`는 B (`:73-74`)에
  배치됩니다. 기존 `Calendar`는 `DayPicker` props를 그대로 노출하는
  래퍼입니다 (`packages/ui/src/components/calendar.tsx:1-15,59-64`).
  검증 기록 `research/verification.md:111,118`은 단일 날짜 선택만
  관찰했고 범위·시간대·RTL은 미검증으로 둡니다.
- **실패 조건:** A1의 날짜 입력이 반환하는 값이 달력 날짜인지 특정
  시간대의 시각인지 불명확한 상태에서 A4/B가 구현되면, 동일한 선택을
  form 저장·재표시·날짜 범위·시간 선택에 넘길 때 날짜 경계나
  비어 있는 값을 서로 다르게 해석할 수 있습니다. 실제 오차가
  발생했다는 증거는 없습니다.
- **기존 보호 장치:** 로드맵 `:153-155`는 controlled/uncontrolled,
  locale·RTL을 정하도록 하고 `DateTimePicker` 설명에는 시간대가
  포함됩니다. 그러나 최초 public 날짜 API인 `DatePicker`의 값 형태,
  빈 값, 직렬화, 달력 날짜와 시각의 경계는 명시하지 않습니다.
- **최소 변경:** A1 명세에서 단일 날짜 값·빈 값·변경 이벤트·form
  직렬화와 시간대 처리 원칙을 정하고, A4의 범위 및 B의 날짜·시간
  조합이 그 값을 어떻게 재사용하는지만 연결합니다. 구현 기술 선택은
  각 단계에 남겨도 됩니다.
- **수용 사례:** 서로 다른 시간대에서 같은 달력 날짜를 선택해
  제출·재표시해도 선택한 날짜가 유지됩니다. 빈 값과 시작일만 고른
  범위를 구별하며, `DateTimePicker`가 시간을 붙일 때 적용한
  시간대를 API와 예시에서 확인할 수 있습니다.

### API-03 · design prerequisite · `Pagination`과 `DataTable`의 상태 연결

- **유형·근거:** 선행 컴포넌트의 API 결정이 후행 조합에 미치는
  조건이 빠졌습니다. `Pagination`은 A3에서 전체 건수·현재 페이지를
  다루고 (`research/component-roadmap.md:56,135`), `DataTable`은 A4에서
  정렬·필터·선택·페이지 상태를 다룹니다 (`:58,136`). 기존 `Table`은
  HTML table 셸입니다 (`packages/ui/src/components/table.tsx:4-27`).
  로드맵 `:165-167`은 서버 요청의 소유자를 앱으로 분리합니다.
- **실패 조건:** 필터로 총 페이지가 줄었는데 기존 페이지 번호를
  유지하거나, 정렬·페이지 이동 뒤 선택 상태를 행 위치로 추적하면
  빈 페이지 또는 다른 행에 대한 일괄 action이 나타날 수 있습니다.
  `Pagination`의 페이지 번호 기준과 `DataTable`의 내부 상태 기준이
  다르면 A3 API 확정 후 A4에서 변환 코드가 반복됩니다.
- **기존 보호 장치:** 로드맵 `:143-147,165-167`은 의존성과 상태
  소유를 이미 인식하고 있고, 각 묶음의 실제 소비자 조합을 검사합니다.
  행 식별자, 필터 후 페이지 처리, 선택 유지 범위까지 정한 것은
  아닙니다.
- **최소 변경:** A3의 `Pagination` API를 확정하기 전에 페이지
  번호 기준·총 건수 0·페이지 크기 변경·범위 밖 페이지의 처리
  규칙을 `DataTable` 예시 상태와 함께 적습니다. A4에서는 안정적인
  행 ID와 정렬·필터·페이지 변경 시 선택 유지 범위를 정합니다.
- **수용 사례:** 여러 페이지의 행을 정렬하고 필터가 결과를 한
  페이지로 줄여도 유효한 페이지를 표시합니다. 선택 상태는 정의한
  범위에서 같은 행 ID를 가리키며, 서버 데이터를 쓰는 예시는
  앱이 요청을 시작하고 결과를 반영하는 흐름을 보여 줍니다.

### API-04 · implementation validation · `Dropzone` 선택 상태와 `FileUpload` 전송 상태

- **유형·근거:** 기존 상태 소유와 새 상태 소유의 조건부 충돌입니다.
  `FileUpload`는 `Dropzone`에 진행·실패·재시도를 연결합니다
  (`research/component-roadmap.md:61,146-147`). 현재 `Dropzone`은
  자체 `names`/`error` 상태를 저장하고 (`packages/ui/src/components/
  dropzone.tsx:29-55`), 선택 파일 이름을 `role="status"`로 표시합니다
  (`:80-85`). 업로드 전송은 담당하지 않는다고 source inventory
  `research/source-inventory.md:198-207,221-224`에 적혀 있습니다.
- **실패 조건:** 앱에서 전송에 실패하거나 취소했는데 `Dropzone`의
  이전 선택 이름이 계속 성공에 가까운 상태로 발표될 수 있습니다.
  같은 파일 재선택·재시도와 선택 거부 오류가 업로드 오류와 섞이면
  사용자가 지금의 파일 상태를 판단하기 어렵습니다. 실제 조합
  실행은 아직 없습니다.
- **기존 보호 장치:** 로드맵은 서버 전송을 앱 함수에 맡기고 오류·취소
  상태를 명시하며, `Dropzone`의 실제 drag와 거부 경로는 선행
  재검사 대상으로 적었습니다 (`:23-25,146-147`). 검증 기록
  `research/verification.md:113,117`도 실제 drag와 크기·개수 거부가
  미검증임을 구분합니다.
- **최소 변경:** A4의 조합 명세에서 선택·검증 상태는 `Dropzone`,
  전송 시도·진행·실패·취소·재시도 상태는 `FileUpload` 또는 앱 중
  누가 소유하는지 표시합니다. 선택 목록의 재설정/갱신 경로와
  발표할 상태의 우선순위를 정합니다.
- **수용 사례:** 한 파일을 선택해 전송 실패 후 재시도하고 취소하는
  동안 파일 이름과 현재 상태가 모순 없이 표시·발표됩니다. 같은
  파일 재선택과 형식·크기 거부도 각각 한 번의 명확한 결과를 냅니다.

### API-05 · design prerequisite · 자동 재생 `Carousel`의 중지 동작

- **유형·근거:** 접근성 상호작용 규칙의 누락입니다. C 후보의
  `Carousel` 설명은 이전·다음·위치와 자동 재생 정책만 적습니다
  (`research/component-roadmap.md:103`). 공통 완료 조건에는 keyboard·
  focus·이름/상태 검사가 있습니다 (`:153-161`). W3C의
  [Carousel Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/)은
  자동 회전 시 중지·재시작 제어와 focus/hover 진입 시 중지를
  명시합니다.
- **실패 조건:** 자동 재생을 켠 사용자가 슬라이드 안의 링크를
  읽거나 조작하는 중 콘텐츠가 바뀌면 현재 위치와 focus의 맥락을
  잃을 수 있습니다. 현재 구현은 없으므로 예상 실패 조건입니다.
- **기존 보호 장치:** handoff `.worknotes/shadcn-component-library-handoff.md:
  217-240,430-447`은 reduced motion, keyboard, focus를 계약·QA
  항목으로 요구합니다. 로드맵에는 자동 재생을 중지하는 구체적인
  제어·재시작 조건이 아직 없습니다.
- **최소 변경:** C의 `Carousel` 한 줄에 자동 재생 기본값, 사용자
  중지·재시작 제어, focus/hover 시 중지와 재시작 조건, 숨긴
  슬라이드의 focus 처리 기준을 명시합니다.
- **수용 사례:** 자동 재생 중 Tab으로 진입하거나 hover하면 회전이
  멈추고, 사용자가 명시적으로 재시작하기 전에는 focus가 떠나도
  예기치 않게 회전하지 않습니다. 숨긴 슬라이드의 링크로 focus가
  이동하지 않습니다.

### API-06 · implementation validation · `Stat`와 기존 `MetricCard`의 경계

- **유형·근거:** 후보 중복 가능성입니다. C의 `Stat`는 수치·단위·
  변화량의 표시라고 정의됩니다 (`research/component-roadmap.md:100`).
  기존 `MetricCard`는 label·value·change·detail을 받고 Card에
  표시합니다 (`packages/ui/src/components/metric-card.tsx:5-10,20-36`).
- **실패 조건:** 동일한 수치와 변화량에 `Stat`·`MetricCard`가 각각
  별도 props와 표시 규칙을 제공하면 소비자마다 단위·변화 문구가
  달라질 수 있습니다. 반대로 밀집된 표·toolbar 안에 필요한
  표현을 Card로만 강제하면 소비자가 Card를 분해해야 합니다.
- **기존 보호 장치:** 로드맵 `:11-13,149-150,183-187`과 handoff
  `.worknotes/shadcn-component-library-handoff.md:199-215`는 독립
  의미·상태가 없으면 variant·slot·조합을 우선하도록 합니다.
  따라서 현재의 후보 기재만으로 중복이 확정된 것은 아닙니다.
- **최소 변경:** C 착수 시 card 바깥의 실제 반복 용례와
  `MetricCard` 조합으로 해결되는 범위를 먼저 기록합니다. 독립된
  의미·상태가 확인될 때만 `Stat` API를 추가하고, 아니면 기존
  컴포넌트의 표현 조합으로 처리합니다.
- **수용 사례:** 같은 수치를 card와 밀집된 데이터 행에 표시하는
  소비자 예시에서 무엇을 재사용하는지 설명할 수 있고, 공통
  단위·변화 표기가 서로 다른 API 때문에 갈라지지 않습니다.

## 제외한 주요 의심과 미검토

- `ToggleGroup`과 `SegmentedControl`을 개수 채우기용 중복으로
  판단하지 않았습니다. 로드맵 `:68-69`은 눌림 상태의 단일·다중
  선택과 상호 배타적 form 값을 다르게 명시합니다. 실제 API의
  구분은 B 구현 때 확인해야 합니다.
- `DatePicker`를 단순 `Calendar` 중복으로 판단하지 않았습니다.
  로드맵 `:59,143-145`은 기존 `Calendar`·`Popover`의 입력 조합을
  분명히 적습니다.
- `DataTable`이 서버 요청을 직접 수행할 계획이라고 판단하지
  않았습니다. 로드맵 `:165-167`이 그 책임을 앱에 둡니다.
- `CopyButton`을 기존 `SnippetCopyButton`과 즉시 합쳐야 한다고
  판단하지 않았습니다. 로드맵 `:113`은 Snippet 바깥의 사용을
  이유로 들고, 현재 버튼은 `Snippet`의 값과 알림 문구에 묶여
  있습니다 (`packages/ui/src/components/snippet.tsx:27-53`).
- 복사본에 포함되지 않은 `Message`·`PromptInput` 등 기존 35개
  소스 전부, 소비자 프로젝트의 호출 코드, tests, 미배포 원격
  registry 동작은 읽거나 실행하지 않았습니다. `verification.md`에
  기재된 과거 검사 결과는 기록으로만 취급했고 재실행하지 않았습니다.
