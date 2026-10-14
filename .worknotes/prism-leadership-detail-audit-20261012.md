# 리더십 요약 상세·색상·인쇄 대조

직전 goal turn은 브라우저 연결 질문에 답하며 Chrome·Edge·자체 브라우저 inventory와 공식 연결/Locked use 안내를 다시 확인한 진척입니다. 목록 조회는 실제 페이지 조작 복구를 증명하지 않습니다. HTTP protocol 정책 거절은 우회하지 않습니다. 이번 turn의 시작 상태는 UI78ef5a03이고 이전 프로필 게시 readback 기록의 수정만 보존했습니다.

frontend를 기존 인증 설정 보존 방식으로 다시 fetch했고 HEAD=origin/dev27c4fdbf/clean을 확인했습니다. LeadershipPieSummary/SCSS, LeadershipPie, mapLeadershipPie, print mapper/preview와 공유 tag 규격을 읽었습니다. 최신 deployed revision binding은 확인하지 않았습니다.

## 구현

PrismLeadershipPieSummary.title은 파란 유형 태그, description은 summary.content의 굵은 문장, detail은 summary.description의 구분선 아래 본문입니다. 기존 description 계약은 유지합니다. 상세만 있는 경우도 정보로 표시하며 공백 상세에는 구분선이 없습니다. React text로 렌더해 원문 HTML을 실행하지 않습니다. PrintModel은 같은 typed summary를 사용해 새 detail을 전달하며 reference-limits에서도 상세 본문을 보존합니다.

원본 화면16px box gap/padding,12px radius,20px main gap,6px comment gap과14px bold/body를 맞췄습니다. 인쇄8pt box gap/padding/radius,80pt min-height,20pt main gap,2pt chart gap,6pt comment gap,10pt 본문과8pt tag 규격을 반영했습니다. 지·덕·용은#327BB7/#42938A/#DDB77D로 변경했습니다.660px caption 줄바꿈 외에480px row stacking,긴 tag wrapping,resize 예시를 제공합니다.

완전 사용 예시와 recipe/7분류 print fixture에 상세를 추가했고 chart/print에 detail-only fixture를 추가했습니다. Baseline reference087811ff는 유지하며 최신 delta만27c4fdbf로 scoped audit해 AI용 manifest/registry에도 전달합니다. 과거 rendered 검증은 별도 기록으로 보존합니다.

## 검증

Targeted16 tests와 전체165 tests/0 fail가 통과했습니다. 처음 typecheck는 새 fixture의 label 누락을 발견했고 label을 추가한 최종 workspace typecheck가 통과했습니다. 새4 tests는 요약/상세 분리·문자/줄바꿈/escaping·missing/zero/detail-only·공백 omission·인쇄의 모든 option/textPolicy와 host immutability를 검사합니다. React 체크리스트에서 직접 import, derived render state, 안정적인 typed props와 accessible table을 확인했습니다.

Registry 재생성·실제 shadcn consumer 설치·전체 site build·generic release 보존·원격 PR/CI/preview readback을 이어갑니다. 실제 최신197 fixture 화면 비교와 A4/native print,인증 원본,position version,관리자·chat 최신 변경,production은 미완료입니다. 전체 goal은 active입니다.


## 최종 설치·build

기본 태그의 auto height가 짧은 내용에서도 원본 높이를 늘릴 수 있어 화면21px/인쇄15pt를 유지했습니다. 긴 태그는 wrapTitle 명시 또는480px 이하에서 auto height/줄바꿈을 적용합니다. 이 보정 후 최종 workspace typecheck와165 tests가 다시 통과했습니다. Source 수정 뒤 처음 registry 검사는 이전 생성물 SHA 차이를 발견했고 재생성한 최종 검사에서 해소했습니다.

52그룹/53항목,32개 완전 예시와 실제 shadcn 재설치,TypeScript/Vite/font/고지 검사가 통과했습니다.52개 TSX와CSS 모두 exact emitted bytes이며 변환 예외는0입니다. 표준 npm run build가 성공했습니다. Source fingerprint는f2ee00893ee4f59e56bc661ed23805cfe7d4b4a342b64a152db9028258494847/71 inputs이고197 current fixture의 실제 화면 검사는0입니다. canonical/generated 연구 자료4개는 최종 byte 대조합니다.

다음 source delta는 포지션 카드의 version입니다. 원본 JSON mapper는 legacy card의 version을1로 표시하고 카드 상세는 해당 version으로 조회하며 본문 링크에는 version이 없어 현재LIVE를 조회합니다. 현재 PrismResponse.onPositionOpen은 id만 전달해 이 목적을 보존하지 못합니다. typed recommendation/reference 전달과 host 조회 분리를 이어가야 합니다.


## PR·CI·preview readback

Source bfffb526/generated efbd59a84016eee301e3919deedb419602d54740을 기존 review 브랜치에 push했습니다. Credential exact-match0과 Git config 보존을 확인했습니다. PR162는 draft true/base main/정확한efbd59a8 head로 읽고 재첨부했습니다. Verify UI38208649272는 completed/success입니다. 로컬과 CI에서 generic current release25ca4393 및 생성물 재현 검사가 통과했습니다.

Vercel dpl_DoAuLFFPqv7XZXh7CMZGj7u3ohfm은 READY/target null/정확한efbd59a8 SHA의 preview입니다. https://pydemia-clr6plygh-pydemia-7822.vercel.app에서 기존 CLI 인증으로 registry810258bytes/SHA280e1916,manifest267629bytes/SHA323bda59,verification109719bytes/SHAa3772a6a,profile-sections13948bytes/SHA97db980b,chart16974bytes/SHA704e0dd4,profile-print20831bytes/SHA2b4d2176의 로컬 exact bytes를 확인했습니다. 전체 hash는 leadership-detail-preview-readback.json에 보존합니다. HTTP readback은 화면·pixel·print 비교 증거가 아닙니다.

코드/생성물은 게시한 head에 있고 이 readback 메모만 local modified로 보존합니다. Consumer source/lock/dist/node_modules를 보존했고 helper registry server는 finally에서 종료됐습니다. 이 phase에서 자체 dev server를 시작하지 않았습니다. 전체 goal은 active이며 최신 position version/admin/chat와 인증 원본·전체 디자인/동작 목적·확장 coverage/실화면/A4/production은 이어서 확인해야 합니다.
