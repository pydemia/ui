# R14 전체 컴포넌트 형태·반응형 검수

- 요청: 이전 Material 패널 수정에 이어 다른 컴포넌트도 모두 검사하고 개선할 부분 반영.
- 기준: main80ab668902c7a194e1334942172b4b3c4b48f850 / snapshot94(31f15cec…). branch codex/component-geometry-audit.
- 기존 사용자 dirty노트8개·첨부 보존. 제품 source/generated clean 기준 시작.
- 범위: 실제 catalog144개 전체, 지원21모드/39밝기조합, 좁은 화면과 상태별 추가 조사. 모서리 역할 누락·과도한 pill·clip·내용 넘침·변형 상태 검토.
- 보존: Basic 격리/PRISM/폰트·팔레트, 의도한 원형avatar·표식/짧은pill/사각·비대칭 컨셉. 단순히 큰radius라는 이유로 일괄 축소하지 않음.
- 작업 소유: root가 브라우저/공유CSS/구현/빌드/Git/배포 담당. 독립 source audit leaf는 지정노트만 쓰고 제품편집·추가위임 금지.
- 검증 계획: source inventory→실제 geometry/스크린샷→필요한 수정→상태·모드·반응형 재검수→기존tests/build/release→CI/공개반영 확인.
- 아직 실제 결함·수정·검증 결과 미확정. 이전144초기render pass를 이번 상태별 전체 검수로 간주하지 않음.

## 원인 확인과 변경

- baseline main CI38764429126 success 확인. 라우터는 gpt-6-luna/high/fork none 권고, source audit leaf2개 생성 요청. 주/leaf 실제runtime metadata unavailable.
- baseline-four-320.json: Basic/Material/Clay/Drawn 각144개 초기render/오류0/scaffoldoverflow0. Checkbox/Radio의1px 접근성용native input 좌표는 시각적잘림으로 보지 않음.
- 실제 Material verticalButtonGroup78x88/r999(캡슐), PIN48x48/r0 확인. Drawn 태그칩·colorswatch·defaultcheckbox r0 확인. scalar min()에4corner변수가 들어가 computed invalid→0이 되는 원인.
- compact/pin/check/inline-code radius역할 토큰을 scope별reset하고 MaterialPIN과Drawn의 유효4corner값 명시. 기존scalar모드 clamp 보존.
- verticalButtonGroup만 navigation radius 사용, 짧은horizontal pill 보존.
- 실제 MaterialDrawer right/r0 확인. data-side hook 추가, nonBasic에서 panel radius 적용 후 viewport접합corners0 처리. Drawn4corner token도 shorthand 후 접합corner만0으로 유지.
- Drawer 실제 예시에 left변형을 추가해 3방향 모두 UI에서 검수 가능하도록 보완.
- 아직 수정 후 빌드/시각·상태 검수 필요. 독립 audit노트2개 수용/leaf종료 확인.

## 전체 초기 화면 검수

- inventory.json의 실제144개 모두 geometry 검사. matrix-320-39.json/matrix-1440-39.json: 두너비 각지원39조합, 오류0/pageoverflow0/각preview-content overflow0.
- matrix-390-21.json/matrix-768-21.json: 두너비 각21모드, 같은검사 pass. 총120설정×144개 초기예시. 모든상호작용 상태를 검사한 것으로 확대하지 않음.
- Material verticalgroup12/PIN12·12·3·3, Drawn칩·swatch8·4·10·5/checkbox5·4·5·5 확인. 변경role의 nestedBasic 표현은120설정에서 동일.
- 개발QA output의긴JSON을 wrap하여 진단문자열에의한 가로넘침 제거. Basicfixture에수정component4종 추가(총28종).
- full typecheck/UI303/Docs15 pass. QA기록용markup 변경이후 최종정식build/CI재검증 예정.
- React검토: 상태/effect/외부요청/의존성 추가 없음, Drawer의side데이터hook과독립예시만추가. 기존Radix ARIA/focus/portal경로 보존.
- Drawer반복검사 첫도구호출30초 제한으로브라우저helper초기화. 미저장된부분 결과는완료증거로쓰지않고새탭/작은batch로 재검수.
- Drawer닫기직후 activeElement=BODY가 관찰됐으나 다음실제관찰에서 trigger BUTTON으로복귀. early-focus기록을 최종포커스실패로 판정하지않음. 지연없는독립관찰로대표포커스검수 필요.

## 상태 검사

