# 대화 입력·질문·판단 기준 그룹 재감사 (2026-10-14)

대상은 58개 목표 중 `prism-chat` 한 그룹이다. 기준 원본 `prism/frontend`의 `dev`와 `origin/dev`는 `2eeb26ff10274745f9d86897c2f2828bff002b98`로 일치했다. 이전 인증된 배포 관찰에서 composer 800×110px, 60px 입력 영역, 48px 동작 영역, 28px 전송 버튼, 2000자 상한을 확인했다. 이번 공개 배포 Templates 샘플에서는 질문 버블의 28px 복사 버튼과 판단 기준의 `<ol>`·disc 목록을 확인했다. 현재 배포의 인증된 전체 대화 흐름과 배포 소스 SHA는 확인하지 못했다.

원본 `ChatMessageQuestion`에는 hover 시 질문 복사와 복사 완료 상태가 있고, `ChatTemplateCriteria`에는 `#` 제목·`**굵게**` 표시 및 패널용 구분선·들여쓰기가 있다. 기존 설치 그룹은 입력창 위주였고 질문 복사와 기준 서식이 누락됐다. `PrismMessage`에 plain string 질문의 기본 복사와 `copyText`/`onCopy` 확장, 성공 후 3초 완료 상태를 추가했다. 복사 실패는 완료로 표시하지 않는다. 원본의 hover 노출을 유지하면서 키보드 포커스와 터치에서는 버튼을 찾을 수 있게 했다. `PrismCriteria`는 원본 목록·제목·강조·panelMode를 제공하고 텍스트의 HTML을 실행하지 않는다. catalog에는 원본 SCSS 대응, 긴 내용/패널 상태, 컴파일 가능한 소비자 예제를 추가했다. 답변 생성·취소·첨부 파일 업로드·서비스 권한은 소비자 앱의 책임이다.

로컬 인앱 브라우저에서 기본·오류·로딩/중단·패널·긴 내용을 확인했다. 320px viewport에서 긴 질문과 기준이 줄바꿈됐고 문서 scrollWidth는 320px이었다. Shift+Enter는 개행, Enter는 한 번 전송했다. 별도 `shadcn` 소비자에 registry를 다시 설치해 59개 모듈 소스와 CSS의 바이트 일치, 완전 예제 44개 타입 검사, Vite·Pretendard·고지를 확인했다. 1280px viewport 속 320px 독립 부모에서 긴 질문·기준·패널 표시, 생성 중 입력 잠금·중단, 전송 1회, 문서 가로 넘침 없음, 콘솔 오류 0개를 확인했다. 원본 전체와 픽셀 단위 동일성은 이 목표의 판정 조건이 아니다.

질문 복사 버튼은 브라우저에서 완료 상태로 바뀌었고 host callback의 성공·실패와 답변의 버튼 제외는 테스트했다. 인앱 브라우저 가상 클립보드에서는 복사 결과를 읽거나 붙여넣을 수 없어 실제 클립보드 내용은 별도로 확정하지 않는다. 다른 브라우저의 IME, 인증된 배포의 생성 중·긴 내용·모바일, 실제 chat API와 배포 SHA도 미확인이다. 이 범위를 분리해 기록하고 그룹을 새 기준으로 완료 판정한다. 전체 진척도는 **24/58개**, 미판정 34개다.

전체 PRISM 테스트 333개, workspace typecheck, site build, registry release check를 통과했다. 이 판정과 게시 대상의 최종 검증 상태는 `.worknotes/browser-evidence/chat-goal-publication.json`에 별도로 기록한다.
