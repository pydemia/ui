# Pyd Monotone 아이콘 시스템 기획안

상태: 1차 39종 구현 · 2026-11-07. 대상은 `@pydemia/ui`의 기능성 UI 아이콘이다. 제품 로고·favicon·브랜드 심벌·파일 형식별 컬러 아이콘은 이 세트의 대상이 아니다. 공개 registry 항목은 `pyd-monotone-icons`이다.

## 1. 목표와 현재 맥락

- 작은 컨트롤에서 즉시 알아볼 수 있는 한 색의 아이콘을 제공한다. 아이콘만 있는 조작에도 명확한 이름을 붙이고, 명령·상태·탐색의 뜻을 일관되게 유지한다.
- 현재 `packages/ui`는 여러 컨트롤에서 `lucide-react`를 직접 사용한다. `IconButton`은 이미 접근 가능한 `label`을 요구하고, `Sidebar`는 `ReactNode` 아이콘을 받는다. 따라서 첫 버전은 이 계약을 바꾸지 않고 아이콘 공급원과 사용 규칙을 추가한다.
- 트리와 트리 탐색의 펼침 화살표는 현재 **20px / stroke 2.25**이다. 축소판으로 일괄 교체하지 않고 실제 크기에서 가독성을 비교한다.
- Basic부터 Spatial까지 21종 디자인 모드와 light/dark 및 지역 ThemeScope에서 같은 의미와 실루엣을 유지한다. PRISM 고유 시각 체계는 별도 유지한다.

## 2. 참고 세트와 가져올 원칙

