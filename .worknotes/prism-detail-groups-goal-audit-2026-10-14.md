# 상세 drawer·선택 상태 두 그룹 재감사 (2026-10-14)

대상은 58개 목표 중 `prism-detail`과 `prism-detail-state` 두 그룹이다. 기준 원본 `prism/frontend`의 `dev`와 `origin/dev`는 `2eeb26ff10274745f9d86897c2f2828bff002b98`로 일치했다. 공개 배포 `/sample/chat/side-panel`에서 오른쪽 비모달 패널의 기본 440px 폭, 64px 헤더, 24px 닫기 아이콘과 열기·확대·닫기를 확인했다. 현재 인증된 상세 API·전체 제품 흐름과 배포 소스 SHA는 결합하지 못했다.

원본의 채팅 비모달 SidePanel 목적은 이미 완료 판정한 `PrismPanel`이 담당한다. `prism-detail`은 별도 기능 목표로, 독립 모달 상세 drawer와 속성 목록을 제공한다. catalog에 두 방식의 사용처를 구분했다. 모달의 긴 본문이 헤더까지 스크롤시키던 배치를 고쳐 헤더는 남기고 본문만 스크롤한다. 320px 화면의 24행 합성 상세에서 본문 scrollHeight 3403px, clientHeight 527px, 스크롤 후 headerTop 1px, 문서 가로 넘침 0을 확인했다. 기본·로딩·빈 값·오류·재시도·긴 내용과 닫기 버튼·Escape를 확인했다. 외부 열기 버튼을 쓰는 controlled drawer에서 닫은 뒤 포커스가 버튼으로 돌아오지 않던 문제를 고쳤다. `PrismDetailList`는 240px 미만 부모에서 라벨/값을 한 열로 쌓고 중복 라벨의 React key 충돌을 피한다. 별도 설치본의 180px 부모에서 null은 ‘정보 없음’, 숫자 0은 그대로 표시됐다. 이것은 추가 모달 컴포넌트의 검증이며 공개 배포 비모달 패널과 픽셀 단위 동일하다는 뜻이 아니다.

현재 원본 `ChatMain`은 후보자/포지션 상세 선택을 배타적으로 관리하고, `axios`의 지정 API 403·404 알림에서 열린 두 상세와 선택 대상을 비운다. `usePrismDetailSelection`은 이 목적을 호스트 소유 상태로 표현하며 불투명 request ticket으로 이전 선택·같은 ID 재열기·버전 전환·다른 hook의 늦은 오류를 걸러낸다. 접근 철회 시 selection 조건으로 `PrismPanel`을 unmount해 이전 대상 DOM을 지운다. API 분류·취소·권한·토스트·경로 전환은 호스트 책임이다. 예제의 원본 소스 경로를 현재 `../pages/chat/ChatMain.tsx`로 고쳤다.

독립 설치본 첫 브라우저 검사에서는 좁은 부모의 비모달 패널이 합성 예제의 포지션 전환 버튼을 덮었다. jsdom 시험은 버튼 클릭을 직접 호출해 이 실제 화면 문제를 찾지 못했다. 검증용 전환 버튼을 패널 바깥으로 옮기고 catalog의 게시 예제에도 같은 변경을 적용했다. 게시 예제를 직접 실행하는 회귀 시험을 추가했다. 수정한 설치본의 1280px viewport 속 320px 부모에서 이전 요청 ticket의 403은 새 포지션 패널을 유지하고, 500도 유지하며, 현재 404는 패널 DOM을 제거했다. 가로 넘침과 콘솔 오류는 0이다.

Registry를 별도 shadcn 소비자에 재설치해 59개 TSX 소스와 CSS가 배포 산출물과 바이트 단위로 같고, 완전 예제 45개가 타입 검사되며 Vite·Pretendard·고지가 통과한 것을 확인했다. 전체 테스트·빌드·CI/미리보기의 최종 상태는 `.worknotes/browser-evidence/detail-goal-publication.json`에 기록한다. 두 그룹의 새 기준 완료 판정으로 전체는 **26/58개**, 미판정 32개다. 인증된 호스트의 실제 API 결과와 배포 SHA는 계속 미확인이다.

전체 PRISM 테스트 334개(게시 예제 회귀 시험 포함)와 workspace typecheck가 통과했다. 최종 site build, registry release check, PR·CI·미리보기 결과는 아래 게시 기록에 연계한다.
