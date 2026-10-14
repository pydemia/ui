# Design modes 검증 coverage

현재 **Basic released / 추가20종 ready**인 공개 전 후보다. PRISM은 최신
main6ea262ef의 현재 디자인과 소스를 보존한다. 운영21종 게시·사용자 승인·
실제 screen reader·전체 WCAG 인증으로 보고하지 않는다.

## 최신 기준과 산출물

| 대상 | 기준 / 결과 |
| --- | --- |
| 기존 제품 source | 16af79a2ca4794500d14fb6404d8f50ed64c5838 |
| 원격 후보 / CI | head5d92c760, Draft PR163, Verify UI38527814609 성공 |
| R5 변경 | docs Picker 준비 중 그룹, 개발 QA 눌림/로딩/disabled 예시와 관련 docs 검사. 기반 UI·PRISM 변경 없음 |
| 실제 R5 증거 | browser-evidence/design-modes-states-r5.json. source198개 SHA-256, 시작/종료 시각, IAB2/Chromium, URL 포함. 브라우저 정확한 버전 unavailable |
| matrix | design-modes-coverage-matrix-r5-2026-10-14.csv, 672행 / 지원624행 / 8상태 열 |
| 최신 소비자 | attempt-WmV7Zz: shadcn4.21.0 설치15파일, 독립 tsc/Tailwind/Vite, source/CSS·strict gate 통과. 별도 실제21종 Dialog/초안/지역 palette 확인 |
| 기반 검사 | UI300/300, docs15/15, 최신 PRISM363/363, typecheck 통과 |
| immutable 후보 | 5736ea60…2c0a90d0 /148 items. build→snapshot→build→release-check 완료, 이전83개와 R3 후보 보존 |
| 운영 | main6ea262ef. feature21종 공개/readback 미완료 |

R5의198개 파일 해시가 현재 파일과 일치함을 조립 검사로 확인했다.
R5 commit·후속 빌드 결과는 implementation-status 기록을 따른다.
R4 이전 검사로 이후 변경의 실행 결과를 대신하지 않는다.

## R5의 실제 상태 검사

18종 Light/Dark와 Dark UI/Cyber/Terminal Dark의39지원 조합을 실행했다.
각 조합의 실제 catalog144개/16family 렌더 오류0, 1280×720 root overflow0.
세 Button의 실제 :hover, Tab 이동한 Input의 focus-visible, Toggle 눌림,
aria-invalid Input, disabled Button/Input, aria-busy Button+Spinner를 확인했다.
모든 전환 중 한글 초안·Checkbox 해제·눌림 상태 유지. Spinner는 버튼
글자색과 일치하며 배경과 구분된다. 교정 전 QA 원본은
states-r5-before-loading-color.json에 보존하고 최종 통과 근거로 사용하지 않는다.

CSV 판정은 아래 범위를 뜻한다.

- PASS_RENDER: 해당 family의 전체 catalog 예시 렌더.
- PASS_SHARED_BUTTON / INPUT: 공통 primitive의 실제 상태 검사와 family의
  data-ui 재사용 연결. 이 primitive의 표현 범위에 한정한다.
- PASS_VISIBLE_WITNESS: 연결된 예시의 실제 상태·computed style. 예시의
  표시형식 선택 버튼도 포함하므로 원 component의 상태 API로 해석하지 않는다.
- NO_INDIVIDUAL_WITNESS: 이 fixture에 별도 상태 근거 없음. N/A나 통과로
  대체하지 않으며 개별 API의 모든 상태 전환 검사로 확대하지 않는다.
- UNSUPPORTED: Dark UI/Cyber/Terminal의 Light3조합.

Tooltip 반전, ghost/underline control, fullscreen overlay는 의도한 표현
예외다. 가장 가까운 ThemeScope에서 재질과 recipe를 초기화한다.
Bento/Spatial의 중간 폭·모바일·독립 Basic recipe geometry는 기존 실제
별도 증거에 연결하며 DOM 순서·component key를 바꾸지 않았다.

