# PRISM 검증 기록

## 2026-10-13 후보자 카드·평가 표

배포된 공개 Templates 샘플에서 후보자 1명, 2명, 5명, 6명의 카드 배치를 확인했습니다. 원본 `ChatTemplateProfile`은 전체 후보 수로 stack/pair/grid를 고르고 패널에서는 3명을 먼저 보여 준 뒤 2명씩 추가합니다. 설치용 `PrismCandidateProfiles`에 이 동작을 제공하고 선택·즐겨찾기는 소비자의 상태와 callback에 맡겼습니다. 카드 사진은 70×70px, 즐겨찾기는 우측 상단으로 맞췄습니다. 원본의 좁은 3열 배치는 읽기 어렵기 때문에 컨테이너 폭 800px 이하에서 2열, 560px 이하에서 1열로 바꾸고 긴 이름을 줄임 없이 표시합니다.

원본 `ChatTemplateTable`의 임의 열·행은 `PrismGridTable`, 준비된 6-Frame 평가의 2열 상세·3열 결과는 `PrismCandidateAssessmentTable`로 제공합니다. `적합`·`보완필요`만 상태 칩으로 표시하며 그 밖의 판정 문자열은 그대로 둡니다. 로컬 320px 화면에서 문서 폭은 320px, 카드 사진은 70px이고 표는 288px 영역 안에서 가로 스크롤합니다. 5명 패널은 3명→5명→접기를 확인했습니다. 전체 PRISM 테스트 311개, 타입 검사, 사이트 빌드와 레지스트리 검사가 통과했고 별도 shadcn 소비자에서는 59개 TSX·CSS의 생성본 바이트 일치, 40개 예제 타입 검사, Vite·폰트·고지를 확인했습니다. 이 기준에서 후보자 그룹을 완료로 판정해 **7/58개**입니다. 인증이 필요한 실제 후보자 이동·즐겨찾기 저장과 배포 소스 SHA는 확인하지 못했으며 소비자 연동 범위로 남깁니다.

## 2026-10-13 기본 버튼과 새 대화 버튼

배포된 공개 Button 샘플과 독립 예제를 브라우저에서 비교했습니다. 중간 크기 경고 버튼은 양쪽 모두 32px, 배경 `#ea002c`이고 hover에서는 `#e45858`과 흰색 오버레이를 사용합니다. 비활성 경고 버튼은 28px·`#d7dce3` 배경, 비활성 line/shape 아이콘 버튼은 28×28px·20px 아이콘이며 색과 테두리가 측정 범위에서 일치했습니다. 새 대화 버튼은 40px 높이, 8px 반경, 원본 `AddIcon` 28px, 같은 gradient입니다. 비활성 버튼의 테두리는 양쪽 모두 0px입니다. 샘플 컨테이너 폭은 원본 932px, 독립 예제 232px로 달라 버튼 너비의 픽셀 일치라고 판단하지 않습니다.

`PrismNewChatButton`에 원본 아이콘·문구 기본값을 넣고 사이드바도 공유 기본값을 쓰게 했습니다. 독립 예제의 클릭과 Enter는 합성 callback을 각각 한 번 호출했고 비활성 버튼은 실행되지 않았습니다. 별도 shadcn 소비자에 button/sidebar/tokens를 재설치해 59개 모듈·CSS의 생성본 바이트 일치, 40개 예제 타입 검사, Vite·폰트·고지를 확인했습니다. 설치본 브라우저에서도 40px 버튼·28px 아이콘과 합성 클릭·Enter 각 1회, 비활성 상태를 확인했습니다. 원본 공개 샘플에는 새 대화 실행 handler가 없으므로 실제 제품 탐색 결과, 다른 focus/hover 조합, 전체 폰트·픽셀 일치는 미검증입니다. 원본 아이콘 버튼 샘플에는 접근 가능한 이름이 없지만 독립 버튼은 이름을 요구합니다.

로컬 사이드바 접힘/펼침에서는 새 대화 버튼이 각각 40px/231px이며 두 상태 모두 아이콘 28px, 접힌 버튼의 접근 가능한 이름을 유지했습니다. 접힌 상태의 문서 가로 넘침은 0px입니다.

## 2026-10-13 Badge·Tag·Chip 기본 샘플

배포된 Badge·Tag·Chip 샘플과 독립 기본 예제를 브라우저에서 비교했습니다. 원본 CountBadge는 24px AlarmIcon 위에 건수를 겹쳐 표시합니다. 원본과 로컬 모두 배지 시작점이 아이콘 기준 가로 +13px·세로 -2px이고 `1`과 `99+`의 폭은 각각 14px·14.359375px입니다. s-ELP/ELP의 높이는 16px, 폭은 37.09375px/27.40625px이며 배경·테두리·글자색도 일치했습니다. 세 가지 Tag는 21px, 네 가지 명시 색상 `Status` Chip은 52×22px이고 측정한 색·타이포그래피가 일치했습니다. 원본 사용처의 Chip 25건은 모두 색을 명시합니다. 로컬 삭제 가능 Tag는 합성 상태에서 클릭 후 제거됐습니다.

원본 샘플은 Tag 삭제를 실행하지 않으므로 원본 삭제 동작과 키보드 동작은 확인하지 못했습니다. 다른 상태·제품 사용처·폰트와 픽셀 전체 일치도도 남아 있습니다. Chip의 기본 `tone`은 독립 라이브러리 확장으로 유지하며 원본의 미사용 무색상 fallback과 같다고 주장하지 않습니다.

## 2026-10-13 새 대화 인트로·시작 질문

인증된 PRISM-DEV `/chat` 기본 화면에서 인트로 폭 800px, 인사말 167px, 즐겨찾기 카드 800×149.1875px, 시작 질문 45.59375px 높이, 입력창 800×110px을 측정했습니다. 카드의 제목과 설명은 본문 한 묶음이라 둘 사이에 카드의 14px 간격이 들어가지 않습니다. 시작 질문은 배경 `#f7f9fd`, 글자색 `#363636`입니다. 원본에서 질문을 선택하자 textarea에 문구가 들어가고 포커스가 이동했으며 합성 초안은 제거했습니다. 배포 SHA와 로컬 frontend `d677e551`의 동일성은 확인하지 못했습니다.

독립 `PrismChatIntro`도 카드 본문을 묶어 기본 카드 높이 149.1875px로 맞췄고 질문 색상·카드 hover를 원본 소스에 맞췄습니다. 독립 shadcn 설치본에서 질문 선택은 controlled 값을 바꾸고 textarea에 포커스를 이동했으며 전송 횟수는 0회였습니다. 카드 클릭은 callback 한 번만 호출했습니다. 로딩 시 48px 아이콘·120/180px 문구 skeleton을 카드 안에 표시하고 카드 버튼은 제거합니다. 설치본 320px 기본·로딩 상태에서 문서 가로 넘침은 0px이었습니다. 59개 설치 모듈·CSS의 원문 일치, 40개 예제 typecheck와 Vite·폰트·고지 검사가 통과했습니다. 배포 원본의 로딩·좁은 화면·hover 상태, 실제 즐겨찾기 라우팅과 전체 pixel/font 일치는 확인하지 못했습니다.

## 2026-10-13 대화 입력창 기본·긴 내용

인증된 PRISM-DEV의 빈 대화 입력창에서 외곽 800×110px, 내부 798×60px 입력 영역, 20px 첫 글줄, 48px 동작 영역, 28px 전송 버튼을 측정했습니다. 2000자 `maxLength`가 있고 빈 값에는 글자 수가 보이지 않습니다. 가상 문구를 입력했을 때 `5/2000자`가 표시되고 전송 버튼이 활성화됐습니다. 측정 후 가상 초안은 제거했습니다. 배포 SHA와 로컬 frontend `d677e551`의 동일성은 확인하지 못했습니다.

독립 `PrismChatInput`의 기본 표시도 800×110px, 60px 영역·20px 첫 글줄·48px 동작 영역·28px 버튼으로 맞췄습니다. 원본의 기본 placeholder, 빈 값의 글자 수 숨김, 2000자 입력 상한, 생성 중 placeholder·20px spinner·28px 중단 버튼을 적용했습니다. 합성 입력 1000자를 320px에서 표시했을 때 textarea는 최대 100px까지 늘고 내부 스크롤을 제공했으며 문서 가로 넘침은 없었습니다. 2001자를 입력하려고 해도 실제 값은 2000자에서 멈췄습니다.

독립 설치본에서 생성 중단 버튼이 전송 버튼으로 바뀌는 순간 초안이 의도치 않게 전송되는 문제를 발견해 버튼의 기본 제출 동작을 제거했습니다. 수정본 브라우저에서 생성 중단 후 합성 초안은 남고 전송 횟수는 0회였으며 전송 버튼을 한 번 누른 뒤 1회가 됐습니다. 실제 API 대신 합성 상태를 사용한 검사입니다. 배포 원본의 실제 생성 중 화면·파일 첨부·API 전송과 중단·다른 브라우저의 IME 동작은 확인하지 못했습니다.

## 2026-10-13 개인정보처리방침 대화상자

현재 frontend dev `d677e551`에서 문의 내역 대화상자는 import·mount되어 있지만 사이드바 메뉴 진입 버튼이 주석 처리되어 있습니다. 따라서 이를 현재 배포 UI에서 접근 가능한 독립 목적 하나로 추가 계상하지 않습니다. 개인정보처리방침은 사이드바에서 실제로 열렸고, 인증된 배포 화면에서 620px 대화상자·663px 본문·140px 버전 선택·닫기 footer·긴 iframe 본문을 측정했습니다. 배포 SHA와 로컬 소스 revision의 동일성은 확인하지 못했습니다.

`PrismPrivacyPolicyDialog`는 소비자가 제공하는 버전·HTML·로딩 상태를 표시합니다. 원본과 같이 script 실행 권한을 제외한 sandbox iframe을 쓰며, 문서의 너비·높이를 실측해 스크롤을 대화상자 본문에 둡니다. 로컬 합성 문서에서 620px 대화상자, 140px 선택기, 73px footer, 세로 내부 스크롤을 확인했습니다. 768px 폭의 합성 표를 선택했을 때 본문 `scrollWidth`는 792px였고, 320px viewport에서는 296px 대화상자 안의 본문 `scrollWidth`가 784px로 늘어 가로 스크롤을 제공했습니다. 버전 전환 중 이전 HTML 유지·흐리게 표시, 문서가 없는 로딩/오류 상태와 닫기 동작은 독립 컴포넌트 검사로 확인했습니다. 실제 방침 API 요청 순서·실패 복구는 호스트가 소유합니다. 실제 방침의 모든 버전, 배포 오류 상태, 픽셀·폰트 동일성은 미검증입니다.

최종 289개 PRISM 테스트와 workspace typecheck가 통과했습니다. 59개 그룹/60개 레지스트리 항목을 생성했고 별도 소비자에 설치한 59개 모듈의 바이트 일치, CSS·40개 사용 예제의 타입 검사와 Vite 빌드, 폰트·고지를 확인했습니다. 설치본 브라우저에서도 620px 대화상자·140px 선택기, 긴 문서의 세로 스크롤, 넓은 문서의 가로 스크롤, 320px 화면의 footer와 닫기 동작을 확인했습니다. 이전 공지 검증에 기록한 287개 테스트는 그 당시 revision의 결과입니다.

## 2026-10-13 공지 목록·상세

인증된 PRISM-DEV 공지 목록에서 최신순/오래된 순 전환과 상세 이동을 확인했습니다. 목록은 `Total`을 표시하고, 목록 응답과 별개로 상세 본문을 조회합니다. 원본 `d677e551` 소스는 한 번에 최대 100건을 받아 날짜 기준으로 정렬하며, 별도 전체 건수·목록 로딩·상세 로딩을 유지합니다. 배포 리비전과 이 소스 리비전의 동일성은 확인하지 못했습니다.

배포 화면의 목록 대화상자는 560×639px, 본문 500px, 목록 본문 412px, 행은 약 40px이었습니다. 로컬 기본 예제에서도 같은 외곽·본문·행 크기를 확인했습니다. 상세 화면은 양쪽 모두 560×439px 외곽과 300px 본문 높이였습니다. 로컬 상세 내용 블록은 원본 측정값과 아직 몇 px 차이가 있으므로 전체 픽셀 일치로 판정하지 않습니다.

`PrismNoticeDialog`는 소비자가 제공한 전체 건수, 목록 정렬, 목록/상세 독립 조회 상태와 상세 응답을 표현합니다. 목록에는 본문 없는 요약만 전달할 수 있고, 상세 응답 ID가 현재 선택 ID와 다르면 표시하지 않습니다. 목록 로딩 6행, 상세 로딩, 뒤로가기·닫기와 합성 상세 예제를 확인했습니다. 320px에서는 288px 대화상자 안의 256px 목록 영역이 512px 표를 내부 스크롤하며 문서 가로 넘침이나 중첩 버튼은 없었습니다. 데이터 요청·취소·권한·첨부 다운로드는 소비자가 담당합니다. 현재 검사는 기본 목록·선택 상세와 로컬 합성 상태에 한정되며 배포 오류/빈 목록/첨부 및 모든 화면 크기 비교는 남아 있습니다.

대상 3개 검사를 포함한 전체 PRISM 287개 테스트와 workspace 타입 검사가 통과했습니다. 새 소비자에 레지스트리 60항목을 설치해 40개 완전 예제의 TypeScript/Vite 빌드·폰트·고지를 확인했고 공지·대화상자 TSX 및 CSS는 생성 내용과 설치본 바이트가 일치했습니다. 전체 사이트 빌드와 기존 generic registry release-check도 통과했습니다. 이 결과는 합성 소비자의 설치·동작 증거이며 실제 공지 API 연동이나 배포본 검증은 아닙니다.

## 2026-10-13 기본 글줄바꿈 규칙

