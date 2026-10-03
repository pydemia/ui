# PRISM 검증 기록

기준 소스: dev `7ecfc9af072d9f4aeb0f4d7706f16bd1a73f2ef9`. 관찰일: 2026-10-03. 구현 및 검증 진행 중입니다. 전체 스타일·상태 일치를 확인한 단계는 아닙니다.

## 확보한 근거

- frontend를 fetch·fast-forward했고 local dev와 origin/dev의 동일 revision 및 clean 상태를 확인했습니다.
- 로그인된 Chrome의 testuser001 화면에서 Pretendard, 주요 색상과 새 대화 버튼 40px/8px/14px를 확인했습니다.
- 자체 브라우저에서 배포 `/sample`의 37개 기본 화면을 관찰했습니다. 기본 AX·computed style·JPEG 기록을 남겼으며 화면 아래 내용과 열린 상태까지 모두 비교한 것은 아닙니다.
- 38개 typed source group, 토큰을 포함한 39개 registry 항목을 구성했습니다. 원본 269개 항목의 대응 관계는 기능 목적별 매핑이며 시각 일치율이 아닙니다.
- 원본 벡터 자산 87개를 유지했습니다. 174개 SVG를 함께 렌더링하는 테스트에서 ID 중복과 잘못된 내부 참조가 없었습니다. 모든 배치·색상 검증을 대신하지는 않습니다.

## 실제 동작 확인

| 범위 | 확인한 결과 | 남은 범위 |
| --- | --- | --- |
| 선택 입력 | 방향키·Enter 검색 선택, 다중 선택 Space/첫 칩 제거, 후보 검색 최소 3글자, 제거 후 포커스 복귀, 날짜 오류 거부, 페이지 변경 | 크기·disabled/readOnly·검색·전체 선택의 모든 조합 |
| 관리자 양식 | 전체 회사 시 회사 입력 비활성화, 팝업 게시기간 필수, 팝업 OFF 시 날짜 null, 역할 변경 시 불필요한 회사 그룹 해제 | 원본 관리자 양식 디자인 비교 |
| 공지·방침 | 비모달 공지의 다음 항목, 방침 버전 변경·높이 안정화, script 없는 iframe sandbox | 목록 정렬·상세·오류·긴 문서 |
| 프로필 recipe | 8개 분류 렌더링, 경험 영역 변경, 의견 저장 및 draft 비우기 | 원본 도메인 화면과 상태별 디자인 비교 |
| PDF·출력 | 실제 2페이지 렌더, page 2, 200% 내부 스크롤, 320/390/1024px fit, 출력 분류 선택 | 원본 toolbar 상태별 비교·브라우저 인쇄 페이지 분할 |
| 패널·Workspace | 440→520px 드래그, 방향키·Home/End·초기화, 320/390/768/1024px 레이아웃, Drawer 자동 닫기·포커스·draft 보존 | 원본 shell 비교·모든 도메인의 popup/long 조합 |
| 파일 | 로컬 가상 PDF 선택 후 attachment tile | 삭제·거부·drag/drop |

PRISM 계약 테스트 23개가 통과했습니다. 38개 예시의 115개 공개 상태를 실제 320px iframe에서 렌더링했으며 렌더 누락·중첩 버튼·페이지 가로 넘침은 없었습니다. 표시 입력 이름 검사는 기존 114개 상태와 이후 수정한 입력 5개 상태에서 통과했습니다. 이 검사는 픽셀 동일성을 뜻하지 않습니다. 원본 Candidate Common의 Skeleton·NoData·Summary 및 empty/error 영역은 크기·색상·여백을 비교하고 수정했습니다. Summary 설명의 클릭·Escape는 확인했으며 hover/focus만으로 열리는 동작은 런타임 미검증입니다.

원격 main의 PivotTable까지 반영한 ef8d2c6 기준에서 전체 build·TypeScript·일반 UI 테스트 247개와 registry 검증을 통과했습니다. 현재 일반 registry는 141개·카탈로그 139개·불변 release 70개입니다. 별도 소비자에 PRISM 39개 항목·62개 파일을 설치하고 tsc/Vite·폰트 bytes·자산 고지를 확인했습니다. Toast 본문 gap을 원본 소스의 6px로 수정한 뒤에도 전체 build와 독립 소비자 설치·tsc/Vite 검증을 통과했습니다. 소비자 검증은 39개 전체 소스를 컴파일하며 실제 렌더 demo는 Button입니다.

import만 있던 10개 그룹의 Usage를 합성 데이터와 상태를 포함한 React 예시로 보완했습니다. 설치된 registry 소스를 참조하는 10개 예시의 타입 검사가 통과했고 기존 CI의 PRISM 검사에도 workspace 예시 타입 검사를 연결했습니다. 38개 그룹 모두 설치용 import를 제공하며 각 예시의 import가 해당 항목의 설치 의존성 안에 있는지 검사합니다. 나머지 28개는 데이터·상태·callback을 소비자가 정의하는 연동 코드 일부로 표시합니다. 새 예시와 Usage 경로 선택·복사 UI의 브라우저 실행은 미확인입니다.

b533c5c의 기존 Vercel Git 배포가 완료됐습니다. 앞선 일일 제한 실패는 배포 이력에 남겼으며 `apps/docs`가 배포 입력에서 빠지던 문제는 `/docs/` 제외 규칙으로 수정했습니다. `/prism`과 `/prism/`은 HTTP 200이며 manifest·registry·단위 context 항목·llms.txt·폰트 파일의 bytes가 로컬 빌드와 일치합니다. b533c5c의 GitHub Verify UI와 Pages도 통과했습니다. `node scripts/verify-prism-consumer.mjs --public`으로 공개 URL에서 39개 항목·62개 파일을 직접 설치하고 예시 10개의 타입 검사·Vite 빌드·폰트 bytes·자산 고지를 확인했습니다. HTTP 응답과 설치 검증은 실제 브라우저 렌더 증거가 아닙니다.

자체 브라우저는 디스크 공간을 확보한 뒤에도 연결되지 않았으며 현재 browser inventory가 비어 있습니다. 공개 주소로 IAB를 생성해 보았으나 Browser is not available 응답이었습니다. 저장해 둔 화면 근거는 보존했으며 최신 폰트 로딩과 Toast 변경은 브라우저 런타임 미검증입니다.

[기계 판독 검증 기록](verification.json)은 component별 확인 범위와 미검증 항목을 제공합니다. 원본 AX·JPEG는 gitignore된 `.worknotes/browser-evidence/`에만 보관하며 공개 사이트에 포함하지 않습니다.

## 완료 전 필요한 작업

- 기본·hover·focus·disabled·selected·error·empty·long 상태의 원본/로컬 비교를 마칩니다.
- 공개 sample이 없는 도메인·관리자 화면은 소스 근거와 실제 화면 근거를 분리해 확인합니다.
- 반응형·직접 크기 조절·dynamic sizing을 명시적인 확장으로 기록합니다. 115개 공개 상태의 작은 화면 검사는 마쳤으며 긴 내용·popup 조합의 검증은 남아 있습니다.
- 최신 변경의 브라우저 렌더와 공개 `/prism`의 상호작용을 확인합니다. 전체 build·독립 registry 설치·일반 catalogue 보존·공개 HTTP readback은 통과했습니다.

Mac 잠금을 해제하지 않고 자체 브라우저로 공개 sample을 관찰했으나 현재는 브라우저 연결이 없습니다. 연결 당시에도 인증 `/chat`은 렌더링되지 않아 로그인 화면의 시각 검증은 제한됐습니다. 기존 Chrome 로그인 세션을 변경하지 않았습니다.
