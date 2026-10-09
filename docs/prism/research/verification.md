# PRISM 검증 기록

기존 구현·관찰 기준: dev `7ecfc9af072d9f4aeb0f4d7706f16bd1a73f2ef9`, 2026-10-03. 2026-10-09에 frontend를 fetch·fast-forward해 `087811ff`를 확인했습니다. 현재 inventory 273개 중 새 컴포넌트 4개는 구현 대기입니다. 전체 원본 스타일·상태 일치는 아직 확인하지 않았습니다.

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

최신 frontend는 LeadershipPie, LeadershipPieSummary, CandidateProfilesPdfDownload, PdfDownloadHost를 추가했습니다. 기존269개 목적 대응에 이 네 가지의 구현이 포함됐다고 표시하지 않습니다. 사용자·회사 그룹 양식, Memo, PDF, 프로필 영역의 변경과 `_dialog.scss`·`_print.scss`·`_text-field.scss` 차이도 후속 비교가 필요합니다. InputLabel과 Tooltip의 소스·SCSS는 두 revision에서 동일했습니다. 이 checkout revision이 현재 배포 revision과 같다는 근거는 확보하지 않았습니다.

포커스로 화면 밖의 정보 버튼을 스크롤하면 Radix의 ancestor-scroll 닫기가 열림과 겹쳤습니다. 다음 animation frame에 포커스 도움말을 열고 Escape·blur·unmount는 대기 중 열림을 취소하도록 보완했습니다. 문서의 실제320×240 long 도움말은300×90.1875px이며 native wheel scrollTop230을 확인했습니다. 최신120상태의320px 렌더·가로 넘침·중첩 버튼·입력 이름·page error 검사도0문제입니다. 이 기록은 현재 소스의 공개 반영 전에 작성했으며 원격 결과는 세션 worknote에서 갱신합니다.