최신 frontend dev `d677e551`의 reset은 `body`에 `word-break: keep-all`과 `overflow-wrap: anywhere`를 둡니다. 인증된 배포 대화 화면의 body·답변 문단·표 셀에서도 두 computed 값이 같았습니다. 현재 배포 SHA와 소스 리비전의 동일성은 확인하지 못했습니다. 독립 PRISM light root에 같은 상속 규칙을 넣고 로컬 화면의 root·포지션 표 셀에서 값을 확인했습니다. 320px에서 문서 폭은 320px이고 680px 표는 256px 영역 안에서 스크롤합니다. 5개 합성 상태를 320/1280px에서 다시 확인했고 가로 넘침·중첩 버튼은 없었습니다. 전체 PRISM 284개 테스트와 workspace typecheck가 통과했습니다. 새 shadcn 설치에서는 60항목·40예제의 TypeScript/Vite/font/고지를 확인했고 설치된 `prism.css`가 현재 소스와 바이트 단위로 일치했습니다. 세부 포지션 검색·탭 동작의 설치본 브라우저 증거는 이전 source fingerprint에 속합니다. 현재 site build와 기존 generic registry release-check도 통과했습니다. 이 검사는 선택한 화면의 줄바꿈·가로 넘침만 확인한 것이며 다른 상태의 픽셀 일치는 별도입니다.

## 2026-10-13 사용자 포지션 목록

최신 frontend dev d677e551에서 사용자용 LIVE 포지션 목록과 새 EtcIcon을 확인했습니다. 현재 components/layouts TSX는 275파일(벡터 88, 비벡터 187)입니다. 네 신규 파일을 목적별 대응표에 연결했습니다. 이 수는 원본 파일 수이며 구현 목표 컴포넌트 수나 완료율의 분모가 아닙니다. 현재 정적 연결은 본서비스 178파일·샘플 전용 7파일·미연결 2파일이며 비벡터 원본은 primary 50그룹(별도 HTML export 포함 51그룹)에 대응합니다. 연결 여부와 그룹 대응은 실제 렌더·완성 여부를 증명하지 않습니다. 나머지 변경 파일의 새 동작과 전체 원본 상태는 계속 감사해야 합니다.

인증된 testuser001의 `/chat/positions` 기본 화면은 총 1023건, 10행, 회사·포지션·산업·직무·직책 열을 표시했습니다. 800px 표의 열 폭은 160/280/120/120/120px, 행 높이는 60px, 필터 높이는 50px이고 머리 배경은 #eef2fa입니다. 로컬 독립 컴포넌트는 필터 초안/적용 분리, LIVE 서버 query, 정렬·페이지, 상세 탭 재사용·닫기 및 호스트가 제공하는 상세 내용을 지원합니다. 4개 목적 검사와 5상태×320/1280px 합성 렌더가 통과했습니다. 합성 렌더에서 문서 가로 넘침·중첩 버튼은 없고 좁은 화면에서는 표 내부 스크롤이 있습니다. 원본 상세 행 클릭은 브라우저 입력 시간 초과로 직접 검증하지 못했습니다. 배포 SHA 결합, 실제 서비스, 전체 화면의 글꼴·픽셀 일치도 미검증입니다.

최종 전체 PRISM 테스트284개, 레지스트리59그룹/60항목 검사와40개 완전 예제의 실제 shadcn 설치·TypeScript/Vite/font/고지가 통과했습니다. 설치본 브라우저에서 이름·회사·산업 필터, 정렬·페이지 이동, 행 상세 탭 재사용·닫기, 오류 재시도, 320px 표 내부 스크롤을 확인했습니다. 이 동작은 합성 데이터로 검증했으며 원본 서비스와 권한을 실행한 결과는 아닙니다.

직전 사이드바 보정은 draft PR #162의 aa761eb9에 게시됐고 Verify UI run 38362050081이 성공했습니다. 자동 preview dpl_DqcLE7xPTnGrWZEEJayrME8YHdUF는 READY이며 16개 HTTP 산출물 readback이 통과했습니다. 이 게시 증거는 직전 사이드바 수정본에만 적용됩니다. 현재 포지션 목록의 site build와 generic registry release-check가 통과했습니다. CI·preview는 게시 후 별도로 검증합니다.

## 2026-10-13 회사 그룹·공지 목록

회사 그룹·공지 목록을 한 설치 그룹으로 구성했습니다. 회사 그룹은 소속 사용자 비활성화 영향 안내와 host가 분류한 누락 그룹의 목록 재확인을 지원합니다. 공지는 현재 페이지에만 정렬하며, 팝업 기간 쌍·등록일 한쪽 조건·ISO 값과 dotted 표시/요청을 구분합니다. 잘못된 수동 날짜 입력은 이전 값으로 조회되지 않습니다.

공지 삭제 결과는 건별 성공·실패를 확인합니다. 실제 브라우저에서10건 중9건 성공·1건 실패 뒤 실패 항목의 선택을 유지했고 재시도로 해당1건을 삭제했습니다. 그룹10건 상태 변경과 영향 안내, 잘못된 날짜 조회 차단, 등록일 한쪽 조건도 확인했습니다.232개 PRISM 테스트와 최종 대상18개, 타입 검사가 통과했습니다. 실제 shadcn 설치에서56개 TSX와CSS가emitted bytes와일치했고37개완전예제/별도entry의TypeScript/Vite/font/고지가통과했습니다. 설치예제의부분삭제9/1·재시도1·그룹10비활성화와320px 내부폭도확인했습니다. 현재56그룹/토큰포함57항목이며표준site build와기존generic registry검사도통과했습니다.

10개 새 상태를1280/320px로 렌더하고 기존 selection/default320px도 확인했습니다. 문서 넘침만으로 놓칠 수 있던 공지 필터의 grid 최소 폭을 수정한 뒤 컴포넌트 폭과scrollWidth는288px, 표 영역은256px가 되었습니다. 표의940/1100px 내용은 내부에서 스크롤합니다. 배포된 공개 날짜 샘플의14px/500/23px 글줄·20.125px 입력 높이를 측정해 로컬을 보정했습니다. 날짜 쌍의4px gap과130/7/130열은 원본 페이지의130px variant를 따릅니다. 전체 관리자 페이지·서비스·static/variable font·pixel/A4 동일성은 확인하지 못했습니다.

## 2026-10-12 포지션 목록과 컴포넌트 수 집계

독립 포지션 관리에 LIVE/TEMP 목록, 변경 상태별 전체 결과 필터링, 동기화 잠금·예약·취소, 사용자 컨텍스트·history별 목록 복원을 추가했습니다. 비동기 선택지 첫 로드는 복원한 입력을 유지하며 행 선택은 복원하지 않습니다. 원본 관리자 화면은 빈 본문이어서 배포 UI의 동일성은 확인하지 못했습니다.

전체 PRISM 214개 테스트, 대상 13개와 workspace 타입 검사가 통과했습니다. 실제 로컬 브라우저에서 포지션 10개 상태를 1280/320px로 렌더했고 root 가로 넘침과 중첩 버튼은 없었습니다. 상세 왕복 후 미적용 입력·적용 결과·2페이지·정렬 복원과 선택 해제, 합성 동기화 예약 잠금·취소 후 편집 복구를 확인했습니다. 콘솔 경고·오류는 없었습니다. 기존 사용자 default320px도 회귀 확인했습니다. 이는 전체222개 상태 중11개 고유 상태의 확인이며 전체 원본 비교를 뜻하지 않습니다.

실제 shadcn 설치에서 55개 TSX와 CSS가 emitted bytes와 일치했고 36개 완전 예제의 TypeScript/Vite/font/고지가 통과했습니다. 설치한 포지션 예제의 검색·상세 복원·예약 잠금·취소 후 복구와320px 내부 표 스크롤도 확인했습니다. 현재55그룹/56registry항목이며 표준 site build와 기존 generic registry 검사도 통과했습니다. 실제 서비스와 모든 원본 상태·pixel/font/A4 비교, production은 검증 범위에 포함되지 않습니다.

원본273개는 벡터87개와 비벡터TSX186개라는 파일 집계입니다. main 진입점의 정적 import/dynamic import와 Vite 샘플 glob을 추적하면 본서비스175·샘플 전용7·미연결4개입니다.175에도 레이아웃·보조 요소·상태·조합이 포함됩니다. 기존 대응표는 비벡터 원본을49개 재사용 그룹에 연결하지만 최종 독립 구현 목표 수나 완료율의 분모로 확정한 것은 아닙니다. 대응0 pending은 구현 완료가 아니라 목적별 연결 기록입니다.

## 프로필 헤더·즐겨찾기·평가 이력 대조 (2026-10-12)

프로필의132px 사진/gap12와 이름·태그·우측출력/즐겨찾기·계열/직무·회사/직책·평가·하단메모를 source에서 대조했습니다. 즐겨찾기는70px 사진·121px 정보·흰 전문 분야/평가 패널을 별도 카드로 제공하고, 상세와 즐겨찾기의 native 버튼을 형제로 분리했습니다. 제어형 busy/readonly와 subject/URL별 사진 오류 수명을 제공합니다. Source loading skeleton과3열/gap10·반응형2/1열·opt-in resize도 추가했습니다.

평가는 원본처럼 공백/null을 제외하고 최근 연도순 배지와 연도 묶음을 표시하며, 기존 개별값 표시 목적은 explicit variant로 유지합니다. 입력 원문을 변경하지 않고 평가/사람 순위를 계산하지 않습니다. 새 헤더 검사9개를 포함한 최종161 tests와 타입 검사가 통과했습니다.53항목/32개 완전 예시의 실제 shadcn 독립 설치·TypeScript/Vite·폰트·고지가 통과했고52개 설치 module/CSS는 emitted bytes와 같습니다. 처음 삭제됐던 SVG 고지 원문은 import 뒤로 옮긴 뒤 실제 설치에서 보존됨을 확인했습니다. 실제 browser/pixel/print header와 A4 pagination은 미검증입니다. 이전source의 native/raster 증거를 새header 검증으로 사용하지 않습니다.

## 패널 조합과 포지션 상세 보완 (2026-10-12)

최신 로컬 dev087811ff의 ProfilePanel/MemoPanel/PositionPanel/ChatPanel과 PositionDetailView를 대조했습니다. 프로필·메모의840px 본문과 여백, 메모 전환/24px 뒤로, 채팅의22px 제목·320px 질문·sticky 입력 영역을 별도 typed 조합으로 제공합니다. beforeLeave는 호스트가 소유하는 초안 확인이며 취소 시 확대·초안을 보존합니다. 후보 변경/외부 닫기/unmount는 이전 확인 결과를 취소합니다.

포지션 상세는 원본의 포지션 정의·Business Context·전문성/성공경험·공통 역량 안내문을 복원했습니다. Mission 중심 예시를 현재 source 목적에 맞게 변경하고 빈 값·원본 구조 skeleton·error/retry·긴 내용을 제공합니다. LIVE 조회와 주직무 선택은 호스트의 책임입니다.

새 JSDOM/SSR 검사 9개를 포함한 전체 152 tests와 타입 검사가 통과했습니다. 51항목·29개 완전 예시의 최종 shadcn 독립 설치, TypeScript/Vite, 폰트 bytes와 고지 검사도 통과했습니다. 확인창의 계속 작성/Escape/나가기 흐름은 JSDOM 검사이며 native focus/dialog의 증거가 아닙니다. 표준 site build와 generic current release 검사가 통과했고 공개 게시와 브라우저 비교는 미완료입니다. 이전150/175 fixture 기록은16906b72 source의 과거 증거입니다. 새 source의 실제 화면 동일성으로 사용하지 않습니다.

## SidePanel 원본 대조와 크기 조절 보완 (2026-10-11)

공개 SidePanel과 최종 독립 설치본의 기본·확대·닫기 상태를 대조했습니다. 기본 너비440px, 헤더64px/여백20px, 버튼·SVG24px, #DDE5EB 경계선, 12px/.06 그림자와 본문 여백0/overflow-y hidden이 맞습니다. 확대는 부모 폭+1px와 z-index1250을 사용하며 닫힌 본문은 mounted/inert를 유지합니다. Expand·Collapse·Close의 path와 computed paint도 같았습니다. h4 제목은18px/700/검정/높이21px이며 static/variable 폰트에서 폭66.375/66.390625px로0.015625px 차이가 있습니다. 서로 다른 caller 컨테이너의 패널 높이는 비교에서 제외했습니다.

ReactNode 제목과 content class/style/ref를 지원합니다. 긴 제목은 헤더 높이에 반영되고 본문 여백·스크롤은 호출자가 지정합니다. 수동 너비 조절에서는 애니메이션을 끄며 방향키456/Home320/End800, double click440, 실제80px 드래그520을 확인했습니다. 실제320px 독립 화면은 긴 제목 헤더125px/본문313px, 초안의 Escape 닫기·재열기 유지와 마지막 동작까지의 실제 wheel scroll이 통과했습니다. 240×240px 부모에서도 패널238×238/헤더146/본문92px이며 초안 입력이 완전히 보였습니다. pointer 취소·capture 유실·외부 닫기 expansion reset·선호 너비 복구는 JSDOM 검사이고 OS/device 검증과 구분합니다.

드래그 compact 회귀를 추가한 전체143 tests,28개 완전 예시,50항목/75 source파일의 최종 독립 설치·타입·Vite·폰트 bytes·고지 검사와175개 고유 상태의 실제320px 렌더/문서 넘침/중첩 버튼/표시 native 입력 이름 검사·수집 로그가 통과했습니다. 관찰 timeout 뒤 같은 탭을 확인하고 결과를 묶음별로 저장해 다시 대조했습니다. 첫175상태 검사의 source fingerprint는15d1c35715767b09ed4f587ef896d80643f21b983f645af35f78ad219e29663a/66 input입니다. 이후700→드래그600→부모300→부모1000에서선호너비가600으로남는회귀를재현해700을복구하도록수정했습니다. 최종16906b727cf14b0d0a957cbf1733d175c2762c230947906908e74e6aa5ece567/66 input은150/175상태까지통과했으며프로토콜정책이localhost HTTP도거절해남은25상태와최종installed browser readback은미검증입니다. ENOSPC 뒤확인한임시consumer의node_modules만재생성해최종재설치·타입·빌드를완료했습니다. 인증 wrapper 상태·전체 font/pixel·native unexpected pointer cancel·production은 미완료이며 전체 목표는 계속 진행합니다.

## 2026-10-11 메모와 빈 상태의 용도 구분

공개 원본의 TabPanelEmptyState를 실제로 측정하고 현재 MemoContent와 배포된 빈 상태 CSS를 대조했습니다. 일반 화면은 140px 그림·18/16px 글자, 탭은 120px·16/14px·10px 제목 간격, 메모 패널은 140px·16/14px·6px 간격입니다. `PrismEmptyState`에 default/tab/panel variant와 optional description을 추가했습니다. 기존 panel=true는 탭 규격을 유지합니다. 콘텐츠 바깥의 24px 여백은 원본 규칙에 맞춰 제거했으며 호출자가 배치 여백을 정합니다.

