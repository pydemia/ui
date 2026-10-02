# DataTable 행 상세

관리 목록에서 행의 요약 열을 유지하면서 긴 설명·추가 작업을 바로
확인하는 사용처입니다. 새 component 수를 늘리지 않고 기존
`DataTable`에 `renderRowDetails`를 추가했습니다. 콜백이 없으면 기존
열·행 구조를 유지합니다.

상세 버튼은 행 이름으로 이름을 짓고 `aria-expanded`를 표시합니다.
열린 내용은 해당 데이터 행 바로 다음 행에서 모든 열을 차지합니다.
로컬 검색·정렬·페이지 이동 중에는 행 ID별 열림 상태를 유지하고,
행이 데이터에서 제거되면 버립니다. 원격 조회에서는 현재 페이지
데이터만 상세로 표시하며 조회 조건이나 loading·error 상태가
바뀌면 열린 내용을 닫습니다. 내용과 추가 작업은 호출자가
`renderRowDetails`로 전달하며 DataTable이 요청하거나 저장하지
않습니다.

기존 React·Tailwind 원본과 Table·Button 등 이미 설치된 의존성만
사용합니다. [WAI-ARIA APG Disclosure Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)의
native 버튼·`aria-expanded`·Enter/Space 동작을 참고했습니다. 외부
component source를 복사하지 않았고 새 npm 의존성도 없습니다.

대상 테스트 7/7, 전체 UI 테스트 202/202, `npm run typecheck`,
`npm run build`, `npm run registry:check`가 통과했습니다. 로컬
Chromium preview에서 기본·remote 상세 펼침과 Enter 닫기, 버튼 focus
유지, remote loading 전환 시 닫힘을 확인했습니다. 390px에서 문서의
가로 넘침과 console error는 없었습니다. 56번째 snapshot을 생성하고
재빌드한 현재 registry의 `registry:release-check`가 통과했습니다.
PR CI와 공개 URL은 아직 확인하지 않았습니다.
공개 수량은 129개 component·131개 item·55개 snapshot이며 goal
관리용 추정은 약 97%입니다.
