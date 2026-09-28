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
| 실제 screen reader | unverified | 발신자별 이름 있는 group은 유지되지만 보조기술 발표는 실행하지 않음 |

문서 빌드에는 기존의 500 kB 초과 JS chunk 경고가 남아 있습니다.
