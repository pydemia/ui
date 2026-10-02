# Draft PR의 registry snapshot 검사 분리

새 component의 초안 수정마다 전체 item snapshot을 복제하던 절차를
줄입니다. 기존 `Verify UI`는 모든 PR에서
`registry:release-check`를 실행해 현재 빌드와 같은 불변 snapshot을
요구했습니다. Lightbox item 하나를 공개할 때 생성 파일을 포함한
285개 파일이 바뀌었습니다.

## 변경한 실행 시점

- 모든 PR과 `main`은 `registry:check`로 export·catalog·registry·
  provenance 대응과 이미 공개한 snapshot의 무결성을 검사합니다.
- Draft PR은 새 현재 snapshot이 없어도 초안 CI를 확인할 수
  있습니다. Draft는 GitHub에서 병합할 수 없습니다.
- Review 준비를 마친 PR과 `main`은 `verify-current`로 현재
  빌드와 일치하는 snapshot 및 `docs/r` 전달 파일을 검사합니다.
  Draft를 ready로 바꾸거나 되돌릴 때 workflow를 다시 실행합니다.

GitHub의 [pull_request 이벤트 문서](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)는
`ready_for_review`·`converted_to_draft`를 지원합니다.
[Draft 상태 문서](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/changing-the-stage-of-a-pull-request)는
ready 전 병합 불가를 명시합니다. 기존 `Verify UI` job 이름은
유지합니다.

로드맵 하단의 중복된 여섯 단계도 앞의 위험별 기준 한 곳으로
합쳤습니다. 품질 하한이나 공개 후보의 snapshot 조건은 바꾸지
않았습니다. Goal 관리용 진척은 약 93% 그대로입니다.

YAML을 `js-yaml`로 파싱해 이벤트와 조건식을 확인했습니다. 로컬
`registry:check`와 `verify-current`도 통과했습니다. PR #70의 draft
run `36958128057`에서는 registry·기존 snapshot 검사가 통과하고
현재 snapshot 단계가 `skipped`였습니다. Ready 전환만으로 시작된
run `36958306206`에서는 현재 snapshot 단계까지 통과했습니다.
따라서 전환 이벤트와 두 검사 시점이 실제 GitHub Actions에서
동작합니다. PR #70 병합 commit `331dcb5`의 Verify UI run
`36958691424`에서는 기존 snapshot 검사와 `verify-current`가
모두 통과했습니다. Pages run `36958690442`도 성공했고 Vercel
production `dpl_CpFu4uJfGLVF3vw3qhrxtY6Ej6om`은 READY입니다.

남은 절차 비용은 모든 PR의 과거 snapshot 전수 검사, 문서·기록 변경에도
실행되는 전체 typecheck·테스트·build, provenance 검증 문구의 수정이
전체 snapshot을 바꾸는 구조입니다. 이번 작업에서는 이를 변경하지
않았습니다.
