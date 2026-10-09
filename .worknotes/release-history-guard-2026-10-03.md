# Registry release 이력 보존 검사 — 2026-10-03

## 변경 이유와 범위

현재 `registry:check`는 저장소에 남아 있는 snapshot의 파일 해시·
의존성·게시 복사본을 검사합니다. 그러나 과거 release의 원본과
게시 복사본을 함께 삭제한 커밋은 현재 목록 검사를 통과할 수
있습니다. Vercel Instant Rollback도 이전 배포에 없는 새 경로를
404로 만들 수 있습니다.

`scripts/check-release-history.mjs`는 PR base 또는 직전 `main`
commit과 HEAD를 비교해 `registry/releases/`·`docs/r/releases/`의
기존 파일 수정·삭제·파일 형식 변경을 거부합니다. 새 release 파일의
추가는 허용합니다. Verify UI에서 문서 전용 변경에도 이 검사를
실행하지만 npm 설치나 전체 빌드는 요구하지 않습니다. 판정할 base
SHA를 얻지 못하면 통과로 처리하지 않습니다.

README에는 과거 Vercel 배포를 그대로 다시 가리키는 Instant Rollback
대신 현재 `main` 위에 복구 커밋을 만드는 절차를 기록했습니다.
되돌리는 변경에 release 삭제가 포함되면 되돌리기 전 `main`에서
release 두 디렉터리를 복원하고 새 current snapshot을 만든 뒤
게시합니다. 이 검사는 기존 공개 경로를 새 빌드에 포함시키는
조건이며, 이미 수행한 Instant Rollback의 순간적인 404 자체를
막지는 못합니다.

## 확인

임시 Git 저장소 테스트에서 새 release 추가는 통과했고 기존 원본
수정·게시 복사본 삭제·base SHA 누락은 실패했습니다. 현재
`origin/main`을 base로 실행한 검사도 통과했습니다.

`npm run typecheck`, UI 테스트 265/265, `npm run build`,
`npm run prism:check`(30/30), `npm run registry:release-check`가
통과했습니다. Release 검사는 145개 현재 item·143개 export/catalog,
75개 불변 snapshot과 현재 ID의 일치를 확인했습니다. 빌드가 다시
생성한 추적 파일은 검사 후 원래 내용으로 복원했고 `git diff --check`도
통과했습니다. PR CI와 production의 실제 복구 배포는 미검증입니다.

Goal 관리용 추정은 약 99%입니다. 공급 중단 없는 rollback은
별도 호스팅 또는 배포 전략 변경이 필요하므로 아직 검증되지
않았습니다.

## 공개 후 확인

PR #137의 Verify UI run `37105986078`이 성공했고,
`5fb69999efef1e50109f7251fe7f419df42d13cc`로 `main`에
병합됐습니다. `main` Verify UI run `37106153119`와 Pages run
`37106152876`이 성공했습니다. Vercel production 배포
`dpl_ERFD4DvMwYmFMg6uBJFZn6KsCrXh`가 READY이고
`ui.pydemia.ai`·`pydemia-ui.vercel.app`을 가리킵니다. 사용자
도메인의 75번째 manifest와 Button item은 HTTP 200입니다.

새 CI 검사는 실제 PR·`main`에서 성공했습니다. 삭제·수정 실패
경로는 임시 Git 저장소에서만 시험했습니다. production을 과거
배포로 되돌리는 실험은 하지 않았고, Instant Rollback의 URL 손실
가능성은 그대로입니다.
