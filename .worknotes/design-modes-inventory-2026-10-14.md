# W02 표현·상태·소비자 inventory

기준 HEAD 288b0838. 조사 3개 leaf는 읽기 전용으로 완료했고 root가 현재 코드를 대조했다.
TS AST와 source 파일 목록으로 확인한 실제 카탈로그는 144개, component TSX도 144개다.
한 조사에서 제시된 116개 집계는 불완전한 추출이므로 사용하지 않는다.

## 토큰과 표현

- `packages/ui/src/styles.css:1`의 Basic palette 14개와 semantic alias 14개,
  radius 5px·control 36px·row 10px·본문 14px·caption 12px·행간 1.5,
  spacing 4/8/12/16/24px·font/shadow/overlay/motion을 보존한다.
- `.dark`와 4개 명시적 colormap은 root palette 변경이다. 지역 scope는
  palette뿐 아니라 semantic alias·font·shadow·overlay·density를 완결해야 한다.
- docs CSS의 3/4/5px radius, intro/section title·간격·preview frame literal은
  역할별 변수로 바꾸되 Basic fallback은 기존값과 같다.
- 원형 의미가 있는 rounded-full, input underline, 상태/focus/disabled 규칙은
  전체 selector로 덮지 않는다. 기본 sidebar 선택 stripe도 보존한다.
- 조합 recipe는 기존 DOM/state를 유지하며 데이터와 읽기 순서를 바꾸지 않는다.
  Bento·Spatial은 조합 영역의 layout/surface 표현이며 XR·OS 창 관리가 아니다.

## Portal

10 파일의 13곳: popover(1), select(1), dialog(1), alert-dialog(1), drawer(1),
tooltip(1), hover-card(1), dropdown-menu(2), context-menu(2), menubar(2).
Content와 SubContent 모두 scope container를 전달한다. ThemeScope 밖은 기존 body,
명시 container는 scope보다 우선한다. scope host의 DOM identity는 전환 중 유지한다.
Toast는 Portal 없이 fixed 위치라 transform/overflow에서 별도 검수한다.

## 상태와 URL/profile

- docs App은 selected component·dark·colormap·override를 소유한다. 현재 root
  effect와 새 controller를 병존시키지 않고 설정 소유자를 하나로 통합한다.
- history는 component만 복원하고 theme는 복원하지 않는다. component 없는 URL
  popstate는 기본 Button으로 돌아가도록 theme/component를 함께 해석한다.
- component 이동은 기존 pushState, theme 확정은 replaceState를 쓰며 다른 query/hash를 보존한다.
- 현재 iframe src는 고정이다. 버전/revision 메시지와 ack를 추가해도 고정 src와
  input/review state를 유지한다. 신규 프로토콜 이후 늦은 legacy 메시지는 무시한다.
- docs의 현재 preview()는 안정적 component 타입이다. 새 element 객체가 remount
  자체는 아니며 type/key/위치를 유지한다. candidate는 picker 지역 state이다.
- profile은 origin/parent source·14 token·6자리 hex를 이미 검사한다.
  공유 resolver와 DOM adapter를 사용하고 docs 내부를 import하지 않는다.
- 기존 색상 초기화는 override 초기화다. 디자인 복귀·전체 초기화·팔레트 전환과
  별도 동작으로 두고 색상 프로필과 명시 URL 우선순위를 검증한다.

## 파일 배치·registry 결정

- 현 registry validator는 components 최상위 TSX·public export·catalog를 1:1로
  검사한다. foundation helper를 탐색용 component로 끼워 넣지 않는다.
- 공통 theme 코드는 `packages/ui/src/components/foundation/`에 배치한다.
  기존 wrapper가 `./foundation/portal-scope`를 import하면 registry의
  `@ui/foundation/<file>` 설치 구조에서도 같은 상대 경로가 성립한다.
- 최상위 component와 foundation의 구분은 명시적으로 검사하고, target은
  components 경로 뒤의 상대 구조를 보존한다. 기본 component의 basename 설치는 그대로다.
- pyd-portal-scope는 React context/hook만, pyd-design-modes는 definition/settings/
  DOM adapter/ThemeScope/optional CSS이며 portal-scope와 tokens를 의존한다.
  10개 wrapper는 portal-scope만 추가하며 디자인 전체 데이터는 의존하지 않는다.
- 신규 provenance는 자체 구현, 기존 shadcn license/attribution과 immutable releases는 유지한다.
- 세부 파일명은 구현계획의 제안 경로에서 조정했다. 기능·완료 범위는 동일하다.

## 검증 경계

- Pure: manifest 21개, normalizer/지원 조합, URL roundtrip, invalid/fallback,
  색상 합성, 저장 격리·실패, Dark UI alias.
- React: candidate/commit/Escape, 초기 open·explicit container·중첩 host,
  DOM identity와 열린 Dialog, history, iframe의 version/revision/legacy 순서.
- Browser: 지역 CSS alias와 실제 portal computed style, 전환 중 입력/선택,
  반응형·focus·scroll·대비·재질 fallback·PRISM.
- Consumer: target/import/dependency closure, 선택 CSS 사용 코드, 독립 빌드,
  snapshot과 공개 readback. 자동/수동/미검수를 구분한다.

21종 팔레트·형태의 leaf 제안은 시각 규칙의 참고이며 검수 결과가 아니다.
Basic은 관측값, 추가 모드는 pydemia 해석으로 구현하고 실제 화면에서 검수한다.
