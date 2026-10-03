# Intake workspace 조합 예시

2026-10-03. `FormWizard`, `Field`, `Input`, `NativeSelect`,
`DateRangePicker`, `FileUpload`, `DataList`, `DataTable`, `Badge`,
`PageHeader`로 요청 접수 화면을 구성했습니다. 세 단계에서 요청 정보,
기간·첨부 예정 목록, 제출 전 요약을 보여 줍니다. 제출하면 로컬 표에
행을 추가하고 입력을 초기화합니다. 파일은 이름과 개수만 로컬 상태에
보관하며 전송하지 않습니다. 서버 저장도 실행하지 않습니다.

공백만 있는 제목·담당 팀과 종료일이 없는 기간은 다음 단계 또는
제출을 막습니다. 이 화면은 기존 component의 조합이므로 새 public
component·registry item·snapshot은 없습니다. 문서의 실행 preview,
원본 코드 링크, 설치에 필요한 item URL을 추가했습니다.

확인한 내용:

- `npm run typecheck`, `npm run build`,
  `npm run registry:release-check`가 통과했습니다. 검사 결과는
  143개 component export, 145개 item, 75개 snapshot입니다.
- 로컬 Chromium에서 공백 제목·기간 누락 차단, 날짜 두 개와 파일
  선택, 확인 단계의 값, 제출 뒤 새 행·건수·입력 초기화를 확인했습니다.
- 390px에서 페이지 가로 넘침은 없고 표 안에서만 가로 스크롤됐습니다.
  브라우저 console error는 0건입니다.

공개 후보 CI와 production의 새 예시 코드는 아직 확인하지 않았습니다.
이 예시는 프런트엔드 조합의 동작만 보여 주며 실제 파일 전송과
서버 저장을 검증한 결과로 해석하지 않습니다.
