# 공급·품질 판정 — 현재 기준

2026-10-03 재검토 당시 공개 수량은 129개 component, 131개 registry item,
55개 snapshot입니다. Goal 관리용 추정은 약 97%이며 이번 기준 정리로
올리지 않습니다.

## 릴리스 판정

릴리스마다 과거 10개 운영 과제를 다시 채점하지 않습니다. 변경분에
대해 다음을 확인합니다.

1. 공개 API·registry·preview·Usage가 일치하고 필수 출처와 LICENSE
   고지가 전달되는가?
2. 바뀐 핵심 동작을 관련 자동 테스트 **또는** 브라우저에서 한 번
   확인했는가? 정적 표시 변경은 해당 상태의 preview로 충분합니다.
3. 공개 후보의 적용 CI가 통과하고, 배포 후 변경한 공급 경로가
   열리는가? 자동 검사가 전체 registry item을 대조했다면 공개
   manifest와 의존 경로별 대표 변경 item URL을 확인합니다.

확인된 값 손실·잘못된 제출·keyboard 접근 불가·설치 실패·필수 고지
누락·적용 CI 실패는 수정 전까지 출시를 막습니다. 핵심 동작의 실행
증거가 없거나 공개 경로가 열리지 않으면 구현과 공개 공급 상태를
구분합니다. 다른 미실행 검사를 일률적인 실패 점수로 세지 않습니다.

## 변경 위험에 따라 추가할 검사

| 변경 | 확인 범위 |
| --- | --- |
| 외부 코드 도입 | 해당 revision의 공식 문서·source·LICENSE·의존성·접근성. 같은 revision의 기존 조사 재사용 |
| 설치 형식·target·의존 경로 | 바뀐 경로의 격리 소비자 설치·typecheck·build |
| focus·pointer·browser API·핵심 반응형 배치 | 관련 자동 테스트가 증명하지 못하는 브라우저 흐름 |
| 색상·배치 | 영향을 받는 상태·폭·theme의 preview |

기존 component의 표시 변경에는 새 component 조사나 모든 환경의
수동 점검을 적용하지 않습니다. 같은 공개 후보 commit의 CI 결과를
재사용하고, 로컬에서 확인한 상호작용을 공개 사이트에서 반복하지
않습니다. screen reader·touch·Safari·RTL·rollback은 해당 지원을
명시하거나 관련 경로를 바꿀 때 확인합니다. 나머지는 라이브러리
전체의 별도 조사로 둡니다.

실제 고정 비용은 제품 PR과 `main`의 전체 CI 반복, snapshot마다
모든 item을 `registry/releases/`와 `docs/r/releases/`에 다시 기록하는
방식입니다. 이 비용을 줄이는 일은 별도 구현 과제입니다. 기존 불변
URL과 dependency 경로를 보존하는 검증 없이 저장 형식을 바꾸지
않습니다. 이전 판단은 [실무 검토](quality-checklist-practical-review-2026-10-02.md),
[절차 부담 검토](quality-checklist-reassessment-2026-10-02.md),
[누적 과제](quality-legacy-2026-09-29.md)에 남아 있습니다.
