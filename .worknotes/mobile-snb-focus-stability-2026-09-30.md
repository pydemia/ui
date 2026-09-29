# 모바일 SNB 선택 시 포커스와 스크롤

## 상황과 변경

이전 구현은 850px 이하에서 본문 자동 이동을 생략하고 pointerdown의
문서·SNB 스크롤 좌표를 React 화면 갱신 직후 복원했습니다. 이번 로컬
Chromium의 393px 마우스 클릭에서는 이동이 재현되지 않았지만, 실제
모바일 화면에서 본문 component 창으로 이동한다는 사용자 보고가
있었습니다.

모바일 포인터 선택에서는 클릭된 SNB 버튼의 포커스를 해제합니다.
키보드와 보조기술이 발생시키는 click은 기존 버튼 포커스를 유지합니다.
화면 갱신 직후에 더해 다음 animation frame에도 pointerdown 이전의
문서·SNB 스크롤 좌표를 복원합니다. 다음 선택이 먼저 발생하면 오래된
frame 작업을 취소합니다. 데스크톱의 `#components` 이동은 유지합니다.

## 검증

- 393px Chromium mobile device emulation에서 SearchInput 포인터 선택
  후 `scrollY=844`, SNB `scrollLeft=1800`이 유지되고 포커스는
  `body`로 돌아갔습니다. 같은 항목 재선택에서도 `1200`, `1800`이
  유지됐습니다.
- Chromium DevTools의 touch 입력을 393px 화면에 전달해 InputGroup을
  선택했습니다. `scrollY=844`, SNB `scrollLeft=1800`, `body` 포커스,
  URL query와 화면 제목을 확인했습니다.
- Enter로 InputGroup을 선택하면 `scrollY=1200`, SNB
  `scrollLeft=1800`이 유지되고 포커스는 InputGroup 버튼에 남았습니다.
- 1280px에서 Tree를 선택하면 `#components`가 상단 약 84px 위치에
  오고 URL 해시와 버튼 포커스가 유지됐습니다.
- `npm run typecheck`, 단독 패키지 테스트 79/79, `npm run build`,
  `npm run registry:release-check`, `git diff --check`가 통과했습니다. 최초
  패키지 테스트와 typecheck의 동시 실행은 두 빌드가 같은 `dist`를
  사용해 테스트 7개가 파일 탐색 오류로 실패했습니다. 단독 재실행은
  79개 모두 통과했습니다.

실제 touch 기기·Safari·screen reader는 아직 검증하지 않았습니다.
기존 미공개 draft snapshot 네 디렉터리는 이번 수정 범위 밖입니다.