메모가 없는 ready 상태의 전체 0 표시는 제거했습니다. 첫 메모가 나타나거나 마지막 메모가 사라지면 건수와 입력창 최대 높이를 다시 계산합니다. 실제 440×240에서는 빈 안내가 스크롤 아래에 있었는데, 짧은 bounded 목록에서 장식 그림을 숨겨 안내와 입력창을 함께 볼 수 있게 했습니다. 20개 크기 조합과 로컬 합성 메모의 등록·삭제 전환을 확인했습니다.

원본과 로컬 탭의 본문 175px·SVG 120px·글자 높이와 색·간격이 일치했습니다. 같은 제목 폭은 static/variable font에서 0.015625px 차이가 있었습니다. 10개 SVG shape의 형상과 computed fill/stroke/opacity도 같았습니다. 전체 font/pixel 비교의 완료를 뜻하지 않습니다. 전체 139개 테스트, 27개 완전 예시, 최종 독립 설치의 세 variant·기존 API·설명 생략·320px 동작과 현재 172개 합성 상태가 통과했습니다.

기존 testuser001 홈은 읽었지만 원본 입력 응답이 시간 초과되었고 직접 이동 뒤 새 페이지의 root가 비어 있었습니다. 기존 /chat 주소로 복원했으나 화면 렌더 복구와 메모의 전체 인증 상태는 확인하지 못했습니다. 배포 commit과 모든 원본 상태의 동일성은 계속 검증 대상입니다.

## 2026-10-11 인쇄 문서 격리와 HTML snapshot

`preparePrismPrintSession`과 `PrismPrintButton`은 앱 전체 대신 정적 프로필 문서를 별도 iframe에서 인쇄합니다. 글꼴·이미지·paint 준비를 기다리고 준비 취소·시간 초과·자산 오류·명시적 해제·afterprint에서 작업이 만든 frame만 정리합니다. 부모 제목과 DOM은 유지합니다. 실제 최신 버튼 클릭 후 Escape를 한 번 보내 브라우저의 afterprint 상태와 frame 0을 확인했습니다. OS 대화상자의 용지·여백·페이지 분할, 저장 파일이나 실물 출력은 확인하지 못했습니다.

최신 registry를 다시 설치한 독립 consumer의 긴 두 프로필에서 14분류·경력 96건·SVG 6개와 Pretendard loaded를 확인했습니다. 출력 문서에는 앱 상단·버튼·실행 스크립트가 없었습니다. 자산 대기 중 취소, 자산 실패, 재준비, 준비 후 부모 프로필 수정도 실제 브라우저로 확인했습니다. 부모를 수정해도 준비한 문서는 유지됐으며 실패·취소 뒤 임시 frame은 없었습니다.

폰트 대기를 시작하기 전에 본문·입력값·inline style·canvas 크기와 stylesheet 조건을 캡처하도록 보완했습니다. 같은 지연 폰트 재현에서 88ecf493은 뒤에 수정된 본문과 입력값을 출력했고 수정본은 최초 내용을 보존했습니다. 새 회귀 테스트 3개와 native 세션 테스트 5개를 포함한 전체 138개 테스트가 통과했습니다. 마지막 CSS 보완 후 관련 15개 테스트도 다시 통과했습니다.

320px 독립 HTML에서 접근성용 숨김 텍스트의 absolute 배치가 문서 가로 범위를 619px까지 늘렸습니다. viewer를 containing block으로 지정한 뒤 문서 폭·scrollWidth는 320px, 내부 스크롤 범위는 718px가 됐고 190mm 인쇄 본문과 모든 내용을 유지했습니다. 현재 49그룹·172개 고유 상태의 실제 320px 렌더/넘침/입력 이름/중첩 버튼 검사와 수집 로그도 문제가 없었습니다. 이 결과는 모든 원본 화면·상태·인쇄본의 동일성 완료를 의미하지 않습니다.

## 2026-10-11 전체 프로필 출력과 인증 화면 대조

현재 작업본에서 49그룹의 172개 고유 정의 상태를 실제 320px로 검사했습니다. component/state 표식이 모두 일치했고 문서 가로 넘침, 중첩 버튼, 이름 없는 표시 입력이 없었습니다. 수집된 브라우저 경고·오류 로그는 빈 배열입니다. 이 검사는 모든 사용자 동작이나 원본 화면 동일성을 보증하지 않습니다. 전체 PRISM 테스트 130개와 26개 완전 사용 예시의 타입 검사가 통과했습니다.

7분류 표시 모델을 실제 DOM으로 렌더한 뒤 A4 콘텐츠 영역에 맞춰 PDF로 캡처합니다. 후속 페이지에 머리말과 탭을 반복하고 가능한 경우 글줄·카드 경계를 피합니다. 긴 카드의 필수 분할은 호출자에게 알리며 원문은 숨기지 않습니다. 기본 합성 프로필 두 명의 ZIP은 CRC 검사와 각 9쪽 PDF의 A4 규격·쪽 번호가 통과했습니다. 긴 설명·48개 경력의 문서는 21쪽이며 전체 페이지 축소 이미지와 후속 머리말·긴 Attitude 분할을 확인했습니다. PDF 본문은 래스터 이미지라 텍스트 검색을 지원하지 않습니다.

독립 HTML에 7분류, 경력 3행, 경험 2종, 실패·인터뷰, 실제 0점과 누락값이 유지됩니다. 외부 자산 URL과 실행 스크립트가 없고 실제 브라우저에서 Pretendard Variable의 loaded 상태와 SVG 차트를 확인했습니다. 이는 원본 인증 프로필의 사진·모든 자산 조합을 검증한 결과는 아닙니다. 생성 취소 뒤 임시 문서·캡처 프레임·clone iframe과 부분 파일이 남지 않았습니다. 목록을 unmount한 뒤에도 호스트의 두 후보자 출력 작업이 ZIP 생성까지 이어졌습니다.

50항목을 설치한 독립 consumer에서는 7쪽 PDF·HTML·7쪽 PDF 두 개의 ZIP과 두 프로필의 14분류 미리보기를 확인했습니다. 설치 component는 손으로 수정하지 않았습니다. 이후 발견한 준비 안내/미리보기 모달 충돌은 수정했고 실제 문서 사이트에서 미리보기 하나만 접근 가능한 상태로 남는 것을 확인했습니다. 최종 모달·탭 수정본도 consumer에 재설치했습니다. TypeScript/Vite가 통과했고 두 프로필의14분류를 담은 미리보기 하나만 접근 가능한 것을 실제로 확인했습니다. 설치본의800px 상세 탭도 원본과 같은26px/37px 높이·색·flex 배치를 유지하며 너비 차이는 최대0.03125px입니다.

기존 dev.prism.ai 세션의 testuser001로 후보자 목록과 상세 8개 분류 탭에 접근했습니다. 원본 탭의 800px 너비·26px 높이·37px 행 높이·10px 글자·8px radius·4px gap과 색을 실측해 맞췄습니다. 내용에 따른 flex 너비 차이는 최대 0.03125px입니다. 원본 전문성 탭은 hover 상태였으므로 비활성 기본 상태와 구분했습니다. 원본 배포 commit은 UI에서 확인되지 않았으며 로컬 frontend 087811ff와 동일하다고 추정하지 않습니다.

원본의 전체 도메인 화면·상태, 모든 길이의 인쇄 결과와 font/pixel 대조, native print dialog·OS 저장은 미검증입니다. 전체 목표는 진행 중입니다.

기존 관찰 기준은 dev `7ecfc9af072d9f4aeb0f4d7706f16bd1a73f2ef9` (2026-10-03)이며 최신 source audit는 `087811ff` (2026-10-09)입니다. 현재 원본 inventory 273개에 기능 목적 대응을 기록했습니다. 미대응 항목 0개는 전체 스타일·상태 일치의 완료를 의미하지 않습니다. 49개 typed 그룹과 토큰을 포함한 50개 registry 항목을 제공합니다. 아래 과거 관찰과 최신 추가 검증의 범위를 구분합니다.

## 근거와 범위

- frontend를 fetch·fast-forward했고 local dev와 origin/dev의 동일 revision 및 clean 상태를 확인했습니다.
- 로그인된 Chrome의 testuser001 화면에서 Pretendard, 주요 색상과 새 대화 버튼 40px/8px/14px를 확인했습니다.
- 자체 브라우저에서 원본 공개 `/sample`의 37개 기본 화면을 관찰했습니다. 저장된 기본 AX·computed style·JPEG는 열린 메뉴와 모든 상태의 비교를 대신하지 않습니다.
- 38개 typed source group과 토큰을 포함한 39개 registry 항목을 구성했습니다. 원본 269개 항목의 대응 관계는 기능 목적별 매핑이며 시각 일치율이 아닙니다.
- 원본 벡터 87개의 권리 고지와 revision을 보존했습니다. 174개 SVG 동시 렌더의 ID·내부 참조 검사와 모든 배치·색상 비교는 구분합니다.

## 브라우저 동작

아래 표와 별도 headless 실행은 과거 관찰 기록입니다. 연결 중단 당시의 부분 검사와 이후 복구한 CUA의 최신 172상태 검사를 구분합니다. 최신 결과는 문서 위쪽과 verification.json에 기록했습니다.

파일 입력 보완본은 bundled Playwright 1.62.1과 설치된 별도 headless Chromium 1223으로 검증했습니다. IAB 연결은 없지만 fresh browser context에서 원본 HTTP `/sample`을 직접 열 수 있습니다. 기존 Chrome 프로필과 로그인을 사용하거나 변경하지 않았으며 Mac 잠금도 해제하지 않았습니다.

| 범위 | 확인한 결과 | 남은 범위 |
| --- | --- | --- |
| 최신 fixture | 실제 320px viewport에서 38그룹·119상태 렌더, 누락·중첩 버튼·페이지 가로 넘침·표시 입력 이름 누락·수집된 page error 0건 | 원본 상태별 시각 비교와 모든 상호작용 |
| 폰트 | 문서·embedded preview의 `Pretendard Variable` face가 실제 loaded 상태이며 해당 family를 사용 | 원본 static font와 모든 글자 폭 비교 |
| Avatar | 140px에서 자연 배치·이름/팀/양쪽 축약, 짧은 라벨 보존, 잘린 라벨의 focus/hover 도움말, Escape·확장 후 닫기, 재축약만으로 다시 열리지 않음 | 원본 길이·폭 조합, chip/table의 모든 상태 |
| Toast | 폰트 수정본의 320px 화면에서 body 6px/content 4px gap, 20px 닫기 버튼, 닫기 후 제거 | 원본 tone·긴 내용·배치 조합 |
| Usage | Registry/Workspace 전환 시 표시 코드가 manifest의 해당 코드와 일치 | 실제 clipboard write는 실행하지 않음 |
| 인쇄 페이지 | Chromium Letter PDF: 짧은 예시 1장, 긴 예시 2장, 양쪽 머리말 반복, 가상 경력 36개 중복·누락 없음. 렌더한 PDF 페이지도 확인 | 원본 비교·다른 용지/여백·native print dialog·긴 Essay 분할 |
| 선택 입력 | 기존 IAB에서 방향키·Enter, 다중 선택 Space/칩 제거, 3글자 검색 조건, 포커스 복귀, 날짜 오류 거부, 페이지 변경 | 크기·disabled/readOnly·검색·전체 선택의 모든 조합 |
| 관리자 양식 | 기존 IAB에서 전체 회사의 회사 입력 비활성화, 게시기간 필수, 팝업 OFF 시 날짜 null, 역할별 그룹 해제, 선택 제한과 저장 의도 | 원본 관리자 화면 비교 |
| 공지·방침 | 기존 IAB에서 비모달 다음 공지, 버전 변경·높이 안정화, script 없는 iframe sandbox | 목록·오류·긴 문서 |
| 프로필·PDF·Workspace | 기존 IAB에서 8개 분류, 경험 전환·의견 저장, 실제 PDF 2페이지·200% 내부 스크롤·320/390/1024px fit, 패널 드래그/키보드, Drawer 전환·draft 보존 | 원본 도메인·shell 및 모든 popup/long 조합 |
| 파일 | 원본·재현본의 native browser filechooser로 혼합 선택·부분 첨부·MIME와 다른 확장자 허용을 확인했습니다. 재현본의 같은 파일 재선택·제거·호스트 상태 변경, disabled, DOM DataTransfer 드롭·중첩 drag 강조, 실제 320px과 140/200/400/800px 폭도 확인했습니다. | OS 수준 drag/dialog, 실제 업로드·다운로드 서비스, 모든 형식·제한 조합 |

폰트 파일은 이미 포함되어 있었지만 문서·embedded preview·차트가 face 이름과 다른 `Pretendard`를 지정해 대체 폰트를 사용했습니다. `--font-ui`의 `Pretendard Variable`을 사용하도록 수정했습니다. 파일 다운로드나 `document.fonts.check()`만으로는 해당 폰트의 실제 사용을 확인할 수 없습니다.

인쇄 화면의 최소 280mm 높이가 짧은 Letter PDF에 빈 두 번째 페이지를 만들었습니다. 화면의 190mm 폭·최소 280mm 규격은 유지하고 print media에서 최소 높이를 해제했습니다. 긴 경력 fixture를 추가해 머리말 반복과 전체 행의 출력을 확인했습니다. 인쇄 실행과 용지·여백은 호스트가 소유합니다.

## 빌드와 독립 설치

원격 SankeyChart까지 반영한 `b5ccface` 기준에서 전체 build·TypeScript·PRISM 계약 25개·일반 UI 테스트 260개를 통과했습니다. 일반 registry 144개·catalog 142개·불변 release 73개와 현재 snapshot `sha256-9bf65f08c6e3daa55815c07059472e3b3fbf73651f55169bbbc23398927e88d0` 검증을 통과했습니다. 이후 폰트·인쇄 변경의 전체 build, 문서 TypeScript와 PRISM 예시 계약 검사도 통과했습니다.

38그룹 모두 설치용 import와 typed contract를 제공합니다. 완전한 React 예시는 12개, 소비자 데이터·상태·callback이 필요한 연동 코드 일부는 26개입니다. workspace 예시 타입 검사와 설치 의존성 내 import 검사를 기존 CI에서 실행합니다.

