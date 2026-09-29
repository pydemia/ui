# Floating 도움말 조합의 focus 동작

2026-09-29. AppShell에는 좌우·하단·floating 영역이 이미 있습니다.
문서 preview와 Operations workspace는 도움말을 열 때 bubble을 DOM에서
제거해 focus가 사라질 수 있었습니다. 별도 component를 늘리지 않고
기존 `AppFloatingBubble`·`AppFloatingPanel`의 사용 예시를 수정했습니다.

bubble은 열린 동안에도 유지합니다. `aria-expanded`와 `aria-controls`는
숨겨진 상태에도 존재하는 panel을 가리킵니다. panel을 bubble 위에
배치해 서로 겹치지 않게 했습니다. 닫기 버튼과 panel 안의 Escape는
bubble로 focus를 돌립니다. [WAI-ARIA APG disclosure 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)의
button·확장 상태·제어 대상 관계를 참고했고 외부 코드는 복사하지
않았습니다. `AppShell`의 공개 API·registry item 수는 바뀌지 않았습니다.

저장소 `npm run typecheck`, `npm run build`, `npm run registry:check`가
통과했습니다. 기존 91-item 소비자 fixture에서 catalog의 89개 사용
코드를 package·registry import로 다시 추출해 `tsc --noEmit`이
통과했습니다. Chromium 문서에서 bubble click·Enter·Space,
열림 상태 발표용 속성, Tab으로 닫기 버튼 이동, Escape 닫기와
focus 복귀를 확인했습니다. Operations workspace의 열기·닫기와
focus 복귀도 확인했고 console error는 없었습니다. 열린 panel이
bubble 위에 배치된 화면을 확인했습니다.

실제 screen reader 발표, touch·RTL·390px viewport, 다른 브라우저는
검증하지 않았습니다. 현재 변경은 로컬 작업물이며 commit·push·공개
배포를 확인하지 않았습니다.