R5 solid semantic 대비 최솟값: 본문12.35, muted5.48, accent6.28,
danger6.04, focus4.97, success5.83, warning5.00. 본문4.5/focus3 기준 실패0.
근거는 state-coverage-r5-summary.json이며 gradient/alpha/hover 픽셀과
임의 override의 대비 인증이 아니다.

새 원격 폰트·texture·비동기 asset loader는 없다. 새 로더의 실패/pending/
경합 검사는 N/A다. system/serif/mono fallback의 한글·형태·normal layout은
실제39조합의 표시 근거로 한정한다.

## 근거의 현재성과 남은 범위

이전 all-supported-browser/semantic-contrast/mobile-320-all JSON은 원본
그대로 보존한다. 자체 commit·시각·브라우저가 없으므로 최신 revision을
소급 작성하지 않는다. render/공통상태/solid 대비는 R5가 최신 근거다.
320px21종 후보/명시 적용·iframe·focus는 이전 실행의 역사적 증거다.

최신 소비자 browser.json은 source16af79a2를 명시한다. CLI 원문의
browserVerified=false와 root 실제 browser21종 결과를 별도 파일로 구분한다.
공개 registry 설치는 남았다. PRISM363 및 최신 Dialog/PDF가 기준이며
이전 PRISM36을 최신 실행으로 혼동하지 않는다. source/public/build script는
main6ea262ef 대비 diff0, PDF 모바일 overflow55/125도 공개 baseline과 같다.

실제 screen reader·200% 확대·forced-colors/reduced-motion·blur 미지원
환경은 manual-validation의 미검수 상태다. CSSOM 우선순위8/8은 실제
media 실행을 대체하지 않는다. 환경 처리 질문은 응답 대기다.
20종 release 판정·공개 설치·production 게시와 공개 후 Basic/shared URL/
profile/portal/PRISM readback이 남았다. 완료율9/14=64.3% 유지.

## 이전 실행 기록 — 아래 수치는 최신 실행을 대신하지 않음

## 실행한 조합

- 실제 catalog 144개/16 family를 그대로 렌더하는 개발용 design-qa.html.
  모든 지원 밝기 39조합에서 렌더 오류 0, 1280px root overflow 0.
- Basic/Glass/Material/Fluent/Neumorphism/Flat/Bento/Brutal/Clay/Skeuo/
  Minimal/Swiss/Editorial/Aurora/Retro/Pixel/Drawn/Spatial은 Light·Dark.
  Dark UI/Cyber/Terminal은 Dark. 미지원 Light는 별도 정규화 규칙을 따른다.
- 대표 공통 상태: Button 기본/outline/ghost/disabled, Input invalid,
  Checkbox 선택 해제, keyboard focus-visible, Card 제목·표면. 모든 조합에서
  긴 한글 초안·Checkbox 상태 유지. 144개 각각의 모든 상태를 수동 조작한
  결과로 확대하지 않는다. 상태가 없는 Label/Separator 등의 셀은 N/A다.
- 첫 6종 12조합: 열린 실제 Dialog ID `radix-_r_2_`와 초안 유지,
  Operations 기간 month/검색 집계, Review 의견, Intake 제목/담당 유지.
  마지막 전환 후 실제 표 선택이 checked이고 선택 작업 1건 표시 확인.
- 21종 320px 실제 B picker: 후보 탭 시 root/URL 유지, 적용 버튼 뒤 page와
  profile design 일치. iframe 검색 `검색` 유지, SRC 고정, trigger focus 복원.
  모든 root overflow 0, panel right 296 < clientWidth 305.
- 390px Editorial 후보/Spatial 적용 동시 표시: root overflow 0,
  panel x8/right366.4 < client375, footer 도달 가능. 이전 768px 후보 portal과
  history 검증은 기존 상태 기록에 연결한다. 실제 터치 기기 실행은 아니다.
- Bento: 실제 DashboardPanels 두 열 2:1, 첫 chart span2, 마지막 panel full row.
  Spatial: 1.6:1, gap28, header margin16/radius18/shadow. 데이터·DOM 순서·key는
  바꾸지 않는다. B 상세에도 실제 Operations를 펼쳐 확인하며 preview 내부
  링크는 URL을 바꾸지 않는다. 문서와 preview의 id 중복 0 확인.

