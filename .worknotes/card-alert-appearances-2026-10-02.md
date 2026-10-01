# Card·Alert 표시 형태 확장

2026-10-02 시작 공개 기준: 109개 component·111개 registry item·
27개 snapshot, goal 관리용 약 83%. 기존 Card는 한 가지 표면과
16px 간격, Alert는 상태별 outline 표면만 제공했습니다. 시각 선택은
기존 component의 API로 추가하며 별도 component 수는 늘리지
않습니다.

`Card.variant`의 subtle·elevated와 `size="compact"`,
`Alert.appearance`의 soft·plain을 token 기반으로 작성했습니다.
기본 표시, MetricCard의 자체 variant, Alert의 status·alert 역할을
유지합니다. public type, 문서의 선택 가능한 preview와 Usage를
갱신했습니다. 새 runtime dependency와 registry item은 없습니다.
고정 shadcn source·LICENSE, 기존 의존성과 접근성 판단은
[source inventory](../research/source-inventory.md)에 적었습니다.

## 로컬 검증

- `npm run typecheck` 통과. 첫 실행에서 preview Button의 잘못된
  `size`·`variant` 값을 발견해 수정한 뒤 재실행했습니다.
- UI 테스트 126/126 통과. Card 기본 표시·간격과 Alert 발표 역할,
  기존 MetricCard variant 회귀를 포함합니다.
- `npm run build` 통과. 111개 registry item과 문서 생성 CSS에
  Card 간격·그림자, Alert soft 배경 class가 포함됩니다.
- 로컬 문서 390px Chromium: Card subtle 배경 `rgb(242, 244, 246)`,
  compact header 간격 12px, elevated 그림자와 dark 배경·그림자 계산을
  확인했습니다. Alert의 soft 5개 상태 배경과 status 4개·alert 1개,
  plain의 투명 배경·border·8px 세로 간격을 확인했습니다.
  두 preview 모두 가로 넘침과 page error가 없었습니다.
- `npm run registry:check`와 `npm run registry:release-check`가
  통과했습니다. 28번째 snapshot
  `sha256-31570f6e63cde7658f59f2939bdc1ff2418a77838378e39a00a7c250c8813fe5`는
  현재 111개 item과 일치합니다. 공개 URL은 아직 확인하지
  않았습니다. 실제 screen reader·touch·Safari·RTL도 미검증입니다.

기존 component의 표시·타입 변경이고 설치 경로와 의존성 체인이
그대로이므로 [재조정한 공급 기준](quality-criteria-reassessment-2026-10-02.md)에
따라 새 소비자 CLI 재설치를 반복하지 않습니다. 공개 전 goal
관리용 추정은 약 83%로 유지합니다.
