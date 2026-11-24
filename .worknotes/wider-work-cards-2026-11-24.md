# Card와 Kanban 기본 너비 확대

- 요청 범위: 공통 Card 기본 너비와 Kanban 열을 352px로 맞추고 Track이 동일 원본을 편입할 수 있게 한다.
- 원본: `packages/ui/src/components/card-size.ts`의 `CARD_DEFAULT_WIDTH = 352` 한 줄. Card를 통해 공개 export하며 pyd-card registry가 `@ui/card-size.ts`로 설치한다. Kanban은 pyd-card를 registry 의존성으로 선언한다.
- Card: 기본 최소 너비를 352px와 부모 너비 중 작은 값으로 지정한다. 기존 block의 fluid 너비는 유지한다. compact 크기는 최소 너비를 지정하지 않으며 소비자는 `min-w-0`으로 기본 최소 너비를 명시적으로 해제할 수 있다.
- Kanban: 동일 상수를 사용한다. 열 너비는 보드의 container query 너비와 352px 중 작은 값이며 기존 가로 스크롤과 drag mechanics를 유지한다.
- FlowCanvas와 다른 체크아웃은 수정하지 않는다. source/build 검증 후 release snapshot·게시 작업은 부모 agent가 담당한다.
- 검증: `npm run test -w @pydemia/ui` 323/323 통과, `npm run typecheck` 전체 workspace 통과, `git diff --check` 통과. 초기 UI build는 sandbox의 esbuild ancestor 경로 접근 제한으로 실패했으며 동일 명령을 승인된 elevated 실행으로 재검사해 통과했다.
- registry build/check/snapshot과 실제 브라우저 검사·공개 배포 확인은 부모 agent에게 인계했다. Kanban provenance의 의존성도 pyd-card를 포함하도록 갱신했다.
