# 공급·품질 판정 — 현재 기준

2026-10-02 기준 재검토 당시에는 124개 component·126개 registry
item·47개 snapshot이 공개돼 있었습니다. Goal 관리용 추정은 약
97%였습니다. 검사 기준을 바꿨다는
이유로 공급 수량이나 목표 달성률을 올리지 않습니다.

## 릴리스마다 확인할 것

비렌더링 Markdown 기록만 바뀐 PR에는 제품 build가 적용되지 않습니다.
사이트의 Usage·preview를 바꾸는 `apps/docs/`와 생성된 `docs/`는
제품 변경으로 분류해 전체 CI를 실행합니다. `main` push도 전체
검사를 유지합니다. 경로별 CI 적용 상태는
[작업 기록](ci-scope-2026-10-02.md)에 남깁니다.

1. 코드·registry·사이트 문서 변경은 해당 commit의 CI(typecheck,
   UI 테스트, build, registry 검사)를 확인합니다. 비렌더링 Markdown
   기록만 바뀐 PR은 diff 공백 검사와 변경한 링크·문구를 확인합니다.
2. 새 component는 독립 사용처, public export·registry·출처,
   동작하는 preview·Usage를 갖춥니다. 바뀐 핵심 흐름은 자동 테스트
   **또는** 브라우저에서 한 번 실행합니다. 정적 표시 변경은 해당
   preview 확인으로 충분합니다.
3. 공개는 릴리스 묶음당 배포 상태, 변경한 preview, manifest와 변경
   registry item URL을 확인합니다. 로컬에서 실행한 상호작용을 공개
   사이트에서 반복하지 않고, 표준 경로의 item마다 별도 소비자를
   만들지 않습니다.

## 변경 내용에 따라 추가할 것

| 바뀐 영역 | 추가 증거 |
| --- | --- |
| 외부 코드 도입 | 공식 문서, 같은 revision의 source·LICENSE, 의존성·접근성과 고지. 이미 확인한 revision은 기록 재사용 |
| focus·pointer·browser API·핵심 반응형 배치 | 영향을 받은 브라우저 흐름 실행 |
| 색상·배치 | 영향을 받는 상태·폭·theme의 preview 확인 |
| 설치 형식·target·의존 경로 | 별도 소비자 설치·typecheck·build. 공개 URL 경로가 바뀌면 그 URL에서 설치 |

확인된 값 손실·제출 오류·keyboard 접근 불가·필수 고지 누락·설치
실패, 적용되는 CI 실패와 공개 경로 실패는 공급 완료를 막습니다.
변경한 핵심 흐름을 실행하지 못했으면 구현 완료와 공급 완료를
구분합니다. 실제 보조기술·touch·Safari·RTL, 모든 item의 개별 설치,
rollback 뒤 URL 보존은 해당 지원을 주장하거나 관련 경로를 바꿀 때
검사합니다. 그 외에는 라이브러리 전체의 운영 과제로 추적합니다.
과거 10개 누적 과제의 완료 수는 릴리스 점수나 goal 진척도로 쓰지
않습니다. 기록에는 적용한 증거와 실제 차단 결함만 남깁니다.

## 확인된 절차 부담

변경 전 `.github/workflows/verify.yml`은 모든 PR과 `main` push에
전체 UI 검사를 실행했습니다. 병합 commit `802831d`의 Verify UI는
약 2분 9초
걸렸습니다. `registry-release.mjs`는 새 snapshot마다 126개 item을
`registry/releases/`와 `docs/r/releases/`에 각각 복제합니다.
비렌더링 Markdown PR의 CI 분기는 초안을 작성했고 실제 CI 검증이
남았습니다. snapshot 저장 방식은 기존 URL·dependency·rollback
동작을 보존하는 별도 구현 과제입니다. 과거 판단과 사례는
[이전 검토](quality-checklist-pragmatic-2026-10-02.md)와
[누적 과제](quality-legacy-2026-09-29.md)에 남아 있습니다.
