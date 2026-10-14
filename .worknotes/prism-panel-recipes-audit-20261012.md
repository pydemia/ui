# PRISM 패널 조합과 포지션 상세 보완

직전 goal turn은 브라우저 복구 질문에 답하며 Chrome·Edge·자체 브라우저 inventory가 조회되는 증거를 확보한 진척입니다. 실제 페이지 조작 복구는 확인하지 않았습니다. HTTP protocol 정책 거절을 우회하지 않고 다음 소스 구현을 진행했습니다. 전체 goal은 active입니다.

frontend를 다시 fetch한 뒤 HEAD=origin/dev `087811ffba678ece20ee00b1c3c5d117a1d3d323`/clean을 확인했습니다. UI 기준 HEAD는 `4c9f7993242ab777c2d06172e04a352f19a4d227`, origin/main은 `288b0838aec424f7c83686f3d3b00677d749fa4b`입니다. 기존 panel audit의 원격 readback 기록을 보존합니다. Credential과 Git config는 안전 helper가 보존을 확인했으며 비밀값을 출력하지 않았습니다.

## 원본 근거와 구현

- ProfilePanel/MemoPanel의 max840px 본문과 20px 여백, profile memo view의0 20px 여백,24px back/gap6 제목을 재현했습니다. 메모는 hidden 상태에도 mounted이며 후보 변경은 profile로 돌아가고 이전 확인을 취소합니다. 후보 변경 전에 초안을 지킬지 결정하는 정책은 호스트가 소유합니다.
- beforeLeave(back/close,{subjectId,signal})로 원본의 dirty 확인 목적을 제공합니다. app store와 서비스를 복제하지 않았습니다. deny/reject는 현재 view·확대·초안을 보존하며 중복 요청을 막습니다. 후보 변경/외부 닫기/unmount는 이전 결과를 취소합니다. 기본 Panel의 onCloseRequest가 확인 전에 expanded/open을 바꾸지 않도록 했습니다. MemoLeaveDialog는 원본의 메모 작성 중/계속 작성/나가기 확인창입니다.
- ChatPanel의22px SymbolBg/gap6 제목, #EEF1F8 패널,20px 메시지,320px/#D6DCEE 질문, sticky composer의30px bottom·gradient와34px 아래 이동을 조합으로 제공합니다. stream/API/scroll 판단은 호스트 소유이고 닫힌 chat content는 원본처럼 unmount합니다.
- PositionDetailView의 포지션 정의·Business Context·전문성/성공경험·공통 역량 안내문을 복원했습니다. max840px, scroll gap20/padding20, summary16px/radius12, 원본 구조 skeleton과 기본 정보 카드를 반영했습니다. skeleton 본문은 원본처럼 넘치는 부분을 감추고 ready 본문과 구분합니다. NoData13px/보조색과 label line-height도 source에서 확인했습니다. 320px 이하 부모의 정보 카드는 수직 배치로 개선합니다. LIVE 조회/주직무 선택/요청 취소는 호스트 경계입니다.
- PrismProfile에 onComments/onPrint/commentCount를 전달해 완전 profile에서도 메모 전환을 연결할 수 있습니다. React 훅 점검 후 view reset은 이전 state를 updater 인자로 읽어 effect의 closure 의존성을 제거했습니다.

## 최종 로컬 검증

새 확인창의 계속 작성/Escape/나가기 검사를 포함한 전체152 tests/0 fail, workspace typecheck,50그룹/51항목·29개 완전 예시 계약 검사가 통과했습니다. 최종 shadcn 독립 설치, TypeScript/Vite, 폰트 bytes와 고지 검사도 통과했습니다. 설치된 recipe/panel/position/profile와 prism.css는 emitted registry bytes와 같습니다. 표준 npm run build, canonical/generated 검증 자료4개 대조와 generic current release sha256-25ca4393b38b8fcebbbd34ca3d8c73475e773a766e971da004f94e40728bc896 검사가 통과했습니다.

최종 source fingerprint는 `2c69397ecc24ca100f693a5ce6959ca3cedcc9f65160c02a2f30a43b97efc828`/68 input입니다. 새185 fixture의 실제 브라우저 검사는0이며 이전16906b72의150/175는 별도 history로 보존했습니다. JSDOM dialog 검사는 native focus/modal의 증거가 아닙니다. runtimeAvailability의 오래된 available 표시를 현재 정책 제한에 맞춰 restricted로 수정했습니다. 과거 게시 증거를 이 source의 게시로 표시하지 않습니다.

독립 consumer는 `/private/var/folders/ht/0ztx9m_d3xz1lg1m0rsy6bk80000gn/T/prism-consumer-UAveFJ`입니다. source/lock/dist/의존성과 raw evidence를 보존했고 helper 종료 시 로컬 registry 서버가 정리됐습니다. 로그와 byte 대조는 `.worknotes/browser-evidence/panel-recipes-*`에 있습니다.

인증 원본의 상태별 화면·전체 pixel/font·native unexpected pointer cancel·production은 미완료입니다. 구현과 검증 자료를 source/generated로 분리 commit해 기존 draft PR162를 갱신하고 정확한 head/CI/preview 자산을 확인합니다. 전체273 목적 대응이나 테스트·항목 수를 완료 기준으로 사용하지 않습니다.

## Draft PR·CI·preview readback

Source `36828846607f3150b4727830a438d8f5433b1a47`와 generated `cf38ab3d934afd2ec91dcb0cb748b0bf222dd827`를 기존 review 브랜치에 push했습니다. Credential exact-match0과 Git config 보존을 확인했습니다. PR162는 Add portable PRISM components and profile exports/draft true/base main/head cf38ab3d로 읽고 재첨부했습니다. Verify UI38153164385는 completed/success입니다.

Vercel `dpl_F6DBA7rVpTweRjU94K6D3mCX8QyF`는 READY/target null/정확한 cf38ab3d SHA의 preview입니다. `https://pydemia-n1tqc82ez-pydemia-7822.vercel.app`에서 기존 CLI 인증으로 registry785668 bytes/SHAe7a1a534…, manifest251154 bytes/SHAd5965f7b…, verification95780 bytes/SHA5a03dd88…, 새 panel-recipes item9974 bytes/SHA2d2b7db2…의 로컬 exact bytes를 확인했습니다. HTTP readback을 실제 화면 조작이나 pixel 비교의 증거로 사용하지 않습니다.

Preview browser render와 production은 확인하지 않았습니다. 인증 원본·모든 source 스타일/목적·고도화의 검증이 남아 전체 goal은 active입니다. 다음에는 원본별 본문·카드·서비스 상태의 남은 대응을 이어가고, 브라우저 정책이 해결되면 현재 source185 fixture·독립 설치·preview의 실제 조작과 원본 화면 대조를 수행해야 합니다. 코드와 생성물은 원격 head에 있으며 이 게시 readback 메모만 local modified로 보존합니다.
