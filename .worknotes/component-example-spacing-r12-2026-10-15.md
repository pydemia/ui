# Component example spacing R12

- 사용자 요청: 예시별 왼쪽/위쪽이 붙는 불균형을 조사해 자연스러운 여백으로 맞춤.
- 기준: main/운영 b496b8ca0cebadcea4a4fc407d85dfa07661d829, PR167/snapshot93 적용 이후. 이전 세션 기록 design-all-component-audit-r11-2026-10-15.md 참조.
- 기존 사용자 dirty 기록/첨부 보존. 새 branch codex/component-example-spacing.
- R1: 전체144 예시의 공통 stage/예시 wrapper/component 내부 body 간 여백 소유권 확인, 실제 내용이 왼쪽/위쪽 경계에 붙는 경우 수정.
- C1: 승인된 각 디자인의 재질·색·폰트 유지, 행동/API/상태와 PRISM 유지. 의도된 창 header·table grid·일정축의 경계 밀착과 본문 여백을 구별.
- D1(agent-selected): 기존 소유자의 padding 규칙을 정리, 중복 frame/padding 또는 임의의 모든 descendant padding 추가 지양. 필요한 범위만 구현.
- 검증 예정: 전체 source/실제 표시 조사, desktop/mobile320/390, 모드별 저밀도/고밀도/큰반경 대표 및39조합, 기존상태/공개설치 영향 확인. 실제 변경 범위에 맞춰 tests/build/CI/운영 readback.
- 진행: 원인 조사 중, 구현/배포 완료 아님.

## 조사 및 결정

- 독립 source audit: component-spacing-source-audit-r12.md. 새 leaf gpt-6-luna/high/fork none, read-only source 범위. 현재 tool schema에 확인한 model/effort를 router에 전달해 delegate 실행; main runtime model/effort는 노출되지 않음. 첫 --model-surface-file 미지원 호출은 local fallback, 올바른 --model-surface-json으로 재실행. 추천과 실제 runtime 관측 metadata는 구분.
- 실제144 예시에 main과 같은 stage를 재현해 첫 요소/프레임 경계 조사. TreeWalker/Range 읽기는 browser facade 미지원이어서 사용 중단, 허용된 element bounds/computed style로 검수.
- 원인1: `.preview-stage > *`의 전역padding18·frame·filter가 실제 component root까지 덮음. 여러 종류 root의 예시별 padding0/18/20이 불규칙하게 합성됨. Tailwind utility는 layer에 있으므로 단순한 동일 specificity보다 unlayered override가 핵심.
- 원인2: 두 열 그리드에서 code panel이 높아질 때 preview stage가 부모 아래까지 채우지 않아 추가 빈공간 발생. 실제 ArtifactViewer panel414.8/stage327/하단 unused44.8px 확인.
- D2: 문서 전용 `.preview-content` scaffold에만 예시 frame/inset을 부여, arbitrary component root 장식 제거. 기존 panel/figure/합성workspace 및 flat/plain variant는 자기 면/내부 여백을 사용. 컨트롤 그룹은 명시한 frame padding16~24, stage20~32(작은 화면16), max-width520 및 중앙 배치.
- D3: preview-panel을 flex column, caption shrink0, stage flex1로 변경해 전체 남은 높이를 사용하여 상하 여백 대칭 확보.
- library component/CSS/registry/font/palette/동작은 변경할 근거가 없어 유지. 문서·개발 QA만 변경, 새 registry snapshot 필요 없음(현재93 유지).
- 최초 Clay 전체144 stage: 경계밀착0/좌우상하 불균형0/외곽및내부넘침0. 실제 두열 레이아웃 보완 이후 최종 검수는 진행 중.

## 작은 화면 조정

- 중간 QA는 main p20 + section p16 + stage p16으로 실제 문서보다 두 단계 더 좁았음. QA를 p16 + section padding0으로 바꾸어 실제 문서 폭에 맞춰 재측정, 과도하게 좁은 이전 결과는 최종 pass 근거에서 제외.
- compound field 자체 frame, Rating의 입력/readonly/제출 조합에는 중복 예시카드가 필요 없으므로 frameless scaffold로 정리. Rating demo에 workspace 표시, library Rating의 크기/기능은 유지.
- 모바일 Basic Scheduler 예시는 자체p16과 Calendar의 intrinsic width 때문에6px 내부 넘침 발견. 410px 이하 예시 caller에서p12로 맞추어 stage16 + panel12 + calendar내부 여백의 자연스러운 작은화면 밀도로 조정. 공유 component/registry 변경 없음.
- 기존39 desktop144 여백/넘침/렌더 검수pass, 최종 모바일+후속조정 재확인 중.

## 최종 구현 범위와 화면 검증

