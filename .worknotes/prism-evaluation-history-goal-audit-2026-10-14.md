# `prism-evaluation-history` goal 수용 감사 (2026-10-14)

판정: `prism-evaluation-history` **완료 수용**. 전체 **35/58**, 미판정 23개. 최근 평가의 등급 배지·연도 묶음과 독립적인 개별값 표시 목적을 기준으로 했다. 전체 프로필 A4 페이지 판정은 `prism-profile-print`에 남긴다.

최신 fetch한 `prism/frontend` `dev` `2eeb26ff10274745f9d86897c2f2828bff002b98`의 `CandidateEvaluationHistory.tsx`와 SCSS, 공개 배포 `/sample/chat/candidate-profile-print`를 대조했다. 배포 샘플에는 2025·2024·2023년 평가 `S` 배지 3개가 18px 높이로 표시되고 연도는 `('25년/'24년/'23년)`으로 묶인다. 인쇄 화면의 배지 글자는 계산 스타일 10pt였다. 공개 샘플의 배포 SHA는 확인되지 않았다.

기존 설치 컴포넌트는 source variant에서 공백/null을 제외하고 연도 내림차순으로 표시한다. 괄호 등급 강조, 실제 `0` 문자열, 명시적 `active=false`, 알 수 없는 연도 입력 순서, 접근 가능한 배지별 연도 설명은 기존 테스트로 확인했다. 원본과 달리 같은 연도가 중복돼도 React key가 충돌하지 않으며 원본 배열을 변경하지 않는다. explicit variant는 원본 입력 순서와 null의 `--`를 유지한다. 이번에는 공개 완전 예제에 두 variant와 누락값·0을 함께 넣고, 장문 fixture에 140px 부모를 추가했다. source variant에 유효한 평가가 없을 때 아무것도 표시하지 않는 이유도 데모에 명시했다.

로컬 브라우저에서 기본·빈 값·12년 장문과 variant 전환을 확인했다. 320px 뷰포트의 문서 폭은 320px이고 140px 부모의 실측 폭과 scrollWidth도 140px를 유지했다. 별도 shadcn 소비자에 현재 registry 그룹을 설치해 59개 TSX 모듈과 CSS의 바이트 일치, 완전 예제 48개 타입 검사, Vite·Pretendard·고지를 확인했다. 그 설치본의 320px 뷰포트/140px 부모, 연도 순서, 활성 배지 색, explicit null 표시를 브라우저에서 확인했고 오류 로그는 0건이었다.

`npm run build`, `npm run prism:check`(340/340), `npm run typecheck`, `npm run registry:release-check`가 통과했다. 인증된 제품 경로의 실제 평가 데이터 연결, 정확한 배포 소스 SHA, 프로필 전체 A4 글꼴·페이지 분할은 검증하지 않았다.
