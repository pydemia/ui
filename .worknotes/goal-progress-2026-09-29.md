# Component 공급 목표 진행 상태

2026-10-02 ActionBar·CopyButton 로컬 검증: **약 82% → 약 82%**입니다.
공개 기준은 107개 component·109개 item·26개 snapshot입니다.
두 원본 component와 기존 3개 소비자를 연결하고 typecheck·테스트
124/124·build, 로컬 문서·새 소비자의 설치·390px Chromium을
확인했습니다. 공개 snapshot·production은 아직 검증하지 않았습니다.
[작업 기록](action-copy-controls-2026-10-02.md)에 범위와 실패·
미검증 항목을 적었습니다.

2026-10-02 Menubar 공개 검증 후: **약 81% → 약 82%**입니다.
107개 component·109개 registry item·26개 snapshot입니다. 여러
상위 명령의 방향키 이동·체크·라디오·submenu를 문서 Chromium에서,
공개 snapshot의 명령·체크 변경을 별도 소비자 390px Chromium에서
확인했습니다. PR #39와 병합 commit의 Verify UI, Pages, Vercel
production이 통과했습니다. 10개 축적 과제는 완료 5·부분 4·미검증
1로 유지합니다. 실제 screen reader·touch·Safari·RTL과 rollback
뒤 snapshot URL은 미검증입니다.
[작업 기록](menubar-2026-10-02.md)에 증거를 남겼습니다.

2026-10-02 Menubar 로컬 구현: 공개 기준 106개 component·108개 item·
25개 snapshot과 goal 약 81%를 유지합니다. 새 Menubar의 source·
registry·문서 preview·Usage를 작성하고 typecheck·UI 테스트 120/120·
build, 로컬 브라우저와 새 소비자 설치·typecheck·build·브라우저를
통과했습니다. 공개 검증은 남아 있습니다. provenance 고지 해시
갱신 전 `registry:check` 실패는 같은 작업에서 수정해 재검사했습니다.
[작업 기록](menubar-2026-10-02.md)을 참고하세요.

2026-10-01 공급·품질 기준 후속 재검토: 새 component마다 독립된 공개
설치 검사를 반복하는 기준을 릴리스별 변경 item·의존 item 조합
검사로 조정했습니다. 실제 보조기술·touch·Safari·RTL, 과거 snapshot의
rollback 보존은 별도 품질 과제입니다. 기존 10개 과제의 완료 5·부분 4·
미검증 1을 공급 점수로 환산하지 않습니다. 새 구현·배포·검증은 없어
goal 추정은 **약 81% → 약 81%**입니다.
[후속 재검토](quality-criteria-followup-2026-10-01.md)에 근거와
남은 위험을 적었습니다.

2026-10-01 YearPicker 공개 검증 후: **약 80% → 약 81%**입니다.
106개 component·108개 registry item·25개 snapshot입니다. 연도만
선택·제출하는 용례의 공개 preview와 별도 소비자 snapshot 설치·
typecheck·build·390px Chromium 경계·선택·제출을 확인했습니다.
PR #36의 병합 CI·Pages와 Vercel production도 통과했습니다.
실제 보조기술·touch·Safari·RTL, rollback은 미검증입니다.
라이브러리 과제 완료 5·부분 4·미검증 1은 그대로입니다.
[작업 기록](year-picker-2026-10-01.md)에 증거를 남겼습니다.

2026-10-01 YearPicker 로컬 검증: **약 80% → 약 80%**입니다.
106개 component·108개 registry item·25개 snapshot입니다.
연도 단위의 min/max·선택·제출·focus를 390px Chromium에서 확인했고
typecheck·UI 테스트 118/118·build·`registry:release-check`가
통과했습니다. 공개 설치와 배포는 아직 검증하지 않아 goal 추정치를
유지합니다. [작업 기록](year-picker-2026-10-01.md)에 남겼습니다.

2026-10-01 YearPicker 작업 시작: 관리용 추정 **약 80%**,
105개 component·107개 registry item·24개 snapshot입니다. 연도
단위 보고·예산의 값을 별도로 선택·제출할 수 있도록 합니다. 완료 후
검증 범위와 진척도는 [작업 기록](year-picker-2026-10-01.md)에
남깁니다.

2026-10-01 선택 카드 표시 형태 공개 검증 후: **약 80% → 약 80%**입니다.
105개 component·107개 registry item·24개 snapshot입니다. PR #34의
병합 CI·Pages와 Vercel production, 공개 preview, 별도 소비자의
snapshot 설치·파일 일치·typecheck·build·390px Chromium 선택·제출을
확인했습니다. component 수를 늘리지 않고 두 기존 선택기에 카드형을
추가했습니다. 방향키 자동 선택과 실제 보조기술·touch·Safari·RTL,
rollback은 미검증입니다. 라이브러리 과제 완료 5·부분 4·미검증 1은
그대로입니다. [작업 기록](selection-card-variants-2026-10-01.md)에
증거와 한계를 적었습니다.

