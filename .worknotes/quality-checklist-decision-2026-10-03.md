# 공급·품질 기준 재검토 — 2026-10-03

현재 기준은 검사 종류보다 적용 방식이 무겁습니다. 구현 중 후보에도
공개 릴리스 수준의 증거를 모으고, component 하나마다 PR·snapshot을
만들어 같은 검사를 반복했습니다. `SankeyChart` PR #131의 변경 파일
347개 중 290개가 snapshot의 두 복사본이었습니다. 이는 품질 미달이
아니라 릴리스 단위와 생성 방식의 비용입니다.

## 적용 기준

- 후보 선정: 반복 사용처와 기존 API와의 차이를 확인합니다. 이 판단은
  품질 점수가 아닙니다.
- 구현 검토: 바뀐 핵심 동작을 관련 테스트 또는 실제 실행으로
  확인합니다. 고정된 테스트 개수나 화면 폭·theme·browser 조합을
  요구하지 않습니다.
- 릴리스 후보: 공개 API·registry·출처·Usage·preview의 일치, 적용 CI,
  현재 snapshot을 릴리스 묶음마다 확인합니다. 관련 변경은 하나의 PR과
  snapshot으로 묶을 수 있습니다.
- 공개 확인: 배포된 manifest와 바뀐 대표 item URL을 확인합니다.
  이 단계는 공급 상태이며 component의 구현 품질 점수가 아닙니다.

새 focus·pointer·form·반응형 경로는 관련 자동 테스트가 증명하지 못하는
부분을 브라우저에서 확인합니다. 정적 표시에는 해당 상태의 preview로
충분합니다. 색이나 배치가 바뀌지 않았다면 모든 폭·theme를 재검사하지
않습니다. 같은 동작을 PR·main·production에서 수동으로 반복하지
않습니다. 실제 screen reader·touch·Safari·RTL 검사는 해당 지원을
새로 약속하거나 관련 경로를 바꾼 경우에 적용합니다.

로컬 검증은 변경한 동작의 대상 테스트 또는 브라우저 실행부터 합니다.
전체 typecheck·UI 테스트·build·registry 검사는 적용 PR CI의 결과를
사용합니다. 설치·빌드 경로를 바꿨거나 CI 실패를 재현해야 할 때만
로컬 전체 검사를 추가합니다. 문서만 바꾼 경우에는 렌더링이나 사용
코드가 달라진 부분만 확인합니다. CI가 실행되지 않았다면 통과로
대신 기록하지 않습니다.

외부 코드를 편입한 경우에만 해당 revision의 공식 문서·source·LICENSE·
의존성·접근성을 조사합니다. 개념만 참고한 원본 구현에는 복제 코드의
LICENSE 조사를 요구하지 않습니다. 설치 형식·target·의존 경로가
바뀌었을 때만 격리 소비자 설치를 다시 실행합니다.

확인된 값 손실, 제출 오류, interactive 요소의 keyboard 접근 불가,
필수 고지 누락, 설치 실패와 적용 CI 실패는 출시를 막습니다. 핵심
동작을 실행하지 않았다면 구현 검토를 완료로 표시하지 않습니다.
CI나 배포 서비스가 실행되지 않은 경우에는 `공개 대기`로 기록하고
제품 결함으로 세지 않습니다.

공개 확인은 배포 성공과 변경한 item 또는 의존 경로의 대표 URL을
묶음당 한 번 확인합니다. 로컬에서 이미 검증한 상호작용을 production
브라우저에서 다시 수행하는 것은 기본 조건이 아닙니다. 공개 preview
자체를 바꿨거나 배포와 로컬의 차이가 의심될 때만 해당 화면을 다시
조작합니다. 개별 component마다 별도 PR·snapshot·배포를 만들지
않고, 함께 쓰는 변경을 한 릴리스 묶음으로 게시합니다.

## 남은 운영 비용

`.github/workflows/verify.yml`은 제품 변경 PR과 main에서 전체
typecheck·테스트·build·registry 검사를 실행합니다. 문서 전용 변경은
범위 판정을 거쳐 일부 검사를 생략합니다. snapshot 생성기는 현재
item 전부를 `registry/releases/`와 `docs/r/releases/`에 다시
저장합니다. provenance 전체 hash도 원본 component를 추가할 때마다
공통 고지에 전파됩니다. 이 세 가지는 자동화·저장 방식 개선 과제이며
새 component의 미완료 체크박스가 아닙니다. 불변 URL과 고지 전달을
보존하는 별도 변경으로 다뤄야 합니다.