공개 Avatar release `ff1f27a`에서 `node scripts/verify-prism-consumer.mjs --public`으로 39항목·62파일을 독립 설치하고 11예시 타입 검사·Vite·폰트 bytes·자산 고지를 확인했습니다. 최신 폰트/인쇄 CSS를 해당 소비자에 registry bytes 그대로 동기화한 뒤 TypeScript/Vite와 폰트 bytes를 다시 확인했습니다. 이 후속 검사는 새 shadcn 설치가 아닙니다. 소비자는 모든 설치 소스를 컴파일하며 렌더 demo는 Button입니다.

`ff1f27a`의 GitHub Verify UI·Pages와 Vercel 배포는 통과했습니다. 당시 `/prism`, manifest·registry·폰트의 HTTP bytes도 확인했습니다. 폰트·인쇄 수정의 공개 commit `dd49ecbe`는 Verify UI run37098604514·Pages·Vercel이 모두 통과했습니다. 현재 manifest·registry의 HTTP bytes가 로컬과 일치하며 공개 117상태의 320px 검사, 실제 폰트 사용, Avatar focus/hover/resize와 Usage 경로 전환도 확인했습니다. 공개 짧은/긴 PDF는 각각 1/2장이며 이미 검토한 로컬 PDF와 렌더 pixels가 모두 일치했습니다.

이전 agent-browser 실행에서는 원본 HTTP가 HTTPS 전환 뒤 반복 리다이렉트됐습니다. 같은 설치 Chromium을 bundled Playwright로 직접 실행하니 원본 HTTP `/sample`이 정상 렌더됐습니다. 이 방법으로 파일 입력의 기본·disabled·부분 첨부·uploading·ready·삭제 상태를 새로 관찰했습니다. 기존 화면 기록과 실패 이력은 보존하며 브라우저 외 네트워크·DNS·로그인 설정은 변경하지 않았습니다. 새 context는 인증 정보가 없는 별도 세션입니다.


파일 영역 높이 140.375px, 아이콘 40px, 안내 13px/1.4와 hint 10px/1.4, 카드 240×46px, 행 28px, 파일추가 버튼 81.484375×28px를 원본과 재현본에서 비교했습니다. 비교한 부분의 크기는 일치했으며 실제 screenshot도 검토했습니다. 0px border의 none/solid 같은 비표시 computed style과 글자를 직접 표시하지 않는 부모의 상속 값은 별도 raw 기록에 남겼습니다. 전체 화면 pixel 일치로 해석하지 않습니다.

새 파일 입력 구현은 pydemia Button과 원본 벡터를 조합하고 소비자 소유 `files`의 ready/uploading/error를 표시합니다. 원본 sample의 가짜 업로드 timer는 라이브러리에 넣지 않았습니다. 문서 예시에서 상태를 직접 바꾸며 업로드는 연동 앱이 담당합니다. 파일명이 길면 생략하고 카드 목록 안에서 스크롤하며 180px 미만의 첨부 header는 세로로 배치합니다.

로컬 registry의 39항목·62파일을 새 독립 소비자에 설치하고 12개 완전한 예시·TypeScript·Vite·폰트 bytes·자산 고지를 확인했습니다. 최종 LinkIcon 20px/CSS 보정은 이 소비자에 최신 registry source bytes를 동기화한 뒤 다시 컴파일했습니다. 후속 동기화를 새 shadcn 설치로 표현하지 않습니다.

파일 보완의 `ead2f0f4`는 Verify UI run37101626014·Pages run37101625983·Vercel이 모두 성공했습니다. 공개 manifest·registry·utility·tokens는 HTTP200과 로컬 bytes 일치를 확인했습니다. 공개 119상태의 실제 320px 검사도 0문제였고 공개 화면에서 native browser chooser의 부분 첨부·재선택·삭제·host 완료, DOM DataTransfer·nested drag, 폭 변경을 확인했습니다. 원본과 비교한 파일 입력 크기 차이는 없었으며 공개 screenshot도 검토했습니다. 이전 `7cb056df` 기록 커밋의 rate limit 실패 이력은 별도로 보존합니다.

[기계 판독 검증 기록](verification.json)은 확인한 범위와 남은 항목을 제공합니다. 원본 AX·JPEG와 가상 예시의 DOM·PDF는 gitignore된 `.worknotes/browser-evidence/`에 보관하며 공개 사이트에 포함하지 않습니다.

## Tooltip와 SUMMARY 도움말

별도 headless 브라우저로 현재 배포 원본의 9가지 Tooltip 배치와 SUMMARY 도움말을 측정했습니다. 같은 좌표의 독립 소비자에서 기본 본문 90×32.796875px와 SUMMARY 패널 251.90625×45.59375px가 일치했습니다. 본문 위치 차이는 최대 0.203125px, 화살표 위치 차이는 최대 0.5px였으며 서로 다른 배치 엔진의 좌표 반올림 차이를 기록했습니다. 화면 전체의 pixel parity를 뜻하지 않습니다.

화살표를 원본의 12×8.52px 잘린 회전 사각형과 16px start/end inset으로 보완했습니다. 흰 패널의 화살표에도 #dee7fb border와 radius2를 적용했습니다. 짧은 SUMMARY의 기존 padding 합계는 이미 맞았습니다. 현재 패널은 내용 컨테이너가 12px padding과 507px 최대 폭을 소유합니다.

SUMMARY의 터치 열기/닫기, 바깥 터치, focus/Escape, Space 토글을 실제 브라우저에서 확인했습니다. Avatar의 말줄임 전체 텍스트와 Escape도 유지됩니다. 788자 가상 도움말을 1280×900·320×900·320×240에서 검사해 화면 안의 배치·줄바꿈·내부 스크롤을 확인했습니다. 브라우저 mouse wheel로 스크롤한 뒤에도 도움말이 열려 있었습니다. 원본의 모든 도메인 caller와 timing·브라우저·zoom 조합은 미검증입니다. 컴포넌트 테스트 32개와 12개 완전한 예시 타입 검사가 통과했습니다.

## 남은 작업

- 원본 기본·hover·focus·disabled·selected·error·empty·long 상태와 인증 도메인 화면을 비교합니다.
- 모든 도메인의 긴 내용·popup·파일 상호작용과 인쇄 용지/여백·긴 Essay 조합을 확인합니다.
- 공개 119상태의 렌더와 상호작용 검사를 원본 스타일·모든 상태의 일치로 해석하지 않습니다.

## InputLabel 도움말과 최신 소스 차이

InputLabel의 raw MUI 도움말은 일반 HRXTooltip와 규격이 다릅니다. 원본의 라벨 14px/600/20px, 필수 표시 8px, Info16px과 도움말 11px/500·4px8px padding·회색 배경·radius4·화살표 없음·14px 간격을 재현했습니다. 기존 라벨 간격4px을0으로 맞췄습니다. 같은 좌표에서 짧은 라벨·도움말의 크기와 위치가 일치했으며 키보드·터치·320px 줄바꿈·320×240 내부 스크롤을 확인했습니다. 도움말 버튼은 native label과 형제로 배치해 htmlFor 연결을 유지합니다. 2026-10-09에 원본과 독립 소비자를 다시 확인했고 같은 좌표의 크기·위치 차이는0px였습니다. 이 비교가 전체 화면 pixel 일치를 의미하지는 않습니다.

Tooltip 기본 hover 지연100ms는 실제 배포 MUI bundle에서 확인했습니다. `delayDuration`으로 바꿀 수 있고 `PrismInfoTooltip`의 `open/onOpenChange`는 호스트가 제어할 수 있습니다. SUMMARY도 같은 정보 버튼을 조합합니다. 최신 병합본의 계약 테스트36개와 예시12개 타입 검사, 일반 UI280테스트,146registry/144catalog/83immutable release 검증이 통과했습니다. 병합 후 새 독립 소비자39항목·62파일의 설치·컴파일이 통과했고 이후 포커스 자동 스크롤 수정만 emitted source로 동기화해 다시 컴파일했습니다. 수정 후 라벨·SUMMARY·Avatar의 실제 브라우저 검사도 통과했습니다.

최초 `087811ff` 감사에서는 LeadershipPie, LeadershipPieSummary, CandidateProfilesPdfDownload, PdfDownloadHost 네 항목이 구현 대기였습니다. 이후 독립 pie·PDF/ZIP/HTML 목적 구현과 선택한 검증을 추가해 아래 기록에 반영했습니다. Memo, PDF, 프로필 영역과 인쇄 규칙의 전체 상태 비교는 남아 있습니다. 사용자·회사 그룹 양식과 dialog/text-field 선택 규칙은 최신 추가 검증의 범위를 확인해 주세요. InputLabel과 Tooltip의 소스·SCSS는 두 revision에서 동일했습니다. 이 checkout revision이 현재 배포 revision과 같다는 근거는 확보하지 않았습니다.

포커스로 화면 밖의 정보 버튼을 스크롤하면 Radix의 ancestor-scroll 닫기가 열림과 겹쳤습니다. 다음 animation frame에 포커스 도움말을 열고 Escape·blur·unmount는 대기 중 열림을 취소하도록 보완했습니다. 문서의 실제320×240 long 도움말은300×90.1875px이며 native wheel scrollTop230을 확인했습니다. 최신120상태의320px 렌더·가로 넘침·중첩 버튼·입력 이름·page error 검사도0문제입니다. 이 기록은 현재 소스의 공개 반영 전에 작성했으며 원격 결과는 세션 worknote에서 갱신합니다.


## 리더십 비중과 SUMMARY

새 원형 차트는 Chart.js plugin을 복사하지 않고 SVG로 구현했습니다. 호출자가 계산한1–3개의 비중을 표시하며 색상은 지·덕·용 순서의#706ee7/#55c4ae/#ff928a입니다. 원본 인쇄 샘플과 같은160×158px 기본 영역과11px/700 흰 내부 라벨, SUMMARY의padding16·gap20·radius12·border#b6bec9·white·printcaption10pt를 확인했습니다. 코멘트 본문은 호출자 제공 값이며 인사 평가를 계산하지 않습니다.

누락값과0은 별도 데이터 표에 그대로 표시합니다. 남은 미확정 영역은 회색으로 표시하며 완전한 양수 비중은 합계100의 반올림 오차0.2를 허용합니다. 크기40–640·라벨8–24px, 컨테이너 맞춤과 긴 라벨 범례를 지원합니다. 기존소비자의SUMMARYrecipe도 유지하고 새pieSummary는 별도형으로 선택합니다. 실제1280/320/390px 화면과140/320/800px 수동 폭의42조합이 통과했습니다. 이는 모든 원본 라벨 배치·애니메이션·도메인 화면의 pixel 일치를 증명하지 않습니다.

새14개 완전한 사용 예시와40개 계약 테스트,39항목·62파일의 새 독립 설치·TypeScript/Vite·폰트bytes·자산 고지 확인을 통과했습니다. 새 fixture는121상태이며 최종본의 브라우저·공개 반영 검증은 이어서 진행합니다. 신규 두 그룹의 원본 링크는 해당파일이 존재하는087811ff를 참조하고 기존 벡터·기준소스의7ecfc9a 근거는 유지합니다.


## 프로필 PDF와 ZIP 다운로드

최신 두 다운로드 컴포넌트의 목적을 독립 `prism-export` 모듈로 구현했습니다. 한 명은 PDF, 여러 명은 ZIP 하나로 다운로드하며 중복 파일명은 `(2)`, `(3)`으로 구분합니다. 호출자가 제공한 PDF 렌더러를 순서대로 실행하고 진행률·오류·AbortSignal을 전달합니다. route 위에 둔 다운로드 host는 메뉴 이동에도 작업을 유지합니다. 완료·실패 작업은 호출자가 제거하며 완료는 브라우저 다운로드 시작 또는 stream writer close를 뜻합니다. OS 파일 저장 완료를 추정하지 않습니다.

Blob fallback과 호출자 소유 streaming writer를 지원합니다. writer의 비동기 backpressure와 abort를 처리하며 기본 서비스워커를 등록하지 않습니다. `createPrismImagePdf`는 이미 페이지를 분할한 JPEG를 실제 PDF로 변환합니다. 프로필 데이터 조회·인증·DOM 캡처·페이지 분할은 호출자가 소유합니다. 이미지 PDF의 텍스트 검색과 접근 가능한 텍스트 레이어는 제공하지 않습니다.

가상 프로필의 실제 다운로드8조합(1280/320px, 한 명/두 명/세 명, 긴3페이지)을 확인했습니다. ZIP 무결성·내부 PDF·중복 이름을 검사하고 PDF를 이미지로 렌더해 글자와 머리말을 검토했습니다. 오류와 취소에는 파일이 다운로드되지 않았으며 진행 중 beforeunload 경고와 종료 후 listener 해제를 확인했습니다. 새 독립 설치40항목·63파일·15예시의 TypeScript/Vite가 통과했습니다. 설치한 소스를 수정하지 않은 별도 소비자 fixture에서 StrictMode·메뉴 이동·동시 두 작업·취소도 실제 브라우저로 확인했습니다.

현재 source inventory273항목의 pending 목적 매핑은0입니다. 이 수치는 전체 원본 상태·스타일·인쇄본 일치의 완료 기준이 아닙니다. 최신49계약 테스트와125상태의320px 렌더 검사가 통과했으며 원본 인증 다운로드·실제 서비스워커·전체 인쇄 섹션·HTML 내보내기 비교는 남아 있습니다.


## 단일 HTML 프로필 파일

원본 공개 인쇄 샘플에서9페이지 `profile-template.html`을 실제로 받았습니다. 네트워크를 차단해 다시 열었을 때 Pretendard4굵기와canvas를 변환한 차트 이미지3개가 표시됐고 툴바는 없었습니다. 프로필 이미지1개는 로드되지 않았습니다. 이 원본 샘플의 결과를 모든 실제 프로필이나 인증된 사진 경로로 일반화하지 않습니다.