2026-10-01 선택 카드 표시 형태 시작: 관리용 추정 **약 80%**,
105개 component·107개 registry item·23개 snapshot입니다.
CheckboxCard·RadioCard를 별도 이름으로 세지 않고 기존 선택기의
`card` 표시 형태로 구현합니다. 시작 시 라이브러리 과제는
완료 5·부분 4·미검증 1입니다. 완료 후 검증 범위와 종료 추정은
[작업 기록](selection-card-variants-2026-10-01.md)에 남깁니다.

2026-10-01 선택 카드 구현 로컬 검증: **약 80% → 약 80%**입니다.
기존 두 component의 표시 형태를 추가했으며 component와 item 수는
105·107로 유지합니다. typecheck·UI 테스트 116/116·build와 390px
Chromium의 클릭·Space·제출·light/dark를 확인했습니다. 방향키의
자동 선택과 공개 snapshot 설치는 아직 검증하지 않았습니다.
24번째 snapshot 생성과 `registry:release-check`는 통과했습니다.
공급·품질 기준을 변경 위험에 따라 적용하도록 다시 조정했으며,
전체 과제 완료 5·부분 4·미검증 1은 공급률로 사용하지 않습니다.
[작업 기록](selection-card-variants-2026-10-01.md)을 참고하세요.

2026-10-01 공급·품질 기준 재검토: 전체 라이브러리의 기존 10개
과제는 완료 5·부분 4·미검증 1입니다. 새 component의 출시 검증과
전체 환경·rollback 검사를 분리했습니다. `5/10`은 완전히 닫힌
축적 과제 수로만 남기고 공급률로 사용하지 않습니다. 이번 검토로
component나 확인된 사용 사례가 늘지는 않아 goal 추정은
**약 80% → 약 80%**입니다. [재검토 기록](quality-criteria-review-2026-10-01.md)에
판정 근거와 출시 기준을 적었습니다.

2026-10-01 TreeSelect 수정판 공개 검증 후: **약 80% → 약 80%**입니다.
105개 component·107개 registry item·23개 불변 snapshot입니다. PR·
병합 CI, Vercel production, 공개 preview와 수정판 snapshot의 별도
소비자 설치·typecheck·build·390px Chromium 동작을 확인했습니다.
첫 snapshot에서 발견한 native reset 오류는 새 snapshot으로
수정했으며 기존 snapshot은 불변으로 보존합니다. 실제 screen reader·
touch·Safari·RTL, item별 공개 격리 설치와 rollback 뒤 URL 보존은
미검증이므로 공급·품질 조건 5/10과 관리용 추정치를 유지합니다.
[작업 기록](component-tree-select-2026-10-01.md)에 범위를 적었습니다.

2026-10-01 TreeSelect 작업 시작: 관리용 기준값 **약 80%**,
104개 component·106개 registry item·21개 snapshot, 공급·품질 조건
5/10입니다. 계층의 한 항목을 form 값으로 제출하는 반복 흐름을 기존
`Tree`·`Popover`와 구분해 구현합니다. 완료 후 검증 범위와 종료값은
[TreeSelect 작업 기록](component-tree-select-2026-10-01.md)에 남깁니다.

2026-10-01 DiffViewer 공개 검증 후: **약 80% → 약 80%**입니다.
104개 component·106개 registry item·21개 snapshot입니다. 공개
preview, 새 소비자의 snapshot 설치·typecheck·build·390px Chromium,
PR·병합 CI와 production을 확인했습니다. 공급·품질 조건 완료 표시는
5/10으로 그대로입니다. 실제 보조기술·touch·Safari·RTL, item별
격리 공개 설치와 rollback 뒤 URL 보존을 검증하지 않았으므로 관리용
추정치를 올리지 않았습니다. 검사 범위와 남은 조건은
[작업 기록](component-diff-viewer-2026-10-01.md)에 남겼습니다.

2026-10-01 DiffViewer 작업 시작: 관리용 기준값 **약 80%**,
103개 component·105개 registry item·20개 snapshot, 공급·품질 조건
5/10입니다. 변경 전후 줄 검토가 기존 `CodeBlock`·`LogConsole`과
독립된 사용처인지 확인해 편입을 시작했습니다. 완료율은 component
수/100으로 계산하지 않으며 종료값과 검증 범위는
[DiffViewer 작업 기록](component-diff-viewer-2026-10-01.md)에 남깁니다.

2026-10-01 ApprovalCard 공개 검증 후: **약 80% → 약 80%**입니다.
`ApprovalCard`의 별도 승인 상태·중복 결정 방지·실패 후 재시도를
공급하고 공개 preview·snapshot·새 소비자 설치까지 확인했습니다.
103개 component·105개 registry item·20개 snapshot이지만 기존
공급·품질 조건 완료 표시는 5/10 그대로입니다. 실제 보조기술·touch·
Safari·RTL, item별 공개 격리 설치, rollback 뒤 URL 보존 등 남은
조건을 닫지 않아 관리용 추정치를 올리지 않았습니다.
[작업 기록](component-approval-card-2026-10-01.md)에 실행 증거와
미검증 범위를 남겼습니다.

