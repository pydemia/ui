# 채팅 상세 접근 오류와 관리자 메뉴 대조

직전 구현 goal turn은 계정 폼의 취소 보정과1218c9ff의 PR/CI/preview readback을 완료한 진척입니다. 이번 시작 checkout은1218c9ff이며 이전 관리자 readback 메모와 시작된 상세 상태/Sidebar 변경분을 보존했습니다. frontend를 credential/config 보존 방식으로 다시 fetch했습니다. 전체 goal은active입니다.

현재 ChatMain은 axios의 지정된 API403/404 listener에서 profile/position open과 선택subject를 모두 비웁니다. 후보자 하위GET,포지션GET/history GET,회사context GET,메모POST,후보자DELETE가 이 분류에 포함됩니다. 다른 API의403/404와401/SSO는 별도 host 경로입니다. listener는 toast 중복 제거 전에 호출됩니다. 독립 컴포넌트에 axios/global singleton/session을 복제하지 않습니다.

usePrismDetailSelection은 profile 또는 versioned/LIVE position의 단일 선택을 호스트가 소유하도록 합니다. close와classified403/404는 선택을null로 비웁니다. 선택 조건으로패널을unmount하는 완전 예시를 제공해 PrismPanel의 기존 hidden mounted 본문에 철회된subject/draft가 남지 않게 합니다. 일반 수동 close guard를 거치지 않는 접근 철회를 실제DOM으로 검사했습니다. API 분류/취소/권한/토스트는host 소유입니다.

captureRequest의instance-scoped UI ticket은같은ID재열기,버전/종류변경,다른hook의늦은오류와unmount후callback을막습니다. ticket은subject데이터나서버인증정보를담지않습니다. ticket없는403/404는원본의classifiedglobal동작이며explicitnull은무시합니다. 동기선택후같은이벤트에서ticket을보관할수있습니다. render중ref를되돌리는대입을제거해state갱신은선택callback에만둡니다.

createPrismAdminMenu는host canManage로노출을결정하며Admin/사용자/회사그룹/포지션블럭/포지션/공지사항을원본순서로제공합니다. 이것은실제권한판정이아닙니다. matchDescendants는opt-in이고/경계하위경로만활성화합니다. 기존정확일치를보존하고다른이름의경로를선택하지않습니다. Sidebar와전체Workspace완전예시는합성데이터/콜백이며관리자사용자목록구현으로세지않습니다.

189개전체PRISM tests가통과했습니다. 새10개는배타선택/DOM제거,수동guard우회철회,상태/nullticket,동기ticket,같은ID/버전/LIVE,instance/unmount,invalid/immutable reference,메뉴gate/5routes,경로경계/legacy/immutability와실제portableWorkspace예시를검사합니다. 최초검사에서factory publicexport가빠진점을수정했습니다. 추가typecheck/registry/설치/site/PR/CI/preview를이어갑니다.

브라우저inventory에Chrome/Edge/IAB가다시표시됐으나현재조작복구나화면일치가증명된것은아닙니다. 이전HTTP정책거절을우회하지않습니다. 관리자목록/페이지복원/상태액션,나머지chat/authStore context,현재DEV의전체디자인/동작/목적,full pixel/font/A4/production이남아있습니다.

## 최종 소스·설치 확인

Frontend HEAD=origin/dev27c4fdbf입니다. 최종 Admin 펼침을 controlled로 연결하고 해당 토글도 완전 예시 시험에 추가했습니다. 최종189 tests/0 fail과 workspace typecheck가 통과했습니다. Registry53 groups/54 items와34개 완전 예시의 import/dependency closure를 확인했습니다. 실제 shadcn 설치와 최종소비자 재검사에서53 TSX와CSS가 emitted exact bytes,변환예외0이며34예시/TypeScript/Vite/font/고지가 통과했습니다. Sourceb49fd5df2019734965d9090c11203f2d7dc694171b2babe94167385b4fa976b4/74 inputs,206개 current fixture의 rendered 검사는0입니다.

React 검토에서는 global HTTP/session listener 복제를 피하고 안정적인 callback과instance ref,선택 조건의unmount,명시적route 경계/label/controlled menu 상태를 확인했습니다. 최초 loopback listen은 sandbox EPERM이었고 실제 설치용 임시 server 범위로 자동 승인을 받아 검증했습니다. Server는finally에서종료됐고 consumer source/lock/dist/node_modules와기록을보존했습니다. 표준site build와기존draft PR/CI/preview를이어갑니다.

표준npm run build가 성공했습니다. Canonical/generated 연구자료4개를 동기화했습니다. 현재main과 기존generic release를 최종 대조하고 소스·생성물 커밋/기존draft PR/CI/HTTPS preview 자산 readback을 진행합니다. 전체goal은active입니다.
