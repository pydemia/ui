# 공급·품질 체크리스트 위험 기준 재검토

2026-10-02. 공개 기준 113개 component·115개 registry item·32개
snapshot입니다. 이번 변경은 출시 판정 기준과 검증 기록만 정리합니다.
제품 코드·registry·배포 동작을 바꾸지 않습니다. Goal 관리용 추정은
MasterDetail 공개를 반영한 약 88%이며, 기준 완화만으로 올리지
않았습니다.

## 확인한 경직성

기존 기준은 값·form·keyboard·focus가 바뀌면 회귀 테스트와 브라우저
실행을 모두 요구했습니다. 같은 흐름을 두 방식으로 확인해야 하는
이유가 모든 변경에 있는 것은 아닙니다. 반대로 focus 복귀나 container
폭에 따른 전환은 서버 렌더링 테스트만으로 확인할 수 없습니다.

`Verify UI`는 PR과 `main` push에서 typecheck, UI 테스트, build,
`registry:release-check`, 생성된 `docs/`의 Git diff 검사를 실행합니다.
`registry:release-check`에는 export·catalog·registry·의존 선언·
provenance·Usage·snapshot 대조가 포함됩니다. 이 결과와 변경 흐름
검증을 인정하면서, 모든 component에 소비자 설치·모든 환경의 브라우저
검사·공개 사이트의 동작 재실행을 덧붙이는 것은 중복입니다.

## 현재 적용 기준

| 상황 | 공급에 필요한 증거 |
| --- | --- |
| 모든 코드·registry 변경 | 해당 commit의 CI 통과. 실패를 고친 뒤에는 수정 commit의 결과를 확인 |
| 새 component | 독립 사용처·상태 소유·기본 접근성 규칙, export·registry·출처·동작하는 preview·Usage |
| 외부 코드를 복사·수정 | 공식 문서, 고정 revision의 소스·LICENSE·의존성을 대조하고 고지 전달 확인. 원본 구현에서 참고한 자료와 기존 의존 component의 출처는 기록 |
| 동작 변경 | 영향받은 대표 흐름을 자동 테스트 **또는** 브라우저에서 실행. 회귀 결함은 재현 경로를 포함. focus·pointer·반응형 배치·실제 표시가 판단에 필요하면 브라우저 실행 |
| 새 설치 형식·target·의존 경로 | 별도 소비자 설치·typecheck·build. 기존 경로의 새 item은 반복 설치하지 않음 |
| registry 공개 | 릴리스 묶음당 snapshot·배포 상태·manifest·변경 item URL 확인. 설치·의존 URL이나 배포 경로 변경 시 공개 URL 설치 |

문서만 바뀌면 문서 build와 변경한 링크·Usage·preview를 확인합니다.
CI가 문서 변경에도 실행되면 그 결과를 사용하고 별도 로컬 재실행은
요구하지 않습니다. 같은 산출물의 로컬 브라우저 검증을 공개 사이트에서
반복하지 않습니다. 시각 변경의 light/dark·좁은 화면 검사는 변경이
해당 상태에 영향을 줄 때 적용합니다.

확인된 값 손실·제출 오류·keyboard 접근 불가·필수 LICENSE 고지 누락·
설치 실패, 적용되는 CI 실패와 변경 item URL 실패는 수정판 검증
전까지 출시 완료로 표시하지 않습니다. 필요한 대표 흐름을 어떤
방식으로도 실행하지 못한 경우도 완료로 표시하지 않습니다.
실제 screen reader·touch·Safari·RTL, 모든 item의 개별 설치,
rollback 뒤 URL 보존은 별도 품질 과제로 남기고 미검증을 명시합니다.
해당 환경 지원을 새로 주장하거나 그 경로를 변경할 때는 검사를
앞당깁니다.

## 적용 사례와 영향

MasterDetail은 UI 테스트 138/138과 로컬 브라우저의 데스크톱 선택,
390px 목록·상세 전환·focus 복귀, light/dark를 확인했습니다. CI와
배포가 성공했고 공개 preview·manifest·변경 item URL도 응답했습니다.
focus·반응형 변경에 필요한 브라우저 증거가 있어 공급 완료로
판정합니다. 개별 소비자 CLI 설치와 실제 보조기술·touch·Safari·RTL은
미검증으로 남습니다.

과거 10개 누적 과제의 체크 수는 릴리스 승인 점수나 goal 진척도로
사용하지 않습니다. 이번 검토는 확인되지 않은 지원 범위를 넓히지
않으며, 검사의 중복만 줄입니다. 새 실행 검증은 공개 URL과 CI 상태
확인에 한정했습니다.
