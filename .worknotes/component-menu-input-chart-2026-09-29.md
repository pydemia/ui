# 작업 메뉴·비밀번호 입력·영역형 차트

2026-09-29 로컬 작업 트리. 관리 목록의 행 작업 메뉴, 계정 입력,
대시보드의 추세 표현을 함께 확장했습니다. `DropdownMenu`와
`PasswordInput`을 추가하고 기존 `DataChart`에 `area` variant를
추가했습니다. 현재 52개 component, 54개 registry item입니다.

## 설계와 출처

- `DropdownMenu`는 shadcn/ui에서 사용하는 Radix Dropdown Menu
  primitive의 Root·Trigger·Content, 일반·체크·라디오 항목과 submenu를
  공통 token으로 감쌉니다. 명령 실행과 checked 값은 사용처가 맡습니다.
  `danger`는 글자 색상만 바꾸고 실제 삭제 확인은 사용처가 결정합니다.
  좁은 viewport에서 submenu가 화면 밖으로 나가는 것을 확인한 뒤
  최소 폭을 160px로 줄였습니다. RTL에서는 submenu 화살표를 반전합니다.
- `PasswordInput`은 기존 Input·Button을 조합합니다. 실제 값과 form
  전송은 native input이 담당하며 표시는 내부 boolean state로만
  바뀝니다. toggle button은 이름을 고정하고 `aria-pressed`로 상태를
  알립니다. `visibilityLabel`로 언어를 바꿀 수 있습니다. disabled는
  입력과 버튼에 함께 적용합니다.
- `DataChart`의 `area`는 0을 기준선으로 사용합니다. `null` 앞뒤는
  별도 path로 만들어 결측 구간을 채우지 않습니다. 시각 SVG와 별도로
  기존 hidden table에 각 값·단위·결측 문구를 유지합니다.

세 구현의 source는 `pydemia/ui` 원본입니다. 메뉴 동작은
[Radix Dropdown Menu 공식 문서](https://www.radix-ui.com/primitives/docs/components/dropdown-menu),
비밀번호 표시 버튼의 의미는
[WAI Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)을
확인했습니다. 설치한 `@radix-ui/react-dropdown-menu@2.1.22`의
`dist/index.mjs`, package manifest, 같은 npm release의 MIT LICENSE를
직접 확인했습니다. 공식 웹 문서의 표시 버전은 2.1.21입니다.
lockfile에서 메뉴의 전이 dependency closure 47개를 추적했고 license
metadata는 MIT 46개, 0BSD 1개입니다. 설치된 패키지 중
`react-remove-scroll-bar@2.3.8`은 LICENSE 파일이 없으며 manifest와
[upstream 저장소](https://github.com/theKashey/react-remove-scroll-bar)는
MIT로 표기합니다. 이 패키지의 동일 revision LICENSE 파일은 따로
확인하지 못했습니다. 기존 `lucide-react@0.468.0`은 ISC LICENSE를
확인했습니다. reference와 구현 출처는 provenance에 구분했습니다.

## 실행한 검사

- `npm run typecheck`, `npm run build`, `npm run registry:check` 통과.
  기본 게시 URL로 54개 registry JSON을 생성했습니다.
- 문서 브라우저에서 메뉴의 Enter 열기, 방향키 이동, 체크·라디오
  항목 변경, submenu 열기·CSV 선택, disabled 항목, Escape 닫기와
  trigger로 focus 복귀를 확인했습니다. 390px viewport에서 submenu는
  좌표 208–368px에 표시됐고 viewport 폭은 390px입니다.
- 비밀번호 입력의 native `password` 타입, Space로 표시 전환,
  `aria-pressed`, 값 길이 유지, 입력·버튼의 disabled를 확인했습니다.
- 영역형 차트는 결측값 양쪽에 별도 면적 path 2개, hidden table의
  결측 문구, 빈 데이터 상태를 확인했습니다. 밝은 모드와 어두운 모드의
  표시를 시각 확인했습니다.
- 기존 Vite fixture에 새 두 item을 설치하고 `DataChart`를 갱신했습니다.
  typecheck와 production build가 통과했습니다. 별도 Vite 폴더에서는
  비어 있는 component tree에 token·이번 두 item·DataChart를
  `shadcn add`했고 typecheck와 build가 통과했습니다. 이 폴더는
  기존 fixture의 Vite 설정과 dependency manifest를 복사했습니다.
- submenu 폭을 `min-w-40`으로 조정한 최종 menu JSON을 새 Vite
  fixture에 다시 설치했습니다. 갱신 후 typecheck와 build가 통과했습니다.
  저장소 전체 검사도 최종 수정본으로 다시 통과했고 registry URL은
  기본 게시 주소로 생성했습니다.

## 남은 확인

- 실제 screen reader의 메뉴 role·상태 발표와 비밀번호 toggle 발표는
  확인하지 않았습니다. 메뉴의 typeahead와 RTL 전체 상호작용도
  브라우저에서 실행하지 않았습니다.
- 여러 series와 범례, 누적 영역형 차트, 전체 registry item의 새 소비자
  설치, 공개 사이트 배포는 이번 검사 범위가 아닙니다.
