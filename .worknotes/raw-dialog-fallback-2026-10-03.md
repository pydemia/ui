# Dialog raw registry 공급 경로 — 2026-10-03

Vercel의 24시간 배포 횟수 제한 중에도 83번째 schema 2 snapshot을
설치할 수 있도록 README에 GitHub raw 명령을 추가했습니다. 이는
`ui.pydemia.ai` production 배포를 완료했다는 뜻이 아닙니다.

확인한 경로는 같은 digest의 manifest, `pyd-dialog`, `pyd-utils`,
`pyd-tokens`입니다. 네 URL이 모두 HTTP 200이고 저장소 파일과
문자열 단위로 일치합니다. `pyd-dialog`의 내부 의존성은 같은
snapshot의 GitHub raw `pyd-utils`를 가리킵니다. 설치 형식은 기존
schema 2와 같습니다.

후속 검증에서 새 Vite·React·Tailwind 소비자를
`%TEMP%/pydemia-ui-dialog-83-consumer-20261003`에 만들고 README의
두 URL을 `shadcn@4.21.0 add --yes`로 설치했습니다. CLI가 Dialog,
utils, token CSS, shadcn MIT 고지 네 파일을 생성했습니다. 설치된
Dialog만 import하는 화면의 `npm run typecheck`와 `npm run build`가
통과했습니다. 로컬 Chromium 1280×720에서 기본 모달 폭 512px,
넓은 모달 폭 896px, 전체 화면 1280×720을 확인했습니다. 열릴 때
닫기 버튼에 focus가 들어가고 Escape로 닫으면 열기 버튼으로
돌아왔습니다. 390px 화면, 실제 screen reader·touch·Safari·RTL은
이 소비자에서 검사하지 않았습니다.

의존성 설치를 별도로 확인하려고 Radix Dialog, `clsx`,
`tailwind-merge`가 없는 최소 소비자
`%TEMP%/pydemia-ui-dialog-83-minimal-20261003`에서도 같은 명령을
실행했습니다. CLI가 같은 네 파일을 만들고 package 의존성에
`@radix-ui/react-dialog@^1.1.23`, `clsx@^2.1.1`,
`tailwind-merge@^3.7.0`을 추가했습니다. 이 소비자의 typecheck와
build도 통과했습니다. 브라우저의 크기·focus 확인은 앞의 소비자에서
수행했습니다.

83번째 snapshot은
`sha256-25ca4393b38b8fcebbbd34ca3d8c73475e773a766e971da004f94e40728bc896`
입니다. Vercel production의 83번째 manifest·Dialog preview는
여전히 미공개입니다. Goal 관리용 추정은 약 99%입니다.
