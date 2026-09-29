# 수정 source의 item별 고지 전달 검증

2026-09-29 기준 `registry/provenance.json`에서
`source.implementation: modified`인 shadcn/ui 기반 item 27개를
각각 새 소비자 fixture에 `shadcn@4.21.0 add`로 설치했습니다.
검사 대상은 `registry.json`의 해당 item이며 URL은 로컬에서 생성한
`http://127.0.0.1:5173/r/{name}.json`을 사용했습니다.

대상: `pyd-button`, `pyd-input`, `pyd-textarea`, `pyd-native-select`,
`pyd-checkbox`, `pyd-switch`, `pyd-radio-group`, `pyd-dialog`,
`pyd-alert`, `pyd-progress`, `pyd-skeleton`, `pyd-card`,
`pyd-separator`, `pyd-tooltip`, `pyd-accordion`, `pyd-collapsible`,
`pyd-popover`, `pyd-alert-dialog`, `pyd-avatar`, `pyd-breadcrumb`,
`pyd-empty`, `pyd-spinner`, `pyd-toggle`, `pyd-slider`,
`pyd-calendar`, `pyd-tabs`, `pyd-scroll-area`.

소비자 경로는
`C:\Users\pydemia\AppData\Local\Temp\pydemia-ui-notice-individual-20260929`
입니다. 각 item마다 별도 fixture를 만들었으며 처음에 설치한
`pyd-button`을 제외한 26개는 같은 디렉터리의 임시
`check-notices.ps1`로 두 차례 13개씩 설치했습니다. CLI 실행은
27개 모두 성공했습니다. 사후에 provenance 대상 27개와 fixture 27개를
대조했고, 각 fixture의 `src/components/ui/SHADCN_UI_LICENSE.md`를
`registry/SHADCN_UI_LICENSE.md`와 개행 차이를 제외하고 비교했습니다.
각 item의 직접 component 소스 27개도 `registry.json`에 선언된
저장소 파일과 같은 방법으로 비교했습니다. **고지 27/27, 소스
27/27 일치, 실패 0건**입니다.

이 검사는 source 고지가 개별 CLI 설치 시 전달되는지 확인합니다.
각 fixture에서 TypeScript 검사, build, 브라우저 상호작용을 실행하지
않았습니다. 89개 item의 동시 설치와 사용 코드 typecheck·build·
Chromium 모듈 로딩은 별도
[공급 경로 기록](component-catalog-supply-2026-09-29.md)에서
확인했습니다. 원격 공개 URL, 설치물의 갱신·충돌 복구, npm 의존성의
license 재조사, 실제 보조기술·touch 동작은 이번 검증에 포함하지
않았습니다.
