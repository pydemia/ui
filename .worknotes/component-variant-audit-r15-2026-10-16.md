# 컴포넌트 변형·상태 추가 검수 R15

- 요청: R14에서 수정한 7종 이외의 137종도 모두 확인하고 근거가 있는 개선을 반영.
- 기준: main 0eacf43e92cc713730b6190e1dd6151dc31caeab, branch codex/component-variant-audit.
- R14의 144종 초기 화면 geometry 검사는 재사용하되 모든 변형·상호작용 검사로 확대 해석하지 않음.
- 범위: 137종 source/variants/state/theme/caller 전수 검토, 후보를 실제 브라우저에서 확인 후 개선. Basic/PRISM 및 승인된 테마 특징 보존.
- 분담: controls 47, data/framework/navigation/layout 43, content/feedback/workflow 47. 읽기 전용 leaf 3개, 각자 고유 audit 노트만 작성. 공유 CSS·제품 코드·build·Git·배포는 root 소유.
- codex-auto-model-router 권고에 따라 leaf 요청 gpt-6-luna/high/fork none. 주·leaf 실제 runtime metadata unavailable. 추천·요청과 관찰값 구분.
- 진행: source audit in-progress, runtime candidate 검수 not-started, 구현/최종 검사/운영 반영 not-started.
- 직전 R14 PR170은 병합·운영 alias READY 확인. 공개 설치 CLI28개 pass, 실제 공개 설치 browser 확인을 마무리할 예정.

## 수용 조건

- 137개 ID별 검토 근거와 판정 보존. 초기 화면과 검사한 상태의 범위를 구분.
- 결함 후보를 실제 렌더링·계산 스타일·상태 전이로 재현하고 수정 후 같은 조건으로 확인.
- library 변경 시 정식 build/immutable snapshot/회귀 검사와 공개 registry 소비자 확인.
- 기존 dirty 기록·첨부 보존, 자신의 변경만 stage. 알려진 미검증 항목을 다음 작업자가 구분 가능하게 기록.

## 137종 source 및 실제 변형 조사

- leaf3개 노트137개ID/계약/근거 확인, 추가위임없이 종료. static PASS는초기정적판정이며실제상태검수로보완.
- 320px Clay에서66회 변형·오류·빈상태조작, preview-content overflow/error0. states-320.json. 모든상태·시각PASS를의미하지않음.
- root 재현: immersive Lightbox data-size=default라서320x740 viewport접합면에Material radius24/border0.8px 잔존. 기존 Dialog fullscreen 계약으로 연결.
- Menubar standalone bgwhite/noimage/noshadow, Clay 메뉴항목radius28/noimage/noshadow 확인. Menubar역할hook/공유menu항목의navigation radius·선택·강조 material 적용. danger색과disabled동작보존.
- ActionBar예시선택전padding16→선택후0 변동. 항상있는선택목록surface를panel로표시해중복프레임제거와안정적인여백소유권확보.
- 사용자추가변경후build/실제재검수/배포미완료. leaf소스PASS는이실제관찰결함에대해superseded.


## 39조합 상태 검사에서 추가 발견

- 수정66개조작을재현하고39지원테마×137종5343개변형geometry관찰. 이전초기화면검사와달리좌우DiffViewer의sr-only절대위치span이밖의containing block에배치되어HTML가로스크롤폭577px까지증가. body/appbox폭305px이라초기frame검사만으로는놓친결함. 스크롤영역relative로접근성텍스트도내부에격리.
- Basic CalendarScheduler의좁은host에서달력cell고정폭합계로약2px넘침확인. Calendar root max-width와daybutton max-width를부모내로제한, 기존데스크톱크기/Basic시각표현보존.
- alternate-final-320.json은수정전결함을포함하는중간기록. 최종PASS증거로쓰지않고수정후별도저장예정.
- 메뉴panel CSS의generic overlay specificity차이는별도review로발견해수정. checkedpaint는menuitemcheckbox/menuitemradio로한정하여indicator span을칠하지않음.


## 최종 동작·geometry 수용

