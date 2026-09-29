# 모바일 SNB 컴포넌트 선택 시 스크롤

## 확인한 동작

- 390px 화면에서 SNB 항목을 선택하면 `selectComponent()`가 매번
  `#components.scrollIntoView({ behavior: "smooth" })`를 실행했습니다.
  처음 화면에서 DataChart를 선택하자 문서 스크롤이 약 361px 이동했습니다.
- 모바일 SNB는 가로 스크롤 영역이며 `850px` 이하에서 상단에 고정됩니다.
  항목 선택 후에도 사용자가 탐색하던 SNB 위치를 유지해야 합니다.

## 변경

- 모바일 SNB에서 선택할 때는 명시적인 본문 자동 스크롤을 생략합니다.
  컴포넌트 선택 상태, URL과 `#components` 해시는 그대로 갱신합니다.
- 데스크톱 SNB와 상단 Components 메뉴의 본문 이동은 유지합니다.
  모바일 판정은 SNB의 CSS breakpoint와 같은 `max-width: 850px`를 씁니다.
- component·registry item 수는 각각 90·92로 변함없고 registry
  snapshot도 그대로입니다. 전체 goal의 관리용 추정 약 70%는 유지합니다.

## 검증

- 390px Chromium: 모바일 SNB의 DataChart와 DonutChart를 화면에서
  연속 선택했을 때 SNB `scrollLeft`가 6095.5로 유지되고 선택 상태와
  URL이 바뀌었습니다. `document.activeElement`는 선택한 버튼입니다.
  컴포넌트마다 높이가 달라 본문 scroll anchoring에 따른 약 50px의
  세로 위치 변화는 관찰됐지만 `#components`로 자동 이동하지 않았습니다.
- 390px Chromium: 상단 Components 메뉴에서 DataChart를 선택하면
  `#components`가 고정 메뉴 아래로 이동하고 메뉴가 닫혔습니다.
- 1280px Chromium: 데스크톱 SNB에서 DataChart를 선택하면
  `#components`가 상단 약 84px 위치로 이동했습니다.
- `npm run typecheck`, `npm run build`, `npm run registry:release-check`,
  `git diff --check`가 통과했습니다. 현재 registry는
  `sha256-212e10face340c8a0d867de1ea5ace2c1490e102dfec7d09f8ca97e999cae331`와
  일치합니다.

실제 touch 기기와 Safari는 검증하지 않았습니다. 빌드 중 생성된
무관한 예시 asset 변경은 제외했습니다. 이전 미공개 draft snapshot
네 디렉터리는 untracked 상태로 유지합니다.

## 배포 확인

- [PR #9](https://github.com/pydemia/ui/pull/9)를 `main`에 병합했습니다.
  PR Verify UI와 병합 커밋 `74770deb`의 push CI가 통과했습니다.
- Vercel production 배포 `dpl_JCuzSTY3hC6tz8B8V5hviYpFwag2`가
  READY입니다. 공개 사이트에서 새 asset `index-Dob0uGo7.js`를
  제공하는 것을 확인했습니다.
- 공개 사이트의 390px Chromium에서 DataChart와 Sparkline을 SNB로
  선택할 때 `scrollLeft` 5997.5와 문서 `scrollY` 0이 유지되고
  선택 상태와 URL이 갱신됐습니다.
