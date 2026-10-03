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

- push 직전 main이 cbe461c(작업 기록/verification 문서만 변경)으로 전진해 두 작업 커밋을 rebase했다. source44e6a4a/generatedb533c5c로 유지했으며 compiled source의 추가 변경은 없었다. 최초 push 실패 후 GitHub API로 원격이 cbe461c임을 확인했고 같은 일반 push 재시도는 성공했다. 최종 원격main=b533c5c9e0adea0e2fd79310ffd107a1e0cdcff6, local과 일치. credential exact-match0·demian config hash 보존을 확인했다. 최신 CI 결과를 확인한다.

## 2026-10-03 공개 배포 및 live registry 설치 확인

- b533c5c의 Verify UI run37091054547는 completed success다. Pages run37091054112도 success이며 기존 Vercel Git status가 Deployment has completed로 바뀌었다. 이전 quota 조건이 해소된 실제 결과다. 수동 CLI 재배포는 하지 않았다.
- 공개 /prism과 /prism/은 HTTP200이며 module asset은 index-CiHEio8y.js다. components.json(38그룹/10예시)·r/registry.json(39items)·prism-context.json·llms.txt·PretendardVariable.woff2 모두 HTTP200 및 로컬 bytes 일치 확인. HTTP검사는 브라우저 렌더 증거가 아니다.
- 공개URL에서 39items/62files를 직접 설치한 consumer-FVI3xS가 tsc/Vite·10예시타입·font bytes·notice 확인을 통과했다. 임시 검증 코드에서 mirror base만 실제 domain으로 바꿨다.
- 재현용 --public 모드를 scripts/verify-prism-consumer.mjs에 추가하고 실제 명령도 실행했다. consumer-CQmxAY의39items/62files·10예시 tsc·Vite·font bytes·notice 확인이 모두 통과했다. 경로: /var/folders/ht/0ztx9m_d3xz1lg1m0rsy6bk80000gn/T/prism-consumer-CQmxAY. mirror가 아닌 https://ui.pydemia.ai/prism/r/prism-*.json과 공개 dependency URL에서 설치했다.
- 자체 브라우저 createBrowserTab(iab)는 Browser is not available: iab였다. 공개 URL 설치 및 source/asset 검증과 UI시각 검증을 분리한다. 최신폰트/Toast/Usage UI 및 원본의 모든 상태·로그인 domain·실제print pagination은 미완료다. Goal은 active다.
- stash의 내용은 source44e6a4a/generatedb533c5c와 원격에 보존된 뒤 임시 stash만 정리했다. 공개 검증 결과와 재현 명령을 유지하는 마지막 문서 갱신을 진행한다.

- 일반 /r/registry.json(141items) 및 배포 module assets index-CiHEio8y.js/page-D_d2rXKp.js/page-DrlmIlnL.css도 HTTP200 및 로컬 bytes 일치 확인. 최신 공개 설치 이후 이전 NTZkpM/FVI3xS의 node_modules만 정리하고 source·lockfile·dist 및 최신 CQmxAY 의존성은 보존했다.
- 공개 기록은 published-http-verified로 갱신하고 별도로 browserRender=pending을 유지한다. 최종 전체 site build와 PRISM contracts/10예시 타입 검사는 통과했다. --public 재현 명령과 공개 검증 기록을 소스/생성 문서에 반영한다.

- 최종 b373eff5656ae102778d379bef8102b63efb6325의 main push/ls-remote 일치 및 credential config 보존 확인. Verify UI run37091888289/job111113788126 completed success·실패 step0, Pages run37091887993 success, Vercel Deployment has completed. 공개 research/verification.json은 HTTP200이며 최종 로컬 bytes와 일치한다. URL: https://github.com/pydemia/ui/actions/runs/37091888289.
- 마지막 상태는 작업 기록만 local modified다. 구현·생성 문서·재현 verifier는 모두 원격에 반영했다. Goal은 active이며 source/설치/공개 HTTP 확인을 최신 UI의 브라우저 검증이나 전체 원본 디자인 일치로 해석하지 않는다.

## 2026-10-03 Avatar 배분과 말줄임 보완

