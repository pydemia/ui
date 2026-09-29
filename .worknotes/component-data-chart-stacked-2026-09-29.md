# DataChart 누적 막대 작업

2026-09-29. Analytics 화면에서 범주별 구성과 합계를 동시에 볼 수
있도록 기존 `DataChart`에 `stacked-bar` variant를 추가했습니다.
컴포넌트·registry item 총수는 76개·78개로 같습니다.

## 구현

- 같은 범주의 양수·음수를 0축 양쪽에 따로 쌓습니다.
- 축 범위는 개별 값이 아닌 범주별 양수·음수 합계를 사용합니다.
- `null`은 도형에서 건너뛰고 데이터 표에는 `데이터 없음`으로 남깁니다.
- 0은 표에 남기고 높이 0인 막대는 그리지 않습니다.
- 합계 overflow와 알 수 없는 variant는 `RangeError`로 거부합니다.
- 계열 수에 따라 누적 막대의 차트 폭이 늘어나지 않게 했습니다.
- 문서 preview·사용 코드에 누적 막대를 추가했습니다.

기존 프로젝트 소유 SVG 차트를 확장했으며 새 npm dependency,
외부 component source, 별도 LICENSE는 없습니다. Registry와
provenance의 기존 `pyd-data-chart` metadata를 유지합니다.

## 검증 상태

- `npm run typecheck`: 통과.
- `npm test -w @pydemia/ui`: 3개 회귀 검사 통과. 양수·음수 stack,
  결측값, overflow·알 수 없는 variant, 빈 상태를 확인했습니다.
- 문서 Chromium: 누적 막대의 계열·범주별 도형, 결측값 표, 빈 상태와
  dark token을 확인했습니다.
- `npm run build`, `npm run registry:check`: 통과. 78개 registry item의
  생성·provenance 정합성을 확인했습니다.
- 새 소비자 fixture에서 로컬 `shadcn add`로 chart·utils·tokens
  3개 파일을 설치했습니다. 설치 chart source가 저장소 원본과 같습니다.
- 소비자 typecheck·build·Chromium: 통과. 양수·음수 누적 도형과
  `null`을 구분하는 데이터 표, console error 0건을 확인했습니다.
- 소비자 runtime `npm audit --omit=dev --audit-level=high`: 0건.
- 실제 screen reader 발표, 다른 브라우저, 모바일 viewport 및
  공개 배포: 미검증.

임시 소비자 경로:
`C:\Users\pydemia\AppData\Local\Temp\pydemia-ui-data-chart-stacked-consumer-20260929`.
