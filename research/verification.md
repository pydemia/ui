# 첫 milestone 검증 기록

검사 시점: 2026-09-28 UTC. 테스트 데이터는 데모에서 만든 합성 fixture입니다.
실제 제품 backend나 영구 저장을 사용하지 않습니다.

| 검사 | 결과 | 관찰과 한계 |
| --- | --- | --- |
| `npm ci --ignore-scripts --offline` | pass | lockfile 기반 workspace 의존성 설치 |
| `npm run typecheck` | pass | UI 패키지 선언 생성, 데모와 문서 사이트 TypeScript 검사 |
| `npm run registry:build` | pass | shadcn CLI가 9개 item JSON 생성 |
| `npm run registry:check` | pass | 9개 item의 content, dependency 참조, provenance 일치 |
| `npm run build` | pass | Vite 7 문서 사이트와 프로필 데모 build; `docs/`에 registry JSON 포함 |
| `import('@pydemia/ui')` | pass | Node ESM에서 18개 export 로드 |
| 별도 consumer에 component source 복사 후 `tsc --noEmit` | pass | Snippet 포함 9개 소스의 import closure typecheck |
| shadcn CLI `add`로 별도 consumer 설치 | blocked | CLI의 필수 색상 파일 fetch가 이 환경의 proxy에서 거절됨. 원본 registry item 생성과 수동 복사만 확인 |
| Vercel 공개 사이트와 예시 화면 | pass (limited) | `https://pydemia-ui.vercel.app/`에서 컴포넌트·토큰·예시 iframe 렌더링, 테마 전환, `/examples/profile/` 검색·코드 탭·검토 상태 변경을 브라우저에서 확인. 모바일·키보드 focus의 정식 검사는 미실행 |
| Vercel registry JSON 직접 브라우저 요청 | unverified | `/r/pyd-button.json` 직접 탐색을 브라우저가 `ERR_BLOCKED_BY_CLIENT`로 거절. 로컬 빌드의 9개 JSON과 링크 생성은 검증됨 |
| screen reader와 formal WCAG audit | unverified | 브라우저 및 보조기술 테스트 미실행 |

Source 확인은 공식 docs·upstream file·LICENSE 원문을 기준으로 했습니다.
패키지 license는 설치된 manifest에서 직접 확인했습니다. 직접 의존성 중
`class-variance-authority`는 Apache-2.0, `lucide-react`는 ISC입니다.
원본 MIT source와 이를 혼동하지 않았습니다.

정적 token 비교에서 일반 텍스트/배경 13.69:1(light), 15.01:1(dark),
muted/표면 6.46:1(light), 8.25:1(dark), accent 텍스트/표면
7.31:1(light), 7.74:1(dark)를 계산했습니다. 이는 지정된 색 쌍의
수치일 뿐 실제 렌더링의 모든 대비나 WCAG 적합성을 증명하지 않습니다.

당시 남은 수용 검사는 `shadcn add`를 정상 네트워크에서 실행하고,
mobile light/dark 화면과 키보드 탭 이동·복사 feedback·focus ring을 확인하는
것입니다. 이후 실제 screen reader로 이름과 상태 발표를 확인합니다.
`ui.pydemia.ai`의 Squarespace CNAME은 아직 Vercel 대상으로 설정되지 않아
커스텀 도메인에서의 동작은 검증되지 않았습니다.

## 2026-09-28 component 확장 검사