- Drawer320px21모드×3방향63조합, 추가desktop9/내부Basic3 총75회: 노출corner별token/붙는corner0/가로넘침0 확인. Basic0 유지, Drawn4corner형태 유지. geometry record와즉시focus관찰을 분리.
- PIN 입력6자리/Soft변형/제출 후6자리표시 유지, Material→Drawn 전환 후입력길이·제출상태 보존. PIN원문은 tool redaction을 존중해 로그로우회확인하지않음.
- vertical버튼 미리보기 상태갱신, Markdown인라인registry표시/Material4px→Drawn4px, Tags추가/Soft변형후3개, ColorInline전환/색상제출 확인.
- Basic과catalog CheckboxPreview를동시에렌더하면고정ID demo-notifications 등이중복되어접근가능한이름이중복됨을확인. Preview를useId로바꿔인스턴스별레이블연결보존. 라이브러리Checkbox API변경없음.
- 최신 docs변경은재검증 필요. 아직최종build/registry/CI/운영반영 전.

## 최종 검수 보완

- CheckboxPreview useId 적용후 Basic+catalog default3종 총6개ID unique, 접근가능한이름으로Space토글 false→true 확인.
- DrawnrightDrawer 시각검수 및별도관찰에서Escape후원trigger복귀 확인. Materialbottom24·24·0·0 시각검수. 긴루프에서즉시focus판정은사용하지않음.
- 독립 소비자fixture/설치item에ButtonGroup·PinInput·ColorInput·Checkbox·Markdown·Drawer6종 추가. 이번수정이workspace만이아닌공개registry조합에서도작동하는지검증하기위한범위확장. 공개API/제품feature 추가아님.
- 최종제품source는CSS/Drawerdatahook, docs는3방향Drawer예시/CheckboxuseId/QA격리·진단줄바꿈, testfixture는수정6종실제설치검수. 기존인증·데이터·palette/font·PRISM 보존.

- 최종대표포커스: DrawnrightEscape후상세패널열기BUTTON, MaterialbottomEscape후아래패널열기BUTTON 복귀 확인. pointer입력도구timeout을성공으로가정하지않고실제제출상태로확인.
- 현재사용검수탭은닫음. 첫timeout때detached된QA tab380100093는close/getTab 모두debugger 미연결로정리불가, 재시도반복하지않음. 임시blanktab에서viewport reset성공후닫음. 종료시에본작업5225서버정리필요.

## 릴리스 전 진행

- 최종 full typecheck pass, upstream main80ab6689 불변 확인. 제품/UI2files +docs2files +독립설치fixture2files 범위. 신규의존성/공개API 변경 없음.
- UI303 pass(최종동일librarysource), Docs15 최종재실행→정식build 진행. 기존보고서/fixture외전역설정 변경없음.
- 아직새immutable snapshot/PR/CI/운영배포/공개설치 검증 미완료. 최종제품CSS가고정된후한개의새스냅샷만생성예정.

- 최종Docs15/fulltypecheck/정식첫build pass. PRISMsource diff0. coverage-summary.json에서120설정각144개/오류0/넘침0 자동대조.
- 5225dev서버종료, ownlog를ignored browser-evidence/geometry-r14/dev-server.log로이동. 현재제품CSS/공개component source고정, immutable snapshot95생성중.

- snapshot95 생성: sha256-cf8973ac42b58db3f7dedc8c02dbe1ff93a82726a84123cd2dbcbc2b08b12468 /148items. 기존94개 immutable 보존, 새릴리스를문서출력에포함하는정식최종build 진행.

## 릴리스 전 검증 완료

- 최종 npm run build/registry:release-check pass, snapshot95 일치. 이전immutable snapshot diff0.
- 확장독립설치 attempt-o9RKkb pass: 28개registry item설치/9개design source비교/typecheck/Tailwind·Vite build/strict21 gate. CLI browserVerified:false는유지, browser는별도검수.
- compiled 실제문서 MaterialButtonGroup vertical12/horizontal999 및미리보기상태갱신, DrawnleftDrawer0·6·14·0/넘침0 확인. MaterialPIN6자리제출/12·12·3·3, DrawnColor8·4·10·5/Checkbox5·4·5·5 토글/Markdowninline4 확인. compiled-checks.json.
- 모든raw geometry와대표 screenshot의수용은구분. 144×120 초기geometry/Drawer75회/명시한입력동작과표시상태를근거로기록하며전상태·전브라우저검증을주장하지않음.
- 이후 exact-head PR CI 및운영배포/공개registry설치 확인 필요. source/style/검사fixture는최종고정.