2026-10-01 ApprovalCard 작업 시작: **약 80%**를 관리용 기준값으로
기록합니다. 102개 component·104개 registry item의 공개 설치 경로가
있으나 공급·품질 체크리스트는 5/10입니다. 100개를 분모로 쓰지 않으며
검증되지 않은 screen reader·touch·Safari·RTL, 개별 item 공개 설치,
rollback 뒤 snapshot URL 보존을 완료로 계산하지 않습니다. 각 작업의
시작·종료값과 근거는 별도 `.worknotes` 작업 기록에 남깁니다.
이번 범위는 [ApprovalCard 작업 기록](component-approval-card-2026-10-01.md)에
있습니다.

2026-09-30 Editable 로컬 검증 후 102개 component와 104개 registry item이
있습니다. 기존 공급·품질 조건의 완료 표시는 5/10이며, 실제 보조기술·
touch·Safari·RTL, item별 격리 공개 설치, rollback 뒤 snapshot URL
보존이 남아 있어 goal은 완료되지 않았습니다. 100개는 규모 기준점이므로
이를 넘었다는 이유로 완료율을 100%로 취급하지 않습니다. 이전의
약 74%는 97/100 규모 비율과 5/10 조건을 같은 비중으로 평균한
관리용 추정이었고, 현재 작업의 완료율로 재사용하지 않습니다.
새 component 검증과 배포 상태는
[Editable 작업 기록](component-editable-2026-09-30.md)에 남깁니다.

2026-09-30 MonthPicker 공개 후 현재 97개 component와 99개 registry item이
16개 catalog 범주에 있습니다. 약 100개라는 초기 규모 기준은 97%이고,
[로드맵](component-roadmap.md)의 공급·품질 조건은 5/10(50%)입니다.
기존 관리 방식대로 두 비율을 같은 비중으로 평균하면 73.5%이므로
**전체 goal의 관리용 추정은 약 74%**입니다. 두 비중은 합의된 측정
기준이 아니며, 100개도 완료 조건이 아닙니다. 16개 범주에는
Framework·Navigation·Workflow·Data & analytics·AI & agent가 포함되며,
화면 골격, 탐색, 분석 차트, 파일 작업, 복합 입력, AI 대화의 실제
동작을 구현했습니다. 반면 기존 component의 실제 screen reader·touch·
Safari·RTL 검증, 과거 snapshot의 rollback 뒤 URL 보존과 item별 공개
설치·상호작용 검사는 완료되지 않았습니다. 후보 체크박스 63/70은
기존 API 확장·조합 예시와 판정 대기 항목을 섞어 세므로 완료율의
분모로 쓰지 않습니다.

