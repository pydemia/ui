# PRISM 검증 기록

기존 관찰 기준은 dev `7ecfc9af072d9f4aeb0f4d7706f16bd1a73f2ef9` (2026-10-03)이며 최신 source audit는 `087811ff` (2026-10-09)입니다. 현재 원본 inventory 273개에 기능 목적 대응을 기록했습니다. 미대응 항목 0개는 전체 스타일·상태 일치의 완료를 의미하지 않습니다. 43개 typed 그룹과 토큰을 포함한 44개 registry 항목을 제공합니다. 아래 과거 관찰과 최신 추가 검증의 범위를 구분합니다.

## 근거와 범위

- frontend를 fetch·fast-forward했고 local dev와 origin/dev의 동일 revision 및 clean 상태를 확인했습니다.
- 로그인된 Chrome의 testuser001 화면에서 Pretendard, 주요 색상과 새 대화 버튼 40px/8px/14px를 확인했습니다.
- 자체 브라우저에서 원본 공개 `/sample`의 37개 기본 화면을 관찰했습니다. 저장된 기본 AX·computed style·JPEG는 열린 메뉴와 모든 상태의 비교를 대신하지 않습니다.
- 38개 typed source group과 토큰을 포함한 39개 registry 항목을 구성했습니다. 원본 269개 항목의 대응 관계는 기능 목적별 매핑이며 시각 일치율이 아닙니다.
- 원본 벡터 87개의 권리 고지와 revision을 보존했습니다. 174개 SVG 동시 렌더의 ID·내부 참조 검사와 모든 배치·색상 비교는 구분합니다.

## 브라우저 동작

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
