# Combobox·DonutChart 확장

2026-09-29. 기존 `Select`는 검색 없는 단일 선택이며 `DataChart`는
시계열 값의 선형·막대·영역 표현에 맞춰져 있습니다. 실제 화면에서
검색해 항목을 고르는 폼과 범주별 구성비는 별도 상태·표시 규칙이
필요하므로 `Combobox`와 `DonutChart`를 독립 component로 편입했습니다.

## 구현과 동작 규칙

`Combobox`는 label·value·disabled가 있는 option을 검색합니다.
controlled `value`와 uncontrolled `defaultValue` 모두 `null`을
미선택으로 사용합니다. 입력 중 검색어와 선택값은 분리되며 검색어를
바꾸면 선택값이 해제됩니다. `name`은 hidden input에 선택값만
전달합니다. `required`일 때 단순히 글자를 입력한 상태는 유효한
선택으로 취급하지 않습니다. 중복·빈 option value나 목록에 없는
선택값은 `RangeError`로 알립니다. 폼 reset은 uncontrolled 값만
`defaultValue`로 복원하고 controlled 값은 호출자가 관리합니다.

팝업은 `role=combobox` 입력과 `role=listbox` option으로 연결하고
활성 항목은 `aria-activedescendant`로 가리킵니다. 방향키는 disabled
항목을 건너뛰며 Enter는 활성 항목을 선택합니다. Escape와 외부
pointerdown은 팝업을 닫습니다. 기존 `Input`과 공통 color·spacing·
shadow token을 사용합니다.

`DonutChart`는 음수가 없는 범주별 값으로 원형 차트를 그립니다.
총합이 0이면 빈 상태를 표시하고 음수·무한대·NaN과 빈 label은
`RangeError`로 구분합니다. SVG는 장식용이며 총합·각 범주의 값과
반올림한 비율을 화면의 목록으로 제공합니다. 양수지만 0.1% 미만인
조각은 `<0.1%`로 표기하고 0건은 `0%`로 표기합니다. 색은 공통
`accent`, `foreground`, `surface` token을 섞어 colormap과 dark
mode를 따릅니다. 긴 label은 title 속성에서도 전체 문구를 확인할
수 있습니다.

## 출처와 의존성

두 구현 모두 이 저장소에서 직접 작성했습니다. Combobox의 역할과
키보드 동작은 [WAI-ARIA Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)을,
차트의 표현은 [shadcn/ui Pie Chart](https://ui.shadcn.com/charts/pie)를
참고했습니다. upstream 소스는 복사·수정하지 않았으므로 동일
revision의 소스·LICENSE 편입 대상은 없습니다. 신규 npm package와
전이 dependency는 없습니다. registry 의존성은 Combobox가
`pyd-input`·`pyd-utils`, DonutChart가 `pyd-utils`입니다.

## 검증

- `npm run typecheck`, `npm run build`, `npm run registry:check` 통과.
  기본 게시 URL로 56개 registry JSON을 생성했습니다.
- 문서 preview에서 Combobox의 미선택 필수 오류, 방향키·Enter와
  pointer 선택, disabled 항목 무시, 검색 결과 없음, Escape·외부
  클릭 닫기, 선택값만의 form 제출을 확인했습니다.
- 390px viewport에서 popup은 x=49–326px로 viewport 안에 있고
  문서의 가로 overflow는 관찰되지 않았습니다. 밝은 모드와 어두운
  모드의 preview를 확인했습니다.
- DonutChart는 42·23·15·0건의 총합 80건, 각 항목의 값·비율과
  빈 데이터 상태를 브라우저에서 확인했습니다. 23/80은 28.8%로
  반올림됩니다. 밝은 모드와 어두운 모드에서 차트와 범례를 확인했습니다.
- 로컬 URL의 두 registry item을 기존의 별도 Vite fixture에
  `shadcn add`로 설치하고 실제 import·render를 추가했습니다.
  fixture의 typecheck와 production build가 통과했습니다. 이 fixture는
  앞 작업의 Vite manifest와 설치한 component를 재사용합니다.
- 빌드된 package를 server render해 중복 option, 목록 밖 value,
  음수·무한대 수치, 빈 범주 label이 각각 `RangeError`인지 확인했습니다.

## 남은 확인

- 실제 screen reader의 활성 option·선택·빈 결과 발표는 확인하지
  않았습니다. touch pointer 조작과 form reset의 브라우저 실행도
  확인하지 않았습니다.
- Combobox 팝업은 입력 아래에 배치합니다. viewport 하단에서 위로
  전환하거나 조상 요소의 `overflow: hidden`을 벗어나는 동작은 아직
  지원·검증하지 않았습니다. 긴 옵션 목록의 가상화도 범위 밖입니다.
- DonutChart의 6개 초과 범주에서는 색이 반복됩니다. 범주 이름과
  수치는 목록으로 계속 구분되지만 다중 범주 chart의 표현 정책은
  후속 검토가 필요합니다. 실제 screen reader 탐색은 미검증입니다.
- 전체 56개 registry item을 빈 소비자에 일괄 설치하거나 공개
  사이트에 배포하는 검사는 수행하지 않았습니다.
