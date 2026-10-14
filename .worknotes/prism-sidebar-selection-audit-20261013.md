# 사이드바 메뉴·대화 선택과 저장 전 행

직전 goal 턴은 최신 source e5d4d79a의 리더십 결과 태그·삭제 후 처리 계약, 설치·CI·preview 검증을 완료한 진척입니다. 시작 UI HEAD는 30a6b3cc였고 게시 증거를 추가한 이전 작업 기록만 수정돼 있었습니다. 해당 기록을 보존했습니다.

원본 ChatSidebar는 메뉴를 pathname으로 활성화하고 대화 행은 currentId/conversationId/localDraftId로 따로 선택합니다. 저장 전 행은 /chat home에서 activeLocalDraftId로 선택하며 서버 ID가 생기면 같은 localDraftId 기반 row key를 유지할 수 있습니다. 라이브러리의 단일 activeId로 이 조합과 저장 전 열기를 표현하지 못했습니다.

PrismSidebar에 activeHistoryId를 추가했습니다. 생략은 기존 activeId 선택을 유지하고 null은 명시적 선택 해제입니다. history.id는 안정적인 행 key이며 conversationId 생략은 기존 id=서버ID 계약을 유지합니다. conversationId=null/localDraftId로 저장 전 행을 표현합니다. getPrismHistorySelectionId는 원본의 route/store/local-draft 선택을 행 key로 변환합니다.

onHistoryOpen은 conversation 또는 local-draft의 공개 intent만 전달합니다. private 추가 필드는 전달하지 않습니다. 이름 변경·삭제는 서버 conversationId를 받습니다. 서버 ID가 없는 행에는 관련 메뉴가 없고 typed 열기 callback이 없으면 가짜 서버 경로로 열지 않습니다. 현재 페이지의 aria-current와 배경 대화의 선택 표시도 분리합니다. 대상 서버 ID·편집 권한·generating 상태가 바뀌면 이전 편집/메뉴를 취소하며 오래된 draft를 새 대상에 저장하지 않습니다.

완전한 예제에서 즐겨찾기 메뉴와 배경 대화 선택을 함께 표시하고 로컬 초안을 연 뒤 같은 행 key로 저장 상태를 전환할 수 있습니다. 저장 후 이름 변경·삭제는 새 서버 ID를 사용합니다. 다른 메뉴에서 배경 진행 대화를 삭제하면 세션 키만 갱신하고 현재 메뉴를 유지합니다. 예제는 로컬 합성 상태만 바꾸고 실제 서비스·브라우저 경로를 바꾸지 않습니다.

신규 7개와 기존 관계 검사를 합친 대상 23개가 통과했습니다. 기존 호출의 호환성/명시적 null, 독립 메뉴·대화 선택, 원본 선택 조건, public intent, 초안의 서버 액션 금지, 대상 교체 시 오래된 편집·메뉴 취소, 같은 DOM 행의 저장 전환과 배경 삭제 화면 보존을 확인했습니다. 전체 279개 테스트와 workspace typecheck도 통과했습니다. 마지막 대상 재검사에는 배경 메뉴에서 삭제하는 assertion을 추가했으며 전체 suite 이후 source 구현은 바꾸지 않았습니다.

실제 workspace browser에서 즐겨찾기 aria-current와 배경 대화 data-selected가 독립적인 것을 확인했습니다. 로컬 초안 열기·메뉴 부재, 저장 상태 전환·선택 유지, 저장된 서버 ID의 열기·삭제 및 배경 삭제 후 favorites/session1 유지도 확인했습니다. default/loading/empty/restricted를 320/1280px에서 8회 렌더해 문서 넘침·중첩 버튼이 없었습니다.

현재 fingerprint는 dfd7cb666da2422a27ecb4684855713acbaf5fb0f90aef96fd09093bcc146091/85 inputs입니다. 증거는 ignored sidebar-selection-renders.json, sidebar-selection-interactions.json, sidebar-background-delete.json, sidebar-independent-selection.png 및 대상/전체 tests/typecheck 로그에 보존했습니다. 이전 renderer/source 단계의 증거를 이번 fingerprint의 전체 실행으로 재분류하지 않습니다.

실제 설치·최종 site build·검토 브랜치 CI/preview 검증은 이어서 진행합니다. 원본 인증 UI·deployed revision·전체 동작·font/pixel/A4·나머지 목적·추가 종류·고도화 및 production/main 반영은 미완료이며 전체 goal은 active입니다.

