# Colormap preview 확장

2026-09-29. 문서 사이트에 별도 Colormap 영역을 두고 preset과 hex 직접
조정으로 전체 UI의 색을 비교할 수 있게 했습니다.

- 공통 stylesheet의 semantic color token을 `--palette-*` alias로
  연결했습니다. 기존 light/dark 기본값은 Neutral preset으로 유지합니다.
- 로고의 `#103344` 네이비와 `#ba365b` 로즈를 사용하는 Pydemia
  preset을 포함해 Ocean, Forest, Violet의 light/dark palette를
  추가했습니다.
- 문서에서 12개 color token을 6자리 hex 또는 색상 선택기로 조정합니다.
  직접 조정값은 light/dark별로 따로 보관하고 preset 변경이나 초기화 시
  제거합니다. 잘못된 hex는 적용하지 않습니다.
- 문서 UI뿐 아니라 iframe 조합 예시에도 palette와 조정값을 전달합니다.
  전체 화면 링크는 선택값을 URL query에 담습니다. 조합 예시는 같은
  origin의 부모 메시지만 받고 palette 이름과 hex 형식을 검사합니다.
- 본문, Accent, User message의 텍스트 대비를 표시하고 4.5:1 미만은
  안내합니다. 사용자 조정값은 저장하지 않으며 색상 자동 보정도 없습니다.

## 확인한 항목

- `npm run typecheck`, `npm run build`, `npm run registry:check` 통과.
  문서 build의 기존 500 kB JS chunk 경고는 남아 있습니다.
- 기본값과 Pydemia·Ocean·Forest·Violet의 본문/Accent/User message
  대비를 CSS의 hex 값으로 계산했습니다. 10개 light/dark 조합의 세 비율은 모두
  4.5:1 이상입니다.
- 브라우저에서 Ocean preset의 root `--accent`, 실제 Button 배경,
  iframe의 `--accent` 변경을 확인했습니다.
- Pydemia preset의 light accent `#ba365b`와 dark accent `#f19ab1`이
  문서 및 iframe에 적용되는 것을 확인했습니다.
- 유효한 직접 입력, 잘못된 hex 차단, light/dark별 독립 조정,
  preset 전환 시 초기화, 전체 화면 URL의 양쪽 모드 조정값을 확인했습니다.
- 낮은 Accent 텍스트 대비의 경고와 Violet dark 화면을 확인했습니다.

## 남은 검증

- 좁은 viewport의 실제 배치는 확인하지 않았습니다. native color
  picker 팝업은 열기만 확인하고 색상 선택은 실행하지 않았습니다.
  반응형 CSS는 빌드에 포함됐습니다.
- 실제 screen reader 발표와 모든 임의 색상 조합의 접근성은 확인하지
  않았습니다. 직접 입력의 대비 표시 범위는 위 세 텍스트 조합입니다.
- commit `bd50665`을 `origin/main`에 push했습니다. Vercel production
  배포 `dpl_YitkbHrwv33XJ5yi1JTFgg1mJrR8`이 `READY`이고
  `ui.pydemia.ai` alias가 연결됐습니다.
- 공개 사이트에서 Pydemia preset의 `#ba365b` 적용, 직접 입력한
  `#8844cc`의 문서·iframe 동기화, 전체 화면 링크의 색상 재현을
  확인했습니다.