2026-10-03 추가 판정: 개발 중 후보에 Usage·preview 완성을 요구하던
문구를 공개 후보 단계로 옮겼습니다. 개발 중에는 사용처·중복 여부와
바뀐 핵심 동작만 확인합니다. 기존 component의 사용 코드가 그대로
유효하면 문서를 다시 작성하지 않습니다. 릴리스 후보와 공개 공급의
판정, 위 출시 차단 조건은 유지합니다. 자동화나 공개 수량은 이번
문구 변경으로 달라지지 않았고 Goal 관리용 추정은 약 99%입니다.

작업별 `.worknotes` 한 파일에 실제 증거와 적용했지만 실행하지 못한
검사만 남깁니다. 인계·진척도 문서는 그 파일을 링크합니다. 이전
[10개 운영 과제](quality-legacy-2026-09-29.md)의 완료 수는
component 품질이나 Goal 달성률의 분모로 쓰지 않습니다. 이번 재검토
자체는 공개 수량이나 관리용 Goal 추정 약 99%를 바꾸지 않습니다.

## 2026-10-04 적용 강도 재점검

체크리스트의 품질 하한보다 게시 절차가 무겁습니다. 현재
`Verify UI`는 제품 코드가 바뀐 draft PR과 `main`에서 전체 typecheck·
UI 테스트·build·registry 검사를 각각 실행합니다. Review 준비 PR에는
현재 snapshot까지 요구합니다. 83개 release의 item 파일은
`registry/releases/`와 `docs/r/releases/`에 각각 10,093개입니다.
전체 복제 파일 수나 CI 반복 횟수를 component 품질 점수로 세지 않습니다.

작업 판정에는 변경한 사용 흐름의 테스트 **또는** 실제 실행 하나와
알려진 출시 차단 결함의 유무만 적용합니다. Usage·preview·registry·
출처의 일치는 공개 후보에서, snapshot·적용 CI는 게시 묶음에서,
대표 URL 접근은 배포 뒤에 확인합니다. 이미 통과한 동작을 다른 환경에서
반복하거나 변경하지 않은 item을 다시 설치하지 않습니다. 실제 screen
reader·touch·Safari·RTL은 해당 지원 경로를 변경하거나 지원을 약속한
경우에만 별도로 적용합니다. 적용되지 않은 검사는 `해당 없음`, 적용
대상이지만 실행하지 못한 검사는 `미검증`으로 구분합니다.

확인된 값 손실·제출 오류·핵심 조작의 keyboard 접근 불가·필수 고지 누락·
설치 실패·적용 CI 실패는 공개를 막습니다. 배포 제한은 `공개 대기`이며
구현 품질 실패가 아닙니다. 따라서 검사 항목을 더 늘리거나 일률적으로
삭제하지 않고, 관련 변경을 한 draft PR에 모아 review 준비 시점에
snapshot을 한 번 만드는 운영 방식을 우선 적용합니다. CI와 snapshot
저장 방식을 더 줄이는 변경은 불변 URL·의존 경로 보존을 검증하는
별도 작업으로 다룹니다. 이번 검토에서 workflow와 출시 조건은 바꾸지
않았습니다. Goal 관리용 추정은 약 99%로 유지합니다.

## 배포 제한에 적용한 확인

83번째 release의 사용자 도메인 manifest는 HTTP 404이며 병합 commit의
Vercel status는 `Deployment rate limited — retry in 24 hours.`입니다.
Vercel 공식 문서에 따르면 Ignored Build Step으로 취소한 build도 배포
quota에 포함됩니다. 따라서 `vercel.json`의 `ignoreCommand`를 추가하는
것은 이번 제한의 우회책이 아닙니다.

Vercel의 현재 preview→production promotion 안내는 새 production
build를 수행한다고 명시합니다. 기존 READY preview를 promote하면
재빌드 없이 제한을 피할 수 있다는 가정도 사용하지 않습니다. 현재
공급 상태는 GitHub raw 고정 URL 설치 가능, 사용자 사이트 preview는
공개 대기로 구분합니다. URL:

- https://vercel.com/docs/project-configuration/project-settings#ignored-build-step
- https://vercel.com/docs/deployments/promote-preview-to-production
