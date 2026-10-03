# RadarChart 작업 기록

## 병합·공개 상태

PR #129를 `main`에 병합했습니다. PR Verify UI run `37094949389`,
병합 commit `704cd454369840959e5e2cd0b4eedd23a09962c7`의
Verify UI run `37095168316`과 Pages run `37095167845`가
통과했습니다. Vercel은 build rate limit로 실패했습니다. 공개
`ui.pydemia.ai`의 `pyd-radar-chart.json`과 72번째 manifest는
HTTP 404입니다. 공개 확인은 140개 component·142개 item이고,
저장소에는 141개·143개와 72개 snapshot이 있습니다. 배포 제한이
풀린 뒤 production 배포, 현재 item과 manifest·snapshot item의
접근을 확인해야 합니다. Goal 관리용 추정은 약 98%입니다.

이번 PR의 변경 파일 342개 중 새 snapshot의 두 복사본이 288개
(각각 manifest 1개와 item 143개)입니다. 생성·저장 비용이며
component의 품질 점수로 계산하지 않습니다.

## 범위와 판정

동일 척도의 여러 평가 차원을 계열별로 비교하는 원본 component를
`@pydemia/ui`와 내부 registry에 추가합니다. `DataChart`의 범주별
시계열이나 `ScatterChart`의 두 연속 수치와 입력 구조가 다릅니다.
차원은 최소 세 개이며, 0과 `null`을 구분합니다. `null`을 사이에 둔
선은 연결하지 않고 채움도 적용하지 않습니다. 정확한 값은 표에
표시합니다. 새 npm 의존성이나 외부 코드 편입은 없습니다.

## 현재 검증

- `npm run build -w @pydemia/ui`: 통과.
- `node --test packages/ui/tests/radar-chart.test.mjs`: 4/4 통과.
- `npm run typecheck`: 통과.
- `npm run test -w @pydemia/ui`: 255/255 통과.
- `npm run build`: 통과. 143개 registry item 생성.
- `npm run prism:check`: 23/23 통과.
- 로컬 Chromium: 390px에서 chart·표·Usage와 디자인 전환을 확인.
  일부 미수집에서 해당 계열의 채움 다각형 0개, 인접 구간 선 3개,
  표의 `데이터 없음`, 문서 가로 넘침 0, page error 0건을 확인.
- `npm run registry:release-check`: 143개 item·141개 export/catalog와
  72개 불변 snapshot, 현재 registry 일치 검사 통과.

첫 `registry:check`는 provenance 고지가 이전 commit을 가리켜
실패했습니다. source commit `9d5d0b3198a6d3162b2512c03274903ca5cbe8cd`와
SHA-256을 고지에 고정한 뒤 재실행해 통과했습니다. 72번째 snapshot은
`sha256-20c21ec393c800ad995dca9c302e79fc9c1dfe71d3b953648cc7e9c1710e2625`입니다.
이 단계에서는 PR CI와 공개 URL, 실제 screen reader·touch·Safari
동작을 확인하지 않았습니다. 후속 상태는 위에 기록했습니다.
