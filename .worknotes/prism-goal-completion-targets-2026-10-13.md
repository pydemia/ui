# PRISM goal 완료 판정 범위 (2026-10-13)

구현 목표는 **독립 설치·검증 가능한 UI 컴포넌트 그룹 58개**로 고정한다. 기준 원본은 `prism/frontend`의 `dev` `2eeb26ff10274745f9d86897c2f2828bff002b98`이다. 목표 수는 원본 TSX 파일 수나 React export 수가 아니라, `pydemia/ui`의 PRISM catalog/registry에서 소비자가 독립적으로 설치하고 기능 목적별로 검증할 수 있는 단위의 수다. 한 그룹에 여러 원본 UI가 대응하면 그 UI의 목적과 필요한 상태를 모두 확인해야 그룹 하나를 완료로 센다.

산정: 원본 `components`/`layouts` TSX 275개 중 벡터 자산 88개를 제외한 비벡터 187개는 primary 그룹 50개에 대응한다. `PrismProfileHtmlExport` 1개와 별도 기능 그룹 7개를 더해 58개다. `prism-icon`은 88개 벡터 자산을 공급하는 필수 지원 그룹이고 디자인 토큰도 필수지만, 둘 다 58개 분모에서는 제외한다. 따라서 현재 catalog의 59개 설치 그룹과 registry의 60개 항목을 그대로 구현 완료 수로 읽지 않는다.

원본 대응 50개:

```text
prism-button                 prism-field                  prism-badge
prism-display                prism-dialog                 prism-feedback
prism-sidebar                prism-chat                   prism-candidate
prism-memo                   prism-panel                  prism-six-frame
prism-selection              prism-profile                prism-content
prism-admin                  prism-export                 prism-document
prism-workspace              prism-chart                  prism-utility
prism-evaluation-history     prism-favorite-candidate     prism-record
prism-management             prism-context                prism-primitives
prism-panel-recipes          prism-position               prism-assessment
prism-collection             prism-notice                 prism-response
prism-management-tools       prism-candidate-list         prism-directory
prism-page-state             prism-domain-forms           prism-print
prism-intro                  prism-profile-sections       prism-mgmt-comments
prism-survey                 prism-attitude-report        prism-analysis
prism-position-recommendations prism-rich-text            prism-profile-print
prism-position-directory     prism-position-blocks
```

별도 기능 8개: `prism-tabs`, `prism-detail`, `prism-html-export`, `prism-detail-state`, `prism-admin-users`, `prism-position-management`, `prism-admin-lists`, `prism-chat-logs`. 이 중 HTML export 1개는 원본 프로필 출력의 추가 재사용 목표이고, 나머지 7개는 원본 파일을 단순 복제하는 것만으로 제공되지 않는 독립 사용 목적이다.

그룹별 완료 조건:

- 원본 대응표의 관련 UI 목적을 공개 props/상태/예제로 표현한다. 파일 하나에 대응표가 있다는 사실만으로 완료 처리하지 않는다. 배포 중인 UI를 디자인과 사용 목적의 기준으로 삼되, 접근성·반응형·크기 조절 또는 원본의 문제를 해결하는 변경은 이유와 결과를 기록하고 허용한다. 문제가 있는 형태까지 픽셀 단위로 재현할 필요는 없다.
- 해당 그룹에서 실제 제공하는 기본·로딩·빈 값·오류·읽기 전용·긴 내용·상호작용 등 적용 가능한 상태를 확인한다. 호스트 소유 API·권한·저장 로직의 범위는 명시하고, 의도한 디자인 일관성과 기능 목적을 배포 UI의 대표 흐름 및 독립 설치본에서 검증한다. 원본과 다른 부분은 의도한 개선인지 미구현인지 구분한다.
- 디자인 토큰, 아이콘, 글꼴, 반응형/크기 조절/dynamic sizing, 접근성, registry 설치·예제·빌드·CI/preview를 확인한다. 이는 개수에 더하지 않는 공통 완료 조건이다.
- 58개 모두 위 조건을 만족하고, 알려진 미검증·미구현 목적을 해소해야 goal 완료로 판정한다. 현재 58개가 catalog에 등록된 상태는 구현·시각 검증 완료를 뜻하지 않으므로 완료 분자와 비율은 별도 감사 전까지 발표하지 않는다.