| 참고 | 확인한 특징 | 이 설계에 반영할 점 | 경계 |
| --- | --- | --- | --- |
| [VS Code Codicon](https://code.visualstudio.com/api/references/icons-in-labels), [원본 저장소](https://github.com/microsoft/vscode-codicons) | VS Code의 제품 아이콘은 파일 아이콘과 구분되며, ID를 UI 기능에 매핑한다. 작은 chrome에 맞는 아이콘이 많다. 원본은 SVG를 아이콘 폰트로 빌드한다. | **아이콘 ID와 사용 위치를 분리**하고 검색·트리·패널·실행 같은 밀도 높은 UI의 용어를 검토한다. | 폰트·글리프를 그대로 섞지 않는다. 저장소의 문서는 CC BY 4.0, 코드는 MIT로 안내되므로 자산 재사용 전 해당 파일의 조건을 별도로 확인한다. 브랜드 표지는 대상에서 제외한다. |
| [Primer Octicons 설계 규칙](https://primer.style/octicons/design-guidelines/), [사용 규칙](https://primer.style/octicons/usage-guidelines/) | 16·24px에 각각 도안을 만들고, 12px은 특정 필요가 있을 때만 만든다. 시각적 부피·픽셀 정렬과 상태의 쓰임을 규정한다. [MIT](https://github.com/primer/octicons/blob/main/LICENSE). | 16px과 24px을 각각 검수하고, 같은 이름이어도 작은 도안에서 세부를 줄인다. 상태 아이콘은 상태별 실루엣을 구분한다. | Octicon path를 복사해 새 자체 아이콘으로 표시하지 않는다. |
| [Lucide 명세](https://lucide.dev/contribute/icons/specification), [React 사용법](https://lucide.dev/guide/react) | 24×24, 2px 중심 선, 둥근 끝·이음, 안전 여백과 2px 내부 간격. React에서 개별 SVG를 가져올 수 있다. [ISC](https://lucide.dev/license). | 기존 의존성을 전환 기간의 공급원으로 유지하고, 새 24px 도안의 밀도·stroke 기준으로 사용한다. | Lucide와 자체 도안을 같은 화면에 둘 때는 광학적 무게를 비교한다. |
| [Tabler Icons 설계 가이드](https://docs.tabler.io/icons/design-guide), [라이선스](https://tabler.io/license) | 24×24 / 2px, keyline·padding·간격과 `currentColor` SVG 내보내기를 명시한다. MIT. | SVG 원본의 품질 검사와 이름 규칙에 참고한다. | 큰 카탈로그 전체를 추가 의존성으로 도입할 필요는 없다. |

이 표는 설계 근거다. 첫 자체 도안은 독립적으로 제작한다. 외부 SVG를 실제로 편입할 때는 출처·버전·라이선스 고지와 변형 이력을 아이콘별 메타데이터에 기록한다.

## 3. 제안하는 시각 문법

| 항목 | 규칙 |
| --- | --- |
| 표현 | 기본은 **outline + 단색**. SVG `currentColor`를 사용하고 내부에 브랜드색·그라데이션·그림자·타일을 넣지 않는다. 색은 부모의 의미 토큰에서 받는다. |
| 크기 | **16px**은 입력·메뉴·표·툴바의 기본, **24px**은 큰 탐색·빈 상태·설명형 화면. 두 크기는 별도 도안으로 만든다. **20px 강조형**은 기존 트리 disclosure처럼 필요한 아이콘부터 별도 검토한다. 12px은 사용처가 확인되기 전까지 만들지 않는다. |
| 선 | 24px 도안의 기준 선은 2px, 16px 도안은 시작 기준 1.5px. 중심 선·둥근 끝·둥근 이음을 기본으로 하되, 화살촉·체크·작은 내부 형태는 실제 픽셀에서 또렷하도록 예외를 기록한다. 20px 트리 강조형은 현재 2.25px과 대조한다. |
| 여백과 무게 | 바깥 stroke가 캔버스 끝에 닿지 않도록 한다. 24px의 분리된 요소 사이에는 기본 2px 이상을 확보한다. 16px에서는 형태를 줄여 겹침을 막고, `circle`, `square`, `folder`, `search`를 무게 기준 도안으로 둔다. 기하학적 중앙보다 화면에서 보이는 중앙을 우선한다. |
| 변형 | `outline`을 기본으로 한다. 채움형은 `circle-check`, `circle-x` 등 작은 크기에서 상태를 구분하는 데 실제 이점이 확인된 경우에만 허용한다. 선택된 탐색 항목을 자동으로 채움형 아이콘으로 바꾸지 않는다. |
| 방향 | 좌·우 이동/펼침은 의미에 따라 RTL에서 뒤집고, 재생·새로고침·외부 링크·브랜드 문양처럼 방향 자체가 의미인 도안은 자동으로 뒤집지 않는다. 각 ID의 미러링 여부를 메타데이터로 둔다. |
| 움직임 | `loader`만 회전 가능하다. `prefers-reduced-motion`에서는 정지 도안과 텍스트 상태를 제공한다. 성공·오류의 인지는 애니메이션에 의존하지 않는다. |

**모노톤**은 한 아이콘에 한 잉크를 쓴다는 뜻이다. 오류·경고·성공은 각 컨텍스트의 의미 토큰으로 색을 달리할 수 있지만, 모양과 텍스트도 함께 상태를 구분한다. 아이콘을 회색으로만 고정하지 않는다.

## 4. 의미 체계와 첫 카탈로그

SVG 파일·React export는 **보이는 대상/형태**로 명명한다: `chevron-right`, `arrow-right`, `circle-check`, `triangle-alert`, `x`, `trash`처럼 소문자와 하이픈을 사용한다. `delete`, `success`, `back`처럼 화면마다 달라지는 **행동/상태 이름은 사용처 매핑**에 둔다. 코드 export는 `ChevronRightIcon`처럼 파스칼 케이스를 쓴다. 검색 키워드와 한글 설명을 별도로 제공한다.

| 구분해야 할 쌍 | 적용 규칙 |
| --- | --- |
| `x` / `trash` | `x`는 닫기·선택 해제, `trash`는 객체 삭제. 저장 데이터의 삭제 버튼에 `x`만 쓰지 않는다. |
| `chevron-right` / `arrow-right` | chevron은 계층 펼침·다음 단계의 구조, arrow는 이동·전송. |
| `check` / `circle-check` | check는 선택 표시·확정 동작, circle-check는 완료·성공 상태. |
| `refresh` / `loader` | refresh는 사용자가 다시 가져오기, loader는 진행 중임. loader에 클릭 기능을 부여하지 않는다. |
| `eye` / `eye-off` | 현재 보이는 상태와 누르면 할 행동을 각 컨트롤의 label에서 명시한다. 아이콘만으로 상태 설명을 맡기지 않는다. |
| `plus` / `file-plus` | 일반 추가는 plus, 새 문서 생성처럼 객체가 중요한 곳은 file-plus. |

### 1차 묶음: 반복 사용 중인 기본 명령과 상태

| 영역 | 후보 ID | 대표 사용처 |
| --- | --- | --- |
| 탐색·구조 | `chevron-left/right/up/down`, `arrow-left/right`, `menu`, `ellipsis`, `external-link`, `panel-left` | Tree·TreeNav·Breadcrumb·Sidebar·메뉴 |
| 조작 | `plus`, `minus`, `x`, `check`, `pencil`, `copy`, `trash`, `refresh`, `undo`, `redo`, `search`, `filter`, `upload` | Button·CopyButton·입력·NodeCanvas·검색 |
| 콘텐츠·가시성 | `file`, `file-text`, `folder`, `folder-open`, `calendar`, `eye`, `eye-off`, `star`, `bell` | 문서·일정·PasswordInput·FavoriteToggle·알림 |
| 상태 | `circle-check`, `triangle-alert`, `circle-x`, `info`, `help-circle`, `lock`, `loader` | Alert·Toast·ResultState·진행 상태 |

이 목록은 **후보 ID**다. 실제 1차 SVG 제작 전에 중복 명칭과 현재 사용 빈도를 대조해 확정한다. Tree/TreeNav의 `chevron-right/down`, Checkbox/Menu의 `check`, CopyButton의 `copy`, PasswordInput의 `eye/eye-off`, DatePicker의 `calendar`를 첫 검수 도안으로 삼는다.

### 2차 묶음: 업무 맥락이 확인된 뒤 확장

`download`, `save`, `settings`, `grid`, `list`, `comment`, `thumbs-up/down`, `calendar-range`, `focus`, `maximize`, `zoom-in/out`, `node`, `branch`, `terminal` 등이다. 비슷한 기호를 숫자만 붙여 늘리거나, 특정 화면의 짧은 요구로 일반 카탈로그를 채우지 않는다. 업무 전용 도안은 최소 두 사용처 또는 명확한 공용 기능이 확인되면 승격한다.

## 5. 사용·접근성 계약

- 아이콘만 있는 버튼에는 현재 `IconButton.label` 같은 **행동 이름**을 필수로 제공한다. 도안의 이름을 그대로 읽어 주지 않는다. 아이콘 SVG는 이 경우 발표에서 숨긴다. 텍스트 버튼에 동반되는 장식 아이콘도 중복 발표를 막는다.
- 상태는 아이콘 단독으로 전달하지 않는다. 오류 메시지·성공 제목·선택 상태와 함께 사용하고, 상태 변화는 컨트롤의 접근성 상태와 맞춘다.
- 유의미한 아이콘과 조작·상태를 알아보는 데 필요한 시각 단서는 배경과 **3:1** 이상을 목표로 한다. 이는 [WCAG 2.2 비텍스트 대비](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)의 요구에 따른다. 장식 아이콘까지 일률적으로 같은 수치를 강제하지 않는다.
- 아이콘 그림의 16px과 클릭 대상의 크기는 별개다. 아이콘 버튼의 클릭 대상은 가능하면 현재 control token에 맞춰 32px 이상으로 유지하고, 최소 24×24 CSS px 또는 허용되는 간격 조건을 확인한다. [WCAG 2.2 대상 크기](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)를 따른다.
- light/dark, 강제 색상, 고배율, 21종 디자인 모드에서 `currentColor`와 focus를 검수한다. 디자인 모드의 재질·모서리는 컨트롤에 적용하고 아이콘 뜻과 기본 실루엣은 바꾸지 않는다.

## 6. 공급·적용 계획

1. **사용처 대조표 확정**: 현재 `lucide-react`, 직접 작성한 SVG, 문자 기호를 컴포넌트별로 모으고 기능 이름·표시 크기·상태·RTL 여부를 기록한다. 특히 Sidebar의 `«»` 및 모바일 `☰`, Tree의 20px disclosure를 검토한다.
2. **핵심 도안 제작**: 1차 묶음 중 사용이 잦은 도안부터 16/24 SVG를 별도 그린다. 20px 강조형은 트리의 chevron을 먼저 만든다. 한 SVG를 CSS로 일괄 확대·축소한 결과를 각 크기의 합격 도안으로 취급하지 않는다.
3. **소스와 메타데이터**: `packages/ui/src/icons/`에 도안별 source와 `id`, 한글 설명, 키워드, 크기, RTL 미러링, provenance를 둔다. 개별 React export로 필요한 아이콘만 묶이게 한다. 정적 마크업 SVG 자산과 이름 기반 picker는 같은 ID를 사용하되, 이름 기반 전체 import는 필요 화면에만 허용한다.
4. **기존 계약과 연결**: `IconButton.icon`과 `Sidebar.icon`에 새 컴포넌트를 전달한다. 공용 컴포넌트 내부의 Lucide 사용은 시각·행동 parity를 확인한 후 점진적으로 바꾼다. registry 소비자에게는 필요한 아이콘 소스만 전달되도록 의존성 관계를 명시한다.
5. **문서화와 공개**: docs에 검색 가능한 카탈로그를 제공한다. 각 아이콘마다 16/24, light/dark, 이름·뜻·사용 예·금지 예·라이선스/출처를 보인다. 공개 registry와 독립 소비자 설치는 source hash·빌드·실제 렌더링으로 확인한다.

Codicon 전체를 설치해 기존 Lucide와 혼용하는 방식은 글리프의 기준 크기·표현 방식이 달라 첫 선택으로 두지 않는다. Lucide만 계속 쓰는 방식은 빠르지만 16px의 광학 보정과 기능별 의미 계약을 이 프로젝트가 소유하기 어렵다. 따라서 **기존 Lucide를 전환기 공급원으로 유지하면서 자체 규칙과 핵심 도안을 구축**하는 방식을 권장한다.

## 7. 수용 기준과 남은 결정

- 같은 명령에 같은 ID가 쓰이고, 닫기·삭제·이동·상태 등 혼동하기 쉬운 쌍을 실제 화면에서 구별할 수 있다.
- 16px·24px의 흑/백 양방향, Basic light/dark, 밀도 높은 Tree/Menu, 글라스·터미널·픽셀 모드에서 식별성과 무게가 유지된다. 20px 트리 대체안은 현행 2.25 stroke와 나란히 비교한다.
- 아이콘 전용 조작의 접근 가능한 이름, 키보드 focus, pointer target, 상태 텍스트, 고대비·저동작 환경이 유지된다.
- 빌드 출력은 필요한 아이콘만 포함하고, registry 소비자 설치에서 누락된 파일·중복 스타일·외부 폰트 요청이 없다.
- 외부 path를 실제로 가져오면 정확한 라이선스·저작권 고지와 provenance를 기록한다.

## 8. 1차 구현 기록 (2026-11-07)

- 위 1차 후보 39개를 `packages/ui/src/components/monotone-icons/`의 독립 SVG path로 구현했다. 16px·24px은 별도 도안이며 chevron 네 방향에 20px 강조형을 추가했다. `file-plus`는 2차 후보로 남는다.
- 공개 React export와 `pyd-monotone-icons` registry item을 만들었다. 문서 카탈로그에서 ID·한글 뜻을 검색하고 크기별 도안을 비교할 수 있다.
- `CopyButton`, `PasswordInput`, `Tree`, `TreeNav`, `Sidebar`의 내부 아이콘을 연결했다. 다른 컴포넌트의 기존 Lucide 사용은 후속 전환 범위다.
- 제작 path는 프로젝트 자체 도안이며 참고 세트의 코드·SVG path를 복사하지 않았다. 항목별 provenance는 `registry/provenance.json`에 있다.
- 초기 기획의 도안별 RTL 메타데이터·정적 SVG 파일 배포·아이콘별 금지 예 카탈로그는 아직 제공하지 않는다. 사용처의 방향 결정과 실제 사용자 식별성 검토도 후속 과제다.

**미결**: 공개 이름, 1차 SVG의 최종 목록, 채움형 상태 아이콘의 필요 여부, 20px 강조형의 확장 범위는 실제 도안 비교 후 결정한다. 이 문서는 기획안이며 SVG 제작·구현·사용성 검증 완료를 뜻하지 않는다.
