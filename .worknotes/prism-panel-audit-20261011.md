# SidePanel 원본 대조와 반응형 크기 조절

직전 goal turn은 브라우저 연결·공개 화면 읽기 상태를 재확인하고 실제 SidePanel 기본/확대 측정을 인계 기록에 남긴 진척입니다. 이번에는 해당 차이를 코드에 반영하고 독립 설치본까지 검증했습니다. 전체 goal은 active입니다.

## 기준과 실제 원본 비교

- frontend fetch 뒤 HEAD=origin/dev `087811ffba678ece20ee00b1c3c5d117a1d3d323`이며 clean입니다. UI origin/main은 `288b0838aec424f7c83686f3d3b00677d749fa4b`입니다. Git credential/config는 안전 helper가 보존을 확인했고 토큰을 출력하거나 설정에 추가하지 않았습니다.
- 자체 브라우저의 공개 `/sample/chat/side-panel`에서 기본·expandable·확대·닫기를 확인했습니다. 배포 commit은 공개 화면에서 보고하지 않습니다. 기존 Chrome의 인증 `/chat` 화면 내용을 읽지 못한 상태는 전체 목표의 제한으로 남습니다. 사용자 계정·탭·권한을 바꾸거나 서비스 데이터를 저장하지 않았습니다.
- 최종 독립 설치본과 기본440px, 헤더64px/여백20px, 버튼·SVG24px, 경계선#DDE5EB, 그림자 rgba(37,38,46,.06) -4px 0 12px, 본문 여백0/overflow-y hidden을 대조했습니다. source/installed h4는18px/700/검정/높이21px입니다. static/variable 폰트의 제목 폭은66.375/66.390625px로0.015625px 차이가 있습니다. 서로 다른 caller의 전체 패널 높이는 비교하지 않았습니다.
- Expand/Collapse/Close path와 computed paint가 같습니다. 확대 source viewport1280에서width1281/z1250, installed parent inner998에서width999/z1250입니다. 닫힌 source/installed는 width0·visibility hidden·inert·본문 mounted·placeholder0이 같습니다. 모바일 닫기 직후 width0.859375 관찰은 애니메이션 중 값이므로 안정 상태 비교에서 제외합니다.

## 구현과 검증

- title을 ReactNode로 확장하고 class/style/ariaLabel, contentClassName/contentStyle/contentRef를 제공합니다. 본문 여백과 스크롤은 caller가 지정하며 workspace는20px/auto를 명시했습니다. 문자열 h2는600, 원본 rich h4는700을 유지하고 긴 제목의 실제 높이에 따라 헤더를 늘립니다.
- closed content를 mounted/inert로 유지합니다. 외부 닫기에서도 expansion=false intent를 한 번 보내며 owner state를 직접 바꾸지 않습니다. 크기 조절 핸들은 panel 안으로 옮겨 기본 overflow hidden을 유지합니다. 수동 너비 변경은 애니메이션 없이 적용하고 기본 panel은225ms 원본 전환을 사용합니다.
- 실제 연속 조작에서 Left456/Home320/End800/double click440/80px pointer drag520이 동작했습니다. 초기 연속 입력에서는 width 전환 중 이동하는 핸들 때문에 double click이 reset하지 않았습니다. 안정 상태 재시도와 수동 width 즉시 적용 이후 같은 연속 조작이 통과했습니다.
- 독립 설치본에서240px 부모로 줄이면 실제panel238/핸들없음이 되고1200px로 넓히면 선호520이 복구됩니다. 실제320px 모바일의 긴 제목은header125/body313이고 Escape 닫기·재열기에 초안이 유지됐습니다. 실제wheel로scrollTop694까지 이동해 마지막 버튼이 본문 안에 보였습니다. 240×240px 부모도panel238×238/header146/body92이며 초안 입력이 완전히 보였습니다.
- 기본·닫힘·확대·긴 내용 fixture와 완전 PanelExample을 추가했습니다. 28개 완전 예시,50 registry item/75 installed source파일의 shadcn 설치·타입·Vite·폰트 bytes·고지가 통과했습니다. 설치 source를 손으로 바꾸지 않았으며 temporary harness만 추가했습니다.
- 처음175상태 검사에서 관찰 timeout으로 CUA REPL이 초기화됐지만 browser/tab은 살아 있었습니다. 같은28/29/31/32를 inventory에서 확인했고 브라우저·서버를 재시작하지 않았습니다. runtime 재초기화로 자체 browser ID만5→3으로 바뀌었습니다. 각30상태를 별도 기록해 실제175개 고유 상태와manifest의 일치·320px 문서넘침/중첩버튼/표시native입력 이름·warning/error0을 검증했습니다. aria-hidden인1px native form select는 표시 입력 검사에서 제외했습니다.
- 위 렌더 검사의 첫 source fingerprint는15d1c35715767b09ed4f587ef896d80643f21b983f645af35f78ad219e29663a/66 input입니다. 기록은 panel-before-rollback-175-fixtures.json과 panel-before-rollback-source-fingerprint.json으로 보존했습니다.

## 드래그 중 compact 전환 회귀