원본에 새 독립 UI 목적이 추가되거나 배포 UI에서 현 58개로 표현할 수 없는 목적이 확인되면 대응표와 목표 수를 근거와 함께 개정한다. 원본 내부 파일 추가, 아이콘 추가, 같은 그룹의 상태 보완만으로 수를 자동 증가시키지 않는다. 현재 배포 SHA와 기준 소스 SHA의 동일성은 입증되지 않았다.

현재 진척도: 58개 대상 모두 catalog·독립 설치 모듈에 등록되어 있어 **코드·설치 항목은 58/58개**다. 그러나 기존 `verification.json`의 `partial`/`pending`은 이전의 원본 시각 일치 기준으로 작성됐으므로, 개선을 허용하는 새 완료 기준의 분자로 그대로 변환할 수 없다. 앞서 제시한 완료 확인 0/58은 철회한다. `prism-button`, `prism-badge`, `prism-field`, `prism-dialog`, `prism-feedback`, `prism-display`, `prism-candidate`, `prism-six-frame`, `prism-panel`, `prism-memo`, `prism-tabs`, `prism-selection`, `prism-profile`, `prism-profile-sections`, `prism-survey`, `prism-mgmt-comments`, `prism-attitude-report`, `prism-analysis`, `prism-position-recommendations`, `prism-response`, `prism-rich-text`, `prism-position`, `prism-position-directory`를 개별 재감사해 **완료 판정 23/58개**로 기록했다. 나머지 35개는 불합격이 아니라 아직 새 기준으로 판정하지 않은 그룹이다. 그룹별로 목적·디자인 일관성·의도한 개선·대표 상태·독립 설치 증거를 계속 판정해야 한다.

사이드바 후속 감사: 최신 원본 `dev`와 기존 인증 탭의 대표 치수를 대조하고, 독립 설치본에서 초기 메뉴 상태·프로필 액션 조건·접힘 후 메뉴 재확장·320px 스크롤을 보완했다. 기존 인증 탭에는 최신 원본의 포지션 목록이 표시되지 않았으며 새 세션은 로그인 화면으로 이동했다. 현재 배포의 최신 사이드바를 다시 확인하기 전까지 `prism-sidebar`는 완료 수에 넣지 않는다.

후보자 그룹 재감사: 배포된 공개 Templates 샘플의 1·2·5·6명 카드와 원본 프로필 묶음·표 코드를 대조했다. 설치용 후보자 묶음은 인원별 배치, 패널의 3명→2명 추가·접기, 선택·즐겨찾기 의도 전달을 제공한다. 320px 카드·표 내부 스크롤과 독립 shadcn 설치를 확인했다. 좁은 3열과 긴 이름 잘림은 의도적으로 개선했다. 인증된 제품의 실제 이동·저장 결과는 소비자 영역이며 미검증이다.

Six Frame 그룹 재감사: 공개 배포 샘플의 5명 기본 표와 2명 패널 표를 기준으로 여섯 행·그룹·고정 열·스크롤을 확인했다. 독립 설치본에는 원본 분석 표의 행 변환, 안전한 셀 서식과 프로필 클릭 의도, 패널의 동작 링크 제거를 반영했다. 320px 문서 폭 유지, 400px 패널, 빈 값과 8명 긴 표, 독립 소비자 설치를 검증해 `prism-six-frame`을 완료로 판정했다. 인증된 제품 이동 결과와 배포 소스 SHA 동일성은 확인하지 않았다.

패널 그룹 재감사: 공개 배포 SidePanel 샘플의 기본 440px·64px 헤더·확대·닫기 상태를 현재 독립 설치본과 대조했다. 설치본에서는 키보드·드래그 너비 변경, 240px 부모 축소 뒤 선호 너비 복구, 320px 긴 제목·내부 스크롤·초안 보존을 확인해 `prism-panel`을 완료로 판정했다. 인증된 업무별 패널 조합은 별도 `prism-panel-recipes` 그룹에서 계속 검증한다.

