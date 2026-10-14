# Component design harmony R9

## 현재 상태

- 요청: textbox 기반 component의 디자인 조화와 여백 개선, 고정된 component 표현이 mode와 충돌하는 경우 mode에 맞는 variety 지원.
- 기준: origin/main `0b1dec2ba6df9451f1cb7dcd44056db8795aedfe`, 공개 release88. Fresh fetch 일치 확인.
- 작업 branch: `codex/design-component-harmony`.
- Basic과 PRISM 기존 표현, 공개 props·입력/선택/초안 상태·keyboard·지역 ThemeScope 계약 보존.
- 모든 component inventory와 실제 개별 문서 화면을 조사한 후 공통 재질·구조와 필요한 component 예외를 구현. 코드상 적용성과 실제 실행 검증을 구분.
- `.worknotes`의 기존 세 post-release 기록 수정 및 사용자 untracked 첨부/시안 보존.

## 실행 배분

- `frontend-design-workflow`, `frontend-development`, `software-engineering`, `pydemia-coding-style`, `codex-auto-model-router` 적용.
- 현재 도구의 model/effort 목록을 확인하여 router 실행: ordinary/240초/deterministic → gpt-6-luna/high/fork none delegate 권고.
- 실제 새 read-only leaf 두 개 생성: input_family_audit_r9 / component_material_audit_r9. 기존 요청의 worker 재사용 없음. 주 model/effort runtime metadata 확인 불가, 실행 설정 변경 추정 없음.
- Root: 공통 CSS·component 구현, 실제 browser 확인, build/registry/Git/공개 적용 소유.

## 수용 기준

- R1 각 textbox의 라벨·본문·보조문구·action 사이 여백과 inset 확보.
- R2 합성 입력은 외곽 container에만 재질을 적용하고 내부 input은 일체형 편집면으로 표현.
- R3 컴포넌트별 고정 radius/material이 디자인의 grammar를 덮지 않도록 의미 있는 mode variety 제공.
- R4 appearance outline/filled/underline, invalid/disabled/focus와 native 편집·검색·선택 동작 보존.
- R5 20모드/지원 밝기에서 대표 입력·editor·navigation·feedback·data family 실측, 모바일320/390 확인.
- R6 Basic/PRISM 회귀와 소비자 registry 설치 검수, immutable release88 이전 snapshot 보존.

## 아직 남은 작업

- 코드/개별 화면 audit, 구현, 실제 상태 검수, typecheck/tests/build/snapshot/CI/공개 적용.

## 구현·검수 중 결정

- 공개 Clay Light에서 개별144 catalog 초기 화면을 순서대로 조사. 입력(숫자/선택/파일 포함)이 있는51 preview 확인. 모든 상태나 모든 모드를 개별 화면에서 확인했다는 뜻은 아님.
- 공통 CSS의 unlayered 규칙이 Tailwind utility보다 우선: 외곽 합성 입력과 내부 Input의 radius/border/shadow 중복, underline background 누수 확인. 첫 material audit의 반대 cascade 설명은 root의 반증으로 철회·정정.
-35개 component에 semantic role/slot 추가, 모드별 높이42–48px·inset·field gap·editor 여백과 group/selected material 지원. props·state·handlers 보존. Basic/PRISM에 새 material rules를 적용하지 않는 bounded `@scope` 사용.
- CodeEditorShell panel/flat 구분, textarea/gutter padding와 row-height calc 연동. 직접 중복 border를 지우는 코드 편집면과 standalone Markdown Textarea를 구분.
- 독립 리뷰의 flat header/footer 지적 수정. ColorInput 새 hook을 generic Input과 분리해 Basic 기존 배경 보존. disabled stepper action만 막힌 경우 전체 field를 dim하지 않도록 native editable disabled 상태로 한정.
- dev QA에8 Basic component tree를 추가. 새 문서 preview 여백의 내부 Basic 누수를 발견해 bounded scope로 수정.
- 추가 QA에서 기존 DOMadapter의 HTML font-size13px(Swiss/Terminal)가 rem 기반 내부 Basic 여백·code line geometry를 바꾸는 문제 발견. 문서 rem 기준은 기존Basic14px(`--type-root-size` override 가능)로 고정하고 지역 font/body tokens는 모드별 유지.
- typecheck0, UI301/docs15/PRISM363 통과(최신 root unit 수정 이후 최종 build/회귀는 남음). 임시39 catalog 측정: mount144×39/compound inner0border·0shadow/underline 투명은 통과, Basic rem 차이는 위 수정으로 재측정 예정.

