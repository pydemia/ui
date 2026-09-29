# DateRangePicker 편입

2026-09-29. 기간 필터와 보고서 조회에서 반복되는 시작일·종료일
선택을 `DateRangePicker`로 제공합니다. 기존 `Calendar`와 `Popover`를
조합하는 `pydemia/ui` 원본 구현입니다. 외부 component source를
복사하지 않습니다.

값은 `null`(미선택), `{ from, to: null }`(시작일만 선택),
`{ from, to }`(완료)로 구분합니다. 날짜 문자열은 기존 `DatePicker`와
같은 `YYYY-MM-DD`이며 `startName`·`endName`의 hidden input으로
각각 제출합니다. 필수값 검증은 소비자 폼이 맡습니다. 범위가 끝나면
popover를 닫고 다시 열어 날짜를 고르면 새 범위를 시작합니다.
`minDate`·`maxDate`는 선택 가능한 달력 날짜를 제한하고,
`minNights`·`maxNights`는 기간 길이를 제한합니다. 초기화 버튼은
빈 값으로 돌아가는 명시적인 경로입니다.

선행 조사: DayPicker 9.14.0의 공식 range mode·접근성 문서,
설치된 `useRange.js`와 `addToRange.js`, 같은 버전의 MIT LICENSE를
확인했습니다. 기존 `pyd-popover`는 Radix Popover 1.1.23을 사용합니다.

## 구현과 공개 경로

`packages/ui/src/components/date-range-picker.tsx`를 package export와
`pyd-date-range-picker` registry item에 연결했습니다. `DatePicker`의
달력 날짜 파싱·포맷은 `calendar-date.ts`로 옮겨 두 component에서
공유합니다. 기존 DatePicker의 선택 및 제출 동작은 유지됩니다.

문서 catalog에는 실행 가능한 preview와 설치·사용 코드를 추가했습니다.
빈 상태 제출 시 오류를 표시하고, 완료한 기간은 시작일·종료일의 별도
form 값으로 보여 줍니다. `required` native 검사는 hidden input에
적용하지 않고, 소비자 form이 완료 여부를 검사합니다.

## 검증

- `npm run typecheck`: UI package, 문서 사이트, profile demo 통과.
- `npm run registry:build`, `npm run registry:check`: 64개 item 생성과
  provenance·파일 관계 검사 통과.
- `npm run build`: 기본 공개 URL로 정적 사이트와 64개 registry item을
  생성했습니다. `git diff --check`도 통과했고 생성 JSON에 로컬
  registry URL이 남지 않았습니다.
- server render: 빈 값과 완료 값의 hidden input, 잘못된 날짜·역순·
  범위 밖 값·기간 제한·중복 input 이름의 거부를 확인했습니다.
- 문서 사이트 Chromium: 빈 값 오류, 부분 선택 유지, 완료 후 닫힘,
  두 form 값 제출, 초기화, Enter 열기, Escape 닫기와 focus 복귀를
  확인했습니다. 완료 후 날짜 재선택은 새 부분 범위를 시작했습니다.
- 새 Vite 소비자 fixture에서 `shadcn add`로 기간 선택기와 token을
  설치했습니다. 7개 소스·고지 파일을 생성했으며 소비자 typecheck와
  build가 통과했습니다. 같은 소비자에서 날짜 상·하한, 최소 2박,
  최대 3박의 선택 동작을 Chromium으로 확인했습니다.

실제 screen reader 발표, touch, RTL, 좁은 화면의 레이아웃, 전체
registry item의 새 프로젝트 설치는 확인하지 않았습니다. 현재 변경은
로컬 작업 트리에 있으며 공개 registry 배포는 확인하지 않았습니다.
