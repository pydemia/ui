# `main` 검증 범위 조정

2026-10-03. 공급·품질 기준의 반복 실행 비용 중 `main`의 비렌더링
문서 push에 적용되던 전체 UI 검사를 변경 범위에 맞게 줄였습니다.
PR과 push 모두 변경 전 commit에서 현재 checkout까지의 경로를
분류합니다. `.worknotes/*.md`, `research/*.md`, `README.md`,
`CHANGELOG.md`, `NEXT_SESSION.md`만 바뀌면 diff 공백 검사만
실행합니다. 코드, workflow, 생성된 `docs/`, registry 등은 기존 전체
typecheck·테스트·build·registry·현재 snapshot 검사를 유지합니다.
기준 commit이 없거나 diff를 구할 수 없으면 전체 검사로 처리합니다.

GitHub의 [push payload](https://docs.github.com/en/webhooks/webhook-events-and-payloads#push)
`before`는 push 전 ref의 commit입니다.
PR은 base commit을 사용합니다. 기준 commit을 fetch할 수 없는
경우에도 검사 범위를 줄이지 않도록 했습니다.

## 로컬 확인

- YAML parser(`js-yaml`)와 Bash `-n`이 workflow·run script를
  받아들였습니다.
- 현재 브랜치의 문서 전용 두 commit과 `origin/main` 사이에서는
  `full=false`가 나왔습니다.
- 생성된 docs 파일을 포함한 `origin/main^`부터 현재 HEAD까지는
  `full=true`가 나왔습니다.
- push 기준 SHA가 40개 0이면 `full=true`가 나왔습니다.
- `git diff --check`가 통과했습니다.

PR·`main`의 실제 Actions 실행은 아직 확인하지 않았습니다.
Vercel 빌드 여부는 이 workflow가 결정하지 않으며, 배포 횟수 제한도
이 변경으로 해소되지 않습니다. 새 component/item/snapshot 수는
없고 Goal 관리용 추정은 약 98%입니다.