- library component/design-modes.css/registry/font/palette 수정 없음. 문서 source4개만 변경: main 공통 scaffold, styles, catalog 예시 caller, 개발전용 QA. snapshot93 유지.
- 작은화면 Glass/Spatial의 layout 바깥padding16을 한 겹 제거해 자연스러운 가용폭 확보. 상위 chapter 면과 component 자체 여백은 유지.
- TagsInput demo의 grid-cols-1, readonly Rating demo의 flex-wrap으로 좁은 예시에서 intrinsic track/한 줄 값 넘침 방지. 라이브러리 구현을 덮는 CSS 전역보정 아님.
- QueryBuilder demo는300px 최소 편집폭을 named/focusable 내부 가로 스크롤 region에서 보장, 복잡한 중첩조건의 여백/버튼을 잘라내지 않음. Tabs 자체 구조에는 중복 preview frame 제거.
- 모바일 Basic Scheduler caller는 `max-[410px]:p-[var(--space-3)]`으로 기존 space3 토큰 사용. 앞선 p-3 실험은 최종코드 아님.
- 개발 QA는 main과 같은 scaffold + 선택적 previewWidth URL로 실제 가용폭을 재현. QA는 production 빌드 입력에서 제외.
- 최종39 지원 디자인/밝기×144: 예외0, 실제설정과 요청 일치, stage 경계밀착0, 좌우·상하 비대칭2px초과0, stage/frame 넘침0. modes-final-39-144.json.
- 최종320/390×21=42×144: 위 동일 기준 모두통과, 실제innerWidth320/390 확인. mobile-final-42-144.json.
- 실제모바일Glass/Spatial의236px canvas폭을 QA로 재현한 각144 추가검수: 예시 바깥넘침0, 의도한QueryBuilder 내부스크롤은 유지. narrow-glass-spatial-144.json.
- 실제 main Clay desktop9종 + Glass320/390 각10종=29: page/stage/frame 넘침0, 좌우상하대칭2px이내, stage 부모 하단미사용<=1px(border포함). actual-main-final.json. 초기 DataTable 분류 오선택은 source inventory로 수정, 실패한 중간모바일 측정은 최종 JSON에서 제외.
- 실제 Input에 Spacing draft 입력 후 Neumorphism 전환, native input.value 유지 확인. HTML value attribute가 없는 uncontrolled field를 attr로 판정하지 않음.
- Docs15 tests 통과. 최종 docs typecheck/build/current snapshot check 진행 중. CI/PR/운영readback은 미완료.
- 날짜는 한국시간2026-10-16으로 넘어갔으며 kickoff 날짜의 동일 R12 기록/파일 유지.

## 릴리스 전 추가 검토

- typecheck 최종통과, build 및 registry:release-check 통과(current snapshot93 unchanged).
- 상태 의존 면 검토에서 Toast 표시 후 scaffold가 갑자기 frameless가 되는 가능성을 발견해 status surface를 프레임 소유권 자동판별에서 제외. Alert/Empty/ItemList는 안정적인 root ID로 판별해 plain 상태도 불필요한 프레임을 얻지 않도록 정리. 초기144 mode matrix의 소유권 분류는 동일하며, 이 상태 전환은 별도 실제검수 예정.
- CSS 최종수정으로 docs 재빌드 필요. build-site.mjs 직접실행은 npm 실행 환경 guard로 중단되었으며, guard 우회 대신 정식 npm run build로 재실행. 앞선 성공을 최종 CSS 빌드 성공으로 보고하지 않음.
- 기존 라이브러리/공개 API/colormap/font/registry 불변, 상태와 여백 소유권의 문서 전용 개선.

## 최종 빌드 및 상태 검수

- 최종 npm run build 통과. registry:release-check 통과, snapshot93/148items·fonts10/palettes20/Colors40 불변. packages/registry 및 docs/r diff0 확인.
- production bundle preview에서 Toast 표시 전후 scaffold padding24 동일, Alert/Empty plain 전환 전후padding0 동일 확인. compiled-variant-stability.json. transient 상태에 따라 예시 바깥 여백이 변하는 문제 차단.
- React best-practices 검토: 새 library state/effect/fetch/의존성 없음, 기존 handler·ARIA/label/control 계약 유지. QueryBuilder 스크롤은 named region/tabIndex0과 focus outline 제공. QA previewWidth는 개발 fixture만 적용.
- 공개컴포넌트기능 변경이 없으므로 구현을 복제하는 새 테스트 추가 없이 기존 Docs15와 TS/build·실제 렌더/상태 검수 적용. CI는 저장소 full checks 실행 예정.
- PR/CI/운영배포 확인 전이며, 이 단계가 운영반영 완료는 아님.
