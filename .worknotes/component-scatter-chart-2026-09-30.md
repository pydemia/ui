# ScatterChart 두 연속 수치 분석

## 선정과 구현

기존 `DataChart`의 x축은 범주이며 `Heatmap`은 두 범주의 교차값을
표시합니다. 처리량과 지연처럼 두 연속 수치의 관계를 비교하는 화면에는
산점도가 필요해 `ScatterChart`를 별도 component로 작성했습니다.
Recharts 공식 문서와 같은 revision의 소스·manifest·MIT LICENSE를
확인했으며 좌표축 개념만 참고했습니다. 구현은 원본 React·Tailwind이고
registry 의존성은 `pyd-utils`뿐입니다. 출처는
`research/source-inventory.md`에 기록했습니다.

고유 ID·이름과 두 좌표를 입력받습니다. `null`은 결측값이고 `0`은
관측값입니다. 완전한 좌표만 plot에 표시하되 모든 행을 펼칠 수 있는
native 표에 남깁니다. 포인터 점 선택과 키보드 native 선택기는 같은
선택 상태를 사용합니다. 정확한 값은 선택기 아래에 표시하며 SVG는
장식으로 숨깁니다. 명시적 범위 밖의 값과 비유한 값은 오류로 알립니다.

## 검증 상태

- `npm run typecheck` 통과. 초기 패키지 테스트에서 SVG `<title>`의
  React 경고를 발견해 수정했으며 전체 테스트 89/89를 경고 없이
  다시 통과했습니다.
- 로컬 Chromium의 1280px에서 점 클릭과 native 선택기의 `ArrowDown`이
  선택값을 갱신했습니다. 펼친 표에 열 헤더·0·토요일 결측값이
  남았습니다. 결측만 있는 목록과 빈 목록의 서로 다른 상태도
  확인했습니다.
- 390px에서 문서 폭은 390px, plot 영역은 표시 폭 296px·스크롤 폭
  560px이었습니다. [데스크톱](scatter-chart-desktop.png)과
  [390px](scatter-chart-mobile.png) 화면을 남겼습니다.
- 점의 계산된 fill은 neutral light `rgb(36, 93, 112)`, dark
  `rgb(131, 191, 210)`, Pydemia colormap `rgb(241, 154, 177)`로
  바뀌었습니다. 브라우저 page error는 없었습니다.
- axe 4.12.1에서 선택값의 `dl`에 잘못 부여한 `role=group`을 찾아
  제거했습니다. 수정 후 preview와 펼친 표 모두 violation 0건,
  SVG 글자의 배경을 판정하지 못한 contrast incomplete 1건입니다.

- `npm run build`와 `npm run registry:release-check`가 통과했습니다.
  98개 item·96개 component와 17개 불변 snapshot을 검사했습니다.
  새 snapshot은
  `sha256-5038d4cd248ea483b2cb492095fbdbea06038c0ec48a17618be610eae83c1b01`입니다.
- 별도 Vite 소비자에 `shadcn@4.21.0`으로 로컬 registry의
  ScatterChart·tokens·전이 utils를 설치했습니다. 세 파일이 저장소
  원본과 일치하고 typecheck·build가 통과했습니다. 390px Chromium에서
  `ArrowDown`과 plot 점 클릭이 controlled 선택·정확한 값에 반영됐고
  문서 가로 overflow나 page error는 없었습니다. fixture는
  `C:\Users\pydemia\AppData\Local\Temp\pydemia-scatter-consumer-20260930`입니다.

공개 사이트·공개 snapshot은 배포 전이라 미검증입니다. 실제 screen
reader·touch·Safari·RTL도 미검증입니다.

기존 미공개 draft snapshot 네 디렉터리는 stage하지 않습니다.