- 이전 goal turn은 source/공개 배포/live registry 설치를 완료한 progress였다. 이번 turn의 own browser inventory도 []다. 전체 스타일 비교나 실제 인쇄 완료를 선언하지 않고 저장된 source default 근거와 원본 소스의 기능 누락을 점검했다.
- 원본 HRXAvatar와 _avatar.scss에는 실제 이름·팀 폭에 따라 자연 배치/이름 축약/팀 축약/양쪽 축약을 선택하고 잘린 텍스트만 도움말로 표시하는 동작이 있다. 기존 PrismAvatar는 기본 flex 축약과 native title만 제공해 짧은 텍스트 보존·양쪽 배분·원본 Tooltip을 구현하지 않았다.
- pydemia Avatar와 Tooltip을 조합해 실제 scroll/clientWidth와 ResizeObserver로 배분을 결정한다. window resize·텍스트 변경·document.fonts.ready/loadingdone에도 재측정하고 cleanup한다. 말줄임된 텍스트만 focus/hover 도움말로 전체 label을 보여 준다. 잘리지 않은 라벨의 hover 상태를 저장하지 않아 재축약만으로 Tooltip이 다시 열리지 않는다.
- div native props/style을 받아 consumer가 폭을 정할 수 있고 원본 규격40px 이미지·25px radius·12px gap을 유지한다. showInfo=false도 이름을 screen reader에 제공한다. long fixture에140–440px slider와 네 가지 길이 조합을 추가했다. 현재116 fixture 상태이며 종전115개/4503dea 실제 browser evidence와 구분한다.
- Avatar/Table의 self-contained 사용 예시를 추가해 complete examples11개, integration fragments27개다. 새 2tests는 mock DOM geometry로 배분/텍스트/폰트 이벤트/키보드 Tooltip/observer cleanup을 검사한다. CSS 레이아웃이나 실제 browser geometry 검증이 아니다.
- fetch에서 원격main이8e60a65로7commits 전진했다. Autocomplete와 Windows virtual usage 경로 정규화를 fast-forward로 반영했다. 소스 변경은 stash로 보존했고 generated docs 자산/HTML 충돌만 upstream 복구 후 병합 source로 재생성했다. generic UI·catalog·registry/release source는 원격과 차이가 없다.
- 병합 후 전체 build·docs/profile-demo typecheck·PRISM25tests·generic251tests 통과. 일반registry142/catalog140/immutable71 및 sha256-ab149be9df7a468a1002ed3461c04dce1c3442fe0a32a796ad06ec010688a458 검증 통과. complete examples11개 workspace 타입 검사도 통과했다.
- 새 독립 소비자 설치는 ui.shadcn.com/r/colors/neutral.json의10초 connect timeout으로 중단됐다. registry/schema 검사는 통과했고 dependency 설치 뒤 외부 색상 파일 요청이 실패했다. 버전 downgrade나 network 설정 변경 없이 같은4.21 CLI로 재검증 중이다. 실패 소비자eyXieL의 source/lockfile은 보존한다.
- 새 Avatar·Tooltip·116-state fixture의 실제 렌더 및 전체 원본 상태/로그인 domain/print pagination 검증은 browser 연결 복구 후 필요하다. 기존 공개 b533c5c의 검증을 이 Avatar 변경에 재사용하지 않는다. Goal active다.

- 같은4.21 CLI 재시도의 consumer-Ukms7T는39items/62files 설치·11예시 tsc·Vite·font bytes·notice 확인이 성공했다. 경로: /var/folders/ht/0ztx9m_d3xz1lg1m0rsy6bk80000gn/T/prism-consumer-Ukms7T. 이후 원본 Tooltip SCSS의 white-space:normal/word-break:break-word도 반영했다. registry CSS와 source bytes 일치를 확인하고 마지막 CSS를 해당 소비자에 동기화해 Vite 재빌드했다. 독립 설치와 CSS 빌드를 browser visual 검증으로 해석하지 않는다.

- 마지막 CSS 동기화 소비자 Vite build도 성공했다. 최종 전체 site build와 11예시 workspace 타입 검사도 통과했다. 실패eyXieL와 이전공개소비자CQmxAY의 node_modules만 정리했으며 source/lockfile/dist와 최신Ukms7T 의존성은 보존했다.

