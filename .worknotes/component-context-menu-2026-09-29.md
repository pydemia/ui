# ContextMenu 편입

2026-09-29. Overlays 범주에 `ContextMenu`를 추가했습니다. 로컬 작업
트리는 73개 component, 75개 registry item입니다. `DropdownMenu`는
trigger 클릭으로 열리므로 카드·파일·목록 항목의 pointer 위치에서
우클릭으로 여는 동작을 제공하지 않습니다. `ContextMenu`는 같은 메뉴
token을 쓰되 Radix Context Menu primitive로 호출 방식을 분리했습니다.

## 구현과 출처

Root·Trigger·Content, item·label·separator·group, checkbox·radio와
submenu를 export합니다. `danger` item, disabled와 consumer 소유 상태를
지원합니다. 문서 preview는 focus 가능한 native button을 trigger로 써
우클릭과 `Shift+F10`을 직접 시험할 수 있습니다. 공통 surface·border·
foreground·shadow token을 적용했습니다.

[shadcn/ui 공식 문서](https://ui.shadcn.com/docs/components/radix/context-menu),
[source revision `98a1fe67`](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/new-york-v4/ui/context-menu.tsx),
[같은 revision의 MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)를
확인했습니다. 구현은 기존 pydemia/ui `DropdownMenu`의 표현을
Context Menu primitive에 맞춰 작성했으며 shadcn source는 복사하지
않았습니다. [Radix 공식 문서](https://www.radix-ui.com/primitives/docs/components/context-menu)의
접근성·keyboard 설명, 설치된 `@radix-ui/react-context-menu@2.3.7`의
`dist/index.mjs`·package metadata·MIT LICENSE를 확인했습니다.
직접 registry 의존성은 `pyd-utils`, npm dependency는 Radix 2.3.7과
lucide 0.468.0입니다.

## 검증 상태

- `npm run typecheck`, `npm run build`, `npm run registry:check` 통과.
  기본 공개 URL의 75개 registry item을 생성했습니다. 문서 JS 청크의
  500 kB 초과 경고는 남아 있으며 성능 측정은 하지 않았습니다.
- 문서 Chromium에서 우클릭, `Shift+F10`, 방향키와 Enter, checkbox,
  radio, submenu의 CSV 선택, disabled 항목, Escape 닫기와 focus 복귀를
  확인했습니다. 밝은·어두운 모드의 메뉴 표면도 화면에서 확인했습니다.
- `%TEMP%/pydemia-ui-context-menu-consumer-20260929`에 새 Vite
  fixture를 만들고 로컬 registry base URL로 ContextMenu·utils·tokens
  3개 파일을 설치했습니다. 설치 source가 원본과 일치하고
  `@radix-ui/react-context-menu@2.3.7`·`lucide-react@0.468.0`이
  설치된 것을 확인했습니다. 소비자 typecheck·build와 Chromium의
  우클릭·키보드 호출, 체크·라디오·submenu 결과가 통과했고 console
  error는 없었습니다. runtime audit의 high 이상 취약점은 0건입니다.

touch 길게 누르기, 실제 screen reader 발표, 다른 브라우저, 전체
registry item의 새 설치와 공개 배포는 검증하지 않았습니다. 이 변경은
아직 로컬 작업 트리에만 있습니다. 검사 후 registry 출력 URL은 기본
공개 주소로 복원했고, 생성된 JSON에 로컬 URL이 남지 않았습니다.
