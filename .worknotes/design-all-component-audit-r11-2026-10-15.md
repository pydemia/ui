# Entire catalog material audit R11

## 현재 요청과 인계

- 사용자 추가 요청: 지금 제시하지 않은 다른 component들도 모두 확인하고 개선할 부분 반영.
- R10 목표를 대체하지 않고 전체144 catalog로 audit 범위 확장. Basic/PRISM, 잘 조화된 Breadcrumb/FormWizard/Timeline/Thread의 기존 표현 보존.
- 작업 branch `codex/design-navigation-schedule-harmony`, R10 source commit `742e4574805d29c5473a9b6463c61c9d03ae7941`.
- PR167 open, 미병합: https://github.com/pydemia/ui/pull/167 . PR CI38740753210은 최초 head 검사이며, 이후 확장한 최종 head CI까지 확인 후 병합 예정.
- R10 snapshot92 `sha256-e2bd6e9e41623e4d8f9d313a0aa0f110dbd405c7d77e57cdded4dfe5c5d7d896` 보존. 새 source 변경 완료 후 새 snapshot 생성.
- 운영은 아직 R9/main7543312. 개선이 이미 운영 반영되었다고 보고하지 않음.
- R10 상세: `.worknotes/design-navigation-schedule-harmony-r10-2026-10-15.md`와 browser-evidence/component-material-r10.
- 현재 uncommitted: 독립 consumer fixture main/ThemeScope에 min-width0 및 grid-cols1 추가 중. 실제 좁은 화면에서 auto grid track 때문에 Gantt가 커지는 fixture 문제이며 제품 Gantt의 row/기간계산 변경 아님. 최종 소비자 검수에서 재확인 필요.

## 범위와 기준

- 전체144 inventory: 실제 source와 개별 예시의 root/내부 painted면/toolbar/selected/empty/disabled 상태 접근점 조사.
- 기존20모드 재질·font·colormap 토큰을 사용. 단순히 모든 흰 면을 지우거나 전 요소를 카드로 감싸지 않음.
- 새 개선은 mode에 고정 스타일이 충돌하는 component에 한정. status색·차트 데이터색·이미지·코드 가독성과 고유 의미 보존.
- root 공유 CSS/build/Git/registry/운영 적용 소유. 독립 audit leaf는 별도 지정한 read-only 범위만 수행.
- 실제 browser 전체 catalog 초기상태의 mode 적용성 확인과 대표 시각·행동 검수 구분. 실행하지 않은 모든 상태/engine 검증을 주장하지 않음.

## 남은 작업

- 전체 catalog source/실제paint audit 및 변경필요/정상/데이터고유색 보존 분류.
- 발견한 material seams 수정, 39 지원조합·모바일·Basic/칭찬4종 회귀 및 필요한상태 동작 확인.
- consumer fixture responsive 수정 확인, 최신 실제registry install/소스·CSS·browser 검수.
- 최종 build/새immutable snapshot/PRbody 갱신/exact head CI/merge/운영READY SHA/public readback.

## 통합 및 검증 진행

- 144개 inventory를 35/32/77개로 분담해 모든 항목을 source 기준 조사. 세부 분류는 data-layout/content-media/controls-feedback-material-audit-r11.md 참조.
- 초기55개 component source에 실제 면/제목/내용/선택/미디어의 의미 hook 추가, 기존 색상·이벤트·ARIA 유지. Markdown 코드 면과 FormWizard 내장 Stepper 예외는 root 통합.
- mode CSS는 기존 재질 토큰을 재사용하고 nearest non-Basic scope에만 적용. panel/well/row/media/status/header/read-plane를 구분해 낮은 장식 변형 보존.
- 독립 검토 full-material-review-r11.md의 사용자 메시지 미정의 토큰(P1), flat/plain에 무조건 paint(P2) 수정. 사용자 말풍선의 밝은 장식 gradient도 제외해 의미색과 흰 글자의 대비 유지.
- Image 미선언 data-surface prop/ToastRegion 범위 밖 variant는 통합 중 수정. Accordion ref/single/multiple 실제 DOM 2개 테스트 통과. DiffViewer 기존 테스트는 인접 attribute 가정만 완화(스크롤 region/tabindex 계약 유지).
- typecheck 통과. 전체 UI303 중 최초302통과/1실패는 위 attribute 순서 가정이며 해당 테스트 수정 후 재검증 중. Docs15통과, PRISM363 실행 중.
- 최종 Basic 144개 6,018 DOM face의 배경/반경/테두리/여백/폰트/그림자 일치. image none인 0px/0% background-position 표현만 정규화.
- Clay 칭찬4종 비교에서 일반 Button의 150ms color transition 이전/이후 palette 값만 달랐고 나머지 속성 동일. 최초 즉시 비교 결과를 정지 상태의 완전 pixel parity로 주장하지 않음. 4종 고유 구조·스타일 source 보존, FormWizard embedded Stepper 추가만 제외 표시.
- nested Basic 24종으로 확장, QA flat/plain 6종과 실제 consumer 22개 registry item으로 확장. 39조합 및 모바일 검수 진행 중.
- 최종 registry/build/merge/운영 readback 전으로 운영 적용 완료 상태가 아님.

