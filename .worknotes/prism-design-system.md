# PRISM 디자인 시스템 재현 작업

## 요청과 완료 조건

- PRISM-DEV의 공통 UI와 도메인 조합을 pydemia/ui의 `/prism`에 독립 실행 가능하게 구성한다.
- shadcn/ui 기반 기존 primitives를 재사용하고 PRISM 색상·Pretendard·규격을 보존한다.
- 원본 inventory, 디자인 규칙, typed contracts, 상태 fixture, source registry, AI용 manifest·문서를 제공한다.
- 필요한 추가 component를 같은 토큰으로 구성한다.
- 모든 구현 후 배포 화면과 꼼꼼하게 비교한다. 소스 근거와 실제 런타임 증거를 구분한다.
- 배포 URL과 소비자 설치 경로까지 검증한 뒤에만 완료로 처리한다.

## 현재 근거

- 참조: `skccmygit/skax-successionX-frontend` dev `7ecfc9af072d9f4aeb0f4d7706f16bd1a73f2ef9` (2026-10-02).
- 기존 checkout을 사용자 요청으로 fetch 후 fast-forward: dev `7ecfc9a`, origin/dev 일치, clean. 최신 소스 archive는 `/tmp/prism-reference-dev`.
- Chrome 탭 `2089331773`, `http://dev.prism.ai/chat/...`에서 testuser001 로그인과 UI DOM을 확인.
- 런타임 색: base #FDFDFD, LNB #F9FAFC, panel #EEF1F8, border #E3E5E5, primary #2F548C, secondary #FA7C39. Pretendard 적용 확인.
- 새 대화 버튼 높이 40px·radius 8px·font 14px 확인.
- 사용자가 Mac 잠금을 해제할 수 없어 자체 IAB를 사용하도록 지시했다. IAB에서 로컬 `/prism` 및 배포 `http://dev.prism.ai/sample`의 37개 샘플에 접근·DOM·스크린샷이 가능하다. 인증 화면 `/chat`은 IAB에서 빈 화면이지만 공개 sample 경로는 렌더링된다. 기존 Chrome 로그인 세션은 보존했다.
- ui.pydemia.ai와 Vercel 주소는 이 장비의 urllib와 web 도구에서 현재 접근 실패. 게시 상태는 아직 미확인.

## 구현 결정

- 별도 private workspace `@pydemia/prism`과 `/prism` 카탈로그.
- pydemia 일반 카탈로그와 registry snapshot을 보존한다.
- scoped token profile과 portal에도 명시적으로 적용하는 theme wrapper.
- PRISM 전용 registry `/prism/r`, 기존 `/r/pyd-*` 의존성을 명시한다.
- HRX proprietary 코드·로고·인사 데이터는 복사하지 않고 공개 primitive와 자체 구현을 조합한다. 예시는 가상 데이터다.
- `/prism`의 component query, 상태 선택, usage, source link, contract와 JSON manifest를 연결한다.

## 다음 작업

source inventory·규칙 → primitives와 도메인 component → catalog·registry → build·상호작용·설치 검증 → 원본 화면 비교 → 배포·공개 readback.

## 2026-10-03 현재 구현과 검증

