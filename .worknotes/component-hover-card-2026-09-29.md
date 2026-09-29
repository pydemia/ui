# HoverCard 편입

2026-09-29. Overlays의 링크 목적지 미리보기 용례에 `HoverCard`를
추가했습니다. 현재 로컬 작업 트리는 77개 component와 79개 registry
item입니다. 새 item은 `@pydemia/ui` export, 내부 registry, 문서
preview·사용 코드에 연결했습니다.

## 결정과 source

- 링크가 실제 목적지로 이동하고, 카드에는 그곳에 있는 보조 요약만
  둡니다. Radix 공식 문서는 카드 내용이 screen reader에 노출되지
  않는다고 설명하므로 필수 정보나 유일한 동작을 넣지 않습니다.
- shadcn/ui의 공식 Hover Card 문서, revision
  `98a1fe67b439324ddc857f47fbdce056600a4329`의 source와 같은
  revision의 MIT LICENSE를 확인했습니다. 코드는 복사하지 않고 기존
  `Popover` wrapper 관례에 맞춰 직접 작성했습니다.
- runtime 의존성은 `@radix-ui/react-hover-card@1.1.23`과 기존
  `pyd-utils`입니다. 설치된 Radix의 package manifest,
  `dist/index.mjs`, MIT LICENSE를 같은 버전에서 확인했습니다.
  surface·foreground·border·floating shadow는 공통 token을 씁니다.

## 검증

- `npm run typecheck`, `npm run build`, `npm run registry:check` 통과.
  기본 공개 URL로 복원된 79개 registry JSON에 localhost URL이
  남지 않았습니다. 문서 앱 빌드에는 chunk size 경고가 있습니다.
- 로컬 문서 Chromium에서 실제 링크에 keyboard focus를 주면 카드가
  열리고 Escape로 닫히며 링크 focus가 유지됩니다. pointer 진입·이탈
  열기·닫기도 확인했습니다. 다크 모드의 카드 배경·글자·테두리가
  공통 token 값을 사용합니다.
- 별도 Vite 소비자
  `%TEMP%/pydemia-ui-hover-card-consumer-20260929`에 shadcn CLI로
  `pyd-hover-card`와 `pyd-tokens`를 설치했습니다. 생성 파일 3개 중
  component source는 원본과 일치합니다. 소비자 typecheck·build,
  Radix 1.1.23·clsx·tailwind-merge 설치 확인, runtime high 이상
  audit 0건을 확인했습니다.
- 소비자 Chromium에서 focus 열기, Escape 닫기·focus 유지, Enter의
  `#details` 링크 이동과 console error 0건을 확인했습니다.

실제 screen reader 발표, touch 조작, 좁은 화면과 다른 브라우저는
검증하지 않았습니다. 전체 79개 item의 새 동시 설치도 이번에는
반복하지 않았으며 이전 78개 item 검사와 구분합니다. 원격 push·배포는
하지 않았습니다.
