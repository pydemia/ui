# NavigationMenu 편입

2026-09-29. `GlobalNav`는 단일 링크만 표시하므로 여러 목적지를
그룹으로 펼쳐야 하는 제품 상단 탐색을 위해 `NavigationMenu`를
추가했습니다. 기존 side navigation과 mobile drawer는 유지합니다.
로컬 총수는 76개 component, 78개 registry item입니다.

## 결정과 출처

- Radix Navigation Menu primitive를 조합해 이름 있는 가로 `nav`,
  List·Item·Trigger·Content·Link를 제공합니다. Root의 제어
  `value` 경로를 전달합니다. 열린 그룹은 trigger 아래에 배치하고
  링크는 `trigger` 또는 `content` 표현을 고를 수 있습니다.
- shadcn/ui의 공식 문서, 고정 revision source와 동일 revision MIT
  LICENSE를 확인했습니다. 구현 source는 이 저장소에서 작성했고
  shadcn 코드는 복사하지 않았습니다. Radix 공식 문서의 키보드 규칙을
  참고했습니다.
- `@radix-ui/react-navigation-menu@1.2.22`를 직접 의존성으로
  고정했습니다. 설치된 같은 버전의 package metadata, 배포 source,
  MIT LICENSE를 확인했습니다. 기존 `lucide-react@0.468.0`과
  `pyd-utils`도 사용합니다. 외부 component source notice를 새로
  복사할 필요는 없습니다.
- `packages/ui/src/components/navigation-menu.tsx`, public export,
  registry item, provenance와 문서 preview·사용 코드를 연결했습니다.
  공통 surface·foreground·border·focus·shadow token을 사용합니다.

## 검증

- `npm run typecheck`, 기본 공개 URL의 `npm run build`,
  `npm run registry:check`가 통과했습니다. 78개 registry item이
  생성됐고 생성 산출물에 로컬 URL이 남지 않았습니다.
- 문서 브라우저에서 클릭으로 그룹을 열고 링크를 확인했습니다.
  ArrowDown은 첫 링크로 focus를 옮기고 Escape는 메뉴를 닫고
  trigger로 focus를 돌립니다. 현재 링크의 `aria-current="page"`와
  밝은·어두운 모드의 token 색상을 확인했습니다.
- 별도 임시 소비자 프로젝트에서 로컬 registry로 NavigationMenu와
  tokens를 설치했습니다. 생성된 3개 파일과 원본 source의 일치,
  Radix·Lucide 설치, 소비자 typecheck·build를 확인했습니다.
  브라우저에서 그룹 열기·키보드 이동·Escape·링크 hash 이동을
  확인했습니다. runtime audit high 이상 취약점은 0건입니다.
- server render에서 빈 문자열·공백·누락된 탐색 이름을 모두 오류로
  거부하는 것을 확인했습니다.

Hover, touch, screen reader, RTL과 좁은 화면은 이번 브라우저 검사에서
실행하지 않았습니다. 전체 registry item 새 설치와 공개 배포도
확인하지 않았습니다.
