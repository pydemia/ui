# Design modes 개발 검증 coverage

공개 전 후보이며 Basic만 released, 20종은 ready다. 이 기록은 개발 IAB와
독립 설치 앱에서 root가 실행한 검사다. 사용자 승인·운영 게시·전체 WCAG
인증이나 실제 screen reader 검증을 뜻하지 않는다.

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
