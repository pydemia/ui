# Kanban 작업 보드

## 결정과 범위

Workflow 범주에는 Stepper·Timeline만 있었고, 상태별 카드를 정렬하거나
열 사이로 옮기는 컴포넌트가 없었습니다. `AppShell`·`DataTable`의 역할과
구분되는 상태 전환 작업 화면으로 `Kanban`을 추가했습니다. 열·카드의
ID와 순서를 호출자가 소유하고, 컴포넌트가 새 목록과 이동 정보를
`onColumnsChange`로 전달합니다. 서버 저장은 수행하지 않습니다.

Kibo Kanban의 공식 문서, `3d63cdb` revision의 소스·package manifest·
MIT LICENSE를 확인했습니다. Kibo 구현은 dnd-kit과 tunnel-rat 등을
사용합니다. 이 구현은 열·카드 역할을 참고해 React·Tailwind와 native
drag/drop으로 새로 작성했으며 Kibo 코드와 의존성은 편입하지 않았습니다.
`skills.pydemia.ai`는 2026-09-30 웹 조회에서 열리지 않았습니다.
저장소의 인계·로드맵·설계·검증 지침으로 진행했습니다.

## 진행 상태

- [x] `Kanban`의 controlled API, 카드 이동 순서 계산, 중복/빈 ID 검증
- [x] drag/drop과 native 버튼 이동, 빈 열 표시, focus 복원과 live region
- [x] `@pydemia/ui` export와 `pyd-kanban` registry/provenance 추가
- [x] 문서 preview와 설치·사용 코드 추가
- [x] 순수 이동 함수·SSR 테스트 4개 추가, 패키지 64/64 통과
- [x] 전체 typecheck·build 검사, 93개 registry item 생성
- [x] 로컬 Chromium 데스크톱·390px 버튼 이동과 키보드 Enter,
  이동 후 focus·live region, 빈 열 이동, 같은 열 재정렬, 페이지 overflow 없음
- [x] provenance 고지 SHA 갱신과 registry release 검사
- [x] 독립 소비자 registry 설치·typecheck·build·브라우저 카드 이동
- [x] PR·CI·production 배포

브라우저 자동화의 drag 동작으로는 native drag/drop 이벤트가 확인되지
않았습니다. 따라서 마우스 끌기의 실제 이동, touch drag, Safari,
screen reader 발표, 서버 저장 실패 후 복구는 미검증입니다. 키보드·
touch용 방향 버튼의 클릭 경로는 확인했습니다. 이전 미공개 draft
snapshot 네 디렉터리는 작업 범위에서 제외합니다.

## 배포 확인

- [PR #10](https://github.com/pydemia/ui/pull/10)을 병합했습니다.
  PR Verify UI run `36605365836`, `main` Verify UI run
  `36605563776`, Pages run `36605564092`가 통과했습니다.
- 병합 커밋은 `4406b6709257f54960ad0db2a4ac51144f07d662`입니다.
  Vercel production `dpl_nw6dEJ5pQ3xtyud6LBqBvnHM5Kbm`은
  READY입니다. 공개 Kanban preview에서 방향 버튼으로 카드를
  옮기고 열 개수와 live region 변경을 확인했습니다.
- 공개 `/r/pyd-kanban.json`은 `pyd-kanban`을 제공하고 새 snapshot
  manifest는 ID와 itemCount 93을 제공합니다. 공개 URL 전체 소비자
  설치와 native drag 조작은 실행하지 않았습니다.
