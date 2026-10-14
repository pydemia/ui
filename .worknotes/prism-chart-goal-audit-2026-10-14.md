# `prism-chart` goal 수용 감사 (2026-10-14)

판정: `prism-chart` **완료 수용**. 전체 **34/58**, 미판정 24개. 기준은 차트의 데이터 의미, 대표 디자인·상태, 독립 설치와 좁은 화면의 사용성이다. 프로필 전체 A4 페이지 일치는 별도 `prism-profile-print` 그룹에서 판정한다.

기준 소스는 최신 fetch한 `prism/frontend` `dev` `2eeb26ff10274745f9d86897c2f2828bff002b98`이다. catalog의 `LeadershipRadar.tsx`는 존재하지 않아 RadarChart, LeadershipPie, LeadershipPieSummary, LeadershipTrendChart, LeadershipTrend와 해당 스타일의 실제 경로로 바로잡았다. 공개 배포 샘플 `/sample/chat/chart`에서 Radar의 축·점수·연한 파란 면적을 확인했고, `/sample/chat/candidate-profile-print`에서 지·덕·용 SUMMARY와 최근 5년 추이의 24px 파란 막대, 빈 연도의 `N/A`, 연도별 회사·직책 행을 확인했다. 이 공개 샘플의 배포 SHA는 확인되지 않았다.

기존 일반 `PrismTrendChart`는 선 그래프라서 원본 리더십 추이의 막대 표시를 제공하지 못했다. `PrismLeadershipTrendBars`를 추가해 최신 연도부터 5년의 공급 데이터를 표시한다. 실제 0은 0점으로, 없는 연도와 null 점수는 `N/A`로 구분한다. 점수는 호스트가 공급하고 차트는 평가·보간을 수행하지 않는다. 원본의 200px 높이·5칸 구분·24px 파란 막대·값과 연도·선택적 회사/직책을 재사용하고, 키보드 포커스/Escape와 접근 가능한 데이터 표를 추가했다. 회사·직책이 긴 140px 부모에서는 상세 행만 가로 스크롤한다.

공개 완전 예제는 SUMMARY pie, Radar, 원본 목적의 5년 막대 추이, 일반 선 추이를 함께 보여 준다. 별도 shadcn 소비자에서 registry의 59개 TSX 모듈과 CSS 바이트 일치, 완전 예제 48개 타입 검사, Vite·Pretendard·고지를 확인했다. 독립 설치본 브라우저에서 320px 조합의 client/scroll 폭 320px, 140px 차트의 client/scroll 폭 140px와 상세 행 내부 스크롤, 막대 상세 열기·Escape 닫기, 오류 로그 0건을 확인했다. 인쇄 SUMMARY의 8pt padding/radius·10pt 본문도 계산 스타일로 확인했다. `PrismLeadershipTrendBars`의 최근 5년, 누락값·실제 0, 과거 기록 제외 및 메타데이터 계약은 별도 테스트로 확인했다.

`npm run build`, `npm run prism:check`(340/340), `npm run typecheck`, `npm run registry:release-check`가 통과했다.

정확한 배포 소스 SHA, 인증된 제품 경로의 실제 점수·툴팁 데이터, 전체 픽셀·글꼴·A4 페이지 비교는 확인되지 않았다. 기존 `visual: partial` 계열 기록은 원본 전체 재현 기준의 남은 범위를 뜻하며 이번 목적·디자인 수용 판정과 분리한다.