- source2680786/generatedff1f27a를 main에 push했고 원격SHA ff1f27a1cb8fcea58692b2a8e430306d89adc743와 일치했다. credential source config hash 보존/변경된 commit 파일 token exact-match0 확인. Verify UI run37094680798와 Pages run37094680499 모두 success, Vercel Deployment has completed다.
- 공개 components.json은11complete examples/116fixtures이며 registry.json SHA256은432d3672c026575a0d0daa291dbaf669cf6012a6d94a11c9c8a1e1d5e815bcb2다. 두 파일 모두HTTP200과 최신local bytes 일치 확인. public mode의 consumer-rIByQh도39items/62files·11예시tsc·Vite·font bytes·notice 확인이 통과했다. 경로: /var/folders/ht/0ztx9m_d3xz1lg1m0rsy6bk80000gn/T/prism-consumer-rIByQh.
- Codex browser panel의 새 long 예시 URL 열기를 요청했으나 응답을 확인하지 못했다. 추가 열기 요청을 취소했고 브라우저 inventory도 []다. panel이 열렸다고 주장하지 않으며 같은 요청을 반복하지 않는다. Mac 잠금/기존 로그인/네트워크 설정은 변경하지 않았다. browserRender와 actual geometry/print 상태는 pending이다.

## 2026-10-03 별도 headless 브라우저와 폰트·인쇄 수정

- 공개 Avatar 검증 기록 커밋을 origin/main634c365에 rebase했다. RadarChart source/release를 보존하고 전체 build·docs/profile-demo 타입 검사·PRISM25tests·generic255tests·registry143/catalog141/immutable72와 sha256-20c21ec393c800ad995dca9c302e79fc9c1dfe71d3b953648cc7e9c1710e2625를 확인했다.
- IAB unavailable 상태와 별개로 npx agent-browser0.38.2 및 설치된 Chromium1223의 isolated namespace/session으로 공개 /prism을 열었다. --profile/restore/auto-connect 없이 임시 설정 {}를 사용했다. Mac 잠금과 기존 Chrome 로그인·프로필·설정은 변경하지 않았다. 별도 headless engine이 가능하므로 goal을 browser unavailable로 blocked 처리하지 않는다.
- 먼저 배포본의116상태를 실제320px viewport에서 검사해 render/root overflow/nested button/visible native input label/page error0을 확인했다. Avatar140px 네 배분과 focus/hover/Escape·resize, Usage 표시 코드 전환도 확인했다. 원본HTTP는 headless 자동HTTPS 전환으로 ERR_BLOCKED_BY_CLIENT였고 별도 owned reference session의 HttpsUpgrades만 비활성화한 시도도 반복redirect였다. HTTPS는connection reset이다. 원본 session은 닫았으며 source host/network/auth 설정은 변경하지 않았다. urllib HTTP200을 browser 렌더 성공으로 기록하지 않는다.
- 실제 FontFace 검사는 문서/embedded/SVG의 Pretendard family가 설치한 Pretendard Variable과 달라 fallback을 사용함을 드러냈다. document.fonts.check는 존재하지 않는 family에도true였다. --font-ui로 연결하고 실제face.loaded와 computed family를 확인했다. 원본 static font의 모든 metric과 동일하다는 뜻은 아니다.
- 실제Chromium Letter PDF의 짧은printfixture가2장째빈page를 만들었다. 원인은 화면min-height280mm였다. print media에서만min-height0로 수정해1장으로 만들었다. 36가상경력의long fixture를 추가해2페이지의Profile머리말각1개·36행각1회·누락/빈page0을확인했다. PDF3장을PNG로render해잘림/겹침도검토했다. Native print dialog·다른용지/여백·긴Essay조합은미확인이다.
- source73be25852d2e7333a0332795334d33d145f3f4fa의font/print build에서117상태를actual320px로재검사했다. render/root overflow/nested button/unlabeled visible native input/page error0, PretendardVariableloaded다. 최신Avatar140/440px에서전체text/focusTooltip상태·hover/Escape·확장닫기·재축약closed를확인했다.440px마지막mode는fraction rounding으로team-truncate일수있으나실제textscroll/client일치와tabindex없음을확인했다. 내부mode문자열을기능완료판정으로사용하지않았다.
- 폰트수정본의Toast도320px·6px/4pxgap·close20x20·dismiss0을확인했다. UsageRegistry/Workspace표시코드가manifest와일치한다. Clipboard는기존사용자내용을바꾸지않으려고실행하지않았다.
- 공개설치consumer-rIByQh의finalregistryCSS를bytes동일하게동기화하고tsc/Vite재빌드와woffbytes를확인했다. 새독립설치로표현하지않는다. currentPRISMregistrySHA2560e2ae1a01a72962924feafe4833b848a316fea8a7c2e91aa20f9da0c34c75e40이다.
- 재현코드는/tmp/prism-headless-browser.py(owned namespace/session, pinned0.38.2), /tmp/prism-headless-runtime-local.py, /tmp/prism-headless-fixtures.js다. rawJSON/PNG/PDF는ignored.worknotes/browser-evidence에보관했다. source/render/install과원본스타일일치는구분한다. freshsource상태·인증domain·전체popup/long·nativeprint검증이남아goalactive다.

