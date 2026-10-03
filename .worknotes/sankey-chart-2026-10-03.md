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
- `npm run test -w @pydemia/ui`: 소수 척도 보강 이전의 259/259 통과.
- `npm run prism:check`: 25/25·Usage 예제 11개 typecheck 통과.

보강 뒤 전체 UI 테스트, registry 고지 고정·현재 snapshot·
PR CI·공개 URL은 아직 확인하지 않았습니다. 실제 screen reader·
touch·Safari·RTL도 실행하지 않았습니다. Goal 관리용 추정은
약 98%로 유지합니다. 로컬 후보는 142개 component·144개 item,
공개 확인은 140개·142개입니다. RadarChart 공개 배포도 계속
대기 중입니다.
