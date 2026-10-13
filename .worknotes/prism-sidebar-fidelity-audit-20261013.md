# 사이드바 타이포그래피와 긴 이력 비교

이전 goal 턴은 sidebar 선택/초안 전환을 source/generated 커밋 bb52fb1c까지 게시하고 CI·preview 산출물 검증을 완료한 진척입니다. 이번 시작 상태는 그 게시 증거를 적은 이전 작업 기록만 수정돼 있었습니다. 해당 기록과 소비자 산출물을 보존했습니다.

실제 testuser001 원본의 사이드바에서 nav line-height 21px, history 19.6px, 새 대화 글자색 #fdfdfd를 측정했습니다. library의 normal/normal/#fff를 해당 값으로 보정했습니다. history 스크롤바도 원본의 10px/transparent track/3px transparent thumb border 규칙으로 사이드바 내부에만 적용했습니다. disabled 버튼 색 계약은 유지합니다.

완전한 예제에 후보자 목록 메뉴를 추가했고 진입 시 서버 대화·초안 선택을 해제합니다. 즐겨찾기에서는 배경 대화 선택을 유지합니다. 새 long fixture는 합성 이력 100행과 긴 제목을 제공하며 상태를 전환할 때 이전 fixture 상태를 재사용하지 않습니다. 신규 1개 목적 검사와 관련 24개, 전체 280 tests/0fail 및 workspace typecheck가 통과했습니다.

5개 상태(default/loading/empty/restricted/long)를 320/1280px에서 10회 렌더했습니다. 문서 넘침·중첩 버튼은 0이고 long은 두 폭에서 100행/213px 행 너비입니다. 마지막 행 열기는 history scrollTop 3313으로 이동하고 선택/표시를 유지했습니다. footer y는 전후 428로 같습니다. 후보자 목록 진입 뒤 selected history는 0입니다.

최신 source fingerprint는 259cf5a223358cf3497e68de7de53b1bc65e6e175db06558a1b580efa63530a0/85 inputs입니다. ignored sidebar-fidelity-renders.json, sidebar-fidelity-long-interactions.json/.png, sidebar-fidelity-source-comparison.json 및 tests/typecheck 로그에 증거를 보존했습니다. 원본의 민감한 이력 제목은 비교 증거로 복사하지 않았습니다.

## 새 배포 범위 발견

원본 비교에서 새 포지션 목록 메뉴를 발견해 frontend를 fetch했습니다. clean dev를 d677e551a61f672025dcc1803a56ff0cab1e36ee로 fast-forward했습니다. e5d4d79a 이후 74파일에 변경이 있고 새 user position-list 3 TSX, EtcIcon, PositionList page/route와 서비스·출력·메시지 변경 등이 포함됩니다. 정확한 배포 SHA는 아직 확인하지 못했으며 source inventory의 e5 기준 271파일/87벡터/184비벡터를 d677 기준이라고 보고하지 않습니다. 새 목적·delta의 대응표 감사와 구현은 다음 작업입니다.

100행씩의 원본/합성 비교에서 선택한 16개 치수·스타일 중 15개가 같습니다. sidebar 280, header 64/12px 24px, new-chat 231×40/#fdfdfd/19.6px, nav 255×36/21px, history 213×32/x44/19.6px, footer 144입니다. history 시작 y는 원본 329/현재 289로 다릅니다. 원본의 추가 포지션 메뉴 40px를 아직 예제에 포함하지 않았으므로 전체 sidebar parity를 통과로 판정하지 않습니다. viewport 높이·제목·선택 상태·font-family도 다르며 전체 pixel/font/동작 비교와 새 화면은 미완료입니다.

이번 보정의 실제 소비자 설치·site build·CI/preview 검증은 이어서 진행합니다. 전체 goal은 active입니다.

## 독립 예제 레이아웃 보정

실제 소비자에서 문서 전용 CSS 누락을 발견했습니다. 초기 설치의 row 폭은 223이고 footer y는 3687이었으며 마지막 행 열기가 문서 전체를 이동시켰습니다. 이 결과를 `sidebar-fidelity-installed-runtime-before-layout-fix.json`에 보존했습니다. 예제 자체에 flex/520px height/border-box/main padding을 명시하고 같은 CSS를 사용한 설치 파일과 39개 예제를 다시 검증했습니다.

최종 source fingerprint는 69949a21ca0852e61f052617801fdc36259eb3a2255c3150309ba2436238afe4/85 inputs입니다. CSS와 기능은 앞선 측정과 같고 예제의 컨테이너 의존성만 제거했습니다. 현재 hash의 5개 상태를 두 폭에서 10회 다시 렌더해 넘침·중첩 버튼이 없었습니다. source 비교 자료는 당시 259cf5a2로 보존하며 새 hash에서 원본 전체를 다시 실행했다고 보고하지 않습니다.

최종 설치 browser에서는 320/1280 모두 100행, row 폭 213, sidebar height 518입니다. 마지막 행을 열어도 footer y는 375로 유지되고 history 내부 scrollTop이 3313으로 바뀝니다. 후보자 목록 진입 뒤 선택 이력은 0입니다. 최종 소비자 TypeScript/Vite/font/notices 및 58 module/CSS bytes가 통과했습니다. 임시 소비자 서버와 tab은 종료했고 viewport override를 해제했습니다. 신규 목적 검사를 포함한 sidebar 8 tests도 최종 예제에서 통과했습니다. 전체 280의 최종 재검사와 site build/CI/preview 판정은 다음 절에 기록합니다.


최종 전체 재검사에서 기존 재매핑 테스트의 연속 선택이 실패했습니다. 별도 진단에서는 한 테스트만 실행하면 통과하지만 전체 22개에서는 세 번째 콤보박스가 keydown 직후에도 closed였습니다. 이전 선택창의 비동기 포커스 복귀 전에 다른 trigger로 synthetic keyboard event를 보내는 순서였습니다. 도우미가 먼저 해당 trigger에 포커스를 주고 선택 뒤 closed/focus 반환을 실제 조건으로 확인하도록 수정했습니다. 대기 상한 1초와 기존 재매핑 assertions는 유지했고 close/focus assertions를 추가했습니다. 수정 후 22개 대상과 현재 전체 280 tests/0fail이 통과했습니다. 제품 코드는 이 테스트 수정 때문에 바꾸지 않았습니다.

최신 원본 d677 기준 실제 components/layouts TSX는 275파일(벡터88/비벡터187)이며 이전 inventory 대비 새 4파일만 추가됐고 삭제는 없습니다. ignored sidebar-fidelity-latest-source-delta.json에 경로를 기록했습니다. 이 수는 파일 수이며 독립 구현 목표 총수나 구현 완료 수가 아닙니다. 기존 inventory는 이전 감사 범위로 보존하고 새 화면 대응은 다음 작업에 남깁니다.

최종 site build, check-prism(58그룹/39 완전한 예제), release-check가 모두 통과했습니다. Generic registry는 기존 고정 snapshot sha256-25ca4393b38b8fcebbbd34ca3d8c73475e773a766e971da004f94e40728bc896과 같고 canonical research 4파일과 docs 미러가 일치합니다. Build 뒤 성공 gate만 갱신했으며 components manifest SHA가 바뀌지 않아 번들의 inline manifest와 생성물이 일치합니다. 다음 단계는 source/generated 분리 커밋과 최종 SHA의 CI·preview readback입니다.
