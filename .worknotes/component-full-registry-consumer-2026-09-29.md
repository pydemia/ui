# 전체 registry 소비자 설치

2026-09-29. 현재 로컬 작업 트리의 78개 registry item을 새 Vite 소비자
앱에 한 번에 설치해 공급 경로를 확인했습니다. component·registry 총수는
76개·78개로 그대로입니다.

## 검사 방법과 결과

로컬 `http://127.0.0.1:5173/r/`를 내부 의존성 URL로 지정해
`npm run build`를 실행한 뒤, 임시 소비자에서 `npx shadcn@latest add`
명령에 78개 item URL을 전달했습니다. 80개 파일이 생성됐습니다.
그중 TypeScript 모듈 78개는 저장소 원본과 모두 같고, token CSS와
shadcn/ui MIT 고지 파일도 각각 원본과 같았습니다.

소비자 `tsc --noEmit`과 Vite build가 통과했습니다. 모든 78개 모듈을
정적 import한 브라우저 화면에서 192개 export를 읽었고 console error는
없었습니다. `npm audit --omit=dev --audit-level=high`는 0건입니다.
build의 단일 JS chunk 크기 경고는 전 모듈을 강제로 가져온 검사
앱에서 발생했습니다. 각 component의 상호작용 검증 결과는 아닙니다.

`scripts/check-registry.mjs`에 생성 JSON의 각 파일 내용과 현재 원본
소스의 일치 검사를 추가했습니다. 기본 공개 URL로 다시 `npm run build`를
실행한 뒤 `npm run registry:check`가 78개 item에서 통과했습니다.

TypeScript AST로 확인한 76개 component module은 `index.ts` export,
registry item, 문서 catalog ID가 모두 1:1로 대응합니다. Catalog의
사용 코드 76개를 각각 TSX 파일로 추출하고, 별도의 최상위 JSX 예시
사이에 세미콜론만 넣어 소비자에서 typecheck했습니다. 로컬 package
symlink는 `react-day-picker` 타입을 두 물리 경로로 읽어 날짜 예시 3개에
가짜 오류를 만들었습니다. `npm pack` tarball을 설치하자 76개 모두
통과했습니다. Tarball과 전체 registry module을 함께 import한
소비자 build·브라우저도 통과했고 console error는 없었습니다.
registry module의 값 export 합계 192개와 package 공개 export
188개의 차이 4개는 `buttonVariants`, `formatCalendarDate`,
`parseCalendarDate`, `cn`이며 내부 유틸리티입니다.

임시 소비자 경로:
`C:\Users\pydemia\AppData\Local\Temp\pydemia-ui-all-registry-consumer-20260929`.

## 남은 검증

각 item의 독립 설치, 사용 코드 전체의 실제 동작, 기존 소비자
파일을 갱신할 때의 충돌, screen reader·다른 브라우저·touch,
공개 배포는 이번 검사에 포함하지 않았습니다.

## 2026-09-29 현재 84개 item 동시 설치

82개 component와 공용 2개 item이 있는 현재 작업 트리를 다시
검사했습니다. `PYDEMIA_REGISTRY_BASE_URL`을 로컬 서버로 지정해
`npm run build`를 실행하고, 완전히 새 Vite 소비자 프로젝트에서
`npx shadcn@4.0.0 add`에 84개 item URL을 한 번에 전달했습니다.
CLI가 86개 파일을 생성했습니다. 84개 TypeScript 모듈, token CSS,
MIT 고지의 내용은 줄바꿈을 정규화한 뒤 저장소 원본과 모두 같았습니다.

소비자 앱에서 84개 모듈을 동시에 정적 import한 `tsc --noEmit`과
Vite build가 통과했습니다. 브라우저에는 84개 모듈과 값 export
203개가 표시됐고 console error는 0건이었습니다.
`npm audit --omit=dev --audit-level=high`도 취약점 0건입니다.
모든 모듈을 한 chunk에 넣은 검사 앱에서 500 kB 경고가 발생했으며,
이를 일반적인 소비자 번들 크기로 해석하지 않습니다.

저장소의 기본 공개 URL로 `npm run build`를 다시 실행했습니다.
`npm run typecheck`, `npm run registry:check`(84개 item),
`git diff --check`가 통과했고 생성된 `pyd-scroll-area.json`의
의존성 URL이 `https://pydemia-ui.vercel.app/r/`로 복원됐습니다.

임시 소비자 경로:
`C:\Users\pydemia\AppData\Local\Temp\pydemia-ui-all-registry-84-consumer-20260929`.

