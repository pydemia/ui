# DataChart·DonutChart 표시 형태

2026-10-03. 분석 화면의 `CardContent`나 dashboard panel에 기존 chart를
넣으면 chart 자체의 테두리와 여백이 중첩됩니다. 두 component에
`appearance="plain"`을 추가해 chart 외곽의 테두리·배경·여백만
제거했습니다. 기본값 `panel`의 표시와 제목·설명·범례·값·데이터 표는
유지합니다. 지원하지 않는 appearance는 `RangeError`로 거부합니다.
두 chart 모두 기존 `pydemia/ui` 원본 구현을 수정했으며 새 runtime
dependency와 외부 source·asset 도입은 없습니다. 기존 provenance의
출처·LICENSE·접근성 설명은 그대로 적용됩니다.

문서 catalog의 두 preview에 전환 버튼을 넣고 Usage에 두 형태를
표시했습니다. Usage에 `Card`를 직접 import한 첫 시도는
`registry:check`가 `pyd-card` 의존성 누락으로 탐지했습니다. chart
item에 불필요한 설치 의존성을 추가하지 않고 Usage에서 상위 Card
조합을 제거했습니다. registry item의 의존 경로는 기존 `pyd-utils`
하나로 유지됩니다.

- `npm run typecheck`: 통과. 이후 Usage 수정에 대한 docs typecheck도
  통과했습니다.
- UI package 테스트: 226/226 통과. `DataChart` 대상 테스트 12/12도
  별도로 통과했습니다.
- `npm run build`, `npm run registry:release-check`: 통과. 135개
  component export/catalog, 137개 item, 65개 불변 snapshot을 확인했습니다.
  새 ID는
  `sha256-6b3bc4951ace2fe379a77bbe155f9e171f1c9245ec8dafc67f306f454c9d3822`
  입니다.
- 로컬 Chromium preview: 두 chart에서 panel ↔ plain 전환을
  실행했습니다. DataChart는 테두리 1px·여백 16px에서 0px·0px로,
  DonutChart도 plain에서 0px·0px로 바뀌었습니다. 값, 범례·데이터 표
  또는 목록은 유지됐습니다. DonutChart의 첫 preview는 변경 전 package
  빌드를 읽어 재빌드 후 새 파일로 다시 확인했습니다.

새 appearance에 해당하는 별도 설치 경로는 없으므로 소비자 설치를
반복하지 않았습니다. 이 변경은 component 수를 늘리지 않으며 Goal
관리용 추정 약 98%를 유지합니다.

PR #111을 `main`에 squash 병합했습니다(`a34b150c`). PR Verify UI run
`37072043757`, `main` Verify UI run `37072341311`, Pages run
`37072340881`이 성공했습니다. Vercel production 배포
`dpl_9FoKbTRfVrxXPdQBzpsu6iC8kgEC`는 READY입니다.
`ui.pydemia.ai`에서 최신 두 item과 65번째 manifest·두 item이
HTTP 200이며, 최신 item과 manifest 내용이 로컬 `docs/r/` 파일과
일치합니다. 로컬에서 실행한 전환 흐름은 공개 사이트에서 반복하지
않았습니다. 이전에 404였던 `pyd-item-list.json`도 HTTP 200입니다.