- `packages/prism`: 23 typed source groups (24 registry items incl tokens). 버튼·입력·선택·배지·표·탭·피드백·모달·비모달 패널·채팅·후보 카드·8분류 프로필·6-frame·Markdown·포지션 카드·관리 chrome·양식·PDF/출력·레이더/추이·평가/보상/검증/경험/의견·도움말/파일·shell.
- 전체 조합은 `apps/docs/src/prism/workspace.tsx`이며 문서 Workspace에서 실행한다. 가상 데이터만 사용하고 저장/평가/생성 API는 구현하지 않는다.
- 사용자 목표 추가: 원본 모든 컴포넌트의 목적과 스타일을 재현/검증한 뒤 반응형·크기 조절·dynamic sizing 개선도 완료 조건이다. 원본 재현 미완료 상태에서 확장만으로 목표를 완료하지 않는다.
- IAB에서 검색 Enter 선택, checkbox, pagination page2, 달력 선택, PDF 실제 2페이지 렌더·page2·90% zoom, 출력 섹션 선택, Workspace Enter 제출 확인.
- 원본 Button sample의 실제 computed height/font/padding/radius/color와 기본 재현 규격 일치. SixFrame 배포 screenshot 확인 중 docs chrome CSS가 미리보기 h2/label/pre를 덮는 문제 발견·수정. 전체 시각 동일성은 아직 미확인.
- 타입 검사 통과. 초기 8tests 및 확장 11tests 통과; chart SVG title SSR warning은 후속 수정했다. 새 양식/record 변경 뒤 최종 전체 검사를 다시 해야 한다.
- `scripts/verify-prism-consumer.mjs`: 임시 HTTP registry mirror로 workspace와 무관하게 shadcn 4.21로 23items/45files 설치, 소비자 tsc와 Vite production build 성공. 임시 소비자 `/var/folders/ht/0ztx9m_d3xz1lg1m0rsy6bk80000gn/T/prism-consumer-ZJnFks`. 이후 management group 추가됨.
- 원본 inventory 현재 177개이며 직전 집계 specialized69/shared7/pending101. 이것은 시각 일치율이 아니고 source correspondence 집계다. 새 management 직접 source는 다음 inventory 갱신에 반영해야 한다.

## 남은 작업

- 원본 pending 101개를 실제 목적별로 검토하여 구현/조합/전용 recipe 대응을 완성한다. 내부 helper라는 이유로 근거 없이 제외하지 않는다.
- 원본 37개 sample의 상태별 실제 화면/DOM 수치 비교를 완료하고 `research/verification.md` 및 machine-readable 검증 증거에 남긴다.
- 원본 일부 full-domain/admin 화면은 sample이 없으므로 source+logged-in Chrome에서 read-only 근거 확보. 모든 업무 로직을 복제하는 것은 목표가 아니다.
- 필드·포털·패널·full profile·PDF·모바일 상호작용과 크기 조절 검증, 기존 일반 catalogue 상태별 확인.
- 이후 반응형 및 크기 조절 기능을 source baseline과 구분하여 구현한다.
- 최종 전체 gates·generated docs·README·CI·registry snapshot·공개 배포 및 ui.pydemia.ai/prism readback. 아직 commit/push/deploy 안 함.

## 2026-10-03 자체 브라우저 확장 검증

- 38 source groups / 39 registry items까지 구현했다. 전용 맥락 입력, 포지션 요구 사항, Risk·진단·경험·분석, 목록·Board·메모, 공지·방침, structured response, 기준 편집·대체 매핑, 선택 가능한 표, 접근·오류 화면, 도메인 양식, 출력 페이지, 초기 채팅과 8분류 조합을 추가했다.
- 원본 벡터 87개는 디자인 형상 동일성을 위해 자산으로 보존하고 typed React adapter 및 인스턴스별 SVG ID를 추가했다. 일반 업무 component 코드와 API는 복제하지 않았다. 이 결정은 앞선 '로고도 복사하지 않는다'를 자산에 한해 변경한 것이다. 권리·참조 revision은 THIRD_PARTY_NOTICES.md에 명시했다.
- 원본 inventory는 기존 177개 + 누락된 인증/오류/레이아웃 5개 + 벡터 87개 = 269개. target correspondence를 전부 기록했지만 이 집계는 시각/상태 검증 완료가 아니다. auth bootstrap은 원본에서도 독립 시각 출력이 없어 host-owned-nonvisual로 기록했다.
- 자체 IAB에서 공개 sample 37개의 기본 AX·computed style·JPEG를 로컬 `.worknotes/browser-evidence/`에 저장했다. 원본 기록은 로컬 전용이며 gitignore 처리했다. viewport 아래 내용과 열린 메뉴·상태까지 전부 검증한 것은 아니다.
- IAB 관리자 공지: 제목/본문 + 전체 회사 → 등록 가능, 회사 선택 비활성화; 팝업 → 게시기간 필수; 유효 시작/종료일 → 저장 의도 callback; 팝업 OFF → 두 날짜 null 확인.
- IAB 사용자: 회사 그룹 선택 → 2개 회사 표시; 그룹 미지정 역할 변경 → 회사 그룹 입력 숨김 확인.
- IAB 방침: sandbox='allow-same-origin'이며 scripts 없음, 문서 높이 120px, v1→v2 iframe 본문 변경 확인. 비모달 공지 aria-modal 없음, 다음 공지 2/2 표시 확인.
- 단위 계약/상호작용 16tests 통과 (IME, 필수/최대선택, 잠긴 행/다른 페이지 선택 보존, nullable Risk·보상 0, rich text sanitization·내부 action, 공지 날짜 초기화와 역할 변경). 이후 벡터 통합·추가 변경 뒤 전체 gates 재실행 필요.
- 최신 typecheck 통과. 새 registry는 39개 생성. 독립 소비자 검증은 이전 23개 상태이므로 39개로 다시 실행해야 한다.
- 파일: local-notice-form, local-user-form, local-policy, local-notice-popup 및 source 37개 기록. 기록용 서버 localhost:5804, UI dev localhost:5190.
- 아직 남은 일: 상태별 배포/로컬 비교, 모든 domain 조합 실행, print 실제 분할, PDF fit/resize, Select/MultiSelect 키보드·포커스·선택 요약, 반응형/resize 확장, 소비자 설치와 최종 build, 공개 배포/readback.