패널 조합 후속 검증: 원본 네 패널의 목적·본문 구조를 다시 확인하고 로컬 및 별도 설치본에서 메모 초안 이탈 확인, 취소 후 보존, 320px 메모 입력 접근, 긴 채팅의 하단 이동을 확인했다. 인증된 배포 `/chat`은 빈 루트여서 업무별 패널 대조가 아직 불가능하다. `prism-panel-recipes`는 부분 검증으로 기록했다. 문제 있는 원본 배치를 그대로 재현할 의무는 없으며, 변경 시 원본 목적과 개선 이유를 확인한다.

개인 메모 후속 감사: 배포 번들의 메모 CSS와 원본 비교 기록을 현재 `dev`의 변경 없는 메모 소스에 다시 대조했다. 현재 로컬·독립 설치본에서 기본·빈 값·로딩·오류·읽기 전용·긴 목록, 수정·삭제 확인·등록과 320px 내부 스크롤을 확인했다. 오류 상태에 남던 이전 건수를 숨기고 재시도 시 되돌리는 회귀 테스트를 추가했다. 인증된 배포 메모의 실제 서비스 흐름은 전체 제품 대조에 남겨두고 재사용 컴포넌트 목적의 `prism-memo`를 완료로 판정해 10/58개가 됐다.

탭 후속 감사: 현재 원본의 일반형·채움형 치수와 동적 상세 탭 닫기 목적을 확인했다. 독립 컴포넌트에 접근 가능한 형제 닫기 버튼과 포커스 복구를 추가했고, 320px에서 긴 탭 9개를 내부 스크롤하며 문서 폭을 유지했다. 별도 설치본의 닫기·포커스, 59개 원문 모듈·CSS, 예제 42개 타입 검사, Vite·폰트·고지 및 PRISM 테스트 316개가 통과했다. 인증된 배포 탭의 실제 흐름은 남겨두고 `prism-tabs`를 완료 판정해 11/58개가 됐다.

선택·날짜·페이지 그룹 후속 감사: 현재 원본의 검색·다중 선택·칩·체크박스·라디오·달력·기간·페이지 소스 목적을 확인했다. 다중 선택의 기본 검색창은 원본처럼 숨기고 선택적으로 열게 했으며, 열린 메뉴·달력이 읽기 전용/비활성으로 전환될 때 닫히고 미확정 날짜 입력을 버리도록 보완했다. 역전 기간 오류는 한 번만 표시하고 종료일 달력에서 시작일 전 날짜를 고르지 못하게 했다. 로컬 브라우저에서 다중 선택·칩 포커스 복귀·날짜 확정·페이지 이동과 320px 오류 상태의 넘침 없는 렌더를 확인했다. 별도 shadcn 설치본에서 320px 컨테이너의 동작, 59개 모듈·CSS 바이트 일치, 예제 43개 타입 검사, Vite·폰트·고지를 확인했다. PRISM 테스트 319개, workspace typecheck, site build, registry release check가 통과했다. 인증된 제품의 저장·조회 결과와 배포 소스 SHA 일치는 확인되지 않았다. 이 그룹을 완료로 판정해 **12/58개**, 미판정 46개로 기록한다.

프로필 그룹 후속 감사(2026-10-14): 현재 원본의 헤더·8개 탭·기본 정보 다중 값·경력 복수 역할·Design 현재 위치 매트릭스 목적을 다시 확인했다. 공개 배포 Candidate Common SUMMARY 원의 88×88px·10px 4px padding을 로컬·독립 설치본과 비교했다. 설치용 컴포넌트에 다중 값과 복수 역할을 구분해 표시하고, 의미 있는 행·열 머리글을 갖춘 위치 표를 추가했다. 문제 있는 원본의 시각적 형태까지 복제하지 않는다는 사용자 기준에 따라 좁은 화면의 내부 스크롤과 접근성 머리글을 개선으로 인정했다. 로딩 예시는 이전 섹션 데이터를 숨긴다. 로컬 320px에서 긴 값·로딩·읽기 전용·탭·툴팁·매트릭스를, 별도 설치본에서 탭·즐겨찾기·메모·인쇄 intent를 확인했다. 59개 모듈·CSS 바이트 일치, 예제 43개 타입 검사, Vite·폰트·고지, PRISM 테스트 321개, workspace typecheck, site build, release check가 통과했다. 인증된 배포 전체 프로필과 현재 소스 SHA의 연결은 입증하지 못했고, 실제 저장·인쇄 및 A4 페이지 분할은 호스트·별도 그룹 범위다. 재사용 프로필 컴포넌트 목적의 `prism-profile`을 완료 판정해 **13/58개**, 미판정 45개로 기록한다.

