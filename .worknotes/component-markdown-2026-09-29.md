# Markdown 부분집합 편입

2026-09-29. AI 응답과 기술 문서에서 제목·목록·코드·링크를 각 제품이
다시 처리하지 않도록 `Markdown`을 추가했습니다. 기존 `MessageContent`
안에 놓을 수 있으며 새 외부 renderer 패키지를 설치하지 않습니다.
지원 문법과 의도적으로 제외한 문법은
[`design-contract.md`](../research/design-contract.md)에 기록했습니다.

## 출처와 범위

CommonMark 0.31.2 공식 명세는 문법 reference로만 사용했습니다.
명세의 예제나 파서 소스를 복사하지 않았습니다. 이 component는
React·native 요소·Tailwind token과 기존 `pyd-utils`로 직접
작성했습니다. `registry/provenance.json`은 project-owned 구현과
reference를 구분합니다. 새 npm dependency는 없습니다.

원시 HTML은 React 텍스트로 escape합니다. 링크는 절대 HTTP(S),
사용자 정보 없음, 제어 문자·역슬래시 없음 조건을 통과해야 실제
`a`가 됩니다. 이미지·상대 링크·표·중첩 목록 등은 지원하지
않습니다. `dangerouslySetInnerHTML` prop은 타입과 실행 시점 모두에서
거부합니다. heading은 주변 페이지 제목을 건너뛰지 않도록 `h2`부터
시작합니다. `pre`는 keyboard scroll을 위해 focus 가능합니다.

## 로컬 검증

- `npm run typecheck`, `npm test -w @pydemia/ui`의 56개 테스트
  (Markdown 8개 포함), `npm run build`, `npm run registry:release-check`가
  통과했습니다.
- 문서 preview에서 원문 편집, 허용한 HTTPS 링크, `javascript:`
  링크와 `<script>`의 텍스트 표시를 확인했습니다.
- 새 Vite 소비자 `pydemia-ui-markdown-consumer-20260929`에
  `shadcn@4.21.0 add`로 Markdown·utils·tokens 세 파일을 설치했습니다.
  원본 Markdown 파일 일치, 소비자 typecheck·build, Chromium 제목·
  목록·링크 렌더링을 확인했습니다. HTML prop 차단 수정 뒤 최신 item을
  덮어 설치하고 소스 해시 일치·typecheck·build를 다시 확인했습니다.
- 같은 소비자에 현재 private package tarball을 설치해 문서 Usage의
  `@pydemia/ui` import를 별도 TSX로 typecheck했습니다. 이 검사는
  npm 게시를 의미하지 않습니다.
- 새 Vite 소비자 `pydemia-ui-all-registry-92-consumer-20260929`에
  92개 item을 12개씩 나눈 8회 CLI 호출로 설치했습니다. 원본 JSON과
  94개 생성 파일이 일치했고 90개 모듈의 typecheck·build,
  Chromium에서 212개 값 export 로딩과 console error 0건을
  확인했습니다. 한 CLI 호출에 92개 URL을 모두 넣는 Windows 명령은
  길이 제한으로 실행되지 않았습니다.
- 새 snapshot ID는
  `sha256-70c4a56811508257fe1131e7ab65e3ab3836e60934bba5a16f58c0e8a66fe000`
  입니다. 현재 빌드·`docs/r/`·snapshot 내용이 일치합니다.

snapshot JSON의 내부 의존성은 같은 ID의 production URL을 가리킵니다.
공개 전 로컬 소비자에서 그 URL은 404이므로 전체 설치 검사는 로컬
base URL로 한 번 빌드한 최신 `/r/`를 사용했습니다. 이후 기본
production base URL로 다시 빌드해 `registry:release-check`를
통과했습니다. 공개 snapshot URL 설치는 배포 뒤 별도로 확인해야
합니다. 기존 미공개 draft snapshot 네 디렉터리는 이번 변경에
포함하지 않습니다.

처음 생성한 `ab03eb99` 후보는 공개 전에 HTML prop 차단을 추가하면서
폐기했습니다. [PR #4](https://github.com/pydemia/ui/pull/4)에 최신
snapshot과 수정 사항을 반영합니다.

실제 screen reader 발표, 다른 브라우저·기기의 동작과 새 공개 ID의
장기 URL 보존은 미검증입니다. 이번 검사 결과는 전체 CommonMark
호환 또는 임의 HTML의 렌더링을 뜻하지 않습니다.
