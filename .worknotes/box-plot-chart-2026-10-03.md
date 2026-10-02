# BoxPlotChart 공급 작업

2026-10-03. 그룹별 다섯 수치 요약을 같은 척도에서 비교하는 원본
`BoxPlotChart`를 추가했습니다. `DataChart`는 시간·범주별 값의 추이,
`BulletChart`는 목표 대비 실적을 다루므로 이 용례를 대신하지
않습니다. 호출자가 `min ≤ q1 ≤ median ≤ q3 ≤ max`를 계산합니다.
수염은 최솟값·최댓값이며 이상치 판정은 수행하지 않습니다.

`@pydemia/ui` export, 내부 registry, provenance, catalog preview·Usage,
수치 경계 테스트를 연결했습니다. `pyd-utils` 외 새 의존성은 없습니다.
외부 코드를 복사하지 않았고 NIST의 통계 개념과 W3C의 표 지침만
참고했습니다. 그래픽은 장식으로 숨기고, 정확한 값은 제목과 행·열
머리글이 있는 native 표에 제공합니다. 실제 screen reader 발표는
검사하지 않았습니다.

## 확인한 증거

- `npm run typecheck` 통과: package, profile demo, docs.
- `node --test packages/ui/tests/box-plot-chart.test.mjs` 4/4 통과:
  정확한 값·위치, 빈 목록·동일값, 잘못된 순서·무한 범위, 빈 formatter.
- `npm run build` 통과: 138개 registry item과 docs/profile demo 빌드.
- 로컬 Chromium preview에서 데이터·동일값·빈 목록 전환,
  `panel`·`plain`, 다크 테마와 390px 배치를 확인했습니다.
  본문 전체의 페이지 가로 overflow는 보이지 않았고 값 표에는
  의도한 내부 가로 스크롤이 있습니다.
- `git diff --check` 통과.

첫 `registry:check`는 provenance를 바꾼 뒤 공통 MIT 고지의 SHA-256이
이전 값인 상태라 실패했습니다. 원본 commit을 고지에 고정하고
재생성한 뒤 다시 검사해야 합니다. 공개 후보 CI, snapshot 검사,
production item URL은 아직 확인하지 않았습니다. 이 상태는
구현 검토이며 공개 공급으로 계산하지 않습니다.

Goal 관리용 추정은 약 98%입니다. 현행 공급·품질 적용 판단은
[재검토 기록](quality-checklist-decision-2026-10-03.md)을 따릅니다.