- push 직전 origin/main이b5ccface(SankeyChart)로4commits전진해일반push가거부됐다. local commits를보존하는merge를선택해source73be258검증checkpoint를유지했다. conflict는generateddocsassetrename/HTML뿐이며병합source의build가docs를재생성하고git add로해결했다. generic source/catalog/main/style/registry와origin차이0, mergedbuild/docsTypeScript/11usagecheck/generic260tests/registry144/catalog142/immutable73및sha256-9bf65f08c6e3daa55815c07059472e3b3fbf73651f55169bbbc23398927e88d0를확인했다.

- 최종 build가 종료되기 전에 generated docs를 staging해 merge commit을 만든 것을 확인했다. push는 원격 전진으로 거부돼 공개되지 않았다. build exit0 후 완성된 docs 전체를 추가하고 본인의 미push merge commit만 amend했다. HTML 참조 asset의 committed bytes, source/public과 generated JSON 일치 및 clean worktree를 확인했다. 이후8f6439c5는 worknote만 변경돼 일반 merge했다. 최종 main dd49ecbe의 정상 push와 ls-remote 일치, token exact-match0 및 demian config 보존을 확인했다.

- dd49ecbe9d3c9e75846a11085d1a4e5397d62a6b의 Verify UI run37098604514/Pages run37098604099가 success이며 Vercel도 Deployment has completed다. 공개 components.json/registry.json은HTTP200과현재localbytes일치, registrySHA0e2ae1a01a72962924feafe4833b848a316fea8a7c2e91aa20f9da0c34c75e40다. 공개117상태actual320px검사0문제, font loaded/Avatar/Usage동작도통과했다. 공개short/long PDF1/2장·36행각1회·머리말각1개이며페이지pixels가이미검토한localPDF3장과정확히일치했다. 구현은그대로두고공개검증metadata만갱신한다. 전체원본state/authdomain일치와nativeprint등은여전히미완료다.

- 최종 기록 commit7cb056dfb4913ef59c8f84f50d2873609e3590bb를 main에 push했다. Verify UI run37099093748와 Pages run37099093122는 success다. Vercel은 Deployment rate limited — retry in 24 hours로 실패했다. 구현 dd49ecbe는 앞선 production 배포와 공개 브라우저 검증을 통과했으며 마지막 commit은 문서5파일만 갱신했다. 공개 UI asset/manifest/registry는 변경되지 않았고 최신 verification.json의 공개 bytes는 이전 버전이라 마지막 기록만 Vercel 배포 대기다. 동일 quota에 재배포하지 않는다. 소유 headless 브라우저와 loopback50878 서버를 종료하고 raw/replay 자료를 보존했다. 마지막 worknote 결과만 local modified이며 전체 원본 상태·인증 domain 비교는 남아 goal active다.

## 2026-10-03 원본 직접 headless 접속과 파일 입력 보완

