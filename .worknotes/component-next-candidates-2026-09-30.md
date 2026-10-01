# 다음 component 후보 판정

2026-09-30 현재 catalog는 97개 component·16개 범주입니다. 이 목록은
구현 확정안이 아닙니다. 실제 소비자 화면에서 반복 사용과 상태 소유를
확인한 뒤 API와 설치·검증 범위를 정합니다. 100개라는 숫자에 맞춰
추가하지 않습니다.

## 독립 동작이 있어 우선 조사할 후보

- `Editable` — 구현: 보기·편집 전환, 저장·취소, 유효성 오류와 비동기
  저장 실패 후 초안 보존을 맡습니다. 이름 변경 preview와 별도 소비자
  검증 범위는 [작업 기록](component-editable-2026-09-30.md)을 참고합니다.
  `DataTable` 행 편집은 별도 상태 소유가 필요해 포함하지 않았습니다.
- `TreeSelect`: 계층의 한 항목을 선택해 form 값으로 제출하는 흐름이
  필요합니다. 기존 `Tree`는 계층 탐색·선택, `Popover`는 표시만 담당해
  팝업 선택기의 키보드·포커스·값 명세는 따로 없습니다. 조직·분류
  선택 화면이 실제로 있는지 먼저 확인합니다.
- `ApprovalCard`: AI 도구 실행의 승인 요청·승인·거절·만료 상태와
  버튼 중복 제출 방지가 필요합니다. 기존 `ToolCall`은 실행 대기·진행·
  성공·실패를 표시하지만 승인 결정을 받지 않습니다. 실제 실행은
  소비자가 소유합니다. 2026-10-01에 원본 component·registry·문서와
  공개 소비자 검증을 완료했습니다.
- `DiffViewer`: 변경 전후 텍스트·코드의 추가·삭제·문맥을 읽고 검토하는
  화면이 필요합니다. `CodeBlock`은 단일 본문 표시, `LogConsole`은
  로그 목록입니다. 긴 줄·키보드 탐색·접근 가능한 변경 설명을
  수용 조건으로 정합니다.

`AgentStatus`는 여러 도구와 단계의 전체 작업 상태를 표시하는 화면이
반복될 때 `ToolCall`과 별도 상태 모델로 검토합니다. `CalendarScheduler`,
`ImageCropper`, `RichTextEditor`는 각각 일정 편집, 이미지 후처리, 서식
문서 작성이라는 실제 제품 용례와 유지 비용이 확인되기 전에는 보류합니다.

## 기존 component에서 먼저 해결할 범위

- `DataTable`: 서버 소유 정렬·필터·페이지, 행 편집, 큰 데이터의 표시
  성능을 실제 데이터 규모와 함께 검토합니다. 현재 구현은 client-side
  검색·필터·정렬·페이지와 `renderActions`를 제공합니다. 새 `DataGrid`를
  먼저 만들 근거는 아직 없습니다.
- `Combobox`: `onQueryChange`는 있지만 선택값이 현재 `options`에서
  사라지면 오류가 납니다. 원격 검색의 loading·error·선택값 보존은
  별도 `AsyncCombobox`보다 기존 API 확장 여부를 먼저 검토합니다.
- `ChartTooltip`, `ActionBar`, `CopyButton`, `Stat`, `EmptyState`는 각각
  기존 값 확인 패널, `DataTable.renderActions`, 복사 가능한 코드 표시,
  `MetricCard` 변형, `Empty` 조합과 중복을 비교합니다.

참고한 공식 문서:
[Chakra Editable](https://chakra-ui.com/docs/components/editable),
[MUI X editing](https://mui.com/x/react-data-grid/editing/),
[MUI X virtualization](https://mui.com/x/react-data-grid/virtualization/),
[AI Elements Confirmation](https://elements.ai-sdk.dev/components/confirmation),
[Mantine RichTextEditor](https://mantine.dev/x/tiptap/).
현재는 동작·용례 비교만 했습니다. 구현 전 동일 revision의 소스·LICENSE·
의존성과 접근성 동작은 별도로 확인해야 합니다.