### 추가 실제 검수 결과

- UI303 / Docs15 / PRISM363 전체 테스트 통과. Accordion2개 추가 테스트는 실제 root ref·single/multiple 값/펼침/unmount 검증.
- 39 지원조합 전체144 mount/예외0, 실제설정 일치, 초안 유지, nestedBasic24종 paint 일정. flat/plain 6종 panel 전용 header/reading-plane 누출0.
- 사용자 메시지39조합 배경은 정의된 --message-user-background, 흰 글자, 장식 gradient none. 계산색 대비 최소7.305:1. assistant translucent/gradient 모든 픽셀의 대비를 측정한 결과는 아님.
- 320px 전체 외곽144 bounds는 넘침0. 내부에서는 AvatarUploader flex/file input, Snippet/Table preview minimum width, ScrollArea preview grid의 min-content 확장 발견. 실제 입력·자료는 유지하면서 wrap/제한된 스크롤로 수정.
- AvatarUploader와 ScrollArea의 추가 source hook, 파일 선택 버튼 재질, ScrollArea thumb 재질 및 실제 framed 예시 두 면 추가. 초기35/32/77 조사에서 유지 판정된 두 항목을 root의 실제모바일근거로 수정 판정으로 갱신.
- 후속 CSS/source 변경 때문에 typecheck/최종 browser 확인을 다시 수행한 후 새 snapshot 생성 예정.


## 최종 source 검수 및 snapshot93

- component source 총57개 추가 개선(기존 R10 10개와 별도): 모바일 실증으로 AvatarUploader/ScrollArea까지 포함. 장식보다 의미가 우선인 상태·시리즈·diff·이미지 원색은 유지.
- 최종 UI303 통과. Docs15/PRISM363 통과 및 최종 TS source UI build 통과. 추가 DOM hook/layout class 이후 전체 UI 재실행 통과.
- 실제320/390×21=42 검수: 각 응답의 innerWidth도 기록. 전체144 예시 wrapper의 right-bound 및 내부 scrollWidth 넘침0/errors0. 표·코드 등 컴포넌트가 명시한 내부 스크롤은 허용. 중간에 새 탭이 viewport override를 계승하지 않은2002px 측정은 폐기하고42개를 실제320/390으로 다시 측정.
- Basic 최종143개 paint 배열 일치, ScrollArea는 예시 grid min-content 문제 수정으로 Radix scrollbar 하위 노드52→53 변화. Basic144개 전부 pixel동일이라고 보고하지 않음. AvatarUploader는 Basic에도 grid min-width 오류를 고쳐 좁은 화면 파일 입력 넘침 해소; desktop paint 유지.
- 실제 문서 Clay Board 선택/작성 Dialog, Glass CodeBlock의 alpha0.6/blur22px/radius22, Retro NotificationCenter panel/plain 변형 확인. plain 전환 시 panel header0/shadownone, 기존 상태 유지.
- 기존 immutable92 이하 보존, snapshot93 `sha256-f5838edfd2e486b7e233b6f10d9f45c5f8fe7e3271b72f9800e1340197d7cf86` /148items 생성. 최종 docs/build/release-check와22개 실제registry설치 진행 중.
- 새 모델 reviewer의 P1/P2 remediation 완료. 기획·사용자 상태·공개 API 계약 변경 없음. 새 state/effect/fetch/lockfile 변경 없음. Accordion wrapper ref는2개실DOM테스트로 검증.

## 릴리스 검증

- 최종 build / registry:release-check 통과:148 registry,144 exports/catalog,10 fonts/20 palettes/40 Colors project,93 immutable releases/current snapshot93 일치.
- 실제 shadcn4.21 로컬22items+deps 설치 attempt-69rCK9 통과: mode9 source/CSS equality, tsc/Tailwind/Vite, strict21 release gate. CLI report browserVerified=false 유지, 별도 browser-verification-r11.json21개 전환 검수.
- 독립 앱에서 draft·Tree Schedule 선택·날짜·Accordion 접힘 유지 및 flat LogConsole 투명색 확인. rootDark/regionalLightForest 및 dark-only normalization은 기존 foundation 경로 유지.
- consumer fixture Gantt auto-grid track 수정 외에, debug JSON output의 끊기지 않는 텍스트가 만든314px 페이지 넘침을 overflow-wrap:anywhere로 수정. 실제320px document page overflow0 확인. 이 fixture 수정은 제품/immutable registry source 변경이 아님.
- PR167 최종 범위 설명과 최신 head CI·merge·운영 readback 대기. 운영 적용 완료 아님.
