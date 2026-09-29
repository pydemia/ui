# 분석 작업 공간 조합 예시

2026-09-29 로컬 작업 트리에서 문서 사이트에 Operations workspace를
추가했습니다. 새 component나 registry item을 만들지 않고 기존
`AppShell`, navigation, `PageHeader`, `MetricCard`, `DataChart`,
`LogConsole`, `DataTable`, `ContentList`를 한 화면에 배치했습니다.
`PageHeader`가 제목·부제목을, `ContentList`가 bullet 목록을 담당하므로
이 목적으로 같은 역할의 component를 늘리지 않았습니다.

예시 원본은 `apps/docs/src/analytics-workspace.tsx`입니다. 기간 선택은
지표와 차트를 바꾸고, 실행 목록은 검색·상태 필터·정렬·페이지 이동·
선택을 제공합니다. 재실행 버튼은 선택된 행을 실행 중으로 바꾸고
로그와 하단 상태 문구를 갱신합니다. 서버 호출·영구 저장은 없습니다.
문서에는 preview, 원본 링크, 필요한 registry item 12개의 설치 명령을
넣었습니다. 예시 파일은 private workspace package를 import하므로
registry 소비자가 복사할 때는 설치 경로에 맞춰 import를 바꿔야 합니다.

## 확인한 내용

- `npm run typecheck`, `npm run build`, `npm run registry:check` 통과.
  마지막 검사는 86개 item과 84개 component의 export·catalog 대응을
  확인했습니다. 빌드의 문서 JS chunk는 500 kB 경고가 났습니다.
- 문서 Chromium에서 7일에서 4주로 바꾸자 완료 지표가 1,216에서
  4,842로, 차트 구간이 요일에서 주차로 바뀌었습니다.
- `이벤트` 검색은 해당 한 행만 표시했습니다. 행 선택 후 재실행은
  상태를 `실행 중`으로 바꾸고 로그 한 건과 하단 상태 문구를 추가했으며
  선택을 해제했습니다.
- 상태 `실패` 필터는 두 행을 표시했고, 초기화 후 다음 페이지는
  여섯 번째 행만 표시했습니다. 도움말 열기·닫기와 세 bullet도
  확인했습니다. dark mode 버튼 전환 후 light로 복원했습니다.

## 남은 검증

- 이 예시 파일 자체를 새 registry 소비자로 이식해 실행하지 않았습니다.
  기존 86개 item의 동시 설치·typecheck·브라우저 모듈 로딩 검사는
  `.worknotes/component-full-registry-consumer-2026-09-29.md`에 있습니다.
- 이번 예시의 좁은 화면, 실제 보조기술, touch, Chromium 외 브라우저는
  확인하지 않았습니다.
- 개발 서버에서 빌드 중 HMR이 실행되자 기존 `main.tsx`의
  `createRoot()` 중복 호출 오류가 console에 3건 남았습니다.
  재실행·필터 등 예시 상호작용은 그 뒤에도 작동했습니다.
- `docs/`는 로컬에서 다시 생성했으나 commit·push·공개 배포 여부는
  이번 작업에서 확인하지 않았습니다.

이후 390px에서 `DataTable` 열 압축을 수정했고, 개발 서버의 기존
Registry review iframe 경로와 HMR root 오류도 고쳤습니다. 새 검증
결과는 [좁은 표 기록](component-data-table-responsive-2026-09-29.md)에
있습니다.
