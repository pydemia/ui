# 6 Frame Survey 그룹 재감사 (2026-10-14)

대상은 58개 목표 중 `prism-survey` 한 그룹이다. 기준 `prism/frontend` `dev`와 `origin/dev`는 `2eeb26ff10274745f9d86897c2f2828bff002b98`로 일치하고 작업 트리는 깨끗했다. `SurveyValidation.tsx`, `ValidationItem.tsx`와 두 SCSS는 이전 비교 기준 `087811ffba678ece20ee00b1c3c5d117a1d3d323` 이후 내용이 바뀌지 않았다. 배포 CSS의 Survey 클래스와 치수는 2026-10-10에 수집한 `browser-evidence/attitude-deployed-css.json`에 있다. 현재 인증된 프로필 화면과 배포 SHA는 아직 연결되지 않았다.

원본 목적은 2/3열 카테고리 카드, 상사·동료·구성원 막대, 0~10 점수, 그룹 평균선, 값이 없는 막대의 생략, 빈 결과, 프로필 인쇄 규격이다. Leadership에서는 제목 옆에 호스트 소유 `Culture Survey 결과 보기` 버튼을 넣는다. 설치용 `PrismSurveyValidation`은 0과 null을 구분하고, 누락값은 접근성 데이터 표에 남기며, 평균선 위치를 정수 px로 반올림한다. 점수 계산, PDF 열기와 접근 권한은 호스트 범위다.

이번 점검에서 독립 예제에도 문서 열기 intent를 추가했다. 140px 긴 내용 상태에서 버튼의 최소 너비 때문에 Survey 컨테이너가 16px 넘치는 것을 발견해 180px 이하에서 버튼을 줄바꿈하도록 했다. 로컬 브라우저에서 수정 후 카드 폭과 스크롤 폭이 모두 140px이고 문서 넘침이 없었다. 320px 막대 높이의 평균선은 195px, 점수 0은 `0.0`으로 표시됐다. 800px 인쇄 클래스는 액션을 숨기고 카드 높이 157.328px, 막대 70px, 범례 13.333px를 유지했다. 빈 결과는 카드·범례 없이 안내를 표시했다.

독립 설치본: 별도 shadcn 소비자에 `prism-survey`와 토큰을 다시 설치했다. 59개 모듈 소스와 CSS 바이트 일치, 예제 43개 타입 검사, Vite 빌드·Pretendard·자산 고지가 통과했다. 실제 140px 설치 화면은 Survey와 버튼의 스크롤 폭이 모두 140px이고 외부 320px 컨테이너도 넘치지 않았다. 점수 0은 `0.0`, null 동료는 접근성 표의 `정보 없음`, 버튼 클릭은 호스트 intent로 표시됐다. 브라우저 오류 로그는 없었다.

검사: PRISM 테스트 327개, workspace typecheck, site build, registry release check가 통과했다. 원본 목적, 배포 CSS의 대표 스타일, 로컬·독립 설치본의 기본·긴 내용·빈 결과·인쇄·가변 크기·액션을 확인해 `prism-survey`를 새 기준으로 완료 판정한다. 전체 진척도는 **15/58개**, 미판정 43개다. 인증된 배포 전체 프로필의 실제 Survey 상태, 배포 SHA 연결, 네이티브 인쇄와 문서 요청은 이 판정의 증거가 아니다. 초안 PR #162의 구현 헤드 `c6aa765cf7d0b5366da4d386ba920e0fd9f7a6a1`에서 GitHub Verify UI와 Vercel preview가 성공했고, 배포된 정적 파일 5개가 로컬 생성본과 바이트 단위로 일치했다.
