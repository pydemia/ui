# 공개 component 후속 검토

2026-09-29. PR #1의 공개 배포 뒤 API·접근성, registry 소비, 배포·출처를
각각 독립적으로 읽기 전용 검토했습니다. 검토자는 실제 보조기술과 모든
브라우저 상호작용을 실행하지 않았습니다.

## 확인하고 수정한 항목

- 문서 89개 Usage의 import와 `installItems` 및 registry 의존성 폐쇄
  목록을 대조했습니다. 19개 문서에서 예시가 import하는 항목이 설치
  명령에 빠져 있었습니다. `catalog.tsx`의 해당 명령을 보완하고
  `check-registry.mjs`가 누락된 public symbol의 소유 item을 검사하게
  했습니다. Sidebar 예시의 AppShell/AppBody/AppMain이 대표 사례입니다.
  구현 소스가 사용하지 않는 예시용 item을 registry 의존성에 넣지는
  않았습니다.
- DataChart 단일·동일 극단값 `±Number.MAX_VALUE`의 domain padding이
  Infinity가 되는 문제를 수정했습니다. padding이 유한하지 않으면
  상수 domain을 유지하고 y 좌표를 중앙에 놓습니다. 빈 점 이름은
  inspector와 숨김 데이터 표에서 모두 `구간 N`으로 표시합니다.
- DataTable에서 부모가 필터 옵션을 교체하면 이전 선택값으로 행을
  계속 거르는 문제를 수정했습니다. 현재 옵션에 없는 값은 select와
  행 계산에서 함께 전체로 취급하고 내부 선택 상태도 지웁니다.
- CI의 `git diff -- docs`는 untracked 생성 파일을 찾지 못했습니다.
  `git ls-files --others --exclude-standard -- docs` 검사를 추가했습니다.

## 검증

- `npm run build`, `npm run typecheck`, `npm run test -w @pydemia/ui`
  (48/48), `npm run registry:release-check`가 로컬에서 통과했습니다.
  마지막 검사는 91개 item, 89개 public export/catalog와 5개 로컬
  snapshot을 확인했습니다. 새 내용 해시 ID는
  `sha256-a3db94852dbdea79f551fa350fdf314cbf43b274b235fb76fb313a1008489a28`
  입니다. 앞서 공개한 두 ID의 파일은 변경하지 않았습니다.
- 로컬 Chromium 문서의 Sidebar 페이지에서 AppShell을 import하는
  Usage와 `pyd-sidebar.json`, `pyd-app-shell.json`을 함께 제시하는
  설치 명령을 확인했습니다. 공개 배포 전이라 새 명령의 공개 URL
  설치는 아직 실행하지 않았습니다.
- DataChart 극단값과 빈 점 이름은 서버 렌더링 회귀 테스트로
  확인했습니다. DataTable의 동적 옵션 교체와 CI의 새 untracked 검사
  단계는 브라우저·원격 CI에서 아직 실행하지 않았습니다.

## 남은 문제와 진행률

- Vercel의 과거 배포로 Instant Rollback하면 그 배포가 만들어지기
  전의 `/r/releases/<ID>/` 파일은 사라질 수 있습니다. 현재·이전 두
  snapshot의 공개 설치 성공은 확인했지만 rollback 뒤 주소 보존은
  검증하지 않았습니다. 복구 배포가 모든 공개 ID를 포함하는 절차나
  독립 보존 저장소가 필요합니다. 실제 rollback은 실행하지 않았습니다.
- `registry/SHADCN_UI_LICENSE.md`의 provenance 링크는 `main`을
  가리킵니다. 과거 item의 출처 설명이 향후 편집으로 달라질 수 있어
  release별 provenance 고정 방식을 정해야 합니다. MIT 고지 본문과
  upstream revision 자체는 현재 item에 포함되어 있습니다.
- FileUpload의 `disabled`는 파일 선택을 막지만 기존 실패 항목의
  재시도·제거 버튼을 막지 않습니다. API에서 목록 작업까지 비활성화
  한다는 의미를 정하지 않아 이번 수정에는 포함하지 않았습니다.
- 실제 screen reader 발표, touch, 파일 drag/drop, 다른 호스트
  시간대, 91개 item의 개별 공개 설치는 미검증입니다.

위 rollback 문제 때문에 로드맵의 불변 주소 조건을 미완료로 돌렸습니다.
현재 89개 component·91개 registry item, 공급·품질 조건 5/10입니다.
약 100개라는 규모 기준 89%와 조건 50%의 산술 평균 69.5%를
반올림한 전체 goal의 관리용 추정은 약 70%입니다. 이는 합의된 가중치나
객관적인 사용성 측정이 아닙니다.
