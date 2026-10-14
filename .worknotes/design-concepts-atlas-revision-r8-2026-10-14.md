# UI Design Atlas 개정판 반영 · R8

사용자 최신 요청: 최초 source의 개정판 HTML/PDF에 구현 방향을 설명했으니
각 디자인의 concept와 특성을 그 문서에 맞춰 구현한다. 이전 전면 개선
요청의 연속 작업이며 Basic/PRISM 보존,21 IDs/B 선택/상태 계약은 유지한다.

입력 원본(첨부는 변경하지 않음):
- .codex-remote-attachments/01a135ab-4ff7-7ab3-9cd8-e13775e37a43/
  1d096d37-f7bc-44c8-b639-b001c7b887dd/2-ui-design-atlas-20-1.html
  SHA256 bb06d329ecc9a933c0c3046af4666066e0bdc3f5ba560ac005ccb9a6f662a295
- 동폴더 1-ui-design-atlas-20-1.pdf ·41pages
  SHA256 d0be60576ae10bfa58ae9a05f6f13fd5b9915266b64c0ef241a119ab471a5746
- HTML710 lines text와 원문 대비 diff, PDF 전체 text 추출. 실제 PDF
  pages3/17/41을 렌더해 Glass/Clay/Spatial 설명과 예시 구성 확인.

R7 선행 공개 기준 버전:
- source dffbc3ce, PR164 병합/main9d9a8c13, release87/0454d1db…148items
- PR/main CI 성공, production dpl_FayWiW6nCL6FJf9npKVinEsRp2QG READY/alias 동일 SHA
- 공개21종 실제 적용·문서/profile 초안·고정 iframeSRC 유지 확인
- 공개 installer attempt-7n1sSP source/CSS/tsc/build/strictgate +실제21종
  열린Dialog/지역Forest/초안 유지 확인. CLI raw browser flag와 별도 실제
  browserVerification 구분. manifest 공개 bytes도 로컬과 일치.
- 최신 요청은 R8로 추가 작업을 열었으므로 기존 Goal을 완료 처리하지 않음.

개정판 해석:
- Material/Fluent는 디자인 시스템, Bento는 배치, Dark는 테마,
  Terminal/Spatial은 인터페이스 방식. 같은21 프리셋을 유지하면서 분류를 명시.
- 재질은 적용 위치와 정보 판독성을 함께 지킨다. 모든 요소에 효과를 반복하지 않음.
- Skeuo/Terminal/Retro/Pixel은 조작·상태가 실제 값과 연결된 예시로 보완.
- 웹 구현의 메타포를 사용하며 native WinUI/TUI/AR 입력 지원으로 주장하지 않음.
- Dark의 시스템 자동 선택은 첫방문 Basic/Light 계약과 충돌해 도입하지 않음.
  사용자가 고른 모드/밝기와 기존 theme-controller 계약을 우선한다.

router: 현재 여유3slots 확인, task별 plan의 두 Luna/high/fork none을 실제 생성.
주 모델과 자식 runtime metadata unavailable, 생성 요청과 관측값을 구분.
- read-only20종 audit: design-concepts-revised-atlas-audit-r8-2026-10-14.md
- interaction leaf: 새 design-concept-experience.tsx/.css만 담당, root wiring/build/Git 소유

구현 중:
- Glass 데이터면96% tint·본문면 안정화, Fluent acrylic을 overlay로 제한
- Clay 주요 액션/featured 카드에 입체감, 일반 탐색·표는 평평하게 조정
- Neumo 일반 입력/버튼 경계1px, Brutal 눌림 offset/shadow, Cyber 보조glow 절제
- Drawn 정돈된 입력·손그림SVG/선, Editorial68ch 기사형 예시 추가
- 실제 기간과 연결한 range 다이얼, 같은 업무 상태의 Pixel progress/sprite,
  Terminal 범위별 검색/탐색/도움말 shortcuts, Retro 창 상태/이동 대안 추가
- root 검토에서 leaf의 조건부 tree remount, 비정수 sprite 배율, 다이얼 눈금
  불일치를 발견해 수정. 현재 Frame의 children 경로는 모든 디자인에서 동일.
- 개정판 HTML을 유지되는 public source atlas에 반영하고 후보의 상세 링크 연결
- 현재 타입 검사0. 이후 변경의 최종 타입/테스트/브라우저/새snapshot/CI/배포는 남음.

원본86/87 snapshots와 사용자 첨부·기존 시안은 유지. 실제 screen reader/
200% zoom/활성 media/blur 미지원 및 새 pointer drag의 실제 입력 검수는
실행한 범위만 기록한다. 코드 검토나 키보드 대안을 실제 pointer 실행으로 보고하지 않는다.

## 최종 소스 검수

