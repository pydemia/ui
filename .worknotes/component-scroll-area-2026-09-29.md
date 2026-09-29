# ScrollArea 작업

2026-09-29. Framework 범주에 `ScrollArea`를 추가했습니다. 로컬 작업
트리는 82개 component, 84개 registry item입니다.

## 선정과 구현

`AppShell`의 상단·좌우·하단·floating slot, `Sidebar`의 탐색,
`PageHeader`의 제목·부제, `ContentList`의 bullet은 이미 있습니다.
이번에는 panel, 로그, 긴 목록에서 높이와 방향을 지정해 사용할 수 있는
스크롤 영역을 분리했습니다.

- 기본 세로 방향과 가로·양방향을 지원합니다. Radix의 native viewport와
  방향별 scrollbar를 사용하고 공통 `--muted` token으로 thumb를 표시합니다.
- 스크롤 viewport가 이름 있는 `region`이며 키보드 focus를 받습니다.
  `viewportRef`는 소비자가 실제 scroll DOM에 접근할 때 사용합니다.
- `type`과 `dir`은 Radix root에 전달합니다. 빈 label과 지원하지 않는
  orientation은 명시적으로 거부합니다. 스크롤 위치는 소유하지 않습니다.
- 문서에 세로 작업 목록과 가로 지표 목록의 동작하는 preview와
  사용 코드를 추가했습니다.

[shadcn Scroll Area 문서](https://ui.shadcn.com/docs/components/radix/scroll-area),
[고정 revision의 source](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/new-york-v4/ui/scroll-area.tsx),
[같은 revision의 MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)를
확인했습니다. 직접 의존성 `@radix-ui/react-scroll-area@1.2.18`의
manifest·LICENSE 및 직접 전이 의존성 9개의 MIT manifest도
확인했습니다. shadcn 소스를 수정했으므로 registry 설치 시
`SHADCN_UI_LICENSE.md`를 함께 전달합니다.

## 검증

- `npm test -w @pydemia/ui`: 18개 검사 통과. ScrollArea의 이름·focus,
  양방향 scrollbar, 잘못된 설정을 포함합니다. Radix의 `auto` scrollbar는
  서버 렌더에서 mount 전까지 나타나지 않으므로 SSR 방향 검사는
  `type="always"`로 실행합니다.
- `npm run typecheck`, `npm run build`, `npm run registry:check` 통과.
  기본 공개 URL 설정으로 84개 registry item을 생성했습니다.
- TypeScript AST로 문서 catalog ID를 읽어 82개 source 모듈, public
  export 경로, registry component ID와 비교했습니다. 누락·중복 없이
  1:1로 대응합니다. 사용 코드 전체의 소비자 typecheck는 수행하지
  않았습니다.
- 문서 Chromium에서 세로 목록의 overflow, 가로 카드의 overflow,
  End·ArrowRight 스크롤, focus outline과 밝은·어두운 thumb token을
  확인했습니다. 처음에는 focus outline과 ring이 겹쳐 보였고,
  ring을 제거한 뒤 단일 outline을 재확인했습니다.
- 격리 Vite 소비자에서 `pyd-scroll-area`와 `pyd-tokens`를 설치했습니다.
  최초 설치에서 수정한 shadcn 소스의 MIT 고지 파일이 빠진 것을
  발견해 registry item을 고쳤습니다. 재설치 후 ScrollArea, utils,
  tokens, MIT 고지 파일이 생성됐습니다. 설치 소스 SHA256은 원본과
  동일합니다.
- 소비자 typecheck·build, `npm audit --audit-level=high` 통과.
  Chromium에서 이름 있는 두 region, End·ArrowRight 스크롤,
  세로·가로 thumb 드래그와 console error 0건을 확인했습니다.

소비자 fixture 경로:
`C:\Users\pydemia\AppData\Local\Temp\pydemia-ui-scroll-area-consumer-20260929`.

실제 screen reader 발표, touch·RTL, 다른 브라우저와 실제 좁은 화면,
전체 84개 item의 새 동시 설치, 공개 배포는 확인하지 않았습니다.