이 절은 기존 8개에 foundation 12개를 추가한 로컬 작업 트리를 대상으로 합니다.
`docs/` 생성물은 빌드했으나 원격 배포 여부는 확인하지 않았습니다.

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck` | pass | UI 선언 생성, 문서·예시 TypeScript 검사 |
| `npm run build` | pass | 21개 registry JSON, 문서·프로필 정적 빌드 |
| `npm run registry:check` | pass | 21개 item과 provenance의 이름·참조·파일 검사 |
| 문서 catalog 브라우저 순회 | pass | 20개 선택 시 제목·preview·사용 코드·항목별 registry URL 확인 |
| production preview 정적 요청 | pass | 21개 `/r/*.json`이 HTTP 200이고 이름·파일 내용을 포함 |
| production preview 예시 iframe | pass | `examples/profile/`의 실제 예시 화면 렌더링 |
| 390px 화면 | pass (limited) | 20개 catalog 전환에서 문서 전체 가로 overflow 없음 |
| light/dark | pass (limited) | Alert 모바일 light/dark 전환과 token 반영을 시각 확인 |
| Checkbox | pass | click·Space 전환, `aria-checked=mixed`, disabled 상태 확인 |
| Dialog | pass | 열기, 내부 Tab 유지, Escape 닫기, trigger focus 복원; 390px에서 화면 안에 배치 |
| Alert | pass | 일반 `status`, 동적 오류 `alert` 역할 확인 |
| NativeSelect·Switch·RadioGroup | pass | 값 변경, Space 전환, ArrowDown 선택과 상태 텍스트 확인 |
| Progress·Skeleton | pass | 수치와 `aria-valuenow` 동기화, loading 상태 전환 |
| Tooltip | pass | 키보드 focus·hover로 표시, Escape 닫기, trigger의 설명 연결 |
| reduced motion | pass (limited) | Skeleton 애니메이션이 0.01ms로 줄어든 계산값 확인 |
| axe-core 4.12.1 | pass (limited) | Checkbox, Alert, Progress의 `#components`에서 위반 0개 |
| axe-core 열린 Dialog | incomplete | 위반 0개, `aria-hidden-focus` 수동 검토 1건. 배경을 숨기는 Radix focus guard와 페이지 요소가 보고됐고, Tab의 모달 내부 유지 동작은 직접 확인 |
| screen reader 발표·formal WCAG audit | unverified | 실제 보조기술과 전체 페이지 감사 미실행 |
| 별도 소비자 `shadcn add` | unverified | 설치된 소비자 프로젝트에서 CLI 설치 미실행 |
| 원격 Vercel 배포·커스텀 도메인 | unverified | 이번 로컬 변경을 push·배포하지 않음 |

브라우저 검사는 Chromium의 로컬 Vite 개발 서버와 정적 production preview에서
실행했습니다. Tooltip hover와 production preview의 Dialog 열기도 별도로
확인했습니다. axe-core 결과는 해당 화면·상태의 자동 검사 결과이며,
screen reader 동작이나 전체 WCAG 적합성의 증거로 취급하지 않습니다.

## 2026-09-28 두 번째 component 묶음 검사

이번 작업 트리는 기존 8개에서 총 30개 component로 확장했습니다.
정적 registry 항목은 공용 `pyd-utils`를 포함해 31개입니다.

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm ci` | pass | dev/preview 서버 종료 후 lockfile로 410개 package 재설치 |
| `npm run typecheck` | pass | UI, 예시, 문서 TypeScript 검사 |
| `npm run build` | pass | 31개 registry JSON과 게시용 정적 사이트 생성 |
| `npm run registry:check` | pass | 31개 item의 참조·provenance 검사 |
| 새 component preview·사용 코드 | pass | 10개 catalog 전환 후 제목, 실제 preview, 사용 코드 확인 |
| 390px 화면 | pass (limited) | 전체 30개 전환에서 문서 가로 overflow 없음 |
| 게시용 preview registry 요청 | pass | 31개 `/r/*.json` HTTP 200, 이름·파일 포함 |
| Accordion | pass | 펼침 상태와 ArrowDown으로 다음 trigger 이동 |
| Collapsible | pass | trigger 펼침 상태 변경 |
| Popover | pass | 열기, Escape 닫기, trigger focus 복원 |
| AlertDialog | pass | `alertdialog` 역할, 이름, 취소 초기 focus, Escape 닫기, 실행 후 상태·focus 복원 |
| Toggle·Slider | pass | click·Space의 `aria-pressed` 전환, ArrowRight의 `aria-valuenow` 40→41 변경 |
| axe-core 4.12.1 | pass (limited) | Accordion, Breadcrumb, Empty, Toggle, Slider, Avatar의 `#components`에서 위반·수동 검토 0건 |
| 실제 이미지의 Avatar fallback | unverified | preview는 텍스트 fallback만 사용 |
| 다중 thumb Slider·터치 조작 | unverified | 코드와 타입만 확인, 브라우저 조작 미실행 |
| 실제 screen reader·전체 WCAG | unverified | 보조기술 발표와 모든 상태의 감사 미실행 |
| 별도 소비자 `shadcn add` | unverified | 31개 정적 JSON 요청과 검사까지만 실행 |
| 원격 배포·커스텀 도메인 | unverified | 이번 로컬 변경은 push하지 않음 |

새 Radix 직접 의존성 일곱 개의 설치된 LICENSE와 package manifest는 MIT로
확인했습니다. lockfile에서 일곱 패키지의 의존성 closure 46개를 추적했으며
license metadata는 MIT 45개, 0BSD 1개였습니다. 이는 법률 검토가 아닙니다.

## 2026-09-28 빈 범주 component 검사

Calendar, MetricCard, Dropzone, Message, PromptInput을 추가한 결과
component는 35개, 정적 registry 항목은 공용 utils를 포함해 36개입니다.

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck` | pass | UI 선언, 예시·문서 TypeScript 검사 |
| `npm run build` | pass | 36개 registry JSON과 게시용 정적 사이트 생성; 문서 JS chunk 500 kB 경고 |
| `npm run registry:check` | pass | 36개 항목의 provenance·의존성·파일 검사 |
| 390px catalog 순회 | pass (limited) | 35개 preview와 항목별 registry URL, 문서 가로 overflow 없음 |
| 게시용 preview registry 요청 | pass | 36개 `/r/*.json` HTTP 200과 이름·파일 확인 |
| Calendar | pass | 한국어 날짜 이름, ArrowRight 이동, Enter 선택, 이전·다음 월 버튼 클릭 |
| MetricCard | pass | 이름 있는 group, 수치와 변화 텍스트, preview 값 변경 |
| Dropzone | pass | Enter가 file input을 실행; PNG 선택 상태, 잘못된 형식의 오류 알림 확인 |
| Message | pass (limited) | 발신자별 이름 있는 group과 텍스트 렌더링 |
| PromptInput | pass | Shift+Enter 줄바꿈, Enter 전송, 입력 초기화, 빈 내용의 submit 비활성화 |
| axe-core 4.12.1 | pass (limited) | 다섯 component의 `#components`에서 위반·수동 검토 0건 |
| Dropzone 실제 drag, 크기·개수 거부 | unverified | file input 선택과 형식 거부만 실행 |
| Calendar 범위·시간대·RTL | unverified | 단일 날짜·월 이동만 실행 |
| 실제 screen reader·전체 WCAG | unverified | 보조기술 발표와 모든 상태의 감사 미실행 |
| 별도 소비자 `shadcn add` | unverified | 생성 JSON의 요청·정합성만 확인 |
| 원격 배포·커스텀 도메인 | unverified | 이번 로컬 변경은 push하지 않음 |

`react-day-picker@9.14.0`과 `react-dropzone@14.4.1`의 설치된 LICENSE는
MIT입니다. lockfile에서 두 패키지의 의존성 closure 14개를 추적했고
license metadata는 MIT 13개, 0BSD 1개였습니다. source별 고정 revision과
라이선스는 `source-inventory.md`와 `registry/provenance.json`에 있습니다.

## 2026-09-28 폼 입력·소비자 설치 검사

Field, Select, DatePicker를 추가한 작업 트리는 38개 component와
40개 registry item(`pyd-utils`, `pyd-tokens` 포함)입니다.

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck` | pass | UI 선언, 예시·문서 TypeScript 검사 |
| `npm run build` | pass | 기본 공개 URL을 참조하는 40개 registry JSON, 정적 문서·예시 빌드 |
| `npm run registry:check` | pass | 40개 item의 provenance, 내부 URL, 설치 target, 파일 내용 검사 |
| 로컬 registry HTTP 요청 | pass | 40개 `/r/*.json`의 HTTP 200과 item 이름 확인 |
| 소비자 `shadcn add` | pass | 별도 Vite 프로젝트에서 Field·Select·DatePicker·`pyd-tokens` 설치; UI 경로에 8개 파일 생성 |
| 소비자 typecheck·build | pass | 설치된 컴포넌트 import, token CSS import, React form의 TypeScript와 Vite production build |
| 소비자 Chromium | pass | Select 키보드 선택, DatePicker 날짜 선택, 세 값의 form 제출, token 계산값과 가로 overflow 확인 |
| Field 문서 preview | pass | Enter 제출 후 오류 `alert`, 설명·오류 ID와 `aria-invalid`·`aria-required` 연결 확인 |
| Select 문서 preview | pass | Enter 열기, ArrowDown 이동, option 선택, form value `editor`, Escape와 focus 복원 확인 |
| DatePicker 문서 preview | pass | Enter 열기, 날짜 선택, hidden form value `2026-09-29`, Escape 닫기와 trigger focus 복원 확인 |
| dark mode | pass (limited) | 문서 테마 전환과 token 값 반영 확인; 전체 상태별 시각 감사 미실행 |
| 화면 폭 | pass (limited) | 문서 426px, 소비자 1280px에서 가로 overflow 없음 |
| 실제 screen reader·전체 WCAG | unverified | 보조기술 발표와 모든 상태의 감사 미실행 |
| DatePicker min/max·시간대·RTL | unverified | 코드와 타입을 검사했으나 해당 경계의 브라우저 검사는 미실행 |
| 원격 배포·커스텀 도메인 | unverified | 이번 로컬 변경은 push·배포하지 않음 |

처음 실행한 소비자 설치는 `./pyd-label.json`을 소비자 로컬 파일로
찾아 실패했습니다. 생성 JSON의 `registryDependencies`를 절대 HTTP
URL로 바꾸고 file target을 `@ui/<파일명>`으로 지정한 뒤 다시 설치해
통과했습니다. 로컬 검사는 base URL을 `http://127.0.0.1:5173/r/`로
지정해 실행하고, 최종 빌드는 기본 공개 URL로 되돌렸습니다.
문서 JS chunk에는 500 kB 초과 경고가 남아 있습니다.

## 2026-09-29 Message 발신자별 색상

`MessageContent`의 user 발화에 별도 색상 token을 적용했습니다. assistant와
system 발화의 기존 표면·글자색은 유지했습니다.

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck` | pass | UI와 두 앱의 TypeScript 검사 |
| `npm run build` | pass | 정적 문서와 40개 registry item 생성 |
| `npm run registry:check` | pass | 40개 item과 provenance 검사 |
| 문서 preview, light | pass | user `#103344`/`#ffffff`, assistant `#ffffff`/`#202a35` 계산 스타일 확인 |
| 문서 preview, dark | pass | user `#245d70`/`#ffffff`, assistant `#1b242d`/`#e9eef2` 계산 스타일과 시각 표시 확인 |
| user 글자색 대비 | pass | 흰색 기준 light 13.30:1, dark 7.31:1 계산 |
| 공개 문서와 registry | pass | `ui.pydemia.ai`의 두 테마 계산 스타일, 두 JSON에 새 class와 token 포함 확인 |
| 실제 screen reader | unverified | 발신자별 이름 있는 group은 유지되지만 보조기술 발표는 실행하지 않음 |

문서 빌드에는 기존의 500 kB 초과 JS chunk 경고가 남아 있습니다.

## 2026-09-29 Colormap 선택과 직접 조정

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| typecheck·build·registry:check | pass | 공통 token, 두 앱, 40개 registry item과 게시용 파일 |
| preset 전환 | pass | Ocean·Forest·Violet 선택 시 root semantic token과 Button 배경 변경 |
| hex 입력 | pass | 유효한 Accent 적용, 잘못된 형식 차단과 오류 문구, preset 선택 시 초기화 |
| light/dark | pass | 양쪽 모드의 직접 조정값 독립 유지, Violet dark 표시 |
| iframe·전체 화면 | pass | 조합 예시 iframe의 token 동기화, URL query로 양쪽 모드 조정값 재현 |
| 기본 preset 대비 | pass | 5개 preset × 2개 모드의 본문·Accent·User message 조합 모두 4.5:1 이상 |
| 낮은 대비 안내 | pass | Accent 1.0:1 입력에서 일반 텍스트 대비 부족 표시 |
| 공개 사이트 | pass | `ui.pydemia.ai`에서 Pydemia preset, 직접 hex, iframe·전체 화면 동기화 확인 |
| 좁은 화면·native 색상 선택기 | unverified | 반응형 CSS 검사, 팝업 열기 확인; 실제 viewport·색상 선택 미실행 |
| 실제 screen reader·임의 색상 전체 | unverified | 세 텍스트 조합 표시 외의 모든 접근성 상태 감사 미실행 |

직접 지정한 색은 자동 보정하지 않습니다. UI는 본문, Accent, User
message의 세 텍스트 대비만 계산합니다.

## 2026-09-29 component 구현 출처 재검토

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck` | pass | UI와 문서·프로필 예시 TypeScript |
| `npm run build` | pass | 40개 registry item, 게시용 문서·예시 |
| `npm run registry:check` | pass | 구현 출처는 pydemia/ui 또는 shadcn/ui, reference와 분리 |
| Dropzone 파일 선택 | pass | PNG 선택, TXT 형식 오류, 1 MB 초과 오류 |
| Dropzone 키보드 | pass | Enter로 native file chooser 열기 |
| 문서 표시 | pass | 자체 구현 source·별도 reference·공개 사용 조건 미지정 |
| 실제 drag/drop·개수 제한 | 미검증 | 파일 drag 및 다중 파일 입력 미실행 |
| 실제 screen reader·법률 검토 | 미검증 | DOM 역할과 metadata 확인에 한정 |

`react-dropzone` runtime과 registry 의존성을 제거했습니다. shadcn/ui
변형 항목의 MIT notice와 과거 adaptation의 귀속 notice는
유지합니다. Origin UI·Kibo UI·AI Elements·Tremor는 현재 metadata에서
디자인 reference로 표시합니다.
저장소 전체 공개 LICENSE는 아직 정해지지 않았습니다.

## 2026-09-29 화면 골격·탐색·정보 표시 확장

AppShell, Navigation, LogConsole, Sparkline, PageHeader, ContentList를
새 item으로 편입하고 Spinner에 `ring`, `dots` 변형을 추가했습니다.

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck` | pass | UI와 문서·프로필 예시 TypeScript |
| `npm run build` | pass | 정적 문서·예시, 46개 registry item 생성 |
| `npm run registry:check` | pass | 46개 item, provenance, 생성 파일 검사 |
| AppShell browser | pass (limited) | 861px preview의 가로 배치, 이름 있는 영역, bubble 열기·닫기 |
| Navigation·PageHeader·ContentList | pass (limited) | named nav, heading, native 목록의 접근성 트리 |
| LogConsole browser | pass | 항목 추가·비우기와 빈 상태 텍스트 |
| Sparkline browser | pass (limited) | 수치 요약 이름과 빈 데이터 상태 |
| Spinner browser | pass (limited) | 세 variant의 이름 있는 상태 |
| dark mode | pass (limited) | AppShell preview 시각 확인, 밝은 모드 복귀 |
| 소비자 설치·build | unverified | 새 6개 item의 별도 소비자 설치 미실행 |
| 실제 screen reader·좁은 viewport | unverified | 보조기술 발표와 breakpoint 이하 동작 미실행 |
| 원격 배포 | unverified | 이번 로컬 변경 push·배포 미실행 |

새 component는 저장소에서 직접 작성했고 npm dependency는 추가하지
않았습니다. 자세한 범위와 결정은
`.worknotes/component-expansion-2026-09-29.md`에 기록했습니다.

## 2026-09-29 차트·대시보드·알림 확장

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck` | pass | UI·두 앱 TypeScript |
| `npm run build` | pass | 기본 게시 URL의 정적 사이트·49개 registry item |
| `npm run registry:check` | pass | 49개 item과 provenance 정합성 |
| DataChart browser | pass (limited) | line/bar 전환, 막대 6개, 결측 표 값, 빈 상태 |
| Dashboard browser | pass (limited) | 약 721px container의 지표 2열, panel 1열, 영역 이름 |
| Toast browser | pass (limited) | status·alert DOM 역할, 키보드 닫기·focus 복귀, 다크 모드 표시 |
| 소비자 `shadcn add` | pass | 기존 Vite fixture에 새 3개 item 설치, 기존 utils 재사용 |
| 소비자 typecheck·build | pass | 세 새 export import, TypeScript와 Vite production build |
| 실제 screen reader·좁은 화면 | unverified | 발표·table 탐색·breakpoint 이하 검사 미실행 |
| 새 소비자 전체 설치·원격 배포 | unverified | fixture 재사용; 이번 변경은 push·배포하지 않음 |

작업 세부와 남은 범위는
`.worknotes/component-analytics-toast-2026-09-29.md`에 기록했습니다.

## 2026-09-29 관리 목록·보조 패널 확장

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck` | pass | UI·두 앱 TypeScript |
| `npm run build` | pass | 정적 사이트·52개 registry item 생성 |
| `npm run registry:check` | pass | 52개 item과 provenance 정합성 |
| DataTable browser | pass (limited) | 페이지 이동·선택 유지, 검색·필터 빈 결과, 정렬 속성, 마지막 페이지 삭제 후 첫 페이지 |
| Pagination browser | pass (limited) | 범위, 크기 변경, 0건 disabled 상태 |
| Drawer browser | pass (limited) | 오른쪽·아래 패널, Escape·닫기, focus 복귀 |
| 소비자 `shadcn add` | pass | 기존 Vite fixture에 3개 item과 전이 item 설치 |
| 소비자 typecheck·build | pass | 새 component import·render fixture |
| 390px viewport | pass (limited) | Drawer 358px, DataTable 315px, 문서 가로 overflow 없음 |
| 실제 screen reader·긴 내용 | unverified | 보조기술 발표·긴 Drawer 내용 미실행 |
| 새 소비자 전체 설치·원격 배포 | unverified | fixture 재사용; 로컬 변경은 push·배포하지 않음 |

세부 결정과 로컬 registry URL 재생성 절차는
`.worknotes/component-list-drawer-2026-09-29.md`에 기록했습니다.

## 2026-09-29 작업 메뉴·입력·차트 변형

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck` | pass | UI·두 앱 TypeScript |
| `npm run build` | pass | 정적 사이트·54개 registry item 생성 |
| `npm run registry:check` | pass | 54개 item과 provenance 정합성 |
| DropdownMenu browser | pass (limited) | Enter·방향키·체크·라디오·submenu·disabled·Escape·focus 복귀 |
| 390px menu | pass (limited) | submenu 좌표 208–368px, viewport 안쪽 |
| PasswordInput browser | pass (limited) | 표시 toggle·값 유지·disabled 이름과 상태 |
| DataChart area browser | pass (limited) | 결측으로 분리된 면적 path, 표 값, 빈 상태, light/dark 표시 |
| 기존 소비자 설치·build | pass | 새 두 item 설치, chart 갱신, typecheck·Vite build |
| 빈 component tree 소비자 | pass (limited) | token·메뉴·입력·chart 설치, typecheck·build; 기존 fixture의 manifest 재사용 |
| screen reader·typeahead·RTL | unverified | 보조기술 발표와 해당 입력 동작 미실행 |
| 전체 item 설치·원격 배포 | unverified | 이번 로컬 변경은 push·배포하지 않음 |

자세한 결정과 의존성 확인 범위는
`.worknotes/component-menu-input-chart-2026-09-29.md`에 기록했습니다.

## 2026-09-29 검색 선택·구성비 차트

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck` | pass | UI·두 앱 TypeScript |
| `npm run build` | pass | 기본 게시 URL의 정적 사이트·56개 registry item |
| `npm run registry:check` | pass | 56개 item과 provenance 정합성 |
| Combobox browser | pass (limited) | 필수 오류, 검색, 방향키·Enter, pointer 선택, disabled, Escape, 선택값 form 제출 |
| 390px Combobox | pass (limited) | popup x=49–326px, 문서 가로 overflow 없음 |
| DonutChart browser | pass (limited) | 총합 80건, 범주 값·비율, 0건·빈 상태, light/dark |
| 잘못된 입력 | pass | server render에서 중복·미지 option, 음수·무한대·빈 label 거부 |
| 소비자 `shadcn add` | pass | 별도 Vite fixture에 두 item 설치·import 후 typecheck·build |
| screen reader·touch | unverified | 발표와 touch 선택 미실행 |
| popup 위치 전환 | unverified | viewport 하단·overflow 조상에서의 대응 미구현 |
| 전체 item 설치·원격 배포 | unverified | 로컬 작업이며 공개 사이트 미반영 |

상태 소유와 추가 제한은
`.worknotes/component-combobox-donut-2026-09-29.md`에 기록했습니다.

## 2026-09-29 크기 조절 패널·원형 진행 표시

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck` | pass | UI·두 앱 TypeScript |
| `npm run build` | pass | 정적 문서와 57개 registry item |
| `npm run registry:check` | pass | 57개 item과 provenance 정합성 |
| ResizablePanels browser | pass (limited) | 두 방향의 separator 의미, 화살표·Shift·Home·End, 상하 pointer drag, 범위 20–80% |
| Progress browser | pass (limited) | 선형·원형 값 동기화, 원형 indeterminate의 `aria-valuenow` 없음, light/dark 표시 |
| 소비자 `shadcn add` | pass | 기존 Vite fixture에 두 item과 내부 의존성 설치 |
| 소비자 typecheck·build | pass | 설치된 소스 import·render fixture |
| server render 경계값 | pass | 좁은 허용 범위 기본값, 잘못된 비율·빈 이름 거부 |
| screen reader·touch·RTL | unverified | 보조기술 발표와 touch·RTL pointer 동작 미실행 |
| 새 소비자 전체 설치·원격 배포 | unverified | 기존 fixture 재사용; 로컬 변경은 push·배포하지 않음 |

결정과 상세 검증은
`.worknotes/component-resizable-progress-2026-09-29.md`에 기록했습니다.

## 2026-09-29 접힘식 Sidebar

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck` | pass | UI·두 앱 TypeScript |
| `npm run build` | pass | 정적 문서와 58개 registry item |
| `npm run registry:check` | pass | 58개 item과 provenance 정합성 |
| Sidebar desktop browser | pass (limited) | Enter 접기, 아이콘 링크 이름, `aria-current`, 오른쪽 배치 |
| Sidebar mobile browser | pass (limited) | 390px trigger, modal, Escape·focus 복귀, 링크 선택·닫기, 오른쪽 Drawer 경계 |
| server render | pass | 현재 페이지 속성, 빈 label·link와 중복 id 거부 |
| 소비자 `shadcn add` | pass | 기존 Vite fixture에 item·전이 item 설치 후 typecheck·build |
| screen reader·touch·resize 중 open | unverified | 실제 보조기술 발표와 화면 크기 변경 중 modal 처리 미실행 |
| 전체 item 설치·원격 배포 | unverified | fixture 재사용; 로컬 변경은 push·배포하지 않음 |

구현 결정과 제한은 `.worknotes/component-sidebar-2026-09-29.md`에
기록했습니다.

## 2026-09-30 Sidebar 섹션 탐색

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck` | pass | UI·두 앱 TypeScript |
| `npm test -w @pydemia/ui` | pass | 59/59; 섹션 이름·현재 링크·기존 평면 목록·잘못된 입력 |
| `npm run build` | pass | 문서·예시와 92개 registry item |
| `npm run registry:release-check` | pass | 92개 metadata·90개 export/catalog·8개 불변 snapshot, 현재 ID 일치 |
| Chromium desktop | pass (limited) | 섹션 전환, 두 제목·링크, 접힌 상태의 접근성 이름 |
| Chromium 390px | pass (limited) | Drawer의 섹션·링크, 링크 선택 후 닫기, Escape와 trigger focus 복귀 |
| 공개 URL 설치·독립 소비자 | pass | 고정 snapshot의 Sidebar·tokens 설치, 7개 파일 생성, 원본 소스 일치, typecheck·build |
| 운영 배포·CI | pass | PR #6·main Verify UI 성공, Vercel production READY, 운영 preview 섹션 전환 |
| 실제 screen reader·touch·RTL | unverified | 보조기술 발표와 별도 입력 환경 미실행 |

현재 snapshot은
`sha256-bd48f81920e4ed1242c68f8ffb3aa84483d8cc37118e65451a7dc784f61536d9`입니다.
구현 결정과 진행 상태는
`.worknotes/component-sidebar-groups-2026-09-30.md`에 기록했습니다.

## 2026-09-29 단계·활동 표시

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck` | pass | UI·두 앱 TypeScript |
| 로컬 `npm run registry:build` | pass | 60개 item 생성 |
| `npm run build` | pass | 정적 문서와 공개 URL의 60개 registry item |
| `npm run registry:check` | pass | 60개 item과 provenance 정합성 |
| Stepper browser | pass (limited) | 완료 유지, Enter 이동, 오류 재진입, 세로 배치, `aria-current` |
| Timeline browser | pass (limited) | 3개 활동과 `<time>`, 상태 텍스트, 빈 상태 |
| 소비자 `shadcn add` | pass | 기존 Vite fixture에 두 item 설치 |
| 소비자 typecheck·build | pass | 설치 소스 import·render |
| server render 경계값 | pass | 단계 index·id·callback, Timeline 중복·빈 상태 |
| screen reader·touch·RTL | unverified | 실제 보조기술 발표와 입력 미실행 |
| 전체 item 설치·공개 배포 | unverified | fixture 재사용; 로컬 변경 미게시 |

구현 결정과 상세 검증은
`.worknotes/component-workflow-2026-09-29.md`에 기록했습니다.

## 2026-09-29 파일 전송 상태

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck` | pass | 추가 당시 UI·두 앱 TypeScript |
| 로컬 `npm run registry:build` | pass | 61개 item 생성 |
| `npm run build` | pass | 정적 문서와 공개 URL의 61개 registry item |
| `npm run registry:check` | pass | 61개 item과 provenance 정합성 |
| FileUpload browser | pass (limited) | 재시도·진행·완료·제거·키보드 취소, 파일 선택·거부 |
| 390px browser | pass (limited) | 문서 가로 넘침 없음 |
| 소비자 `shadcn add` | pass | 기존 Vite fixture에 전이 item 설치 |
| 소비자 typecheck·build | pass | 설치 소스 import·render |
| server render 경계값 | pass | 빈 목록, 0%·미정 진행률, 잘못된 상태·ID·값 거부 |
| 실제 전송·취소 연결 | unverified | preview는 네트워크 요청을 하지 않음 |
| screen reader·touch | unverified | 실제 보조기술 발표와 drag-and-drop 미실행 |
| 전체 item 새 설치·공개 배포 | unverified | fixture 재사용; 로컬 변경 미게시 |

구현 결정과 제한은
`.worknotes/component-file-upload-2026-09-29.md`에 기록했습니다.

## 2026-09-29 다중 선택

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck` | pass | UI·두 앱 TypeScript |
| 로컬 `npm run registry:build` | pass | 62개 item 생성 |
| `npm run build` | pass | 재실행에서 정적 문서와 공개 URL registry 생성 |
| `npm run registry:check` | pass | 62개 item과 provenance 정합성 |
| MultiSelect browser | pass (limited) | 필수값 오류·검색·2개 제한·다중 제출·제거·초기화 |
| keyboard browser | pass (limited) | Enter 열기, Tab·Space 선택, Escape 닫기·focus 복원 |
| 소비자 `shadcn add` | pass | 기존 Vite fixture에 전이 item 설치 |
| 소비자 typecheck·build | pass | 설치 소스 import·render |
| server render 경계값 | pass | 복수 option 선택과 잘못된 label·option·값·상한 거부 |
| screen reader·touch·RTL | unverified | 실제 보조기술 발표와 입력 미실행 |
| 긴 목록·uncontrolled reset | unverified | 대량 option·native form reset 미실행 |
| 전체 item 새 설치·공개 배포 | unverified | fixture 재사용; 로컬 변경 미게시 |

첫 build는 Vite 두 앱의 build 후 `docs/index.html` 기록 단계에서
Windows `UNKNOWN` 파일 열기 오류로 종료됐습니다. 같은 명령을 다시
실행해 통과했으며 출력 registry에 로컬 URL이 남지 않았습니다.

구현 결정과 제한은
`.worknotes/component-multi-select-2026-09-29.md`에 기록했습니다.

## 2026-09-29 명령 팔레트

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck` | pass | UI·두 앱 TypeScript |
| 로컬 `npm run registry:build` | pass | 63개 item 생성 |
| `npm run build` | pass | 정적 문서와 공개 URL의 63개 item 생성 |
| `npm run registry:check` | pass | 63개 item과 provenance 정합성 |
| CommandPalette browser | pass (limited) | 검색·그룹·disabled·빈 결과·선택 후 닫기 |
| keyboard browser | pass (limited) | Ctrl+K, 방향키·Enter, Escape·focus 복원 |
| 390px browser | pass (limited) | dialog 폭 358px, 문서 가로 넘침 없음 |
| controlled browser | pass (limited) | open prop·onOpenChange와 Ctrl+K·Escape |
| 소비자 `shadcn add` | pass | 기존 Vite fixture에 전이 item 설치 |
| 소비자 typecheck·build | pass | 설치 소스 import·render |
| server render 경계값 | pass | 정상 trigger와 중복·공백 ID, 빈 label 거부 |
| screen reader·touch·RTL | unverified | 실제 보조기술 발표와 입력 미실행 |
| 다중 instance 단축키·전체 item 설치 | unverified | 단일 preview와 기존 fixture만 실행 |
| 공개 배포 | unverified | 로컬 변경 미게시 |

`git diff --check`도 통과했고 생성된 registry에는 로컬 URL이
남지 않았습니다. Browser에서 `aria-activedescendant`가 실제 option
ID를 가리키고 pointer 선택도 실행되는 것을 확인했습니다.

구현 결정과 제한은
`.worknotes/component-command-palette-2026-09-29.md`에 기록했습니다.

## 2026-09-29 shadcn/ui 고지 전달

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run registry:build` | pass | 기본 공개 URL의 63개 item 생성 |
| `npm run registry:check` | pass | 수정한 shadcn/ui source 26개 모두 고지 파일의 path·target·내용 확인 |
| 직접 `shadcn add` | pass | 별도 Vite fixture에 `pyd-button` 설치 시 MIT 파일 생성 |
| 전이 `shadcn add` | pass | `pyd-command-palette`의 `pyd-dialog`·`pyd-input`에서 MIT 파일 생성 |
| 소비자 typecheck·build | pass | 전이 설치 후 기존 Vite fixture에서 실행 |
| `npm run typecheck`, `npm run build` | pass | UI·두 앱 TypeScript, 게시용 정적 빌드 |
| 나머지 23개 직접 설치 | unverified | manifest·생성 JSON 검사만 실행 |
| 공개 registry 설치 | unverified | 이 변경은 로컬 작업 트리에만 있음 |

생성된 고지 내용과 소비자 fixture의 파일을 대조했습니다. build 후
registry 내부 URL을 기본 공개 주소로 되돌렸습니다.

## 2026-09-29 기간 선택

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck` | pass | UI·문서·profile demo TypeScript |
| 로컬 `npm run registry:build` | pass | 64개 item 생성 |
| `npm run build` | pass | 기본 공개 URL의 정적 문서와 64개 item 생성 |
| `npm run registry:check` | pass | 64개 item과 provenance 정합성 |
| 문서 preview Chromium | pass (limited) | 빈 값 오류, 부분·완료 선택, 초기화, 시작·종료 form 값 제출 |
| keyboard Chromium | pass (limited) | Enter 열기, Escape 닫기·focus 복귀, 새 범위 시작 |
| 소비자 `shadcn add` | pass | 새 Vite fixture에 range picker·token 설치, 7개 파일 생성 |
| 소비자 typecheck·build | pass | 설치 소스 import·render |
| 소비자 제한 날짜 browser | pass (limited) | 상·하한 disabled, 최소 2박·최대 3박 적용 |
| server render 경계값 | pass | 빈·완료 form 값과 잘못된 날짜·역순·범위·기간·중복 이름 거부 |
| screen reader·touch·RTL·390px | unverified | 실제 보조기술·입력·좁은 화면 검사 미실행 |
| 전체 item 새 설치·공개 배포 | unverified | 이 변경은 로컬 작업 트리에만 있음 |

구현 결정과 상세 범위는
`.worknotes/component-date-range-picker-2026-09-29.md`에 기록했습니다.

## 2026-09-29 계층형 리소스 탐색

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck` | pass | UI·문서·profile demo TypeScript |
| `npm run build` | pass | 기본 공개 URL의 정적 문서와 65개 item 생성 |
| `npm run registry:check` | pass | 65개 item과 provenance 정합성 |
| Tree server render 경계값 | pass | group·level·선택, 빈 목록, 공백 label·빈/중복 ID 거부 |
| 문서 preview Chromium | pass (limited) | 선택과 focus 분리, 확장·접힘, pointer 선택 |
| light/dark preview | pass (limited) | 두 모드의 선택 배경·텍스트를 화면으로 확인 |
| keyboard Chromium | pass (limited) | 방향키·Home·End·Enter·Space·연속 두 글자 검색, disabled 제외, focus outline |
| 소비자 `shadcn add` | pass | 새 Vite fixture에 tree·token 설치, 3개 파일 생성 |
| 소비자 typecheck·build | pass | 설치 소스 import·render; fixture alias 수정 후 build 통과 |
| 소비자 runtime audit | pass (limited) | `npm audit --omit=dev` 0건; 전체 audit는 fixture의 Vite 7.1.3 개발 의존성 high 1건 |
| 소비자 Chromium | pass (limited) | 설치본의 pointer 선택과 방향키 focus 이동 |
| screen reader·touch·RTL·대량 계층 | unverified | 실제 보조기술·입력·성능 검사 미실행 |
| 전체 item 새 설치·공개 배포 | unverified | 이 변경은 로컬 작업 트리에만 있음 |

첫 소비자 build는 검사 프로젝트의 `@/` Vite alias가 정의되지 않아
실패했습니다. 상대 import로 fixture를 고쳐 같은 설치 파일의 build를
재실행했습니다. 구현 결정과 제한은
`.worknotes/component-tree-2026-09-29.md`에 기록했습니다.

## 2026-09-29 대화 목록

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck` | pass | UI·문서·profile demo TypeScript |
| `npm run build` | pass | 정적 문서와 기본 공개 URL의 66개 registry item 생성 |
| `npm run registry:check` | pass | 66개 item과 provenance 정합성 |
| Conversation server render 경계값 | pass | 빈 상태·두 발신자·공백 label·빈/중복 ID 거부 |
| 문서 preview Chromium | pass (limited) | 초기 최신 위치, 끝에서 자동 스크롤, 과거 내용 읽는 중 위치 유지·새 메시지 2건 표시·이동 및 focus, PromptInput Enter 전송, 비움 |
| 소비자 `shadcn add` | pass | 새 Vite fixture에 conversation·token 설치, 4개 파일 생성 |
| 소비자 typecheck·build·Chromium | pass (limited) | 설치 소스 import·render·응답 추가 |
| 소비자 runtime audit | pass (limited) | `npm audit --omit=dev` 0건; 전체 audit는 fixture의 Vite 7.1.3 개발 의존성 high 1건 |
| 공개 URL 산출물 | pass | 로컬 registry URL 잔존 없음 |
| screen reader·touch·streaming·대량 메시지 | unverified | 실제 보조기술·입력·성능 검사 미실행 |
| 전체 item 새 설치·공개 배포 | unverified | 이 변경은 로컬 작업 트리에만 있음 |

구현 결정과 제한은
`.worknotes/component-conversation-2026-09-29.md`에 기록했습니다.

## 2026-09-29 AI 작업 상태

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck` | pass | UI·문서·profile demo TypeScript |
| `npm run build` | pass | 정적 문서와 기본 공개 URL의 68개 registry item 생성 |
| `npm run registry:check` | pass | 68개 item과 provenance 정합성 |
| Reasoning·ToolCall server render 경계값 | pass | 상태 표시, 공백 이름·모순된 결과·오류 거부 |
| 문서 Chromium | pass (limited) | Reasoning Enter·Space disclosure·상태 변경, ToolCall 입력 펼침·4개 상태·결과·오류 |
| 밝은/어두운 모드 | pass (limited) | 두 표현을 화면에서 확인 |
| 소비자 `shadcn add` | pass | 새 Vite fixture에 두 item·token 설치, 6개 파일 및 MIT 고지 생성 |
| 소비자 typecheck·build·Chromium | pass (limited) | 설치본 import·render, disclosure와 상태 전환 |
| 소비자 source 정합성 | pass | 마지막 재설치 뒤 두 component 파일이 저장소 source와 동일 |
| 소비자 runtime audit | pass (limited) | `npm audit --omit=dev` 0건; 전체 audit는 fixture의 Vite 7.1.3 개발 의존성 high 1건 |
| 공개 URL 산출물 | pass | 로컬 registry URL 잔존 없음 |
| screen reader·touch·RTL·빈번한 streaming 변경 | unverified | 실제 보조기술·입력·상태 변화 검사 미실행 |
| 전체 item 새 설치·공개 배포 | unverified | 이 변경은 로컬 작업 트리에만 있음 |

구현 결정과 제한은
`.worknotes/component-agent-workflow-2026-09-29.md`에 기록했습니다.

## 2026-09-29 분석 필터

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck` | pass | UI·문서·profile demo TypeScript |
| `npm run build` | pass | 정적 문서와 기본 공개 URL의 69개 registry item 생성 |
| `npm run registry:check` | pass | 69개 item과 provenance 정합성 |
| FilterBar server render 경계값 | pass | pending·disabled, 공백 label, 빈/중복 조건 ID 거부 |
| 문서 preview Chromium | pass (limited) | Enter 제출, 미적용 상태, 복합 조건, 초기화, bar·panel 표현 |
| 소비자 `shadcn add` | pass | 새 Vite fixture에 FilterBar·Field·Input·NativeSelect·token 설치, 9개 파일 생성 |
| 소비자 typecheck·build·Chromium | pass (limited) | 설치본의 검색·상태 적용, keyboard 초기화, 결과 변경 |
| 소비자 runtime audit | pass (limited) | `npm audit --omit=dev` 0건 |
| 공개 URL 산출물 | pass | 빌드 후 registry JSON에 로컬 URL 잔존 없음 |
| screen reader·touch·RTL·대량 조건 | unverified | 실제 보조기술·입력·성능 검사 미실행 |
| 전체 item 새 설치·공개 배포 | unverified | 이 변경은 로컬 작업 트리에만 있음 |

구현 결정과 제한은
`.worknotes/component-filter-bar-2026-09-29.md`에 기록했습니다.

## 2026-09-29 다중 계열 차트

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck` | pass | UI·문서·profile demo TypeScript |
| DataChart server render | pass | 기존 단일 입력, 2계열 막대·결측 표, 누락·혼합 입력·길이·중복 ID·무한값 거부 |
| 문서 Chromium | pass (limited) | 선형 2계열 범례·표, 그룹 막대 12개, 영역 4개 경로, 결측 2건·빈 상태 |
| 밝은/어두운 모드 | pass (limited) | 두 계열의 다른 색상 계산값과 문서 preview 표시 |
| Colormap 전환 | pass (limited) | Neutral→Pydemia에서 두 계열 색상 변경, Neutral 복원 |
| 소비자 `shadcn add` | pass | 새 Vite fixture에 chart·token 설치, 3개 파일 생성 |
| 소비자 typecheck·build·Chromium | pass (limited) | 설치본 다중 계열 표, 선형 2개 경로·막대 7개 전환 |
| 소비자 runtime audit | pass (limited) | `npm audit --omit=dev` 0건 |
| `npm run build` | pass | 기본 공개 URL의 정적 사이트·69개 registry item |
| `npm run registry:check` | pass | 69개 item과 provenance 정합성 |
| 소비자 source 정합성 | pass | 마지막 재설치본이 저장소 source와 동일 |
| 공개 URL 산출물 | pass | 빌드 후 registry JSON에 로컬 URL 잔존 없음 |
| screen reader·touch·RTL·장문/대량 데이터 | unverified | 실제 보조기술·입력·성능 검사 미실행 |
| 전체 item 새 설치·공개 배포 | unverified | 이 변경은 로컬 작업 트리에만 있음 |

구현 결정과 제한은
`.worknotes/component-data-chart-multi-series-2026-09-29.md`에 기록했습니다.

## 2026-09-29 콘텐츠 Carousel

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck` | pass | UI·문서·profile demo TypeScript |
| `npm run build` | pass | 정적 문서와 기본 공개 URL의 70개 registry item 생성 |
| `npm run registry:check` | pass | 70개 item과 provenance 정합성 |
| Carousel server render | pass | 기본·controlled·빈 목록, 단일 항목 버튼 disabled, 비활성 DOM 제외, 중복·없는 ID·모순 상태 거부 |
| 문서 Chromium | pass (limited) | 이전·다음, 끝 상태, 선택 버튼, Enter와 focus 유지, card/plain, 다크 모드 |
| 소비자 `shadcn add` | pass | 새 Vite fixture에 Carousel·token 설치, Button·utils·MIT 고지 포함 5개 파일 |
| 소비자 typecheck·build·Chromium | pass (limited) | controlled 순환 이동과 Space 선택, 마지막 source hash 일치 |
| 소비자 runtime audit | pass (limited) | `npm audit --omit=dev` 0건 |
| 공개 URL 산출물 | pass | `docs/r`·profile registry JSON에 로컬 URL 잔존 없음 |
| screen reader·터치·RTL·잦은 배열 변경 | unverified | 실제 보조기술·기기·방향·동적 목록 검사 미실행 |
| 전체 item 새 설치·공개 배포 | unverified | 이 변경은 로컬 작업 트리에만 있음 |

구현 결정과 제한은
`.worknotes/component-carousel-2026-09-29.md`에 기록했습니다.

## 2026-09-29 일반 이미지

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck` | pass | UI·문서·profile demo TypeScript |
| `npm run build` | pass | 정적 문서와 기본 공개 URL의 71개 registry item 생성 |
| `npm run registry:check` | pass | 71개 item과 provenance 정합성 |
| Image server render 경계값 | pass | 누락·native 속성 전달, 빈 URL·누락 alt·0 비율 거부 |
| 문서 Chromium | pass (limited) | 정상·누락·디코딩 오류, contain, 오류 이미지 접근성 트리 제외 |
| 소비자 `shadcn add` | pass | 새 Vite fixture에 Image·token 설치, utils 포함 3개 파일 |
| 소비자 typecheck·build·Chromium | pass (limited) | 설치본 정상·누락·오류 화면, source hash 일치 |
| 소비자 runtime audit | pass (limited) | `npm audit --omit=dev --audit-level=high` 0건 |
| 공개 URL 산출물 | pass | 두 registry 출력에 로컬 URL 잔존 없음 |
| 실제 screen reader·느린 네트워크·HTTP 오류·반응형 기기 | unverified | 실제 보조기술·망·기기 검사 미실행 |
| 전체 item 새 설치·공개 배포 | unverified | 이 변경은 로컬 작업 트리에만 있음 |

구현 결정과 제한은
`.worknotes/component-image-2026-09-29.md`에 기록했습니다.

## 2026-09-29 JSON 탐색

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck` | pass | UI·문서·profile demo TypeScript |
| `npm run build` | pass | 정적 문서와 기본 공개 URL의 72개 registry item 생성 |
| `npm run registry:check` | pass | 72개 item과 provenance 정합성 |
| JsonViewer server render 경계값 | pass | primitive·빈 값·중첩·항목 제한, 비JSON·순환·잘못된 props 거부 |
| 문서 Chromium | pass (limited) | Enter·Space, 하위 탐색, 항목 추가, 복사 상태, frame/plain·dark |
| 소비자 `shadcn add` | pass | 새 Vite fixture에 JsonViewer·token 설치, utils 포함 3개 파일 |
| 소비자 typecheck·build·Chromium | pass (limited) | 설치본 disclosure·항목 추가·복사 상태, source hash 일치 |
| 소비자 runtime audit | pass (limited) | `npm audit --omit=dev --audit-level=high` 0건 |
| 공개 URL 산출물 | pass | 두 registry 출력에 로컬 URL 잔존 없음 |
| screen reader·대량 성능·실제 clipboard 본문 | unverified | 보조기술·성능·clipboard 내용 검사 미실행 |
| 전체 item 새 설치·공개 배포 | unverified | 이 변경은 로컬 작업 트리에만 있음 |

구현 결정과 제한은
`.worknotes/component-json-viewer-2026-09-29.md`에 기록했습니다.

## 2026-09-29 색상 입력

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck` | pass | UI·문서·profile demo TypeScript |
| `npm run build` | pass | 정적 문서와 기본 공개 URL의 73개 registry item 생성 |
| `npm run registry:check` | pass | 73개 item과 provenance 정합성 |
| ColorInput server render | pass | form name·값, 빈 label·잘못된 hex·잘못된 controlled props 거부 |
| 문서 Chromium | pass (limited) | 유효·무효 hex, blur 복원, form 제출, inline, Colormap 적용·모드별 값·초기화 |
| 소비자 `shadcn add` | pass | 새 Vite fixture에 ColorInput·token 설치, utils 포함 3개 파일 |
| 소비자 typecheck·build·Chromium | pass (limited) | 설치본 form 제출·오류 표시, source hash 일치 |
| 공개 URL 산출물 | pass | 두 registry 출력에 로컬 URL 잔존 없음 |
| native 색상 선택기 조작 | unverified | 자동화의 값 주입은 change를 전달하지 않아 실제 선택 동작으로 판정하지 않음 |
| screen reader·브라우저별 picker | unverified | 보조기술과 다른 브라우저 수동 검사 미실행 |
| 전체 item 새 설치·공개 배포 | unverified | 이 변경은 로컬 작업 트리에만 있음 |

구현 결정과 제한은
`.worknotes/component-color-input-2026-09-29.md`에 기록했습니다.

## 2026-09-29 검색 입력

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck` | pass | UI·문서·profile demo TypeScript |
| `npm run build` | pass | 기본 공개 URL의 74개 registry item 생성 |
| `npm run registry:check` | pass | 74개 item과 provenance 정합성 |
| SearchInput server render | pass | search landmark·native GET 속성·값, 잘못된 props 거부 |
| 문서 Chromium | pass (limited) | Enter 제출, 초기화 버튼·Escape, focus 복귀, field/toolbar·dark |
| 소비자 `shadcn add` | pass | 로컬 base URL에서 6개 파일 설치, MIT 고지 포함 |
| 소비자 source 비교 | pass | SearchInput·Input·Button·고지 파일의 줄바꿈 정규화 후 내용 일치 |
| 소비자 typecheck·build·Chromium | pass (limited) | callback 검색·Escape와 native GET 제출, console error 없음 |
| 소비자 runtime audit | pass (limited) | `npm audit --omit=dev --audit-level=high` 0건 |
| 공개 URL 산출물 | pass | 두 registry 출력에 로컬 URL 잔존 없음 |
| screen reader·브라우저별 native clear | unverified | 보조기술과 다른 브라우저 수동 검사 미실행 |
| 전체 item 새 설치·공개 배포 | unverified | 로컬 fixture만 검증, 공개 registry는 이전 revision |

구현 결정과 제한은
`.worknotes/component-search-input-2026-09-29.md`에 기록했습니다.

## 2026-09-29 ContextMenu

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck` | pass | UI·문서·profile demo TypeScript |
| `npm run build` | pass | 기본 공개 URL의 75개 registry item 생성 |
| `npm run registry:check` | pass | 75개 item과 provenance 정합성 |
| 문서 Chromium | pass (limited) | 우클릭·Shift+F10·방향키·체크·라디오·submenu·disabled·Escape와 trigger focus 복귀, light/dark |
| 소비자 `shadcn add` | pass | 로컬 base URL에서 ContextMenu·utils·tokens 3개 파일 설치 |
| 소비자 source·의존성 | pass | 설치 source 동일, Radix 2.3.7·lucide 0.468.0 설치 확인 |
| 소비자 typecheck·build·Chromium | pass (limited) | 우클릭·키보드·체크·라디오·submenu 작업 결과, console error 없음 |
| 소비자 runtime audit | pass (limited) | `npm audit --omit=dev --audit-level=high` 0건 |
| 공개 URL 산출물 | pass | 두 registry 출력에 로컬 URL 잔존 없음 |
| touch 길게 누르기·screen reader·다른 브라우저 | unverified | 보조기술·기기별 입력 검사 미실행 |
| 전체 item 새 설치·공개 배포 | unverified | 이 item의 로컬 fixture만 검증 |

구현 결정과 제한은
`.worknotes/component-context-menu-2026-09-29.md`에 기록했습니다.

## 2026-09-29 NumberInput

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck` | pass | UI·문서·profile demo TypeScript |
| `npm run build` | pass | 정적 문서와 76개 registry item 생성 |
| `npm run registry:check` | pass | 76개 item과 provenance 정합성 |
| 문서 Chromium | pass (limited) | `de-DE` grouped 입력, 잘못된 구분자·범위·필수값, 제출 차단, ArrowUp/Down·Home/End, field/stepper |
| 소비자 `shadcn add` | pass | 로컬 base URL에서 NumberInput·Input·utils·tokens·MIT 고지 5개 파일 설치 |
| 소비자 source·의존성 | pass | NumberInput 원본과 설치본 일치, clsx·tailwind-merge, MIT 고지 확인 |
| 소비자 typecheck·build·Chromium | pass (limited) | `de-DE` 입력·표준값 제출·무효값 차단·ArrowUp, console error 없음 |
| 소비자 runtime audit | pass (limited) | `npm audit --omit=dev --audit-level=high` 0건 |
| 공개 URL 산출물 | pass | 두 registry 출력에 로컬 URL 잔존 없음 |
| screen reader·다른 브라우저·모바일 키보드 | unverified | 보조기술과 기기별 입력 검사 미실행 |
| 전체 item 새 설치·공개 배포 | unverified | 이 item의 로컬 fixture만 검증 |

구현 결정과 검증 세부 내용은
`.worknotes/component-number-input-2026-09-29.md`에 기록했습니다.

## 2026-09-29 TagsInput

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck` | pass | UI·문서·profile demo TypeScript |
| 문서 Chromium | pass (limited) | Enter·쉼표·Backspace·삭제 버튼, 대소문자 중복·최대 개수·필수값, 다중 붙여넣기·반복 form 제출·미확정 입력 차단 |
| 밝은·어두운 모드 | pass (limited) | outline/soft preview와 focus ring 표시 |
| 소비자 `shadcn add` | pass | 로컬 base URL에서 TagsInput·utils·tokens 3개 파일 설치 |
| 소비자 source·의존성 | pass | 설치 source 동일, clsx·tailwind-merge 설치 확인 |
| 소비자 typecheck·build·Chromium | pass (limited) | 반복값 제출·미확정 입력 차단, console error 없음 |
| 소비자 runtime audit | pass (limited) | `npm audit --omit=dev --audit-level=high` 0건 |
| `npm run build`·`npm run registry:check` | pass | 기본 공개 URL의 77개 item과 provenance 정합성 |
| 공개 URL 산출물·diff | pass | 두 registry 출력에 로컬 URL 잔존 없음, `git diff --check` 통과 |
| screen reader·다른 브라우저·IME·touch | unverified | 보조기술·기기별 입력 검사 미실행 |
| 전체 item 새 설치·공개 배포 | unverified | 이 item의 로컬 fixture만 검증 |

구현 결정과 검증 세부 내용은
`.worknotes/component-tags-input-2026-09-29.md`에 기록했습니다.

## 2026-09-29 Spinner 형태 확장

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck` | pass | UI·문서·profile demo TypeScript |
| `npm run build`·`npm run registry:check` | pass | 기본 공개 URL의 77개 registry item 생성·정합성 |
| 문서 브라우저 | pass (limited) | 다섯 형태와 이름 있는 status, SVG 형태, light/dark accent 색상 |
| 소비자 `shadcn add` | pass | 로컬 URL에서 Spinner·utils·tokens·MIT 고지 4개 파일 설치 |
| 소비자 source·의존성 | pass | 설치 source 동일, lucide-react 0.468.0 설치·고지 확인 |
| 소비자 typecheck·build·브라우저 | pass (limited) | 다섯 형태와 status 이름, token 색상 표시 |
| 소비자 runtime audit | pass (limited) | `npm audit --omit=dev --audit-level=high` 0건 |
| server render | pass | 다섯 형태의 markup, 알 수 없는 variant의 RangeError |
| 로고 헤더 | pass (limited) | 아래쪽 구분선 제거 후 light/dark border `0px` |
| 공개 URL 산출물·diff | pass | 로컬 registry URL 잔존 없음, 변경 CSS·TSX diff 검사 |
| OS reduced motion·screen reader·다른 브라우저 | unverified | 실제 환경 설정과 보조기술 검사 미실행 |
| 공개 배포 | unverified | 이번 로컬 변경 push·배포 미실행 |

구현과 소비자 설치 기록은
`.worknotes/component-spinner-variants-2026-09-29.md`에 있습니다.

## 2026-09-29 NavigationMenu

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck` | pass | UI·문서·profile demo TypeScript |
| `npm run build`·`npm run registry:check` | pass | 기본 공개 URL의 78개 registry item 생성·정합성 |
| 문서 브라우저 | pass (limited) | 제품 그룹 클릭, 링크 표시, ArrowDown 진입, Escape 닫기·focus 복귀, 현재 링크와 light/dark token |
| 소비자 `shadcn add` | pass | 로컬 URL에서 NavigationMenu·utils·tokens 3개 파일 설치 |
| 소비자 source·의존성 | pass | 설치 source 동일, Radix 1.2.22·lucide 0.468.0 설치 확인 |
| 소비자 typecheck·build·브라우저 | pass (limited) | 그룹 클릭·키보드 진입·Escape·링크 이동 |
| 소비자 runtime audit | pass (limited) | `npm audit --omit=dev --audit-level=high` 0건 |
| server render | pass | 비어 있거나 누락된 nav 이름을 오류로 거부 |
| 공개 URL 산출물·diff | pass | 로컬 registry URL 잔존 없음, 변경 파일 diff 검사 |
| Hover·touch·screen reader·RTL·좁은 화면 | unverified | pointer hover와 기기·보조기술별 검사 미실행 |
| 전체 item 새 설치·공개 배포 | unverified | 이 item의 로컬 fixture만 검증 |

구현 결정과 소비자 설치 결과는
`.worknotes/component-navigation-menu-2026-09-29.md`에 기록했습니다.

## 2026-09-29 DataChart 누적 막대

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck` | pass | UI·문서·profile demo TypeScript |
| `npm test -w @pydemia/ui` | pass | signed stack·결측값·overflow·빈 상태 3개 회귀 검사 |
| 문서 Chromium | pass (limited) | 누적 막대의 도형·범례·결측값 표·빈 상태·dark token |
| 소비자 `shadcn add` | pass | 로컬 URL에서 DataChart·utils·tokens 3개 파일 설치 |
| 소비자 source·의존성 | pass | chart source 동일, clsx·tailwind-merge 설치 확인 |
| 소비자 typecheck·build·Chromium | pass (limited) | 양·음수 막대와 결측값 표, console error 0건 |
| 소비자 runtime audit | pass (limited) | `npm audit --omit=dev --audit-level=high` 0건 |
| `npm run build`·`npm run registry:check` | pass | 기본 공개 URL의 78개 item과 provenance 정합성 |
| screen reader·다른 브라우저·모바일 | unverified | 보조기술·기기별 검사 미실행 |
| 전체 item 새 설치·공개 배포 | unverified | 이 item의 로컬 fixture만 검증 |

구현 결정과 소비자 설치 결과는
`.worknotes/component-data-chart-stacked-2026-09-29.md`에 기록했습니다.

## 2026-09-29 전체 registry 소비자 설치

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| 78개 item 동시 `shadcn add` | pass | 로컬 URL, 내부 의존성 포함 80개 파일 생성 |
| 설치 파일 원본 일치 | pass | TypeScript 78개, token CSS, MIT 고지 |
| 소비자 typecheck·build | pass | 전체 78개 모듈 정적 import 포함 |
| 소비자 Chromium | pass (limited) | 192개 export 읽기, console error 0건 |
| 소비자 runtime audit | pass (limited) | high 이상 0건, dev dependency 제외 |
| `registry:check` source 일치 | pass | 생성 JSON의 모든 파일 내용을 원본과 비교 |
| catalog·package 대응 | pass (limited) | component ID 76개가 catalog·index·registry에 대응 |
| 문서 사용 코드 typecheck | pass (limited) | 76개 예시를 독립 TSX로 추출, 최상위 JSX 구분 후 tarball 소비자에서 검사 |
| package tarball 소비자 | pass (limited) | 전체 registry와 package import·build·Chromium, console error 0건 |
| 개별 item 격리 설치·전체 상호작용 | unverified | 동시 설치와 모듈 로딩까지만 확인 |
| screen reader·다른 브라우저·공개 배포 | unverified | 보조기술·공개 환경 검사 미실행 |

검사 순서와 fixture는
`.worknotes/component-full-registry-consumer-2026-09-29.md`에 기록했습니다.

## 2026-09-29 HoverCard

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck`·`npm run build` | pass | UI·문서·예시 TypeScript, 79개 registry item과 정적 사이트 |
| `npm run registry:check` | pass | 79개 JSON과 provenance, source 일치 |
| 문서 Chromium | pass (limited) | pointer·focus 열기, pointer 이탈·Escape 닫기, focus 유지, dark token |
| 소비자 `shadcn add` | pass | HoverCard·utils·tokens 3개 파일 설치 |
| 소비자 source·의존성 | pass | component source 동일, Radix 1.1.23과 utils 의존성 설치 |
| 소비자 typecheck·build·Chromium | pass (limited) | focus·Escape·링크 이동, console error 0건 |
| 소비자 runtime audit | pass (limited) | high 이상 0건, dev dependency 제외 |
| 공개 URL 산출물 | pass | 기본 URL 복원, localhost registry 참조 없음 |
| screen reader·touch·다른 브라우저·좁은 화면 | unverified | 실제 보조기술·기기별 검사 미실행 |
| 79개 item 전체 새 설치·공개 배포 | unverified | 이번 item의 로컬 격리 설치만 확인 |

구현 결정과 설치 fixture는
`.worknotes/component-hover-card-2026-09-29.md`에 기록했습니다.

## 2026-09-29 Toast queue

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck`·`npm run build` | pass | UI·문서·예시 TypeScript, 79개 registry item과 정적 사이트 |
| `npm run registry:check` | pass | 79개 생성 JSON과 provenance 정합성 |
| server render 경계값 | pass | `useToastQueue(0)`의 `RangeError` 확인 |
| 문서 Chromium | pass (limited) | FIFO, 표시 한도, 중복 억제, 오류 alert, Enter 닫기·focus 복귀 |
| 소비자 `shadcn add` | pass | Toast·Button·utils·tokens·MIT 고지 5개 파일 |
| 소비자 source·typecheck·build | pass | Toast source 동일, 별도 Vite 소비자 빌드 |
| 소비자 Chromium | pass (limited) | 중복·대기·발표 역할·Enter 닫기, console error 0건 |
| 소비자 runtime audit | pass (limited) | high 이상 0건, dev dependency 제외 |
| screen reader·touch·다른 브라우저·좁은 화면 | unverified | 기기·보조기술별 검사 미실행 |
| 전체 79개 item 새 동시 설치·공개 배포 | unverified | 이번 item의 로컬 격리 설치만 확인 |

구현과 소비자 fixture는
`.worknotes/component-toast-queue-2026-09-29.md`에 기록했습니다.

## 2026-09-29 DataChart 구간 선택기

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck`·`npm run build` | pass | UI·문서·예시 TypeScript, 79개 registry item과 정적 사이트 |
| `npm test -w @pydemia/ui` | pass | 4개 검사: 기존 누적 막대와 선택기 값·결측·빈 상태 |
| `npm run registry:check` | pass | 79개 JSON과 provenance, source 일치 |
| 문서 Chromium | pass (limited) | select ArrowDown, pointer 선택, 다중 계열·빈 상태·dark token |
| 소비자 `shadcn add` | pass | DataChart·utils·tokens 3개 파일 설치 |
| 소비자 source·typecheck·build | pass | chart source 동일, 별도 Vite 소비자 빌드 |
| 소비자 Chromium | pass (limited) | 결측·음수 값과 구간 전환, console error 0건 |
| 소비자 runtime audit | pass (limited) | high 이상 0건, dev dependency 제외 |
| screen reader·실제 touch·좁은 화면·다른 브라우저 | unverified | 기기·보조기술별 검사 미실행 |
| 전체 79개 item 새 동시 설치·공개 배포 | unverified | 이번 item의 로컬 격리 설치만 확인 |

구현·소비자 fixture는
`.worknotes/component-data-chart-inspector-2026-09-29.md`에 기록했습니다.

## 2026-09-29 ToggleGroup

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck`·`npm run build` | pass | UI·문서·예시 TypeScript와 80개 registry item 빌드 |
| `npm run registry:check` | pass | 생성 JSON과 provenance·source 일치 |
| 문서 Chromium | pass (limited) | 단일·복수 선택, ArrowLeft focus, Space, disabled 항목 |
| 소비자 `shadcn add` | pass | ToggleGroup·utils·tokens 3개 파일 설치 |
| 소비자 source·typecheck·build | pass | source 해시 일치, Radix 1.1.19 설치 |
| 소비자 Chromium | pass (limited) | 선택과 키보드 조작, console error 0건 |
| 소비자 runtime audit | pass (limited) | high 이상 0건, dev dependency 제외 |
| screen reader·실제 touch·좁은 화면·다른 브라우저 | unverified | 기기·보조기술별 검사 미실행 |
| 전체 80개 item 새 동시 설치·공개 배포 | unverified | 이번 item의 로컬 격리 설치만 확인 |

구현·소비자 fixture는
`.worknotes/component-toggle-group-2026-09-29.md`에 기록했습니다.

## 2026-09-29 PinInput

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm test -w @pydemia/ui` | pass | 6개 검사, native 단일 입력과 잘못된 설정 포함 |
| `npm run typecheck`·`npm run build` | pass | UI·문서·예시 TypeScript와 81개 registry item |
| `npm run registry:check` | pass | 81개 생성 JSON과 provenance·source 일치 |
| 문서 Chromium | pass (limited) | 빈 필수 입력, 붙여넣기·삭제·제출, 칸 교체, Soft |
| 소비자 `shadcn add` | pass | PinInput·utils·tokens 설치, 최종 source 재설치 |
| 소비자 source·typecheck·build | pass | source SHA256 동일, 격리 Vite 앱 빌드 |
| 소비자 Chromium | pass (limited) | 여섯 자리 중 둘째 자리 교체·제출 |
| 소비자 runtime audit | pass (limited) | high 이상 0건, dev dependency 제외 |
| SMS 자동완성·screen reader·touch·다른 브라우저 | unverified | 실제 기기·보조기술 검사 미실행 |
| 전체 81개 item 새 동시 설치·공개 배포 | unverified | 이번 item의 격리 설치만 확인 |

구현과 미검증 범위는
`.worknotes/component-pin-input-2026-09-29.md`에 기록했습니다.

## 2026-09-29 Rating

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm test -w @pydemia/ui` | pass | 9개 검사, native radio·읽기 전용·잘못된 값 포함 |
| `npm run typecheck`·`npm run build` | pass | UI·문서·예시 TypeScript와 82개 registry item |
| `npm run registry:check` | pass | 82개 생성 JSON과 provenance·source 일치 |
| 문서 Chromium | pass (limited) | 빈 필수값, 방향키, label click, 제출, 두 variant |
| 소비자 `shadcn add` | pass | Rating·utils·tokens 3개 파일 설치 |
| 소비자 source·typecheck·build | pass | SHA256 동일, 격리 Vite 앱 빌드 |
| 소비자 Chromium | pass (limited) | 빈 제출 차단, 방향키 3점, 제출 3, console error 0건 |
| 소비자 전체 audit | pass | fixture Vite 7.3.6에서 취약점 0건 |
| screen reader·touch·다른 브라우저·좁은 화면 | unverified | 실제 기기·보조기술 검사 미실행 |
| 전체 82개 item 새 동시 설치·공개 배포 | unverified | 이번 item의 격리 설치만 확인 |

구현과 미검증 범위는
`.worknotes/component-rating-2026-09-29.md`에 기록했습니다.

## 2026-09-29 DataChart 누적 영역

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm test -w @pydemia/ui` | pass | 12개 검사, 영역 합계·결측·음수·overflow 포함 |
| `npm run typecheck`·`npm run build` | pass | UI·문서·예시와 82개 registry item |
| `npm run registry:check` | pass | 생성 JSON·provenance·source 일치 |
| 문서 Chromium | pass (limited) | 누적 영역, 결측 경계, 선택기·표 합계, 빈 상태, 밝은·어두운 모드 |
| 소비자 `shadcn add` | pass | DataChart·utils·tokens 3개 파일 설치, chart source 동일 |
| 소비자 typecheck·build·audit | pass | 별도 Vite 앱 빌드, high 이상 취약점 0건 |
| 소비자 Chromium | pass (limited) | 결측값과 합계, 영역 분리, console error 0건 |
| screen reader·실제 touch·RTL·다른 브라우저 | unverified | 기기·보조기술별 검사 미실행 |
| 큰 데이터·전체 82개 item 재설치·공개 배포 | unverified | 이번 변경의 설치 범위와 배포 제한 |

구현과 소비자 fixture는
`.worknotes/component-data-chart-stacked-area-2026-09-29.md`에 기록했습니다.

## 2026-09-29 TimePicker

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm test -w @pydemia/ui` | pass | 15개 검사, 12/24시간 값·잘못된 입력 포함 |
| `npm run typecheck`·`npm run build` | pass | UI·문서·예시와 83개 registry item |
| `npm run registry:check` | pass | 생성 JSON·provenance·source 일치 |
| 문서 Chromium | pass (limited) | 필수 입력, `21:35`·`09:35`·`00:35` 제출, 밝은·어두운 모드 |
| 소비자 `shadcn add` | pass | TimePicker·NativeSelect·utils·tokens·MIT 고지 설치 |
| 소비자 source·typecheck·build·audit | pass | 원본 해시 일치, Vite 빌드, 취약점 0건 |
| 소비자 Chromium | pass (limited) | 필수 입력 차단, 자정·정오, 방향키 선택, console error 0건 |
| screen reader·touch·RTL·다른 브라우저·좁은 화면 | unverified | 해당 환경 검사 미실행 또는 viewport 변경 미적용 |
| 전체 83개 item 새 동시 설치·공개 배포 | unverified | 이번 item의 격리 설치만 확인 |

구현·소비자 fixture는
`.worknotes/component-time-picker-2026-09-29.md`에 기록했습니다.

## 2026-09-29 ScrollArea

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm test -w @pydemia/ui` | pass | 18개 검사, 이름·focus·방향·잘못된 설정 포함 |
| `npm run typecheck`·`npm run build` | pass | UI·문서·예시와 84개 registry item |
| `npm run registry:check` | pass | 생성 JSON·provenance·source·MIT 고지 일치 |
| 문서 Chromium | pass (limited) | 세로·가로 overflow, End·ArrowRight, focus, 밝은·어두운 token |
| 소비자 `shadcn add` | pass | ScrollArea·utils·tokens·MIT 고지 설치 |
| 소비자 source·typecheck·build·audit | pass | 원본 해시 일치, Vite 빌드, 취약점 0건 |
| 소비자 Chromium | pass (limited) | 이름 있는 region, 키보드 스크롤, 양쪽 thumb drag, console error 0건 |
| screen reader·touch·RTL·다른 브라우저·실제 좁은 화면 | unverified | 기기·보조기술별 검사 미실행 |
| 전체 84개 item 새 동시 설치·공개 배포 | unverified | 이번 item의 격리 설치만 확인 |

구현·소비자 fixture는
`.worknotes/component-scroll-area-2026-09-29.md`에 기록했습니다.

## 2026-09-29 전체 registry 소비자 재검사

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| 새 소비자 `shadcn@4.0.0 add` | pass | 84개 item 동시 설치, 86개 파일 생성 |
| 설치 파일 원본 비교 | pass | 84개 TS 모듈·token CSS·MIT 고지, 줄바꿈 정규화 후 일치 |
| 소비자 typecheck·build | pass | 84개 모듈 정적 import, Vite build |
| 소비자 Chromium | pass (limited) | 84개 모듈·203개 값 export 로딩, console error 0건 |
| catalog 사용 코드 typecheck | pass | tarball 소비자에서 82개 TSX 예시 검사 |
| 소비자 production audit | pass | high 이상 취약점 0건 |
| 저장소 typecheck·build·registry:check | pass | 기본 공개 URL 생성, 84개 item 및 provenance |
| 개별 설치·전체 상호작용 | unverified | 동시 설치와 정적 코드 검사만 확인 |
| 갱신 충돌·screen reader·touch·다른 브라우저·공개 배포 | unverified | 이번 검사에 포함하지 않음 |

검사 명령, fixture, 번들 크기 경고의 범위는
`.worknotes/component-full-registry-consumer-2026-09-29.md`에 기록했습니다.

## 2026-09-29 PageHeader 크기

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm run typecheck`·`npm run build` | pass | 기본값 유지, 새 `size` API, 84개 item 빌드 |
| `npm run registry:check` | pass | PageHeader 생성 JSON과 전체 provenance 일치 |
| `npm test -w @pydemia/ui` | pass | 기존 18개 패키지 검사 |
| 문서 Chromium | pass (limited) | 세 크기 선택·`aria-pressed`, h2 유지, 어두운 모드 |
| 격리 소비자 설치·source | pass | PageHeader·utils·tokens, 원본 내용 일치 |
| 격리 소비자 typecheck·build·audit | pass | 세 크기 사용, high 이상 취약점 0건 |
| 소비자 Chromium | pass (limited) | 18·24·48px, h2/h2/h1, console error 0건 |
| catalog 사용 코드 | pass | 현재 tarball을 설치한 소비자에서 82개 TSX 예시 typecheck |
| 실제 좁은 viewport·screen reader·다른 브라우저·공개 배포 | unverified | 해당 환경 검사 미실행 |

구현과 fixture는
`.worknotes/component-page-header-sizes-2026-09-29.md`에 기록했습니다.

## 2026-09-29 AvatarGroup

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm test -w @pydemia/ui` | pass | 21개 검사, 남은 인원·빈 목록·잘못된 설정 포함 |
| `npm run typecheck`·`npm run build` | pass | UI·문서·예시와 85개 registry item |
| `npm run registry:check` | pass | 생성 JSON·provenance·source 일치 |
| 문서 Chromium | pass (limited) | 표시 제한·전체 표시·빈 상태·작은 크기·어두운 모드 |
| 격리 소비자 설치·source | pass | AvatarGroup·Avatar·utils·tokens·MIT 고지, 원본 내용 일치 |
| 소비자 typecheck·build·audit | pass | Vite 앱 빌드, high 이상 취약점 0건 |
| 소비자 Chromium | pass (limited) | 목록 이름·남은 인원·빈 상태, console error 0건 |
| catalog 사용 코드 | pass | tarball 소비자에서 83개 TSX 예시 typecheck |
| 실제 screen reader·이미지 실패·touch·RTL·다른 브라우저 | unverified | 해당 환경 검사 미실행 |
| 85개 item 전체 동시 설치·갱신 충돌·공개 배포 | unverified | 이번 item만 별도 설치 |

구현과 fixture는
`.worknotes/component-avatar-group-2026-09-29.md`에 기록했습니다.

## 2026-09-29 ButtonGroup

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm test -w @pydemia/ui` | pass | 23개 검사, 이름·장식 분리선·지원하지 않는 설정 포함 |
| `npm run typecheck`·`npm run build` | pass | UI·문서·예시와 86개 registry item |
| `npm run registry:check` | pass | 생성 JSON·provenance·source 일치 |
| 문서 Chromium | pass (limited) | 가로·세로·disabled·Enter·dark token; 새 탭 console error 0건 |
| 격리 소비자 설치·source | pass | ButtonGroup·Button·utils·tokens·MIT 고지 5개 파일, 원본 일치 |
| 소비자 typecheck·build·audit | pass | Vite 앱 빌드, high 이상 취약점 0건 |
| 소비자 Chromium | pass (limited) | 그룹 이름·배치·1px 분리선·disabled·Enter, console error 0건 |
| 실제 screen reader·touch·RTL·다른 브라우저 | unverified | 해당 환경 검사 미실행 |
| 86개 item 전체 동시 설치·갱신 충돌·공개 배포 | unverified | 이번 item만 별도 설치 |

구현과 fixture는
`.worknotes/component-button-group-2026-09-29.md`에 기록했습니다.

## 2026-09-29 전체 registry 86개 소비자 설치

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| 새 소비자 `shadcn@4.0.0 add` | pass | 86개 item 동시 설치, 88개 파일 생성 |
| 설치 파일 원본 비교 | pass | 86개 TS/TSX 모듈·token CSS·MIT 고지, 줄바꿈 정규화 후 일치 |
| 소비자 typecheck·build | pass | 86개 모듈 정적 import, Vite build |
| 소비자 Chromium | pass (limited) | 86개 모듈·206개 값 export 로딩, console error 0건 |
| 소비자 production audit | pass | high 이상 취약점 0건 |
| 저장소 typecheck·build·registry:check | pass | 기본 공개 URL 생성, 86개 item 및 provenance |
| 현재 catalog 사용 코드 84개 | unverified | 이번 fixture에서 tarball typecheck 미실행 |
| 전체 item 개별 설치·상호작용 | unverified | 동시 설치와 정적 module loading만 확인 |
| 갱신 충돌·screen reader·touch·다른 브라우저·공개 배포 | unverified | 이번 검사에 포함하지 않음 |

검사 명령, fixture, 번들 크기 경고의 범위는
`.worknotes/component-full-registry-consumer-2026-09-29.md`에 기록했습니다.

## 2026-09-29 현재 catalog 코드와 공급 경로 대응

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm pack -w @pydemia/ui` 후 소비자 typecheck | pass | 현재 catalog 사용 코드 84개 TSX 추출, tarball 공개 import |
| component 1:1 대응 | pass | `.tsx` 원본·registry 파일·public export·catalog ID 각 84개 |
| `registry:check` 회귀 검사 | pass | 위 대응을 자동 검사에 추가, 전체 86개 item·provenance |
| 저장소 `typecheck`·`build` | pass | 기본 공개 registry URL 생성 |
| 각 사용 코드의 실제 브라우저 동작 | unverified | 정적 typecheck만 실행 |
| 설치된 registry 소스 경로의 사용 코드 | unverified | 이번에는 package tarball import만 검사 |

검사 방법과 fixture는
`.worknotes/component-catalog-consumer-2026-09-29.md`에 기록했습니다.

## 2026-09-29 MetricCard 표시 형태

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm test -w @pydemia/ui` | pass | 총 25개, 세 형태의 텍스트·이름·token class와 잘못된 variant |
| 저장소 typecheck·build·registry:check | pass | 기본 공개 URL의 86개 item, 84개 export·catalog 대응 |
| 문서 Chromium | pass (limited) | 세 배치·값 갱신, Neutral light/dark와 Pydemia accent |
| 격리 소비자 설치·원본 | pass | MetricCard·Card·utils·tokens·MIT 고지 5개 파일 일치 |
| 소비자 typecheck·build·audit | pass | 세 배치의 Vite 앱, high 이상 취약점 0건 |
| 소비자 Chromium | pass (limited) | 같은 수치의 세 group, 값 갱신·dark token, 새 탭 console error 0건 |
| catalog 사용 코드 | pass | 현재 tarball 소비자에서 84개 TSX 예시 typecheck |
| 실제 screen reader·touch·RTL·다른 브라우저·공개 배포 | unverified | 해당 환경 검사 미실행 |

구현과 fixture는
`.worknotes/component-metric-card-variants-2026-09-29.md`에 기록했습니다.

## 2026-09-29 분석 작업 공간 조합 예시

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| 저장소 typecheck·build·registry:check | pass | 84개 component, 86개 registry item 유지 |
| 문서 Chromium | pass (limited) | 기간 전환 시 지표·차트 갱신, 검색·상태 필터·페이지 이동 |
| 행 선택 후 재실행 | pass (limited) | 실행 중 상태, 로그, 상태 문구, 선택 해제 |
| floating 도움말 | pass (limited) | 열기·닫기와 bullet 목록 표시 |
| dark mode | pass (limited) | 전환 버튼 상태 확인 후 light로 복원 |
| 개발 서버 console | 당시 HMR 오류 관찰 | 빌드 중 `createRoot()` 중복 호출 3건. 이후 수정·재검사 결과는 아래 절 참조 |
| registry 예시 코드 소비자 설치 | unverified | 사용 item 전체 동시 설치는 이전 검사 범위이며 예시 파일 직접 이식은 미실행 |
| 좁은 화면·보조기술·touch·다른 브라우저 | 당시 unverified | 390px 검사는 이후 아래 절에서 수행 |
| 공개 배포 | unverified | 로컬 `docs/` 빌드까지만 확인 |

이 조합은 기존 component를 사용하며 component·registry item 수를
늘리지 않습니다. 세부 범위는
`.worknotes/component-analytics-workspace-2026-09-29.md`에 남겼습니다.

## 2026-09-29 DataTable 좁은 화면과 문서 예시

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm test -w @pydemia/ui` | pass | 기존 패키지 테스트 25개 |
| typecheck·build·registry:check | pass | 84개 component, 86개 registry item |
| 390px Chromium | pass (limited) | 표 내용 408px, 영역 292px, 문서 전체 가로 넘침 없음 |
| 표 keyboard 가로 scroll | pass (limited) | 이름 있는 focus 영역에서 ArrowRight 뒤 scroll 위치 증가 |
| desktop 너비 | pass (limited) | 682px 영역과 표 너비 일치 |
| Registry review iframe | pass | 명시한 `index.html`에서 예시 요청 4건과 입력·코드 표시 |
| 개발 서버 HMR | pass (limited) | 새 탭과 문서 모듈 변경 후 console error 0건 |
| 실제 screen reader·touch·다른 브라우저 | unverified | 이번 검사에 포함하지 않음 |
| 수정본의 개별 registry 소비자 설치·공개 배포 | unverified | 로컬 생성·검사까지만 확인 |

원인, 변경 및 측정값은
`.worknotes/component-data-table-responsive-2026-09-29.md`에 있습니다.

## 2026-09-29 DateTimePicker

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| 패키지 테스트 | pass | 완성·부분 선택의 paired form 값, 잘못된 시간대·날짜·값·form 이름 |
| 격리 소비자 `shadcn@4.0.0 add` | pass | 10개 원본 파일 일치, 소비자 typecheck·build |
| 문서 Chromium | pass (limited) | 날짜→시각과 시각→날짜 제출, 날짜 해제 시 빈 form 값, 390px 배치, console error 0건 |
| 저장소 typecheck·build·registry:check | pass | 기본 공개 URL의 87개 item, 85개 export·catalog 대응 |
| 새 문서 사용 코드의 tarball 소비자 typecheck | unverified | 이전 84개 예시만 별도 확인 |
| DST 중복·누락 시각, 실제 보조기술·touch·다른 브라우저 | unverified | 시간대의 instant 해석은 호출자 책임 |
| 현재 87개 item 동시 재설치·갱신 충돌·공개 배포 | unverified | 이번에는 새 item의 격리 설치만 확인 |

세부 범위와 소비자 fixture는
`.worknotes/component-date-time-picker-2026-09-29.md`에 기록했습니다.

## 2026-09-29 전체 registry 87개 소비자 설치

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| 새 소비자 `shadcn@4.0.0 add` | pass | 87개 item 동시 설치, 89개 파일 생성 |
| 설치 파일 원본 비교 | pass | 87개 모듈·token CSS·MIT 고지, 줄바꿈 정규화 후 일치 |
| 소비자 typecheck·build | pass | 87개 모듈 정적 import, Vite build |
| 소비자 production audit | pass | high 이상 취약점 0건 |
| 저장소 build·registry:check | pass | 기본 공개 URL, 87개 item·85개 component 대응 |
| 현재 87개 모듈의 소비자 브라우저 로딩 | unverified | 이번 fixture에서 실행하지 않음 |
| 개별 설치 전체·갱신 충돌·보조기술·touch·공개 배포 | unverified | 이번 검사에 포함하지 않음 |

임시 fixture와 검사 범위는
`.worknotes/component-full-registry-consumer-2026-09-29.md`에 있습니다.

## 2026-09-29 CodeBlock

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| 패키지 테스트 | pass | 31개, 이름·문자열 escape·wrap·빈 코드·잘못된 입력 |
| 저장소 typecheck | pass | UI·예시·문서 TypeScript |
| 문서 Chromium | pass (limited) | 긴 줄 전환, Enter 복사 상태, ArrowRight 내부 scroll, 390px 전체 넘침 없음, console error 0건 |
| 격리 소비자 `shadcn@4.0.0 add` | pass | CodeBlock·Button·utils·tokens·MIT 고지 5개 원본 일치 |
| 소비자 typecheck·build·audit | pass | Vite 앱, high 이상 취약점 0건 |
| 저장소 build·registry:check | pass | 기본 공개 URL의 88개 item·86개 component 대응 |
| 실제 clipboard 내용·screen reader·touch·다른 브라우저 | unverified | 브라우저의 성공 상태는 확인했으나 클립보드 값은 독립 검증하지 못함 |
| 88개 item 동시 재설치·갱신 충돌·공개 배포 | unverified | 새 item의 격리 설치만 확인 |

세부 범위와 소비자 fixture는
`.worknotes/component-code-block-2026-09-29.md`에 기록했습니다.

## 2026-09-29 DataList

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| 패키지 테스트 | pass | 34개, native 의미·null/빈 값·빈 목록·입력 오류 |
| 문서 Chromium | pass (limited) | 332px container에서 행·2열 전환, 명시적 값 없음 |
| Operations workspace | pass (limited) | 도움말 열기와 기간 변경 시 현재 보기 갱신 |
| 개발 서버 console | pass (limited) | 확인한 동작의 error 0건 |
| 격리 소비자 `shadcn@4.0.0 add` | pass | DataList·Badge·utils·tokens 4개 원본 일치 |
| 소비자 typecheck·build | pass | DataList 사용 Vite 앱 |
| 저장소 typecheck·build·registry:check | pass | 기본 공개 URL의 89개 item·87개 component 대응 |
| 실제 screen reader·touch·다른 브라우저 | unverified | 이번 검사에 포함하지 않음 |
| 89개 item 동시 재설치·갱신 충돌·공개 배포 | unverified | 이번에는 새 item만 격리 설치 |

세부 범위와 임시 소비자 경로는
`.worknotes/component-data-list-2026-09-29.md`에 기록했습니다.

## 2026-09-29 Badge 표시 형태

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| 패키지 테스트 | pass | 37개, 기본 형태 유지·새 variant·잘못된 variant |
| 저장소 typecheck | pass | UI·예시·문서 TypeScript |
| 문서 Chromium | pass (limited) | 네 형태의 텍스트·색상, 분석 화면의 상태 적용 |
| 모드·colormap | pass (limited) | Neutral light/dark, Pydemia dark 계산 스타일 |
| 개발 서버 console | pass (limited) | 확인한 화면의 error 0건 |
| 격리 소비자 `shadcn@4.0.0 add` | pass | Badge·utils·tokens 3개 원본 일치 |
| 소비자 typecheck·build | pass | 네 variant 사용 Vite 앱 |
| 저장소 build·registry:check | pass | 기본 공개 URL의 89개 item·87개 component 대응 |
| 실제 screen reader·touch·다른 브라우저·전체 대비 | unverified | 이번 검사에 포함하지 않음 |
| 89개 item 동시 재설치·갱신 충돌·공개 배포 | unverified | 기존 item의 형태만 변경 |

세부 범위는 `.worknotes/component-badge-variants-2026-09-29.md`에
기록했습니다.

## 2026-09-29 현재 catalog·registry 공급 경로

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| 현재 package tarball 소비자 | pass | 87개 catalog 사용 코드의 `@pydemia/ui` import typecheck |
| `shadcn@4.21.0 add` 전체 | pass | 89개 item 동시 설치, 91개 원본 파일 일치 |
| registry 직접 import | pass | 87개 사용 코드를 설치 파일 경로로 바꾼 typecheck |
| registry 전체 Vite build | pass | 87개 component 모듈을 포함한 build |
| registry 소비자 Chromium | pass (limited) | 205개 값 export 로딩, console error 0건 |
| CLI 4.0.0 비교 | pass (limited) | 89개 동시 설치·typecheck·build·브라우저 로딩, 설치 경로 차이 관찰 |
| `shadcn@4.21.0` token CSS 경로 | pass | `src/components/ui/tokens.css` import의 typecheck·build |
| 각 preview 상호작용·보조기술·touch·다른 브라우저 | unverified | 정적 typecheck와 모듈 로딩으로 대체하지 않음 |
| item별 격리 설치·갱신 충돌·공개 배포 | unverified | 이번 검사는 전체 동시 설치 |

fixture 경로, CLI별 설치 경로와 검사 범위는
`.worknotes/component-catalog-supply-2026-09-29.md`에 기록했습니다.

## 2026-09-29 수정 source의 item별 고지 전달

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `shadcn@4.21.0 add` 개별 설치 | pass | provenance의 `modified` 27개 item, 각각 새 fixture |
| 소비자 MIT 고지 | pass | 설치물 27개와 저장소 `SHADCN_UI_LICENSE.md` 원본 일치 |
| 직접 component 소스 | pass | 설치물 27개와 `registry.json`의 소스 파일 일치 |
| 개별 fixture typecheck·build·상호작용 | unverified | 파일 전달 검사만 수행 |
| 갱신 충돌·복구·원격 공개 URL | unverified | 로컬 registry URL로 신규 설치 |

대상과 fixture 경로, 비교 방법은
`.worknotes/component-license-notice-individual-2026-09-29.md`에
기록했습니다.

## 2026-09-29 BottomNav

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| 패키지 테스트 | pass | 전체 39개, BottomNav의 native 의미·필수값 2개 포함 |
| 문서 Chromium | pass (limited) | pointer·Enter 선택, `aria-current` 변경; 초기 로딩의 console error·warning 0건 |
| 390px Chromium | pass (limited) | nav 275px, 문서 가로 넘침 없음 |
| 격리 소비자 CLI 설치 | pass | `pyd-navigation`·`pyd-tokens`, 생성 파일 3개 원본 일치 |
| 격리 소비자 typecheck·build | pass | BottomNav 사용 Vite 앱 |
| 저장소 typecheck·build·registry:check | pass | 기본 공개 URL의 89개 item·87개 component 대응 |
| 실제 screen reader·touch·5개 이상 목적지 scroll | unverified | 이번 검사에 포함하지 않음 |
| 라우터 연동·갱신 충돌·공개 배포 | unverified | preview는 로컬 상태만 변경 |

판정과 fixture 경로는
`.worknotes/component-bottom-navigation-2026-09-29.md`에 기록했습니다.

## 2026-09-29 기존 component 상호작용 재검사

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| Dropzone native 선택·거부 | pass (limited) | PNG 2개 선택, TXT 형식·128KB 초과·3개 선택 거부, 기존 선택 유지 |
| Calendar 범위 | pass (limited) | `min={1}`에서 시작 날짜 미완료, 종료 날짜 선택 후 9월 15–18일 표시 |
| Calendar 시간대 | inspected | 9.14.0의 `TZDate`·`timeZone` 타입과 Asia/Seoul preview 확인 |
| Slider 다중 thumb | pass (limited) | 두 thumb의 AX 이름, ArrowRight/ArrowLeft로 20–80 → 21–79 |
| Avatar 이미지·fallback | pass (limited) | 로컬 SVG 로드, 깨진 이미지·이미지 없음의 텍스트 fallback |
| 저장소 검사 | pass | typecheck·build·registry:check·diff --check |
| OS 파일 drag/drop·touch·실제 screen reader | unverified | Chromium의 file chooser·키보드 검사와 별개 |
| 다른 호스트 시간대·RTL | unverified | timezone prop 연결과 같은 시간대 브라우저 표시만 확인 |

재현 조건과 범위는 `.worknotes/component-foundation-interactions-2026-09-29.md`에
기록했습니다.

## 2026-09-29 SegmentedControl

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| 패키지 테스트 | pass | 전체 41개, 새 그룹 의미·form name·누락 설정 2개 포함 |
| 저장소 typecheck·build·registry:check | pass | 90개 item·88개 component 대응 |
| 문서 Chromium | pass (limited) | click, ArrowLeft 선택, disabled 항목, `compact` form 값 |
| 밝은·어두운 모드, 390px | pass (limited) | token 표시와 좁은 화면에서 항목·상태 유지 |
| 개별 registry 소비자 | pass | CLI 4.21.0 설치 3개 파일, 소스 일치·typecheck·build |
| 전체 registry 소비자 | pass | 90개 동시 설치, 92개 파일 일치·typecheck·build, Chromium 207개 값 export 로딩·console error 0건 |
| 실제 screen reader·RTL·touch·다른 브라우저 | unverified | Chromium의 DOM·키보드·화면 검사와 구분 |
| 88개 catalog 사용 코드 전체 재검사·갱신 충돌·공개 배포 | unverified | 새 코드의 저장소 typecheck·격리 소비자 검사만 수행 |

설계 선택, 처음 시도한 Radix 기반 구현의 방향키 결과와 fixture
경로는 `.worknotes/component-segmented-control-2026-09-29.md`에
기록했습니다.

## 2026-09-29 SplitButton 조합 예시

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| 저장소 typecheck·build·registry:check·diff 검사 | pass | 90개 item·88개 component 대응, 기본 공개 registry URL; 문서 bundle 크기 경고 남음 |
| 문서 Chromium | pass (limited) | 기본 실행, 메뉴 선택, Enter 열기·첫 항목 focus, Escape 닫기·focus 복귀, 밝은·어두운 모드 |
| 기존 90개 item 소비자 typecheck·build | pass | 문서 사용 코드의 package 경로를 설치된 registry import로 바꿔 실행 |
| 소비자 Chromium | pass (limited) | 207개 export 로딩, 기본 실행·CSV 선택, console error 0건 |
| 실제 screen reader·touch·RTL·다른 브라우저 | unverified | Chromium의 keyboard·화면 검사와 별개 |
| 갱신 충돌·복구·공개 배포 | unverified | 새 item이나 package API 변경 없음 |

fixture와 판정은
`.worknotes/component-split-button-recipe-2026-09-29.md`에 기록했습니다.

## 2026-09-29 CitationList

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| 패키지 테스트 | pass | 전체 44개; 새 목록·링크·빈 상태·중복 ID·URL scheme 검사 |
| 저장소 typecheck·build·registry:check | pass | 91개 item·89개 component 대응, 기본 공개 registry URL 복원 |
| 문서 Chromium | pass (limited) | 출처 이름·URL, pointer·Enter 표시 전환과 빈 상태, 밝은·어두운 모드, 390px 폭·console error 0건 |
| 격리 소비자 설치 | pass | CLI 4.21.0으로 citation-list·utils·tokens 3개 파일, component 소스 일치 |
| 소비자 typecheck·build·Chromium | pass (limited) | pointer 빈 상태, Enter 카드·출처 복귀, 링크 이름·URL, console error 0건 |
| 현재 91개 item 동시 설치 | pass | CLI 4.21.0, 93개 파일 원본 일치·typecheck·build, Chromium 208개 export 로딩·console error 0건 |
| 실제 screen reader·touch·RTL·다른 브라우저 | unverified | native 의미와 Chromium 결과와 구분 |
| 외부 링크 이동·기존 소비자 갱신·공개 배포 | unverified | HTTP(S) URL과 target 속성만 확인 |

fixture와 upstream 고정 revision은
`.worknotes/component-citation-list-2026-09-29.md`에 기록했습니다.

## 2026-09-29 catalog 사용 코드의 독립 TSX 검사

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| 사용 코드의 TSX 문법 | pass | 89개 catalog 항목을 `registry:check`에서 파싱; 나란한 JSX가 있던 20개 수정 |
| package tarball 소비자 typecheck | pass | 89개 코드를 독립 TSX로 추출해 `@pydemia/ui` import 검사 |
| registry 설치 소스 소비자 typecheck | pass | 89개 코드를 91개 item 설치 파일의 직접 import로 검사 |
| 저장소 typecheck·build·registry:check·diff 검사 | pass | 기본 공개 URL 구성의 91개 item·89개 component |
| 문서 Chromium | pass (limited) | Button·DataChart preview와 수정한 사용 코드 표시; DataChart error log 0건 |
| 89개 예시의 개별 브라우저 상호작용 | unverified | 독립 TSX 정적 검사와 구분 |
| 실제 보조기술·touch·다른 브라우저 | unverified | Chromium 화면 검사와 구분 |
| 기존 소비자 갱신·충돌 및 공개 배포 | unverified | 이번에는 새 소비자 typecheck만 수행 |

fixture와 수정 대상 20개는
`.worknotes/component-catalog-usage-2026-09-29.md`에 기록했습니다.

## 2026-09-29 AppShell floating 도움말 조합

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| 저장소 typecheck·build·registry:check | pass | 89개 component·91개 item, 공개 기본 URL |
| catalog package·registry 소비자 typecheck | pass | 89개 사용 코드 각각, 변경한 AppShell 예시 포함 |
| 문서 Chromium | pass (limited) | bubble click·Enter·Space, `aria-expanded`, Tab으로 닫기 이동, Escape·닫기 후 focus 복귀, panel 배치 |
| Operations workspace Chromium | pass (limited) | 도움말 열기·닫기, bubble focus 복귀, console error 0건 |
| 실제 screen reader·touch·RTL·390px·다른 브라우저 | unverified | Chromium keyboard·화면 검사와 구분 |
| 기존 소비자 갱신·공개 배포 | unverified | 문서와 예시만 변경 |

설계 근거와 범위는
`.worknotes/component-floating-help-2026-09-29.md`에 기록했습니다.

## 2026-09-29 Registry 내용 해시 snapshot

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| snapshot 생성 | pass | 91개 item JSON과 manifest, 동일 ID의 내부 의존성 URL |
| 재생성·변조 회귀 시험 | pass | 같은 내용의 ID 재사용, 변경 시 새 ID, 이전 파일 보존, 파일 변조 실패 |
| 저장소 typecheck·build·registry:check | pass | `docs/r/releases/` 92개 파일 일치·SHA-256, 최신 `/r/` 유지 |
| 로컬 개발 서버 | pass (limited) | snapshot item과 manifest HTTP 200 |
| 공개 snapshot URL 및 pinned 소비자 설치 | unverified | commit·push·공개 배포 전 |
| 이전 공개 버전 갱신·충돌·복구 | unverified | 기존 소비자 시나리오 미실행 |

ID와 재생성 절차는
`.worknotes/component-registry-release-2026-09-29.md`에 기록했습니다.

## 2026-09-29 공개 버전 소비자 갱신·충돌

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| 직전 공개 registry 조회 | pass | 공개 `registry.json` 40개 item, 현재 로컬 91개 |
| 공개 40개 item 신규 소비자 설치 | pass | CLI 4.21.0, 40개 파일, typecheck·build |
| 현재 91개 item으로 갱신 | pass | `--overwrite`, 최종 93개 파일 원본 일치·typecheck·전체 모듈 build |
| 갱신 소비자 Chromium | pass (limited) | 210개 값 export 로딩, console error 0건 |
| 수정 Badge·Button 충돌 | pass | 기본 설치에서 파일 보존; 명시적 덮어쓰기에서 소비자 수정 소실 |
| Badge 수정 복구 | pass | `--diff`로 한 줄 확인 후 새 소스에 재적용, 새 variant·radius의 typecheck·build·브라우저 표시 |
| 기본 공개 URL 복원 | pass | 저장소 build·registry:check, 생성 JSON 의존성 URL 확인 |
| snapshot 공개 URL 설치·장기 보존 | unverified | 새 경로는 현재 공개 사이트에서 HTTP 404 |
| 제품별 수정의 자동 병합·실제 보조기술 | unverified | 대표 충돌·수동 재적용 검사와 구분 |

fixture 경로와 충돌 재현 단계는
`.worknotes/component-registry-upgrade-2026-09-29.md`에 기록했습니다.

## 2026-09-29 Registry import 의존성 감사

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| source import와 item metadata 대조 | pass | 91개 item의 정적 import/export 선언, 직접 registry·npm 의존성 |
| 누락 탐지와 수정 | pass | SearchInput·NumberInput의 `./utils` 누락을 탐지하고 `pyd-utils` 선언 추가 |
| 새 snapshot | pass | 91개 item의 새 내용 해시 ID, 이전 ID 보존, 생성된 `docs/r/releases/` 일치 |
| 저장소 typecheck·build·registry:check·diff 검사 | pass | 기본 공개 URL로 생성한 registry, 89개 export·catalog 대응 |
| 변경 item 개별 CLI 설치·공개 URL | unverified | metadata 검사와 생성 JSON 검증 범위 밖 |

세부 내용과 새 snapshot ID는
`.worknotes/component-registry-import-audit-2026-09-29.md`에 기록했습니다.

## 2026-09-29 Navigation 표시 형태

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| package 테스트 | pass | 45개; 새 variant의 링크·`aria-current`·class 적용 |
| 저장소 typecheck·build·registry:check | pass | 89개 component·91개 item, 새 navigation source와 snapshot |
| 문서 Chromium | pass (limited) | 밑줄형·채움형 전환, 밝은·어두운 모드의 계산 색상, console error 0건 |
| 별도 소비자 갱신 | pass | CLI 4.21.0, navigation.tsx 원본 SHA-256 일치, 새 variant typecheck·build |
| 실제 screen reader·touch·라우터 연동 | unverified | native 링크 semantics와 로컬 Chromium 검사 범위 밖 |
| 공개 snapshot URL 설치 | unverified | commit·push·공개 배포 전 |

설계와 fixture 경로는
`.worknotes/component-navigation-variants-2026-09-29.md`에 기록했습니다.

## 2026-09-29 현재 registry와 snapshot 릴리스 검사

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `registry-release.test.mjs` | pass | 기존 ID의 재사용·변조 실패, 현재 item 변경과 게시용 최신 JSON 누락의 실패 |
| `registry:release-check` | pass | 현재 91개 item과 지정한 로컬 ID, 생성된 `docs/r/` 92개 최신 JSON 일치 |
| 변경 기록·실행 절차 | 작성 | `CHANGELOG.md`의 Unreleased 항목과 README의 릴리스 검사 명령 |
| 공개 snapshot 설치·과거 ID 보존 | unverified | 아직 commit·push·공개 배포 전 |

검사 방법과 ID는
`.worknotes/component-release-check-2026-09-29.md`에 기록했습니다.

## 2026-09-29 DataChart 극값 계산

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| package 테스트 | pass | 46개; `line`·`bar`·`area`·`stacked-bar`의 양·음 극값에서 `NaN`·`Infinity` SVG 출력 없음 |
| typecheck·build·registry:check | pass | 89개 component·91개 item, 이전·현재 snapshot 검사 |
| 현재 release 검사 | pass | 새 내용 해시 ID와 빌드된 registry·`docs/r/` 최신 JSON 일치 |
| 실제 브라우저 극값 표시·screen reader | unverified | server render 회귀 시험 범위 밖 |
| 공개 URL 설치 | unverified | 새 후보는 production 배포 전 |

수정 배경과 후보 ID는
`.worknotes/component-release-review-2026-09-29.md`에 기록했습니다.

## 2026-09-29 Registry CI 검사

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `registry:release-check` 무인자 실행 | pass | 빌드된 91개 item의 내용 해시를 계산해 현재 snapshot과 `docs/r/` 대조 |
| release 회귀 fixture | pass | ID 생략·명시, 현재 item 변경, 게시용 최신 JSON 누락 탐지 |
| GitHub Actions workflow | pass (PR) | PR #1 run 36572011594의 Node 24 typecheck·테스트·build·release·`docs/` diff 통과; `main` push 실행은 미검증 |

검사 범위와 원격 실행 결과는
`.worknotes/component-ci-gate-2026-09-29.md`에 기록합니다.

## 2026-09-29 production registry 배포

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `main` push CI | pass | 병합 커밋 `092b748`의 run 36573529988 성공 |
| Vercel production | pass | 병합 커밋 배포 READY, 문서에 89개 목록·Spinner 예시·분석 화면 렌더링 |
| 현재·이전 snapshot URL | pass (limited) | 두 ID의 공개 manifest·Button JSON HTTP 200, 저장소 파일 SHA-256 일치 |
| 현재 ID CLI 소비자 | pass (limited) | Button·DataChart·token 설치, typecheck·build; DataChart 상호작용 미실행 |
| 이전 ID CLI 소비자 | pass (limited) | Button·token 설치, typecheck·build |
| 전체 개별 공개 설치·장기 보존 | unverified | 두 ID의 선택한 item과 이번 배포만 확인 |
| 실제 보조기술·touch·drag/drop·다른 시간대 | unverified | 이번 릴리스 검사에서 실행하지 않음 |

실행 명령, fixture 경로와 병합·배포 ID는
`.worknotes/component-production-release-2026-09-29.md`에 기록했습니다.

## 2026-09-29 공개 component 후속 검토

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| 문서 Usage 설치 폐쇄 검사 | pass (local) | 89개 import와 `installItems`·registry 의존성 대조; 누락 19개 수정 |
| DataChart 경계값 회귀 | pass | 단일·동일 `±Number.MAX_VALUE`의 유한 SVG 좌표, 빈 점의 접근 가능한 행 이름 |
| package 테스트 | pass | 48/48 |
| typecheck·build·registry:release-check | pass | 91개 item, 89개 export/catalog, 새 로컬 snapshot 일치 |
| 로컬 Sidebar 문서 | pass | Usage의 AppShell import와 Sidebar·AppShell 설치 URL 표시 |
| DataTable 옵션 동적 변경 | inspected | 코드 경로 수정; 브라우저 갱신은 미실행 |
| CI untracked 생성 파일 검사 | pass (remote) | PR #2와 병합 커밋의 Verify UI workflow 통과 |
| rollback 뒤 snapshot URL | unverified | 이전 배포에는 신규 ID 파일이 없어 주소 손실 가능; 실제 rollback 미실행 |
| release별 provenance 고정 | incomplete | notice의 `main` 링크는 변경 가능한 출처 metadata를 참조 |

PR #2와 병합 커밋 `cc14188`의 Verify UI CI가 통과했습니다. Vercel
production 배포는 READY이며 공개 Sidebar 문서에서 Sidebar·AppShell
설치 URL을 함께 확인했습니다. 새 snapshot의 manifest·DataChart JSON,
이전 공개 manifest는 HTTP 200이고 저장소 파일과 일치합니다. 새 공개
URL의 Sidebar·AppShell을 기존 Vite 소비자에 설치해 typecheck·build를
통과했습니다. DataTable
옵션 교체 브라우저 검사와 실제 rollback은 실행하지 않았습니다.

독립 검토의 범위와 잔여 문제는
`.worknotes/component-followup-review-2026-09-29.md`에 기록했습니다.

## 2026-09-29 출처 고지 revision 고정

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| 고정 commit의 provenance | pass | 로컬 Git과 공개 GitHub raw 파일이 현재 metadata와 같음 |
| 고지 SHA-256 | pass | LF 기준 현재 metadata의 해시와 고지 값 일치 |
| `npm run typecheck` | pass | UI, 예시, 문서 TypeScript 검사 |
| package 테스트 | pass | 48/48 |
| `npm run build` | pass (retry) | 첫 생성 HTML 접근 오류 뒤 같은 명령 재실행 성공 |
| `npm run registry:release-check` | pass | 91개 item, 89개 export/catalog, 새 로컬 snapshot 일치 |
| 새 snapshot 공개 설치 | pass (limited) | Button 설치·고지 확인, 기존 소비자 typecheck·build |
| 과거 snapshot의 provenance 고정 | incomplete | 불변 고지에는 당시의 `main` 링크가 남음 |

PR #3 병합 커밋 `dd29b56`의 Verify UI CI와 Vercel production 배포가
성공했습니다. 새 manifest·Button JSON과 직전 manifest는 공개 URL에서
HTTP 200이며 저장소 파일과 일치했습니다. 91개 item의 개별 공개
설치와 rollback 뒤 URL 보존은 이 검사 범위 밖입니다.

고정 revision과 새 ID는
`.worknotes/component-provenance-pin-2026-09-29.md`에 기록했습니다.

## 2026-09-29 Markdown 부분집합

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| 패키지 Markdown 테스트 | pass | 서식·절대 링크·위험 링크·원시 HTML·닫히지 않은 코드 fence·빈 입력·깊이 제한·HTML prop 차단 8개 |
| 저장소 typecheck·build | pass | UI·프로필·문서 TS, 92개 registry item 및 문서 빌드 |
| `registry:release-check` | pass | 새 92개 item snapshot과 현재 빌드 내용 일치 |
| 문서 preview | pass (limited) | 원문 편집 뒤 제목·안전한 링크·차단된 링크와 HTML의 텍스트 표시 |
| 새 소비자 단독 설치 | pass | Markdown·utils·tokens 3개 파일, 원본 소스 일치·typecheck·build·브라우저 제목·목록·링크; HTML prop 수정 뒤 최신 item 재설치·typecheck·build |
| package tarball Usage | pass | private package tarball 설치 후 Markdown·Message 사용 코드 typecheck |
| 전체 로컬 소비자 | pass (limited) | 92개 item을 8개 batch로 같은 새 소비자에 설치; 94개 파일 일치·90개 모듈 typecheck·build·Chromium 212개 export·console error 0건 |
| 공개 snapshot 설치·production | pass (limited) | PR #4 병합·main CI·Vercel READY, 운영 preview, 새 ID manifest·Markdown JSON 원본 일치, 공개 URL 설치 소비자 typecheck·build |
| 실제 screen reader·다른 브라우저 | unverified | native 요소의 실제 발표와 기기별 동작 미실행 |

새 ID는
`sha256-70c4a56811508257fe1131e7ab65e3ab3836e60934bba5a16f58c0e8a66fe000`
입니다. 로컬 전체 소비자 검사는 내부 의존성 URL을 로컬 서버로 빌드한
최신 item을 사용했습니다. 같은 ID의 snapshot JSON은 공개 주소를
가리켜 게시 전 로컬 CLI 설치에서 404였으므로, 내부 URL을 운영 주소로
되돌린 뒤 build·release 검사를 재실행했습니다. 단계와 미검증 항목은
`.worknotes/component-markdown-2026-09-29.md`에 기록했습니다.
병합 뒤 공개 설치도 통과했습니다. rollback 후 주소 보존은 미검증입니다.
