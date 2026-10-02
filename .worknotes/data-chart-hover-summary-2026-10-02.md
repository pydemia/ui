# DataChart 포인터 구간 요약

## 공개 확인

PR #92를 병합한 commit `893ab26`의 Verify UI run
`36994339617`과 Pages run `36994339072`가 성공했습니다. PR의
Verify UI run `36994087333`도 성공했습니다. Vercel production
`dpl_B4zzBiPkxYyCkFmbJiZg6bzQL9Uy`는 READY이며
`ui.pydemia.ai` alias가 연결됐습니다. 공개 DataChart preview에서
포인터 요약을 켜고 목요일의 `데이터 없음` 표시와 Usage를 확인했고
console error는 0건입니다. 현재 `pyd-data-chart` item과 50번째
snapshot의 manifest·chart item URL은 HTTP 200입니다. manifest는
127개 item을 기록하고 현재 item에는 `hoverSummary`가 포함됩니다.

공개 기준은 125개 component·127개 item·50개 snapshot입니다.
Goal 관리용 추정은 약 97%입니다. 실제 screen reader·touch·Safari·
RTL은 실행하지 않았습니다.

로컬 구현 당시 공개 기준은 125개 component·127개 registry item·49개
snapshot입니다. 이번 변경은 기존 `DataChart`의 표시 선택이므로 수량을
늘리지 않습니다. Goal 관리용 추정은 약 97%를 유지합니다.

## 판정과 구현

기존 `inspectable`은 native 구간 선택기와 정확한 값 패널을 제공하지만
그래프를 훑는 동안 시선을 아래로 옮겨야 합니다. `ChartTooltip`을 별도
component로 만들지 않고 `DataChart`에 기본값 `false`인
`hoverSummary`를 추가했습니다. 사용하려면 `inspectable`이 필요합니다.
mouse·pen이 범주 영역에 들어오면 그래프 위에 보이는 계열의 값과
누적 영역의 합계를 표시합니다. `null`은 `데이터 없음`이며 선택형
범례의 숨김 상태가 요약과 합계에 반영됩니다. 패널은 시각적 중복
표시로 `aria-hidden`이고 native 선택기·데이터 표를 유지합니다.

390px 가로 스크롤에서 처음에는 패널의 좌표가 왼쪽으로 밀렸습니다.
scroller의 `scrollLeft`를 더해 화면 안에 두도록 수정했습니다. 포인터가
차트를 벗어나거나 차트가 스크롤되거나 Escape를 누르면 닫습니다.
새 npm 의존성과 외부 구현 코드는 없습니다. 기존 provenance의 source·
license·의존성·접근성 설명은 변경 뒤에도 정확합니다.

## 로컬 확인

- `npm run typecheck`: 통과.
- `node --test packages/ui/tests/data-chart.test.mjs`: 12/12 통과.
- `npm run build`: 통과. 문서와 127개 registry item 생성.
- `npm run registry:snapshot`: 50번째 snapshot
  `sha256-e0293a75171845edf2ae2579c84a9eb7f5d67e9bd9fff725d905dcefe9f0fb0b`
  생성.
- `npm run registry:release-check`: 50개 snapshot과 현재 build 일치.
- 로컬 Chromium: 단일 계열 결측 구간, 누적 영역 8+4=12와
  19+5=24, 결측 합계, 범례에서 완료를 숨긴 뒤 대기 7·합계 7,
  native 선택기의 값 변경을 확인했습니다. Escape·pointer leave로
  닫히고 팝업 위에 포인터를 둔 동안 유지됩니다. 390px에서 마지막
  구간의 패널 경계가 차트의 보이는 영역 안에 있으며 dark 표시와
  console error 0건을 확인했습니다.

로컬 검증 당시 PR CI·공개 배포·공개 URL은 확인 전이었습니다. 실제 screen
reader·touch·Safari·RTL과 별도 소비자 설치는 실행하지 않았습니다.
기존 설치 경로를 변경하지 않아 별도 소비자 재설치는 이번 릴리스의
필수 조건으로 적용하지 않습니다.