프로필 내부 섹션 후속 감사(2026-10-14): 최신 원본 8개 탭의 표시 목적과 기존 설치용 레시피를 대조하고 누락된 Survey, 성공경험 Essay·대표 영역·키워드·AI 인터뷰·실패 경험, Design 점수 Essay·회사/Function 다양성, Learning Agility 관련 경험을 추가했다. 종합의 빈 보상 행과 리더십의 빈 추이도 정리했다. 로컬 320px에서 8개 탭 및 기본·빈 값·로딩·오류·긴 내용의 폭과 재시도를 확인했다. 독립 설치본은 59개 모듈·CSS 바이트 일치, 예제 43개 타입 검사, Vite·폰트·고지와 영역 변경·Survey 0점·Design 내부 스크롤이 통과했다. PRISM 테스트 327개, workspace typecheck, site build, release check가 통과했다. 인증된 배포 전체 프로필과 배포 SHA 연결은 미확인이다. `prism-profile-sections`를 완료 판정해 **14/58개**, 미판정 44개로 기록한다. 상세 근거는 `prism-profile-sections-audit-2026-10-14.md`에 있다.

6 Frame Survey 후속 감사(2026-10-14): 현재 원본의 카드·막대·평균선·빈 결과·인쇄 스타일이 이전 비교 기준에서 변경되지 않았음을 확인했다. 기존 배포 CSS 샘플과 로컬 치수를 다시 대조하고, Leadership 제목 옆 Culture Survey 문서 액션을 독립 예제에 추가했다. 140px 긴 제목에서 액션 버튼이 16px 넘치던 문제는 180px 이하 줄바꿈으로 해결했다. 로컬 140px, 320px 가변 막대, 800px 인쇄, 빈 결과와 별도 설치본 140px을 확인했다. 독립 설치본의 59개 모듈·CSS 바이트 일치, 예제 43개 타입 검사, Vite·글꼴·고지, PRISM 테스트 327개, workspace typecheck, site build, release check가 통과했다. 인증된 배포 전체 프로필과 배포 SHA 연결은 미확인이다. `prism-survey`를 완료 판정해 **15/58개**, 미판정 43개로 기록한다. 상세 근거는 `prism-survey-audit-2026-10-14.md`에 있다.

CEO·ELP 코멘트 후속 감사(2026-10-14): 현재 원본의 4필드 작성·상세 조회·수정·삭제와 작성자 액션, ELP 읽기 전용 카드 목적을 확인했다. 원본 코멘트 UI 소스는 이전 대조 기준 이후 변경되지 않았고, 서비스 변경은 관련 요청 계약에 영향을 주지 않았다. 기존 배포 CSS 샘플의 카드·본문·액션 스타일과 로컬 구현을 다시 대조했다. 로컬 브라우저에서 320px 등록·수정·삭제, 140px 작성 양식, 기본·빈 값·로딩·오류·읽기 전용·긴 내용을 확인했다. 별도 shadcn 소비자에는 현재 registry로 재설치해 59개 모듈·CSS 바이트 일치, 예제 43개 타입 검사, Vite·Pretendard·고지를 확인했고, 실제 320px 설치본에서 합성 코멘트 등록과 넘침 없는 표시를 확인했다. 인증된 원본의 전체 상태와 실제 backend 저장·권한, 배포 SHA 연결은 미확인이다. `prism-mgmt-comments`를 새 기준으로 완료 판정해 **16/58개**, 미판정 42개로 기록한다. 상세 근거는 `prism-mgmt-comments-audit-2026-10-14.md`에 있다.

