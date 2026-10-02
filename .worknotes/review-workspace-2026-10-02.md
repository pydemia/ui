# Review workspace 조합 예시

2026-10-02. 공개 기준 125개 component·127개 registry item·48개
snapshot에서 시작했습니다. 검토 화면의 검색·상태 필터·요청 선택,
변경 비교·대댓글·승인 결정을 `@pydemia/ui` component로 연결했습니다.
서버 저장과 권한 검사는 예시 범위 밖이며, 입력 결과는 새로 고치면
초기화됩니다. 새 component·registry item·npm 의존성은 없습니다.

`MasterDetail`의 상세가 바뀔 때 `Thread`와 `ApprovalCard`에 같은
형제 `key`를 준 초안은 이전 요청의 댓글을 중복 렌더링했습니다.
요청별 상세 wrapper에 하나의 key를 주어 교체했고, 새 브라우저 탭에서
요청 전환 뒤 의견 영역이 하나이며 React key 경고가 없음을 확인했습니다.

로컬 `npm run typecheck`와 `npm run build`는 첫 초안에서 통과했습니다.
수정판의 docs typecheck·전체 build·`registry:check`도 통과했습니다.
Chromium에서 요청 전환,
대댓글 등록, 승인 뒤 목록 상태 갱신, 상태 필터, 검색 빈 결과를
확인했습니다. 좁은 화면에서 목록→상세 이동과 페이지 가로 overflow
없음을 확인했습니다. 수정판의 새 브라우저 탭에서는 console error·
React key 경고가 없었습니다. 실제 keyboard-only 탐색, screen reader, touch,
Safari, RTL 및 별도 registry 소비자 설치는 실행하지 않았습니다.
기존 설치 형식과 의존 경로를 그대로 사용합니다.

공개 CI·배포·URL은 아직 확인하지 않았습니다. 관리용 goal 진척도는
약 97%로 유지합니다. 이 화면은 복합 조합 가능성의 표본이며 모든
중급 이상 화면을 구현할 수 있다는 증거는 아닙니다.
