# Node + edge UI 기획·설계

## 제품 구조

`/`는 기본 UI 컴포넌트와 디자인 토큰의 카탈로그다. 전역 탐색의 **Flows**는
`/flows/`로 이동하며 분기형 작업 흐름을 위한 독립 화면을 연다. 전용 화면은
노드 목록, 직접 편집하는 캔버스, 선택한 노드·연결의 상세와 연결 목록을
보여 준다. 노드 목록과 연결 목록은 캔버스의 시각적 그래프를 텍스트로도
탐색하게 한다. 폭이 좁아지면 목록 → 캔버스 → 상세 순서로 배치한다.

데모는 브라우저 메모리에서만 편집한다. 노드 추가·이름·설명·위치·유형·상태
변경, 포트 연결, 연결 레이블·제어점 변경, 노드·연결 삭제와 초기화를 지원한다.
실행 취소·다시 실행, 복사·잘라내기·붙여넣기, 정렬 안내선과 스냅,
그룹화·그룹 해제, 자동 배치를 직접 조작할 수 있다. 같은 방향의 중복
연결과 자기 연결은 막는다. 실행, 서버 저장과 제품별 그래프 유효성 검사는
소비자 애플리케이션의 책임이다.

## 컴포넌트 계약

| 항목 | 역할 |
| --- | --- |
| `FlowCanvas` | 제어형 `nodes`·`edges`와 변경 callback, 팬·줌·맞춤·미니맵, 사용자 정의 node/edge types |
| `FlowNodeCard` | `trigger`·`action`·`condition`·`result` 유형, `idle`·`running`·`complete`·`error` 상태, 입출력 포트 |
| `FlowGroupCard` | 부모·자식 관계를 표시하는 그룹 경계 |
| `FlowEdgePath` | 선택 상태·레이블과 선택적 제어점이 있는 연결선 |
| `useFlowHistory` | 내용 변경만 50단계까지 기록하며 연속 드래그·입력을 하나의 단위로 묶음 |
| `copyFlowSelection`·`cutFlowSelection`·`pasteFlowSelection` | 선택 집합의 내부 연결 보존, 새 ID 생성, 반복 위치 이동 |
| `alignFlowNode` | 확대 배율을 반영한 안내선과 스냅 좌표 계산 |
| `groupFlowSelection`·`ungroupFlowSelection` | 부모·자식 관계와 화면 좌표 보존 |
| `layoutFlowGraph` | 분기·순환·빈 그래프에 결정적인 좌우 배치 |
| `NodeCanvas` | 기존 의존성 없는 작은 흐름 편집기. 별도 API 유지 |

React Flow 12를 그래프 상호작용 엔진으로 사용한다. 노드·엣지 UI는 저장소의
토큰으로 작성한 원본 코드다. `FlowCanvas`는 `@xyflow/react` 타입 기반
`FlowNode`·`FlowEdge`를 받는다. 그래프 상태, 저장, 실행은 호출자가 소유한다.
패키지 소비자는 `@pydemia/ui/styles.css`, `@xyflow/react/dist/style.css`,
`@pydemia/ui/flow-canvas.css`를 불러온다. registry 소비자는 설치한
`flow-canvas.css`와 토큰 CSS를 불러온다.

## 출처 선택