## 2026-10-03 컴포넌트 상태와 독립 설치 갱신

- 38개 예시의 공개 상태 114개를 IAB에서 전부 렌더링했다. Preview 누락·중첩 button 없음. 이름 없는 input으로 집계된 항목은 aria-hidden/0px 파일 입력이었다. 이 검사는 픽셀 동일성이나 모든 업무 흐름 검증을 의미하지 않는다.
- Button 아이콘 여백·x-small 14px·solid hover overlay, Favorite 20px/#FBBC05, 선택 hover Blue300/#2E8ED9·선택 글자 Blue400/#0072C6, Switch off #B6BEC9를 원본 SCSS/배포 수치에 맞췄다.
- Dialog width 440/560/620 및 Confirm 440px 규격, Sidebar 하위 메뉴/기록 이름변경/프로필 팝오버, 달력 320px/연도 선택을 확장했다. Confirm busy 시 Escape·취소 차단 확인. 최신 패키지 재빌드 후 키보드로 연 Dialog의 닫기→열기 버튼 복귀 포커스 확인.
- Profile 8개 탭 recipe가 실제 렌더되며 성공경험 주제 전환·의견 추가 callback을 확인했다. 전체 인증된 domain 페이지와 픽셀 비교는 남아 있다.
- typecheck, prism:check 및 계약 19 tests 통과. 기존 일반 registry 135개/카탈로그 133개/불변 release 61개 보존 검증 통과.
- 독립 소비자에 현재 PRISM 39 items/61 files 설치 후 tsc/Vite build 성공. 소비자 경로: /var/folders/ht/0ztx9m_d3xz1lg1m0rsy6bk80000gn/T/prism-consumer-8ld4wF.
- 전체 사이트 build 1회 통과했다. 그 뒤 입력 clear/진행률 variants/툴팁 화살표와 Dialog 포커스 수정이 추가되어 최종 gates 갱신은 다시 필요하다.
- baseline 기능 목적별 구현은 모두 존재하나 시각 검증은 부분 완료다. 패널 수동 resize와 container-width responsive shell 구현을 시작한다. 공개 배포와 전체 source parity는 아직 완료로 표시하지 않는다.

## 2026-10-03 크기 확장과 최신 설치 검증

