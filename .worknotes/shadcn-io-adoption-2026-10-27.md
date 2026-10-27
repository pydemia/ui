# shadcn.io 비교 후 1차 반영: 기획·구현계획·goal 추적

기준: 2026-10-27 (Asia/Seoul). 근거: [비교 검토](shadcn-io-gap-review-2026-10-27.md), 사용자 요청 “반영할 부분이 있다면 기획과 구현계획을 세우고 goal을 실행”. Goal은 이 문서의 **1차 범위**를 검토 가능한 구현·검증 상태로 만드는 것이다.

## 제품 판단

`ui.pydemia.ai`는 React 19·Tailwind 4의 source-owned 라이브러리다. shadcn.io의 항목 수를 따라 늘리기보다 현재 제품의 재사용 수요와 기존 계약의 공백을 기준으로 반영한다.

1차 반영은 **컴포넌트 문서의 사용 가능성**과 **고급 색상 선택**이다. 문서에는 API·키보드·대표 상태를 읽을 수 있는 구조를 추가하고 Button, ColorInput, 새 ColorPicker, Coachmark에 적용한다. 색상 선택은 기존 `ColorInput`의 `#RRGGBB` 계약을 보존하면서 별도 `ColorPicker`로 2D 채도·명도, hue, alpha, hex 입력, 선택적 eyedropper와 form 제출을 제공한다. 테마 토큰 편집기는 현재 6자리 hex 계약을 유지하므로 즉시 교체하지 않는다.

Tour, AI 음성·sandbox·브랜치, 특수 입력, 설치 가능한 블록은 1차 범위에서 제외한다. 현재 재사용 화면과 데이터 계약이 확인되지 않았고, 이들을 컴포넌트 수를 맞추기 위해 추가하지 않는다. 후속 필요가 확인되면 비교 검토의 후보에서 별도 목표로 판정한다. Vue/Svelte/Solid 지원과 장식 효과도 현재 React 라이브러리의 1차 목표가 아니다.

## 요구와 수용 조건

| ID | 근거·요구 | 수용 조건 | 검증 |
| --- | --- | --- | --- |
| SH-01 | 공개 문서 깊이 부족 | 선택한 4개 항목의 props/값 계약, 키보드·접근성, 기본·경계·비활성 상태가 카탈로그에서 보인다. 기존 preview·Usage·설치 경로는 유지한다. | 문서 렌더·카탈로그 검사·대표 화면 |
| SH-02 | ColorInput보다 정밀한 색상 편집 | 별도 ColorPicker가 controlled/uncontrolled `#RRGGBB`·`#RRGGBBAA`, 2D area, hue/alpha, hex 입력, 선택적 swatch·eyedropper를 제공한다. 입력값·출력값 정규화와 alpha 계약을 명시한다. | 단위/브라우저 상호작용 |
| SH-03 | 폼·키보드·실패 동작 | 이름이 있으면 현재 선택색을 native form 값으로 제출한다. keyboard만으로 area·slider·hex·swatch를 조작할 수 있다. disabled/readOnly 및 지원되지 않는 eyedropper 경로는 값을 훼손하지 않는다. | 키보드·폼·오류 시나리오 |
| SH-04 | source-owned 소비자 설치 | 공개 export, registry item, provenance, 카탈로그가 같은 API를 가리킨다. 외부 코드를 복사하지 않고 프로젝트 소스로 작성한다. | registry check, package build, 소비자 설치 검사 |
| SH-05 | 기존 작업 보존 | 기존 ColorInput API와 진행 중인 미커밋 변경을 보존한다. 관련 없는 파일을 되돌리거나 생성물 정리를 위해 삭제하지 않는다. | diff 리뷰 |
| SH-06 | 공개 가능성 | 관련 테스트·typecheck·package/docs build·registry check가 통과하고 대표 브라우저 동작을 확인한다. 불변 snapshot과 `registry:release-check`는 게시 단계의 별도 게이트로 기록한다. | 실제 실행 로그·화면 |

