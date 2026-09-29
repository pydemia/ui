# 화면 골격·탐색·정보 표시 확장

2026-09-29 로컬 작업 트리. 목표는 반복되는 제품 화면의 골격과
기본 정보 표시를 `@pydemia/ui`에서 조합할 수 있게 하는 것입니다.
개수를 맞추기 위한 분리는 하지 않았습니다. 기존 Spinner는 새 item으로
세지 않고 variant를 확장했습니다.

## 구현과 결정

- AppShell: header, 본문, 좌우 panel, 하단 panel, floating panel과
  bubble을 조합합니다. 768px container query에서 좌우 panel을 본문과
  나란히 놓고 좁은 영역에서는 세로로 쌓습니다. 접힘·drawer 상태는
  포함하지 않았습니다.
- Navigation: 이름 있는 전역·측면 nav와 `aria-current="page"` 링크를
  제공합니다. 앱의 현재 경로 상태는 소비자가 전달합니다.
- LogConsole: level·시간·메시지와 빈 상태를 표시합니다. 잦은 갱신을
  자동 발표하지 않도록 `aria-live="off"`가 기본값입니다.
- Sparkline: SVG 추세, 결측 구간, 빈 상태, 시작·마지막·최저·최고 값의
  대체 텍스트를 제공합니다. 유한하지 않은 수치는 오류로 처리합니다.
- PageHeader와 ContentList: 제목 계층·action, native 목록 의미를
  공통 token으로 표시합니다.
- Spinner: 기존 기본형을 유지하면서 `ring`, `dots` variant를
  추가했습니다.

새 6개 component는 React, SVG, Tailwind와 저장소의 `cn`만 사용해
작성했습니다. 새로운 npm dependency나 외부 component source 복사는
없습니다. `registry.json`, `registry/provenance.json`, public export,
문서 preview·사용 코드, `docs/r/` 생성물을 함께 갱신했습니다.
로컬 기준 44개 component, 공용 utils·tokens 포함 46개 registry
item입니다. 자체 작성 코드에는 저장소 전체 공개 LICENSE가 아직
정해지지 않았으므로 metadata에도 이 상태를 표시합니다.

## 검증

- `npm run typecheck`, `npm run build`, `npm run registry:check` 통과.
  `registry:check`는 46개 item과 provenance를 확인했습니다.
- 문서 브라우저에서 AppShell의 좌우 panel, 이름 있는 영역과 bubble의
  열기·닫기를 확인했습니다. 861px preview에서 본문 방향은 `row`이고
  preview는 한 열 전체를 사용합니다.
- LogConsole의 항목 추가와 비우기, Sparkline의 데이터·빈 상태,
  Spinner 세 variant, PageHeader heading, ContentList의 순서 있는·없는
  목록, Navigation의 이름 있는 nav를 브라우저 접근성 트리에서 확인했습니다.
- 다크 모드에서 AppShell preview를 시각 확인하고 밝은 모드로
  되돌렸습니다. 이번 작업 전부터 수정 중이던 상단 로고는 두 모드에서
  CSS border가 `0px`임을 확인했습니다.

## 남은 검증과 범위

- 이번 6개 registry item의 별도 소비자 `shadcn add`, import,
  typecheck·build는 실행하지 않았습니다.
- 실제 screen reader 발표, 키보드 전 경로, 좁은 viewport와 각
  component의 모든 상태별 시각 감사는 실행하지 않았습니다.
- 원격 push·배포는 이번 로컬 변경에 대해 실행하지 않았습니다.
- graph chart, 접히는 sidebar, drawer, 알림 popup, dashboard 조합
  예시 등 더 넓은 component 목표는 계속 남아 있습니다. 다음 후보는
  `.worknotes/component-roadmap.md`에서 사용처와 중복을 판정하세요.
