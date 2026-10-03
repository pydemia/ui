# 공급·품질 체크리스트 경직성 재검토 — 2026-10-03

## 확인한 상태

현행 [판정 기준](quality-checklist-decision-2026-10-03.md)은 변경한
핵심 동작의 증거 하나를 인정하고, component별 PR·snapshot과 고정된
화면·browser 조합을 요구하지 않습니다. 따라서 수동 검사 항목 자체는
이미 변경 위험에 맞춰 줄었습니다.

반면 `.github/workflows/verify.yml`은 제품 코드 변경의 review 준비 PR과
`main`에서 `verify-current`를 실행합니다. 문서 전용 변경은 전체
검사를 생략합니다. 현재 저장소에는 snapshot 75개가 있고,
`registry/releases/`와 `docs/r/releases/`에 각각 8,917개 파일이
있습니다. 하나의 변경도 공개 후보가 되는 순간 최신 전체 snapshot을
요구하는 게시 절차가 개발 중 품질 판정처럼 느껴지는 원인입니다.
과거 [10개 운영 과제](quality-legacy-2026-09-29.md)의 미완료 표기도
남아 있어 개별 component의 결함과 혼동하기 쉽습니다.

## 이번 판단

사람의 검토는 변경한 사용처·API·핵심 동작·Usage·preview에 집중합니다.
자동 검사가 증명한 동작을 browser·PR·production에서 다시 수행할
필요는 없습니다. 기존 component의 표시만 바꾼 경우에는 영향을 받은
상태의 preview면 충분하며 신규 component 조사 절차를 반복하지
않습니다. 확인된 값 손실, 잘못된 제출, keyboard 접근 불가, 설치 실패,
필수 고지 누락은 계속 공개를 막습니다.

개별 변경의 `구현 검증`과 묶음의 `게시 검증`을 별도 상태로 보고합니다.
구현 검증에는 관련 테스트 또는 실제 실행과 사용 코드·preview를
적용합니다. 게시 검증에는 export·registry 정합성, 묶음의 전체 CI와
snapshot, 배포 뒤 manifest와 변경 item 경로 확인을 적용합니다.
게시 지연은 구현 결함으로 계산하지 않습니다. 출처·LICENSE 검토는
실제 외부 코드를 편입했을 때 해당 revision에 적용하고, 이미 검토한
revision의 증거를 재사용합니다.

지금 바로 적용할 수 있는 운영 방식은 한 사용 사례에 필요한 관련
component를 draft PR에서 함께 만들고, review 준비 전에 snapshot을
한 번 생성하는 것입니다. `main` 자동 게시를 유지하는 동안에는
snapshot을 생략한 채 공개 완료로 처리할 수 없습니다.

추가로 절차 비용을 줄이려면 `verify-current`를 review 준비 PR에서
요구할지, 게시 시점에만 요구할지와 `main` 병합·production 배포를
분리할지 결정한 뒤 workflow를 변경해야 합니다. 이는 현행 CI를
바꾼 것이 아니며, 해당 변경 전까지 기존 CI 결과를 따릅니다.
snapshot 전체 복제도 불변 URL·의존 경로·rollback을 보존하는 설계와
검증이 필요합니다.

이번 검토는 품질 하한이나 workflow를 변경하지 않았습니다. 새로운
수동 검사 항목도 추가하지 않습니다. 검토를 간소화하는 적용 단위는
다음과 같습니다.

| 상태 | 필요한 확인 | 반복하지 않는 확인 |
| --- | --- | --- |
| 개발 중 | 사용처·기존 API와의 차이, 변경한 핵심 동작의 실행 또는 관련 테스트 | 전체 snapshot·공개 URL |
| 공개 후보 | Usage·preview·export·registry 정합성, 적용 CI, 묶음당 현재 snapshot | component마다 별도 PR·snapshot, 자동 검사로 증명한 동작의 재실행 |
| 공개 후 | manifest와 변경한 대표 item URL | 모든 item의 수동 재설치·모든 환경의 일괄 수동 검사 |

외부 코드의 revision별 조사, 격리 소비자 설치, screen reader·touch·
Safari·RTL 검사는 해당 코드·설치 경로·지원 동작이 바뀐 경우에만
적용합니다. 실행하지 않은 검사를 통과로 기록하지 않고, 공개를 막는
결함은 값 손실·제출 오류·keyboard 접근 불가·설치 실패·필수 고지
누락·적용 CI 실패처럼 실제 확인한 실패로 구체적으로 기록합니다.

75번째 snapshot은 이후 production에 공개됐습니다. 공개 확인은
[공급 기록](shadcn-provenance-scope-2026-10-03.md)에 있습니다. 현재
Goal 관리용 추정은 약 99%입니다. 이 수치는 과거 10개 운영 과제의
완료 수로 계산하지 않습니다. Rollback 뒤 새 snapshot URL 보존은
별도 공급 안정성 과제로 남습니다.