SH-02의 value 계약 초안: 기본은 불투명 `#rrggbb`, alpha가 255 미만이면 `#rrggbbaa`를 내보낸다. `format` 변경이나 HSLA 문자열 API는 1차에서 제공하지 않는다. 내부 HSV는 선택 동작용이며 외부 form 값과 혼동하지 않는다. EyeDropper API는 브라우저 지원 시에만 표시하고 취소 시 값을 유지한다.

## 구현 순서

1. 현재 registry·index·catalog·provenance의 변경 지점을 확인하고, 기존 diff 위에 작은 추가만 한다. `ColorPicker`는 신규 파일로 작성하고 기존 ColorInput은 유지한다.
2. 순수 색상 변환/정규화와 `ColorPicker` UI를 구현한다. pointer와 keyboard의 값 경계를 먼저 고정하고 form/disabled/readOnly/eyedropper를 연결한다.
3. 공개 export와 registry/provenance를 추가한다. 카탈로그에는 원본 사용 코드와 상호작용 preview를 등록한다.
4. 카탈로그 문서 계약을 props·accessibility·상태 예시를 표현하도록 확장해 Button, ColorInput, ColorPicker, Coachmark부터 채운다. 기존 항목의 렌더링은 보존한다.
5. 초점 테스트, 타입 검사, registry check, docs build, 소비자 설치 검사, 대표 화면 검사를 실행하고 실패를 수정한다. 전체 diff와 작업 기록을 검토한다.

## 전체 goal 진행 기준

동일 가중치 7개. 완료는 해당 검증 증거가 있을 때만 센다.

| 기준 | 요구 연결 | 상태 | 증거·잔여 |
| --- | --- | --- | --- |
| G1 범위·수용 조건·구현계획 | SH-01~06 | 충족 | 이 문서와 비교 검토 |
| G2 ColorPicker 핵심 값·상호작용 | SH-02 | 충족 | 구현, 5개 초점 테스트, Chrome pointer·range 확인 |
| G3 폼·키보드·예외 | SH-03 | 충족 | native FormData·controlled·disabled·readOnly·잘못된 hex 테스트, Chrome 화살표 키 확인 |
| G4 export·registry·provenance·catalog | SH-04 | 충족 | `registry:check` 183 items·176 exports/catalog entries, 별도 소비자 설치 |
| G5 문서 구조와 4개 항목 적용 | SH-01 | 충족 | 4개 API/키보드/상태 guide, Chrome 데스크톱 화면 확인 |
| G6 build·registry·소비자·브라우저 검증 | SH-04,06 | 충족 (로컬 범위) | UI/docs typecheck·build, UI 433 tests, docs 37 tests, registry check, 독립 CLI 설치·typecheck, Chrome 동작 |
| G7 전체 diff·기존 변경 보존·인계 | SH-05,06 | 충족 | 추가 지점·신규 파일 검토, `git diff --check` 통과, 이 인계 기록 |

현재: **7/7 = 100%** (2026-10-27, 로컬 구현·검증·인계 완료). 이 로컬 goal의 잔여 예상 시간은 **0시간, 신뢰도 높음**이다. 공개 운영 배포와 불변 snapshot 생성은 이 goal에 포함하지 않는다.

## 구현·검증 기록

