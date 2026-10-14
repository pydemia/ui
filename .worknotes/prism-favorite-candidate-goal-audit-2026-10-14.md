# `prism-favorite-candidate` goal 수용 감사 (2026-10-14)

판정: `prism-favorite-candidate` **완료 수용**. 전체 **37/58**, 미판정 21개. 즐겨찾기 후보 카드의 신원·조직·전문 분야·최근 평가 표시와 상세/즐겨찾기 독립 동작, 목록 그리드가 대상이다. 필터 조회·페이지·북마크 저장은 호스트 소유다.

최신 fetch한 `prism/frontend` `dev` `2eeb26ff10274745f9d86897c2f2828bff002b98`의 `FavoriteCandidateCard/List` TSX·SCSS는 앞선 참조 소스에서 바뀌지 않았다. 원본 카드의 padding 16px, radius 12px, 사진 70px, 정보 영역 121px, 흰 전문 분야/평가 패널 padding 12px과 목록의 3열·10px 간격을 대조했다. 설치 컴포넌트는 이 구조와 배지·평가 이력을 재사용한다. 원본의 카드 전체 `role=button` 안에 즐겨찾기 조작이 놓이는 구조는 상세·즐겨찾기를 형제 native button으로 분리했다.

로컬 브라우저에서 실제 1280px의 3열, 320px의 기본·로딩·빈 값·읽기 전용·긴 내용 상태를 확인했다. 140px 부모의 긴 이름과 232자 전문 분야는 내용이 보존되고 내부 세로 스크롤로 접근된다. 부모·문서의 가로 넘침은 없었다. 즐겨찾기를 해제해도 상세 선택은 일어나지 않고, 별도 상세 버튼을 누르면 해당 후보가 선택된다.

설치용 완전 예제는 카드 하나에서 가상 후보 3명의 controlled 즐겨찾기·상세 선택으로 바꿨다. 별도 shadcn 소비자에 설치해 59개 TSX 모듈과 CSS의 바이트 일치, 완전 예제 48개 타입 검사, Vite·Pretendard·고지를 확인했다. 그 설치본의 실제 브라우저에서는 1280px 3열, 560px 2열, 320px 1열과 선택/즐겨찾기 독립 동작을 확인했다. 문서 가로 넘침과 콘솔 오류는 없었다.

`npm run build`, `npm run prism:check`(341/341), `npm run typecheck`, `npm run registry:release-check`가 통과했다. 생성된 `docs/prism/components.json`과 검증 기록은 소스 사본과 일치한다.

인증 배포 `/chat/favorites`는 인앱 브라우저와 로그인된 Chrome 모두 React root가 비어 있었다. 현재 배포의 픽셀·글꼴·소스 SHA, 실제 북마크 저장 결과는 확인하지 못했다. 프로필 A4 레이아웃은 별도 `prism-profile-print` 판정에 남긴다.
