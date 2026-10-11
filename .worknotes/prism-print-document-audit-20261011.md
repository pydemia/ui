# 원본 프로필 인쇄 문서 조합 대조

2026-10-11, frontend `087811ff` 기준입니다. mapComprehensiveProfileToPrintPreview.ts 전체513행, CandidateProfilePrintPreview.tsx의 import/types(1–175)와 본문(221–347), PrintPage.tsx/.scss, PrintLeaderSummary.tsx와 preview.scss를 읽었습니다. 인쇄 session/portal/HTML-export wrapper의 나머지 전체 코드는 이번 범위에서 다시 검토하지 않았습니다. kit prism-print.tsx와 인쇄 관련 CSS·공개 export/호출을 검색해 비교했습니다. 실제 인쇄나 전체 시각 검증은 아닙니다.

원본 문서는 종합·전문성·성공경험·Design 역량·Learning Agility·Attitude·Leadership의7분류를 모두 인쇄합니다. summary/compensation 옵션은 종합의 해당 부분만 제어하고 나머지6분류를 제거하지 않습니다. 종합은 프로필/탭/리더 summary/기본정보/경력/보상을 조합하고, 경력이 나뉘면 마지막 continuation에 보상을 둡니다. 전문성은 summary/분야/Survey, 성공경험은 모든 topic의Essay와실패Essay, Design은grade/Essay/Survey/다양성,Learning은grade/Essay/Survey/경험,Attitude는summary/진단/Risk/Survey,Leadership은pie/Survey/강점·개선/Trend입니다.

현재 kit는 인쇄 페이지/리더 summary/경력/Risk/성공경험 primitive와 범용 section 선택·PDF/ZIP/HTML 엔진을 제공합니다. 화면별 도메인 component는 있지만7분류 전체를 원본 순서/정적 탭/종합 continuation으로 묶는 독립 typed 프로필 인쇄 문서 recipe가 없습니다. 단순한 PrintDemo/합성 PDF/호스트가 제공한 임의 section이 성공한 근거는 이 전체 문서 조합의 완료를 대신하지 않습니다. 다음 구현은 서비스 DTO 변환을 호스트에 남기면서 표시 모델과 문서 조합을 명시해야 합니다.

원본 탭은7개/height20pt/gap6pt/8pt radius/10pt500·active600/분류본문gap12pt입니다. PrintPage는190mm×280mm와header/body12pt 간격입니다. 종합은fixed height/overflow hidden, 나머지는table thead 반복·height auto/min280mm입니다. kit는190mm/min280mm와thead 반복은 제공하지만 전체 탭과 문서 조합이 없고 종합의고정크기·본문overflow/continuation 보장 및 sourcefont/style 대조가 남아 있습니다. 반응형 미리보기에서는 내부 paper scroll/가변보기 배율을 지원하면서 실제 인쇄 규격을 별도로 유지해야 합니다.

원본 pagination은summary/기본정보 높이·경력의회사/설명 길이와최종보상영역 reserve를 추정하며,보상이안들어가면빈career page를추가합니다. 최종문자limit은expertise350,grade350,Essay300,Attitude70/250/300/300,Leadership100/350입니다. 실제데이터의0/누락·trim·원문을변경하는도메인규칙과인쇄용표시제한은구분해야 합니다. source mapEssayItems가null score/max를0으로 만드는코드를 그대로평가계약에옮기지 않습니다. 새recipe의누락은null/정보없음으로보존하고,텍스트축약은명시적print policy와원문보존·표시안내/전체출력선택을지원하도록설계합니다.

다음 검증 범위는7분류/옵션4조합·0/긴 경력/보상추가page·topic별성공경험/실패/대표interview·모든null/실제0·표/차트·다인문서·반응형preview/독립HTML·PDF/ZIP입니다. 원본 공개sample/인증된 실제profile·전체page pixel/font/overflow/누락/반복헤더를비교해야 합니다. CUA가 제공되지 않는 동안 typed 조합과 source 계약·순서·내용검사를진행할수있지만 native print/브라우저render를테스트로대체해완료를주장하지않습니다. Goal active입니다.

## 7분류 문서 구현과 내용 검증

PrismProfilePrintModel/Document/Documents/Viewport를 추가했습니다. 종합 options4조합에서도 나머지6분류를 유지하고 전체 topic·대표 우선순서/인터뷰·실패를 포함합니다. 원본topic index에서 빠진 실제essay도 추가해 누락을 막습니다. 호스트careerPages의ID중복/전체순서를검사하며,생략하면source상수에따른추정페이지를만듭니다. 종합마지막에보상을두고6분류/continuation에thead머리말과정적7탭을적용합니다. 실제자동인쇄/API/HR평가는실행하지않습니다.