- Panel의 opt-in 드래그·키보드·초기화, controlled width와 부모 폭 clamping을 구현했다. 440→520px pointer drag, Left 456·Home 320·End 800·double click 440을 IAB에서 확인했다.
- Workspace는 실제 컨테이너 768px breakpoint로 Drawer/desktop 탐색을 전환한다. 열려 있던 Drawer를 넓은 화면에서 닫고 header 포커스 및 draft 보존을 확인했다.
- PDF에 height·min/max zoom을 추가하고 fit의 중복 여백을 고쳤다. 320/390/1024px iframe의 너비 맞춤 canvas는 254/324/958px이며 page 2·200% 내부 스크롤에서 root 폭이 유지된다.
- CandidateCard의 white brief·평가 이력·준비된 보상 문자열·20px Favorite와 stack/pair/grid/panel 배치를 보완했다. 요약 영역 클릭은 상세를 열고 Favorite 클릭은 즐겨찾기만 바꾼다. 실제 인사 데이터·사진은 사용하지 않았다.
- Responsive 문서에 실제 iframe과 component 선택을 추가했다. IAB viewport override가 적용되지 않았던 local-panel-mobile 기록은 무효 처리했다. 388px frame 프로필 기록은 실제 390px 기록으로 대체했다.
- 38개 기본 예시를 320px iframe에서 검사해 record/profile-sections의 grid intrinsic width 넘침을 수정했다. 재검사 root overflow 0개. 표와 탭은 내부에서 스크롤한다.
- 최신 114개 fixture 상태: render 누락·nested button·unlabelled visible input 0개. Dialog busy Escape/닫기 차단 및 opener 포커스 복귀, 삭제 요청 전 1개→fixture 확인 후 0개 DOM 기록을 새 증거로 확인했다.
- 최신 typecheck·PRISM21 tests·pydemia219 tests·일반 registry135/catalog133/immutable61 검증 통과. 소비자39 items/61 files 설치 및 tsc/Vite 성공: /var/folders/ht/0ztx9m_d3xz1lg1m0rsy6bk80000gn/T/prism-consumer-0Gf4vf.
- Vercel pydemia-7822 계정의 pydemia-ui 프로젝트를 확인하고 로컬에 연결했다. 프로젝트 root `.`, npm ci/npm run build/output docs. IAB public /prism은 현재 404다. 연결이 자동 생성한 .env.local은 읽지 않고 삭제했다. .worknotes와 .env*는 .vercelignore에서도 제외한다.
- 전체 source 시각/상태 비교는 부분 완료이며 goal은 active다. 공개 배포/readback과 source push는 아직 미완료다.

## 2026-10-03 공개 배포 제한

- `vercel deploy --prod --yes`는 api-upload-free 일일 5000 요청 제한으로 실패했다.
- `vercel deploy --prod --yes --archive=tgz`는 52.4MB 압축 업로드를 완료했으나 api-deployments-free-per-day 일일 100회 제한으로 배포 생성이 실패했다. 새 production은 없다. 같은 조건에서 반복하지 않는다.
- 공개 `https://ui.pydemia.ai/prism`은 IAB에서 404 확인. 로컬 전체 npm run build와 staged diff --check는 통과했다.
- `.env.local`은 삭제되었고 credential 파일이나 브라우저 원본 증거는 staging/배포 입력에 포함하지 않았다. 원격 push와 commit은 아직 하지 않았다.
- 자체 브라우저의 공개 sample 상태별 비교를 계속한다. 인증 domain 화면과 공개 배포 제한은 별도 미완료 범위다.

## 2026-10-03 상태 비교 및 원격 변경 확인

- Select의 readOnly·크기·검색 header·native required/FormData/reset·방향키 처리를 보완했다. uncontrolled/controlled reset과 필수 입력 검증을 추가해 PRISM 계약 23 tests가 통과했다. typeahead 런타임은 아직 미검증이다.
- 원본 Candidate Common은 후보 카드가 아니라 Skeleton·NoData·Summary·Empty/Error helper 샘플이다. Skeleton 3x120/2x60, NoData 13px/15px, Summary 88px/empty49px, empty175px/error236px을 배포 DOM 수치에 맞췄다. Tooltip 클릭/Escape는 확인했으나 hover/focus-only 런타임은 미검증이다.
- 그룹 2개 회사 선택 및 저장 의도, 포지션 중복 하위직무 거부·전문성3/경험2 선택 제한·해제·생성/저장 의도 확인. 실제 업무 API를 호출하지 않았다.
- 실제 320px iframe에서 현재 공개 상태 115개를 검사해 렌더 누락·중첩 버튼·root/nested 가로 넘침 0개 확인. 기존 visible label 검사114상태와 수정 후 field5상태 결과를 구분했다.
- PAT를 프로세스 한정으로 사용해 origin fetch 성공. demian credential config hash 보존. local HEAD f3a0162 대비 origin/main f4ee2a1이 15 commits 앞서 있다. 소스 변경 체크포인트 후 최신 원격을 반영하고 generated docs와 전체 gates를 갱신한다. 이전 generic219/135/133/61 수치는 새 remote 기준 결과가 아니다.

