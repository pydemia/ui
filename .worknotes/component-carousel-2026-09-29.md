# Carousel 구현·검증 기록

2026-09-29. `Carousel`을 Content 범주에 추가했습니다. 현재 로컬
작업 트리는 68개 component, 70개 registry item입니다. 문서 preview와
설치 코드는 `apps/docs/src/catalog.tsx`에 있습니다. 공개 배포는
하지 않았습니다.

## 선택 근거와 동작

`Tabs`는 주제 전환, `Stepper`는 작업 단계 표시를 맡습니다.
`Carousel`은 순서가 있는 콘텐츠를 한 번에 하나씩 살펴볼 때 사용합니다.
고유 ID·이름·내용을 받으며 이전·다음, 현재 위치와 선택적인 직접
선택 버튼을 제공합니다. card/plain 변형과 끝에서 순환하는 `loop`가
있습니다. 자동 재생은 제공하지 않습니다.

현재 슬라이드만 DOM에 둡니다. 이름 있는 carousel 영역과 slide group,
수동 전환용 polite live region, native button을 사용합니다. touch
pointer에서 48px 이상의 수평 이동을 처리하고 링크·버튼·입력에서
시작한 동작은 무시합니다. 실제 터치 기기에서의 동작은 아직
확인하지 못했습니다.

원본 구현이며 새 npm dependency는 없습니다. 직접 registry 의존성은
`pyd-button`, `pyd-utils`입니다. W3C APG Carousel 문서를 접근성
동작에 참고했습니다. shadcn/ui Carousel의 Embla 구현은 사용하지
않았습니다. `pyd-button`의 고정 shadcn/ui source와 동일 revision
MIT LICENSE를 확인했고 소비자 설치에서 고지 파일 생성을 확인했습니다.

## 검증

- `npm run typecheck`, `npm run build`, `npm run registry:check` 통과.
  기본 공개 URL로 70개 registry JSON을 생성했고 로컬 URL 잔존은
  발견되지 않았습니다.
- server render로 빈 목록, 기본·controlled 선택, 비활성 슬라이드의
  DOM 제외, 단일 슬라이드 이동 버튼 disabled, 중복·없는 ID와
  모순된 controlled 입력 거부를 확인했습니다.
- 문서 Chromium에서 이전·다음, 끝의 disabled, 직접 선택, Enter
  이동과 focus 유지, card/plain 및 다크 모드를 확인했습니다.
- 새 Vite 소비자 fixture에 Carousel·token을 shadcn CLI로 설치했습니다.
  Carousel·Button·utils·token·MIT 고지의 5개 파일이 생성됐습니다.
  마지막 재설치본의 Carousel source hash는 저장소 source와 같습니다.
  소비자 typecheck·build·브라우저의 controlled 순환 이동과 Space
  선택을 확인했습니다. `npm audit --omit=dev`는 0건입니다.
- `git diff --check` 통과.

실제 screen reader, 터치 기기, RTL, 슬라이드 배열의 빈번한 변경,
전체 item의 새 소비자 설치와 공개 배포는 검증하지 않았습니다.