같은 fixture에 현재 빌드의 `@pydemia/ui` tarball을 설치해 catalog의
사용 코드 82개를 각각 TSX 파일로 추출했습니다. 독립적인 최상위 JSX
예시 사이에 세미콜론만 넣어 TypeScript 문장으로 구분했습니다.
82개 코드의 소비자 `tsc --noEmit`이 통과했습니다. workspace symlink
대신 실제 tarball 설치를 사용해 중복 의존성 타입 경로를 피했습니다.

이번 검사는 동시 신규 설치, module loading, 사용 코드의 정적
typecheck를 다룹니다. 84개 item 각각의 독립 설치, component
상호작용 전체, 소비자가 수정한 파일의 갱신 충돌, screen reader·
touch·다른 브라우저·공개 배포는 검증하지 않았습니다.

## 2026-09-29 현재 86개 item 동시 설치

`AvatarGroup`과 `ButtonGroup`을 포함한 84개 component와 공용 2개 item을
새 Vite 소비자 프로젝트에 한 번에 설치했습니다. 로컬 registry URL을
사용해 빌드한 다음 `npx shadcn@4.0.0 add`에 86개 item URL을 전달했고,
CLI가 88개 파일을 생성했습니다. registry가 참조하는 86개 TS/TSX 모듈,
token CSS, MIT 고지 파일은 줄바꿈 정규화 후 원본과 모두 같았습니다.

소비자에서 86개 모듈을 모두 정적 import한 `tsc --noEmit`과 Vite build가
통과했습니다. 브라우저에 86개 모듈·206개 값 export가 표시됐고
console error는 0건이었습니다. `npm audit --omit=dev
--audit-level=high`는 취약점 0건입니다. 모든 모듈을 한 chunk에 넣은
검사 앱의 500 kB 경고는 일반적인 소비자 번들 크기를 나타내지 않습니다.

기본 공개 URL로 저장소 `npm run build`를 다시 실행했습니다. 이어
`npm run typecheck`, `npm run registry:check`(86개 item),
`git diff --check`가 통과했습니다. 생성된 `pyd-button-group.json`과
`pyd-avatar-group.json`의 의존성 URL은
`https://pydemia-ui.vercel.app/r/`로 복원됐습니다.

임시 소비자 경로:
`C:\Users\pydemia\AppData\Local\Temp\pydemia-ui-all-registry-86-consumer-20260929`.

이번에는 현재 catalog의 사용 코드 84개를 tarball 소비자에서 다시
typecheck하지 않았습니다. 앞선 83개까지의 검사 결과와 구분합니다.
86개 item의 개별 격리 설치 전체, 실제 component 상호작용 전체,
소비자가 수정한 파일의 갱신·충돌·복구, screen reader·touch·다른
브라우저 및 공개 배포도 확인하지 않았습니다.

## 2026-09-29 현재 87개 item 동시 설치

`DateTimePicker`를 포함한 현재 85개 component와 공용 2개 item을
새 Vite 소비자 프로젝트에 한 번에 설치했습니다. 로컬 URL의 87개
item을 `shadcn@4.0.0 add`에 전달했고 CLI가 89개 파일을 만들었습니다.
registry가 참조하는 87개 TS/TSX 모듈, token CSS, MIT 고지의 내용은
줄바꿈을 정규화한 뒤 저장소 원본과 모두 같았습니다.

87개 모듈을 정적 import하는 소비자 앱의 `tsc --noEmit`과 Vite build가
통과했습니다. `npm audit --omit=dev --audit-level=high`는 취약점
0건을 반환했습니다. 모든 모듈을 한 chunk로 묶은 검사 앱에 500 kB
경고가 있었으며 이를 일반적인 소비자 번들 크기로 해석하지 않습니다.
이번 fixture는 브라우저에서 실행하지 않았습니다.

이후 기본 공개 URL로 저장소 `npm run build`를 다시 실행했습니다.
`registry:check`는 87개 item과 85개 component 대응을 확인했고
`git diff --check`도 통과했습니다. 생성 JSON에서 로컬 URL은
발견되지 않았습니다.

임시 소비자 경로:
`C:\Users\pydemia\AppData\Local\Temp\pydemia-ui-all-registry-87-consumer-20260929`.

item별 독립 설치 전체, 사용 코드 전체의 실제 동작, 소비자가 수정한
파일의 갱신·충돌·복구, screen reader·touch·다른 브라우저 및
공개 배포는 이 검사에 포함하지 않았습니다.
