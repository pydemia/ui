# 관리 목록·보조 패널 확장

2026-09-29 로컬 작업 트리. 관리 목록에서 검색·상태 필터·정렬·페이지
이동·여러 행 선택·작업 실행을 한 화면에서 끝내는 용례와, 좁은 화면에서
상세 정보를 가장자리 패널로 여는 용례를 기준으로 선정했습니다.
기존 `Table`, `Checkbox`, `Dialog`, `Button`, `NativeSelect`와의
중복을 확인한 뒤 각 항목이 소유할 동작만 추가했습니다. 현재 50개
component, 52개 registry item입니다.

## 설계와 출처

- `Pagination`은 1부터 시작하는 controlled 페이지를 받습니다. 0건은
  `0–0 / 0건`, `1 / 1`로 표시하고 양쪽 이동을 막습니다. 전체 건수
  변경으로 전달된 페이지가 범위를 벗어나면 화면에는 마지막 유효
  페이지를 표시합니다. 페이지 크기 변경 시 `onPageSizeChange`와
  `onPageChange(1)`을 호출합니다.
- `DataTable`은 전달된 전체 배열에서만 검색·필터·정렬·페이지 상태를
  계산합니다. 행 ID는 `getRowId`로 받아 선택을 정렬·필터·페이지
  이동 사이에 유지합니다. 행 배열에서 사라진 ID는 선택에서 제거합니다.
  선택 작업은 `renderActions`에 현재 데이터의 선택 행과 선택 해제 함수를
  전달합니다. 서버 요청·전체 건수·저장 결과는 사용처가 맡습니다.
  sortable 열은 원래 입력 순서를 동률의 보조 순서로 사용합니다.
  결측 정렬 값은 양방향 모두 마지막에 둡니다.
- `Drawer`는 기존 `@radix-ui/react-dialog@1.1.23` 위에서 왼쪽·오른쪽·
  아래쪽 panel 위치만 제공합니다. 제목·설명·닫기 control은 사용처가
  명시합니다. modal focus와 Escape, 열기 버튼 focus 복귀는 Dialog가
  담당합니다.

세 wrapper와 state 구현은 이 저장소의 원본 코드입니다. 새 npm
dependency는 없습니다. [WAI sortable table 예시](https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/)의
native table, header button, `aria-sort` 규칙과
[modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)을
참고했습니다. [Radix Dialog 공식 문서](https://www.radix-ui.com/primitives/docs/components/dialog),
설치된 1.1.23 release의 `dist/index.mjs`, manifest와 MIT LICENSE를
직접 확인했습니다. 공식 웹 문서에는 1.1.20으로 표기되어 있으므로
실제 의존성의 버전과 섞어 기록하지 않았습니다. 구현 출처와 reference는
`registry/provenance.json`에 구분했습니다.

## 실행한 검사

- `npm run typecheck`, `npm run build`, `npm run registry:check` 통과.
  기본 게시 URL로 52개 JSON을 생성했습니다.
- 문서 브라우저에서 DataTable 페이지 이동 후 다른 페이지의 선택 유지,
  검색, 상태 필터의 빈 결과, `aria-sort="ascending"`, 선택 항목 보관과
  행 제거를 확인했습니다. 마지막 페이지의 3개 행을 보관했을 때
  `1 / 1`로 돌아가는 회귀 사례도 확인했습니다. 헤더·행 체크박스의
  접근성 이름을 확인했습니다.
- Pagination은 다음 페이지의 범위, 페이지 크기 변경 후 첫 페이지,
  0건에서 양쪽 버튼 disabled를 확인했습니다.
- Drawer는 오른쪽 패널의 Enter 열기, Escape 닫기와 focus 복귀,
  아래 패널의 표시와 닫기 버튼을 확인했습니다.
- 390px viewport에서 오른쪽 Drawer의 폭은 358px이고 문서의 가로
  overflow는 없었습니다. DataTable도 315px 영역에 표시되고 문서
  가로 overflow가 없음을 확인했습니다. viewport 설정은 복원했습니다.
- 기존 Vite 소비자 fixture에 세 새 registry item을 로컬 URL로
  `shadcn add`했습니다. 8개 파일이 생성되고 동일한 `utils.ts`는
  건너뛰었습니다. 세 component를 import·render하는 fixture의
  typecheck와 production build가 통과했습니다.

처음 소비자 설치를 시도했을 때 생성 JSON이 기본 공개 URL을 참조해
게시되지 않은 `pyd-pagination`을 찾지 못했습니다. 로컬 URL로 registry를
다시 생성한 뒤 설치했고, 마지막에는 기본 게시 URL로 재빌드했습니다.

## 남은 확인

- 실제 screen reader의 표 머리글·정렬 발표와 modal 읽기 순서는
  확인하지 않았습니다.
- Drawer의 긴 내용, 다량 행 성능, 데이터가 바뀔 때 외부 저장 작업의
  결과는 별도 사용처에서 확인해야 합니다.
- 소비자 검사는 기존 fixture에 추가 설치했습니다. 새 프로젝트의
  전체 item 처음부터 설치와 원격 배포는 아직 확인하지 않았습니다.
