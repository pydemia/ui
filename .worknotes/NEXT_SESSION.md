# Component 확장 작업 인계

2026-09-30 Sidebar 섹션 탐색 진행: 기존 `items`와 호환되는 이름 있는
`sections` 입력, 데스크톱·모바일 그룹, 문서 preview를 구현했습니다.
`build`·`typecheck`·패키지 테스트 59/59와 registry release 검사가
통과했습니다. 소비자 MIT 고지의 commit·SHA-256을 갱신하고 새
snapshot을 만들었습니다. Chromium 데스크톱·390px Drawer, 공개
snapshot의 독립 Vite 소비자 설치·typecheck·build를 확인했습니다.
[PR #6](https://github.com/pydemia/ui/pull/6)의 PR·main CI와
production 배포도 통과했습니다. 자세한 상태와 미검증 범위는
[Sidebar 섹션 기록](component-sidebar-groups-2026-09-30.md)을 참고하세요.
component 90개·item 92개, goal 관리용 추정 약 70%는 유지합니다.

2026-09-30 상단 GNB: `Components → category → component` 메뉴를
기존 catalog와 `Popover`로 구현했습니다. [PR #5](https://github.com/pydemia/ui/pull/5)
병합 뒤 main CI와 production READY, 운영 category·component 선택을
확인했습니다. 로컬 데스크톱·390px Chromium 동작도 확인했으며 새
component·registry item은 없습니다. 상세 설계와
미검증 범위는 [상단 메뉴 기록](top-gnb-components-2026-09-30.md)에
남겼습니다. 공급·품질 조건 5/10과 전체 goal 관리용 추정 약 70%는
유지합니다.

2026-09-29 Markdown 배포: 90번째 component와 92번째 registry item을
[PR #4](https://github.com/pydemia/ui/pull/4)로 `main`에 병합했습니다.
공개 snapshot은
`sha256-70c4a56811508257fe1131e7ab65e3ab3836e60934bba5a16f58c0e8a66fe000`
입니다. PR·main CI와 Vercel production READY, 공개 Markdown preview,
snapshot의 manifest·JSON 일치, 공개 URL 소비자 설치·typecheck·build를
확인했습니다. 로컬 package 테스트·typecheck·build·release 검사와
92개 item 전체 소비자 typecheck·build·브라우저 로딩도 통과했습니다.
상세 범위는
[Markdown 기록](component-markdown-2026-09-29.md)을 참고하세요.
공급·품질 조건 5/10, 전체 goal의 관리용 추정 약 70%입니다. 이전
미공개 draft snapshot 네 디렉터리는 계속 untracked로 둡니다.

2026-09-29 작업 마감: `DateRangeFilter` 후보를 현재 코드와 문서 preview로
검토해 기존 `DateRangePicker`·`FilterBar` 조합으로 판정했습니다. 새
component나 registry item은 추가하지 않았습니다. 두 component를 결합한
설치 예시와 기간 preset의 기준일·시간대 동작은 아직 검증하지
않았습니다. 이번 마감은 새 릴리스가 아닙니다. 89개 component·91개
item, 공급·품질 조건 5/10, 전체 goal의 관리용 추정 약 70%입니다.
미공개 draft snapshot 네 디렉터리는 untracked로 두었습니다.

2026-09-29: [PR #3](https://github.com/pydemia/ui/pull/3)에서 registry
소비자 고지의 provenance 링크를 `a84b26f` commit으로 고정하고
SHA-256 검사를 추가했습니다. 병합 커밋 `dd29b56`의 CI와 Vercel
production 배포가 통과했습니다. 현재 snapshot은
`sha256-d6ac442e615afdf7bda064ed424685038b48ac2ff063bc5726e354494ba29fee`
입니다. build·typecheck·패키지 테스트 48개·release 검사가 통과했고
새 ID의 공개 Button 설치·MIT 고지·소비자 typecheck·build도
확인했습니다.
[기록](component-provenance-pin-2026-09-29.md)을 먼저 읽으세요.
과거 snapshot의 `main` 링크와 rollback 문제는 남아 있어 조건 5/10,
전체 goal의 관리용 추정 약 70%입니다.

2026-09-29 후속 검토: [PR #2](https://github.com/pydemia/ui/pull/2)를
`main`에 병합했고, Verify UI CI와 Vercel production 배포가
통과했습니다. 문서 설치 명령 19개, DataChart·DataTable 경계 동작,
CI의 untracked 생성 파일 검사를 수정했습니다. 현재 snapshot은
`sha256-a3db94852dbdea79f551fa350fdf314cbf43b274b235fb76fb313a1008489a28`
입니다. 로컬 build·typecheck·패키지 테스트 48개·registry release
검사와 공개 Sidebar·AppShell 설치 후 소비자 typecheck·build가
통과했습니다. [후속 검토](component-followup-review-2026-09-29.md)를
먼저 읽으세요. rollback 시 신규 snapshot 주소가 사라질 수 있어
불변 주소 조건을 미완료로 돌렸습니다. 공급·품질 조건 **5/10**,
goal 관리용 추정 **약 70%**입니다. 두 미공개 draft snapshot은
untracked이며 일괄 `git add`에 포함하지 마세요.

2026-09-29 production 배포: PR #1을 `main`에 병합한 커밋은 `092b748`이고
Vercel production은 READY입니다. `main` push CI와 공개 URL의 현재·이전
snapshot CLI 설치, 소비자 typecheck·build를 확인했습니다. 89개
component·91개 registry item, 공급·품질 조건 6/10, 관리용 goal 추정
약 75%입니다. [배포·미검증 기록](component-production-release-2026-09-29.md)을
먼저 읽으세요. 독립 review와 실제 보조기술·touch·drag/drop·다른 시간대
검사는 계속 남아 있습니다. 두 미공개 draft snapshot은 untracked이며
일괄 `git add`에 포함하지 마세요.

2026-09-29 작업 정리: [PR #1](https://github.com/pydemia/ui/pull/1)의
코드·CI 변경 커밋 `2b41cfe`에 대한
[GitHub Actions run](https://github.com/pydemia/ui/actions/runs/36572361755)은
성공했습니다. PR은 draft·미병합이고 제출된 review나 review thread가
없습니다. production의 현재 snapshot 공개 설치는 확인하지 못했습니다.
다음 작업에서는 [진행률 기록](goal-progress-2026-09-29.md)의 약 70%를
관리용 추정으로만 취급하고 [로드맵](component-roadmap.md)의 미완료
공급 조건을 먼저 확인하세요. 작업 트리의 두 미공개 draft snapshot은
untracked 상태로 남겨 두었으므로 일괄 `git add`에 포함하지 마세요.

2026-09-29: 현재 registry ID를 빌드 내용에서 계산하는
`npm run registry:release-check` 기본 동작을 추가했습니다. ID를 명시하는
기존 방식도 유지하며 fixture에서 현재·변경·게시 JSON 누락을 재검사했습니다.
`.github/workflows/verify.yml`은 PR과 `main` push에서 Node 24로
typecheck, package 테스트, build, 현재 snapshot 검사, 생성된 `docs/`
diff를 확인합니다. 로컬 검사와 PR #1의
[GitHub Actions run](https://github.com/pydemia/ui/actions/runs/36572011594)이
통과했습니다. 단계별 범위는
[CI 기록](component-ci-gate-2026-09-29.md)에 있습니다.

2026-09-29: draft PR 검토 중 DataChart의 유한한 양·음 극값에서 SVG 좌표가
`NaN`이 되는 문제를 고쳤습니다. 현재 새 내용 해시 후보는
`sha256-48f182bbf4fafa4e209bb89acebf7e77b722f6aac842e1a3c90d974399d9ac93`이며
처음 PR 후보 ID는 보존했습니다. package 테스트 46/46, typecheck,
build, `registry:check`, 새 ID의 `registry:release-check`가 커밋 파일만
복원한 환경에서 통과했습니다. 수정은 `d6713b4`·`9195662`로 PR #1에
push했습니다.
[검토 기록](component-release-review-2026-09-29.md)에 변경 범위를
남겼습니다. 공개 URL 설치와 실제 보조기술·touch 검사는 남았습니다.

2026-09-29: 변경안을 [draft PR #1](https://github.com/pydemia/ui/pull/1)로
열었습니다. head `193d98c`의 Vercel preview는 READY이고 인증된
브라우저에서 89개 목록과 Navigation variant 전환을 확인했습니다.
preview registry JSON은 인증 302, 현재 production의 새 snapshot은
404여서 공개 URL 소비자 설치는 아직 미검증입니다.
[PR·preview 기록](component-release-review-2026-09-29.md)을 참고하세요.
독립 검토 후 공개 배포와 설치 검증이 남았습니다.

2026-09-29: `codex/ui-component-release`에서 확장안을 세 커밋으로
정리했습니다. 깨끗한 Git archive 체크아웃에서 `npm ci`, build,
typecheck, package 테스트 45개, `registry:check`, 현재 내용 해시 ID의
`registry:release-check`가 통과했습니다. Windows ZIP 복원 시 snapshot
JSON의 줄바꿈 변환으로 검사에 실패한 뒤 `.gitattributes`로 LF를 고정하고
재검사했습니다. 미공개 이전 draft snapshot 두 개는 커밋하지 않았습니다.
작업 커밋은 `origin/codex/ui-component-release`로 push했습니다. 현재
head와 배포 상태, 검토 범위는
[릴리스 검토 기록](component-release-review-2026-09-29.md)에 있습니다.
대규모 변경의 독립 검토, 공개 URL 설치와 배포는 남아 있으며 89개
component·91개 registry item, 공급·품질 조건 5/10, 관리용 추정 약 70%입니다.

2026-09-29: 릴리스 후보 ID가 현재 빌드의 registry JSON과 일치하는지
확인하는 `npm run registry:release-check -- <ID>`를 추가했습니다.
`registry:check` 이후 현재 91개 item의 내용 해시, 선택한 snapshot,
`docs/r/`의 최신 JSON을 대조합니다. 회귀 시험에서 현재 item 변경과
게시용 최신 JSON 누락을 각각 탐지했습니다. README에 릴리스 검사
순서를, `CHANGELOG.md`에 미공개 변경을 기록했습니다. 현 로컬 ID
`sha256-a1cd11bae6654a55136729439cd7b437a507d59896271b7c0950745a9e61bf21`
검사는 통과했습니다. [기록](component-release-check-2026-09-29.md)에
검증과 미완료 범위를 남겼습니다. component·item 89개·91개, 공급·품질
조건 5/10, goal 추정 약 70%는 그대로입니다. 공개 URL 설치·실제
릴리스는 확인하지 않았습니다.

2026-09-29: `Navigation`에 전역 링크 밑줄형과 측면 링크 채움형을
추가했습니다. 기본 표면형·선형은 유지합니다. 문서 preview의 전환 버튼,
사용 코드, public type export와 registry 소스를 갱신했습니다. 문서의
전역 `a` 색상 규칙을 base layer로 옮겨 component의 현재 페이지 색상이
적용되게 했습니다. package 45개 테스트, 저장소 typecheck·build·
registry:check와 브라우저의 밝은·어두운 모드 계산 색상, 별도 소비자의
registry 갱신·typecheck·build를 확인했습니다. 새 로컬 snapshot ID는
`sha256-a1cd11bae6654a55136729439cd7b437a507d59896271b7c0950745a9e61bf21`
입니다. [기록](component-navigation-variants-2026-09-29.md)에 검사와
미검증 범위를 남겼습니다. 수량 89개·91개, 공급 조건 5/10, goal의
관리용 추정 약 70%는 그대로입니다. 공개 배포는 확인하지 않았습니다.

2026-09-29: registry item의 TypeScript import를 metadata의 직접
의존성과 비교하는 검사를 추가했습니다. `pyd-search-input`과
`pyd-number-input`에 빠져 있던 `pyd-utils` 직접 의존성을 보완했고,
현재 91개 item의 정적 import 선언 검사가 통과합니다. 변경된 item을
포함한 새 로컬 snapshot ID는
`sha256-9f61dbbe414ff6749e1f47757a9f17baceb35a0b2b4826f1d6a4d390ca168555`
입니다. 이전 snapshot은 보존했습니다. build·typecheck·registry:check·
diff 검사가 통과했으며, 이번 metadata 변경의 개별 CLI 설치와 공개
snapshot URL 설치는 미검증입니다.
[검증 기록](component-registry-import-audit-2026-09-29.md)을 참고하세요.
89개 component·91개 item, 공급·품질 조건 5/10, 전체 goal의 관리용
추정 약 70%는 변하지 않았습니다.

2026-09-29: 직전 공개 40개 registry item을 설치한 별도 소비자를 현재
91개 item으로 갱신했습니다. 93개 파일 일치·typecheck·전체 모듈
build·Chromium 로딩을 확인했고, Badge·Button 수정 파일의 충돌과
Badge 변경 재적용도 시험했습니다. [기록](component-registry-upgrade-2026-09-29.md)에
fixture와 미검증 범위가 있습니다. 공급·품질 조건은 **5/10**으로
갱신했습니다. 로컬 **89개 component·91개 item**이므로 약 100개 규모
비율 89%와 조건 50%를 같은 비중으로 본 goal 관리용 추정은
**약 70%**입니다. 현재 snapshot 공개 설치와 릴리스는 남았습니다.

2026-09-29: 현재 91개 registry item의 내용 해시 snapshot을
`registry/releases/`에 만들고 빌드 결과 `docs/r/releases/`와 동일한지
검사했습니다. 내부 의존성은 같은 snapshot ID를 가리킵니다. 로컬
HTTP 200, typecheck·build·registry:check와 변조·새 ID 회귀 시험을
확인했습니다. [기록](component-registry-release-2026-09-29.md)에 ID와
미검증 범위를 남겼습니다. 로컬 **89개 component·91개 item**, 공급·
품질 조건 **4/10**, goal 관리용 추정 **약 65%**입니다. 공개 URL 설치,
이전 소비자 갱신, commit·push·배포는 확인하지 않았습니다.

2026-09-29: AppShell의 floating 도움말 조합을 수정했습니다. 도움말을
열어도 bubble을 유지하고 panel의 표시 상태를 연결했으며 Escape·닫기
버튼에서 bubble로 focus가 돌아옵니다. 문서 Usage 코드와 Operations
workspace에도 같은 동작을 적용했습니다. typecheck·build·registry:check,
89개 catalog 사용 코드의 package·registry 소비자 typecheck와 Chromium
pointer·keyboard 동작을 확인했습니다. component·item 수는
**89개·91개**, 공급·품질 조건은 **4/10**, 전체 goal 관리용 추정은
**약 65%**로 유지합니다. [검증 기록](component-floating-help-2026-09-29.md)에
미검증 항목을 남겼습니다. 현재 변경은 공개 배포하지 않았습니다.

2026-09-29: 문서 사용 코드 89개를 현재 package tarball과 91개 item을
설치한 registry 소스 경로에서 각각 독립 TSX로 typecheck했습니다.
나란한 JSX 때문에 복사 시 문법 오류가 나던 20개 예시를 fragment로
수정하고 `registry:check`에 TSX 구문 검사를 추가했습니다. 저장소
typecheck·build·registry:check와 Button·DataChart 문서 표시를
확인했습니다. 로컬 **89개 component·91개 registry item**, 공급·품질
조건 **4/10**, goal 관리용 추정 **약 65%**입니다.
[검증 기록](component-catalog-usage-2026-09-29.md)에 범위와 미검증
항목을 남겼습니다. 현재 변경의 commit·push·공개 배포는 확인하지
않았습니다.

2026-09-29: AI 응답의 출처 목록 `CitationList`를 프로젝트 소유 코드로
추가했습니다. 로컬 **89개 component·91개 registry item**, 공급·품질
조건 **4/10**, goal 관리용 추정 **약 65%**입니다. package 44개 테스트,
typecheck·build·registry:check, 문서의 pointer·Enter·390px·light/dark,
새 소비자 설치·typecheck·build·Chromium을 확인했습니다.
현재 91개 item의 별도 동시 설치에서도 93개 파일 일치·typecheck·
build·208개 export 브라우저 로딩을 확인했습니다.
[구현·검증 기록](component-citation-list-2026-09-29.md)에 upstream
revision·LICENSE·의존성과 미검증 항목을 남겼습니다. 현재 변경의
commit·push·공개 배포는 확인하지 않았습니다.

2026-09-29: `SplitButton` 후보는 기존 `ButtonGroup`·`Button`·
`DropdownMenu`의 설치 가능한 조합으로 마무리했습니다. 문서 preview와
사용 코드의 기본 실행·대체 메뉴를 Chromium과 90개 item 소비자에서
확인했습니다. 새 component/item은 없어 **88개/90개**, 공급·품질
조건 **4/10**, 전체 goal 관리용 추정 **약 65%**입니다. 검사 범위와
미검증 항목은 [조합 기록](component-split-button-recipe-2026-09-29.md)에
있습니다. 현재 변경의 commit·push·공개 배포는 확인하지 않았습니다.

2026-09-29: form 값을 제출하는 `SegmentedControl`을 프로젝트 소유
native radio로 추가했습니다. 88개 component·90개 registry item입니다.
새 item의 click·방향키·제출, 밝은/어두운 모드·390px 화면과 개별
소비자 설치를 확인했습니다. 현재 90개 item을 새 소비자에 함께
설치해 92개 파일 일치·typecheck·build·Chromium 로딩도 확인했습니다.
[구현·검증 기록](component-segmented-control-2026-09-29.md)에 범위와
미검증 항목이 있습니다. 공급·품질 조건 4/10, 전체 goal 관리용
추정 약 65%는 유지합니다. 현재 변경의 commit·push·공개 배포는
확인하지 않았습니다.

2026-09-29: 기존 Dropzone·Calendar·Slider·Avatar의 문서 preview를
확장하고 Chromium에서 파일 선택·거부, 기간 부분/완료 선택,
두 thumb 키보드 변경, 이미지 로드·fallback을 확인했습니다.
typecheck·build·registry:check와 diff 검사도 통과했습니다. 실제
drag/drop·touch·screen reader·다른 호스트 시간대는 남아 있습니다.
[상호작용 재검사 기록](component-foundation-interactions-2026-09-29.md)에
결과가 있습니다. 87개 component·89개 registry item, 공급·품질 조건
4/10, 전체 goal 관리용 추정 약 65%는 그대로입니다. 이번 변경의
commit·push·공개 배포는 확인하지 않았습니다.

2026-09-29: 기존 `Navigation` item에 `BottomNav`·`BottomNavLink`를
추가했습니다. 주요 목적지의 하단 배치, 항상 보이는 이름과
`aria-current`를 문서 preview에서 확인했습니다. 390px Chromium,
격리 소비자 설치·typecheck·build와 저장소 검사 결과는
[하단 탐색 기록](component-bottom-navigation-2026-09-29.md)에 있습니다.
87개 component·89개 registry item과 공급·품질 조건 4/10은 그대로여서
전체 goal 관리용 추정치도 약 65%입니다. 실제 screen reader·touch,
5개 이상 목적지 scroll, 라우터 연동과 공개 배포는 미검증입니다.
현재 변경의 commit·push·공개 배포는 확인하지 않았습니다.

2026-09-29: shadcn/ui source를 수정한 registry item 27개를 각각 새
소비자에 `shadcn@4.21.0 add`로 설치했습니다. 설치된 MIT 고지
27개와 직접 component 소스 27개가 저장소 원본과 일치했습니다.
로컬 작업 트리는 87개 component·89개 registry item이고 공급·품질
조건은 4/10입니다. 전체 goal의 관리용 추정치는 약 65%이며 공개
배포 준비율은 아닙니다. 대상·fixture·미검증 항목은
[item별 고지 기록](component-license-notice-individual-2026-09-29.md)과
[진행률](goal-progress-2026-09-29.md)에 있습니다. 현재 변경의
commit·push·공개 배포는 확인하지 않았습니다.

2026-09-29: 현재 89개 registry item을 `shadcn@4.21.0`으로 새
소비자에 동시 설치했습니다. 원본 91개 파일 일치, 87개 catalog 사용
코드의 package tarball·registry 직접 import typecheck, 전체 모듈
build·Chromium 로딩을 확인했습니다. 공급·품질 조건은 3/10으로
늘었고 전체 goal 관리용 추정치는 약 60%입니다. CLI 4.0.0과 4.21.0의
설치 경로 차이, fixture와 미검증 범위는
[공급 경로 검사](component-catalog-supply-2026-09-29.md)에 있습니다.
현재 변경의 commit·push·공개 배포는 확인하지 않았습니다.

2026-09-29: 기존 `Badge`에 네 가지 token 기반 variant를 추가했습니다.
Operations workspace의 상태 텍스트와 함께 적용했고 독립 소비자에
Badge·utils·tokens를 설치해 원본 일치·typecheck·build를 확인했습니다.
로컬 component 87개·registry item 89개, goal 관리용 추정 약 50%는
변경되지 않습니다. 검증과 남은 범위는
[Badge 기록](component-badge-variants-2026-09-29.md)에 있습니다.

2026-09-29: Data display에 `DataList`를 추가했습니다. 로컬 작업 트리는
87개 component·89개 registry item입니다. native `dl`의 행·그리드,
`null` 값과 빈 목록을 구분합니다. 패키지 테스트, 문서 Chromium의
2열 전환과 Operations workspace 기간 갱신, 독립 소비자 registry
설치·typecheck·build를 확인했습니다. 전체 goal의 관리용 추정치는
약 50%입니다. 검사·미검증 범위는
[DataList 기록](component-data-list-2026-09-29.md)과
[진행률 기록](goal-progress-2026-09-29.md)에 있습니다. 현재 89개
item 전체 동시 설치와 공개 배포는 확인하지 않았습니다.

2026-09-29: Developer tools에 `CodeBlock`을 추가했습니다. 로컬
작업 트리는 86개 component·88개 registry item입니다. 단일 코드의
언어·줄바꿈·복사 상태를 문서 preview와 격리 소비자에서 확인했습니다.
검증과 미검증 범위는
[CodeBlock 기록](component-code-block-2026-09-29.md)에 있습니다.
전체 goal의 관리용 약 50% 추정치는 그대로이며 현재 변경의 공개
배포는 확인하지 않았습니다.

2026-09-29: 현재 87개 registry item을 새 소비자에 동시에 설치했습니다.
89개 파일 원본 일치, 87개 모듈 typecheck·build와 production audit
0건을 확인했습니다. 기본 공개 URL 빌드와 `registry:check`도
통과했습니다. 이번 fixture의 브라우저 실행과 갱신 충돌·복구는
검사하지 않았습니다. 범위와 경로는
[전체 설치 기록](component-full-registry-consumer-2026-09-29.md)에 있습니다.
component 수는 85개이며 [진행률 기록](goal-progress-2026-09-29.md)의
관리용 약 50% 추정치는 그대로입니다.

2026-09-29: `DateTimePicker`를 마무리했습니다. 로컬 작업 트리는 85개
component·87개 registry item입니다. 날짜·시각의 부분 선택을 보존하고
완성 시 로컬 날짜시각과 IANA 시간대를 한 쌍으로 제출합니다. 패키지
테스트 28개, 격리 소비자 설치·typecheck·build, 로컬 Chromium의
날짜/시각 양쪽 선택 순서와 제출을 확인했습니다. 저장소 최종
typecheck·build·registry:check 결과와 미검증 범위는
[구현 기록](component-date-time-picker-2026-09-29.md)에 있습니다.
[진행률 기록](goal-progress-2026-09-29.md)의 전체 goal 관리용 추정치는
약 50%입니다. 현재 대규모 변경은 미배포 상태입니다.

2026-09-29: Operations workspace의 390px 검사에서 DataTable 열 압축을
발견해 표 내부 가로 scroll과 이름 있는 keyboard focus 영역으로
고쳤습니다. 문서 개발 서버의 Registry review iframe 경로와 HMR root
중복 경고도 고쳤습니다. 25개 패키지 테스트, typecheck·build·
registry:check와 Chromium 결과·미검증 범위는
[좁은 표 기록](component-data-table-responsive-2026-09-29.md)에 있습니다.
84개 component·86개 item, goal 관리용 약 50% 추정은 그대로입니다.


2026-09-29: 문서에 Operations workspace 조합 예시를 추가했습니다.
84개 component·86개 registry item 수는 그대로입니다. 기간 전환,
검색·필터·선택 재실행·로그·도움말을 Chromium에서 확인했고,
typecheck·build·registry:check가 통과했습니다. 개발 서버 HMR 오류와
미검증 범위는 [분석 예시 기록](component-analytics-workspace-2026-09-29.md)에
남겼습니다. 전체 goal의 관리용 추정 완료율은 여전히 약 50%입니다.


2026-09-29: 기존 `MetricCard`에 `compact`·`featured` 형태를 추가하고
기본 배치를 유지했습니다. 문서의 세 형태 preview·사용 코드, 새 소비자
설치·typecheck·build·light/dark 브라우저 동작을 확인했습니다.
84개 component·86개 registry item으로 총수는 같습니다. 출처와
미검증 범위는 [MetricCard 기록](component-metric-card-variants-2026-09-29.md)에
남겼습니다. 기본 공개 URL 빌드와 `registry:check`가 통과했으며 공개
배포는 확인하지 않았습니다.

2026-09-29: `AppShell`의 floating panel·bubble과 `Spinner`의 5가지
형태가 이미 있는 것을 확인했습니다. 현재 catalog 사용 코드 84개를
package tarball을 설치한 소비자에서 typecheck했고, 84개 원본·public
export·registry·catalog의 1:1 대응을 `registry:check`에 추가해
통과했습니다. 범위와 fixture는
[문서 사용 코드 검사](component-catalog-consumer-2026-09-29.md)에
기록했습니다. review 가능한 변경 묶음 정리와 실제 상호작용 검사는
남았습니다.

2026-09-29: 현재 86개 registry item을 새 Vite 소비자에 동시에
설치했습니다. 88개 파일의 원본 일치, 86개 모듈의 typecheck·build·
브라우저 로딩(206개 값 export, console error 0건), production audit
0건을 확인했습니다. 기본 공개 URL 빌드로 복원하고 저장소 typecheck와
`registry:check`도 통과했습니다. 검사 범위와 미검증 항목은
[전체 소비자 기록](component-full-registry-consumer-2026-09-29.md)에,
goal의 관리용 완료율 추정과 근거는
[진행 상태](goal-progress-2026-09-29.md)에 남겼습니다. 현재 변경의
commit·push·공개 배포는 확인하지 않았습니다.

2026-09-29: Actions에 `ButtonGroup`을 추가해 로컬 작업 트리는 84개
component, 86개 registry item입니다. 사용처 판정, 공식 source·LICENSE,
문서 preview, 격리 소비자 설치와 미검증 범위는
[ButtonGroup 기록](component-button-group-2026-09-29.md)에 남겼습니다.
기본 공개 URL로 빌드를 복원했고 `registry:check`도 통과했습니다.

2026-09-29: 사용자 요청에 따라 현재 목표의 수량 기준과 공급 조건을
[진행 상태](goal-progress-2026-09-29.md)에 정리했습니다. 83개 component는
100개 규모 기준의 83%이나 목표 전체 완료율은 아닙니다. 로고의 사각
border는 현재 로컬 계산 스타일과 화면에서 재현되지 않아 추가 수정하지
않았습니다.

2026-09-29: `AvatarGroup`을 추가해 로컬 작업 트리는 83개 component,
85개 registry item입니다. 이름 있는 목록, 남은 인원 요약, 빈 상태와
별도 소비자 설치·typecheck·build를 확인했습니다. 검증과 남은 범위는
[AvatarGroup 기록](component-avatar-group-2026-09-29.md)에 있습니다.
85개 전체 동시 재설치는 하지 않았고 공개 배포도 확인하지 않았습니다.

2026-09-29: `PageHeader`에 compact·기본·hero 크기를 추가했습니다.
기존 기본 스타일과 heading 계층 선택은 유지합니다. 문서 preview의
크기 전환, 새 소비자 설치·typecheck·build, 밝은·어두운 브라우저
표시와 미검증 범위는
[PageHeader 기록](component-page-header-sizes-2026-09-29.md)에
남겼습니다. component 82개, registry item 84개로 총수는 같습니다.
기본 공개 URL 빌드와 `registry:check`를 다시 통과했습니다.

2026-09-29: 현재 84개 registry item 전체를 새 Vite 소비자에 한 번에
설치했습니다. 86개 파일이 원본과 일치했고 84개 모듈의 typecheck·build·
브라우저 로딩(203개 값 export, console error 0건)이 통과했습니다.
기본 공개 URL 빌드로 복원하고 저장소 typecheck·registry:check도
통과했습니다. 같은 소비자에 현재 tarball을 설치해 catalog 사용 코드
82개의 typecheck도 통과했습니다. 개별 설치, 갱신 충돌과 전체
상호작용은 미검증입니다. 범위와 fixture는
[전체 registry 소비자 기록](component-full-registry-consumer-2026-09-29.md)에
남겼습니다. 로고 테두리 위치 확인 요청도 별도로 대기 중입니다.

2026-09-29: Framework에 `ScrollArea`를 추가했습니다. 로컬 작업 트리는
82개 component, 84개 registry item입니다. 세로·가로 scroll, focus,
격리 소비자 설치와 MIT 고지 전달, 미검증 항목은
[ScrollArea 기록](component-scroll-area-2026-09-29.md)에 남겼습니다.
typecheck·build·registry:check·패키지 테스트와 소비자 typecheck·build가
통과했습니다. 공개 배포는 확인하지 않았습니다.

2026-09-29: Date & time에 `TimePicker`를 추가했습니다. 로컬 작업 트리는
81개 component, 83개 registry item입니다. 시·분의 native 입력과
12/24시간 표시, `HH:mm` form 값, 문서와 격리 소비자 검증은
[TimePicker 기록](component-time-picker-2026-09-29.md)에 남겼습니다.
typecheck·build·registry:check·패키지 테스트와 소비자 typecheck·build가
통과했습니다. 좁은 화면·실제 보조기술은 검증하지 않았고 공개 배포도
확인하지 않았습니다. 상단 로고의 사각 테두리는 현재 로컬 화면과 계산된
스타일에서 보이지 않았으며 추가 CSS 변경은 없습니다.

2026-09-29: `DataChart`에 `stacked-area`를 추가했습니다. 로컬 작업
트리는 80개 component, 82개 registry item입니다. 결측 범주 처리,
합계, 문서와 격리 소비자 검증, 미검증 항목은
[누적 영역 기록](component-data-chart-stacked-area-2026-09-29.md)에
남겼습니다. typecheck·build·registry:check·패키지 테스트와 소비자
typecheck·build가 통과했습니다. 공개 배포는 확인하지 않았습니다.


2026-09-29: 사이트 상단 로고의 사각 테두리는 키보드 초점 상태에서
공통 `focus-visible` outline으로 재현했습니다. 로고 링크의 초점
표시를 아래쪽 선으로 바꾸고 밝은·어두운 로컬 화면에서 확인했습니다.
[flat 로고 기록](brand-logo-flat-2026-09-29.md)에 원인과 변경 범위를
남겼습니다. 공개 배포는 확인하지 않았습니다.

2026-09-29: Inputs에 `Rating`을 추가했습니다. 로컬 작업 트리는 80개
component, 82개 registry item입니다. native radio의 키보드 선택,
form 제출, 별점·segment 표시와 읽기 전용 점수, 소비자 설치 및
미검증 범위는 [Rating 기록](component-rating-2026-09-29.md)에
남겼습니다. typecheck, build, registry:check, 패키지 테스트와
소비자 typecheck·build가 통과했습니다. push·배포는 하지 않았습니다.

2026-09-29: Inputs에 `PinInput`을 추가했습니다. 로컬 작업 트리는 79개
component, 81개 registry item입니다. native 단일 입력의 붙여넣기·삭제·
완성 코드의 자리 교체·form 유효성, 별도 소비자 설치와 미검증 범위는
[PinInput 기록](component-pin-input-2026-09-29.md)에 남겼습니다.
`npm test -w @pydemia/ui`, typecheck, build, registry:check와 별도
소비자 typecheck·build가 통과했습니다. 기본 공개 URL 빌드로
복원했으며 push·배포는 하지 않았습니다.

앞선 정적 화면 조사에서는 로고 이미지와 링크의 border가 `0px`라
사각 테두리를 찾지 못했습니다. 이후 키보드 초점 상태에서 원인을
재현하고 위의 링크 초점 스타일을 수정했습니다.

2026-09-29: Actions에 `ToggleGroup`을 추가했습니다. 현재 로컬 작업
트리는 78개 component, 80개 registry item입니다. 공식 source·license,
문서 preview, 격리 소비자 설치와 브라우저 검증은
[ToggleGroup 기록](component-toggle-group-2026-09-29.md)에 남깁니다.
push·배포는 하지 않았습니다. 상단 로고의 사각 테두리는 로컬 계산값에서
확인되지 않아 제거할 정확한 위치를 사용자에게 요청한 상태입니다.

2026-09-29: DataChart에 선택 범주의 값을 확인하는 `inspectable` 옵션을
추가했습니다. 포인터·native select, 결측값, 다중 계열과 새 소비자
설치 결과, 미검증 범위는
[DataChart 구간 기록](component-data-chart-inspector-2026-09-29.md)에
있습니다. 총수는 77개 component, 79개 registry item으로 같고
기본 공개 URL 빌드로 복원했습니다. push·배포는 하지 않았습니다.

2026-09-29: 기존 Toast에 FIFO queue, 선택적 중복 억제와 표시 한도를
추가했습니다. 단일 controlled API는 유지합니다. 문서 preview·새
소비자 설치와 키보드 닫기, 미검증 범위는
[Toast 대기열 기록](component-toast-queue-2026-09-29.md)에 있습니다.
총수는 77개 component, 79개 registry item이며 로컬 변경입니다.
기본 공개 URL로 빌드를 복원했고 push·배포는 하지 않았습니다.

2026-09-29: Overlays에 HoverCard를 추가했습니다. 로컬 작업 트리는
77개 component, 79개 registry item입니다. 공식 source·license,
키보드·pointer 동작과 새 소비자 격리 설치, 미검증 범위는
[HoverCard 기록](component-hover-card-2026-09-29.md)에 있습니다.
기본 공개 URL로 빌드를 복원했고 push·배포는 하지 않았습니다.
사이트 로고 사각 테두리 요청은 현재 로컬 CSS와 SVG에서 해당 선이
없어 지칭한 부분을 사용자에게 확인 중입니다.

2026-09-29: 새 Vite 소비자에 78개 registry item을 한 번에 설치해
80개 파일의 원본 일치, 78개 모듈의 import·typecheck·build·브라우저
로딩을 확인했습니다. `registry:check`는 생성 JSON의 소스 일치도
검사합니다. 개별 item 격리 설치와 전체 상호작용은 남았습니다.
[전체 설치 기록](component-full-registry-consumer-2026-09-29.md)에
검사 범위가 있습니다. 기본 공개 URL 빌드로 복원했고 아직 배포하지
않았습니다. 이어서 catalog·index·registry의 component ID 76개가
대응하는지 확인했고, package tarball을 설치한 소비자에서 문서 사용
코드 76개를 typecheck했습니다.

2026-09-29: 사이트 로고 박스의 테두리 요청을 다시 조사했습니다.
로컬 문서 사이트의 로고·링크·헤더에는 CSS border가 없고 SVG에도
사각형 경로가 없습니다. 로고 도형의 외곽을 뜻하는지 확인 요청한
상태입니다. [flat 로고 기록](brand-logo-flat-2026-09-29.md)에
계산된 스타일과 판단 근거를 남겼습니다.

2026-09-29: `DataChart`에 누적 막대 variant를 추가했습니다. 양수·음수
분리 누적, 결측값 표, 소비자 설치·브라우저 검증과 미검증 범위는
[DataChart 기록](component-data-chart-stacked-2026-09-29.md)에 있습니다.
총수는 76개 component, 78개 registry item으로 같습니다. 로컬
변경이며 공개 배포는 확인하지 않았습니다.

2026-09-29: Navigation 범주에 `NavigationMenu`를 추가해 로컬 작업
트리는 76개 component, 78개 registry item입니다. 그룹 링크,
키보드 조작, 소비자 설치와 미검증 범위는
[NavigationMenu 기록](component-navigation-menu-2026-09-29.md)에
남겼습니다. 로컬 변경이며 공개 배포는 확인하지 않았습니다.

2026-09-29: Spinner를 icon·ring·dots·bars·orbit 다섯 형태로
확장했습니다. 총수는 75개 component, 77개 registry item으로
같습니다. 문서 preview·소비자 설치·빌드와 남은 검증 범위는
[Spinner 기록](component-spinner-variants-2026-09-29.md)에 있습니다.
로컬 변경이며 공개 배포는 확인하지 않았습니다.

2026-09-29: 사이트 상단 로고의 사각 테두리 요청에 맞춰 헤더에 남아 있던
아래쪽 1px 구분선을 제거했습니다. 로고 이미지와 링크는 이미 border가
없었습니다. 로컬 화면·문서 앱 빌드 검증 결과는
[flat 로고 작업](brand-logo-flat-2026-09-29.md)에 기록했습니다.
공개 배포는 확인하지 않았습니다.

2026-09-29: Inputs 범주에 `TagsInput`을 추가해 로컬 작업 트리는
75개 component, 77개 registry item입니다. 추가·삭제·중복·개수 제한,
반복 form 값과 미확정 draft의 제출 차단, 소비자 설치 결과를
[TagsInput 기록](component-tags-input-2026-09-29.md)에 남깁니다.
기존 `AppShell`이 좌우·하단·floating panel과 bubble을 이미
제공하므로 같은 역할의 item을 별도로 늘리지 않았습니다.
로컬 변경이며 공개 배포는 확인하지 않았습니다.

2026-09-29: Inputs 범주에 `NumberInput`을 추가해 로컬 작업 트리는
74개 component, 76개 registry item입니다. locale 숫자 표시, 범위,
키보드 조작과 native form 제출을 확인했습니다. 자세한 검증과 제한은
[NumberInput 기록](component-number-input-2026-09-29.md)에 남깁니다.
같은 날 Profile 예시 헤더의 사각형 `p` 로고를 flat SVG로 교체했습니다.
[flat 로고 작업](brand-logo-flat-2026-09-29.md)에 기록했습니다.
두 변경 모두 로컬 작업이며 공개 배포는 확인하지 않았습니다.

2026-09-29: Overlays 범주에 `ContextMenu`를 추가해 로컬 작업 트리는
73개 component, 75개 registry item입니다. 우클릭·Shift+F10,
submenu와 소비자 설치 결과, 미검증 범위는
[ContextMenu 기록](component-context-menu-2026-09-29.md)에 있습니다.
로컬 변경이며 공개 배포는 확인하지 않았습니다.

2026-09-29: Inputs 범주에 `SearchInput`을 추가해 로컬 작업 트리는
72개 component, 74개 registry item입니다. 검색 제출·초기화,
새 소비자 설치와 전이 MIT 고지 전달을 확인했습니다. 처음 설치할 때
기본 공개 URL이 이전 의존성으로 이어진 점과 미검증 범위는
[SearchInput 기록](component-search-input-2026-09-29.md)에 있습니다.
로컬 변경이며 공개 배포는 확인하지 않았습니다.

2026-09-29: Inputs 범주에 `ColorInput`을 추가해 로컬 작업 트리는
71개 component, 73개 registry item입니다. 문서 Colormap 편집기에
연결했고 새 소비자 설치·빌드·브라우저 동작을 확인했습니다. native
picker 등 미검증 범위는
[ColorInput 기록](component-color-input-2026-09-29.md)에 있습니다.
로컬 변경이며 공개 배포는 확인하지 않았습니다.

2026-09-29: 사이트 상단 로고의 사각 테두리 요청을 재확인했습니다.
로고 이미지·링크는 이미 border가 없었고, 헤더에서 테두리가 남은
테마 전환 버튼의 border를 제거했습니다. 로컬 화면과 계산된 스타일은
[flat 로고 작업](brand-logo-flat-2026-09-29.md)에 기록했습니다.

2026-09-29: Developer tools 범주에 `JsonViewer`를 추가해 로컬 작업
트리는 70개 component, 72개 registry item입니다. 중첩 탐색·항목별
추가 표시·복사와 새 소비자 설치, 미검증 범위는
[JsonViewer 기록](component-json-viewer-2026-09-29.md)에 있습니다.
로컬 변경이며 공개 배포는 확인하지 않았습니다.

2026-09-29: File & media 범주에 `Image`를 추가해 로컬 작업 트리는
69개 component, 71개 registry item입니다. 정상·누락·오류 상태와
소비자 설치, 검증하지 못한 범위는
[Image 기록](component-image-2026-09-29.md)에 있습니다.
로컬 변경이며 공개 배포는 확인하지 않았습니다.

같은 날 사이트 왼쪽 상단 로고의 사각 테두리 요청을 재확인했습니다.
로컬 밝은/어두운 모드에서 로고 이미지·링크·버전 표식의 계산된 border와
배경은 모두 0/투명입니다. 화면 상단에서 사각 테두리가 보이는 요소는
오른쪽 테마 전환 버튼입니다. 어느 요소를 지칭하는지 사용자에게
확인을 요청했고 답변을 기다리고 있습니다. 로고 CSS는 변경하지
않았습니다.

2026-09-29: Content 범주에 `Carousel`을 추가해 로컬 작업 트리는 68개
component, 70개 registry item입니다. 수동 이동·선택·card/plain과
소비자 설치 결과 및 미검증 범위는
[Carousel 기록](component-carousel-2026-09-29.md)에 있습니다.
로컬 변경이며 공개 배포는 확인하지 않았습니다.

2026-09-29: 사이트 상단 로고 링크와 이미지에 `border: 0`을 명시했습니다.
로컬 화면과 문서 앱 빌드를 확인했습니다. 변경 전 공개 사이트에도
시각적인 사각 테두리는 없었으며, 이번 CSS는 아직 게시하지 않았습니다.
기록은 [flat 로고 작업](brand-logo-flat-2026-09-29.md)에 있습니다.

2026-09-29: `DataChart`에 공통 범주의 다중 계열 선형·그룹 막대·영역
표현과 범례를 추가했습니다. 총수는 67개 component, 69개 registry
item으로 같습니다. API·설치·검증 범위는
[다중 계열 차트 기록](component-data-chart-multi-series-2026-09-29.md)에
있습니다. 로컬 변경이며 공개 배포는 확인하지 않았습니다.

2026-09-29: `FilterBar`를 추가해 로컬 작업 트리는 67개 component,
69개 registry item입니다. 적용·초기화와 새 소비자 설치 결과는
[분석 필터 기록](component-filter-bar-2026-09-29.md)에 있습니다.
로컬 변경이며 공개 배포는 확인하지 않았습니다.

2026-09-29: `Reasoning`과 `ToolCall`을 추가해 로컬 작업 트리는
66개 component, 68개 registry item입니다. AI 생성 과정과 도구
실행 상태의 구현·소비자 설치·미검증 범위는
[AI 작업 상태 기록](component-agent-workflow-2026-09-29.md)에 있습니다.
로컬 변경이며 공개 배포는 확인하지 않았습니다.

2026-09-29: `Conversation`을 추가해 로컬 작업 트리는 64개 component,
66개 registry item입니다. 새 메시지 위치·스크롤·입력·비움과 남은
검증 범위는 [대화 목록 기록](component-conversation-2026-09-29.md)에
있습니다. 로컬 변경이며 공개 배포는 확인하지 않았습니다.

같은 날 상단 로고의 사각 테두리 요청을 재확인했습니다. 로컬·새로 연
공개 사이트의 밝은 모드와 어두운 모드에서 로고 이미지와 링크의
계산된 border는 `0px`, 배경은 투명입니다. SVG에도 사각형 경로가
없습니다. 다른 요소를 지칭했을 가능성이 있어 화면 위치 확인을
요청했습니다. 추가 CSS 변경은 하지 않았습니다.

2026-09-29: 계층형 리소스 선택용 `Tree`를 추가해 현재 63개
component, 65개 registry item입니다. 방향키·이름 검색·선택·확장,
소비자 설치와 미검증 범위는
[Tree 기록](component-tree-2026-09-29.md)에 있습니다. 로컬 변경이며
공개 배포는 확인하지 않았습니다.

2026-09-29: `DateRangePicker`를 추가해 현재 62개 component,
64개 registry item입니다. 부분·완료 선택, 제한 날짜·기간, form 제출,
소비자 설치와 미검증 범위는
[기간 선택 기록](component-date-range-picker-2026-09-29.md)에 있습니다.
로컬 변경이며 공개 배포는 확인하지 않았습니다.

상단 로고의 border·흰 사각 배경 제거는 공개 사이트에서 다시 확인했습니다.
밝은 모드의 `.brand-mark`와 상위 링크의 계산된 border는 모두 `0px`,
이미지 배경은 투명합니다. 공개 사이트에는 기존 38개 component가
표시되므로 아래 component 확장은 아직 게시되지 않았습니다.

2026-09-29: shadcn/ui 기반 26개 registry item의 MIT 고지를 소비자
설치 파일로 전달하도록 수정했습니다. 직접·전이 설치와 빌드 결과,
남은 개별 설치 검사는
[registry 고지 전달 기록](registry-license-delivery-2026-09-29.md)에
있습니다. 이 변경은 로컬에만 있습니다. 상단 로고의 사각 테두리 제거는
별도 commit `bfec10d`로 공개 사이트에 게시됐습니다.

2026-09-29: `CommandPalette`를 추가해 현재 61개 component,
63개 registry item입니다. 단축키·검색·그룹·disabled·focus·소비자
설치와 미검증 범위는
[명령 팔레트 기록](component-command-palette-2026-09-29.md)에 있습니다.

2026-09-29: `MultiSelect`를 추가해 현재 60개 component,
62개 registry item입니다. 검색·다중 값 제출·선택 제거·필수값 검증과
소비자 설치 상태는
[다중 선택 기록](component-multi-select-2026-09-29.md)에 있습니다.

2026-09-29: `FileUpload`를 추가해 현재 59개 component,
61개 registry item입니다. 기존 `Dropzone`·`Progress`를 조합하며
전송은 소비자가 소유합니다. 동작·설치·미검증 범위는
[파일 전송 상태](component-file-upload-2026-09-29.md)에 기록했습니다.

2026-09-29: `Stepper`와 `Timeline`을 추가해 현재 58개 component,
60개 registry item입니다. 동작·소비자 설치·미검증 범위는
[단계·활동 표시](component-workflow-2026-09-29.md)에 기록했습니다.

2026-09-29: 접힘식·모바일 `Sidebar`를 추가했습니다. 현재 56개
component, 58개 registry item입니다. 반응형·키보드·소비자 검증과
미검증 범위는 [Sidebar](component-sidebar-2026-09-29.md)에 기록했습니다.

2026-09-29: `ResizablePanels`와 `Progress`의 원형 variant를
추가했습니다. 당시 55개 component, 57개 registry item이었습니다.
키보드·pointer·진행 상태 및 소비자 설치 확인은
[크기 조절 패널·원형 진행 표시](component-resizable-progress-2026-09-29.md)에
기록했습니다.

문서 사이트 상단 로고의 흰 사각 배경과 옆 버전 표식의 테두리를
제거했습니다. 밝은 모드와 어두운 모드의 표시 및 저장소 검증은
[flat 로고 기록](brand-logo-flat-2026-09-29.md)에 있습니다.

2026-09-29 현황: 로컬 작업 트리에 AppShell, Navigation, LogConsole,
Sparkline, PageHeader, ContentList, DataChart, Dashboard, Toast, Drawer,
Pagination, DataTable, DropdownMenu, PasswordInput, Combobox,
DonutChart, ResizablePanels, Sidebar, Stepper, Timeline, FileUpload,
MultiSelect, CommandPalette와
Spinner 변형을 추가했습니다.
DataChart에는 영역형, Progress에는 원형 variant도 있습니다. 현재
61개 component, 63개 registry item입니다.
작업·검증·미검증 범위는
[화면 골격 확장](component-expansion-2026-09-29.md)과
[차트·대시보드·알림](component-analytics-toast-2026-09-29.md)에 있습니다.
목록·패널 묶음은
[목록·패널 확장](component-list-drawer-2026-09-29.md)에 기록했습니다.
메뉴·입력·차트 변형은
[메뉴·입력·차트 확장](component-menu-input-chart-2026-09-29.md)에 있습니다.
검색 선택과 구성비 차트는
[Combobox·DonutChart](component-combobox-donut-2026-09-29.md)에 기록합니다.
아래 2026-09-28 기준 수치와 원격 배포 상태는 당시 기록입니다.

기준: 2026-09-28, `main`의 `b122cb6`에서 확장한 작업 트리. 새 세션에서는
먼저 최신 `main`과
`git status`를 확인하세요. 이 문서는 현재 prototype에서 다음 component를
편입하기 위한 작업 맥락이며, 최신 상태는 저장소의 코드와 metadata가 우선합니다.

세션 계획과 검토 기록은 `.worknotes/`에 보관합니다. 기록 위치와 지침 점검
결과는 [session-instructions-audit-2026-09-28.md](session-instructions-audit-2026-09-28.md)에
있습니다.

## 목표와 현재 범위

목표는 Mantine/MUI에 견줄 만한 component coverage를 점진적으로 확보하면서
shadcn/ui의 Open Code, source ownership, 디자인 자유도를 유지하는 것입니다.
외부 registry들을 runtime에 합치는 대신, 필요한 소스를 개별 검토하고
`@pydemia/ui`와 내부 shadcn registry에 정규화해 편입합니다. bulk import나
범용 추상화를 먼저 만들지 마세요.

현재 React 19, TypeScript, Tailwind CSS 4, Vite 7, npm workspaces를 사용합니다.
`components.json`은 shadcn `new-york`, `rsc: false`, CSS variables 설정입니다.
`@pydemia/ui`는 private workspace package이며 npm에 게시되지 않았습니다.

| 위치 | 내용 |
| --- | --- |
| `packages/ui/src/components/`, `index.ts` | 배포할 component 원본과 public export |
| `packages/ui/src/styles.css` | light/dark color, type, spacing, radius, border, shadow, focus, motion, density token |
| `registry.json` | shadcn item의 파일과 직접·registry 의존성 |
| `registry/provenance.json` | 출처, 고정 upstream revision, license, 의존성, profile, 접근성 상태 |
| `THIRD_PARTY_NOTICES.md` | 편입한 제3자 source의 notice |
| `apps/docs/src/catalog.tsx` | component별 preview, 설명, 사용 코드 |
| `apps/profile-demo` | foundation과 curated component를 함께 쓰는 예시 |
| `research/source-inventory.md` | MUI/Mantine taxonomy, source별 coverage·gap·license 조사 |
| `research/design-contract.md` | 첫 prototype의 시각·상호작용 결정 |
| `research/verification.md` | 실행한 검증과 미검증 항목 |

현재 40개 registry item은 `pyd-utils`, `pyd-tokens`와 38개
component입니다. Foundation
29개에 Origin UI의 AffixedInput, Kibo UI의 Snippet·Dropzone, AI Elements
기반 Message·PromptInput, Tremor를 참고한 원본 MetricCard가 포함됩니다.
이번 작업 트리에는 Selection의 Checkbox·NativeSelect·Switch·RadioGroup,
Overlays의 Dialog·Tooltip, Feedback의 Alert·Progress·Skeleton,
Inputs의 Textarea, Layout의 Card·Separator가 추가됐습니다.
이어 Accordion·Collapsible·Popover·AlertDialog, Avatar·Breadcrumb,
Empty·Spinner·Toggle·Slider도 편입했습니다.
빈 범주에서는 Date & time의 Calendar, Data & analytics의 MetricCard,
File & media의 Dropzone, AI & agent의 Message·PromptInput을 추가했습니다.
폼 입력 묶음의 Field·Select·DatePicker도 편입했습니다. `pyd-tokens`는
component 개수에 포함하지 않는 설치용 stylesheet item입니다.
게시된 문서 사이트는 <https://pydemia-ui.vercel.app/>, 조합 예시는
<https://pydemia-ui.vercel.app/examples/profile/>에서 볼 수 있습니다.
이번 로컬 변경의 원격 배포는 확인하지 않았습니다.

## 다음 편입 범위

추가 후보의 범주, 판정 기준, 소비자 설치와 품질 조건은
[`component-roadmap.md`](component-roadmap.md)에 정리했습니다.
현재 38개는 로컬 구현이며 안정적인 공급이 검증된 38개로
표현하지 마세요.

`research/source-inventory.md`의 gap을 기준으로 실제 사용처가 있는
component를 단계적으로 고르세요. Charts, Editor, Tree & hierarchy,
Workflow에는 아직 내부 구현이 없습니다. Date & time, File & media,
AI & agent에는 첫 항목만 편입한 상태입니다.
Selection, Overlays, Feedback에도 기능별 gap이 남아 있습니다. 의존성,
접근성, 문서 예시의 필요를 함께 검토하세요. 약 100개는 장기 기준점이며
숫자를 채우기 위한 중복 component를 만들지 않습니다.

shadcn/ui는 일반 foundation, Origin UI는 선택한 일반 UI 변형, Kibo UI는
특정 기능 component의 주력 source입니다. Tremor는 analytics 화면에,
AI Elements는 AI interface에 실제 요구가 생기면 item 단위로 확장합니다.
Magic UI, Motion Primitives, Cult UI, Aceternity UI는 visual/reference로만
취급합니다. 특히 Aceternity Pro 코드를 공개 registry로 재배포하지 마세요.

새 component마다 다음 순서로 작업하세요.

1. upstream 공식 docs, 동일 revision의 코드와 LICENSE 원문을 다시 확인하고
   직접·전이 의존성, 유지 상태, 키보드/focus/screen reader 동작을 평가합니다.
   기존 조사 날짜나 검색 결과만으로 license를 확정하지 않습니다.
2. 기존 API와 중복을 확인하고 `packages/ui/src/components/`에 필요한 코드만
   편입합니다. 색상·간격·radius·shadow·focus·motion은 공통 token을 사용하고,
   접근성에 필요한 semantics와 상태를 보존합니다.
3. `packages/ui/src/index.ts`, `registry.json`, `registry/provenance.json`,
   필요 시 `THIRD_PARTY_NOTICES.md`를 함께 수정합니다. registry dependency는
   명시하고 source의 license와 npm dependency의 license를 구분합니다.
4. `apps/docs/src/catalog.tsx`에 동작하는 preview와 사용 코드를 추가합니다.
   필요할 때만 `apps/profile-demo`에 실제 조합을 추가합니다. 단순 카드나
   모형이 아니라 구현된 component를 사용합니다.
5. 키보드·focus·상태 발표·light/dark·좁은 화면을 확인하고
   `research/verification.md`에 실행한 검사와 미검증 항목을 구분해 기록합니다.

기본 시각 방향은 낮거나 중간 radius, 얇고 분명한 border, 절제된 shadow,
compact–moderate density, semantic color token, 짧고 절제된 motion입니다.
현재 `--radius: 5px`, `--density-control-height: 36px`,
`--motion-fast: 150ms`이며 색상은 브랜드 확정값이 아닌 임시 선택입니다.

## 설치·검증·배포

```bash
npm ci
npm run typecheck
npm run build
npm run registry:check
npm run dev
```

`npm run build`는 `docs/`의 정적 사이트와 `docs/r/`의 registry JSON을
생성합니다. 빌드 후 생성물 diff를 확인하고 필요한 변경만 commit하세요.
Field, Select, DatePicker, `pyd-tokens`는 별도 Vite 소비자에서 실제
`shadcn add`, import, typecheck, build를 확인했습니다. 빌드 산출물의
`registryDependencies`는 `PYDEMIA_REGISTRY_BASE_URL`을 기준으로 URL로
바뀌며 기본값은 공개 Vercel 주소입니다. 로컬 소비자 검사는 이 환경
변수를 `http://127.0.0.1:5173/r/`로 지정해 빌드한 뒤 실행했습니다.
나머지 35개에 대한 소비자 설치는 아직 실행하지 않았습니다.
이번 확장에서 390px 화면과 주요 키보드·focus 동작을 Chromium으로
확인했습니다. 실제 screen reader 검증과 전체 WCAG audit은 남아 있습니다.

GitHub `pydemia/ui`의 `main`에 push하면 Vercel 프로젝트 `pydemia-ui`가
`vercel.json`에 따라 `npm ci`, `npm run build`를 실행해 `docs/`를 게시합니다.
`ui.pydemia.ai`는 Vercel에 등록했으나 Squarespace DNS 전환이 아직 확인되지
않았습니다. 기존 GitHub Pages 설정과 `docs/CNAME`은 전환 전 상태로 남아
있으므로 component 확장 작업에서 도메인 설정을 임의로 변경하지 마세요.

작업 시작 시 저장소의 `README.md`, 위 `research/` 문서, 관련 component 및
registry metadata를 먼저 읽으세요. 새 source를 편입할 때는
`software-engineering`, `reference-research`, `product-ui-ux-design`,
`frontend-design-workflow`, `frontend-development` 중 해당 작업에 필요한
pydemia skill의 실제 원문도 확인하세요.
