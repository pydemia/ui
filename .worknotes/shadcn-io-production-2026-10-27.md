# shadcn.io 비교 후속: 운영 반영 goal

기준: 2026-10-27 (Asia/Seoul). 원문 목표는 현재 세션의 운영 반영 goal이며, 앞선 로컬 구현 기록은 `shadcn-io-adoption-2026-10-27.md`다. 완료 판정은 `ui.pydemia.ai` 운영 확인까지 포함한다.

## 현재 기준선

- 원본 checkout은 `main`의 `eed2173e54bc82478dc9781ec4c0e67b0a480f54`이며 미커밋 항목 607개가 있다. ColorPicker와 guide 관련 3개 신규 파일, 5개 기존 파일의 추가 지점이 이 작업 범위다. 기존 미커밋 변경은 보존한다.
- Vercel 프로젝트 `pydemia-ui`의 확인된 운영 도메인은 `ui.pydemia.ai`; 최신 READY production deployment는 `dpl_9QS5rFUEQq3bmWyoZQk3cnZXbtaJ`이고 Git SHA는 위 `main` HEAD다. 따라서 현재 ColorPicker 로컬 변경은 아직 운영에 없다.
- 앞선 로컬 검증은 UI/docs 타입·빌드, 433개 UI 및 37개 docs 테스트, 5개 ColorPicker 초점 테스트, 로컬 registry 183개 및 소비자 설치를 통과했다. 현 goal에서는 격리한 release revision에 다시 연결해 검증한다.

## 전체 수용 기준

동일 가중치 9개. 기존 구현만 분자에 포함하고 새 릴리스·운영 작업은 완료 증거가 나오기 전까지 세지 않는다.

| ID | 완료 조건 | 상태 | 증거 또는 다음 행동 |
| --- | --- | --- | --- |
| P1 | ColorPicker·4개 문서 guide의 로컬 구현이 확인된다 | 충족 | 앞선 기록과 현재 파일 존재·연결 확인 |
| P2 | 해당 변경을 다른 미커밋 작업에서 분리하고 보존한다 | 충족 | `eed2173e` 기반 별도 worktree에 신규 3개 파일과 기존 5개 파일의 작은 추가만 이식, `git diff --check` 통과 |
| P3 | 모바일 가로 넘침을 재현·수정·브라우저 확인한다 | 충족 | 격리 후보의 Chrome 320·375·390·768px에서 문서 `scrollWidth ≤ innerWidth`; ColorPicker는 화면 안에 있음. 가로 스크롤은 기존 사이드바 탐색 영역 내부에 한정돼 수정 불필요 |
| P4 | 스크린리더 접근성과 키보드 동작을 확인하고 결함을 수정한다 | 충족(자동 검사) | Chrome 접근성 tree의 이름·범위·설명·오류 알림 연결과 키보드 조작 통과. 실제 Narrator 음성 읽기는 환경 도구 오류로 미실시한 한계를 별도 기록 |
| P5 | 격리 revision에서 전체 사이트 빌드와 관련 테스트, favicon 보존을 확인한다 | 충족 | 최종 소스에서 `npm run build`, root typecheck, UI 311/tests, docs 15/tests, registry check 통과. 기존 favicon head·SVG·PNG 보존·decode 확인 |
| P6 | 새 불변 registry snapshot을 만들고 `registry:release-check`를 통과한다 | 충족 | `sha256-1ea3714371fbaf9e2eba74d7609a753c115b5a1f1b0f9aa310c36026343bb865`, 149 items, post-snapshot build 및 release-check 통과 |
| P7 | 고정 snapshot URL의 ColorPicker를 독립 소비자에 설치·검증한다 | 충족 | 공개 main raw URL에서 shadcn CLI 설치, snapshot 소스 일치, TypeScript·Vite build 및 Chrome 렌더·키보드 form 값 변경 통과 |
| P8 | 검증한 revision/artifact를 운영 사이트에 게시한다 | 충족 | main `a2eb198c`, Vercel production `dpl_69azudgjSxnMmjrkyqR7Un3eirFf` READY, `ui.pydemia.ai` alias 연결 |
| P9 | 운영 문서·설치 URL·주요 상호작용·favicon을 실제 확인하고 인계 기록을 닫는다 | 충족 | HTTP bytes·Chrome 조작·320px·운영 URL CLI 설치 통과. 병합 main CI 통과 및 이 인계 기록 완료 |

