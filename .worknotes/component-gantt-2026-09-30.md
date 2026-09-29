# Gantt 일정 시간축

## 선정과 구현

`Timeline`은 사건 순서를, `Kanban`은 상태별 카드 이동을 다룹니다.
프로젝트 일정에서 작업 기간·진행률과 선행 작업의 제약을 한 화면에
보는 용도로 `Gantt`를 추가했습니다. Kibo Gantt의 공식 문서와 고정
revision의 소스·package manifest·MIT LICENSE를 확인하고, 시간축과
의존 관계 개념만 참고했습니다. 구현 코드는 원본 React·Tailwind이며
직접 registry 의존성은 `pyd-utils`입니다. 출처와 차이는
`research/source-inventory.md`에 기록했습니다.

날짜는 양 끝을 포함하는 `YYYY-MM-DD` 달력 날짜입니다. 1~366일의
표시 구간 안에 작업이 있어야 하며 선행 작업은 후속 시작 전에 끝나야
합니다. `tasks`는 호출자가 소유하고 `onTasksChange`가 새 목록과
변경 내용을 받습니다. 작업 선택 버튼, 하루 단위 이동·기간 조정 버튼,
일·7일 축, 진행률과 선행 연결선을 제공합니다. 포인터로 시간축의
행을 선택할 수도 있습니다. drag·marker·grouping과
같은 행의 여러 작업은 현재 구현 범위에 없습니다.

## 검증 상태

- `npm run typecheck` 통과. `npm test -w @pydemia/ui` 84/84 통과.
  Gantt 신규 5개 테스트는 날짜·진행률·의존 관계 검증, 이동·기간 조정,
  입력 불변성, read-only·빈 상태와 native 조작을 확인합니다.
- 로컬 1280px Chromium에서 7일 축·선행 연결선과 preview Usage를
  확인했습니다. 화면 설계를 10월 7~9일에서 5~7일로 앞당긴 뒤
  선행 작업에 닿아 앞당기기 버튼이 비활성화됐습니다.
- 로컬 390px Chromium에서 Gantt 내부 스크롤 폭 530px, 표시 폭
  328px을 확인했습니다. 내부 `scrollLeft=180`에서도 작업 버튼의
  화면 x좌표는 31px로 유지됐습니다. 키보드 Enter로 구현 작업을
  선택하고 기간을 10월 17일까지 늘렸으며 포커스와 live region
  알림을 확인했습니다. 일 단위 전환 뒤 내부 폭은 1230px입니다.
- 시간축의 구현 행을 포인터로 선택하면 해당 작업 버튼의
  `aria-pressed`가 갱신됐습니다.
- dark·Pydemia colormap에서 progress fill이 각각 `--accent`의
  `#83bfd2`, `#f19ab1`을 따르는 것을 확인했습니다.
- axe 4.12.1의 preview 영역 감사에서 violation 0건,
  contrast 검사 incomplete 1건이 나왔습니다. 겹친 요소의 배경색을
  판정하지 못한 항목이며 접근성 적합 판정으로 보지 않습니다.
- [데스크톱 화면](gantt-desktop-preview.png)과
  [390px 화면](gantt-mobile-preview.png)을 남겼습니다.

빌드, registry 검사·snapshot, 별도 소비자 설치, 공개 사이트는 아직
검증하지 않았습니다. 실제 touch·Safari·screen reader·RTL 및 서버
저장 실패 후 복구도 미검증입니다. 기존 미공개 draft snapshot 네
디렉터리는 stage하지 않습니다.
