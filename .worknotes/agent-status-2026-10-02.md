# AgentStatus 작업

## 판정

AI 작업 화면에는 여러 단계와 도구의 진행·실패·건너뜀을 한곳에 보여주고,
전체 작업의 취소·재시도 상태를 전달할 사용처가 있습니다. `ToolCall`은
한 도구의 입력·결과, `Stepper`는 한 현재 단계의 탐색, `Timeline`은
완료된 사건 목록을 담당합니다. 전체 작업과 단계별 상태·진행률은
별도 API가 필요하므로 `AgentStatus`를 원본 component로 편입합니다.
외부 component 소스는 도입하지 않습니다.

## 구현 명세

- 호출자가 전체 상태(`queued`, `running`, `completed`, `failed`,
  `cancelled`)와 고유 ID의 단계 목록을 소유합니다. 단계 상태는
  `pending`, `running`, `completed`, `failed`, `skipped`입니다.
- 완료·건너뜀 단계 수를 전체 단계 수와 함께 표시합니다. 이름 있는
  section, ordered list, native progress와 버튼을 사용합니다.
- `onCancel`은 대기·실행 중, `onRetry`는 실패·취소 때만 표시합니다.
  실제 작업 취소·재시도와 상태 갱신은 호출자가 맡습니다.
- `panel`·`compact` 표시를 공통 token으로 제공합니다. 전체 상태와
  단계 상태가 일시적으로 어긋나는 업데이트를 내부에서 보정하지
  않습니다.

## 검증 계획

이름·ID·상태 오류, 진행률·상태 표시와 작업 버튼의 노출·callback,
좁은 preview 배치를 확인합니다. export·registry·provenance·Usage,
typecheck·테스트·build·release 검사와 공개 경로를 확인합니다.
실제 보조기술·touch·Safari·RTL은 따로 기록합니다.

## 로컬 결과

- `npm run typecheck`, UI 테스트 156/156과 `npm run build`가
  통과했습니다. 로컬 registry는 118개 item입니다.
- Chromium에서 panel·compact, 취소→재시도, light/dark를
  확인했습니다. 390px 문서와 panel은 각각 390px·330px이며
  console error는 없었습니다.
- native progress의 기본 초록색을 발견해 공통 accent token으로
  고쳤습니다. 이 시점에는 registry 릴리스 검사와 공개 배포가
  남아 있었습니다.

## 릴리스 후보 검사

provenance를 source commit `59eba4f`에 고정했습니다.
`registry:release-check`가 로컬 116개 component·118개 item과
36번째 snapshot
`sha256-e226f4f19d9ee39e05548f7d6bcddee6d364e0238c910b2b811a0e2f5fc2a84e`를
확인했습니다. PR·공개 배포는 아직 검증하지 않았습니다.