Attitude 진단·PDF 보고서 후속 감사(2026-10-14): 현재 원본의 SUMMARY·성격·가치관·Risk·Survey와 조건부 PDF 열람·다운로드 목적을 확인했다. 원본 Attitude UI 파일은 이전 대조 이후 변경되지 않았다. 진단 제목 옆 보고서 버튼이 원본의 파란 line 스타일 대신 중립색이었던 부분을 고쳤다. 로컬 브라우저에서 실제 합성 PDF 3페이지·텍스트 레이어, 페이지·배율, 320px 대화상자, HTML 응답 오류·재시도, 140px 긴 진단의 내부 차트 스크롤을 확인했다. 현재 registry를 설치한 별도 소비자는 59개 모듈과 CSS·PDF CSS 바이트 일치, 예제 43개 타입 검사, Vite·Pretendard·고지가 통과했고, 320px iframe에서 296px 보고서와 3페이지를 표시했다. 독립 설치본의 실제 다운로드 파일 4351바이트는 합성 원본과 SHA256이 같았다. 인증된 제품의 실제 PDF 권한·요청과 전체 화면의 배포 SHA 연결은 미확인이다. `prism-attitude-report`를 새 기준으로 완료 판정해 **17/58개**, 미판정 41개로 기록한다. 상세 근거는 `prism-attitude-report-audit-2026-10-14.md`에 있다.

프로필 분석 후속 감사(2026-10-14): 현재 원본의 리더 유형·6 Frame별 근거 목적과 이전 source-delta 변경을 재확인하고 catalog의 SCSS 대응을 보완했다. 로컬 문서와 별도 설치본의 320px 기본·140px 긴 내용·빈 값, tooltip·호스트 링크·패널 읽기 전용 표시를 확인했다. 독립 설치 59개 모듈/CSS 바이트, 43개 예제 타입 검사, Vite·Pretendard·고지가 통과했다. 인증된 배포 전체 프로필·배포 SHA·실제 이동 결과는 미확인이다. `prism-analysis`를 새 기준으로 완료 판정해 **18/58개**, 미판정 40개로 기록한다. 상세 근거는 `prism-analysis-audit-2026-10-14.md`에 있다.

추천 포지션 후속 감사(2026-10-14): 현재 원본의 카드·선택·더보기·400px 배치와 문서/설치본을 대조했다. 로컬 및 독립 설치 브라우저에서 320px 4→6→9개 표시, 400/401px 배치 경계, 140px 긴 근거, 빈 값·읽기 전용·키보드 선택, 같은 ID의 과거 버전 분리와 현재 운영본 링크를 확인했다. 좁은 화면에서 안내 수와 실제 추가 수가 다른 원본 동작은 일치하도록 개선했다. 59개 모듈/CSS 바이트, 43개 예제 타입 검사, Vite·Pretendard·고지도 통과했다. 인증된 배포 전체 추천 상태·배포 SHA·실제 조회/패널 결과는 미확인이다. `prism-position-recommendations`를 완료 판정해 **19/58개**, 미판정 39개로 기록한다. 상세 근거는 `prism-position-recommendations-audit-2026-10-14.md`에 있다.

대화 응답 후속 감사(2026-10-14): 현재 원본과 공개 배포 Templates 샘플을 기준으로 텍스트·기준 목록·블록 묶음·표·패널 목적을 확인했다. 로컬 및 별도 설치본의 320px 긴 표 내부 스크롤, 본문 LIVE 링크·패널 읽기 전용 링크, 기본·빈 값·생성 중·오류·긴 내용, 6 Frame 링크를 검증했다. 59개 모듈/CSS 바이트 일치, 43개 예제 타입 검사, Vite·Pretendard·고지가 통과했다. 인증된 제품의 실제 호스트 결과와 배포 SHA는 미확인이다. `prism-response`를 완료 판정해 **20/58개**, 미판정 38개로 기록한다. 상세 근거는 `prism-response-audit-2026-10-14.md`에 있다.

독립 서식 텍스트 후속 감사(2026-10-14): 현재 원본과 공개 배포 Markdown 샘플에서 제목·배지·강조·링크의 목적과 대표 색상/치수를 확인했다. 설치본에 빠진 제목 단축 태그와 11색 배지 디자인을 보완하고, 긴 제목·배지가 140px에서 넘치지 않도록 했다. 별도 설치본의 서식·패널 링크·문서 callback·실행 마크업 제거·빈 값·긴 내용을 확인했고, 59개 모듈/CSS 바이트 일치, 43개 예제 타입 검사, Vite·Pretendard·고지가 통과했다. 인증된 제품의 실제 호스트 결과와 배포 SHA는 미확인이다. `prism-rich-text`를 완료 판정해 **21/58개**, 미판정 37개로 기록한다. 상세 근거는 `prism-rich-text-audit-2026-10-14.md`에 있다.

