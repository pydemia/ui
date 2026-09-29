# 분석 화면 필터 적용

2026-09-29. `DataTable`은 자체 검색과 단일 선택 필터를 갖지만 차트·표에
같은 조건을 적용하거나 날짜 범위를 함께 쓰는 화면에서는 입력·적용·
초기화와 현재 적용된 조건을 소비자마다 조합해야 합니다. `FilterBar`는
기존 `Field`, `Input`, `NativeSelect`, `DateRangePicker` 등을 자식으로
받고 이름 있는 form, 적용·초기화 동작, 적용 상태와 조건 목록을
제공합니다. 실제 데이터 필터링과 draft/applied 값은 소비자가 소유합니다.

`onApply`는 form의 `FormData`를 전달하고 기본 제출을 막습니다.
`onClear`는 소비자 상태를 초기화하며 native form도 reset합니다.
`dirty`가 false면 중복 적용을 막고 `pending` 중에는 두 action을
비활성화합니다. bar·panel 표현을 제공합니다. 적용된 조건의 ID·
label·value는 비어 있거나 중복될 수 없습니다.

[W3C WAI-ARIA APG Landmark Regions](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/)에서
이름이 있는 HTML form의 landmark 동작을 확인했고,
[W3C Form Labels](https://www.w3.org/WAI/tutorials/forms/labels/)에서
각 입력의 label 연결 필요성을 확인했습니다. 구현은 저장소 원본이며
기존 Button·utils만 사용합니다. 새 외부 runtime dependency는 없습니다.

## 검증

`npm run typecheck`, `npm run build`, `npm run registry:check`가 통과했고
기본 공개 URL의 registry item 69개를 생성했습니다. server render에서
pending 상태와 공백 label·빈/중복 조건 ID를 검사했습니다.

로컬 문서 preview에서 검색어 Enter 제출, 상태 선택 후 미적용 표시,
복합 조건 적용과 초기화, bar·panel 표현을 확인했습니다. 새 Vite 소비자
프로젝트에 `shadcn add`로 FilterBar·Field·Input·NativeSelect·token을
설치했습니다. 설치본의 typecheck·build, 검색·상태 적용과 결과 변경,
키보드 초기화가 통과했습니다. runtime `npm audit --omit=dev`는 0건입니다.
전체 빌드 후 registry JSON에 로컬 URL이 남지 않은 것도 확인했습니다.

실제 screen reader·touch·RTL·대량 조건과 전체 item의 새 프로젝트 설치,
공개 배포는 확인하지 않았습니다.