## 2026-10-03 원격 통합 및 설치 검증

- 체크포인트 75eafb8과 codex/prism-checkpoint-20261003 브랜치에 변경을 보존한 뒤 origin/main f4ee2a1에 rebase했다. source commit은 5859fd7. CI scope는 원격의 change-based 규칙을 보존하고 PRISM gate만 추가했다. packages/ui·generic catalog·registry/releases 소스는 원격과 동일하다. generated docs는 병합본에서 재빌드한다.
- npm ci·전체 build·typecheck·PRISM23tests·generic237tests 통과. 일반 registry139/catalog137/immutable68 및 current release sha256-d8bd8996d3f0ad4dad3133de01626182d4c111a4c97664864f9b5a32403c194b 검증 통과.
- 독립 소비자 설치 도중 ENOSPC 발생. 이번 작업의 이전 소비자5개에서 node_modules만 정리했다. source·lockfile·dist·증거는 보존했으며 여유2.2GiB 복구. 재설치39items/61files가 통과했다.
- 소비자 CSS에서 폰트가 자동 로드되지 않던 지침을 보완했다. prism.css가 pretendard npm package의 variable CSS를 import하며 패키지 폰트 bytes를 빌드 출력과 SHA256 비교한다. prism-icon registry에 PRISM_ASSET_NOTICES.md를 함께 설치한다. 39items/62files·tsc·Vite·font hash·notice 검증 성공: /var/folders/ht/0ztx9m_d3xz1lg1m0rsy6bk80000gn/T/prism-consumer-SH8HaA.
- 디스크 오류 후 CUA 자체 브라우저 ID3와 iab는 unavailable이고 inventory=[]다. Codex 패널 열기 응답도 없어서 요청을 종료했다. Mac 잠금 해제/앱 재시작/기존 로그인 변경은 시도하지 않았다. 원본 상태별 새 런타임 관찰은 브라우저 연결 복구 후 이어가야 한다.
- 저장한 원본 default DOM 및 SCSS를 비교해 Toast 아이콘/본문 gap이12px로 잘못 공유되던 부분을6px로 수정했고 close20px·contentgap4px을 맞췄다. 해당 수정의 소스 근거는 있지만 새 런타임 증거는 아직 없다. 전체 build 및 소비자 검증을 이 변경 뒤 다시 갱신한다.

- Toast 수정 후 전체 npm run build와 docs typecheck 및 PRISM source/registry check 통과. 최종 독립 소비자39items/62files 설치·tsc/Vite·font bytes·notice 검증 성공: /var/folders/ht/0ztx9m_d3xz1lg1m0rsy6bk80000gn/T/prism-consumer-Xx25Y4. 소비자는 모든 설치 모듈을 컴파일하지만 runtime demo는 Button 하나이며 모든 컴포넌트의 실제 브라우저 실행 증거로 해석하지 않는다.

## 2026-10-03 최신 원격 및 최종 gates

