# TreeSelect 작업 기록

## 시작 상태와 판정

- Goal 관리용 진척도는 약 80%입니다. 공개 저장소에는 104개 component,
  106개 registry item, 21개 snapshot이 있고 공급·품질 조건은 5/10입니다.
- Spinner는 icon·ring·dots·bars·orbit 다섯 variant와 문서 예시가 있어
  이번에 수를 늘릴 근거가 없습니다.
- `Tree`는 계층 탐색·선택을, `Popover`는 팝업 표시를 맡습니다.
  조직·분류 선택에서는 선택 경로 표시, form 값·필수값·reset,
  팝업을 닫은 뒤 초점 복귀를 매번 조합해야 합니다. 이 흐름을
  `TreeSelect`로 묶습니다.

## 설계 범위

- 정적 계층의 단일 항목을 선택합니다. `id`는 전체 트리에서 고유하고
  비어 있지 않아야 하며, 비활성 부모의 자식도 선택할 수 없습니다.
- 선택한 경로를 trigger에 표시하고 native select로 form 값을
  전달합니다. 필수 선택 오류는 trigger에도 표시하며 form reset은
  uncontrolled 값으로 복원합니다.
- 기존 `Tree`의 방향키·Home/End·typeahead·Enter/Space 규칙과
  `Popover`의 Escape·밖 클릭·초점 복귀를 사용합니다. 원격 자식
  로딩·다중 선택·검색은 이번 단일 정적 선택 범위에 넣지 않습니다.
- Ant Design의 공식 TreeSelect 문서·동일 revision source·manifest·
  MIT LICENSE는 사용 용례 reference로만 확인했습니다. 코드는
  복사하지 않고 기존 pydemia/ui Tree·Popover를 조합합니다.

## 검증 계획

- SSR에서 경로·form 값·필수 상태·비활성 후손·잘못된 입력을
  확인합니다. typecheck, package test, build, registry release 검사,
  390px 문서와 별도 소비자의 선택·제출·reset·키보드 동작을 검사합니다.
- 실제 screen reader·touch·Safari·RTL은 실행 전까지 미검증입니다.

## 현재 검증

- `npm run typecheck`와 전체 패키지 테스트 113/113이 통과했습니다.
  선택 경로·native form 값·필수 상태·비활성 후손·잘못된 입력은
  전용 SSR 테스트 3/3으로 확인했습니다. 이후 label 표기 변경은
  전용 테스트 3/3으로 다시 확인했습니다.
- 로컬 390px Chromium에서 필수값 누락 시 오류 문구·trigger 초점,
  방향키·Enter로 하위 항목 선택, form 값 `design` 제출, reset 뒤
  빈 값, 재열기 시 선택한 하위 항목의 초점과 조상 확장, Escape 뒤
  trigger 초점 복귀, 비활성 `finance` 탐색 건너뛰기를 확인했습니다.
  body 폭은 390px이고 page error는 없었습니다.
- 처음에는 필수값 오류 시 팝업이 오류 문구를 덮었습니다. 오류를
  표시하고 trigger에 초점을 둔 채 팝업을 닫도록 수정했습니다.
  label을 보이게 표시하고 native select는 보조기술 트리에서 숨겼습니다.
- 최종 `npm run typecheck`, 전체 패키지 테스트 113/113,
  `npm run build`가 통과했습니다. 107개 registry item과 문서·
  프로필 예시를 생성했습니다. `registry:snapshot`에서 107개
  item·105개 export/catalog 대응과 기존 21개 snapshot을 확인하고
  22번째 ID
  `sha256-9a66acf0b0dea05be3123e7c613e2d384c5e9bf58662579357bfdfbeb980b690`을
  만들었습니다. 다시 빌드한 뒤 `registry:release-check`가 22개
  snapshot과 현재 빌드의 ID 일치를 확인했습니다. 소비자·공개
  배포는 아직 실행하지 않았습니다.

## 공개 소비자에서 발견한 reset 문제

- PR #30을 병합한 뒤 첫 공개 snapshot
  `sha256-9a66acf0b0dea05be3123e7c613e2d384c5e9bf58662579357bfdfbeb980b690`을
  새 Vite 소비자에 설치했습니다. 6개 파일은 snapshot 원본과
  일치했고 typecheck·build, 공개 preview의 선택·제출·reset이
  통과했습니다. 그러나 소비자에서 선택값 `ops`를 지우고 form
  reset을 실행하자 button은 `ops`로 돌아왔지만 native select의
  제출값은 빈 문자열로 남았습니다. 이 snapshot의 소비자 reset은
  실패이며 수정 전 공개 상태를 완료로 취급하지 않습니다.
- native reset은 reset 이벤트 뒤 `option.defaultSelected`를 기준으로
  select를 복원합니다. 현재 controlled value와 별개로, 기본 선택
  option을 `defaultValue`에 맞춰 DOM에 지정하도록 수정했습니다.
  수정 소스를 별도 소비자 fixture에 적용해 `ops` 선택값 제거 뒤
  reset 2회 모두 button과 native select가 `ops`로 돌아오는 것을
  390px Chromium에서 확인했습니다. fixture의 typecheck·build도
  통과했습니다. 새 snapshot과 공개 설치 재검사가 남았습니다.
