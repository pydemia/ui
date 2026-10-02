# WaterfallChart 공급 작업

2026-10-03 착수. 시작 총계에 양수·음수 증감을 순서대로 적용해 최종
총계에 이르는 분석 화면을 대상으로 합니다. 현재 `DataChart`의
막대·누적 막대는 각 항목의 변화가 직전 누적값에서 시작하는
floating bar를 제공하지 않습니다. 새 종류의 독립 사용처입니다.

확정한 API 범위는 시작값, 이름 있는 증감 항목, 시작·최종 label,
값 formatter와 단위, panel·plain 표시입니다. 입력값은 완전한
유한 숫자만 받습니다. 미수집을 0으로 대체하지 않고 잘못된 값은
거부합니다. 빈 증감 배열은 별도 빈 상태로 표시합니다. 시각적
막대와 연결선은 장식으로 두고, 원값·증감·누적값은 표로 전달합니다.
소스는 `pydemia/ui` 원본 React·SVG·Tailwind 구현이며 새 runtime
dependency는 없습니다.

[Microsoft Learn의 Waterfall 설명](https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualization-waterfall-charts)은
시작·최종 총계와 부동 증감 막대라는 사용 사례를 확인하는
개념 참고자료입니다. 해당 제품의 코드나 디자인 자산을 가져오지
않습니다.

로컬 검증: `npm run typecheck`, UI 테스트 223/223을 통과했습니다.
Chromium 문서 preview에서 기본·음수 최종값·빈 데이터·panel/plain을
확인했습니다. 390px에서는 페이지 가로 넘침 없이 SVG 영역이 내부
스크롤되고 정확한 수치 표가 보입니다. 1280px에서는 막대 5개와
표 5행, 변화 없음 범례를 확인했습니다. Vite 오류 overlay는 없었습니다.
실제 screen reader 발표와 다른 브라우저는 이번 변경의 기본 판정에
적용하지 않았으며 실행하지 않았습니다.

`npm run build`와 `npm run registry:release-check`가 통과했습니다.
`registry:check`는 134개 component export/catalog와 136개 item·
provenance의 대응을 확인했습니다. 63번째 불변 snapshot
`sha256-439718d5d532ebb4cd87f4e64692f691487c0a29d8c63652ca2b307542e1926d`를
생성하고 배포용 복사본과 현재 registry의 일치를 확인했습니다.
이번 고지는 commit `78145967366dc3b0f3ec1b1a3dca2a5ee8f3f1f6`의
provenance와 SHA-256으로 고정했습니다.

PR CI·production 배포와 공개 registry URL은 아직 확인하지 않았습니다.
로컬 공개 후보는 134개 component·136개 item·63개 snapshot,
공개 production은 직전 133개·135개·62개 기준입니다. Goal 관리용
추정은 공개 전 약 98%로 유지합니다.