`createPrismHtmlDocument`와`PrismHtmlExportButton`은 재현한 정적 문서를 같은 목적의 단일 파일로 저장합니다. CSS·글꼴·사진·CSS URL을 포함하고 canvas를 PNG로 바꾸며 내부SVG참조와현재입력값을 유지합니다. 부모의 글꼴·design token을 보존하고 표시 위치를 정상 문서 흐름으로 바꿉니다. `data-prism-export-exclude`는 화면 툴바를 제외합니다. 자산이나 CSS를 읽지 못하면 실패를 알리며 호출자가`loadAsset`·완전한`cssText`를 공급할 수 있습니다. 생성 중 취소와unmount abort를 지원합니다. 파일은 React 없이 열리고 좁은 화면에서는 내부 가로 스크롤을 사용합니다. 인쇄 media는 이 overflow를 해제합니다.

1280/320px의일반·긴프로필4조합을실제로다운로드해offline으로열었습니다. 본문·SVG·3/48경력행·Pretendard와page/pie/SUMMARY의측정규격이원래렌더와일치했고외부요청은0입니다. 320pxroot도320px이며native가로wheel을확인했습니다. 별도canvas/사진의red-blue-green색상순서·SVG use40px·자산cache1회·느린자산중본문변경을실제브라우저로검증했습니다. 실패/취소시다운로드는없습니다. 새로운독립설치41항목/64파일/16예시와56계약테스트가통과했습니다.

전체원본의9페이지필드·모든상태·인쇄여백일치와인증된사진경로는후속비교대상입니다. 이HTML검증은재현한문서의저장후보존을입증하며전체PRISM화면일치를대체하지않습니다.


## 2026-10-09 현재 관리자 양식

최신 `UserForm`의 성·이름·회사·본부/팀 필수 입력과 상세 기본 정보 읽기 전용, 변경 후 수정, 회사 검색, 회사 그룹 활성/비활성 배지를 독립 typed recipe에 반영했습니다. `CompanyGroupForm`은 등록 blur 검사, 상세 이름 변경 600ms debounce, 기존 이름 유지 시 회사만 수정, stale/abort 결과 차단과 검사 실패 재시도를 지원합니다. 두 양식은 Promise 저장 중 입력·취소·상태 변경을 잠그고 중복 제출과 저장 실패를 처리합니다. 업무 이메일 도메인·등록 여부·권한은 소비자가 결정합니다. 기본 이메일 검사는 형식 검사입니다.

자체 Chrome 탭에서 합성 데이터로 필수 입력과 저장 의도, 상세 읽기 전용·변경 전후 저장, 선택값·목록의 상태 배지, 회사만 변경, 등록 blur 대기, 중복/검사 오류·재시도를 확인했습니다. 원본 SCSS의 입력 gap 2px, 제목 18px/600/1.4, 상태 색상과 12px 오류 도움말을 적용했습니다. 140px에서 발견한 grid의 최소 내용 폭과 버튼 행 넘침을 제한하고 140/200/320/800/1280px 긴 내용 배치를 다시 확인했습니다. 긴 회사 태그의 고정 높이로 본문이 겹치는 문제도 수정했습니다. 기본 viewport 화면·실제 320px iframe 화면 증거와 폭별 DOM geometry를 따로 기록했습니다.

전체 62개 계약 테스트, 17개 완전 사용 예시와 최신 전체 build/타입 검사를 통과했습니다. 40그룹·130상태의 실제 320px 렌더에서 누락·페이지 가로 넘침·중첩 버튼·표시 입력 이름 누락·브라우저 오류가 없었습니다. 새 소비자에 41항목/64파일을 설치한 뒤 최종 태그 CSS만 emitted bytes로 동기화했고 TypeScript/Vite를 다시 통과했습니다. 설치한 두 완전 양식 예시를 StrictMode에서 입력하고 사용자/그룹의 등록 의도와 320px 가로 넘침 없음을 확인했습니다. 일반 registry는146항목/144catalog/83immutable이며 기존 snapshot SHA를 유지합니다.

기존 원본 탭에는 계정과 후보 화면이 남아 있으나 새 탭은 admin-login으로 이동했고 저장된 비밀번호 자동 완성도 확인되지 않았습니다. 새 인증 세션의 관리자 화면 대조는 미확인입니다. 실제 인사 데이터·credential은 예시나 검증 문서에 포함하지 않습니다. 최신 checkout과 배포 revision의 결합도 아직 확인하지 않았습니다.


## 2026-10-09 현재 프로필 메모

배포된 공개 index-DDygUNQ9.js/index-Ct5vvkRn.css에서 새 memoCardBottom과 수정됨 표시를 확인했으며 이전 memoCardHeader는 없었습니다. Source087811ff의 카드·본문·날짜·하단·액션 규칙도 이 CSS와 일치합니다. 인증 화면의 모든 상태 및 배포 commit SHA의 완전한 결합과는 구분합니다.

새 prism-memo는 본문 우선·날짜/수정됨·단일 편집 잠금·삭제 확인을 독립 typed 계약으로 구현합니다. 서비스는 본인에게 허용된 메모만 조회해야 하며 isMine은 인증 수단이 아닙니다. Collection은 true가 아닌 기록을 표시하지 않습니다. Promise 저장/삭제/등록의 진행·오류·재시도와 중복 의도 방지를 제공하고 엔터 제출·Shift+Enter 줄바꿈·IME 보호, 원문 보존·소비자 draft 소유권을 유지합니다. 전환/unmount는 signal을 취소하고 오래된 UI 완료를 무시합니다. 기존 작성자 header API는 이전 형식의 호환으로 유지하되 현재 예시와 source mapping은 새 recipe를 사용합니다.

실제 합성 브라우저에서 편집 잠금·저장 실패 내용 보존/재시도·삭제 확인/진행·등록을 확인했습니다. source 규칙의 padding16/gap12/radius12, 본문14/400/1.4, 날짜12/500/17, 액션20px를 측정했습니다. 원본 confirm store의 삭제 label·warning red와 contentMinHeight123을 반영했습니다. 수동 폭140/200/320/440/800px에서 내부 목록 스크롤과 입력창 배치를 확인했습니다. 높이240에서 native textarea resize가 입력창을 넘치게 하는 결함을 실제로 재현해 부모 크기에 맞춰 최대 높이를 제한했고, 부모 높이700에서 max200 복귀를 확인했습니다. 320px의 PageDown 내부 스크롤은0→204였지만 CUA wheel 호출은 변화가 없었으므로 휠 통합 검증 성공으로 표시하지 않습니다.

7개 새 상호작용 테스트를 포함한 전체69개 테스트와18개 완전 예시 검사를 통과했습니다. 새 소비자42항목/65파일 설치·TypeScript/Vite·폰트 bytes·고지도 확인했습니다. 원본 인증 상태·전체 pixel/폰트 비교와 실제 서비스/API 권한 검증은 남아 있습니다.

이번 CUA 화면 캡처는 반응형 화면·기본 화면·대체 캡처·최소 버튼 화면에서 모두 응답하지 않았습니다. DOM 조회와 실제 조작은 가능했고 오류 수집은0건이지만 새 화면 이미지로 시각 일치를 증명하지 않습니다. 원본 인증 상태와 전체 시각 대조는 계속 미완료입니다.

## 2026-10-10 Context 입력·선택 계약

현재 소스087811ff의 ContextInfoLayer/Section에서 필수·선택 배지, textarea 11행, trim().length 50자 기준과 원문800자 counter를 반영했습니다. 내부 공백은 문자 수에 포함합니다. 선택 입력의 최소 길이 경고와 정확히800자의 최대 길이 경고는 원본처럼 표시하면서, 그 경고만으로 유효한 등록을 막지 않습니다. 구조화된 onAction은 선언한 키, 원문, 선택지의 value/label/description과 클릭한 액션 라벨을 반환합니다. 서비스 조회와 재개는 소비자 소유입니다.

실제 CUA 브라우저에서49·50·800자, 짧은 선택 입력의 제출, 원문 보존, 최대2개 선택과 해제, 접은 뒤 값 유지, 취소·읽기 전용·진행·오류·긴 입력·빈 상태를 확인했습니다.140·200·320px에서는 한 열,800·1000px에서는 두 열로 배치하며 폼·섹션·옵션 가로 넘침이 없습니다. native textarea drag로233.375→333px 세로 크기 조절도 확인했습니다. 폼 안 Radix의 숨은 input이 체크 SVG·focus selector를 끊던 CSS 문제를 수정했습니다.

기본300ms 섹션 애니메이션은 유지합니다. 현재 잠금 환경에서는 열린 콘텐츠의 높이가 시작 프레임에 머물러 클릭이 헤더에 전달되는 현상이 관찰됐습니다. 키보드 선택은 정상 동작했고, 호스트의 명시적인 reduceMotion=true로 애니메이션을 줄인 경우 카드 클릭도 정상 동작했습니다. 시스템 reduced-motion 설정도 유지합니다. 캡처는 이번 단계에서도5초 timeout으로 실패해 새 이미지 파일이 없으며, 인증 원본 화면의 전체 상태·픽셀 일치는 완료하지 않았습니다.6개 새 테스트를 포함한75개 PRISM 테스트가 통과했습니다.

최종 검증:41그룹·140상태의 실제320px CUA 렌더에서 누락·페이지 넘침·중첩 버튼·표시 입력 이름 누락·브라우저 오류가 없습니다. 새 소비자에42항목/66파일을 설치하고18개 완전 예시·TypeScript/Vite·폰트 bytes·고지를 검증했습니다. 설치 소스는 수정하지 않았고 진입 파일만 ContextExample reduceMotion+StrictMode로 구성했습니다. 실제 입력·설명 클릭·Space 선택·구조화된 제출과 체크 SVG 표시·넘침/오류0을 확인했습니다. 최초 전체 설치의ENOSPC와 부분 검증 진입 파일의import 오류는 별도 실패 이력으로 보존합니다. 이 결과를 인증 원본의 전체 스타일·상태 일치로 확대하지 않습니다.

## 현재 후보 목록과 출력 준비

PrismCandidateList는 현재 source087811ff의 필터·선택·표·페이지·출력 옵션과 준비 상태를 연결합니다. 기본100명 한도를 넘는 선택 변경은 전부 거부하고, 페이지 이동은 선택을 유지합니다. 조회·초기화와 후보 표의 부분/전체 해제는 모든 선택을 비웁니다. 일반 Directory의 다른 페이지 보존 계약은 유지합니다. 기본 출력 옵션은summary/compensation이며 매번 비워서 엽니다. 요청의 ID·종류·선택·옵션을 고정하고, Promise 준비 결과의prepared/excluded count와 실패·원래 요청 재시도를 지원합니다. 조회/권한/프로필 변환·상위 PDF host·네이티브 인쇄는 소비자 소유이며 목록을 닫는 동작으로 그 준비를 취소하지 않습니다.

현재 공개 배포 CSS와 source의 목록/필터/안내 규칙을 대조했고, local CUA에서 선택·정렬·페이지·출력 준비/실패/재시도/제외와100명 한도를 확인했습니다. 140–1280px 수동 폭은 가로 넘침이 없고 표는 내부에640px 최소 폭을 유지합니다. 실제320px iframe·240px 높이에서도 키보드로 전체 목록과 마지막 페이지 버튼에 접근했습니다. 브라우저 viewport override가 적용되지 않아 기존 반응형 미리보기의 실제 iframe을 사용했습니다. 기존 카드 클래스와의 충돌로 셀이 flex가 되던 문제와 미정의neutral400 토큰을 수정했으며 최종 표 셀/16px 회색 정렬 아이콘을 확인했습니다.

단일 요약 PDF와 두 프로필 ZIP의 실제 생성 바이트를 보이는 data-URL 링크에서 보존했습니다. ZIP CRC와 각각1페이지 A4인 PDF를 파싱하고 첫 페이지를 raster로 확인했습니다. 브라우저 download event는25초 timeout, Blob downloadMedia는 미지원이었고 기본 Downloads 폴더에 새 파일을 확인하지 못했습니다. 생성과 OS 저장을 구분하며 네이티브 인쇄·원본 전체 프로필/픽셀 일치는 아직 검증하지 않았습니다. 10개 새 테스트를 포함한85개 PRISM 테스트가 통과했습니다.

42그룹·146개 현재 소스 상태를 실제320px iframe에서 확인했습니다. 원하는 component/state의 DOM marker를 기다려 확인한 뒤 측정했으며 렌더 누락·가로 넘침·중첩 버튼·표시 입력 이름 누락·브라우저 오류가 없습니다. 새 소비자의43항목/67파일과19개 예시,TypeScript/Vite·폰트 bytes·고지를 확인했습니다. 설치 컴포넌트 소스는 변경하지 않았고 portable 예시만 최종 usage로 동기화해 다시 컴파일했습니다. 프로덕션 빌드의 StrictMode·실제320px에서 두 옵션을 선택해 한 ZIP과 두 A4 PDF를 생성했으며 optional field가 raster에 포함됐습니다. 현재 UI capture는5초 timeout으로 실패해 새 화면 캡처가 없고 PDF raster를 UI screenshot으로 취급하지 않습니다.


## 현재 CEO·ELP 코멘트와 SUMMARY 도움말

현재 source `087811ff`의 CEO 코멘트 4필드 양식과 CEO/ELP 별도 목록을 독립 계약으로 구현했습니다. 연도 숫자4자리 입력 정리, 원본 validator의 digits/integer 판정, 회의체·발화자trim1~100·논평trim1~2000, native maxlength와5행을 유지합니다. nullable metadata와실제0을 구분하고 편집 양식은 기존 카드 위에 표시합니다. 작성자 액션 표시와 서버 권한 검사를 구분합니다.

단일 편집과 Promise 작업 중복 방지, 후보 전환·unmount의AbortSignal과 늦은UI 완료 무시, 실패 초안 유지, 저장 성공 후 목록 갱신 실패 분리 및 목록만 재시도를 지원합니다. standalone submitting은 원본처럼 제출 버튼만 막으며 collection은 기본 입력 잠금입니다. 잠금을 해제하면 원본의 저장 중 입력 가능 상태를 선택할 수 있습니다. API·권한·저장·캐시는 호스트가 처리합니다. 신호 취소는 이미 완료된 서버 변경의 rollback을 뜻하지 않습니다. 기존 일반본문 editor 계약도 유지합니다.

공개 배포 CSS의 코멘트1hr3u/1kle5 규칙과 source 간격·글꼴·20px 아이콘을 대조했습니다. 실제 CUA에서4필드 입력·Enter·maxlength·잠금·실패/재시도·후보 전환·삭제 완료를 확인했습니다. 140~1280px에서 코멘트 영역의 가로 넘침이 없고, 내용·폭 변경에 따른 자동 높이와 실제 드래그113→193px를 확인했습니다. maxEditorHeight180px는 최종 빌드에서 자동·수동 크기 모두 제한했습니다. SUMMARY 도움말 class/style은 trigger가 아닌 본문에 적용합니다.