- states-accepted-320.json:66개조작 오류/예시넘침0. alternate-accepted-320.json:지원39조합×137종, alternate-accepted-1440.json:Dark21모드×137종. 총8220개변형표시관찰, 오류/예시넘침/페이지넘침0. 전체가능상태검증을주장하지않음.
- DiffViewer relative 이후같은좌우비교에서HTMLscrollwidth577→viewport이내. 접근성문구보존/내부scroll유지.
- Calendar기본7열의15.75rem기준폭은유지하고max-width/min-width/table-fixed로부모에따라축소. CalendarScheduler layout grid-cols-1 추가. 최종320pxcell27.86px/root217.6px/내부table195px,frame243=scroll243로잘림해소.
- immersiveLightbox320x740 rect0,0,320,740/r0/border0,다음이미지2/3동작과실제스크린샷확인. frame경로/API변경없음.
- Clay메뉴 panel/item16px,checked/inset/gradient 확인. MenubarSpace→격자숨김상태변경,Context Shift+F10→메뉴열림확인. 큰QA에서긴메뉴batch는CDP키입력timeout으로중단되어완료증거로쓰지않음. 작은독립소비자로21모드동작검증예정.
- ActionBar initial/selected padding0 일치, Floating→보관1건→선택해제 동작. nestedBasic메뉴 r5/padding3.5/image·shadow none로격리보존.
- React검토:제품state/effect/요청/의존성추가없음. Lightbox가기존Dialogfullscreen계약을재사용. fixture만독립상태를추가해설치검수범위확장.
- source freeze: library CSS+5components, docs catalog/QA, 독립설치fixture34items. 최종정식검사및릴리스진행.


## 독립 설치에서 긴 ContextMenu 추가 재현

- 34종 독립설치 attempt-4dJwrR CLI/source equality/typecheck/build/strict21 gate pass. 실제320px검수에서긴영문ContextMenu폭200.7px이anchor154px오른쪽에열려right354.7px로잘림. 두독립관찰/screenshot에서지속확인,일시배치가아님.
- Radix의--radix-context-menu-content-available-width는166px이지만component가max-width를쓰지않음. content와subcontent의공유style에해당상한을연결하고item문구anywhere줄바꿈. 기존기본메뉴도동일한모바일문제수정.
- source가추가변경돼생성해둔snapshot96(c473762ce28df8da0ef6dbd21e7495023739926d61a9a4ec874b32ce61d4b2e8)을삭제·수정하지않고최종검증후후속snapshot을생성.96은아직운영배포되지않은중간스냅샷.
- 현재수정8종판정은유지(ContextMenu에추가폭보정). library6components+CSS,나머지변경범위동일. 최종CI/배포전다시빌드·독립설치검증필요.


## 최종 독립 설치 및 상태 검증

- 최종snapshot97 sha256-d5f4032e6dffccc5a17be9a51c5515efddf0d21068b99db147921f27942933cb 생성/148items.96과이전95개모두보존. 정식최종build진행.
- 마지막ContextMenu변경포함 fulltypecheck/UI303 pass. Docs15는동일docs최종변경후pass. CI에서전체재확인예정.
- attempt-hfJa4M 최종34개install/source equality/typecheck/build/strict21 gate pass. 실제browser320px21모드에서초안유지/페이지·CalendarScheduler넘침0,3종메뉴63개노출영역안쪽배치/내부넘침0,immersiveLightbox21개r0/border0/viewport일치. consumer-accepted-local-browser.json.
- 메뉴긴영문right354.7→viewport320이내수정확인. 빠른연속키입력에서간헐적CDP실패는실제열림을재확인후개별검수,미완료중간batch를PASS로쓰지않음. Menubar/Dropdown은ArrowDown,Context는초기키보드와후반우클릭경로로검수.
- desktop1440x900 Basic/Material/Drawn의frame/immersive6개:frame각테마radius/immersive0 유지. gallery-desktop.json. Menubar체크해제→Dropdown에서동일false/disabledtrue/danger163·52·56와일반28·48·39색분리확인. 키보드전체탐색·screenreader실사용검증으로확대해석하지않음.
- CLIbrowserVerified:false값은유지,실제browser증거를별도로연결. 운영배포/공개registry설치미완료.


## 릴리스 준비

- snapshot97 포함 정식최종build pass. 기존PRISM source변경0/새의존성없음. 릴리스검사완료후자체source·생성문서·96/97신규immutable·자체notes만stage예정.
- registry:release-check pass/snapshot97일치. remote main0eacf43불변,자체631logicalfiles stage/변경diff공백검사pass. 기존dirtynotes8개·첨부미포함보존. PR생성·exact-head CI예정.
