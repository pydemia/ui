# HistogramChart 공급 작업

2026-10-03. 연속된 수치 구간의 빈도는 기존 `DataChart`의 범주 막대와
입력·해석 규칙이 다릅니다. `HistogramChart`는 호출자가 계산한
동일 너비·연속 구간의 건수를 받으며, 마지막 구간만 상한을 포함합니다.
binning·집계는 호출자가 맡습니다. 정확한 구간·건수·합계를 native
표와 텍스트로 제공하고 막대는 장식으로 처리합니다.

원본 React·Tailwind 구현이며 외부 코드를 복사하지 않았습니다.
기존 `pyd-utils` 외 의존성은 없습니다. 개념은 NIST 공식 문서,
표 구조는 W3C WAI 지침을 참고했습니다. 출처와 API 범위는
`research/source-inventory.md`와 `research/design-contract.md`에
기록했습니다.

현재 확인: `npm run typecheck` 통과, 대상 SSR 테스트 4/4 통과,
`npm run build` 통과(139개 registry item).
테스트는 정확한 구간·건수·막대 높이, 빈 배열·모두 0, 잘못된
경계·너비·건수·합계, 소수 경계와 빈 formatter를 다룹니다.
Chromium preview에서 390px과 1280px의 축·표 배치, data·모두 0·
빈 데이터 전환, `panel`·`plain`, light/dark를 확인했습니다. 실제
screen reader 발표는 실행하지 않았습니다. 최종 source의 전체 build,
`registry:check`, 67번째 snapshot 생성과 `registry:release-check`를
통과했습니다. snapshot ID는
`sha256-42ef7c428b894dd74fb740e145c8232d292363b9fefc1cd30fdfd506487701f8`입니다.

공급·품질 기준은 이 변경에 한정해 적용했습니다. 원본 코드이므로
외부 component의 revision·LICENSE 대조와 새 설치 방식의 격리 소비자
시험은 적용하지 않습니다. 정적 차트의 핵심 위험인 구간 경계·빈도·
빈 상태는 대상 테스트와 preview로 확인합니다. 전체 snapshot 복제량,
공통 고지 hash 전파, Vercel 배포 제한은 component 품질 점수가
아닙니다. 적용 CI와 공개 URL은 공개 준비·공개 확인 단계에서 각각
판정합니다. 현재 상태는 공개 준비 단계의 로컬 검증 완료이며 적용 CI와
공개 URL은 미확인입니다. Goal 관리용 추정은 약 98%입니다.
