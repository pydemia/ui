# 공급·품질 판정 수준 재검토 — 2026-10-03

## 분석 화면 밀도 작업에 적용

이번 `Dashboard`·`LogConsole`·`LogViewer` 변경은 새 설치 형식이나
외부 코드 편입이 없는 표시 선택입니다. 관련 테스트와 로컬 browser의
실제 간격·검색 확인으로 구현을 판단하고, 하나의 82번째 snapshot과
적용 CI·대표 공개 URL로 게시를 판단합니다. 이전 81개 release의
개별 설치나 외부 LICENSE 조사를 반복하지 않습니다. Goal 관리용
추정 약 99%와 공개 수량 144개·146개는 체크리스트 문구 또는 새
snapshot만으로 바꾸지 않습니다. 이 적용 사례의 검증 결과는
[분석 화면 작업 기록](analytics-density-2026-10-03.md)에 남깁니다.

## 후속 판단: 출시 기준과 릴리스 비용

`Table`·`DataTable`의 표시 형태 변경은 제품 코드·문서·테스트보다
79번째 snapshot의 146개 item을 두 위치에 복제한 결과가 diff의
대부분이었습니다(전체 315개 파일). 이는 검토할 동작이 315개라는
뜻이 아닙니다. 사람 검토는 기본 표시의 호환성, 새 표시의 실제 차이,
Usage·registry 일치, 적용 CI 결과로 끝냅니다. 새 설치 경로가 없으므로
소비자 재설치를 반복하지 않습니다.

앞으로도 개발 중인 변경에는 변경한 핵심 동작만 확인하고, release
묶음에 export·registry·출처·Usage·preview와 CI·snapshot을 확인합니다.
공개 URL 확인은 게시 상태의 증거이며 구현 품질 점수가 아닙니다.
배포 지연은 `공개 대기`로 기록합니다. 과거 10개 운영 과제와 Instant
Rollback 중 이전 snapshot URL 보존은 별도 운영 과제로 추적하며,
이번 Goal의 완료율을 깎는 체크박스로 사용하지 않습니다. 이전
[범위 점검](goal-scope-audit-2026-10-03.md)의 rollback을 이유로 한
완료 보류 문장은 현재 판정에 적용하지 않습니다.

CI 전체 실행과 snapshot 복제는 자동화 비용입니다. 변경별 품질
요건을 늘리는 대신 묶음 release를 사용합니다. CI 범위나 snapshot
형식 변경은 별도 작업으로 검토해야 하며 이번 기록은 그 동작을
바꾸지 않습니다. 확인된 값 손실·제출 오류·keyboard 접근 불가·
필수 고지 누락·설치 실패·적용 CI 실패는 계속 출시 차단 조건입니다.
이번 판정으로 공개 수량과 Goal 관리용 추정 약 99%는 바꾸지 않습니다.

## 확인한 사실

현행 기준은 개발 중 후보의 사용처·중복 여부와 바뀐 핵심 동작만
확인하고, Usage·preview·snapshot은 공개 후보 단계에서 확인합니다.
고정된 browser·화면 폭 조합이나 component별 PR·snapshot도 요구하지
않습니다. 다만 아래 표의 격리 소비자 설치 조건이 기존 판정 문서보다
넓어 보여, 설치 경로·target·의존 경로가 바뀔 때로 다시 한정합니다.

실제 부담은 자동 게시 절차에 남아 있습니다. `Verify UI`는 draft PR도
전체 typecheck·테스트·build·registry 검사를 실행합니다. Review 준비
PR과 `main`은 현재 snapshot 일치까지 확인하며, `registry:check`는
과거 release 전체를 읽습니다. 현재 추적 중인 76개 release는
`registry/releases/`와 `docs/r/releases/`에 각각 9,064개 파일,
합계 18,128개 파일입니다. 이 파일 수와 과거 10개 운영 과제의
미완료 수는 신규 component의 품질을 나타내지 않습니다.

## 적용 판단