- frozen11 파일의 독립 상태/scope 리뷰: actionable regression 없음.
- 독립 시각 리뷰 재판정: Preview 파일의 Editorial 실데이터 기사/68ch와
  Drawn SVG를 실제 캡처와 대조해 확인. 두 누락 지적 철회, 추가 actionable 문제 없음.
- Skeuo NativeSelect+range는 같은 period의 직접선택/키보드 대안으로 유지.
- 전체 typecheck0, UI301/301, docs15/15. 이후 Terminal 문자그래프 추가의 docs typecheck0.
- 실제 catalog39조합 ×144개, error0/입력·업무period·검색·선택 유지.
- 최종 열린Dialog39조합 전환/초안 유지0실패(portals-r8.json).
- 실제 문서21종 적용/profile 동기화/양쪽 초안 유지/iframeSRC1개(applied-r8.json).
- 모바일320/390×21: 후보 선택만으로 적용되지 않음, 명시 적용 성공,
  문서/상세 미리보기 가로 넘침0, 초안 유지(mobile-r8.json).
- Basic 실제 이전R6와 같은 포인터 상태 비교: 존재하는5표면 computed 동일.
  2개 잘못된 class selector는 missing으로 기록하며 비교 통과 표면에 포함하지 않음.
- Terminal 문자그래프 month4rows→week7rows 및 실수치 확인.
- 다이얼 End→month/KPI, Retro24px 이동·min/max/close와 mode간 업무 상태,
  Terminal검색/개요/실행/도움말·입력 중 shortcut무시, Pixelretry3→2/6 실측.
- CLI/fullbuild/snapshot/CI/공개배포 검수는 다음 단계. 현재 공개 버전은 R7.

## 추가 사용자 요청 · 개별 colormap / font

- 시안 + colors.pydemia.ai로 각 design default 팔레트 생성 요청 수용.
  colormap-management 적용. 실제 Colors site에서 생성 JSON의 기준색/역할색
  가져오기 확인. 실제 Colors source ec79fce0…의 recommend/tone/contrast/coreProject 사용.
- source audit: palette-anchors-r8.json20종, 이미지 해석값과 명시 HEX 구분.
  audit의 `neumo`를 실제ID `neumorphic`으로 정규화. Basic/Neobrutal RGB 보존.
-20개 고유 이름/6swatches/LightDark14semantic tokens와40편집용 schema2 JSON.
  기준색 정확 보존,320contrastpairs 최소4.5 이상. check-design-assets로
  기본값/다운로드 roles/기준색 lock/원본fontbytes 정합성 검사.
- font-library 적용, skills 사이트 Manrope 실제 공개 page/source/license 확인.
  initialagent7families/8assets13.8MB는 후보 기록. root최종8families/10assets10.57MB.
  큰Noto10/23MB 대신 승인NanumGothic400/700 +NanumMyeongjo400 한글11,172자.
  원본font+license SHA와decision을 root에서도 대조, 변환·subset 없음.
- new fonts는 Pydemia Design family alias로 Basic/PRISM 기존font와 충돌 회피.
  개별사용face만 publichashURL에서 로드. 로컬codecomputed/staticmetadata검사와
  공개배포후실제font로드검사는 구분. 현재 새폰트 공개URL의 런타임검사는 아직대기.
- latest palette/font integration이 추가되어 이전39/21/mobile관측은 그전소스.
  새로운colors/fonts에서 최종회귀/공개실측을 재실행한 결과로 별도기록할 예정.

## 2026-10-15 릴리스 준비

- 추가 palette/font 정적 독립 리뷰: actionable0, 원본10fontbytes/catalog SHA 일치.
- skills.pydemia.ai 공개asset API10개도 직접 읽어 원본 SHA/크기10/10 일치.
- 최신 UI301/docs15/typecheck/PRISM363 통과. asset check20palettes/40JSON/10fonts 통과.
- 첫 asset build에서 registryTarget에 새fontCSS허용이 빠져 실패, 허용경로를
  추가하고 fullbuild재실행0. 검증·scope·private asset 권한을 완화하지 않음.
- local CLI attempt-t2Lx8E: 새3deps 포함 source/CSS정합/tsc/Tailwind/Vite/
  strict21released gate 통과. 브라우저실행은 별도이며 이 CLI의 browserVerified=false 보존.
- 새 snapshot88: sha256-4123c714b14326b201a13680276ca58a130680eeb12da9acace8dfffd0b4d969 /148items.
- 원본86/87 published snapshot 변경없음. 마지막freshfetch origin/main9d9a8c13.
- build2/currentrelease검사0, 새compiled registry와snapshot88정합확인.
  commit/CI/merge/운영배포와 새font실로드·공개consumer검수는 아직대기.
