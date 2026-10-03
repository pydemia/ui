# PRISM 검증 기록

기준 소스: dev `7ecfc9af072d9f4aeb0f4d7706f16bd1a73f2ef9`. 관찰일: 2026-10-03. 전체 원본 스타일·상태 일치는 아직 확인하지 않았습니다.

## 근거와 범위

- frontend를 fetch·fast-forward했고 local dev와 origin/dev의 동일 revision 및 clean 상태를 확인했습니다.
- 로그인된 Chrome의 testuser001 화면에서 Pretendard, 주요 색상과 새 대화 버튼 40px/8px/14px를 확인했습니다.
- 자체 브라우저에서 원본 공개 `/sample`의 37개 기본 화면을 관찰했습니다. 저장된 기본 AX·computed style·JPEG는 열린 메뉴와 모든 상태의 비교를 대신하지 않습니다.
- 38개 typed source group과 토큰을 포함한 39개 registry 항목을 구성했습니다. 원본 269개 항목의 대응 관계는 기능 목적별 매핑이며 시각 일치율이 아닙니다.
- 원본 벡터 87개의 권리 고지와 revision을 보존했습니다. 174개 SVG 동시 렌더의 ID·내부 참조 검사와 모든 배치·색상 비교는 구분합니다.

## 브라우저 동작

현재 수정본은 `73be258`의 폰트·인쇄 변경입니다. IAB 연결은 없지만 `agent-browser 0.38.2`와 설치된 별도 headless Chromium으로 검증했습니다. 기존 Chrome 프로필과 로그인을 사용하거나 변경하지 않았으며 Mac 잠금도 해제하지 않았습니다.

| 범위 | 확인한 결과 | 남은 범위 |
| --- | --- | --- |
| 최신 fixture | 실제 320px viewport에서 38그룹·117상태 렌더, 누락·중첩 버튼·페이지 가로 넘침·표시 입력 이름 누락·수집된 page error 0건 | 원본 상태별 시각 비교와 모든 상호작용 |
| 폰트 | 문서·embedded preview의 `Pretendard Variable` face가 실제 loaded 상태이며 해당 family를 사용 | 원본 static font와 모든 글자 폭 비교 |
| Avatar | 140px에서 자연 배치·이름/팀/양쪽 축약, 짧은 라벨 보존, 잘린 라벨의 focus/hover 도움말, Escape·확장 후 닫기, 재축약만으로 다시 열리지 않음 | 원본 길이·폭 조합, chip/table의 모든 상태 |
| Toast | 폰트 수정본의 320px 화면에서 body 6px/content 4px gap, 20px 닫기 버튼, 닫기 후 제거 | 원본 tone·긴 내용·배치 조합 |
| Usage | Registry/Workspace 전환 시 표시 코드가 manifest의 해당 코드와 일치 | 실제 clipboard write는 실행하지 않음 |
| 인쇄 페이지 | Chromium Letter PDF: 짧은 예시 1장, 긴 예시 2장, 양쪽 머리말 반복, 가상 경력 36개 중복·누락 없음. 렌더한 PDF 페이지도 확인 | 원본 비교·다른 용지/여백·native print dialog·긴 Essay 분할 |
| 선택 입력 | 기존 IAB에서 방향키·Enter, 다중 선택 Space/칩 제거, 3글자 검색 조건, 포커스 복귀, 날짜 오류 거부, 페이지 변경 | 크기·disabled/readOnly·검색·전체 선택의 모든 조합 |
| 관리자 양식 | 기존 IAB에서 전체 회사의 회사 입력 비활성화, 게시기간 필수, 팝업 OFF 시 날짜 null, 역할별 그룹 해제, 선택 제한과 저장 의도 | 원본 관리자 화면 비교 |
| 공지·방침 | 기존 IAB에서 비모달 다음 공지, 버전 변경·높이 안정화, script 없는 iframe sandbox | 목록·오류·긴 문서 |
| 프로필·PDF·Workspace | 기존 IAB에서 8개 분류, 경험 전환·의견 저장, 실제 PDF 2페이지·200% 내부 스크롤·320/390/1024px fit, 패널 드래그/키보드, Drawer 전환·draft 보존 | 원본 도메인·shell 및 모든 popup/long 조합 |
| 파일 | 기존 IAB에서 가상 PDF 선택과 attachment tile | 삭제·거부·drag/drop |