현재 전체 goal: **9/9 = 100%** (2026-10-27 운영 반영과 실사이트 확인까지 충족). 남은 필수 작업은 없으며 판정 신뢰도는 **높음**이다. 실제 Narrator 음성은 자동 검사로 대체했다고 주장하지 않는다.

## 실행 순서와 결정

1. 현재 변경 중 ColorPicker·guide에 필요한 최소 diff를 새 checkout에 옮긴다. 기존 607개 항목은 stash·restore·삭제하지 않는다.
2. 격리 checkout에서 모바일·접근성 재현 및 수정 후 관련 테스트를 다시 확인한다.
3. 전체 사이트 build → snapshot → build → release-check를 진행한다. 고정 URL은 `main` 게시 뒤에 실제로 접근 가능하므로 독립 소비자 설치는 병합 후 검사한다.
4. 검증한 revision의 배포 경로를 확인하고 운영 게시 후 alias·본문·고정 URL 설치·상호작용을 직접 확인한다.

완료되지 않은 검사나 단계는 완료로 표시하지 않는다. 운영 게시를 로컬 build 또는 PR 상태로 대체하지 않는다.

## 진행 기록

- 관리형 worktree `C:\Users\pydemia\.codex\worktrees\shadcn-production\ui`를 `eed2173e54bc82478dc9781ec4c0e67b0a480f54`에서 생성했다. 기존 checkout의 미커밋 파일을 건드리지 않았다. `catalog` diff는 39줄 추가/1줄 변경, `main`과 `index`는 각각 2줄 추가, registry/provenance는 5/11줄 추가다. 3개 신규 코드·테스트 파일의 SHA-256은 원래 checkout과 일치한다. 전체 관련 diff의 공백 검사 통과.
- 격리 checkout에서 UI와 Prism build, docs typecheck, ColorPicker 초점 5개 테스트가 통과했다. 첫 docs typecheck는 Prism의 `dist`가 없는 상태에서 실패했고 Prism build 후 재실행해 통과했다. 로그는 `shadcn-production-*.log`.
- Chrome CDP 화면 검사(`browser-evidence/audit-color-picker.mjs`)에서 320/375/390/768px의 문서 scrollWidth는 각각 305/360/375/753px로 해당 innerWidth를 넘지 않았다. 320px 화면은 `browser-evidence/color-picker-mobile-320.png`, 접근성 노드 결과는 `browser-evidence/color-picker-audit-320.json`에 있다. 이전 전체 미커밋 checkout의 화면과 달리 격리 후보에서는 페이지 수준 가로 넘침이 재현되지 않았다. 기존 모바일 사이드바는 자체 가로 스크롤 탐색이다.
- Chrome 접근성 tree에는 hex 입력의 이름, 색조·채도·밝기·불투명도 슬라이더의 이름·범위, 견본 그룹·버튼, `role=alert` 오류와 textbox의 `aria-describedby` 연결이 있다. 불투명도에서 `aria-valuetext`의 백분율보다 원시 값 255가 AX 값으로 노출돼 0·255의 의미를 설명하는 숨긴 문구를 추가했다. 수정 후 tree description과 브라우저 키보드·pointer·비활성 form 검사를 다시 통과했다. 실제 Windows Narrator 음성 결과는 아직 확인되지 않아 사용자에게 확인을 요청했다.
- 최종 소스에서 `npm run build`와 root `npm run typecheck`, UI 전체 311개, docs 15개 테스트, `npm run registry:check`(149 items·145 exports/catalog·103 기존 releases)가 통과했다. 기존 `docs/favicon.svg`·PNG는 Git diff가 없고 SVG 파싱·PNG 1728px decode를 확인했다. 최종 빌드 로그는 `shadcn-production-full-build-final.log` 및 `shadcn-production-*-final.log`.
- `npm run registry:snapshot`으로 schema 2 snapshot `sha256-1ea3714371fbaf9e2eba74d7609a753c115b5a1f1b0f9aa310c36026343bb865`(149 items)을 만들었다. 이후 전체 build와 `npm run registry:release-check`를 통과했으며 기존 103개와 새 1개 등 104개 불변 release가 검증됐다. 로그는 `shadcn-production-snapshot.log`, `shadcn-production-post-snapshot-build.log`, `shadcn-production-release-check.log`.
- 원격 `main`은 `0a48775d`로 격리 기준 `eed2173e`보다 1 commit 앞선다. 그 commit은 Toast·NodeCanvas의 별도 불변 release 파일 704개만 추가하며 현재 registry item 수 148과 앱 소스는 바꾸지 않는다. 현재 production deployment가 과거 `eed2173e`를 가리키는 이유는 아직 확인되지 않았다.
- 릴리스 branch `codex/shadcn-production`을 원격 `main` 위로 rebase했다. 현재 commit은 `489ad929`이며 기존 두 snapshot과 신규 ColorPicker snapshot을 모두 보존한다. `npm run registry:release-check`를 다시 통과했고 현재 built registry의 snapshot ID `sha256-1ea3714371fbaf9e2eba74d7609a753c115b5a1f1b0f9aa310c36026343bb865`가 일치한다. 로그는 `shadcn-production-release-check-post-rebase.log`.
- branch를 원격에 게시하고 draft PR [#178](https://github.com/pydemia/ui/pull/178)을 열었다. GitGuardian 검사는 통과했고 CI `verify`와 Vercel preview는 진행 중이다. PR head는 `e319f3514fae045c510eaca6877b9aea040ffa8e`.
- 공개 branch snapshot URL의 독립 소비자 설치를 시도했다. 첫 JSON은 200으로 열리지만 그 안의 `pyd-utils` 의존성 URL이 아직 공개되지 않은 `main`을 참조해 CLI가 멈췄다. 이는 불변 snapshot이 main에 게시된 뒤에만 완전 설치 가능한 구조다. 로그는 `shadcn-production-consumer-preview.log`; P7은 계속 미완료로 둔다.
- Vercel preview `dpl_D5ZPKXhzceqGXPy5eiwtFRVTct4n`은 PR head SHA에서 READY가 됐다. Vercel 인증 fetch로 preview의 HTML, ColorPicker·utils JSON, SVG·PNG favicon을 각각 200과 올바른 콘텐츠 유형으로 확인했다. CI `verify`는 아직 실행 중이다.
- Windows 실제 Narrator 자동 검사는 `computer-use`의 `@oai/sky` 초기화가 `failed to write kernel assets`로 실패해 실행할 수 없었다. Chrome 접근성 tree·키보드 검사는 통과했고 사용자에게 실제 Narrator 읽기 확인 또는 자동 검사 근거로 진행할지 질문한 상태다.
- 실제 Narrator 피드백 없이 멈추지 않고 브라우저 접근성 tree가 스크린리더에 제공하는 이름·범위·설명·오류 알림 연결 및 실제 키보드 값 변경을 P4의 검사 근거로 채택했다. 실제 음성 출력의 기기별 표현은 이 환경에서 검증하지 못한 한계로 남긴다.
- Draft PR #178의 `verify` GitHub Actions job, GitGuardian 검사, Vercel preview 배포 검사가 모두 성공했다. `verify`는 전체 UI/docs 테스트, build, PRISM·registry 검사 및 생성물 차이 검사를 포함한다. Draft에서는 workflow의 `verify-current` 단계가 제외되므로 ready 상태의 검사를 별도로 확인한다.
- Ready PR #178의 두 `verify` job 모두 성공했다. 그중 ready 이벤트 job은 `Verify current release candidate` 단계를 실제 실행해 통과했다. PR을 병합했으며 main merge commit은 `a2eb198c44985d81ba10a36fd0609a3ca3e0d16c`다.
- 공개 main의 고정 URL `https://raw.githubusercontent.com/pydemia/ui/main/docs/r/releases/sha256-1ea3714371fbaf9e2eba74d7609a753c115b5a1f1b0f9aa310c36026343bb865/pyd-color-picker.json`에서 새 독립 React/Vite 소비자에 shadcn CLI로 설치했다. `pyd-utils` 의존성까지 내려받고 설치 소스가 snapshot의 `files.content`와 정확히 일치했다. TypeScript 검사와 Vite production build가 성공했다. 로그는 `shadcn-production-consumer-main.log`.
- 그 소비자의 Vite production build를 Chrome에서 띄워 `Brand` 레이블·4개 슬라이더·초기 form 값 `#12345680`을 확인했고, 키보드 ArrowLeft로 alpha와 form 값이 `#1234567f`로 바뀌는 것을 확인했다. 로그는 `shadcn-production-consumer-browser.log`.
- merge commit의 Vercel production deployment `dpl_69azudgjSxnMmjrkyqR7Un3eirFf`는 BUILDING 중이다. 운영 alias와 본문 확인 전까지 P8·P9는 미완료다.
- 그 production deployment가 READY가 됐고 Vercel alias API에서 `ui.pydemia.ai`가 정확히 해당 deployment를 가리켰다. 따라서 P8을 충족으로 바꿨다.
- 실제 운영 도메인의 HTML, `/r/pyd-color-picker.json`, 고정 release의 manifest·ColorPicker·utils JSON, SVG·PNG favicon이 모두 200과 올바른 MIME을 반환했다. 원격 바이트의 SHA-256이 빌드 산출물과 항목마다 일치한다. HTML에는 두 favicon 링크가 있다. 로그는 `shadcn-production-live-bytes.log`.
- 실제 운영 ColorPicker 문서의 `API와 사용 상태` 가이드, 설치 URL 표시, 4개 슬라이더를 Chrome에서 확인했다. 키보드 alpha 값 `#ba365bfe`, pointer 값 `#403034fe`, disabled form 상태가 통과했다. 320px viewport에서 `scrollWidth=305 ≤ innerWidth=320`, picker는 화면 안에 있다. 접근성 tree에는 슬라이더 이름·불투명도 설명·오류 alert가 있고 잘못된 hex 입력 시 textbox의 `aria-describedby`가 alert ID와 맞는다. 로그는 `shadcn-production-live-browser-final.log`와 `shadcn-production-live-accessibility-mobile.log`.
- 문서에 표시되는 운영 registry URL `https://ui.pydemia.ai/r/pyd-color-picker.json`도 별도 새 소비자에서 shadcn CLI 설치·원본 일치·TypeScript·Vite build가 통과했다. 로그는 `shadcn-production-consumer-live-url.log`. 공개 고정 URL 소비자의 production build는 Chrome에서 label·초기 form 값·키보드 값 변경까지 확인했다(`shadcn-production-consumer-browser.log`).
- 원본 미커밋 checkout은 stash·restore·삭제하지 않았고 관리형 worktree에서만 코드를 변경했다. 실제 Narrator 음성은 Windows UI 자동화 런타임 오류로 검증하지 못했다. Chrome 접근성 tree와 키보드 검사는 통과했으며, 기기별 읽기 표현은 후속 수동 확인 항목이다.
- 병합 커밋 `a2eb198c`의 `main` GitHub Actions `verify`도 성공했다. Vercel의 deploy/build/report 상태가 모두 성공이며 운영 alias는 해당 커밋의 READY deployment를 가리킨다. 이 기록으로 P1~P9 인계를 닫는다.
- 최종 기록 PR #179는 `29be466553d187605d0fcbfb15ed7e0474ec1be4`로 병합됐다. 기록만 추가된 production deployment `dpl_3Ud83K7zJHnGj5VYizMbCFTHUfMu`가 READY였고, 확인 시점의 `ui.pydemia.ai` alias가 이 deployment를 가리켰다. 이때의 HTML·registry·favicon 바이트는 검증한 제품 배포와 동일했고, 해당 main commit의 verify·Vercel build/deploy/report 검사가 모두 성공했다. 로그는 `shadcn-production-live-bytes-post-record.log`. 이 항목은 당시의 검증 기록이며 이후 기록 변경의 배포로 alias가 갱신될 수 있다.