2026-09-29 Markdown 공개: [PR #4](https://github.com/pydemia/ui/pull/4)를
병합하고 PR·main CI, Vercel production READY, 공개 Markdown preview와
snapshot URL 설치 소비자 typecheck·build를 확인했습니다. 현재
**90개 component·92개 registry item**입니다. 공급·품질 조건의
완료 표시는 **5/10**, 전체 goal의 관리용 추정은 **약 70%**입니다.
규모 기준 90/100과 조건 5/10을 같은 비중으로 평균한 임시 수치이며
확정된 기능 요구사항 대비 완료율은 아닙니다. 92개 item 각각의 공개
격리 설치·상호작용, 실제 보조기술·touch·drag/drop·시간대,
rollback 뒤 snapshot URL 보존은 남았습니다.
[검증 기록](component-markdown-2026-09-29.md)에 근거와 한계를 적었습니다.

2026-09-29 Markdown 후보: 안전한 문법 부분집합을 90번째 component와
92번째 registry item으로 구현했습니다. 패키지·문서·registry와 새
소비자 설치, 로컬 브라우저를 검사했습니다. 공개 배포와 새 snapshot의
공개 URL 설치는 아직 미검증입니다.
[구현·검증 기록](component-markdown-2026-09-29.md)에 범위를 적었습니다.
공급·품질 조건 완료 표시는 **5/10**으로 유지합니다. 약 100개 규모
기준 90%와 조건 완료 표시 50%를 임의로 같은 비중으로 평균해 전체
goal의 **관리용 추정 약 70%**를 유지합니다. 100개는 확정된 완료 수가
아니고 이 값은 객관적 사용성·배포 준비율이 아닙니다.

2026-09-29 작업 마감: `DateRangeFilter` 후보는 기존 `DateRangePicker`와
`FilterBar`의 조합으로 처리하기로 판정했습니다. 새 component·registry
item이나 릴리스는 만들지 않았습니다. 결합 예시의 설치·브라우저 동작과
기간 preset의 시간대 규칙은 미검증입니다. 현재 **89개 component·91개
item, 공급·품질 조건 5/10, 전체 goal의 관리용 추정 약 70%**입니다.
89/100이라는 규모 비율 89%와 조건 완료 표시 50%를 임의로 같은 비중으로
평균한 69.5%를 반올림한 값입니다. 100개는 확정된 완료 기준이 아니며,
이 수치는 실제 사용성 또는 배포 준비율이 아닙니다.

2026-09-29: 새 registry 소비자 고지의 provenance 링크를 고정 commit과
내용 해시로 바꾸고 검사에 추가했습니다. [PR #3](https://github.com/pydemia/ui/pull/3)
병합 뒤 CI와 production 배포, 공개 Button 설치·소비자 build를
확인했습니다. 현재 snapshot ID는
`sha256-d6ac442e615afdf7bda064ed424685038b48ac2ff063bc5726e354494ba29fee`
입니다. [검증 기록](component-provenance-pin-2026-09-29.md)에 범위가
있습니다. 과거 snapshot의 고지와 rollback URL 보존은 미완료이므로
**89개 component·91개 item, 공급·품질 조건 5/10, 전체 goal의
관리용 추정 약 70%**를 유지합니다.

2026-09-29 후속 배포: [PR #2](https://github.com/pydemia/ui/pull/2)를
병합했습니다. 병합 커밋 `cc14188`의 Verify UI CI와 Vercel production
배포가 성공했고, 새·이전 공개 snapshot 파일을 확인했습니다.
Sidebar·AppShell의 공개 URL 설치와 소비자 typecheck·build도
통과했습니다. rollback 뒤 주소 보존과 release별 provenance 고정은
미완료이므로 공급·품질 조건 **5/10**, 전체 goal의 관리용 추정
**약 70%**를 유지합니다.

2026-09-29 후속 독립 검토에서 배포 rollback이 최신 snapshot 경로를
제거할 수 있음을 확인했습니다. 기존 ‘불변 주소 보존’ 완료 표시를
철회해 공급·품질 조건은 **5/10**입니다. 문서 19개의 설치 명령,
DataChart 극단값·빈 행 이름, DataTable 옵션 변경과 CI의 untracked
생성 파일 검사를 수정했습니다. 로컬 **89개 component·91개 registry
item**은 그대로입니다. 약 100개 규모 기준 89%와 조건 완료 표시
50%를 같은 비중으로 계산한 69.5%를 반올림해 전체 goal의
**관리용 추정은 약 70%**입니다. 두 축의 가중치는 합의된 기준이
아니므로 객관적인 완성률이나 출시 준비도를 뜻하지 않습니다.
[후속 검토](component-followup-review-2026-09-29.md)에 수정·검증과
미완료 범위를 기록했습니다.

2026-09-29 production 배포: [PR #1](https://github.com/pydemia/ui/pull/1)을
`main`에 병합했고 Vercel production이 READY입니다.
[main push CI](https://github.com/pydemia/ui/actions/runs/36573529988)도
통과했습니다. 공개 URL에서 현재·이전 snapshot을 각각 새 소비자에
설치해 typecheck·build를 확인했습니다. 불변 주소 조건을 완료 표시해
공급·품질 조건은 **6/10**입니다. 89개라는 규모 비율 89%와 조건 완료율
60%를 같은 비중으로 평균한 74.5%를 반올림해 전체 goal의 관리용 추정을
**약 75%**로 갱신합니다. 독립 코드 review, 실제 보조기술·touch·
drag/drop·다른 시간대 검사는 남아 있습니다. 이 비율은 객관적인
사용성이나 모든 component의 검증률이 아닙니다.
[배포 기록](component-production-release-2026-09-29.md)에 실행 범위와
남은 검증을 구분했습니다.

2026-09-29 작업 정리: [PR #1](https://github.com/pydemia/ui/pull/1)의
코드·CI 변경 커밋 `2b41cfe`는 push되어 있고 해당 커밋의
[GitHub Actions run](https://github.com/pydemia/ui/actions/runs/36572361755)이
성공했습니다. PR은 draft이며 제출된 review와 review thread는 없습니다.
`main` 병합과 production 게시, 공개 snapshot URL을 이용한 소비자 설치는
아직 하지 않았습니다. 현재 89개 component와 91개 registry item,
공급·품질 조건 5/10입니다. 약 100개라는 규모 기준의 수량 89%와
조건 완료 표시 50%를 같은 비중으로 평균한 69.5%를 반올림해
**전체 goal의 관리용 추정치를 약 70%**로 유지합니다. 100개는 확정된
완료 수가 아니며 이 비율은 공개 준비율이나 검증된 사용 사례의 비율이
아닙니다. 남은 일은 [로드맵](component-roadmap.md)의 미완료 조건과
[릴리스 검토 기록](component-release-review-2026-09-29.md)에 있습니다.

2026-09-29: 현재 내용 해시 ID를 자동으로 고르는 release 검사를 추가하고,
PR·`main` push용 CI workflow에 typecheck·테스트·build·snapshot 검사·
생성 파일 diff 검사를 넣었습니다. 로컬 검사와 PR #1의 GitHub Actions
run이 통과했습니다. component 89개·registry item 91개, 공급·품질 조건
5/10, 관리용 전체 추정 약 70%는 유지합니다.
[기록](component-ci-gate-2026-09-29.md)을 참고하세요.

2026-09-29: DataChart의 유한한 양·음 극값에 대한 SVG 좌표 계산을
수정하고 네 표시 형태의 회귀 시험을 추가했습니다. 현재 후보 snapshot
ID를 새로 만들고 이전 ID는 보존했습니다. 테스트 46/46, typecheck,
build와 커밋 복원본의 release 검사가 통과했고 PR #1에 push했습니다.
component·item 수는
**89개·91개**, 공급·품질 조건은 **5/10**, goal의 관리용 추정은
**약 70%**로 유지합니다. [기록](component-release-review-2026-09-29.md)에
범위와 미검증 항목을 남겼습니다.

2026-09-29: [draft PR #1](https://github.com/pydemia/ui/pull/1)을 열고
Vercel preview의 READY 상태와 브라우저의 89개 목록·Navigation variant
전환을 확인했습니다. preview registry JSON은 인증이 필요하고 현재
production의 새 snapshot 경로는 404입니다. 따라서 공개 소비자 설치와
릴리스 조건은 완료 처리하지 않으며 **5/10**, 관리용 **약 70%**를
유지합니다. [기록](component-release-review-2026-09-29.md)에 범위를
남겼습니다.

2026-09-29: 확장안을 기능·문서·생성 산출물의 세 커밋으로 정리하고,
Git archive에서 복원한 깨끗한 체크아웃으로 `npm ci`, build,
typecheck, package 테스트 45개, `registry:check`,
`registry:release-check`를 통과했습니다. ZIP 복원 시 JSON의 CRLF 변환이
내용 해시를 깨뜨리는 문제는 `.gitattributes`로 고쳤습니다. 세부 내역은
[릴리스 검토 기록](component-release-review-2026-09-29.md)에 있습니다.
대규모 변경의 독립 검토와 공개 URL 설치·배포는 남아 있어 공급·품질
조건은 **5/10**, 전체 goal의 관리용 추정은 **약 70%**로 유지합니다.
기능·문서·생성 산출물·작업 기록은
`origin/codex/ui-component-release`로 push했습니다.

2026-09-29: [로컬 릴리스 검사](component-release-check-2026-09-29.md)를
추가했습니다. 현재 빌드와 지정한 내용 해시 snapshot, `docs/r/`의
최신 JSON이 일치함을 확인했고, 미공개 변경 기록과 실행 절차를
작성했습니다. component **89개**, registry item **91개**, 공급·품질
조건 **5/10**, 전체 goal의 관리용 추정 **약 70%**는 유지합니다.
실제 공개 URL에서 설치하고 이전 snapshot을 보존하는 검증은 남았습니다.

2026-09-29: [Navigation 디자인 확장](component-navigation-variants-2026-09-29.md)으로
전역·측면 링크에 선택 가능한 표시 형태를 추가했습니다. 기존 API의
variant 확장이라 component·registry item 수는 **89개·91개**로 같고,
공급·품질 조건의 완료 표시는 **5/10**입니다. 전체 goal의 관리용
추정 **약 70%**를 유지합니다. 새 로컬 snapshot과 소비자 갱신 검사는
완료했지만 대규모 변경 검토·공개 배포·실제 보조기술 검사는 남았습니다.

2026-09-29: [registry import 감사](component-registry-import-audit-2026-09-29.md)로
91개 item의 정적 source import와 직접 의존성 선언을 대조했습니다.
`SearchInput`·`NumberInput`의 누락 선언을 고쳤고 새 내용 해시
snapshot을 생성했습니다. 이전 snapshot은 보존했습니다. component
수는 **89개**, registry item은 **91개**로 같습니다. 공급·품질 조건도
**5/10**이므로 전체 goal의 **관리용 추정 약 70%**를 유지합니다.
이는 수량 기준 89%와 조건 완료 표시 50%의 평균 69.5%를 반올림한
값이며, 실제 공개 준비율이나 객관적 완료율은 아닙니다. 대규모 변경
검토·릴리스, 공개 snapshot 설치, 실제 보조기술·touch 검사는 남았습니다.

2026-09-29: [공개 버전 소비자 갱신 검사](component-registry-upgrade-2026-09-29.md)에서
40개 공개 item을 현재 91개로 갱신했고, 수정 파일의 충돌·재적용 경로를
확인했습니다. 공급·품질 조건의 완료 표시는 **5/10(50%)**입니다.
로컬 **89개 component·91개 registry item**이므로 약 100개 규모
기준 수량 비율 89%와 조건 50%의 산술 평균 69.5%를 반올림해 전체
goal을 **약 70%**로 추정합니다. 100개는 확정 완료 수가 아니며
이 추정치는 공개 준비율이 아닙니다. snapshot 공개 설치·릴리스와
실제 보조기술·touch 등 남은 조건은 계속 미완료입니다.

2026-09-29: 91개 registry item을 내용 해시 snapshot으로 묶고
`docs/r/releases/` 복사본·내부 의존성·파일 해시를 검사했습니다.
[검증 범위](component-registry-release-2026-09-29.md)를 기록했습니다.
공개 URL 설치와 과거 버전 보존·갱신은 아직 검증하지 않았으므로 공급·
품질 조건은 **4/10**으로 유지합니다. 로컬 **89개 component·91개
registry item**이며 전체 goal의 관리용 추정도 **약 65%**입니다.

2026-09-29: 기존 AppShell floating 도움말 조합의 focus 손실을 고쳤습니다.
문서와 분석 화면에서 열림 상태·Tab·Escape·닫기 focus 복귀를 확인했고
[검증 범위](component-floating-help-2026-09-29.md)를 기록했습니다.
새 component를 세지 않았습니다. 로컬 **89개 component·91개 registry
item**, 공급·품질 조건 **4/10**, 전체 goal 관리용 추정 **약 65%**입니다.
실제 보조기술·touch·다른 브라우저와 기존 소비자 갱신·릴리스는 남았습니다.

2026-09-29: 89개 catalog 사용 코드를 package tarball과 설치된
registry 소스의 두 소비 경로에서 각각 typecheck했습니다. 단독 TSX에서
문법 오류가 나던 20개 예시를 수정했고 `registry:check`에 문법 검사를
추가했습니다. [검증 기록](component-catalog-usage-2026-09-29.md)을
참고하십시오. 수량은 **89개 component·91개 registry item**으로
같습니다. 약 100개 규모 기준 수량 비율은 **89%**, 공급·품질 조건은
**4/10(40%)**입니다. 두 수치를 임의로 같은 비중으로 평균한
64.5%를 반올림해 전체 goal을 **약 65%**로 추정합니다. 100개는
고정된 완료 조건이 아니며 이 추정치는 객관적 완성률이나 공개
준비율이 아닙니다. 개별 동작·접근성 회귀, 기존 소비자 갱신,
변경 묶음의 검토·릴리스와 공개 배포가 남았습니다.

2026-09-29: `CitationList`를 추가해 로컬 작업 트리는 **89개
component·91개 registry item**입니다. 약 100개 규모 기준의 수량
비율은 89%, 공급·품질 조건의 완료 표시는 **4/10(40%)**입니다.
두 축을 임의로 같은 비중으로 보면 64.5%이므로 전체 goal의
**관리용 추정 약 65%**를 유지합니다. 100개는 확정 목표 수가
아니고, 이 수치는 공개 준비율도 아닙니다. 새 item의 격리 소비자
설치와 문서 동작, 현재 91개 item의 새 소비자 동시 설치·93개 파일
일치·typecheck·build·브라우저 로딩은
[CitationList 기록](component-citation-list-2026-09-29.md)에 있습니다.
기존 소비자의 갱신·충돌·복구, 실제 보조기술·touch·RTL,
전체 변경 묶음의 검토·릴리스와 공개 배포는 남았습니다.

2026-09-29: `SplitButton` 후보를 기존 세 item의 설치 가능한 조합
예시로 해결했습니다. 기본 저장·대체 메뉴의 문서/소비자 동작을 확인했고
새 component와 item은 만들지 않았습니다. 현재 로컬 작업 트리는
**88개 component·90개 registry item**입니다. 약 100개 규모 기준의
수량 비율 88%와 공급·품질 조건 **4/10(40%)**의 산술 평균은
**64%**이며, 전체 goal은 기존과 같이 **약 65%**의 관리용 추정으로
기록합니다. 100개는 고정된 완료 조건이 아니고, 두 축의 동일 가중치도
합의된 평가 기준이 아니므로 객관적 완료율이나 공개 준비율은 아닙니다.
[조합 검증](component-split-button-recipe-2026-09-29.md)을 제외한
현재 변경 묶음의 검토·릴리스, 전체 핵심 동작·접근성 회귀, 소비자
갱신·충돌 복구와 불변 URL·공개 배포는 남았습니다.

2026-09-29: form 제출이 필요한 분할 선택 `SegmentedControl`을
추가했습니다. 로컬 작업 트리는 **88개 component·90개 registry
item**입니다. 새 항목과 현재 90개 item의 격리 소비자·동시 소비자
검사를 마쳤지만, 공급·품질 조건의 완료 표시는 **4/10** 그대로입니다.
약 100개 규모 기준의 수량 비율 88%와 조건 40%를 같은 비중으로
평균하면 64%이므로 전체 goal의 **관리용 추정은 약 65%**로
유지합니다. 고정된 목표 수나 출시 준비도를 뜻하지 않습니다.
[SegmentedControl 기록](component-segmented-control-2026-09-29.md)에
새 동작과 검증 범위를 남겼습니다. 88개 catalog 사용 코드 전체의
새 소비자 typecheck, 보조기술·touch·RTL, 갱신 충돌·복구와 공개
배포는 남았습니다.

2026-09-29: 기존 Dropzone·Calendar·Slider·Avatar의 문서 예시를
확장해 Chromium에서 파일 선택·거부, 기간 선택, 두 thumb 키보드
조작, 실제 이미지와 fallback을 재검사했습니다. 파일 drag/drop,
touch, 실제 screen reader와 다른 호스트 시간대 검사가 남아 있어
공급·품질 조건의 완료 표시는 **4/10** 그대로입니다. component는
**87개**, registry item은 **89개**이며 전체 goal의 관리용 추정치는
**약 65%**로 유지합니다. 수량 비율 87%와 완료 표시 40%를 같은
비중으로 평균한 63.5%를 반올림한 값입니다. 사용 가능한 화면
범위나 공개 준비도를 객관적으로 측정한 값은 아닙니다.
[상호작용 재검사](component-foundation-interactions-2026-09-29.md)에
확인 범위와 남은 항목을 기록했습니다.

2026-09-29: 기존 `Navigation` item에 주요 목적지용 `BottomNav`를
추가했습니다. 숫자를 늘리기 위한 별도 item이 아니라 같은 탐색
API의 하단 배치입니다. browser pointer·Enter·390px 배치와 격리
소비자 설치·typecheck·build를 확인했습니다. 수량은 **87개
component·89개 registry item**, 공급·품질 조건은 **4/10** 그대로이며
전체 goal 관리용 추정치도 **약 65%**로 유지합니다. 세부 근거는
[하단 탐색 기록](component-bottom-navigation-2026-09-29.md)에 있습니다.

2026-09-29: shadcn/ui source를 수정한 27개 registry item을 각각 새
소비자 fixture에 설치하고, 각 설치물의 MIT 고지와 직접 component
소스가 원본과 일치하는지 확인했습니다. 공급·품질 조건은 **10개 중
4개**가 완료 표시되었습니다. component는 **87개(약 100개 규모 기준
87%)**입니다. 두 축을 임의로 같은 비중으로 계산한 63.5%를
전체 goal의 **관리용 추정 약 65%**로 기록합니다. 가중치와 조건별
난이도가 정해지지 않아 객관적 완료율이나 배포 준비율은 아닙니다.
[item별 고지 전달 검증](component-license-notice-individual-2026-09-29.md)에
범위와 미검증 항목을 기록했습니다. 대규모 변경의 검토·릴리스,
나머지 item의 개별 설치, 실제 상호작용·접근성, 갱신 충돌·복구와
불변 URL은 남았습니다.

2026-09-29: 현재 89개 registry item을 `shadcn@4.21.0`으로 새 소비자에
동시 설치했습니다. 91개 파일의 원본 일치, 설치 소스의 87개 catalog
사용 코드 typecheck, 전체 모듈 build·Chromium 로딩을 확인했습니다.
별도 package tarball 소비자에서도 87개 코드가 typecheck됐습니다.
공급·품질 조건은 **10개 중 3개**로 늘었습니다. component는
**87개(약 100개 규모 기준 87%)** 그대로입니다. 두 축을 임의로 같은
비중으로 계산하면 58.5%이므로 전체 goal의 관리용 추정치는 **약
60%**로 조정합니다. 가중치가 합의되지 않았고 남은 조건의 난이도도
달라 객관적 완료율이나 배포 준비율은 아닙니다. 세부 근거는
[현재 공급 경로 검사](component-catalog-supply-2026-09-29.md)에
있습니다. 변경 묶음의 검토·릴리스, 모든 개별 설치·상호작용,
보조기술·touch·다른 브라우저, 갱신 충돌·복구, 불변 URL은 남았습니다.

2026-09-29: 기존 `Badge`에 기본·외곽선·강조·위험 variant를 추가하고
Operations workspace의 완료·실행 중·실패에 적용했습니다.
`StatusIndicator` 후보는 별도 component 없이 이 API 확장으로
처리했습니다. 수량은 **87개 component·89개 registry item(규모 기준
87%)**, 공급·품질 조건은 **2/10**, 전체 goal의 관리용 추정치는
**약 50%**로 그대로입니다. 격리 소비자 설치와 브라우저의 밝은·어두운
모드 결과는 [Badge 기록](component-badge-variants-2026-09-29.md)에
남겼습니다.

2026-09-29: `DataList`를 추가해 로컬 작업 트리는 **87개 component와
89개 registry item**입니다. 약 100개라는 규모 기준의 수량 비율은
**87%**입니다. 독립 소비자에 `DataList`·`Badge`·token을 설치해
typecheck·build와 원본 일치를 확인했습니다. 이전 87개 item의 동시
설치 검사는 현재 89개 item 전체를 대표하지 않습니다.
[DataList 기록](component-data-list-2026-09-29.md)에 검사 범위가
있습니다.

공급·품질 조건은 여전히 10개 중 2개가 완료 표시되어 있습니다. 수량
87%와 조건 20%를 같은 비중으로 단순 평균하면 53.5%지만, 두 축의
가중치와 조건별 난이도가 정해지지 않았습니다. 전체 goal은 **관리용
추정 약 50%**로 유지합니다. 객관적인 완료율이나 공개 배포 준비율로
해석할 수 없습니다. 대규모 로컬 변경의 검토·릴리스, 기존 component
상호작용 회귀, 보조기술·touch·다른 브라우저, 갱신·충돌 복구와 불변
registry URL은 남았습니다.

2026-09-29: `CodeBlock`을 추가해 로컬 작업 트리는 **86개 component와
88개 registry item**입니다. 약 100개 규모 기준의 수량 비율은
**86%**입니다. 공급·품질 조건은 여전히 2/10이고 전체 goal의 관리용
추정치는 **약 50%**로 유지합니다. 단일 코드 블록의 복사·긴 줄
배치와 격리 설치 검사는
[CodeBlock 기록](component-code-block-2026-09-29.md)에 남겼습니다.

2026-09-29: 현재 87개 registry item을 새 소비자에 동시에 설치하고
89개 파일의 원본 일치와 87개 모듈의 typecheck·build를 확인했습니다.
이 검사는 공급·품질 조건 중 이미 완료 표시된 동시 신규 설치 항목의
현재 snapshot 재검증입니다. 수량 85%, 조건 2/10, 관리용 전체
약 50% 추정치는 변하지 않습니다.
[전체 설치 기록](component-full-registry-consumer-2026-09-29.md)에
검사 범위와 미검증 항목을 남겼습니다.

2026-09-29 종료 시점의 로컬 작업 트리는 **85개 component와 87개
registry item**입니다. `DateTimePicker`를 추가했고 단독 registry 설치,
소비자 typecheck·build 및 로컬 Chromium의 양방향 선택·제출을
확인했습니다. 약 100개라는 규모 기준의 수량 비율은 **85%**입니다.

전체 goal의 관리용 추정치는 **약 50%**로 유지합니다. 수량 85%와
아래 공급·품질 조건 2/10(20%)을 임의로 같은 비중으로 보면 52.5%지만,
가중치·항목 난이도가 합의되지 않았습니다. 따라서 객관적인 완료율이나
배포 준비율은 아닙니다. 현재 변경 묶음의 검토·릴리스, 기존 component의
핵심 동작 회귀, 실제 보조기술·touch·다른 브라우저, 개별 설치·갱신·
충돌 복구, 불변 버전 URL이 주요 미완료 범위입니다. 새 component의
검사 범위는 [DateTimePicker 기록](component-date-time-picker-2026-09-29.md)에
남겼습니다.

2026-09-29 추가 확인: 기존 component를 조합한 Operations workspace를
문서에 넣고 기간 전환, 지표·차트, 로그, 실행 목록, floating 도움말의
브라우저 동작을 확인했습니다. 새 component 수는 0개이고 공급·품질
조건의 완료 표시도 2/10으로 그대로여서 아래 약 50% 추정치는
변경하지 않습니다. 이 예시는 중급 분석 화면 재현성의 한 사례이며
다른 제품 화면이나 접근성 전체를 대표하지 않습니다. 검사와 남은 범위는
[분석 예시 기록](component-analytics-workspace-2026-09-29.md)에 있습니다.


2026-09-29 로컬 작업 트리 기준으로 component는 초기 38개에서 84개로
늘었습니다. 공용 `pyd-utils`, `pyd-tokens`를 포함한 registry item은
86개입니다. 약 100개라는 규모 기준의 수량 비율은 **84%**입니다.
100개는 확정된 완료 조건이 아니라 공급 범위를 가늠하는 기준점입니다.

전체 목표의 **관리용 추정 완료율은 약 50%**로 봅니다. 수량 비율 84%와
[로드맵](component-roadmap.md)의 공급·품질 조건 10개 중 완료한 2개의
비율 20%를 같은 비중으로 보면 52%이며, 이를 50% 수준으로
표현했습니다. 두 축의 가중치는 사용자와 합의한 기준이 아니고 항목별
난이도도 달라, 객관적인 전체 완료율이나 출시 준비도로 해석할 수
없습니다. 특히 component별 design 선택 폭과 중급 이상 복합 화면의
재현성은 하나의 정량 지표로 아직 측정하지 않았습니다.
이후 `MetricCard`에 compact·featured 형태를 추가했지만 component
총수와 공급 조건의 완료 표시 수는 변하지 않았습니다. 검증 범위는
[MetricCard 기록](component-metric-card-variants-2026-09-29.md)에 있습니다.

86개 registry item은 새 소비자 프로젝트에 한 번에 설치했습니다.
생성된 88개 파일은 원본과 일치했고 86개 모듈의 typecheck·build·
브라우저 로딩(206개 값 export, console error 0건)이 통과했습니다.
기본 공개 URL 빌드, 저장소 typecheck와 `registry:check`도 통과했습니다.
[전체 설치 기록](component-full-registry-consumer-2026-09-29.md)에
검사 방법과 fixture 경로를 남겼습니다.

남은 공급 조건에는 현재 변경을 검토 가능한 단위로 정리하는 일,
기존 component의 핵심 상호작용 회귀, 실제 보조기술·touch·다른
브라우저 검사, item별 격리 설치, 소비자가 수정한 파일의 갱신·충돌·
복구, 불변 버전 URL과 릴리스 절차가 있습니다. 현재 변경 묶음의
commit·push·공개 배포도 확인하지 않았습니다. 이번 86개 동시 설치는
각 component의 상호작용 검증을 대신하지 않습니다. 이후 현재
catalog 사용 코드 84개를 tarball 소비자에서 typecheck했고 원본·
public export·registry·catalog ID의 1:1 대응을 자동 검사에 넣었습니다.
검사 범위는 [문서 코드 기록](component-catalog-consumer-2026-09-29.md)에
있습니다. 공급·품질 조건의 완료 표시 수는 변경되지 않았습니다.

상단 로고의 사각 테두리 요청은 키보드 초점 상태의 공통
`focus-visible` outline으로 재현해 로고 링크의 초점 표시를 아래쪽
선으로 바꿨습니다. 밝은·어두운 로컬 화면에서 확인한 범위는
[flat 로고 기록](brand-logo-flat-2026-09-29.md)에 있습니다.