포지션 상세 후속 감사(2026-10-14): 현재 원본의 기본 정보·정의·Business Context·두 요구사항 그룹·안내문 목적과 스타일을 대조했다. 한쪽 그룹 누락 시 다른 빈 그룹을 보완하고 200px 이하 긴 직책의 헤더 높이를 제한했다. 로컬/독립 설치 브라우저의 대표 상태와 320/140px 배치, 과거 버전/현재 운영본 합성 조회, 오류 재시도를 확인했다. 59개 모듈/CSS 바이트, 43개 예제 타입 검사, Vite·Pretendard·고지, 전체 331개 테스트가 통과했다. 인증된 배포 상세·실제 API·배포 SHA는 미확인이다. `prism-position`을 완료 판정해 **22/58개**, 미판정 36개로 기록한다. 상세 근거는 `prism-position-audit-2026-10-14.md`에 있다.

사용자 포지션 목록 후속 감사(2026-10-14): 현재 원본의 LIVE 필터·정렬·페이지·상세 탭 목적과 이전 인증 배포 기본 치수를 대조했다. 1280px 화면 속 320px 독립 부모에서 세 필터가 가로로 남던 문제를 container query로 고쳤고, 320→800px 크기 변경 시 초안을 유지하며 한 열→세 열로 재배치되는 것을 확인했다. 독립 설치본의 기본·로딩·재조회·빈 값·오류·긴 이름, 조회·상세 탭·재시도를 확인했고 59개 모듈/CSS 바이트, 43개 예제 타입 검사, Vite·Pretendard·고지가 통과했다. 현재 인앱 브라우저의 배포 `/chat/positions`는 빈 화면이어서 최신 인증 상세·LIVE 응답·배포 SHA는 미확인이다. `prism-position-directory`를 완료 판정해 **23/58개**, 미판정 35개로 기록한다. 상세 근거는 `prism-position-directory-goal-audit-2026-10-14.md`에 있다.

대화 입력·질문·판단 기준 후속 감사(2026-10-14): 현재 원본과 공개 배포 Templates 샘플에서 질문 복사와 기준 목록의 표시 목적을 확인했다. 설치본에 빠졌던 복사 동작·제목/강조·패널 서식을 보완하고 키보드·터치에서 복사 버튼을 찾을 수 있도록 했다. 로컬/독립 설치본의 기본·오류·로딩·패널·긴 내용, 320px 배치, Enter 전송·중단을 확인했다. 59개 모듈/CSS 바이트 일치, 44개 예제 타입 검사, Vite·Pretendard·고지, 전체 333개 테스트가 통과했다. 인앱 브라우저 가상 클립보드의 실제 복사 내용, 인증된 대화 API·배포 SHA는 미확인이다. `prism-chat`을 완료 판정해 **24/58개**, 미판정 34개로 기록한다. 상세 근거는 `prism-chat-goal-audit-2026-10-14.md`에 있다.

상세 drawer·선택 상태 후속 감사(2026-10-14): 공개 배포 비모달 SidePanel은 이미 완료된 `prism-panel`의 목적임을 확인하고, 추가 목표 `prism-detail`을 독립 모달 drawer·속성 목록으로 명확히 구분했다. 320px 긴 본문은 헤더를 고정한 채 내부 스크롤하고, 닫기·Escape 뒤 포커스가 열기 버튼으로 복귀한다. 180px 독립 부모의 목록은 세로 배치되며 null·0을 구분한다. `prism-detail-state`는 현재 원본의 배타적 선택·분류된 403/404 정리와 대조했고, 좁은 예제에서 가려지던 전환 버튼을 패널 밖으로 옮겼다. 독립 설치본에서 이전 요청의 403과 500은 현재 상세를 유지하고 현재 404는 패널 DOM을 제거했다. 59개 모듈/CSS 바이트 일치, 완전 예제 45개 타입 검사가 통과했다. 실제 인증 API와 배포 SHA는 미확인이다. 두 그룹을 완료 판정해 **26/58개**, 미판정 32개로 기록한다. 상세 근거는 `prism-detail-groups-goal-audit-2026-10-14.md`에 있다.
