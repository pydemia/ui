# TreemapChart 작업 기록

## 결정과 범위

2026-10-03. analytics 화면에서 조직·제품군·서비스 등 두 단계 이상의
계층별 구성비를 한 화면에 비교할 수 있는 공급물이 없습니다. 기존
`DonutChart`와 `BarList`는 평면 범주, `Heatmap`은 두 축의 교차값을
표시합니다. 계층의 부모·자식 면적을 함께 보여 주는 `TreemapChart`를
원본 React·Tailwind component로 추가합니다. `ChartContainer` 후보가
적은 공통 제목·색상·반응형·데이터 설명은 현행 차트 API에 이미 있어
독립 component로 세지 않습니다.

입력은 ID·이름과 비음수 유한값을 가진 leaf, 또는 자식 배열을 가진
group입니다. group의 값은 자식에서 합산합니다. 0값은 표에는 남기되
면적에서 제외하며, 전체가 0이면 별도 빈 상태를 표시합니다. 입력
순서를 보존하는 이진 분할로 면적을 배정하고 크기·계층·정확한 값은
native table로 제공합니다. 색상만으로 구분하지 않습니다. 차트는
`panel`·`plain` 표시를 지원합니다.

Vega와 D3의 공식 treemap 문서는 면적이 값에 비례하는 계층 사각형
표시라는 개념만 참고했습니다. 해당 library의 source, 알고리즘,
artwork는 편입하지 않습니다. W3C WAI의 표 구조·색상 사용 지침을
값 대안의 근거로 사용합니다. 출처는
[source-inventory.md](../research/source-inventory.md), 실제 검증은
[verification.md](../research/verification.md)에 기록했습니다.

## 진행 상태

- 구현·catalog·registry metadata: 완료. 로컬 138개 component·140개 item.
- `npm run typecheck`, 대상 SSR 테스트 5/5, 전체 UI 테스트 242/242,
  `npm run build`: 통과.
- 첫 `npm run registry:check`는 새 provenance의 SHA-256과 소비자
  고지가 달라 중단. metadata를 포함한 commit
  `393295abf5a11df8d1eaf987421b9d57d3e34f4d`에 고지 링크를
  고정하고 hash를 갱신했습니다. 이후 `registry:check`와
  `registry:release-check`가 통과했습니다.
- 69번째 snapshot
  `sha256-89c86a0be4705c8b66e8ba4bb6d9c83cc3e4fce2a499314871c130c73dbd63e7`을
  생성하고 재빌드했습니다. 현재 140개 item·138개 export/catalog와
  69개 snapshot의 내용·의존 경로를 검사했습니다.
- 로컬 Chromium: 390px·1280px에서 계층 면적과 정확한 값 표,
  밝은색·어두운색, panel·plain, 0값·빈 목록 전환을 확인. 두 폭 모두
  문서 가로 넘침이 없고 page error 0건. 부모 이름이 자식 이름을
  가리던 표시를 수정해 자식 이름을 영역 아래쪽에 배치함.
- PR #123의 Verify UI run `37086235912`, 병합 commit
  `2a38211c728135d40e63a69396413d8a6f83f936`의 Verify UI run
  `37086445611`과 Pages run `37086445381`이 성공했습니다. Vercel
  production도 성공했습니다.
- 사용자 도메인의 69번째 manifest, 현재 `pyd-treemap-chart.json`,
  69번째 snapshot item이 HTTP 200이고 로컬 생성물과 바이트가
  같습니다. 공개 catalog에서 `TreemapChart` preview와 Usage 전환,
  계층 표의 `플랫폼 › API` 행을 확인했고 page error는 0건입니다.
- 실제 screen reader 발표·touch·Safari·RTL: 미확인. 이번 릴리스에서
  해당 환경 전수 검사를 적용하지 않았습니다.
- Goal 관리용 추정: 약 98% 유지
