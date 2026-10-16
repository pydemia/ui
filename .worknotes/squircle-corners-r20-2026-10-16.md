# Squircle 곡률 조정 R20

- 요청: 둥근 디자인의 과도한 곡률을 자연스러운 squircle로 조정.
- 시작점: main `1cab942d407981e00e6f504448c18ca140352f05`.
  기존13개 dirty 기록·첨부·R17 중간27cd snapshot 보존.
- R1: 둥근 테마의 사각 패널·입력·선택·action에 squircle 적용 및
  과한 radius 감소. 원형 avatar/라디오/상태점 등 의미 있는 원은 유지.
- R2: R19의 연속 행 radius0, Basic 지역 격리, 각진/비대칭 테마와
  PRISM, 테마 전환 상태·portal·동작 보존.
- R3: corner-shape 미지원 환경도 작은 radius fallback 사용.
  Chromium 실제 지원 및 parent clipping/child header 일치 검수.
- 완료 기준(동일 가중치): ① 구현·예외 검토 ② 실제 화면·동작 검증
  ③ main/운영/공개 registry 반영. 현재 0/3.
- 추가 요청: 관련 Skill/Prompt에도 곡률 기준 적용. 별도 canonical
  `C:/Users/pydemia/git/agent-skills`의
  `.worknotes/squircle-guidance-2026-10-16.md`에서 독립 3개 기준으로 관리.
  UI 작업을 대체하지 않고 두 작업을 완료할 것.
- 선택은 사용자 지정. 구현 수치는 agent-selected로 화면 확인 후 확정.
- 근거: MDN corner-shape 및 Chrome139 공식 release note 확인.
  https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/corner-shape
  https://developer.chrome.com/release-notes/139
- 독립 범위 감사는 router 권고 gpt-6-luna/high를 요청한 leaf
  squircle_scope_audit_r20에 read-only 위임. 실제 실행 모델·effort는
  runtime 미노출. 공유 CSS·metadata·build·Git·게시 변경은 main 담당.

## 검수 및 릴리스 준비

- 독립 source audit 종료 및 수용. 실제 원형은 명시적 rounded-full/circle
  표시를 통해 유지. Shape를 element 전체에 적용해 field·header·shadow·
  패널 clipping을 같은 규칙으로 맞추고, radius0인 행에는 영향 없음.
- 로컬 Clay390 Board 패널20/squircle, action12/squircle, 행0 및 가로
  초과0 확인. 실제 screenshot `local-clay390-board.png` 저장.
- 실제 모바일 Dialog 패널20/field12/squircle, viewport390 내362.4px 확인.
  열린 QA Dialog의 Clay→Material→Glass→Drawn→Basic 전환에서 같은
  dialog ID 유지. Drawn 비대칭 round, Basic5px/round 복원 확인.
- 키보드로 입력한 초안 `curve-r20`은 Clay·Glass·Drawn·Basic 전환 후
  보존. 최초 fill 도구 입력은 React 상태에 반영되지 않아 이 증거에서
  제외하고 실제 key 입력으로 다시 확인. 기본 초안 보존과 별도로 기록.
- 독립 Basic37개 예시의 모든 descendant corner-shape가 round 유지.
- Registry iframe 초기 로딩 전 관찰은 pass에서 제외. 로딩 완료 후 실제
  Clay scope/squircle, native field12 및 wrapper14의 shape 확인.
  외부 Registry/Operations/Review/Intake frame도 squircle, 모바일390
  page/frame 가로 초과0. local QA의 해당 값과 초기 빈 iframe은 구분.
- UI/UX 선택: Basic과 각진·비대칭 mode는 기존 표현, 실제 원형 표시 유지.
  새 기능/데이터/인증/폰트/색상/PRISM source 변경 없음. Material/Clay의
  설명도 pill 표현에서 현재 squircle 표현으로 갱신.
- README에 corner-shape 지원 범위와 작은 radius fallback 안내 추가.
- 기준 2/3 완료. 공식 build/snapshot/release-check, PR CI·main·운영·공개
  source 확인은 아직 미완료. 임시5242와 로컬 QA 탭 종료 예정.

- 구현: 둥근12개 mode의 CSS 재질 token을 squircle로 설정. 지원 검사와 bounded scope로 Basic 격리, angular/drawn round 기본값 유지. 공용컴포넌트·지역테마·portal에 같은 규칙 적용. 명시적 rounded-full/circle과 Spatial 구형 장식은 원 유지.
- 반경: Glass/Neumorphic22→18, Material/Bento/Aurora24→18, Clay34→20, Spatial28→18(panel). 큰 기본 radius도12~14px로 조정. Material/Clay action999→12, Clay field18→12/selection16→10, Material bar999→8. docs Clay 선택/태그의999도 의미별 token 사용.
- UI build/TypeScript 및 기존 관련24 tests pass. 실제 Chromium CSS.supports(corner-shape:squircle)=true. 144개 catalog ×21개mode ×320/1440px=6048개 관찰에서 render오류/곡률예외오류0. 독립 Basic Board paint/radius/shape 동일. matrix-144-components-21x2.json 저장. 이는 실제computed shape 검사이며 모든 상태의 수동시각검수와 구분.

- 첫 공식build 및 snapshot 생성 pass. 새 release6e4b0bb0/148items, 기존공개101개 release 보존. 최종build와 release-check 진행. 로컬5242 서버 및 QA탭 종료, viewport reset. Skills 작업은 agent-skills 별도branch에서 병행.

- 최종 공식build 및 registry:release-check 통과. 새 snapshot6e4b0bb0/148개 item 검증 완료. PR CI·main·운영 확인 대기(2/3).