- 최종 fetch에서 origin/main이43d1b3c까지 추가2commits 앞서 있어 TreemapChart와 public release 기록도 반영했다. 원격 기준 f3a0162 이후 총17commits다. 작업 두 커밋을 다시 rebase하여4503dea/637b521로 보존했다.
- 병합 source에서 전체 build·docs/profile-demo typecheck·generic242 tests·PRISM23tests 통과. generic140 registry items/138 catalog entries/69 immutable releases와 current sha256-89c86a0be4705c8b66e8ba4bb6d9c83cc3e4fce2a499314871c130c73dbd63e7 검증 통과.
- 최신 generic 의존성까지 사용한 최종 독립 설치39items/62files·tsc/Vite·폰트bytes·notice 확인 성공: /var/folders/ht/0ztx9m_d3xz1lg1m0rsy6bk80000gn/T/prism-consumer-2b8kAS. PRISM registry SHA256 de0aa212f77f0528b3713e87818927baa4e4d6b0170e0a089c3394536a41db2f.
- 115개 상태/320px 결과는 portable font 및 Toast 구조 수정 전의 실제 브라우저 결과이며4503dea 기준으로 명시했다. 이후 브라우저 disconnected 상태이므로 최신 runtime이라고 표시하지 않는다. 소스/build/소비자 검증과 런타임 근거를 분리했다.
- standalone font/Toast 소스 후 전체 스타일·모든 상태 비교·로그인 domain·print 실페이지·hover/focus·공개 배포/readback 미완료. Goal은 active다. 원본일치 전체완료를 주장하지 않는다.

## 2026-10-03 원격 push 및 배포 실패 원인 수정

- bb351eb76634bbd72b06291ffa4270fa9332a0ae를 main에 push 성공. ls-remote가 로컬HEAD와 일치했다. credential source config hash 보존 및 변경된 commit 파일 credential exact-match 0개 확인. checkout clean.
- GitHub Verify UI run37087870423가 모든 step 성공했다. Pages run37087870261 build/deploy/report도 성공했다. 기존 Pages 설정은 main:/docs, CNAME ui.pydemia.ai다. 하지만 요청 domain의 /prism·components.json·registry.json은 실제 HTTP404다.
- 기존 Vercel Git 연동이 dpl_2DW976XT6nZiYWsvs5gh7xkqUabv를 만들었으나 npm run build 중 ENOENT apps/docs/public/prism/research/verification.json으로 실패했다. CLI 일일 quota와 다른 새 원인이다. inspect --logs에서 확인했다.
- .vercelignore docs/가 모든 basename docs 폴더를 제외하는 것이 원인이다. 루트 output만 제외하는 /docs/로 변경했다. installed ignore parser로 before/after를 확인: docs/index.html 제외 유지, apps/docs의 package.json·catalog.tsx·verification.json은 이제 포함된다. 기존 Git 배포에 source fix를 반영한다.
- AI usage audit에서 추가9그룹+page-state의 code가 import-only인 것을 발견했다. 목적/typed props는 존재하지만 이 그룹의 구체적인 usage snippets와 consumer example typecheck 보강을 후속으로 진행해야 한다. 원본 style/state 전체 비교를 대체하지 않는다.

## 2026-10-03 배포 제한 재확인 및 다음 작업

- source-ignore fix와 PRISM의 명시적 pretendard dependency를 d263741341f86cd8c1dcc2423dd6a5b5af68c9fd로 push했고 원격 SHA 일치 및 demian credential config 보존을 확인했다.
- 최신 Vercel commit status: failure, Deployment rate limited — retry in 24 hours, build-rate-limit. 같은 조건에서 추가 배포나 빈 push를 하지 않는다. 요금제나 DNS를 변경하지 않았다.
- d263741 Pages build/deploy/report 성공. Verify UI run37088415938/job111103344802는 마지막 조회에서 진행 중이었다. bb351eb 전체 Verify UI는 success다. packaging fix의 최종 CI는 다음 조회에서 확인한다.
- /prism·components.json·registry.json 최신 HTTP404. HTTP readback은 브라우저 렌더를 의미하지 않는다. CUA browser inventory는 계속 []다. 앱 재시작이나 Mac 잠금 해제는 시도하지 않았다.
- 다음 독립 작업: context/primitives/position/assessment/collection/notice/response/management-tools/directory/page-state 10그룹의 import-only usage를 실제 props 예시로 보완하고 설치 소비자의 snippet typecheck를 추가한다. typed contracts와 합성 데이터만 사용한다. 원본 상태별 비교·인증 domain·print 페이지 확인은 브라우저 연결 복구가 필요하다.
- 115개 상태/320px browser evidence는4503dea 기준이다. 최신 font/Toast는 source/build/consumer만 확인했고 browser 확인이 남아 있다. Goal active이며 전체 원본 일치와 공개 배포 완료는 미선언이다.

