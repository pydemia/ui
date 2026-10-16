# Tree / TreeNav 펼침 표시 크기 R18

- 요청: Tree와 TreeNav의 쐐기 표시를 더 크게 표현.
- base: main `3f22fecf0ed00c520a070b59fe0deede904de45a`.
- 범위: 두 컴포넌트의 펼침·접힘 아이콘과 registry 의존성.
  기존 테마의 투명 버튼, 행 높이·계층 들여쓰기·선택·키보드 동작 보존.
- 결정(agent-selected): 폰트에 따라 작게 보이는 문자 표시를 20px SVG
  Chevron으로 통일. Tree의 아이콘 칸도 20px로 확보하며 TreeNav의
  버튼 크기는 유지. 별도의 배경·외곽선은 추가하지 않음.
- 실행: 짧은 국소 수정이므로 직접 구현·검증. 이전11개 dirty 기록과
  원본 첨부, R17 중간27cd untracked snapshot 보존.
- 완료 기준(동일 가중치): ① 두 컴포넌트 크기 개선 ② 화면·조작 검증
  ③ 운영 및 공개 registry 반영. 현재 0/3.
- 구현: 두 TSX의 문자 쐐기를 Lucide ChevronDown/Right 20px,
  strokeWidth2.25로 교체. 재시도 표시는 기존 동작 유지.
  두 registry item에 기존 라이브러리 lucide-react@0.468.0 명시.
- 검사: UI build(TypeScript 포함) 및 Tree/TreeNav/TreeSelect 기존
  동작 테스트9개 통과. React checklist에서 hook/state/ref/event 변경
  없음, 아이콘은 기존 aria-hidden 영역 안에 있어 접근 가능한 이름 보존.
- 화면: 두 컴포넌트 × 21개 default 테마 × 320px/1440px = 84개
  component 관찰에서 SVG20×20, 가로 넘침2px 초과 없음.
  Glass320 Tree ArrowLeft/ArrowRight 및 TreeNav branch click 검사 통과.
  증거 `browser-evidence/tree-disclosure-r18/theme-matrix.json`,
  `local-glass-treenav.png`. viewport reset 후2002px 확인, local QA 탭 닫음.
- 진행: 기준 2/3 완료. README의 build→snapshot→build→release-check
  순서로 공개 산출물 생성 진행. 이번 추가 검사는 두 컴포넌트 범위이며
  다른 component 전체 재감사는 반복하지 않음.
- 첫 공식 build 및 snapshot 생성 통과. 최종 release
  `sha256-2cdc49bd7c3b091c5425a3795de05ea0abe17363f15af826021c0f14e92a0123`
  (148 items). 기존 공개99개 release의 source/mirror 보존.
  최종 build와 release-check 뒤 source/generated output/이 기록만 commit.
- 최종 공식 build 통과. release-check 진행. 기존 package의 동일 아이콘
  라이브러리를 사용하며 registry 외 root dependency/lockfile 변경 없음.
  기본 Tree를 포함하는 TreeSelect도 변경된 아이콘을 상속.
- release-check 통과. remote main이 base3f22 그대로임을 재확인.
  local dev5238 종료. PR/CI/운영 화면과 공개 item readback 확인 예정.
