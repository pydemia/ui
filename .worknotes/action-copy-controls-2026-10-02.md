# 선택 작업·복사 control 편입

2026-10-02 시작 공개 기준은 107개 component·109개 registry item·
26개 snapshot, goal 관리용 추정 약 82%입니다. `DataTable`의 선택
작업 영역은 표 내부에만 있고 `CodeBlock`과 `SnippetCopyButton`은
클립보드 상태 처리를 각각 가졌습니다. 두 반복 용례를 새 공개 control로
정리했습니다. AppShell의 floating panel과 Spinner 5개 variant는
이미 제공되므로 별도 이름으로 늘리지 않았습니다.

## 구현과 출처

- `ActionBar`는 선택 건수·작업·해제를 표 이외의 목록에서도 조합하는
  이름 있는 group입니다. inline·floating 배치를 제공합니다.
  `DataTable.renderActions` API는 유지하고 내부 선택 영역에 사용합니다.
  해제 뒤 focus는 표의 이름 있는 스크롤 영역으로 돌립니다.
- `CopyButton`은 icon·text 표시에서 같은 Clipboard API 성공·실패
  상태를 제공합니다. `CodeBlock`과 `SnippetCopyButton`은 이를
  사용하며 기존 이름과 문구를 유지합니다.
- 두 소스는 pydemia/ui 원본입니다. W3C Clipboard API·WAI-ARIA APG
  공식 문서와 정확한 `lucide-react@0.468.0` 배포 소스·manifest·ISC
  LICENSE를 확인했습니다. 기존 shadcn Button source·MIT LICENSE
  고지는 유지합니다. 세부 링크는
  [source inventory](../research/source-inventory.md)에 있습니다.
- public export, registry item·provenance, 문서 동작 preview·Usage를
  추가했습니다. 변경된 `DataTable`·`CodeBlock`·`Snippet`의 registry
  dependency도 맞췄습니다.

## 로컬 검증

- 저장소 typecheck, UI 테스트 124/124, build(111 item)가 통과했습니다.
- 문서 390px Chromium: icon 복사 성공, 입력값 변경 시 상태 제거,
  강제 Promise 거부 시 실패 표시, ActionBar 선택 2건·floating 배치·
  선택 해제 후 첫 checkbox focus, DataTable 해제 후 표 영역 focus와
  가로 넘침 없음이 통과했습니다.
- 변경 item 5개(`ActionBar`, `CopyButton`, `DataTable`, `CodeBlock`,
  `Snippet`)와 token을 새 Vite 소비자에 함께 CLI로 설치했습니다.
  의존 item을 포함한 15개 파일이 생성됐고 변경 소스 5개가 저장소와
  일치했습니다. 소비자 typecheck·build·390px Chromium 복사·일괄
  작업·DataTable 작업과 focus가 통과했습니다. 값을 바꾼 입력에
  Ctrl+V로 `REQ-2048`이 들어와 실제 복사 내용을 확인했습니다.
- 로컬 registry 의존 URL이 production을 가리켜 첫 CLI 설치가
  실패했습니다. 로컬 base URL로 전체 사이트를 재생성해 소비자 설치를
  확인한 뒤 production base로 되돌려 빌드했습니다. 생성된
  `docs/r`에는 로컬 URL이 남지 않았습니다.
- `registry:check`는 처음에 provenance와 소비자 고지의 이전 SHA-256
  불일치로 실패했습니다. source commit `3bfed76`과 현재 metadata
  해시로 고지를 고정한 뒤 통과했습니다. 27번째 snapshot
  `sha256-c8bdf24d84b03bff8fe382f2b73e678e3cd5f6e0df86b649bdaa4f78676e01f5`
  을 생성하고 `registry:release-check`로 111개 item·109개
  export/catalog·27개 snapshot과 현재 빌드의 일치를 확인했습니다.
- PR·production·공개 snapshot 소비자 검증은 남았습니다.
- 실제 screen reader·touch·Safari·RTL과 rollback 뒤 snapshot URL은
  미검증입니다.

공개 확인 전에는 goal 추정 약 82%를 유지합니다.
