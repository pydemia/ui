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