설명은기본full이며reference-limits는영향받는표시필드를복사하고Unicode코드포인트를유지해축약합니다. 원문은변경하지않고축약안내를표시합니다. 점수/최댓값null과0은다르게표시합니다. 긴본문을숨기지않으므로원본fixed/hidden과달리min-height/visible을사용합니다. 실제row height/글꼴/브라우저단위pagination은추정으로완료를주장하지않습니다. 회사logo는정적host slot입니다.

SourcePrintLeaderSummary/PrintCareerTimeline/PrintSuccessExperienceEssay·ScoreEssay/ExpertiseField/FavoriteProfile/AttitudeDiagnosis의관련SCSS를추가로대조했습니다.70pt badge/140pt영역/94pt minimum·Neutral300#B6BEC9,경력11pt/130pt/continuation marker,photo80pt/10pt,성공경험18pttopic/15ptchip/8ptgap/8pt인터뷰,Essay86pt/Survey65px·118pt와탭20pt/10pt/8pt/6pt를stylesheet에반영했습니다. 190mm paper에별도named container를정의해좁은preview의명명된query가paper안의summary를모바일column으로바꾸지않도록했습니다. 값은source정의이며target browser computed measurement는아직없습니다.

SSR/JSDOM 내용 검사8개와전체123tests,49그룹/26완전예시 타입검사가통과했습니다. 검사범위는7분류순서/옵션4조합·career 보존/마지막보상·추정60행/빈보상page·전체topic/실패/대표·null score/max/0보상/0.0Survey/현재Matrix위치·Unicode축약/원문불변·emptySUMMARY제목/단계주석·다인ID구분입니다. SSR내용을실제페이지분할·인쇄시각근거로확대하지않습니다.

이전consumer-tpmsik/package.json이없어재사용검사가실패했습니다. 새consumer-UAveFJ에50항목/75파일을fresh설치했고26예시/인쇄진입점TypeScript/Vite·폰트SHA256·고지가통과했습니다. 마지막paper container CSS는emitted registry로재설치했으며installed component는손으로편집하지않았습니다. browser/native print/A4 PDF/HTML/ZIP의새문서통합은미검증입니다. Source/lock/deps/dist·실패/성공로그를보존합니다.

Plugin Management Skill로 browser/computer-use 및unified-computer-use를읽기전용검색했습니다. 현재local CUA를복구하는연결은확인되지않았습니다. 반환된Opera/TinyFish등은미설치이며localhost/현재local account검증을바로해결하는것으로판단하지않았습니다. 설치·권한변경·연결·브라우저재시작·credential추출은하지않았습니다. 전체172개정의상태의current browser검증은0이며historical159/후속22와구분합니다. Goal active입니다.

### 2026-10-11 내장 브라우저 재연결 확인

- 이번 사용자 질문 뒤 CUA가 다시 제공됐고 내장 브라우저4에서 새 탭/공식 문서/로컬 PRISM 문서를 실제로 열어 읽었습니다. 이전 ChatGPT 플러그인 조회만으로 로컬 Codex 브라우저 복구 수단을 판단한 설명은 근거가 부족했습니다. 연결 가용성이 바뀐 원인은 확인하지 못했습니다. 별도 설치·권한 변경·Mac 잠금 해제를 수행하지 않았습니다.
- 현재 head0e73730a에서49그룹/172개 고유 정의 상태를 실제320px iframe으로 다시 검사했습니다. 각 root clientWidth/scrollWidth320,중첩 button0,노출된 native input/select/textarea의 label 부재0이며 실제 수집한 warning/error 로그도 빈 배열입니다. aria-hidden 내부 select는 접근성 노출 검사에서 제외했습니다. 정의 상태 렌더 검사가 전체 동작·원본 UI 동일성 완료를 뜻하지 않습니다. 개별172행은 browser-evidence/browser-recovery-172.csv에 있습니다.
- 인쇄 문서7분류의 default/empty/long이320px에 들어갑니다. 기본 문서 paper/viewport288px,자동zoom0.4010526316입니다. 직접 embed 화면에서SUMMARY/보상4조합을 클릭해 종합의 해당 영역만 바뀌고7분류가 유지됨을 확인했습니다. 수동20/80/200%에서paper143.609375/574.484375/1436.21875px이고root overflow는없었습니다. native 양축drag로1248×800→988×894→508×964를 확인했으며508px에서autozoom0.7074122807/paper508px입니다.
- iframe 체크박스 자동화는 상태를 바꾸지 못했고 일부 시점에iframe이상단화면밖에있었습니다. 직접 embed의동일옵션성공과구분하며정확한자동화실패원인은미확정입니다. 새스크린샷은CUA에서실제확인했지만로컬이미지파일로저장하지않았습니다. A4 PDF/native print·전체긴문서pagination·원본font/pixel비교는미완료입니다.
- consumer-UAveFJ의독립빌드도실제320px iframe에서7분류/scrollWidth320·paper296/viewport296·zoom0.4121929825·중첩button0·실제warning/error로그빈배열을확인했습니다. 설치component source는수정하지않았습니다. 전체50항목의모든동작을consumer에서검증한것으로확대하지않습니다.
- 인쇄source b257b083/generated0e73730a의원격head를API로확인했고draftPR162 title Add typed PRISM profile print documents and current recipes/base main/정확한head를갱신·readback·재첨부했습니다. Verify UI38120810133 completed/success와VercelDgoV8kAmxDXGku4HHA1NY1ixg15t success입니다. preview HTTP/production완료를주장하지않습니다. 이후의browser/CI기록은local worknote이며goal active입니다.

