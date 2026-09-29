# 차트·대시보드·알림 확장

2026-09-29 로컬 작업 트리. 제품의 주간 지표 화면에서 수치, 추세,
실행 로그와 결과 알림을 한 화면에 배치할 수 있게 하는 작업입니다.
계획·설계·구현·검증 단계에는 `skills.pydemia.ai`의
`product-ui-ux-design`, `web-publishing`, `frontend-development`,
`software-engineering` 설명과 저장소의 기존 규칙을 참고했습니다.

## 설계 결정

- `DataChart`는 단일 series의 선형·막대 variant를 한 API로 제공합니다.
  `null`은 0이 아닌 결측값이며 선형 경로를 끊고 막대를 그리지 않습니다.
  `figure`의 제목·단위와 visually hidden table로 모든 값을 읽을 수
  있습니다. [shadcn Chart 문서](https://ui.shadcn.com/docs/components/base/chart)는
  조합 방향의 참고 자료이며 Recharts나 원본 코드를 편입하지 않았습니다.
- `Dashboard`는 AppShell 안쪽의 지표·상세 panel 배치만 담당합니다.
  MetricCard, DataChart, LogConsole, PageHeader는 기존 export를
  조합합니다. 범주별 반응형 grid는 container query를 사용합니다.
- `Toast`는 한 번에 하나의 controlled 알림을 표시하는 기본 단위입니다.
  오류에는 `alert`, 그 외에는 `status`를 사용하고 텍스트와 닫기 버튼을
  제공합니다. 자동 소멸은 넣지 않았습니다. 닫을 때 열기 전 focus로
  돌아갑니다. 여러 알림의 중복·대기열 정책은 이 component가 소유하지
  않습니다. [WAI Alert Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)과
  [WAI-ARIA status](https://www.w3.org/TR/wai-aria/#status)를 확인했습니다.

세 항목 모두 React와 Tailwind, 저장소의 `cn`으로 직접 작성했습니다.
새 npm dependency나 외부 source 복사는 없습니다. public export,
registry, provenance, 문서의 실제 preview·사용 코드와 게시용 JSON에
연결했습니다. Dashboard와 Toast의 문서 설치 명령에는 사용 코드에
필요한 동반 component URL도 표시합니다. 현재 47개 component,
49개 registry item입니다.

## 실행한 검사

- `npm run typecheck`, `npm run build`, `npm run registry:check` 통과.
  기본 게시 URL로 49개 JSON을 다시 생성하고 정합성을 확인했습니다.
- 문서 브라우저에서 DataChart의 선형 경로와 막대 6개, 결측 구간의
  표 값, 빈 데이터 상태를 확인했습니다. Dashboard는 폭 약 721px에서
  지표 2열·상세 panel 1열과 각 영역의 accessible name을 확인했습니다.
- Toast의 완료 `status`, 오류 `alert`, 텍스트, 키보드로 닫기,
  열기 버튼으로 focus 복귀를 브라우저에서 확인했습니다. 오류 variant를
  다크 모드에서 시각 확인한 뒤 밝은 모드로 되돌렸습니다.
- 기존 Vite 소비자 프로젝트에 로컬 registry URL로 3개 item을
  `shadcn add`했습니다. 파일 3개가 생성되고 기존 `utils.ts`는 동일해
  건너뛰었습니다. 세 export를 import한 소비자 typecheck와 production
  build가 통과했습니다.

## 남은 검사와 범위

- 실제 screen reader의 status·alert 발표와 chart table 탐색은
  확인하지 않았습니다. 좁은 viewport, 4열 dashboard breakpoint,
  다량 데이터와 긴 label의 시각 감사도 남아 있습니다.
- 소비자 검사는 기존 Vite fixture에 추가 설치했습니다. 새 프로젝트에서
  모든 registry item을 처음부터 설치하는 검사는 남아 있습니다.
- 다중 series, chart tooltip·범례, Toast 대기열·중복 처리, 원격 배포는
  아직 구현·검증하지 않았습니다.
