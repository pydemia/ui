# MonthPicker 편입

월별 보고서·필터의 `YYYY-MM` 값을 직접 선택하도록 `MonthPicker`를
추가했습니다. 기존 `DatePicker`의 일자 값과 구분합니다. 입력은
controlled `value: string | null`, form 값은 `YYYY-MM` 또는 빈 문자열이며
포함 경계 `min`·`max`를 받습니다. 범위 밖 월과 연도 이동은
비활성화하고 잘못된 형식·역전 경계·범위 밖 controlled 값은 오류로
알립니다. 소비자가 `Field`에서 필수값 오류를 표시합니다.

MUI X 공식 MonthCalendar 문서와 revision
`a87939ed420ab1d77102a3db121fdc918080c5c3`의 소스·manifest·
MIT LICENSE를 확인했습니다. 월 그리드와 경계 상태만 참고했으며
MUI 코드는 복사하지 않았습니다. 새 파일은 React, 기존 Radix Popover,
`pyd-utils`, `lucide-react`를 사용합니다. 직접·전이 의존성 세부 내용은
`research/source-inventory.md`에 있습니다.

`skills.pydemia.ai`의 `reference-research`, `frontend-development`,
`software-engineering` 페이지 원문을 확인했습니다. 페이지가 표시한
revision은 `cda8c5e1016d`입니다. 연결된 GitHub source는 익명
요청에서 404였으므로 원문 파일의 내용 해시는 확인하지 못했습니다.

## 로컬 검증

- 저장소 typecheck와 build가 통과했습니다. build는 99개 registry item을
  생성했습니다. 전체 패키지 테스트 91/91이 통과했습니다.
- 문서 Chromium에서 2025-11 하한, 2027-03 상한, 범위 밖 월·연도
  비활성화를 확인했습니다. Tab·Enter로 2026-09를 골라 제출했고
  Escape 뒤 포커스가 trigger로 돌아왔습니다. 390px 화면에서 팝오버는
  좌우 49~337px 안에 있으며 body 375px, viewport 390px입니다.
  dark와 Pydemia colormap에서 선택 월의 token 색상 변화를 확인했습니다.
- 격리 소비자
  `C:\Users\pydemia\AppData\Local\Temp\pydemia-month-consumer-20260930`에
  `shadcn@4.21.0`으로 MonthPicker와 token을 설치했습니다. 5개 파일이
  생성됐고 MonthPicker·Popover·utils·tokens는 원본과 내용이 같습니다.
  소비자 typecheck·build, Chromium의 2027-03 선택·제출, 390px
  body 390px와 console error 0건을 확인했습니다.
  `required`를 제거한 fixture에서 선택된 2026-09를 다시 눌렀을 때
  hidden form 값과 상태가 비워지는 것도 확인했습니다.

`agent-browser` CLI가 현재 shell PATH에 없어 브라우저 조작은 Codex
in-app browser로 수행했습니다. provenance는 source commit
`f77fd2b4732920eeda6493defd142d40682af4c6`와 LF SHA-256
`d13b41fee36fa94e6bd0241d377b1bcc368a6807a3e5e48ef9acf39060a5ba1b`로
고정했습니다. `registry:release-check`는 99개 item·97개 component·
18개 snapshot과 현재 ID
`sha256-cf9756bda03bc7dc75f4c9c0f496b1f83ac0d5c0808557b21ff543e9fd408de4`를
확인했습니다. PR #20의 수정 CI, 병합 commit `14830a6`의 Verify UI와
Pages CI가 모두 통과했습니다. 공개 `ui.pydemia.ai`는 Vercel에서
MonthPicker 문서와 현재·snapshot registry JSON을 제공하며, 세 JSON은
로컬 `docs/` 출력과 줄바꿈 정규화 후 일치했습니다.

공개 390px preview에서 2026-09 선택·form 제출, 팝오버 좌우 49~337px,
body 375px/viewport 390px, console error 0건을 확인했습니다. 공개
snapshot을 새 Vite 소비자에 `shadcn@4.21.0`으로 설치해 5개 파일을
받았고 MonthPicker·Popover·utils·tokens가 원본과 일치했습니다.
소비자 typecheck·build가 통과했고 Chromium에서 2027-03 선택·제출,
범위 밖 월 비활성화와 390px 가로 overflow 없음, console error 0건을
확인했습니다. 소비자 fixture는
`C:\Users\pydemia\AppData\Local\Temp\pydemia-month-public-consumer-20260930`에
있습니다.
실제 screen reader·touch·Safari·RTL은 미검증입니다.

PR #20의 첫 Verify UI는 정적 사이트 재생성 단계에서 실패했습니다.
Windows checkout의 `scatter-chart.tsx`가 CRLF여서 기존 여러 줄
className 문자열의 `\r`이 bundle에 남고 Linux CI의 LF bundle과
해시가 달라졌습니다. 해당 파일에 LF checkout을 지정하고 working tree를
LF로 맞춘 뒤 Windows·WSL Linux(Node 24.16.0) 빌드가 모두
`index-BvASmG7m.js`를 생성하며 SHA-256
`421592cecd733e081f6d08b1d9863798c04f8464a2f6a6eb4e03f1f0827a5951`로
일치했습니다. 수정 후 PR Verify UI도 통과했습니다.

기존 미공개 draft snapshot 네 디렉터리는 stage하지 않습니다.
