# Design modes와 최신 PRISM 통합

최신 사용자 지시는 PRISM의 현재 디자인 유지다. 선택 기능과 재질·recipe는
기본 UI에만 적용한다. 최신 원격 PRISM을 과거 구현으로 되돌리지 않는다.

## 확인한 기준

- 구현 시작 HEAD: `288b0838aec424f7c83686f3d3b00677d749fa4b`.
- fresh fetch의 main: `6ea262efc02ab20210b04830302fddeb82979d02`.
- 원격이 173개 커밋 앞서며 371개 경로 변경. 주로 PRISM 구현·검증이다.
- 현재 기능과 upstream의 source 교집합은 없다. docs index와 hashed
  assets 등 생성 출력만 겹친다. upstream lock은 257줄 추가됐다.
- immutable registry/releases와 docs/r/releases의 upstream 변경은 없다.

새 leaf `design_modes_upstream_integration_audit`는 read-only로 두 commit의
변경과 교집합을 확인했다. router decide는 gpt-6-astra/low를 반환했고,
해당 값을 fork_turns=none 생성 요청에 전달했다. root 설정은 unavailable,
leaf 실제 execution metadata도 unavailable이다. leaf는 terminal로
종료했고 파일·Git·build 소유권을 해제했다.

## 적용 순서

검증한 feature source를 먼저 commit한다. 재생성 가능한 tracked docs는
기준 commit으로 복원하고, 현재 source와 생성 파일의 안전한 사본을 남긴다.
upstream PRISM source/public/scripts/package/lock 전체를 merge한다.
npm ci 뒤 typecheck·UI/docs tests·full build·최신 PRISM 검사로 재검증한다.
공개 출력은 통합 source에서 재생성한다. 과거 docs/ 빌드는 게시하지 않는다.

최신 PRISM의 별도 pdf.css, export 지원과 source audit metadata를 유지한다.
통합 후 feature 부모 commit과 source diff를 구분해 PRISM 직접 수정 0을
확인한다. 기존 36개 PRISM 테스트와 이전 screenshot만으로 최신 upstream
회귀를 통과했다고 보고하지 않는다.

## 현재 검증

latest feature source의 build와 typecheck는 통과했다. 독립 CLI 설치
attempt-PAGDQu에서 15파일 source 일치·tsc·Tailwind/Vite·strict gate 통과.
Basic released, 20 ready를 유지한다. 위 검사는 upstream 통합 전 결과다.

Edge에서도 실제 Swiss 공유 URL → Glass 키보드 후보 → Escape → Enter
확정을 실행했다. Input 초안·profile 검색·고정 iframe src 보존, root와
child Glass/Dark 일치, overflow 0과 콘솔 error/warn 0 확인. Edge는
Chromium이므로 다른 engine 검사로 계산하지 않는다. ctrl+plus 시도는
실제 zoom 변화가 없었으며 200% zoom 통과로 계산하지 않는다.

실제 screen reader·forced-colors/reduced-motion·blur 미지원 환경은
여전히 미검수다. 구현계획 §7의 출시 조건을 묵시적으로 완화하지 않는다.
통합 후 검증·release 판정·snapshot·Git push·공개 readback이 남았다.

## 통합 검증 결과

- feature source `37412d58`, merge `cab533c7`로 안전하게 보존했다.
  GitHub connector에서 사용자 login=pydemia를 확인했다. 기존 저장소의
  author를 command-scoped -c로 사용했고 전역/local identity를 바꾸지 않았다.
- npm ci·typecheck·UI299·docs15·최신 PRISM363와 full build 통과.
- PRISM source/public/scripts/package-lock은 6ea262ef와 diff0이다.
  실제 Dialog440px/Light/Pretendard, Escape 후 trigger focus 유지.
  PDF 새 진입에서 실제 2페이지 렌더 확인.
- PRISM PDF의 모바일 overflow는 390px에서55, 320px에서125다.
  같은 production 6ea262ef도 각각55/125이며 새 회귀로 판정하지 않는다.
  PRISM 디자인 변경이나 관련 없는 수정은 하지 않는다.
- Vercel project prj_8v6UPgp7BGmfK9dhz1sBwd8pHd8m의 검증된 도메인은
  ui.pydemia.ai다. production READY deployment
  dpl_3BiCQiUZgBNrUVabr2k9tLsSyR5Q는 main/6ea262ef를 제공한다.
  feature를 운영 게시했다는 증거로 사용하지 않는다.
- 첫 개발 후보 snapshot f18d8d2c…22651a32/148 items와
  build→snapshot→build→release-check는 통과했다. 공개하지 않은 후속
  media 수정 전 후보이며 최종 source snapshot으로 쓰지 않는다.

## 접근성 media 우선순위 수정

adapter가 inline으로 쓰는 motion-fast와 panel-shadow를 기존 @media의
normal 선언이 덮지 못하는 CSS cascade 문제를 발견했다. 두 선언에만
important를 넣어 시스템의 접근성 선호를 우선한다. 일반 표시·PRISM은
변경하지 않는다. CSSOM과 실제 public resolver의 inline token 충돌 검사로
수정 전 Basic/Light에서 실패를 재현했고 수정 후 설정 검사8/8 통과.
새 테스트를 포함한 UI 전체300/300도 통과했다.

이는 실제 screen reader나 media 활성 환경의 실행 검증을 대체하지 않는다.
현재 IAB의 reduced-motion/forced-colors는 false이며 backdrop은 지원된다.
추가 CSS 뒤 build·새 snapshot·build·release-check와 소비자 재대조가 필요하다.

## R4 후보 보존

source16af79a2 뒤 전체 build→snapshot→build→release-check 통과.
현재 snapshot은
sha256-5736ea60ecd93db3396f22401bf16832c43fe9fd628c2c24e9f9f1372c0a90d0,
148 items다. 기존83개와 미게시 R3/f18 후보를 보존했다.
Atlas source/output hash는 원본과 일치하고 개발용 QA 문서는 출력에 없다.

독립 CLI attempt-WmV7Zz에서 최신 CSS/TS source 일치, install·tsc·Vite와
strict gate 통과. 실제 소비자 /?qa의21종에서 Dialog ID radix-_r_0_, 초안,
지역 Light/Forest와 Dark root, overflow0 확인. raw CLI의 browserVerified=false는
보존하고 실제 browser.json을 별도 기록한다. media 실검수로 확대하지 않는다.

Git dry run은 기존 helper의 write 인증을 확인했다. GH CLI는 인증되지 않아
GitHub connector의 pydemia identity와 Git의 기존 인증을 사용한다. 설정·token은
변경하거나 출력하지 않는다. 운영은 여전히 main6ea262ef다.

사용자에게 출시 전 환경 검수 유지/후속 검수로 조정 선택을 질문했다.
응답은 아직 없으며 manual-validation 기록에 검수 ID와 조건을 보존한다.
후보 branch 보존과 운영21종 공개 완료를 구분한다.