- 최종 d263741 Verify UI run37088415938도 completed success이며 실패 step은0개다. 원격 CI까지 통과했다. 세션 결과는 이 로컬 worknote에 보존하고 동일 quota 상태에서 추가 push/deploy를 하지 않는다.

## 2026-10-03 설치용 Usage와 예시 계약 보강

- context/primitives/position/assessment/collection/notice/response/management-tools/directory/page-state 10그룹의 import-only code를 실제 props·합성 데이터·상태를 포함한 exported React 예시로 보완했다. page-state의 인증 상태와 retry는 host props로 유지했으며 인증·업무 API를 흉내 내지 않았다.
- AI manifest에 registryUsage와 usageKind를 추가했다. registryUsage는 components.json 기본 aliases.ui의 @/components/ui/prism-*를 참조하고 usage는 private workspace import를 유지한다. 10개 component-example과 28개 integration-fragment를 구분하며 llms.txt에도 설치용 코드를 제공한다.
- 문서 Usage는 registry 경로가 기본이고 Workspace 경로로 전환해 표시된 코드를 복사한다. import alias를 바꿨을 때의 안내와 Pretendard 자동 로딩 지침을 갱신했다. 새 Usage UI의 브라우저 실행은 미확인이다.
- check-prism.mjs는 38그룹의 구체적 JSX와 설치 의존성 안의 import를 검사하고, 10개 완전한 workspace 예시를 TypeScript virtual source로 검사한다. 기존 CI PRISM gate에서 실행된다. 별도 소비자 검증도 설치된 registry 소스로 10개 예시를 타입 검사한다.
- 작업 도중 origin/main이 ef8d2c6(PivotTable)으로 1commit 전진했다. source/generated 변경을 stash에 보존하고 fast-forward했다. 충돌은 생성된 docs 자산/HTML에만 있었으며 upstream docs를 복구한 뒤 병합 소스에서 재빌드했다. upstream의 LF 정규화 수정도 유지했다. packages/ui·generic catalog·registry source/release와 origin/main의 차이는 0개다.
- 최신 전체 build·docs/profile-demo typecheck·PRISM23tests·generic247tests·registry release gates 통과. 일반 registry141/catalog139/immutable70 및 sha256-32c8c4110dd838fedd10716915c72849dd5e35f6977b0dbd010fe9a559d507b9 보존 확인. PRISM registry SHA256은 de0aa212f77f0528b3713e87818927baa4e4d6b0170e0a089c3394536a41db2f로 동일하다.
- 처음 보강한 예시10개는 consumer-z0E5jn에서 39items/62files 설치·tsc/Vite·font bytes·notice 확인을 통과했다. upstream generic metadata 반영 뒤 최종 독립 소비자 consumer-NTZkpM에서도39items/62files 설치·10예시 tsc·Vite·font bytes·notice 확인을 통과했다. 경로: /var/folders/ht/0ztx9m_d3xz1lg1m0rsy6bk80000gn/T/prism-consumer-NTZkpM.
- 현재 own browser inventory=[]이며 /prism·components.json·registry.json HTTP404다. ef8d2c6 Vercel commit status도 Deployment rate limited — retry in 24 hours다. 같은 quota의 수동 배포/빈 push, 앱 재시작, Mac 잠금 해제, 기존 로그인 변경을 하지 않았다.
- 115개 상태/320px runtime 증거는4503dea 기준으로 유지한다. 최신 폰트/Toast·새 예시와 Usage UI·전체 원본 상태 비교·로그인 domain·print 실제 pagination·공개 route/registry readback은 미완료다. Goal active이며 전체 시각 일치/배포 완료를 선언하지 않는다.

- 최종 소비자 성공 후 이 작업의 이전 consumer-z0E5jn/Xx25Y4/2b8kAS에서 node_modules만 정리했다. source·lockfile·dist·증거는 보존하고 최신 NTZkpM 의존성도 유지했다.
