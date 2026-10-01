# MasterDetail 편입 기록

2026-10-02. 공개 기준 112개 component·114개 registry item·
31개 snapshot, goal 관리용 추정 약 87%입니다. 로컬에는
`MasterDetail`을 더해 113개 component·115개 item이 있습니다.
공개 검증 전까지 goal 추정은 유지합니다.

## 선정 근거와 구현

요청·파일·알림 목록에서 선택한 항목의 상세를 확인하는 화면은
`AppShell`의 단순 영역 배치와 `Board`의 게시글 선택을 넘어,
좁은 화면의 목록·상세 전환과 focus 복귀가 반복됩니다. handoff의
`MasterDetail` 후보를 이 독립 동작으로 편입했습니다.

외부 component 코드를 복사하지 않은 pydemia/ui 원본입니다.
React와 기존 `pyd-button`·`pyd-utils`만 사용합니다. 각 item의
고유 ID·제목을 검사하고 controlled 또는 내부 선택값을 구분합니다.
선택이 사라져도 다른 항목을 임의로 선택하지 않습니다. 42rem
container 기준으로 두 면 또는 단일 면을 표시하고 모바일 상세로
이동하거나 돌아갈 때 focus를 옮깁니다. 서버 요청과 상세 내용은
소비자가 관리합니다. [source 조사](../research/source-inventory.md)와
[동작 규칙](../research/design-contract.md)에 근거가 있습니다.

## 로컬 검증

- `npm run typecheck` 통과.
- UI 테스트 138/138, 신규 SSR 검사 3건 통과.
- `npm run build` 통과, registry item 115개 생성.
- 로컬 브라우저의 데스크톱 선택·상세 갱신·Enter 작업 실행 확인.
- 390px에서 목록→상세, 돌아간 뒤 선택 버튼 focus, Enter 선택,
  light/dark 표시 확인.

source commit `8cae788`의 provenance 고지 핀을 갱신하고
32번째 snapshot
`sha256-3418e56a4bb9ffff2d0a71b5f418d95b22ae36d91b5b27b709a0481d9a3f55e2`을
생성했습니다. 재빌드 뒤 `registry:release-check`가 115개 item·
113개 export/catalog와 현재 snapshot을 확인했습니다. 새 item의
`pyd-button`·`pyd-utils` URL은 이 snapshot으로 고정됩니다.
PR·공개 URL은 남았습니다. 실제 touch·screen reader·Safari·RTL과
개별 item CLI 설치는 미검증입니다.

## 공개 확인

PR #54를 `main`의 `4007bb2`에 병합했습니다. PR Verify UI run
36922068750과 병합 commit의 Verify UI run 36922369852가
성공했습니다. Pages run 36922368767과 Vercel 배포 상태도
성공했습니다. 공개 site의 `?component=master-detail#components`는
HTTP 200으로 응답하고 빌드한 asset을 제공합니다. 최신
`/r/pyd-master-detail.json`과 32번째 snapshot의 manifest·item URL이
응답하며 manifest에는 115개 item, 새 item에는 고정된
`pyd-button`·`pyd-utils` 의존 URL 2개가 있습니다.

로컬 브라우저에서 변경 동작을 확인했으므로 공개 브라우저의 동일
흐름은 다시 실행하지 않았습니다. 실제 touch·screen reader·Safari·
RTL, 개별 item CLI 설치, rollback 뒤 snapshot URL 보존은 미검증입니다.
공개 기준 113개 component·115개 registry item·32개 snapshot,
goal 관리용 추정 약 88%입니다.
