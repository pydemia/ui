# Registry 설치 결과의 shadcn/ui 고지

2026-09-29. 저장소의 `THIRD_PARTY_NOTICES.md`에 shadcn/ui MIT 고지가
있었지만, 개별 registry item을 설치한 소비자에게는 전달되지 않았습니다.
수정한 shadcn/ui source 26개 각각에 `registry:file`을 추가하고
`@ui/SHADCN_UI_LICENSE.md`로 설치되도록 했습니다. 파일은 고정 revision
`98a1fe67b439324ddc857f47fbdce056600a4329`의 MIT LICENSE를
담습니다. `registry/provenance.json`의 `consumer_notice`와
`registry:check`가 이 관계를 검사합니다. component 61개와 registry
item 63개라는 개수는 바뀌지 않았습니다.

직접 `pyd-button` 설치와 `pyd-command-palette`를 통한 `pyd-dialog`·
`pyd-input` 전이 설치를 별도 Vite fixture에서 실행했습니다. 두 경우
모두 고지 파일이 생성됐고 내용이 원본과 일치했습니다. 전이 설치 후
fixture의 typecheck·build가 통과했습니다. 저장소의 `npm run typecheck`,
`npm run build`, `npm run registry:check`, `git diff --check`도
통과했습니다. 출력 JSON의 의존 URL은 공개 기본 주소로 복원했습니다.

나머지 23개 수정 source의 개별 CLI 설치, 공개 registry 설치, 실제
보조기술 확인은 실행하지 않았습니다. 이 변경은 아직 commit·push·
publish하지 않았습니다. 상단 로고 CSS만 별도 commit `bfec10d`로
게시됐으며, Vercel production `dpl_3b1hd1uLr7UhCMktDmGRrPf9uS98`의
`READY` 상태와 공개 화면의 테두리 제거를 확인했습니다.