- 정리: 이번검증용63150(pid93857)/63225(pid98766)의명령·cwd를확인한뒤해당서버만종료했습니다. 자체내장탭1/2를닫았고사용자탭·계정/권한설정은변경하지않았습니다. 소비자source/lock/deps/dist와측정자료를보존했습니다. 구성/생성물은새로변경하지않아동일head의성공한CI를다시실행하지않았습니다. 다음은7분류출력의실제PDF/HTML/ZIP통합과원본인증UI/전체font/pixel대조입니다.

- 서버종료후실제terminal exit143을확인했습니다. dev Vite에는기존public/prism/components.json import와큰번들Babel 경고가있었습니다. 위warning/error 빈배열은브라우저tab.dev.logs의수집범위이며terminal 경고까지없다는뜻이아닙니다. 독립production consumer의브라우저검사는별도로성공했습니다.


### 2026-10-11 실제 7분류 PDF·HTML·ZIP 통합

직전 사용자 질문 turn은 현재 IAB 연결과 실제 페이지 읽기를 확인한 진척입니다. 이번에는 base 0e73730a의 미커밋 변경을 검토하고 실제 출력 경로를 검증했습니다. 전체 goal을 축소하거나 완료로 판단하지 않습니다.

- createPrismPrintPdf/planPrismPrintPdfPage와 renderPrismProfilePdf를 구현했습니다. 실제 font/image 준비 뒤 190×280mm 영역에 맞춘 A4 캡처, 반복 머리말/탭, 글줄·작은 카드 경계 회피, 긴 카드의 필수 분할 보고, AbortSignal/진행률/capture override를 제공합니다. 임시 React 문서·범위 캔버스·작업 소유 iframe container를 정리합니다. html2canvas-pro 2.4.3은 원본 frontend와 같은 버전으로 지연 로드하며 MIT 고지를 추가했습니다. 폰트 CSS의 실제 적용은 별도 검증 사항입니다.
- 긴 문서에서 종합 continuation 머리말 누락과 Leadership 추이 제목의 단독 페이지 배치를 발견해 수정했습니다. 첫 페이지의 프로필/탭 순서는 유지하고 후속 페이지에는 표시한 머리말과 탭 영역만 복사합니다. 실제 긴 문서는 21쪽/9,544,849bytes이고 A4 595.28×841.89pt 및 1/21…21/21 쪽 번호를 파싱했습니다. 전체 contact sheet와 2/3·17/18쪽을 렌더해 읽었습니다. oversized Attitude 카드 1곳은 분할되지만 글줄을 보존합니다. 모든 원본 문서 길이의 시각 검증은 아닙니다.
- 후보 두 명의 전체 문서 ZIP은 2,554,954bytes, CRC 정상이며 각 9쪽 PDF/파일명/title/쪽 번호/A4 규격을 확인했습니다. 첫 후보 9쪽 raster를 검토했습니다. 목록 준비를 대기시킨 뒤 목록을 unmount하고 준비를 계속해 실제 PDF 0/2→ZIP 다운로드 시작을 확인했습니다. 부분 파일과 임시 capture/frame이 남지 않았습니다.
- HTML은 7분류/경력3/경험2/실패·인터뷰/실제0·null 구분과 SVG3개를 보존합니다. 외부 asset URL/실행 script0이고 실제 IAB에서 loaded Pretendard Variable·718.109375px paper와 오류 로그0을 확인했습니다. JSDOM은 @layer CSS를 파싱하지 못했으므로 그 경고를 browser CSS failure로 해석하지 않았습니다. SVG의 encoded local fragment를 외부 URL로 세었던 검사도 정정했습니다.
- 실제 긴 생성 취소 결과는 partial file0/capture root0/owned frame0/html2canvas iframe0입니다. 이전 html2canvas iframe 잔류를 작업 소유 container/finally 정리로 수정했습니다. 짧은 문서 취소 시도는 버튼을 누르기 전에 완료됐으므로 취소 성공 근거에서 제외했습니다.
- consumer-UAveFJ에 50항목/26완전예시를 다시 설치해 TypeScript/Vite/폰트SHA/고지가 통과했습니다. 설치 source는 손으로 편집하지 않았으며 entry HTML만 추가했습니다. 실제 7쪽 PDF/HTML과 두7쪽 PDF의 ZIP(CRC 정상), 두 프로필/14분류 inline preview가 확인됐습니다. 최종 모달·탭 수정 registry의 consumer 재설치는 후속 단계입니다.
- 준비 안내와 호스트 미리보기 모달이 동시에 열려 두 모달 모두 aria-hidden=true가 되는 실제 문제를 확인했습니다. 인쇄 준비가 성공하면 준비 안내를 닫도록 수정했습니다. 회귀 test와 실제 CUA에서 후보2명/14분류의 미리보기 하나만 aria-hidden 없이 접근 가능한 것을 확인했습니다. 다운로드 안내의 계약은 유지했습니다. Native window.print의 전체 앱 격리/OS dialog는 아직 검증하지 않았습니다.
- testuser001 인증 세션으로 원본 dev.prism.ai 후보자 목록/상세 8개 탭을 읽었습니다. 800px에서 원본과 target 탭의 26px/37px/10px/8px/4px와 색·내용에 따른 flex 너비를 맞췄습니다(최대 차이0.03125px). #868686였던 비활성 글자 색, 8등분 grid, 일반 underline tab의 -1px margin 상속을 수정했습니다. 원본 hover 상태를 기본 비활성 상태와 구분했습니다. 원본 배포 SHA는 관찰 UI에 없어 로컬087811ff와 동일하다고 추정하지 않습니다. 실사용자 프로필 내용/사진은 공개 문서에 옮기지 않았습니다.
- 전체130tests/49그룹/26예시 및 actual320px 172고유상태가 통과했습니다. 실제 너비를 확인하기 전의 1280px 관찰과 혼합 누적 결과는320 tally에서 제외했고 공유 session 객체로 새 결과를 수집했습니다. 최종 print-final-172-layout.json/CSV는 각 DOM 표식·실측폭·overflow/중첩button/보이는 native label·수집 로그를 기록합니다. source SHA256 0d0ddc7ff753fc38210a3f2cd7c6a2b60fb118e17c9f49a30cb0330098e2394e입니다.
- 브라우저 연결 ID가 변경됐을 때 기존 진행 결과가 살아 있는 것을 확인하고 새 binding으로 같은 탭에 재연결했습니다. PDF 관찰 timeout을 작업 종료로 판단해 재시작하지 않았습니다. 일부 HMR 동안 진행 상태가 unmount/reset된 시도는 출력 성공 근거에서 제외했습니다. 큰 DOM evaluate 문자열은 잘리는 것이 확인돼 파일 링크는 getAttribute로 전체를 읽고 1MB씩 로컬 기록 양식으로 보존했습니다. OS 저장 완료나 downloadMedia 성공을 주장하지 않습니다.

