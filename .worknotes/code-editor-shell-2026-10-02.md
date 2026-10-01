# CodeEditorShell 편입

2026-10-02. 공개 기준 110개 component·112개 registry item·
29개 snapshot, goal 추정 약 85%에서 시작했습니다. 이번 로컬
구현으로 source·catalog 기준 111개 component와 113개 item이
되었습니다. 공개 전까지 goal 추정은 약 85%로 유지합니다.

## 후보 판정

`AppShell`은 header·좌우·하단·floating panel과 bubble을 이미
제공하며 문서에서 열기·닫기와 focus 복귀를 조합합니다. 별도의
floating shell을 더하는 대신 개발자 도구 화면의 편집 영역을
보강했습니다. 기존 `Textarea`는 이름·설명·작업 영역·줄 번호를
호출자가 반복 구성해야 하고, `CodeBlock`·`Snippet`은 읽기
전용입니다. SQL·설정 조각을 편집해 form에 전달하는 독립 사용처가
있어 `CodeEditorShell`로 편입했습니다. 구문 강조 엔진이나 코드
실행을 제공한다고 주장하지 않습니다.

## 구현과 출처

controlled 문자열과 native textarea의 form 값을 사용합니다.
줄 번호 gutter는 장식으로 숨기고 실제 줄바꿈과 세로 scroll을
동기화합니다. label·설명·오류를 textarea에 연결하고 Tab 이동을
유지합니다. panel·flat 표시는 공통 token을 사용합니다. 패키지
export, registry metadata·provenance, 문서의 동작 preview·Usage와
서버 렌더 테스트를 추가했습니다. 외부 editor 코드를 복사하지
않았고 기존 shadcn 기반 `pyd-textarea`를 재사용합니다. 공식 문서와
고정 source·MIT LICENSE, WHATWG·WAI 참고, 의존성은
[source inventory](../research/source-inventory.md#2026-10-02-codeeditorshell)에
기록했습니다. 새 npm dependency는 없습니다.

## 검증 상태

- typecheck, 전체 UI 테스트 132/132(새 테스트 4/4), build 통과.
- 로컬 Chromium의 입력·제출·줄 번호 scroll·오류·Tab 이동,
  390px dark 화면과 page error 없음 확인.
- 첫 `registry:check`는 provenance 변경에 따른 소비자 MIT 고지의
  SHA-256 핀을 갱신하기 전이라 불일치로 중단됐습니다. 아래
  고지 갱신 후 검사에서 해결했습니다.
- 개별 consumer CLI 설치와 실제 screen reader·touch·Safari·RTL은
  미검증입니다. 동일한 표준 설치 경로이므로 개별 설치는 이번
  릴리스의 필수 조건이 아닙니다.

## 로컬 릴리스 검사

source commit `40f93b4`의 provenance LF SHA-256을 소비자 MIT 고지에
고정했습니다. `registry:check`는 113개 item과 111개 source·export·
catalog 대응을 통과했습니다. 30번째 불변 snapshot
`sha256-cd80f1b518caf6306048ec6a2c73f314534cd57a3b01fe5004c631361bd80816`을
생성하고 재빌드한 뒤 `registry:release-check`도 통과했습니다.
현재 변경된 registry item의 공개 URL·원격 CI·production 동작은
검증하지 않았습니다.
