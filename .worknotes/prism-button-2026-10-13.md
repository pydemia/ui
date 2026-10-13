# PRISM Button·새 대화 기본값 비교 (2026-10-13)

- clean 원본 frontend `dev` `d677e551a61f672025dcc1803a56ff0cab1e36ee`; 공개 `/sample/ui/button`을 in-app browser에서 확인했습니다. 배포 SHA는 로컬 소스와 결합되지 않았습니다.
- 원본의 기본/경고 solid, line, shape와 disabled 아이콘 버튼을 독립 예제와 측정했습니다. 경고 medium은 32px·`#ea002c`, hover는 `#e45858`와 흰색 오버레이입니다. 비활성 경고 small은 28px·`#d7dce3`; 비활성 line/shape icon-only는 28×28px·20px SVG이며 측정 색·테두리가 같습니다.
- 원본 `HRXNewChatBtn`은 28px `AddIcon`, `새로운 대화` 문구, 40px 높이, 8px 반경과 gradient를 기본으로 제공합니다. 기존 `PrismNewChatButton`은 호출자가 아이콘·문구를 넣어야 했고 generic large-button SVG 규칙에 밀려 아이콘이 16px로 표시됐습니다. 기본값·CSS 우선순위·disabled border를 수정하고 `PrismSidebar`도 기본값을 사용하게 했습니다. 원본 샘플 버튼은 932px 컨테이너, 독립 예제는 232px 컨테이너를 채웁니다.
- 독립 예제에서 새 대화 버튼 클릭·Enter가 합성 callback을 각각 한 번 호출했고 비활성 버튼은 활성화할 수 없었습니다. 원본 공개 샘플에는 해당 handler가 없습니다. 아이콘 전용 원본 샘플은 접근 가능한 이름이 없지만 독립 컴포넌트는 이름을 요구합니다.
- 로컬 `npm run build`, `npm run typecheck`, `npm run prism:check`, `npm run registry:release-check`가 통과했고 PRISM 테스트 294개가 성공했습니다. 별도 shadcn 소비자에 button/sidebar/tokens를 재설치해 59개 모듈과 CSS의 생성 레지스트리 바이트 일치, 40개 완전 예제 타입 검사, Vite·폰트·고지를 확인했습니다. 설치본 브라우저에서 일반/비활성/아이콘 전용 새 대화 버튼은 40px 높이·28px SVG이고, 활성 버튼 두 개의 클릭·Enter는 합성 횟수를 2로 만들었습니다. 비활성 버튼은 실행되지 않았습니다.
- 로컬 사이드바의 펼침/접힘을 브라우저에서 확인했습니다. 새 대화 버튼은 펼침 시 231px, 접힘 시 40px이고 두 상태의 아이콘은 28px입니다. 접힘 뒤에도 `aria-label="새로운 대화"`가 남으며 문서 가로 넘침은 0px입니다.
- 미검증: 실제 제품 새 대화 탐색, 다른 caller의 모든 상태, focus-visible/hover 전체 조합, static/variable font와 픽셀 전체 일치, PR CI/preview. 이 항목은 이후 검사 결과로 갱신합니다.
