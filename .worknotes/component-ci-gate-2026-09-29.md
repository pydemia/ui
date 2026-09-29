# Registry 공급 CI 검사

2026-09-29. `registry:release-check`의 ID 인자를 생략하면 현재 빌드된
registry item의 내용 해시에서 ID를 계산해 해당 snapshot을 확인합니다.
명시한 ID가 현재 내용과 다를 때 실패하는 동작은 유지합니다. fixture는
현재 item 변경과 `docs/r/` 최신 JSON 누락에서 두 실행 형태의 실패를
확인합니다.

`.github/workflows/verify.yml`은 PR과 `main` push에서 Node 24로 `npm ci`,
typecheck, package 테스트, build, `registry:release-check`, 생성된 `docs/`
diff 검사를 실행합니다. workflow는 `contents: read` 권한만 사용합니다.
Action 버전은 GitHub의 checkout·setup-node 공식 README의 v7 사용 예시를
확인했습니다. 로컬 무인자 검사는 현재 91개 item과 네 로컬 snapshot에서
통과했습니다. PR #1의
[GitHub Actions run](https://github.com/pydemia/ui/actions/runs/36572011594)은
성공했습니다. `verify` job에서 `npm ci`, typecheck, package 테스트,
build, 무인자 release 검사와 `git diff --exit-code -- docs`가 모두
실행됐습니다. 따라서 Linux의 생성 파일 일치도 확인했습니다.
코드·CI 변경 커밋 `2b41cfe`의
[후속 run](https://github.com/pydemia/ui/actions/runs/36572361755)도
`completed`·`success`입니다.

두 미공개 draft snapshot은 로컬 untracked 상태이므로 PR checkout의
검사 대상에 포함되지 않습니다. 현재 PR에는 보존한 이전 후보와 새 후보
두 snapshot이 있습니다. 공개 URL 설치와 production 배포는 남았습니다.
