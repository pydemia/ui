# DateTimePicker 편입

DatePicker의 달력 날짜와 TimePicker의 `HH:mm`을 controlled 상태로
조합했습니다. `date`와 `time` 중 하나만 선택해도 다른 부분을
보존합니다. `name`이 있으면 둘 다 완성됐을 때만 로컬 날짜시각과
IANA 시간대를 별도 hidden input으로 전송합니다. 부분 선택은 두 form
값을 모두 빈 문자열로 둡니다. 문서에는 `Asia/Seoul`, 24시간제,
5분 간격의 동작 preview와 사용 코드를 추가했습니다.

새 외부 source나 npm dependency는 없습니다. 기존 DatePicker와
TimePicker의 공식 문서·고정 source·LICENSE 조사 내용은
`research/source-inventory.md`에 있습니다. 직접 registry 의존성은
`pyd-date-picker`, `pyd-time-picker`, `pyd-utils`입니다. 시간대 이름은
지원 여부를 검사하지만 UTC instant로 변환하지 않습니다. DST의
누락·중복 로컬 시각 해석과 제출 단계의 유효성 검사는 소비자가
맡습니다.

로컬 문서 Chromium에서 빈 제출 오류, 날짜→시각과 시각→날짜 선택,
`2026-09-29T13:35 · Asia/Seoul` 및
`2026-09-29T09:10 · Asia/Seoul` 제출을 확인했습니다. 날짜를
지우면 시간은 남고 제출 값은 빈 상태로 돌아갔습니다. 390px 화면에서
문서 전체의 가로 넘침은 없었고 console error는 0건이었습니다.

격리 fixture는
`C:\Users\pydemia\AppData\Local\Temp\pydemia-ui-date-time-picker-consumer-20260929`입니다.
로컬 registry URL에 `shadcn@4.0.0 add`를 실행해 token·MIT 고지를
포함한 10개 파일을 설치했고, 줄바꿈 정규화 후 모두 원본과
일치했습니다. 소비자 typecheck·Vite build가 통과했습니다.
패키지 테스트 28개, 저장소 typecheck·build·registry:check가
통과했습니다. 기본 공개 URL로 87개 registry item을 생성했고
85개 원본·public export·catalog entry의 1:1 대응을 확인했습니다.
`git diff --check`도 통과했습니다. 문서 Vite build는 500 kB 초과
chunk 경고를 출력했지만 빌드는 완료됐습니다.

실제 screen reader 발표, 전 경로 keyboard 탐색, touch, 다른 브라우저,
DST 경계 시각 처리, 87개 item 동시 재설치와 갱신 충돌·복구,
새 문서 사용 코드의 tarball 소비자 typecheck, 공개 배포는 검증하지
않았습니다.
