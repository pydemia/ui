# Vercel rollback과 registry snapshot 공급

## 병합 후 공개 확인

PR #144를 squash 병합한 `main` commit은
`ff0bcae7928da0c52df54911920ab2b94093bc70`입니다. PR Verify UI
run `37113956965`, `main` Verify UI run `37114138481`, Pages run
`37114137833`이 통과했습니다. 새 raw manifest·TransferList·token·
utils는 HTTP 200이고 로컬 게시 파일과 문자열이 일치합니다. 빈 Vite
소비자에서 새 raw TransferList·token URL로 `shadcn@4.21.0 add`를
실행해 5개 파일을 설치했고 typecheck·build가 통과했습니다. 내부
의존성도 같은 raw release 경로로 받았습니다.

Vercel PR preview `dpl_DnB8ATxeX5HoUt9jR9WGq3iWVdga`는 READY입니다.
확인 시점의 production은 이전 `d1938377` 배포를 가리키며
`ui.pydemia.ai`와 `pydemia-ui.vercel.app`의 77번째 manifest는 404입니다.
GitHub raw 소비자 공급은 검증했지만 사이트 URL 게시 완료와 실제
Instant Rollback 시험은 검증하지 않았습니다. Goal 관리용 추정은
약 99%입니다.

기존 76개 snapshot은 manifest와 내부 의존성이 Vercel URL을 가리킵니다.
과거 배포로 Instant Rollback하면 그 배포에 없는 snapshot 파일은
404가 됩니다. GitHub Pages의 `pydemia.github.io/ui`는 현재 CNAME
설정으로 `ui.pydemia.ai`에 redirect되므로 별도 공급 경로가 아닙니다.

GitHub raw의 `main/docs/r/releases/`에서 76번째 item을 HTTP 200으로
받아 로컬 원본과 일치함을 확인했습니다. 별도 Vite 소비자에서 raw
주소를 root로 `shadcn@4.21.0 add`를 실행해 5개 파일 설치,
typecheck·build까지 통과했습니다. 그러나 기존 item의 전이 의존성은
Vercel을 가리킵니다. 이 시험만으로 기존 snapshot이 Vercel 없이
설치된다고 주장할 수 없습니다.

`registry-release.mjs`의 새 schema 2는 현재 빌드 item을 정규화한 뒤
GitHub raw의 같은 release 디렉터리를 manifest `baseUrl`과 모든
내부 의존성에 사용합니다. 공급 형식을 digest에 포함해 기존 schema 1
release를 수정하지 않고 새 ID를 만듭니다. 현재 원본 146개 item으로
77번째 snapshot
`sha256-c4275e165672ed0ab23e640a160305ac6949384bb206a1424243efc8851b8857`
후보를 만들었습니다. 기존 release 확인과 새 형식의 재생성·변조
거부 테스트가 통과했습니다.

로컬 검사: `node --test scripts/registry-release.test.mjs` 2/2,
`npm run typecheck`, `npm run build`, `npm run registry:snapshot`, 재빌드 후
`registry:release-check` 통과. 새 snapshot의 내부 의존성 245개가
모두 같은 GitHub raw release 경로를 가리킵니다. PR CI·`main` 공급 및
raw 경로의 새 release 소비자 설치는 아직 확인 전입니다. 과거
schema 1 URL의 rollback 중 404는 남습니다. Goal 관리용 추정은
약 99%입니다.