현재43그룹·152상태를 실제320px iframe에서DOM 표식 확인 후 측정했으며 렌더 누락·페이지 넘침·중첩 버튼·표시 입력 이름 누락·수집된 브라우저 오류가 없습니다. 새 독립 소비자에44항목/20개 완전 예시를 설치하고 최종 registry로 재설치해TypeScript/Vite·폰트 bytes·고지를 확인했습니다. component 소스는 수정하지 않았으며 검증 앱만StrictMode/320px iframe으로 구성했습니다. production 예시의 등록3/수정/삭제2,자동 높이638px/제한180px와 넘침·중첩·오류0을 확인했습니다.

재사용 설치 script의EEXIST와 소비자 진입 빌드의 잘못된cwd는 수정 후 각각 재설치·빌드했습니다. 초기 수동 제한 측정은 이전dist를 읽어 실패했으므로 새빌드·reload 이후180px 결과와 구분합니다. screenshot capture는5000ms timeout으로 실패해 새 UI 이미지는 없습니다. 인증 원본 상태·전체 시각/폰트 비교와 실제backend 권한·저장 검증은 남아 있습니다. 기능 목적273/pending0과 계약·fixture 성공을 전체 완료로 해석하지 않습니다.


## 현재 Attitude·PDF 보고서와 6 Frame Survey

진단 제목의 보고서 action과 독립 PDF 모달, 성격·가치관·Risk·Survey 조합을 추가했습니다. API·권한·평가는 호스트가 처리합니다. 진단 제목/설명은 trim 후 판정하며 제목만 있을 때 NoData를 덧붙이지 않습니다. 양수 비중만 표시하되 원래 색 인덱스를 유지하고, 차트180px·4개 grid와 source 색/point border0 및 접근성 데이터를 지원합니다. 전체 Chart.js geometry/motion/print 대조는 남아 있습니다.

PDF는 전체 bytes와%PDF 헤더 검사 후 PDF.js의 native viewer를 사용합니다. 연속 페이지·텍스트 선택·링크·실제 페이지/너비 맞춤을 지원하며, source처럼 페이지·배율은blur/Enter로 적용합니다. workerUrl과 전용pdf.css는 설치한pdfjs-dist와 같은 버전이어야 합니다. 호스트 loader와fallback,신호취소/늦은 결과 무시,고정된download context와실패/재시도를 지원합니다. 환경은 완전 예시의workerUrl prop으로 명시하며 설치본의전용CSS 파일까지 dependency closure를 검사합니다. 기존출력 options/preview는 보존했습니다.

실제 CUA에서3페이지와텍스트 레이어,페이지 이동/스크롤,67%→70/60%,30~100% 경계와너비맞춤146%,Synthetic 단어선택을 확인했습니다. HTML200 응답은PDF형식 오류로 거부했고 같은URL retry가 성공했습니다. callback4351bytes는원본합성PDF와동일하며 Poppler가3페이지A4를확인했습니다. OS 저장 완료로 해석하지 않습니다. 진단/Survey140~1280px의 넘침0과 PDF모달의7개 폭/높이 조합을 확인했습니다.140×240에서0px viewport 문제를 좁은 toolbar/제목으로 수정해36px와ready를 확인했습니다. 실제320px iframe에서도296px 모달/3페이지/넘침0입니다.

Survey는source36/24px 막대·0.0과null·정수 그룹 평균선·role색·2/3열을 구현했습니다. CUA의194px 카드와61/63/75/82px 평균선,가변320px track/195px 평균,print class118pt 카드/70px track/10pt legend를 확인했습니다. native print와는 별도입니다. 긴 접근성 표가870px 페이지 넘침을 만들던 문제는 숨김 wrapper로 수정했습니다. 최종45그룹/159개 고유 상태의 실제320px 기본 검사와107개 테스트,22개 완전예시 타입 검사를 통과했습니다. source273/pending0과 합성검사를 전체 parity로 확대하지 않습니다.

원본 인증 상태·전체pixel/font·실제 query/권한/저장·OS 저장/native print가 남아 있습니다. 현재UI screenshot은5000ms timeout으로 실패했습니다. Export manifest는일반 helper를function,React 이름의선언을component로 구분합니다.


## 채팅 프로필 분석·포지션 추천: 2026-10-11

PrismAnalysis는 명시적 factor kind에 따라 전문성 tag, 대표 성공경험 star, Design/Learning 첫 결과, Attitude Derailment, Leadership 제목/근거를 구분합니다. 리더 유형은 60px 원형/10px 정보 버튼/설명+단계 tooltip이며 본문은 aiComment ?? description입니다. 빈 AI comment를 임의 설명으로 바꾸지 않고 trim empty 근거는 관련 데이터 없음으로 표시합니다. PrismFormattedText는 기존 sanitizer/custom tag/호스트 action을 독립적으로 제공하며 기존 PrismRichText와 PrismProfileAnalysis 진입점도 유지합니다.

PrismPositionRecommendations는 일반·panel의 같은 레이아웃과36/53px 헤더·12px 제목/본문, 선택2px border/15px padding,400px 경계의 단계별 더 보기/접기를 사용합니다. 마지막 묶음은 버튼 표시와 실제 추가 개수를 맞추고240px 이하 한 열로 재배치합니다. selectedId/onSelect와회사 logo 자산은호스트 소유입니다. 기본 회사명을 임의 로고로 치환하지 않습니다. 데이터 ID 순서/datasetKey/breakpoint 전환은 접으며native 수동 양축resize와 내부scroll을 지원합니다.

115개 tests(새8개),48그룹/25완전예시와표준build/docs TypeScript/generic snapshot 검사가 통과했습니다.49항목/74파일을 자체 독립 소비자에전체 재설치했고25예시 TypeScript/Vite·폰트 bytes·자산 고지를 확인했습니다. 설치component source는직접 수정하지 않았습니다. 새 소비자의 실제 browser UI는 연결 중단으로 아직 검증하지 못했습니다.

선택 CUA 측정은 추천140–1280px의1/2/3열·넘침0,0/1/2/3/4/6/7/9개 초기 표시,4→6→9/접기·키보드 선택·데이터 전환을 포함합니다. 양축 드래그800×349.59→600×410과overflow0을 확인했습니다. 분석140–1280에서60px badge/10px info/12px700 comment/80px label(320px 이상),역할별색과tooltip350px/12pxpadding/14px500/pre-line을측정했습니다. 전체 원본pixel/font 일치의근거로 확대하지 않습니다.

현재169개 상태의실제320px 검사는22개aggregate tool 관찰 후 브라우저 연결이끊겼습니다. 개별 배열 저장 전 REPL reset이 있었으므로169개완료나22개 개별 raw 파일 확보를주장하지 않습니다. 이전159개 성공은 b4a502d8의별도 historical evidence입니다. Screenshot도5000ms timeout으로 새이미지가 없습니다. 전체 상태·긴 문장·회사 logo·원본 인증·OS 저장/인쇄 검증은 남아 있습니다.


## 7분류 프로필 인쇄 문서: 2026-10-11

PrismProfilePrintDocument는 종합·전문성·성공경험·Design 역량·Learning Agility·Attitude·Leadership을 원본 순서로 묶습니다. SUMMARY/보상 옵션은 종합의 해당 부분만 제어합니다. 경력 continuation의 마지막에 보상을 두고, 나머지 분류는 table thead 머리말과 정적7개 탭을 사용합니다. model은호스트가조회/변환한표시값이며API/auth/자동인쇄를수행하지않습니다.

careerPages를제공하면누락/중복/순서를검사합니다. 생략하면source값을참고한글꼴/공간추정으로나누며실제browser/font pagination의검증을대신하지않습니다. 설명은기본full로보존하고긴본문을숨기지않습니다. reference-limits를선택하면표시필드만복사·코드포인트단위축약하고안내를표시합니다. 실제0과null score/max를구분하고,성공경험의모든topic·대표인터뷰·실패를포함합니다. 누락된topic index의실제essay도문서에서누락하지않습니다.

Source에맞춰leader70pt/140pt,경력11pt/130pt,photo80pt/10pt,Essay86pt/Survey65px·118pt와정적탭20pt/10pt/8pt/6pt를반영했습니다. min-height/overflow-visible로길어진본문을보존합니다.190mm paper를독립viewport에서너비맞춤/수동배율/양축resize하고인쇄시배율1과named A4 page(7/10/10mm margin)로설정합니다. 이는구현과source대조이며실제측정완료를의미하지않습니다.

8개새검사를포함123tests,49그룹/26완전예시가통과했습니다. 독립소비자에50항목/75파일을fresh설치해26예시TypeScript/Vite·폰트bytes·고지를검증했습니다. 이전tmp소비자는없어서새폴더를할당했고component source는직접수정하지않았습니다. 현재172개정의상태의browser검사는0이며이전159개/후속22개부분검사와구분합니다. 실제A4/PDF/HTML/ZIP 문서·폰트/pixel·전체내용/머리말/페이지counter·독립소비자320px/resize/native print는미완료입니다.

## 최신 source 차이 추적

frontend를27c4fdbf로fetch/fast-forward해clean을확인했습니다. 이번header/favorite/evaluation및관련원본CSS는087811ff와같습니다. Leadership tag/content/detail/divider·print detail,position version조회,admin user/group/position및chat link/sidebar가변경됐으며재현여부는추가감사대상입니다. sourceFile 대응·기존검사수를latest전체일치로사용하지않습니다.


## Leadership summary detail and palette, 2026-10-12

Local dev27c4fdbf adds the blue type tag, bold summary.content, separate summary.description detail/divider, print detail propagation and #327BB7/#42938A/#DDB77D palette. The independent summary and7-chapter print document preserve these roles, including detail-only missing/zero cases and full detail under both text policies. Default tags retain21px/15pt height; wrapTitle and480px compact layout support long labels.

Final165 PRISM tests, workspace typecheck and32 complete example contracts passed. Real shadcn installation into the owned isolated consumer passed TypeScript/Vite/font/notices; all52 installed modules andCSS match emitted bytes with0 transforms. Source fingerprint f2ee00893ee4f59e56bc661ed23805cfe7d4b4a342b64a152db9028258494847 covers71 inputs. Current197 rendered fixture states remain0 checked because the HTTP protocol-policy refusal is unresolved. Previous chart/font/native/PDF evidence is historical. Deployed revision binding, current visual/pagination comparison and production remain unverified.


## Position snapshot references, 2026-10-12

Local dev27c4fdbf card mappers retain version and use legacy1; versionless body links load currentLIVE. Typed card/link references, version-aware controlled selection and additional callback arguments preserve this purpose without changing existing first arguments or card/detail CSS. Position body/table/analysis actions add link references; profile/document actions retain two arguments.

The complete host example owns its provider and cancellation. Synthetic JSDOM tests verify old-version abort/late completion, LIVE link payloads, failure/retry, loader-generation replacement and selection dismissal. These are not authenticated API or rendered-browser checks. Final171 PRISM tests, workspace typecheck and32 complete examples passed. Real shadcn install passed TypeScript/Vite/font/notices with52 exact emitted modules/CSS and0 transforms. Source9a2ec3867fa65575d411433fcf5a35f72ecdd415d04a35fad10305530bb79009 covers72 inputs. Current200 rendered fixture states remain0 checked; full deployed/authenticated/font/pixel/A4 and production remain incomplete.


## Source account and administration forms, 2026-10-12

Local dev27c4fdbf uses roleCode/team, optional company and editable detail basic fields. The account recipe keeps email readonly in detail, supports dynamic/restricted roles and stable{id,name} group companies, normalizes only seven public save fields and reports dirty cancellation. Legacy roleId/division and three-field recipes remain. Company search and the regular verified-name border match the source delta. Role14px and default21px tags are separated from compact wrapping. Position view403/404 callbacks are bound to company and optional active request ID, deduplicated for StrictMode, and preserve create/edit drafts.

Final178 PRISM tests and workspace typecheck passed;13 administrator tests include7 new source/legacy/data/permission-display/search/request cases. Real shadcn install passed32 complete examples, TypeScript/Vite/font/notices and52 exact modules/CSS with0 transforms. Source4f1a37550edde1dc459f5f5ec726cc2756d9ba7e3d04e355f1f0674a901db54e covers72 inputs. Current202 rendered fixtures remain0 checked. These are source/synthetic/install results; current deployed binding, real account/RBAC/context service, full pixel/font/A4 and production remain unverified. Administrator pages/list/bulk/restoration and chat context changes are still pending.


Final account cancellation correction: create uses initialValue or the first controlled draft for actual dirty cancellation, while valid creation remains independently enabled. The source7ea7cd89e57bfaa5f165b8d2cd0c620fc4b0143244881270c2147c659874adec/72 inputs passed179 tests and final workspace typecheck. Real final shadcn installation rechecked52 exact modules/CSS,0 transforms,32 examples andVite/font/notices. The preceding178-test/4f1a source evidence is historical. Current202 rendered fixtures are still0 checked.

## Chat detail access errors and Admin navigation, 2026-10-12

Local dev27c4fdbf's classified detail API403/404 notification clears both panel-open flags and selected subjects. The portable hook keeps one profile or historical/LIVE position selection, with host-owned error classification, notices and cancellation. Optional opaque UI tickets reject stale same-ID, version/source, foreign-instance and unmounted callbacks. The complete responsive workspace conditionally unmounts its panel on revocation, removing the actual subject DOM even when ordinary manual close is guarded. The Admin factory follows the source's five-link order and host capability gate; opt-in descendant routes preserve legacy exact matching. ChatMain/axios integration provenance is separate from the component inventory count.

Final189 PRISM tests and workspace typecheck passed, including10 new hook/menu/workspace cases. Real shadcn installation and final consumer verification passed53 exact modules/CSS with0 transforms,34 complete examples,TypeScript/Vite/font/notices. Sourceb49fd5df2019734965d9090c11203f2d7dc694171b2babe94167385b4fa976b4 covers74 inputs. The53 groups/54 items and206 fixtures describe local contracts; current rendered checks remain0. Browser inventory visibility was re-observed, but current page operation recovery, deployed revision binding, authenticated design/interaction parity, full font/pixel/A4 and production are still unverified. Administrator lists/page restoration/status actions and remaining chat/authStore context are pending.

