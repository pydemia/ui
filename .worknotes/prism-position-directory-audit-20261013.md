# 사용자 포지션 목록 목적과 배포 대조

이전 목표 턴의 사이드바 보정은 draft PR #162의 aa761eb9에 게시됐습니다. Verify UI run 38362050081이 성공했고 자동 preview dpl_DqcLE7xPTnGrWZEEJayrME8YHdUF는 READY/비프로덕션/동일 SHA입니다. 16개 공개 HTTP 산출물 readback이 통과했습니다. `.worknotes/browser-evidence/sidebar-fidelity-final-preview-readback.json`에 파일별 결과가 있습니다. 이 증거는 현재 새 포지션 목록 구현의 게시 증거로 사용하지 않습니다.

원본 frontend clean dev를 d677e551a61f672025dcc1803a56ff0cab1e36ee로 갱신했습니다. components/layouts TSX 275파일(벡터88, 비벡터187)을 실제 체크아웃과 대응표에서 재검사했고 신규 PositionFilterBar, PositionListContent, PositionTable, EtcIcon 네 파일을 목적별로 매핑했습니다. `PositionList.tsx` 페이지는 통합 참조로 추가했습니다. 275는 소스 파일 수이며 최종 독립 구현 목표 수나 완료 수가 아닙니다. 이전 e5의 정적 도달성 계산과 디자인 비교 범위는 별도 기록으로 보존합니다.

`testuser001`의 배포된 `/chat/positions` 기본 화면에서 총1023건, 10행, 회사·포지션·산업·직무·직책 열, 페이지 이동, 회사·산업·이름 필터, 초기화·조회·정렬을 확인했습니다. 800px 표의 열 폭은160/280/120/120/120px, 행 높이는60px, 필터 높이는50px입니다. 머리는 #eef2fa, 본문 셀은 Pretendard14px/19.6px입니다. 배포 SHA는 결합하지 못했고 행 클릭은 Chrome 입력 경로가 시간 초과되어 직접 확인하지 못했습니다. 원본 소스는 같은 행 클릭이 상세 탭을 만들며 ID 기준 중복 열기를 막고 닫을 때 이전 탭을 선택합니다.

새 `PrismPositionDirectory`는 관리자 편집 목록과 분리된 사용자용 LIVE 목록입니다. 호스트가 행·선택지·전체 수·상세 내용·조회 오류를 제공합니다. 검색 전 초안과 적용 필터를 분리하고 산업 전체 선택은 무제한 조건으로 변환합니다. 서버 정렬 필드, 페이지 크기10/20/50/100, 5열 표, 네 행 로딩, 400px 빈 결과, 상세 탭 재사용/닫기와 routeKey 복귀를 제공합니다. 표는 좁은 화면에서 내부 가로 스크롤을 사용합니다. 상세에는 기존 `PrismPositionDetail`을 합성 호스트가 공급합니다. 새 원본 메뉴의 EtcIcon 원형·사각형·삼각형 벡터를 보존해 사이드바 예제에 추가했습니다.

현재 source fingerprint는 0f670cbd3b4b5cb83caef2797fe74241ccfb5b59184b3c705f0e84c2331f51dc/87 inputs입니다. 합성 예제 5상태를320/1280px에서10회 렌더해 문서 가로 넘침과 중첩 버튼0을 확인했습니다. 첫 320px 측정의 font status는 loading이었고 같은 상태를 다시 읽어 Pretendard loaded, root288px, 표 내부 가로 스크롤을 확인했습니다. 합성 사진과 측정값은 `.worknotes/browser-evidence/position-directory-workspace-default.png` 및 `position-directory-workspace-renders.json`에 있습니다. 원본 개인정보나 레코드명을 증거 파일에 복사하지 않았습니다.

최종 목적 검사4개와 전체 PRISM 284 tests/0fail, 레지스트리59그룹/40완전예제 검사가 통과했습니다. 마지막 재시도 보완을 포함한60항목 실제 shadcn 설치에서 TypeScript/Vite/font 바이트/자산 고지가 통과했습니다. 설치본 브라우저는24건의 합성 행에서 2페이지 이동, 직무 정렬의1페이지 복귀, 이름 검색 전24·후12건, 행 전체 클릭 상세 탭, 같은 ID 재열기 시2개 탭 유지, 닫기 시 목록 복귀를 확인했습니다. 회사 초안은 조회 전24건을 유지하고 적용 후12건, 다른 산업과 교차하면0건 빈 결과가 됩니다. 오류에서 재시도하면10행/24건으로 복구됩니다. 320px 설치 화면은 root320px/표680px/내부 스크롤이며 문서 넘침·중첩 버튼은0, font는 loaded입니다. `.worknotes/browser-evidence/position-directory-installed-runtime.json`과 설치 화면 PNG에 증거를 보존했습니다. 임시 소비자 서버는 종료했습니다. site build와 CI/preview 검증은 이어서 수행합니다. 전체 goal은 진행 중입니다.

최신 d677 기준 비벡터 187파일의 정적 연결은 본서비스178·샘플 전용7·미연결2이며 primary 대응50/HTML export 포함51그룹입니다. 목적 매핑과 독립 구현 목표 수는 다릅니다. 기존186은 이전 원본 파일 집계로 철회한 목표 수입니다. 전체 site build와 generic registry release-check가 통과했습니다.