- `packages/ui/src/components/color-picker.tsx`에 원본 구현을 추가했다. `#RRGGBB`/`#RRGGBBAA` 정규화, 2D 영역, 색조·채도·밝기·불투명도 range, hex, swatch, 선택적 EyeDropper, hidden form 값을 포함한다. 기존 `ColorInput`은 수정하지 않았다.
- `packages/ui/src/index.ts`, `registry.json`, `registry/provenance.json`, `apps/docs/src/catalog.tsx`에 공개 경로를 연결했다. `apps/docs/src/component-guides.tsx`와 `apps/docs/src/main.tsx`에 Button·ColorInput·ColorPicker·Coachmark의 API·키보드·상태 guide를 연결했다.
- `npm run typecheck -w @pydemia/ui`, `npm run build -w @pydemia/ui`, `npm run typecheck -w @pydemia/docs`, `npm run build -w @pydemia/docs` 통과. UI 전체 433개, docs 37개, ColorPicker 초점 5개 테스트 통과. 5번째 테스트는 EyeDropper 미지원·취소·실패 때 값을 보존하는지 확인한다.
- `npm run registry:build`로 183개 item을 생성하고 `npm run registry:check`로 item·provenance·기존 120개 불변 release·관련 테스트를 확인했다. 로그는 `registry-build-2026-10-27.log`, `registry-check-2026-10-27.log`.
- `.worknotes/browser-evidence/check-color-picker-consumer.mjs`로 독립 Vite 소비자에 shadcn CLI 설치 및 TypeScript 검사를 통과했다. `.worknotes/browser-evidence/verify-color-picker-cdp.mjs`로 Chrome에서 문서 렌더, range 화살표 키, 2D pointer, disabled form 값을 확인했다. 데스크톱 화면은 `browser-evidence/color-picker-guide-local-after.png`.
- 모바일 화면 `browser-evidence/color-picker-guide-mobile.png`에서 ColorPicker 자체는 좁은 영역에 들어가지만 사이트 상단·기존 preview 구조는 가로 넘침이 보인다. 이 작업의 컴포넌트 추가 이전부터 존재하는 레이아웃인지 별도 확인은 하지 않았다.
- `registry:release-check`는 현재 빌드 해시의 snapshot `registry/releases/sha256-0583f2b73bd4e66364c1698627f3a024329ba0b96402ebf49dbfe22a4d780156/manifest.json`이 없어 실패했다. 앞 단계인 `registry:check`는 통과했다. 이 저장소에 600여 개의 다른 미커밋 변경이 있어 현재 전체 registry를 불변 release로 고정하는 `registry:snapshot`은 실행하지 않았다. `docs/r/pyd-color-picker.json`도 아직 없으므로 공개 게시 상태로 해석하면 안 된다. 배포 전에는 전체 변경의 릴리스 범위 합의, site build, snapshot, release-check, 공개 URL 확인이 필요하다.
- 최종 검토에서 신규 3개 소스·테스트 파일과 기존 `index`·registry·provenance·catalog·main의 ColorPicker/guide 추가 지점을 확인했다. 기존 `ColorInput` 소스와 다른 미커밋 변경을 되돌리지 않았다. 관련 추적 파일의 `git diff --check`는 통과했다.

2026-10-27 계획 정정: 최초 SH-06 문구에 `registry:release-check` 통과를 넣었으나, 실제 명령은 현재 전체 registry의 불변 snapshot이 있어야만 통과한다. 이는 로컬 구현 검증이 아닌 게시 전 게이트다. 기존 다수의 병행 변경을 임의로 릴리스에 고정하지 않기 위해 SH-06에서 단계와 상태를 분리했다. 실패 로그는 `registry-release-check-2026-10-27.log`에 보존했다.

## 인계 상태

로컬 구현·검증·관련 diff 리뷰를 마쳤다. 다음 작업자는 현재 저장소의 다른 미커밋 변경을 유지한 채 릴리스 범위를 정해야 한다. 공개 게시 시 `README.md`의 build → snapshot → build → release-check 순서로 진행하고, `docs/r/pyd-color-picker.json` 및 운영 URL을 확인한다. 스크린리더 수동 검토와 좁은 화면에서 관찰된 기존 페이지 가로 넘침의 원인 확인도 후속 검토 항목이다. 관련 없는 변경을 되돌리거나 새 불변 release를 만들지 않았다.