## Administrator user list, 2026-10-12

Source27c4fdbf filter/apply, six-column table, selection/sort and bulk status purposes now have a typed host-owned user-list recipe. Apply/reset clears selection/page1; sort preserves selection; admin header deselection clears all pages. Company-group filtering follows role metadata, missing values use dashes, email cannot sort. The source header/filter/table/chip geometry is retained with container wrapping and horizontal scrolling.

Bulk requests capture frozen IDs/active, enforce the default500 limit and provide busy/duplicate/retry/AbortSignal/scope/readOnly/unmount guards. Success removes only processed current IDs. The host owns API serialization, actual authorization, mutation/cache refresh and notices. Source/synthetic contracts do not prove real account/RBAC behavior.

Final201 tests and workspace typecheck passed, including12 user-list/async/portable-example cases and pending-sort lock. Actual final shadcn installation checked54 exact modules/CSS,0 transforms,35 examples,TypeScript/Vite/font/notices. Source72cac2b2fdf5ec6f009709f942206e5b3b534d5f8d9b3bb07f8340c3afce763d covers76 inputs. Current54 groups/55 items/212 fixtures have0 fresh rendered checks. Position-list restoration,non-user administrator pages,remaining chat/authStore,full deployed design/interaction/font/pixel/A4 and production remain incomplete.

Desktop filter correction: source-width calculation showed1180px wrapped some desktop containers where the source five columns fit. The threshold is now1140px, retaining the source five columns at1160px. Final sourcefd45b856fb976b64d11cc82a973e04cb799e224c7ba579f3c2c6c3c6f8292fb7/76 inputs reinstalled54 exact modules/CSS,0 transforms and passed35 examples/TypeScript/Vite/font/notices. The201 behavioral-test TypeScript source is unchanged; the preceding72cac2/abac1838 evidence is before this CSS correction. Current212 rendered checks remain0.

## Position-block management audit 2026-10-13

Current workspace:57 install groups/58 registry items/38 complete examples/244 canonical fixture states;252 full PRISM tests passed. This is not a completion denominator. Non-vector source files remain186; current purpose mapping uses49 primary/50 total non-vector groups, and final independent target total remains unestablished.

Position-block list/editor/deletion follow current source27c4fdbf: LIVE/TEMP, role view-only, sync lock, deleted counts, debounced duplicate check, description+sub-job generation and manual editing, dirty guard, impact review before edit confirmation, required primary/optional secondary remap and other-job conflict. Services are typed host callbacks with cancellation; failed requests retain input or selection for retry. Twelve new states at1280/320 and legacy tag/default320 were checked; document/dialog overflow and nested buttons0 after containing hidden labels within remap fields. Actual create/edit/save/remap flows are synthetic. The original authenticated administrator page is blank, and real service/RBAC/sync/full visual/font/A4 parity remains pending.

Current source fingerprint:24f6875e7f3aa078e2c927100585b52274d7788c75207ae70c9352506239d1b6 from82 inputs. Corrected57 TSX/CSS and38 examples passed actual shadcn installation,TypeScript/Vite/font/notices. Source common-control CSS values and label/helper/generation/textarea order were measured. Fourteen current unique states were checked (12 new plus tag/field regressions); authenticated source and full busy/visual comparison remain pending. Corrected installed mobile/order/red notice/edit-impact-save were checked with console0. Full site and generic checks passed; latest review publication pending.

## Chat-log and generation-state audit 2026-10-13

Current source:58 install groups/59 registry items/39 complete examples/252 canonical fixture states. The independent final target total remains unestablished;186 source files are not a completion denominator.

The source chat-log pages are placeholders with100 mock rows,no-op search/reset,header/page-only sort and a fixed archive. The portable list has typed host-owned query/page/sort/records and confirmed copy success/failure. The readonly archive preserves context-nudge question omission and selected responses. Public examples use23 synthetic rows/4turns and never change the system clipboard.

34 target and266 full PRISM tests passed. Real shadcn installation,58 exact module sources/CSS,39 complete examples typecheck,Vite,font/notices and full site build passed. The generic registry still matches immutable snapshot sha256-25ca4393b38b8fcebbbd34ca3d8c73475e773a766e971da004f94e40728bc896.

IAB recovered. All8 log states rendered at1280/320 with no document horizontal overflow or nested buttons. Browser interactions proved copy failure/retry,invalid-date submit rejection,page2/detail/back,readonly choices and context-nudge omission. Six dynamic generation checks at1280/320 proved input-only bounds,retained values,Base0.6,24px CSS spinner and48px empty subjob loader. They are not extra canonical states. Installed list/archive rendered atboth widths and retained generation at1280.

Current9 of252 canonical states have scoped browser evidence. Full source/installed state coverage,authenticated original font/pixel/A4 and deployed revision comparison remain incomplete. The source-defined /chat/admin/chat-logs route is document complete but visibly blank in IAB;the existing Chrome source tab displays /admin-login. These observations do not establish an authentication or implementation cause. Review branch CI/preview readback is pending;production is not published.

Current source fingerprint:31cf20034ffccb9e397b17dc3e8f5d30621c0ae0d5bdb2155fab556927b933e7/84 inputs.

## Current canonical-state browser audit 2026-10-13

All 58 groups and 252 canonical states were inspected through CUA at 320px and 1280px: 504 unique state/width renders. Component/state identity and fixture presence matched. Document horizontal overflow, nested buttons and visible unlabeled native inputs were zero. Font loading status was loaded, and the selected tab had no browser error logs. This is a local synthetic render and DOM-layout gate. It does not establish authenticated source parity or complete interaction coverage.

Selected panel interactions confirmed keyboard changes from 440px to 456px and 800px, expansion to the parent content, and closing/reopening with drafts and the preferred width retained. A 240px parent produced compact mode; restoring a 1200px parent restored the preferred 800px panel. Closing moved focus to BODY; caller focus restoration remains a review item. Pointer dragging, cancellation/guard combinations, all popups/callbacks/service effects, independent installed-state coverage and original font/pixel/A4 comparison remain incomplete.

Source fingerprint remains 31cf20034ffccb9e397b17dc3e8f5d30621c0ae0d5bdb2155fab556927b933e7, covering 84 inputs. Previous generation/chat-log and publication evidence is preserved. Passing 252/252 render checks does not establish full-goal completion. Production/main has not been published by this work.

## Source spinner motion correction 2026-10-13

After the full baseline matrix, source review and browser computed styles found two concurrent 1s rotations on the block generation icon: its original SVG rotation plus an added wrapper rotation. The source dialog SCSS adds no wrapper motion. The additional wrapper animations were removed from block validation and generation overlays, preserving the original SVG rotation, geometry and reduced-motion rules.

At 320px and 1280px, the corrected overlay has no wrapper animation and one SVG rotation at 1s. All 12 affected block states were checked at both widths (24 renders), and 22 related tests passed. The current fingerprint is ad7537d8e868b73bf79d21e941ae003fc2d21790a4b44bd7fd855d04fe372988. The 504-render matrix remains evidence for baseline31cf2003; it was not rerun at the new fingerprint. Unchanged scopes retain that baseline evidence. Authenticated source parity and full-goal completion remain unverified.

## Latest source delta at e5d4d79a, 2026-10-13

The clean local frontend was fetched and fast-forwarded to e5d4d79a8933389e47d32ca44e91216bef011d7e. Inventory now has 271 TSX files: 87 vectors and 184 non-vectors. The product import graph reaches 175 files; 7 are sample-only and 2 disconnected. Removed Radar/Summary files remain historical references; portable chart/summary extensions remain available. The final independent implementation target total is unestablished.

Leadership analysis now renders all results as readonly blue tags before the title/summary. Source geometry of 21px, 12px, weight600 and primary color was observed. Long labels use one-line ellipsis while their full DOM/title text is preserved. The pure history deletion helper returns a host intent: a matching URL ID navigates to the intro, a matching active root-session ID resets the session, and another record preserves the view. Call it after successful deletion with completion-time IDs. The example changes synthetic records and display state only.

Six new tests and 272 full PRISM tests passed. Analysis3/sidebar4 states rendered at 320px and 1280px (14 renders) without document overflow or nested buttons. Browser flows confirmed failure/retry and all three deletion contexts. Real shadcn installation verified 58 exact module/CSS sources, 39 complete examples typecheck/Vite build, font and artwork notices. Installed browser runtime is a separate unverified scope.

Current fingerprint:94e6b3cb00379a04af777a571735f0d722247f20dfc5b718aaa34b921f5a71fc, covering85 inputs. The prior full matrix and spinner evidence retains its measured fingerprints. Authenticated source rendering, deployed revision, full interactions, font/pixel/A4 comparison, remaining purposes and enhancements are incomplete. Production/main has not been published by this work.

## Sidebar selection and local drafts, 2026-10-13

Navigation activeId and history activeHistoryId are independent. Omitted activeHistoryId preserves legacy selection; null clears it. A stable history row key is distinct from an optional server conversationId or localDraftId. Typed open intents expose only public identity fields. Local drafts have no server rename/delete menu, and a missing typed open handler cannot create a fake server route. Target replacement cancels the old menu/rename draft.

23 targeted and 279 full tests passed. Four sidebar states rendered at 320px and 1280px without document overflow or nested buttons. Workspace interactions confirmed independent favorites/history selection, local draft opening, stable promotion to a server record, server-ID deletion and background-session reset preserving the current menu. These synthetic effects do not prove backend transactions or authorization.

Current fingerprint:dfd7cb666da2422a27ecb4684855713acbaf5fb0f90aef96fd09093bcc146091/85 inputs. Prior source/renderer evidence retains its original fingerprints. Installed runtime, authenticated source/deployed revision, full font/pixel/A4 and all-purpose completion remain unverified.

Real shadcn installation additionally verified58 exact module/CSS sources,39 complete examples tsc/Vite build,font andartwork notices. The installed sidebar rendered at320/1280 andits independent menu/history selection andlocal-draft promotion/opening worked. This does not establish all installed interactions orsource parity.

## 사이드바 실제 원본 비교와 긴 이력 보정

실제 testuser001 원본과 비교해 메뉴 line-height 21px, 이력 19.6px, 새 대화 글자색 #fdfdfd와 10px 이력 스크롤바를 보정했습니다. 100행 합성 이력과 후보자 목록 진입 시 대화 선택 해제 예제를 추가했습니다. 관련 24개/전체 280개 테스트와 typecheck가 통과했고 5개 상태를 320/1280px에서 10회 렌더했습니다. 마지막 행 이동 전후 footer 위치는 유지됐습니다.

선택한 16개 치수·스타일 중 15개가 일치합니다. 배포 원본에는 새 포지션 목록 메뉴가 있어 history 시작 y가 40px 다릅니다. 최신 원본 d677e551은 fetch/fast-forward했으며 새 position-list 목적·EtcIcon과 다른 delta의 감사/구현은 미완료입니다. 기존 source inventory의 e5 기준 수치를 최신 원본 수치로 재사용하지 않습니다. 전체 font/pixel/동작과 배포 revision은 미확인입니다. 원본 비교 당시 fingerprint는 259cf5a223358cf3497e68de7de53b1bc65e6e175db06558a1b580efa63530a0/85 inputs입니다.

실제 설치 browser에서 문서 전용 CSS에 의존하던 예제 높이를 발견해 완전한 예제 안에 layout을 명시했습니다. 최종 fingerprint 69949a21ca0852e61f052617801fdc36259eb3a2255c3150309ba2436238afe4의 10회 렌더와 소비자 320/1280px 100행 검사가 통과했습니다. 소비자 sidebar는 518px, row는 213px이며 마지막 행 이동 시 footer는 y375로 유지되고 내부 scrollTop만 3313으로 바뀝니다. 58개 module/CSS와 39개 예제의 재설치 검증이 통과했습니다.

## 포지션 목록과 SUMMARY 배지, 2026-10-13

이번 작업 범위는 `PrismPositionDirectory`, `PrismSummaryBadge` 두 컴포넌트입니다. 최신 원본 `dev` `2eeb26ff`의 PositionList는 상세 탭을 숨겨 둔 채 mount 상태를 유지하고 기존 행이 있으면 재조회 중에도 표를 표시합니다. 독립 목록도 같은 상태 전환을 구현했습니다. 원본 Candidate Common 배포 샘플의 SUMMARY 원형 배지는 88×88px, padding `10px 4px`였고 로컬·독립 설치본에서 같은 치수를 확인했습니다.

포지션 목록의 상세 mount 유지와 기존 행 재조회 테스트를 포함해 PRISM 295개 테스트가 통과했습니다. 로컬 브라우저에서 목록으로 돌아와도 숨겨진 상세 DOM이 남았고, 실제 shadcn 설치본은 상세 mount 횟수 1회를 유지했습니다. 설치본 재조회 상태에서는 기존 행과 정렬 버튼이 보였으며 기본 viewport에서 문서 가로 넘침은 0이었습니다. 레지스트리 59개 설치 그룹의 소스·CSS와 40개 예제 타입 검사, Vite·폰트·고지 검사가 통과했습니다.

이번 delta의 실제 320px iframe에서 문서 너비 320px, 표 680px/스크롤 영역 256px를 확인했고 상세 탭 복귀 후 숨겨진 상세와 10개 행이 유지됐습니다. 이 검증은 두 컴포넌트의 해당 상태에 한정됩니다. 원본 배포 revision과 로컬 `dev`의 동일성, 포지션 상세의 실제 서비스 요청, 전체 프로필·목록의 pixel/font 일치는 아직 확인하지 못했습니다.

## Goal 완료 기준 수량, 2026-10-13

고정 기준 원본 `2eeb26ff`에서 구현 목표는 58개 UI 컴포넌트 그룹입니다. 원본 비벡터 UI 대응 50개와 HTML export·별도 기능 7개를 합산했고, 아이콘 자산 묶음과 디자인 토큰은 필수지만 개수에서 제외했습니다. 배포 UI는 디자인과 사용 목적의 기준이며 원본의 문제를 해결하는 변경은 의도와 효과가 확인되면 허용합니다. 현재 58개 catalog 항목의 존재는 그룹별 목적·상태·디자인 일관성·동작 검증 완료를 뜻하지 않습니다.

