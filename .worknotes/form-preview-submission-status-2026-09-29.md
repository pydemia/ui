# Select·DatePicker 제출 상태 표시 수정

2026-09-29. 문서 사이트의 두 preview가 첫 렌더부터 `제출한 값: 없음`을
표시해 form 값이 전달되지 않는 것처럼 보였습니다. 공개 사이트에서
Select의 `editor`, DatePicker의 `2026-09-29`가 제출 후 실제로 표시되는
것을 확인했습니다. 컴포넌트의 form 전달 기능보다 preview 상태 문구가
원인이었습니다.

- `submitted`의 초기값을 `null`로 바꿔 제출 전과 빈 제출을 구분했습니다.
- 제출 전은 `아직 제출하지 않았습니다.`, 빈 제출은
  `선택한 값이 없습니다.`, 유효한 제출은 실제 form 값을 표시합니다.
- 값을 다시 선택하면 이전 제출 결과와 검증 오류를 지웁니다.
- 수정 범위는 `apps/docs/src/catalog.tsx`의 preview 두 곳입니다.
  `@pydemia/ui` 소스와 registry metadata는 변경하지 않았습니다.

## 검증

- `npm run typecheck`, `npm run build`, `npm run registry:check`,
  `git diff --check` 통과했습니다.
- 빌드된 문서의 Select에서 초기 상태, 빈 제출, `editor` 제출,
  이후 `reviewer`로 변경했을 때 결과 초기화를 브라우저에서 확인했습니다.
- DatePicker에서 초기 상태, 빈 제출, 2026-09-29 선택과 제출을
  브라우저에서 확인했습니다.
- 배포 후 공개 사이트 확인 결과는 아래에 추가합니다.
