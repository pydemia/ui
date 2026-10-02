# NodeCanvas 작업 기록

2026-10-02 공개 기준은 122개 component·124개 registry item·
43개 snapshot, goal 관리용 추정 약 96%입니다. `NodeCanvas`는
중급 이상 workflow 화면에서 노드·연결의 위치와 편집 조작을
매번 새로 만드는 공백을 메우기 위해 선택했습니다. 기존 Kanban은
상태별 카드 이동, Gantt는 날짜·의존 일정이 책임이라 이 작업과
겹치지 않습니다.

## 구현 범위

- 원본 React·Tailwind 구현. 새 npm 의존성은 없습니다.
- 호출자 소유 노드·연결 배열, 위치 변경 callback, 연결 추가·제거
  callback을 제공합니다. 저장·실행·자동 배치·노드 생성은 앱이
  담당합니다.
- pointer 끌기, 방향키 10px·Shift+방향키 1px 이동, X·Y 숫자 입력,
  native select와 버튼을 통한 연결 추가, 텍스트 연결 목록과 제거
  버튼을 제공합니다. 같은 방향의 기존 연결은 중복 추가하지 않습니다.
- 공통 token의 `grid`·`plain` 배경과 75–150% 확대 버튼을
  제공합니다. 문서 preview는 분할·390px 화면에서도 흐름을 볼 수
  있도록 세로로 배치했습니다.

## 로컬 검증

- `npm run typecheck` 통과. UI 테스트는 변경 전 174개에서
  177개로 늘었고 `npm run test -w @pydemia/ui` 177/177 통과.
  새 테스트는 그래프 입력 거부, 빈 상태, 키보드·좌표·연결 조작을
  확인합니다. 마지막 중복 연결·빈 상태 보강 뒤 targeted 테스트
  3/3과 typecheck를 재실행했습니다.
- `npm run build` 통과. 125개 registry item과 docs 산출물을
  최종 코드로 재생성했습니다. source commit `96ab61b`의
  provenance LF SHA-256을 소비자 고지에 고정했습니다.
  `registry:check`는 125개 item·123개 export/catalog와 과거
  43개 snapshot을 확인했습니다. 44번째 snapshot
  `sha256-2ef4e9d48b58fbb25c5d3bf24236b693aa69d07d9f3b7f1dcfd69ec805958be3`를
  만들고 재빌드 뒤 `registry:release-check`에서 현재 빌드와
  일치함을 확인했습니다.
- 로컬 Chromium에서 preview·Usage, 방향키 이동,
  125% 확대 뒤 pointer 끌기, 390px dark 배치, 연결 조작 요소를
  확인했습니다. pointer 이동 뒤 live 상태 문구가 덮이는 문제를
  수정하고 390px에서 X 72→102, Y 28→58과 이동 문구를
  재확인했습니다. 브라우저 오류는 없었습니다.
- axe-core scope 검사에서 위반 0건, 축소 기호의 색 대비 자동 판정
  보류 1건입니다. 실제 screen reader·touch·Safari·RTL은
  검사하지 않았습니다.

## 공급 상태

public export·registry metadata·문서 preview·Usage를 추가했습니다.
PR CI, 공개 배포·item URL은 아직 확인하지 않았습니다. 따라서 공개
component 수와 goal 추정 약 96%는 유지합니다.
