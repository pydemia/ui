# Component 확장안 production 배포

2026-09-29. [PR #1](https://github.com/pydemia/ui/pull/1)을 review 가능
상태로 바꾼 뒤 `main`에 병합했습니다. 병합 커밋은 `092b748`입니다.
[main push CI](https://github.com/pydemia/ui/actions/runs/36573529988)가
성공했고, Vercel production 배포 `dpl_EjnAMz5m3bDVKyk6noi3opNT3iMu`는
READY입니다. 공개 [문서 사이트](https://pydemia-ui.vercel.app/)에서
89개 component 목록, Spinner의 다섯 표시 형태와 사용 코드, 분석 화면
예시의 렌더링을 확인했습니다.

현재 snapshot ID는
`sha256-48f182bbf4fafa4e209bb89acebf7e77b722f6aac842e1a3c90d974399d9ac93`,
보존한 이전 후보 ID는
`sha256-a1cd11bae6654a55136729439cd7b437a507d59896271b7c0950745a9e61bf21`입니다.
두 ID의 공개 `manifest.json`과 `pyd-button.json`은 HTTP 200이며
저장소의 `docs/r/releases/<ID>/` 파일과 SHA-256이 각각 일치했습니다.

공개 URL을 사용해 별도 Vite 소비자에 현재 ID의 `pyd-button`,
`pyd-data-chart`, `pyd-tokens`를 `shadcn@4.21.0 add`로 설치했습니다.
`utils.ts`, `button.tsx`, `data-chart.tsx`, `tokens.css`,
`SHADCN_UI_LICENSE.md`가 생성됐습니다. 설치된 DataChart 소스는 저장소
원본과 줄바꿈 정규화 후 일치했고 소비자 typecheck·build가 통과했습니다.
별도 소비자에는 이전 ID의 `pyd-button`과 `pyd-tokens`를 설치해
typecheck·build를 통과했습니다. 공개 주소의 현재·이전 버전 설치를
확인한 범위에서 [로드맵](component-roadmap.md)의 불변 주소 조건을
완료 표시했습니다.

fixture는 각각 `%TEMP%/pydemia-ui-public-consumer-20260929`와
`%TEMP%/pydemia-ui-previous-snapshot-consumer-20260929`입니다.
현재 소비자의 DataChart는 import와 빌드만 확인했고 그래프 상호작용은
이 fixture에서 실행하지 않았습니다. 91개 item 각각의 공개 URL 설치,
장기간의 과거 URL 보존, 실제 screen reader·touch·drag/drop·다른 시간대,
대규모 변경의 독립 코드 review도 확인하지 않았습니다. 이 범위를
전체 component 품질 검증으로 확대 해석하지 않습니다.

작업 트리의 두 미공개 draft snapshot은 여전히 untracked이며 공개
호환성 대상이 아닙니다. `main` 후속 작업에서 일괄 `git add`에 포함하지
마세요.
