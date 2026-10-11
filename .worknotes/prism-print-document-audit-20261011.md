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
