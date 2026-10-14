# Attitude 진단·PDF 보고서 그룹 재감사 (2026-10-14)

대상은 58개 목표 중 `prism-attitude-report` 한 그룹이다. `prism/frontend`의 `dev`와 `origin/dev`는 `2eeb26ff10274745f9d86897c2f2828bff002b98`로 일치하고 작업 트리는 깨끗했다. `SuccessorCandidateAttitude`, `AttitudeDiagnosis`, `PdfViewerDialog`, `AttitudeSummary`, `AttitudeDerailmentRisk` 및 해당 SCSS는 이전 비교 기준 `087811ffba678ece20ee00b1c3c5d117a1d3d323` 이후 변경되지 않았다. 공개 배포 CSS에서 수집한 진단·PDF 규칙은 `browser-evidence/attitude-deployed-css.json`에 있다. 이 CSS 샘플을 현재 인증된 전체 프로필의 배포 SHA로 취급하지 않는다.

원본 목적은 SUMMARY, Big 5 성격 radar와 해석, 0보다 큰 가치관 비중, 잠재·발현 Risk, 2/3열 Survey, URL이 있을 때 진단 제목 오른쪽의 심리적강인함 PDF 버튼과 보고서 열람·다운로드다. 설치용 `PrismAttitudeReport`는 이 표시 목적을 typed props와 `PrismPdfDialog`로 조합한다. PDF 전체 바이트와 `%PDF` 검사, 문서·대상 변경 취소, 텍스트 레이어, 연속 페이지, 페이지·배율·너비 맞춤을 제공한다. URL 해석, 인증 요청·fallback, 평가 데이터와 권한은 호스트가 소유한다. 원본의 1200px/90vh 보고서, 46/64px 입력과 14px 글꼴을 유지하면서 좁은 화면의 차트 내부 스크롤과 대화상자 크기 조절을 지원한다.

이번 감사에서 보고서 버튼이 `PrismButton variant="line"`의 기본 중립색으로 표시되는 차이를 발견했다. 원본 `HRXBtn variant="line" color="primary"`에 맞춰 `tone="primary"`를 지정했다. 로컬 브라우저의 버튼은 높이 28px, 글자·테두리 모두 `rgb(47, 84, 140)`이었다. 320px 진단은 scrollWidth 320px, 140px 긴 진단은 scrollWidth 140px이고 180px radar는 106px 내부 차트 영역에서 스크롤한다. 빈 값에는 보고서 버튼이 없고 SUMMARY·Risk의 빈 상태가 표시됐다. 긴 내용은 줄바꿈된다.

로컬 브라우저에서 합성 PDF는 3페이지·3 canvas·3 text layer로 렌더됐다. 페이지 입력 2와 배율 입력 67 뒤 확대는 70%로 반영됐다. 320×400px로 지정한 대화상자는 폭과 scrollWidth가 모두 320px이며 46/64px 필드는 Pretendard Variable 14px이었다. 첫 요청을 HTML로 바꾼 상태에서는 PDF 형식 오류를 표시했고 `다시 시도` 후 3페이지로 복귀했다. 기존 계약 테스트는 보고서 URL/대상 변경 시 닫기·AbortSignal, 늦은 완료 무시, 다운로드 중복 방지와 실패 재시도를 확인한다. 이번 수정 후 PDF 계약 테스트 11개가 통과했다.

현재 registry의 `prism-attitude-report`와 토큰을 별도 shadcn 소비자에 다시 설치했다. 59개 설치 모듈 소스, 토큰 CSS와 PDF CSS가 생성본과 바이트 단위로 일치했다. 완전 예제 43개 타입 검사, Vite 빌드, Pretendard 글꼴 바이트와 자산 고지가 통과했다. 설치 소스는 수정하지 않았다. 독립 예제에서 파란 보고서 버튼과 320px 진단을 확인했고, 실제 320px iframe에서는 PDF 대화상자 폭·scrollWidth·viewport가 296px, 페이지와 text layer가 각각 3개였다. 독립 설치본의 기본 다운로드가 만든 `가상 보고서.pdf` 4351바이트는 합성 fixture의 SHA256 `02600e0d63ba48ef087d477a53f4cc665e1bf680ce9471ff9827db89f6baeee4`와 일치했다. 검증 직후 생성한 다운로드 파일은 지웠다. 직접 연 독립 예제에는 수집된 console error가 없었다. iframe 셸에서만 발생한 MutationObserver 오류는 PDF 동작 전에 발생했으며 빈 iframe 셸에서도 재현돼 이 컴포넌트 오류로 계상하지 않았다.

전체 검증에서 `npm run prism:check`의 327개 테스트, `npm run typecheck`, `npm run build`, `npm run registry:release-check`가 모두 통과했다. 생성된 registry·문서 사이트의 Attitude 코드와 판정 기록은 빌드 산출물에 반영했다.

현재 원본 목적, 선택된 배포 CSS, 로컬·독립 설치본의 디자인·상태·상호작용·다운로드를 확인해 `prism-attitude-report`를 새 기준으로 완료 판정한다. 전체 진척도는 **17/58개**, 미판정 41개다. 인증된 원본 Attitude/PDF 전체 상태, 배포 소스 SHA 연결, 실제 backend 권한·요청·캐시와 OS의 일반 인쇄 동작은 이 판정의 증거가 아니다. 원본 Chart.js의 모든 좌표·모션과 설치용 SVG의 픽셀 일치는 요구하지 않지만 대표 크기·색·정보 구조와 기능 목적을 유지해야 한다.
