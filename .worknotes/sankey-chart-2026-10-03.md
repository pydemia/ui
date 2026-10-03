# SankeyChart 작업 기록

## 범위

유입 경로가 다음 단계의 여러 항목으로 갈라지고 다시 합쳐지는 수량을
비교하는 원본 component를 `@pydemia/ui`와 내부 registry에 추가합니다.
`FunnelChart`의 단계 총량이나 `NodeCanvas`의 연결 편집과 사용처가
다릅니다. 외부 코드를 편입하지 않고 React·SVG·Tailwind와 기존
`pyd-utils`만 사용합니다. W3C WAI의 복잡한 그림 안내를 참고해
정확한 값을 native table에 제공합니다.

## 현재 검증

- 대상 SSR 테스트 5/5 통과: 단계 흐름·정확한 표, 리본·선 비례 폭,
  극단적으로 작거나 큰 유한 수, 0·미수집·빈 목록과 잘못된 입력·
  합계 overflow.
- `npm run typecheck` 통과.
- `npm run build` 통과. 현재 144개 registry item을 생성했습니다.
- 로컬 Chromium: 넓은 preview에서 3단계·8개 경로와 표를 확인했고,
  리본·선, 미수집·빈 상태 전환을 실행했습니다. 390px에서 문서 전체
  가로 넘침 없이 그림 영역이 가로 스크롤됩니다. 영역에 focus한 뒤
  방향키로 내부 스크롤이 이동하는 것도 확인했습니다. page error는
  0건입니다.
- `npm run test -w @pydemia/ui`: 260/260 통과.
- `npm run prism:check`: 25/25·Usage 예제 11개 typecheck 통과.
- provenance 고지를 source commit
  `1ae533dd493b0db71c558192499e974df646fe80`과 SHA-256
  `6298f0b4ac44e88054ede05603c74d6e88eb24a4351f5f437ea58c90d931af99`에
  고정했습니다. 새 외부 구현 코드는 편입하지 않았습니다.
- `npm run registry:release-check`: 144개 item·142개 export/catalog와
  73개 불변 snapshot, 현재 registry 일치 검사 통과. 현재 ID는
  `sha256-9bf65f08c6e3daa55815c07059472e3b3fbf73651f55169bbbc23398927e88d0`입니다.

첫 release 검사는 snapshot을 만든 직후 공개용 `docs/r/releases` 복사본이
없어 실패했습니다. 이후 사이트를 다시 빌드해 생성물을 복사하고
재실행해 통과했습니다. PR CI·공개 URL은 아직 확인하지 않았습니다.
실제 screen reader·
touch·Safari·RTL도 실행하지 않았습니다. Goal 관리용 추정은
약 98%로 유지합니다. 로컬 후보는 142개 component·144개 item,
공개 확인은 140개·142개입니다. RadarChart 공개 배포도 계속
대기 중입니다.

## 병합과 공개 공급

PR [#131](https://github.com/pydemia/ui/pull/131)을 `main`에 병합했습니다.
PR Verify UI 316, 병합 commit `b5ccfacef7890ecd30b2f53766c510ebe0211461`의
Verify UI와 Pages가 통과했고 Vercel production 상태도 성공입니다.
2026-10-03 공개 도메인에서 `/r/registry.json`은 HTTP 200·144개 item,
`/r/pyd-sankey-chart.json`은 HTTP 200·이름과 파일 1개를 확인했습니다.
73번째 manifest와 snapshot item, 앞서 대기 중이던 RadarChart의 현재
item·72번째 manifest·snapshot item도 모두 HTTP 200입니다. 확인된 공개
수량은 142개 component·144개 registry item입니다. Goal 관리용 추정은
약 98%로 유지합니다.

PR의 변경 파일 347개 중 290개가 현재 snapshot의 `registry/releases/`와
`docs/r/releases/` 복사본입니다. 이는 저장 형식의 비용이며 component
동작 검사의 개수로 세지 않습니다. 실제 보조기술·touch·Safari·RTL은
이번 릴리스에서 실행하지 않았습니다.
