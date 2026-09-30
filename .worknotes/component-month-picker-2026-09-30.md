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

`agent-browser` CLI가 현재 shell PATH에 없어 브라우저 조작은 Codex
in-app browser로 수행했습니다. provenance pin, snapshot,
`registry:check`, 공개 배포·소비자 재검증은 진행 중입니다.
실제 screen reader·touch·Safari·RTL은 미검증입니다.

기존 미공개 draft snapshot 네 디렉터리는 stage하지 않습니다.