폰트 파일은 이미 포함되어 있었지만 문서·embedded preview·차트가 face 이름과 다른 `Pretendard`를 지정해 대체 폰트를 사용했습니다. `--font-ui`의 `Pretendard Variable`을 사용하도록 수정했습니다. 파일 다운로드나 `document.fonts.check()`만으로는 해당 폰트의 실제 사용을 확인할 수 없습니다.

인쇄 화면의 최소 280mm 높이가 짧은 Letter PDF에 빈 두 번째 페이지를 만들었습니다. 화면의 190mm 폭·최소 280mm 규격은 유지하고 print media에서 최소 높이를 해제했습니다. 긴 경력 fixture를 추가해 머리말 반복과 전체 행의 출력을 확인했습니다. 인쇄 실행과 용지·여백은 호스트가 소유합니다.

## 빌드와 독립 설치

원격 SankeyChart까지 반영한 `b5ccface` 기준에서 전체 build·TypeScript·PRISM 계약 25개·일반 UI 테스트 260개를 통과했습니다. 일반 registry 144개·catalog 142개·불변 release 73개와 현재 snapshot `sha256-9bf65f08c6e3daa55815c07059472e3b3fbf73651f55169bbbc23398927e88d0` 검증을 통과했습니다. 이후 폰트·인쇄 변경의 전체 build, 문서 TypeScript와 PRISM 예시 계약 검사도 통과했습니다.

38그룹 모두 설치용 import와 typed contract를 제공합니다. 완전한 React 예시는 11개, 소비자 데이터·상태·callback이 필요한 연동 코드 일부는 27개입니다. workspace 예시 타입 검사와 설치 의존성 내 import 검사를 기존 CI에서 실행합니다.

공개 Avatar release `ff1f27a`에서 `node scripts/verify-prism-consumer.mjs --public`으로 39항목·62파일을 독립 설치하고 11예시 타입 검사·Vite·폰트 bytes·자산 고지를 확인했습니다. 최신 폰트/인쇄 CSS를 해당 소비자에 registry bytes 그대로 동기화한 뒤 TypeScript/Vite와 폰트 bytes를 다시 확인했습니다. 이 후속 검사는 새 shadcn 설치가 아닙니다. 소비자는 모든 설치 소스를 컴파일하며 렌더 demo는 Button입니다.

`ff1f27a`의 GitHub Verify UI·Pages와 Vercel 배포는 통과했습니다. 당시 `/prism`, manifest·registry·폰트의 HTTP bytes도 확인했습니다. 폰트·인쇄 수정의 공개 commit `dd49ecbe`는 Verify UI run37098604514·Pages·Vercel이 모두 통과했습니다. 현재 manifest·registry의 HTTP bytes가 로컬과 일치하며 공개 117상태의 320px 검사, 실제 폰트 사용, Avatar focus/hover/resize와 Usage 경로 전환도 확인했습니다. 공개 짧은/긴 PDF는 각각 1/2장이며 이미 검토한 로컬 PDF와 렌더 pixels가 모두 일치했습니다.

원본 `http://dev.prism.ai`는 HTTP 요청에는 응답했지만 이번 headless 세션에서는 HTTPS 전환 뒤 반복 리다이렉트가 발생했습니다. HTTPS 직접 접근은 연결이 재설정됐습니다. 기존 화면 기록을 보존하고 새 원본 상태 비교를 미완료로 유지합니다. 브라우저 외 네트워크·DNS·로그인 설정은 변경하지 않았습니다.

[기계 판독 검증 기록](verification.json)은 확인한 범위와 남은 항목을 제공합니다. 원본 AX·JPEG와 가상 예시의 DOM·PDF는 gitignore된 `.worknotes/browser-evidence/`에 보관하며 공개 사이트에 포함하지 않습니다.

## 남은 작업

- 원본 기본·hover·focus·disabled·selected·error·empty·long 상태와 인증 도메인 화면을 비교합니다.
- 모든 도메인의 긴 내용·popup·파일 상호작용과 인쇄 용지/여백·긴 Essay 조합을 확인합니다.
- 공개 117상태의 렌더와 상호작용 검사를 원본 스타일·모든 상태의 일치로 해석하지 않습니다.
