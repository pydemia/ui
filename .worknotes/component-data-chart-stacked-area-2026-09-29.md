# DataChart 누적 영역 작업

2026-09-29. 기존 `DataChart`에 `stacked-area` variant를 추가했습니다.
컴포넌트·registry item 총수는 80개·82개로 같습니다.

## 구현 결정

- 비음수인 유한값만 더합니다. 음수와 합계 overflow는 거부합니다.
- 계열 중 하나라도 `null`인 범주의 전체 합계는 알 수 없는 값입니다.
  모든 영역 경로를 해당 범주에서 끊고 표·선택기 합계에
  `데이터 없음`을 표시합니다. 다른 계열의 원본 값은 유지합니다.
- 인접한 완전한 범주끼리만 영역을 그립니다. 고립된 완전한 범주는
  점으로 표시하고 polygon은 만들지 않습니다.
- 범례, 공통 색상 token, 숨긴 원본 데이터 표, `inspectable`의
  native 선택기를 기존 구조에서 재사용합니다.
- 문서 preview에 누적 영역 선택과 사용 코드를 추가했습니다.

직접 작성한 SVG 구현이며 새 package나 외부 component source를
편입하지 않았습니다. Vega의 공식 누적 영역 예시와 Vega-Lite의
invalid data 문서는 데이터 의미를 검토하는 reference입니다.
새 upstream revision·LICENSE는 없고 registry의 직접 의존성은
기존 `pyd-utils`뿐입니다. `registry/provenance.json`에는 합계와
결측값에 관한 접근성 설명을 보강했습니다.

## 검증

- `npm test -w @pydemia/ui`: 12개 검사 통과. 누적 영역의 완전한
  범주, 분리된 path, 결측값, 음수·overflow 거부를 포함합니다.
- `npm run typecheck`, `npm run build`, `npm run registry:check` 통과.
  기본 공개 URL 설정으로 82개 registry item을 생성했습니다.
- 로컬 문서 Chromium: 누적 영역 전환, 두 계열의 분리된 영역 4개,
  목요일 결측 경계, 구간 선택기·데이터 표의 합계와 빈 상태를
  확인했습니다. 밝은·어두운 모드에서 token 색을 확인했습니다.
- 별도 Vite 소비자에 로컬 `shadcn add`로 `pyd-data-chart`와
  `pyd-tokens`를 설치했습니다. chart·utils·tokens 3개 파일이
  생성됐고 chart source SHA256이 원본과 일치합니다.
- 소비자 typecheck·build와 `npm audit --audit-level=high`가
  통과했습니다. Chromium에서 월 3, 화 5, 목 10의 합계와
  수요일의 결측 합계, 월–화 영역만 연결되는 경로를 확인했습니다.
  console error는 0건입니다.

소비자 fixture 경로:
`C:\Users\pydemia\AppData\Local\Temp\pydemia-ui-stacked-area-consumer-20260929`.

실제 screen reader 발표, touch 조작, RTL, 다른 브라우저, 매우 큰
데이터와 전체 82개 item의 새 동시 설치는 확인하지 않았습니다.
공개 사이트에 이 변경을 게시하지 않았습니다.
