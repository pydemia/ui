# SearchInput 편입

2026-09-29. Inputs 범주에 `SearchInput`을 추가했습니다. 로컬 작업
트리는 72개 component, 74개 registry item입니다.

## 선택과 구현

`AppShell`은 이미 좌우·하단·floating panel과 bubble을 제공하며,
`ResizablePanels`는 좌우·상하 크기 조절을 제공합니다. 같은 골격을
중복하지 않고 검색 제출·초기화가 반복되는 관리 화면용 입력을 골랐습니다.
기존 `Input`은 필드만 제공하고 `DataTable`·`CommandPalette`는 각자
검색 상태를 관리합니다.

`SearchInput`은 이름 있는 native search form입니다. controlled·
uncontrolled 입력, `onSearch` callback 또는 native GET 제출,
field/toolbar 표현, 초기화 버튼과 Escape를 제공합니다. 초기화 후에는
입력 필드에 focus를 돌립니다. 서버 요청, 검색 결과와 URL 상태는
소비자가 관리합니다. form을 렌더링하므로 다른 form 안에 중첩하지
않습니다. WHATWG Search state와 W3C WAI search landmark·label
지침을 참고했으며 외부 component source는 복사하지 않았습니다.
직접 registry 의존성은 기존 `pyd-input`·`pyd-button`이고 새 npm
dependency는 없습니다.

## 검증

- `npm run typecheck`, `npm run build`, `npm run registry:check`,
  `git diff --check` 통과. 기본 공개 URL의 74개 registry item이
  생성됐습니다. 문서 앱 build에는 500 kB 초과 JS 청크 경고가 남았으며
  별도 성능 측정은 하지 않았습니다.
- server render에서 form의 landmark·action·method·name·값과
  잘못된 label·name·값·controlled props 거부를 확인했습니다.
- 문서 Chromium에서 Enter 제출, 초기화 버튼·Escape, 입력 focus
  복귀, toolbar 변형과 어두운 모드를 확인했습니다.
- 새 Vite 소비자 fixture를 로컬 base URL로 설치해 SearchInput,
  Input, Button, utils, tokens, MIT 고지 6개 파일을 받았습니다.
  줄바꿈을 정규화한 뒤 원본 source와 고지 내용이 일치했습니다.
  소비자 typecheck·build와 callback 검색·Escape·native GET 제출을
  확인했고 console error는 없었습니다. runtime audit의 high 이상
  취약점은 0건입니다. fixture는
  `%TEMP%/pydemia-ui-search-input-local-consumer-20260929`에 있습니다.

첫 설치 시 기본 공개 URL을 사용해 전이 의존성이 기존 게시본에서
설치됐고 MIT 고지가 없었습니다. README의 안내대로 로컬 base URL로
다시 빌드·설치한 결과 고지가 생성됐습니다. 검사 후 산출물 URL은
공개 기본 주소로 복원했습니다. 이번 변경은 아직 게시하지 않아 공개
registry 설치를 확인하지 않았습니다. screen reader 발표와 다른
브라우저의 native 초기화 버튼은 검증하지 않았습니다.
