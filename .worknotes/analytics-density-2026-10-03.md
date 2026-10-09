# 분석 화면 밀도 선택 — 2026-10-03

## 병합과 공개 공급

PR #154를 `main`의 `82b760b7`로 병합했습니다. PR과 `main`의
Verify UI, `main`의 Pages가 성공했습니다. Vercel production
`dpl_6wGv37rruAJexW3ajVAZU2cqo8t3`가 READY입니다.
사용자 도메인의 82번째 manifest와 `pyd-dashboard`,
`pyd-log-console`, `pyd-log-viewer` snapshot item이 HTTP 200이며
저장소 파일과 일치합니다. 현재 `pyd-dashboard` item도 HTTP 200입니다.
공개 preview에서 조밀한 Dashboard의 바깥 간격 12px과 내부 grid
간격 8px을 확인했습니다. component·item 수는 144·146으로 같고
Goal 관리용 추정은 약 99%입니다.

`Dashboard`, `LogConsole`, `LogViewer`에 `comfortable`(기본값)와
`compact`를 추가했습니다. 기존 144개 component·146개 registry item의
종류나 설치 경로는 바뀌지 않습니다. 분석 화면에서 지표와 패널,
로그 행의 정보 밀도를 선택하는 사용처를 해결합니다.

`Dashboard`는 공통 space token으로 영역과 하위 grid의 간격을
조절합니다. 하위 component를 단독으로 쓸 때는 기존 간격을
유지합니다. `LogViewer`는 도구 영역과 내부 `LogConsole`에 같은
밀도를 전달합니다. 검색·수준 필터·따라가기와 로그의 이름·역할은
그대로입니다. 문서의 세 preview에 밀도 전환을 넣고 Usage에
조밀한 예를 기록했습니다.

## 검증 상태

- 확인: `npm run typecheck`, 대상 테스트 3/3, UI 전체 테스트
  278/278, `npm run build`, `npm run registry:release-check`.
  82번째 snapshot은
  `sha256-02911953c811f2fdfe43e966c6c347eddb6e83f67797f9648ce046553baff560`입니다.
- 확인: 로컬 Chromium의 `Dashboard` 기본·조밀 간격은 바깥
  24→12px, 지표·패널 grid 16→8px입니다. `LogViewer`는 header
  여백 8/12→4/8px, 로그 여백 12→8px, 행 상하 4→2px으로
  바뀌고 내부 로그에 밀도를 전달합니다. 조밀한 상태에서 검색 결과
  1/3건과 해당 로그 한 줄을 확인했습니다. `LogConsole` preview의
  이름·밀도·안쪽 여백·행 간격도 확인했습니다.
- 미검증: 실제 screen reader·touch·Safari·RTL. 설치 형식·target·
  의존 경로가 같아 격리 소비자 설치는 다시 실행하지 않았습니다.

[적용 기준](quality-gate-level-review-2026-10-03.md)에 따라 바뀐
배치와 로그 조작만 수동 확인합니다. 설치 형식·target·의존 경로가
같아 격리 소비자 설치를 반복하지 않습니다. 외부 코드 편입도 없어
새 upstream LICENSE 조사를 요구하지 않습니다. Goal 관리용 추정은
약 99%입니다.
