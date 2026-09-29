# Heatmap

## 선정과 구현

기존 `DataChart`는 한 축의 추세·계열을 표시합니다. 요일과 시간대처럼
두 범주가 만나는 지점의 밀도를 확인하는 분석 화면에는 행렬이 필요해
`Heatmap`을 별도 component로 작성했습니다. Kibo Contribution Graph의
시간별 강도와 내부 스크롤을 참고했지만 소스는 복사하지 않았습니다.
공식 docs, revision `3d63cdb`의 소스·manifest·MIT LICENSE와 W3C 표
접근성 지침을 확인했습니다. 세부 URL과 의존성은
`research/source-inventory.md`에 있습니다.

숫자와 단위는 모든 셀에 표시합니다. 색은 `--accent`와
`--surface-subtle`을 섞으므로 사이트 colormap에 따라 바뀝니다.
0·결측값·빈 목록은 서로 다른 상태입니다. 표는 native 행/열 헤더를
사용하며 좁은 폭에서 표 영역만 가로로 스크롤합니다. 별도 npm runtime
의존성은 없습니다.

## 검증 상태

- `npm run typecheck` 통과.
- `npm test -w @pydemia/ui` 79/79 통과. 표 헤더, 0·결측값·빈 목록,
  잘못된 행렬·범위와 극단값을 확인했습니다.
- 로컬 Chromium에서 표 헤더·0·결측값, compact/comfortable 전환,
  빈 데이터 상태를 확인했습니다. 390px에서 문서 가로 overflow 없이 표
  영역만 스크롤됐습니다. 키보드 `ArrowRight`로 내부 스크롤이 이동하고
  행 이름이 고정되는 것을 확인했습니다. Pydemia colormap을 선택했을 때
  셀 색이 바뀌었고 light/dark 화면을 확인했습니다.
- [390px light](heatmap-mobile-grid-light.png)와
  [390px dark](heatmap-mobile-grid-dark.png) 화면을 남겼습니다.
- `npm run build`와 `npm run registry:release-check`가 통과했습니다.
  96개 item·94개 component와 15개 불변 snapshot을 검사했습니다.
  새 snapshot은
  `sha256-34e05c67026d4eafde4bba89993145eef2718414d4312c4ff87c7b33a4cc6481`입니다.
- 별도 Vite 소비자에 `shadcn@4.21.0`으로 Heatmap·tokens·전이 utils를
  설치했습니다. 세 파일의 내용이 registry JSON과 일치하고 typecheck·
  build가 통과했습니다. 390px Chromium에서 숫자 0·결측값·표 헤더와
  문서 가로 overflow가 없음을 확인했습니다.
- PR CI·공개 배포와 공개 snapshot URL 소비자 설치는 미검증입니다.
- 실제 screen reader·touch·Safari·RTL은 미검증입니다.

기존 미공개 draft snapshot 네 디렉터리는 stage하지 않습니다.