## 색상과 재질

브라우저의 resolved semantic 색 39조합에서 계산한 최솟값:
본문12.35, muted5.48, accent text6.28, danger6.04, focus5.02,
success5.83, warning5.00. 일반 텍스트 4.5/표시 focus3 기준의 실패 0.
이는 명시된 solid semantic pair 계산이다. 모든 gradient/alpha/hover
픽셀이나 사용자 임의 override의 대비 인증으로 확대하지 않는다.

지역 범위마다 재질 변수를 초기화한다. Glass/Fluent의 90% fill·blur와
미지원 backdrop-filter의 opaque fallback, forced-colors/reduced-motion
규칙은 source에 있다. 미지원 엔진·접근성 media 환경의 실제 실행은 남았다.

## 독립 소비자와 PRISM

최신 설치: browser-evidence/design-modes-consumer-check/attempt-3DyGhK.
실제 shadcn4.21.0이 15개 파일을 새 프로젝트에 설치했다. nested foundation,
TS/CSS source 비교, lockfile 버전, 독립 tsc/Tailwind/Vite, strict release gate
통과. browser.json의 21종에서 Dark root/지역 scope, 열린 Dialog ID
`radix-_r_0_`, 입력과 local palette 유지. Dark UI Light는 Basic Light,
Cyber/Terminal Light 요청은 해당 Dark로 정규화한 결과를 그대로 기록한다.
verification.json의 browserVerified=false는 leaf CLI 원문으로 보존하고,
root의 실제 브라우저 결과는 별도 browser.json에 둔다.

`/prism?design=swiss&mode=dark` 실제 확인: root data-design 없음,
design trigger 0, data-prism=light, Pretendard, background rgb253/253/253.
PRISM source diff 없음, check36/36 통과. 현재 디자인 유지라는 사용자 지시와
일치한다. 83개 historical immutable release 보존, registry 검사5/5 통과.

## 증거와 남은 단계

browser-evidence의 first-six-browser, first-six-compositions,
all-supported-browser, semantic-contrast, mobile-320-all JSON에 원값을 보존한다.
이미지: profile-recovery, consumer-portal, prism-unchanged,
bento-workspace-candidate, mobile-b-r2-320/390의 2026-10-14.jpg.

새 preview/Usage/CSS 뒤 최종 build가 남았다. snapshot→build→release-check,
21종 release 판정, 공개 registry 설치, commit/push·운영 readback도 남았다.
실제 screen reader/다른 엔진/200% zoom과 media fallback은 미검수다.
해당 결과를 실제 통과로 만들거나 goal을 완료 처리하지 않는다.

## 최신 source와 PRISM 기준

main/6ea262ef를 feature에 통합했다. typecheck·docs15·PRISM363 통과,
PRISM source/public/build scripts는 upstream과 diff0이다. 실제 최신 Dialog의
Light/Pretendard·Escape focus, PDF2페이지 렌더를 확인했다. PRISM PDF 모바일
overflow55/125는 공개 baseline과 같으며 이번 기능에서 수정하지 않는다.

inline motion-fast/panel-shadow와 접근성 media 선언의 우선순위를 수정했다.
수정 전 실패 재현, 설정8/8와 UI 전체300/300 통과. 이 CSSOM 검사는 실제
media 또는 screen reader 실행이 아니다. 일반 모드의 39조합 근거는 유지하며
새 CSS 소비자 대조와 최종 snapshot은 다시 필요하다.

R4의 최신 build→snapshot→build→release-check와 installer attempt-WmV7Zz가
통과했다. actual browser21종에서도 Dialog ID/초안과 지역 palette 유지,
overflow0 확인. 현재 snapshot은5736ea60…2c0a90d0/148 items다.
실제 media·screen reader/200% zoom 등의 상태는 manual-validation에
미검수로 유지한다. 추가20종 ready를 운영 지원 완료로 보고하지 않는다.