근거는 .worknotes/browser-evidence/print-full-long-headers.pdf, print-full-two-candidates.zip, print-full-default.html, print-consumer-profile.pdf/html, print-consumer-candidates.zip과 각 JSON/PNG입니다. 원본 전체 페이지·상태/인증 출력·photo/font/pixel·native print/OS save가 남아 있으며 goal active입니다. 다음 단계는 최종 registry consumer 재설치·표준 build/generic 보존 검사, source/generated 분리 commit, 승인된 draft PR 갱신/readback/정확한 head CI입니다.

- 최종 후속 검증: 모달·탭 수정 registry를 consumer-UAveFJ에 다시 설치해26예시 TypeScript/Vite/폰트SHA/고지를 통과했습니다. supporting entry만 추가했으며 installed component는 직접 수정하지 않았습니다. 실제 소비자 모달 하나에 두프로필/14분류가 aria-hidden 없이 나타났고800px 상세 탭의26px/37px·색/flex너비도 원본과 맞았습니다(max0.03125px). Input.dispatchMouseEvent 관찰timeout 뒤 같은 탭을 읽어 이미 완료된 상태임을 확인했으며 출력요청을 다시 실행하지 않았습니다. 원본 사용자 탭은 /chat으로 복원했습니다. frontend fetch 뒤 HEAD=origin/dev087811ff, origin/main288b0838가 유지됐고 typecheck/site build/generic snapshot25ca4393가 통과했습니다.