- bundled Playwright-core1.62.1의 chromium.launch(headless:true, installed Chromium1223 executablePath)와 fresh context에서 http://dev.prism.ai/sample/ui/button이 HTTP200으로 정상 렌더됐다. 이전 agent-browser0.38.2의 HTTP upgrade/redirect 오류와 달리 직접 실행으로 원본 접근이 가능하다. profile/auth restore, HTTPS-error bypass, proxy/security flag를 사용하지 않았으며 proxy env는 모두 unset이다. Mac 잠금·기존 testuser001 로그인·네트워크/DNS/계정 설정은 보존했다.
- 원본 FileDropzone의 유효 PDF+EXE 혼합 선택은 유효 파일 한 개를 첨부하고 일부 첨부 toast를 표시했다. uploading→ready timer와 삭제도 관찰했다. 원본 FileAttach의 LinkIcon 파일추가·행·spinner와 같은 파일 input reset을 확인했다. 재현본의 기존 generic Dropzone 래퍼는 기본 한 개/전체 거부, generic 안내/icon, admin list, FileAttach의 잘못된 upload icon과 빠진 상태행을 갖고 있어 독립 PRISM 선택 coordinator로 보완했다.
- pydemia Button·PRISM vector를 조합하고 원본 확장자 검사·부분 첨부·여러 파일·reset을 지원한다. maxFiles는 선택 1회당 cap이며 기본 제한 없음, maxSize는 기본10MB다. 원본 sample의 가짜 timer/API는 컴포넌트에 넣지 않았고 호스트 소유 PrismAttachment ready/uploading/error 및 선택·거부·삭제·다운로드 intent로 분리했다. 기존 consumer onFilesSelected/onFilesRejected/File[]와 FileAttach children을 보존하며 readOnly/multiple/style/타입 export를 추가했다. 일반 Dropzone/AdminAttachmentList는 변경하지 않았다.
- 원본/로컬 native browser filechooser event로 uppercase PDF+octet-stream MIME와 EXE 혼합 선택을 확인했다. 로컬 부분 첨부·동일 파일 재선택·input reset·양쪽목록에서 제거·host 완료·error·disabled, DOM DataTransfer drop·nested drag/leave 및 settled border#416395/background#eef2fa를 검증했다. DOM DataTransfer를 OS drag로 표현하지 않는다. native OS dialog 조작·실제 서버 업로드/다운로드·모든 형식 조합은 미확인이다.
- geometry 비교 결과 zone140.375px/icon40/guide13px-1.4/hint10px-1.4/tile240x46/row28/추가버튼81.484375x28가 일치했다. 초기 LinkIcon wrapper16px은 버튼이4px좁아 실제원본20px로 보정했다. 0px border none/solid와 직접 글자를 표시하지 않는 부모 상속값의 차이는 raw JSON에 남겼다. 원본/로컬 screenshot을 view_image로 확인했고 전체 pixel parity로 해석하지 않는다.
- actual320px의 long fixture는 root scroll320px, card list client288/scroll728px다. style width140/200/400/800px에서 zone/row폭이 그대로 맞으며 FileAttach header는180px미만에서 세로로 바뀐다. 119fixtures/38groups의 actual320px render/overflow/nestedbutton/unlabeled visible native input/pageerror가 모두0이다. PRISM30tests와 docs TypeScript/12complete example 검사가 통과했다.
- 첫 독립consumer-r0NWiR는39items/62files·12예시tsc·Vite·fontbytes·notice 설치 검사에 성공했다. 마지막LinkIcon20px/CSS는 최신 registry bytes 동기화 후 별도 compile로 검증한다. 경로 /var/folders/ht/0ztx9m_d3xz1lg1m0rsy6bk80000gn/T/prism-consumer-r0NWiR.
- raw/replay: /tmp/prism-direct-browser-check.mjs, /tmp/prism-reference-file-capture.mjs, /tmp/prism-files-runtime.mjs, /tmp/prism-fixtures-direct.mjs; ignored .worknotes/browser-evidence의 reference-files-*-direct/current, local-reference-files-comparison-direct, local-files-final-119-fixtures-320-direct. source freshness/auth domain/Tooltip white panel caller padding 및 나머지 상태 비교가 남아 goal active다.

- final emitted utility/CSS를consumer-r0NWiR에bytes동일하게동기화해12예시tsc/Vite가통과했다. 추가consumerfixture도actual320px에서readOnly picker/drop/deletecallback0, 단일picker multiplefalse 및same.pdf2회선택/reset, 140pxheader1column/button내부배치, rootscroll320와uploading2개유지(호스트소유)를확인했다. CSS/source재빌드구분을기록하고consumer PNG도보존했다.
- 최종 PRISM30tests/12예시검사통과. 원격fetch는e3aa359f까지전진했으며CalendarHeatmap source/index/catalog와74번째genericimmutable release만추가됐다. 공통primitive소스변경없음. 병합해upstream작업을보존하고최종빌드뒤generateddocs를추가한다.
