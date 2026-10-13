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