실제 shadcn 설치에서 58개 module/CSS 원본 일치와 39개 완전한 예제의 타입 검사·Vite build·font/notices가 통과했습니다. dist-sidebar-selection과 새 HTML/entry를 사용해 기존 소비자 산출물을 보존했습니다. 설치된 browser에서 default 320/1280px, 즐겨찾기와 대화의 독립 선택, 저장 전 대화의 저장 상태 전환·서버 대화 열기를 직접 확인했습니다. 다른 설치 runtime 조합을 모두 확인했다고 주장하지 않습니다.

최종 전체 재검사는 279 tests/0 failures로 끝났습니다. `npm run build`와 `npm run registry:release-check`도 통과했으며 기존 generic registry의 고정 snapshot은 `sha256-25ca4393b38b8fcebbbd34ca3d8c73475e773a766e971da004f94e40728bc896`과 일치합니다. 마지막 source fingerprint 재계산은 위 dfd7cb66/85 inputs와 일치했고 canonical research 4파일과 docs 미러의 bytes가 같습니다. `git diff --check`도 통과했습니다. 다음 단계는 source/generated 분리 커밋, 검토 브랜치 push 및 해당 최종 SHA의 CI·preview readback입니다.

## 검토 브랜치와 원본 접근 재확인

Source 커밋 `deea49c4`, generated 커밋 `bb52fb1c9c8c3f7ff23173d0cb84c3302a7bae5e`를 검토 브랜치에 push했습니다. draft PR #162의 head가 해당 최종 SHA이고 base가 main인 것을 readback했습니다. main은 `288b0838aec424f7c83686f3d3b00677d749fa4b`이며 이번 작업에서 변경하지 않았습니다. Git credential source/target config checksum도 유지했습니다.

Vercel 자동 preview `dpl_9BpRnSCqo4Wrhg79f3rwtpN7RBED`는 READY, target=null, 해당 최종 SHA입니다. URL은 https://pydemia-o7ihyj4c5-pydemia-7822.vercel.app 입니다. 인증된 HTTP readback 16개가 통과했습니다. 15개는 bytes/SHA가 정확히 같고 HTML은 이 배포 ID와 opt-in을 확인한 Vercel feedback script 한 개만 제외한 application bytes가 같습니다. 증거는 ignored `sidebar-selection-final-preview-readback.json`입니다. 브라우저 렌더와 pixel parity를 뜻하지 않습니다. Verify UI run `38355599635`는 마지막 조회에서 build 단계 진행 중이므로 최종 판정은 뒤에 기록합니다.

Chrome 연결 브라우저의 현재 원본 `/chat` 화면을 읽을 수 있었습니다. 기존 사용자 탭의 개인정보처리방침 dialog는 유지했고 별도 측정용 탭에서 footer가 요청한 `testuser001` 계정과 일치하는지 확인했습니다. 원본 채팅 실행·기록 이름 변경·삭제·계정 변경은 하지 않았습니다. 측정용 탭은 이력 펼침을 되돌린 뒤 닫았습니다.

원본과 라이브러리의 computed-style 비교에서 sidebar width 280, header height 64/padding 12px 24px, new-chat 231×40, nav row 255×36, history row height 32, footer height 144/padding 20px 12px가 일치했습니다. content/viewport/state가 달라 전체 높이·위치·선택색·이력 너비를 동일 조건의 parity로 판정하지 않습니다. 원본의 이력 100행에서는 세로 scrollbar 때문에 row 폭이 213이고 현재 합성 예제는 223이므로 긴 이력의 동일 조건 비교가 필요합니다.

보정 후보를 실제 측정으로 확인했습니다. 원본 nav 텍스트 line-height는 21px, 현재는 normal(텍스트 box 16px)입니다. 원본 history 텍스트는 19.6px, 현재 버튼 텍스트는 normal입니다. 원본 새 대화 글자색은 rgb(253,253,253), 현재는 rgb(255,255,255)입니다. font-family는 원본 Pretendard와 현재 Pretendard Variable로 표시되며 같은 glyph/pixel이라고 단정하지 않습니다. 해당 CSS 차이와 긴 이력 비교를 다음 fidelity 작업에서 처리합니다. 증거는 ignored `sidebar-authenticated-style-comparison.json` 및 개인정보가 없는 상단 crop `sidebar-authenticated-header.png`입니다. deployed revision과 다른 인증 화면·전체 목적 검증은 여전히 미완료입니다.

최종 Verify UI run `38355599635`가 completed/success이고 Vercel status도 success인 것을 확인했습니다. CI는 해당 최종 SHA의 타입·테스트·build·PRISM 계약/registry·release 보존·docs 재생성 차이를 검사했습니다. 게시 뒤 추가한 이 절만 다음 source 커밋을 위해 로컬 수정으로 남습니다. 전체 goal은 active이며 다음 작업은 측정된 CSS 차이와 긴 이력의 원본 비교입니다.
