# 프로필 분석 그룹 재감사 (2026-10-14)

대상은 58개 목표 중 `prism-analysis` 한 그룹이다. 원본 `prism/frontend`의 `dev`·`origin/dev`는 `2eeb26ff10274745f9d86897c2f2828bff002b98`로 일치하고 작업 트리는 깨끗했다. `ChatProfileAnalysis.tsx`의 마지막 관련 변경은 Leadership 결과 태그 추가(`6b49495e`)이며 현재 파일과 SCSS는 당시 source-delta 감사의 구현에 반영됐다. 원본 전체 화면의 인증된 배포 SHA는 확인되지 않았다. 이번 in-app browser에서 `https://dev.prism.ai` 직접 접근은 연결 재설정으로 실패했으므로 새 배포 화면을 읽었다고 주장하지 않는다. 이번 문서 대응표에는 누락됐던 `ChatProfileAnalysis.module.scss`를 추가했다.

원본 목적은 리더 유형의 60px 원형 배지·설명 tooltip·AI comment 우선 본문, 그리고 전문성 tag·대표 성공경험 star·Design/Learning 첫 결과·Attitude Derailment·Leadership 결과 태그와 제목/설명·기타 chip을 6 Frame별로 구분하는 것이다. 설치용 `PrismAnalysis`는 kind를 호스트가 명시하고 결과·근거를 그대로 표시한다. summary의 trim-empty는 `관련 데이터 없음`이고 inline 근거 링크의 실제 이동은 호스트가 소유한다. 폭 280px 이하의 라벨 열 재배치, 180px 이하의 배지/설명 세로 배치, 긴 태그의 원문/title 보존과 화면 안 말줄임은 의도한 개선이다.

로컬 문서 브라우저에서 기본 800px 분석은 배지 60×60px, 라벨 80px, Leadership 결과 2개를 순서대로 표시했다. tooltip에 리더 유형 설명과 다섯 단계 문구가 보였고 Escape로 닫혔다. 합성 `profile://synthetic` 액션을 누르자 호스트 status가 `profile: synthetic`으로 바뀌었다. 140px 긴 내용에서는 분석 폭·scrollWidth가 모두 140px이고 문서 가로 넘침이 없었다. 리더 행과 factor 행은 세로로 재배치되고 긴 결과 태그는 원문/title을 보존했다. 빈 상태는 리더 유형과 6 Frame 영역 각각에 `관련 데이터 없음`을 표시했다.

현재 registry의 `prism-analysis`와 토큰을 별도 shadcn 소비자에 다시 설치했다. 59개 모듈 소스와 CSS가 생성본과 바이트 단위로 일치했고 완전 예제 43개 타입 검사, Vite 빌드, Pretendard 글꼴 바이트 및 자산 고지가 통과했다. 실제 320px iframe의 분석 폭·scrollWidth는 320px, 문서 넘침은 0이고 배지는 60px, 라벨은 80px, 태그는 21px/12px이었다. 대표 경험 별은 `rgb(251,188,5)`, Derailment는 `rgb(234,0,44)`였다. 도움말, 후보 액션, 패널 모드에서 액션을 정적 텍스트로 바꾸는 동작을 확인했다. 설치본 140px 긴 내용의 root overflow와 문서 넘침은 0이며 배지·factor가 세로 배치되고 긴 Leadership 태그는 title에 원문을 유지했다. 빈 상태도 두 영역에 별도로 표시됐다. 직접 연 설치본의 수집된 console error는 0개였다.

전체 검증에서 `npm run prism:check`의 327개 테스트, `npm run typecheck`, `npm run build`, `npm run registry:release-check`가 모두 통과했다. 생성된 문서 사이트에 source 대응과 완료 판정을 반영했다.

원본의 기능 목적·대표 디자인과 국소 상태, 실제 독립 설치·브라우저 동작을 확인해 `prism-analysis`를 새 기준으로 완료 판정한다. 전체 진척도는 **18/58개**, 미판정 40개다. 인증된 원본 전체 프로필 상태, 현재 배포 소스 SHA, 실제 host 데이터·이동·권한 결과는 아직 이 증거에 포함되지 않는다. 원본의 좁은 폭 넘침이나 모든 픽셀 좌표의 재현은 완료 조건으로 삼지 않는다.