- [React Flow](https://reactflow.dev/index)는 MIT 라이선스의 React
  노드 편집 라이브러리이며 [custom nodes](https://reactflow.dev/learn/customization/custom-nodes),
  [handles](https://reactflow.dev/learn/customization/handles), 컨트롤과 미니맵을
  제공한다. npm 의존성으로 사용하고 소스는 복사하지 않았다.
- [shadcn.io Canvas](https://www.shadcn.io/ui/canvas)는 무료 계정으로
  설치하는 별도 엔진이다. 노드·엣지·연결·툴바 조합과 키보드 조작을
  검토했다. 엣지 선택·레이블, 미니맵 등 필요한 기능이 달라 편입하지 않았다.
- [shadcn.io AI Canvas](https://www.shadcn.io/ai/canvas)는 React Flow 기반
  래퍼다. 캔버스 범위 참고에 사용했고 코드는 복사하지 않았다.
- [shadcn/studio Workflow Builder](https://shadcnstudio.com/blocks/dashboard-and-application/workflow-builder)의
  확인된 01·02 블록은 Pro다. [무료 라이선스](https://shadcnstudio.com/license)도
  컴포넌트 재배포와 경쟁 제품에 제한을 둔다. 본 라이브러리에 코드를
  편입하지 않았다.
- [shadcn/studio 무료 블록](https://shadcnstudio.com/blocks/free)과
  [Dashboard Shell 1](https://shadcnstudio.com/blocks/dashboard-and-application/dashboard-shell)은
  사이드바·헤더·콘텐츠 영역을 갖춘 무료 화면 구조로 검토했다. 노드·엣지
  편집 기능은 제공하지 않아 기존 pydemia GNB와 토큰을 유지하고 전용 화면의
  목록·캔버스·상세 구조만 자체 설계했다.

## 접근성과 검증 경계

캔버스의 시각적 선만으로 관계를 전달하지 않고 연결 목록을 둔다. 포트
드래그를 사용할 수 없는 경우 상세의 시작·도착 선택과 연결 버튼을 사용한다.
컨트롤·입력·연결 목록은 접근 가능한 이름과 focus 표시를 갖는다.
React Flow의 기본 키보드 동작 외 실제 스크린리더, touch, Safari는
별도 검증이 필요하다. 모바일에서는 노드가 읽히는 초기 배율을 사용하고
미니맵을 숨겨 캔버스 공간을 확보한다.

데모에서는 Shift와 노드 목록 클릭으로 복수 선택을 만들 수 있다. 위치와
엣지 제어점은 상세 패널의 숫자 입력으로 바꾸므로 포인터 드래그의 대체
경로가 있다. 선택된 엣지 제어점은 방향키로 1단위, Shift+방향키로 10단위
조정할 수 있다. 단축키는 편집기 영역 안에서만 처리하고 텍스트 입력의
기본 동작은 보존한다. 데이터는 브라우저 메모리에만 남는다.

## Pro급 기능 확장 검토 (2026-10-27)

[React Flow Pro](https://reactflow.dev/pro)는 별도 런타임 패키지보다
고급 예제·템플릿과 지원을 제공한다. [Pro 예제 목록](https://reactflow.dev/examples/pro-examples)의
각 예제는 `@xyflow/react`와 추가 라이브러리를 조합하며, 예제 소스에는
[xyflow Pro License](https://xyflow.com/pro-license)가 적용된다. 이 라이선스는
애플리케이션에 통합하는 것은 허용하지만 Pro 콘텐츠를 독립 예제나 템플릿으로
재배포하는 것을 금지한다. `ui.pydemia.ai`는 설치형 컴포넌트를 공개하므로
Pro 예제 소스나 그 변형을 레지스트리에 편입하지 않는다. 아래 기능은 공개
API와 자체 설계·코드로 구현했으며 Pro 소스 접근이 필요하지 않았다.

| 우선순위 | 기능 | 현재 범위 |
| --- | --- | --- |
| 1 | 실행 취소·다시 실행, 노드·엣지 복사·붙여넣기 | 구현. 그래프 훅·ID 재생성·연결 무결성·범위가 지정된 단축키 |
| 1 | 정렬 가이드·스냅 | 구현. 이동 중 안내선과 배율별 좌표 보정 |
| 2 | 선택 그룹, 자동 레이아웃 | 구현. 부모 관계와 결정적인 분기·순환 배치 |
| 2 | 편집 가능한 엣지·경로 변경 | 구현. 제어점 포인터·방향키·숫자 입력 |
| 3 | 실시간 공동 편집 | 후속 과제. 충돌 해결, 권한, 서버 동기화 계약 선행 |

기능 명칭과 사용 흐름은 Pro 소개 페이지의 공개 설명을 참고했다.
Pro 예제 소스·다운로드·템플릿을 복사하거나 변형하지 않고, 각각의 기능을
저장소의 기존 그래프 계약에 맞춰 작성했다. Pro 소스를 사용해야 한다면
공개 컴포넌트 재배포가 허용되는지 xyflow의 서면 확인이 필요하다.