## 최종 후보 확인

- 문서 root unit 수정 이후39 지원 조합에서 실제 설정과 요청 일치,144 catalog mount, error0, InputGroup/Code/대표 초안 유지. 합성 inner border0/shadow none, underline transparent. 독립8 Basic tree의 computed styles39/39 동일.
- 공개R8 BasicLightNeutral vs 후보 개별37 component:36 computed 전체 동일. Combobox의 shadow 직렬화만 이전4개 transparent0shadow terms가 제거되며 동일한 실제4px16px shadow 유지. 이를 문자열 완전동일로 보고하지 않음.
- UI301/docs15/PRISM363, 최신adapter 이후 focus/ThemeScope/input-group/code/selection focused16 통과. docs최종typecheck0.
- local CLI `attempt-yRkWPz`: 실제shadcn14items+deps 설치/9 mode source·CSS 정합/tsc/Tailwind/Vite/21release gate 통과. 별도browser21에서 지역설정·열린Dialog합성 입력·입력/태그/탭/Prompt 초안 유지. CLI browserVerified=false 보존.
- mobileQA320/390×21:144 catalog 초기편집영역·합성입력 bounds 넘침0/errors0. QA의 Calendar/AvatarUploader/Table/Snippet/ScrollArea 고정 시안 wrapper 넘침은 별도 관찰; 모든144 container overflow0을 주장하지 않음.
- 실제문서 모바일Clay12종×320/390 최종page overflow0. Tag min-width가 generic input type selector에 져 좁아진 문제를 수정,96px 확보/줄바꿈 실측. 편집기·작성기의 예시용 중복 outer frame 제거.
- 작은화면560px 이하 bounded scope field insets12px/editor16px; Basic범위는 제외. BlockEditor320 textarea178px·390 textarea248px로 편집면 확보.
- snapshot89는 responsive수정 전 중간후보. 새 snapshot90을 생성하고 빌드·정합·공개 검수할 예정. 기존88 이하 immutable published 파일 변경없음.
- 실제 screen reader/다른browserengine/physical forced-colors는 실행하지 않은 범위로 유지.

## 릴리스 준비

- 최종snapshot90 `sha256-f890b4aed251cc09ea8ed53454248ba7419d7d6136dbf1acd47dbf2152664c5e` /148items. build→snapshot→build→current release check0.
- 중간snapshot89도 immutable 후보로 보존하며 이전published88 이하 변경없음. sourcefont/colormap/PRISM 제품source 변경없음.
- 독립 reviewer 최종responsive/source 검토: actionable없음. 수정한flat/frame/disabled/rootunit 문제의 반영을source에서 확인; 실제browser검수는root수행으로 구분.
- commit·PR·정확한head의CI·main운영배포·최종공개registry 설치/readback 남음.

## PR166 최종 시각 검수 추가 수정

- sourcecommit `f1b33a1a2a1e418de0a5ad61c50b83d8c0f8fe43`, PR166/CI38614790680.
- 최종 실제Glass 편집기 캡처에서 Code/Prompt inner field가 기존 generic `:not([data-appearance=underline])` attribute specificity에 져 border/radius/inset shadow가 남는 것을 발견. scoped slot selector를 attribute specificity로 맞춰 scoped proximity 우선이 적용되도록 수정.
- 이전39 frame 검사는 InputGroup/Affixed/Number/Tags를 검사했으며 Code/Prompt 내부border 검사는 빠져 있었음. 이 두 편집면을39모드 체크에 추가해 재검수하고 snapshot91/current source와 CI를 갱신할 예정.
- source audit의 code field 책임 확인을 실제CSScascade 통과 증거로 대신하지 않음. 운영판은 아직R8, 이 수정까지 검증 후 병합·배포.

## 편집면 수정 릴리스

- Code/Prompt 양쪽 편집면39 지원 조합 실측: non-Basic에서 border0/radius0/shadow none/transparent 통과.
- 독립 reviewer가 generic selector의0,1,0과 scoped slot0,1,0의 동률·scope proximity 우선 및 Basic제외를 재검토. 앞선 검토 누락을 기록, 해결된 targeted수정으로 판정.
- snapshot91 `sha256-b10239521b98a8449275eaf81424a59179298b914e78a57062f86dbb9db88a2e` /148items. build→snapshot→build/currentrelease검사0. 이전89/90중간후보·88이하published 보존.
- PR166 첫head f1b33a1a… CI38614790680 성공. 추가CSS수정의 새head CI 및 실제운영 적용/공개consumer검수는 아직남음.