| 변경 | 완료 판단에 필요한 증거 | 별도 위험이 없으면 반복하지 않는 검사 |
| --- | --- | --- |
| 기존 component의 표시 | 영향받은 상태의 preview와 적용 CI | 기존 동작의 전수 재시험·모든 화면 폭·browser |
| 새 API·상호작용 | 실제 사용 코드, 핵심 경로의 관련 테스트 또는 실행 | 자동 테스트가 증명한 조작의 수동 반복 |
| registry item 생성 | 생성 item·의존성 정합성과 적용 CI | 변경 없는 설치 경로의 격리 재설치 |
| 설치 경로·target·의존 경로 변경 | 해당 경로의 격리 소비자 설치 | 무관한 item 전체 재설치 |
| 외부 코드 편입 | 해당 revision의 source·LICENSE·의존성·접근성 | 같은 revision 조사 반복 |
| 공개 게시 | 묶음의 snapshot·적용 CI, manifest와 변경 대표 item 접근 | component마다 별도 PR·snapshot |

확인된 값 손실, 제출 오류, keyboard로 사용할 수 없는 핵심 조작,
설치 실패, 필수 고지 누락, 적용 CI 실패는 출시를 막습니다. 해당 변경의
핵심 경로를 확인하지 못한 경우에는 구현 검증을 완료로 쓰지 않습니다.
Screen reader·touch·Safari·RTL의 전수 수동 점검, 과거 snapshot의
모든 item 재설치, 장기 URL 보존 실험은 모든 component 릴리스의
필수 체크박스로 두지 않습니다. 관련 지원 동작이나 공급 경로가
바뀌면 해당 범위를 검증하고 미검증 항목을 구체적으로 남깁니다.

Goal은 component 수나 과거 운영 과제의 체크 수로 종료하지 않습니다.
요청한 화면 범주와 디자인 선택지, 대표 복합 화면의 설치·동작,
현재 공개 공급을 확인하면 범위 달성을 판정할 수 있습니다.
이미 확인한 [범위 점검](goal-scope-audit-2026-10-03.md)은 그 조건의
대부분을 충족합니다. Rollback 시 과거 schema 1 snapshot URL 보존은
라이브러리 전체의 별도 운영 위험으로 추적합니다. 이 위험 하나만으로
새 component의 품질이나 Goal 달성률을 깎지 않습니다.

이번 재검토는 판정의 적용 범위와 Goal 종료 조건을 정리한 것입니다.
CI·snapshot 생성 방식은 바꾸지 않았습니다. schema 2의 새 설치
경로는 [공급 기록](registry-durable-snapshot-2026-10-03.md)에 따라
공개 raw URL로 격리 소비자 설치를 확인했습니다. 이후 같은 경로에서
`Input`의 외형 API만 바꾼 PR #146에는 그 설치 시험을 반복하지
않았습니다. PR·`main` CI와 production preview·item 접근을 확인했습니다.
문서 전용 수정에는 공개 화면의 재배포만 확인하면 됩니다. Goal 관리용
추정은 약 99%이며 이 기준 조정으로 수량이나 추정치를 올리지 않습니다.

## 2026-10-03 적용 재확인

80개 release의 item 파일이 `registry/releases/`와 `docs/r/releases/`에
각각 9,652개씩 있습니다. 전체 CI와 snapshot 이중 저장이 여전히
게시 비용을 키우지만 component 한 개의 품질 검토 항목으로 세지
않습니다. 새 표시 형태처럼 설치 경로가 그대로인 변경에는 관련 동작
검증 한 번과 release 묶음의 기존 CI·snapshot·대표 공개 URL 확인을
적용합니다. 외부 source 재조사나 소비자 재설치를 반복하지 않습니다.
출시 차단 조건은 위에 적은 확인된 결함으로 유지합니다. Goal 추정
약 99%도 체크리스트 통과 비율이 아니며 이번 재확인으로 바꾸지
않습니다. CI·snapshot 구조는 변경하지 않았습니다.
