# Dialog raw registry 공급 경로 — 2026-10-03

Vercel의 24시간 배포 횟수 제한 중에도 83번째 schema 2 snapshot을
설치할 수 있도록 README에 GitHub raw 명령을 추가했습니다. 이는
`ui.pydemia.ai` production 배포를 완료했다는 뜻이 아닙니다.

확인한 경로는 같은 digest의 manifest, `pyd-dialog`, `pyd-utils`,
`pyd-tokens`입니다. 네 URL이 모두 HTTP 200이고 저장소 파일과
문자열 단위로 일치합니다. `pyd-dialog`의 내부 의존성은 같은
snapshot의 GitHub raw `pyd-utils`를 가리킵니다. 설치 형식은 기존
schema 2와 같아 별도 소비자 설치를 반복하지 않았습니다.

83번째 snapshot은
`sha256-25ca4393b38b8fcebbbd34ca3d8c73475e773a766e971da004f94e40728bc896`
입니다. Vercel production의 83번째 manifest·Dialog preview는
여전히 미공개이며, 실제 screen reader·touch·Safari·RTL 검사는
이번 문서 변경에서 수행하지 않았습니다. Goal 관리용 추정은 약
99%입니다.
