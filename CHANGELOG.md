# 변경 기록

## 2026-09-30 — RangeSlider

- 기존 Slider의 다중 thumb를 사용해 이름 있는 가격 범위 필터를
  추가했습니다. 최솟값과 최댓값은 별도 native form 값으로 제출됩니다.
- 문서에 키보드 조작·제출·초기화를 시험할 수 있는 preview와 Usage를
  추가했습니다. 새 npm runtime 의존성은 없습니다.

## 2026-09-30 — InputGroup과 모바일 SNB 위치

- 입력·textarea에 텍스트와 버튼을 붙이는 `InputGroup`을 추가했습니다.
  입력값과 버튼은 native form·keyboard 동작을 유지합니다. 문서에
  요청 ID 제출과 메모 저장 preview, Usage 코드를 추가했습니다.
- 모바일 SNB 선택 시 React 갱신 후 문서·SNB 스크롤 위치를 복원합니다.
  데스크톱의 본문 이동은 유지합니다.

## 2026-09-30 — DataChart 계열 표시 선택

- 다중 계열 `DataChart`에 `toggleableSeries`를 추가했습니다.
  계열을 숨기면 축·누적값·구간 값·데이터 표를 표시 중인 계열로
  다시 계산하며 색과 선 모양은 원래 계열 순서를 유지합니다.
- 문서 preview와 Usage에 선택형 범례를 추가했습니다. 새 component,
  npm dependency, registry item은 없으며 새 내용 해시 snapshot을
  발행합니다.

## 2026-09-30 — 기간 필터 조합 예시

- `FilterBar` 문서에 `DateRangePicker`를 결합한 적용·부분 선택 오류·
  초기화·결과 목록 preview와 복사 가능한 사용 코드를 추가했습니다.
- 기존 component와 registry item을 그대로 사용합니다.

## 2026-09-30 — Sidebar 섹션 탐색

- `Sidebar`에 이름 있는 `sections` 입력을 추가했습니다. 기존 평면
  `items` 입력은 유지하며, 한 번에 한 방식만 지정할 수 있습니다.
- 접힌 상태와 모바일 Drawer에서도 섹션 이름을 접근성 트리에 남깁니다.
  문서 preview에서 평면 목록과 섹션 목록을 전환할 수 있습니다.
- 새 npm dependency나 component·registry item은 없습니다. 변경된
  registry 소스로 새 내용 해시 snapshot을 발행합니다.

## 2026-09-29 — Markdown 부분집합

- React와 native 요소로 작성한 `Markdown`을 추가했습니다. 제목·문단·
  단층 목록·강조·코드·절대 HTTP(S) 링크를 표시하며, 원시 HTML과
  허용하지 않은 링크는 텍스트로 남깁니다.
- registry item과 내용 해시 snapshot을 추가하고 기존 snapshot을
  보존했습니다. 문서에서 원문을 편집하는 preview와 사용 코드를
  제공합니다.

## 2026-09-29 — 출처 고지 고정

- 수정한 shadcn/ui source의 소비자 고지에서 provenance URL을 특정
  commit으로 고정하고 파일 SHA-256을 기록했습니다. registry 검사가
  현재 metadata와 고지의 해시를 대조합니다.
- 현재 source로 새 내용 해시 snapshot을 만들었습니다. 기존 공개
  snapshot의 파일은 변경하지 않았습니다.

## 2026-09-29 — 공개 component 후속 수정

- 19개 문서 Usage에 필요한 registry item을 설치 명령에 추가하고,
  Usage import와 설치 목록의 폐쇄 관계를 자동 검사합니다.
- DataChart의 동일 극단값 좌표와 빈 구간 이름, DataTable의 변경된
  필터 옵션 처리 방식을 수정했습니다.
- CI가 untracked 문서 생성 파일도 찾도록 했습니다. rollback 시
  snapshot 주소 보존과 과거 release의 provenance 연결은 계속
  검토합니다.

## 2026-09-29 — component registry 확장

[PR #1](https://github.com/pydemia/ui/pull/1)을 `main`에 병합해
문서 사이트와 registry를 production에 배포했습니다. 현재 내용 해시
snapshot은
`sha256-48f182bbf4fafa4e209bb89acebf7e77b722f6aac842e1a3c90d974399d9ac93`입니다.

- component 모듈을 38개에서 89개로, 공용 item을 포함한 내부 registry를
  40개에서 91개 item으로 확장했습니다. 화면 구조의 AppShell·Sidebar·
  Navigation, 분석 화면의 DataChart·DonutChart·Dashboard·LogConsole,
  복합 입력의 Combobox·MultiSelect·DateRangePicker, 작업 화면의
  DataTable·Tree·CommandPalette와 AI 대화 component를 포함합니다.
- Spinner에 다섯 표시 형태를, Badge·MetricCard·DataChart·Navigation에
  용례별 표시 형태를 추가했습니다. Navigation의 기존 링크 스타일은
  기본값으로 유지합니다.
- `pyd-tokens`로 공통 stylesheet를 전달하고 수정한 shadcn/ui source의
  MIT 고지를 해당 registry item에 포함했습니다. 내용 해시 snapshot과
  빌드된 최신 item의 일치 검사를 추가했습니다.
- 이전 공개 item을 설치한 소비자를 신규 item으로 갱신하고,
  수정된 Badge·Button 파일의 덮어쓰기와 수동 재적용을 시험했습니다.
- DataChart가 부호가 다른 큰 유한값을 받아도 SVG 좌표와 축 눈금을
  유한하게 계산하도록 고쳤습니다.

개별 component의 동작 범위와 미검증 항목은 `research/verification.md`,
진행·인계 기록은 `.worknotes/`에 있습니다. 현재 package는 private
workspace이며 npm에 게시하지 않았습니다.