현재 58개 그룹 모두 구현 코드와 registry 항목이 있어 코드·설치 항목은 **58/58개**입니다. 기존 검증 기록의 `partial`/`pending`은 원본 시각 일치 중심으로 작성됐습니다. 개선을 허용하는 새 기준으로 각 그룹을 다시 판정하기 전까지 **goal 완료 판정 수는 미집계**입니다. 앞서 제시한 0/58 완료 확인 수치는 철회합니다.

## Goal 그룹별 완료 판정 시작, 2026-10-13

개선을 허용하는 새 기준으로 `prism-button`을 완료 판정했습니다. 대응 원본은 `HRXBtn`과 `HRXNewChatBtn` 두 파일입니다. 원본 사용처에서 확인된 `label` 단독 문구와 오른쪽 아이콘 순서를 공개 API에 보완했습니다. 원본 공개 버튼 샘플과 독립 예제의 대표 크기·색·비활성·새 대화 상태를 비교했고, 클릭·Enter·focus-visible과 접근 가능한 아이콘 이름을 확인했습니다. 320px 기본·비활성 화면의 문서 가로 넘침은 0px입니다. 아이콘 버튼의 이름 요구, 기본 `type=button`, 오른쪽 아이콘의 대칭 간격은 의도한 개선입니다.

최종 296개 PRISM 테스트, workspace typecheck, site build, registry release check가 통과했습니다. 실제 shadcn 독립 소비자에는 59개 모듈과 CSS가 생성 산출물과 바이트 단위로 일치하며, 40개 완전 예제의 타입 검사, Vite·폰트·고지를 확인했습니다. 버튼 감사 당시 완료 판정은 **1/58개**였고, 나머지 57개는 미판정이었습니다. 기존 `visual`/`interaction`의 `partial` 표기는 더 엄격한 원본 전체 시각·상호작용 일치 기준의 미검증을 계속 나타냅니다. 배포 원본의 commit 동일성 및 실제 제품 탐색·API 연동은 확인하지 못했고 소비자 앱이 소유합니다.

## Goal 배지·태그·칩 그룹 완료 판정, 2026-10-13

`prism-badge`의 대응 원본 네 파일을 원본 사용처와 공개 배포 샘플에 다시 대조했습니다. 배포 화면에서 ELP 16px, 24px 알림 아이콘의 1/99+ 건수, 명시 색상 Chip 52×22px, 세 가지 Tag 21px과 대표 색을 확인했습니다. 원본 사용처의 `label` 단독 전달을 Tag/Chip의 공개 API에 반영했고, 색상 미지정 Chip의 원본 fallback은 `tone="neutral"`로 선택할 수 있게 했습니다. 기존 primary 기본값은 유지했습니다.

짧은 Tag/Chip의 21/22px 높이를 유지하면서 `wrap`을 선택한 긴 문구만 여러 줄로 표시합니다. 로컬 및 독립 설치본의 320px 미리보기에서 180px 폭의 긴 Tag/Chip은 각각 약 39.6/37.6px 높이로 줄바뀌었고 문서 폭은 320px였습니다. 태그 삭제 버튼은 Enter로 합성 항목을 제거했습니다. 직접 연 설치본에는 브라우저 오류 로그가 없었습니다. iframe에서 관찰된 `MutationObserver` 오류는 빈 iframe에서도 재현되어 해당 컴포넌트의 오류로 연결하지 않았습니다.

최종 297개 PRISM 테스트, workspace typecheck, site build, registry release check가 통과했습니다. 실제 shadcn 설치본에서 59개 모듈·CSS의 바이트 일치, 40개 예제 타입 검사, Vite·폰트·고지를 확인했습니다. 현재 새 기준의 완료 판정은 **2/58개**이며 56개는 미판정입니다. 원본 배포 revision 동일성, 제품 서비스의 Tag 삭제, 전체 제품 사용처의 시각·상호작용은 이 판정의 증거에 포함되지 않습니다.

## Goal 입력 필드 그룹 완료 판정, 2026-10-13

`prism-field`는 원본 `HRXTextField`·`HRXInputField`·`HRXSelect`의 입력 목적을 묶습니다. 배포 공개 샘플에서 TextField 중간/작은 크기는 32/28px이며 읽기 전용·비활성·오류 상태를 확인했습니다. Select는 큰/중간/작은 크기 40/32/28px, 읽기 전용·비활성 상태를 확인했습니다. 검색 가능한 원본 Select는 메뉴를 열면 검색 입력에 포커스가 가고 목록을 표시합니다. 배포 SHA와 고정 기준 소스 SHA가 같은지는 확인되지 않았습니다.

독립 `PrismInput`은 레이블·설명·오류를 입력과 연결하고 controlled 지우기 의도와 포커스를 유지합니다. `PrismSelect`는 필수 미선택 제출을 막고 보이는 trigger에 포커스·오류를 표시하며, 검색/키보드 선택과 native `FormData`를 제공합니다. JSX 옵션의 중첩 내용은 원본처럼 텍스트를 추출하도록 수정해 `[object Object]`가 표시되지 않습니다. 읽기 전용 선택값은 전송되지만 변경할 수 없습니다. `PrismTextarea`의 생성 상태는 입력 초안을 유지하고 helper를 가리지 않습니다.

실제 shadcn 소비자에 field를 재설치해 59개 모듈·CSS 바이트 일치, 40개 예제 타입 검사, Vite·폰트·고지를 확인했습니다. 직접 연 설치본 브라우저에서 지우기/포커스, 필수값 오류, 중첩 옵션 검색·비활성 건너뛰기·첫 글자 탐색, `bravo` 제출, textarea 초안 보존을 확인했습니다. 320px와 1280px에서 문서 가로 넘침은 없었습니다. 최종 PRISM 299개 테스트, workspace typecheck, site build, registry release check가 통과했습니다. 현재 완료 판정은 **3/58개**이고 55개는 미판정입니다. 실제 저장·권한은 소비자 앱이 소유하며 전체 사용처와 폰트·픽셀 일치는 확인하지 않았습니다.

## Goal 대화상자 그룹 완료 판정, 2026-10-13

`prism-dialog`는 원본 `HRXDialog`와 `HRXConfirmDialog`의 공통 대화상자 목적을 묶습니다. 배포 공개 샘플의 기본 대화상자는 폭 440px, 머리 66.1875px, 꼬리 73px이었고 확인창은 폭 440px, 머리 65px, 본문 123px, 꼬리 73px이었습니다. 원본 CSS에서 긴 본문이 스크롤될 때 꼬리에 그림자가 생기는 조건을 확인해 독립 컴포넌트에도 적용했습니다. 접근성 개선으로 제목과 닫기 버튼의 이름을 분리했고, 제목 없는 확인창에는 화면 낭독용 제목을 둡니다. 삭제 문구와 위험 색상은 호출자가 명시하도록 했습니다.

독립 shadcn 소비자에서 59개 모듈·CSS 바이트 일치, 40개 예제 타입 검사, Vite·폰트·고지를 확인했습니다. 직접 연 설치본에서 폭 440/560/620px, 성공·오류 확인창, 제목 없는 확인창, 긴 본문, 처리 중 상태를 검사했습니다. 긴 본문은 내부에서 스크롤되고 꼬리가 고정됐으며 그림자가 표시됐습니다. 320px 화면에서 문서 가로 넘침은 없고 단추에 접근할 수 있었습니다. 처리 중에는 Escape·닫기·취소·확인이 차단됐고 해제 후 Escape로 닫을 때 시작 버튼에 포커스가 돌아왔습니다. 최종 PRISM 301개 테스트, workspace typecheck, site build, registry release check가 통과했습니다. 현재 완료 판정은 **4/58개**이고 54개는 미판정입니다. 배포 SHA와 로컬 원본 SHA의 동일성, 모든 인증 제품 사용처 및 전체 폰트·픽셀 일치는 확인하지 않았습니다.

## Goal 알림·요청 상태 그룹 완료 판정, 2026-10-13

`prism-feedback`은 원본 `HRXToast`·`HRXEmptyState`와 독립적인 요청 상태 표시를 묶습니다. 배포 Toast 샘플에서 성공 알림은 약 191.94×40px, 바깥 간격 12px, 본문 간격 6px, 제목·설명 간격 4px, 닫기 버튼 20px, 배경 `rgb(56,74,125)`였습니다. 긴 제목과 설명도 샘플 너비 안에서 줄바꿈됐습니다. 원본의 default/info/warning/success/error 다섯 유형과 문자열 이미지 경로 입력을 독립 API에 보완했습니다. 원본에서 정보·경고 유형은 같은 정보 아이콘을 사용하며 별도 디자인은 아직 없습니다.

토스트의 임의 본문에 재시도 버튼이 들어갈 때 유효하지 않은 `<p>` 중첩과 닫기 버튼용 20px 스타일이 해당 버튼에 적용되는 문제를 고쳤습니다. 오류는 `alert`, 나머지 알림은 `status`로 알립니다. 독립 shadcn 소비자에서 59개 모듈·CSS 바이트 일치, 40개 예제 타입 검사, Vite·폰트·고지를 확인했습니다. 직접 연 설치본에서 다섯 유형, 긴 문구, 재시도 버튼과 닫기, 빈 상태 세 유형, 이미지 URL, 요청 실패 재시도를 확인했습니다. 긴 제목은 높이 59.1875px, 긴 제목·설명은 약 79.97px이었고 320px에서 토스트 폭 288px, 문서 가로 넘침 0px이었습니다. PRISM 303개 테스트, workspace typecheck, site build, registry release check가 통과했습니다. 완료 판정은 **5/58개**이고 53개는 미판정입니다. 실제 제품의 알림 배치·자동 닫힘·큐·네트워크 결과는 소비자 앱이 소유하며 이 판정에는 포함되지 않습니다.

## Goal Avatar·프로필 Chip·Anchor Chip·표시 표 그룹 완료 판정, 2026-10-13

`prism-display`는 원본 `HRXAvatar`·`HRXProfileChip`·`HRXAnchorChip`·`HRXTable`의 표시 목적을 묶습니다. 배포 공개 샘플에서 Avatar 이미지 40px와 간격 12px, 동작이 없는 프로필 Chip 93.3125×30px, 선택된 Anchor Chip의 30px 높이와 색상, 표 932×200px·헤더 32px·행 40px을 확인했습니다. 원본 표는 행·열과 사용자 지정 셀을 받아 표시하며 검색·정렬·페이지 이동은 이 샘플의 기능이 아닙니다. 배포 revision과 로컬 원본 SHA의 동일성은 확인되지 않았습니다.

독립 API의 프로필 Chip은 동작이 없을 때 일반 표시 요소, 클릭할 때 버튼으로 렌더링합니다. Anchor Chip은 원본의 `label`·`active` 속성을 받습니다. 새 `PrismGridTable`은 호출자가 제공한 행·열·셀을 native 표로 렌더링하고 32px 헤더와 40px 행을 유지합니다. 검색·정렬·페이지 이동이 필요한 별도 용도는 기존 `PrismDataTable`이 맡습니다. 긴 Chip 문구는 좁은 화면에 맞춰 줄임 또는 줄바꿈 처리합니다.

독립 shadcn 소비자에서 59개 모듈·CSS 바이트 일치, 40개 예제 타입 검사, Vite·폰트·고지를 확인했습니다. 직접 연 설치본에서 프로필·Anchor Chip의 대표 치수와 색상, 클릭 의도, Avatar의 네 가지 말줄임 조합과 키보드 도움말·Escape 닫기, 표의 원본과 같은 헤더·행·열 너비를 확인했습니다. 320px 화면에서는 표 영역이 가로·세로로 스크롤되고 문서 가로 넘침은 0px이었습니다. 긴 프로필 Chip은 288px 안에서 접근 가능한 전체 이름을 유지하고 긴 Anchor Chip은 줄바꿈 뒤에도 선택할 수 있었습니다. 합성 데이터로 `PrismDataTable`의 검색·정렬·페이지 이동도 확인했습니다. PRISM 305개 테스트, workspace typecheck, site build, registry release check가 통과했습니다. 새 기준의 완료 판정은 **6/58개**이고 52개는 미판정입니다. 모든 인증 제품 사용처와 Avatar의 모든 너비·문구 조합, 전체 폰트·픽셀 일치는 아직 확인하지 않았습니다.

## 사이드바 초기 상태·짧은 화면 보완, 2026-10-13

최신 원본 `dev`의 `ChatSidebar`에서는 관리자 메뉴 권한과 로그아웃 버튼 노출을 별도로 판단합니다. 관리자 메뉴는 권한이 있으면 처음부터 펼쳐지고, 대화기록은 기본적으로 닫혀 있다가 재로그인 직후의 지정된 경우에만 자동으로 펼쳐집니다. 독립 `PrismSidebar`에 `defaultExpandedIds`·`defaultHistoryOpen`을 추가하고 예제에 기본·관리자 로그인·제한 상태를 구분했습니다. 접힌 상태에서 Admin 아이콘을 누를 때 이미 펼쳐 둔 하위 메뉴가 닫히던 동작도 수정했습니다.

기존 인증 탭에서 확인한 배포 사이드바는 폭 280px, 헤더 64px, 새 대화 버튼 40px, 탐색 행 36px, Admin 하위 메뉴 172px이었습니다. 독립 shadcn 설치본은 이 대표 치수가 일치했습니다. 설치본에서 대화기록 열기, 제목 변경의 Enter 저장·Escape 취소, 합성 기록 삭제 후 선택 해제, 72px 접힘과 Admin 재확장을 직접 확인했습니다. 320px에서는 문서 가로 넘침 없이 탐색 목록이 대화기록까지 스크롤되고 100개 합성 기록의 마지막 행까지 내부 스크롤로 접근할 수 있었습니다. 기본 프로필 메뉴에는 공지만 있고 관리자 로그인 예제에서만 로그아웃이 나타났습니다.

기존 인증 탭은 현재 원본 소스에 있는 포지션 목록을 표시하지 않았습니다. 새 인증 세션을 열었을 때는 로그인 화면으로 이동해, 현재 배포 client가 원본 `dev`와 같은지 확인하지 못했습니다. 따라서 이 변경은 `prism-sidebar`의 **완료 판정에 아직 포함하지 않았고**, 전체 완료 판정은 **6/58개**로 유지합니다. 실제 제품의 경로 이동·권한·저장·삭제 결과와 현재 배포 메뉴 비교가 남아 있습니다.
