# Autocomplete 작업 기록

2026-10-03 공개 재확인: `ui.pydemia.ai`의 현재
`pyd-autocomplete.json`과 71번째 manifest·snapshot Button item이
HTTP 200입니다. 현재 registry는 142개 item이며 Autocomplete를
포함합니다. 아래의 404 기록은 병합 직후 상태입니다. 실제 screen
reader·touch·Safari·RTL 검증은 여전히 남았습니다.

2026-10-03. 기존 `Combobox`는 목록의 ID를 선택해야 form에 값을
전달합니다. 새 팀·태그 후보처럼 추천 목록 밖의 이름을 입력할 수 있는
필드에는 별도 문자열 규칙이 필요합니다. `Autocomplete`는 입력한
텍스트 하나를 native form에 전달하고 추천어는 입력을 돕는 선택적
목록입니다. component 수를 맞추기 위한 별칭이 아닙니다.

원본 React·Tailwind 코드이며 `pyd-input`·`pyd-utils`를 재사용하고
새 npm 의존성은 없습니다. W3C APG의 manual list autocomplete
동작을 참고했고 예제 코드는 복사하지 않았습니다. 추천어 선택 전의
입력, IME, Escape, reset, loading과 controlled 값을 대상 테스트
4개로 확인했습니다. 전체 UI 테스트 251/251, typecheck·build,
PRISM 검사 23/23이 통과했습니다. 로컬 Chromium의 390px preview에서
자유 텍스트 제출, 방향키·Enter와 마우스 추천어 선택을 확인했습니다.
registry 고지의 고정 provenance commit·SHA-256과 71번째 snapshot,
`registry:release-check`를 확인했습니다. 릴리스 ID는
`sha256-ab149be9df7a468a1002ed3461c04dce1c3442fe0a32a796ad06ec010688a458`입니다.
로컬 후보는 140개 component·142개 registry item입니다. 실제 screen
reader·touch·Safari·RTL은 실행하지 않았습니다. Goal 관리용 추정은
약 98%로 유지합니다.

PR #127을 만들었습니다. 그 사이 `main`에 PRISM 게시 변경이 병합되어
브랜치에 반영하고 문서 산출물을 최신 소스로 다시 만들었습니다. 병합
과정에서 `scripts/check-prism.mjs`의 가상 Usage 경로 비교가 Windows의
`\\`와 `/`를 구분해 10개 파일을 찾지 못했습니다. 경로 구분자를 맞춘 뒤
PRISM 검사 23/23과 완전한 Usage 예제 10개 typecheck, 전체 typecheck,
build, registry release 검사가 통과했습니다. Vercel 상태는 배포 횟수
제한으로 실패했습니다. 이는 component 동작 결함과 구분해 공개 대기로
기록합니다.

PR #127의 Verify UI run `37092295178`이 통과했고 merge commit
`8f7f9b652ad7e1b73a48aad2c2bdfa2fc094ae69`의 Verify UI run
`37092485686`과 Pages run `37092485327`도 통과했습니다. Vercel
status는 build rate limit 실패입니다. `ui.pydemia.ai`의 현재
`pyd-autocomplete.json`과 71번째 manifest, Vercel 기본 도메인의
현재 item은 모두 HTTP 404입니다. 저장소는 140개 component·142개
item·71개 snapshot이고, 확인된 공개 수량은 기존 138개·140개입니다.
배포 제한이 풀리면 production과 현재 item·snapshot manifest의 공개
접근을 다시 확인해야 합니다. Goal 관리용 추정은 약 98%입니다.