코드 검토에서 드래그 도중 부모가 compact로 바뀌면 현재 bounds로 취소 너비를 clamp해 시작 전 선호 너비를 복구하지 못하는 경로를 발견했습니다. 새 재현은700→드래그600→부모300→부모1000에서600을 반환해 실패했습니다. 드래그 시작의 표시 너비와 선호 너비를 별도로 보존하고 취소는 선호 너비를 복구하도록 수정했습니다. 실제 표시만 현재 부모 폭으로 제한합니다. 수정 뒤 대상 domain15검사가 통과했습니다. pointer cancel/capture loss와 이 compact interruption은 JSDOM 검증이고 native unexpected cancellation의 증거가 아닙니다.

최종 source fingerprint는16906b727cf14b0d0a957cbf1733d175c2762c230947906908e74e6aa5ece567/66 input입니다. 이 source로 전체175 상태를 새 panel-current-fixtures-* 묶음으로 다시 저장하는 중입니다. 전체 PRISM 테스트·최종 독립 재설치·canonical/generated metadata·site·source/generated 분리 commit·draft PR162 게시와 정확한head/CI/preview readback을 완료한 뒤 아래를 갱신합니다.

## 남은 범위와 인계

인증 ChatPanel/MemoPanel/ProfilePanel/PositionPanel의 상태별 원본 비교, 전체 font/pixel, native unexpected pointer cancellation/capture loss와 production 반영은 미완료입니다. 전체273 목적 대응/49그룹/50항목/테스트 수를 완료 기준으로 사용하지 않습니다.

Raw evidence는 `.worknotes/browser-evidence/`에 있습니다. 현재 화면은 panel-final-short-mobile.jpg와 panel-independent-mobile-scroll.jpg이며 실제viewport320을 기록했습니다. screenshot API bytes는JPEG였으므로 변환하지 않고 JPEG로 저장했습니다. 사용자 탭과 원본 frontend는 유지합니다.

## 최종 로컬 검증과 브라우저 제한

최종143 tests와workspace typecheck가 통과했습니다. 최종16906b72 source의150개고유상태는manifest순서·실제320px·문서넘침/중첩버튼/표시native입력 이름문제0으로저장됐습니다. 남은25개는미검증입니다. 이전15d1c357 source의175검사와구분합니다.

독립 재설치는 ENOSPC로 실패했습니다. 다시 확인한 가용 공간은1.4GiB였으며 확인된 임시 preview PID16113의명령/cwd를확인해종료하고 해당consumer의partial node_modules148MiB만제거했습니다. source/lockfile/dist/evidence는보존했습니다. 재설치가50항목/75source파일·28예시TypeScript/Vite/font bytes/notices를통과했고 최종설치된prism-panel.tsx는registry파일과exact bytes가같습니다. supporting harness도다시빌드했습니다.

사용자에 의한 turn 중단 후 기존unified exec handles가없고loopback listener도없음을확인했습니다. 서버를다시시작했으며일반sandbox의EPERM은승인된loopback 실행으로해결했습니다. 브라우저inventory는기존URL들을유지했지만ID가재배정됐습니다. 대화상자조회와정상HTTP기록화면에대한요청을브라우저도구가URL protocol policy로거절했습니다. 해당조작을중단했고다른브라우저/rawCDP/직접Playwright/우회접근을사용하지않았습니다. 현재source의남은25상태와최종installed runtime은검증할수없어canonical자료에pending으로기록했습니다.

표준site build와6개canonical/generated자료의byte대조,portable예시계약과generic current release 검증을완료한뒤source/generated를분리커밋하고draft PR162에게시합니다. 전체goal의달성으로표시하지않습니다.

## 게시·원격 readback (2026-10-12)

source6b94f2e1/generated4c9f7993242ab777c2d06172e04a352f19a4d227를기존review브랜치에push했습니다. credential exact-match0·Git config보존이며PR162 title Add portable PRISM components and profile exports/draft true/base main/정확한head를읽고재첨부했습니다. Verify UI38149567793 completed/success입니다.

Vercel dpl_3yANb4ypd6auVseDHwADwnAWM7pU는READY/target null/정확한4c9f7993sha의preview입니다. 기존CLI인증으로registry767379bytes/SHA146e1a8b…와manifest238877bytes/SHA4e2c6a67…, verification91250bytes/SHA90eb499d…가로컬과exact bytes임을확인했습니다. preview browser render와production은확인하지않았습니다. 이HTTP readback을막힌25상태의browser검증대신으로사용하지않습니다.

전체source의style·기능목적·고도화와인증state별대조는미완료이고goal active입니다. 다음에는ProfilePanel의840px wrapper/20px 여백·메모전환/뒤로,PositionPanel과ChatPanel caller의구체규격을현재재현본에대조합니다. 브라우저정책차단이해결되면최종source의남은25상태와installed/preview runtime도검증해야합니다.

검증서버75676/75681/75969는각명령·cwd를확인한뒤종료했습니다. 설치source·lockfile·dist·JSON/JPEG와현재커밋들을보존했습니다. 구현과생성물은PR의정확한head에있으며이원격readback/cleanup노트만local modified입니다.
