# 답변 서식·제안·생성 상태 그룹 재감사 (2026-10-14)

대상은 58개 목표 중 `prism-content`다. 기준 원본 `prism/frontend`의 `dev`와 `origin/dev`는 `2eeb26ff10274745f9d86897c2f2828bff002b98`로 일치하고, UI 작업 브랜치는 시작 시 깨끗했다. 배포된 공개 `/sample/chat/templates`에서 선택 제안, 분석·자료 조회·생성 단계, 중단 상태 및 추천 포지션 예시를 직접 확인했다. 제안 버튼은 높이 32px, 14px/500, 배경 `#f9fafc`, 테두리 `#d4d8dd`다. 생성 단계 라벨은 13px/600의 `#cb202d`, 본문은 14px/600이다. 로컬 기본 버튼의 높이·색상·테두리와 생성 라벨·본문 값이 일치했다. 배포 소스 SHA는 확인되지 않았다.

원본 `ChatTemplateNudge`는 선택 이후 다른 선택지를 잠그고, 인트로처럼 단순 입력 채우기 목적에는 `noLockOnSelect`를 사용한다. 기존 `PrismSuggestions`는 선택된 버튼만 비활성으로 만들고 다른 항목을 계속 선택할 수 있었다. 이제 기본 선택은 추가 선택을 잠가 중복 요청 의도를 피한다. 선택한 버튼은 포커스를 유지하도록 native disable 대신 `aria-disabled`와 click guard를 적용하고, 다른 항목은 native disable한다. 반복 선택은 명시적 prop으로 연다. 빈 문자열의 초기 selected 값은 아직 선택하지 않은 상태로 취급한다. 질문·항목의 줄바꿈과 `**강조**`를 HTML 실행 없이 표시하며 패널에서는 버튼 폭을 제한한다. 원본 `ChatTemplateGenerating`의 분석·조회·생성·중단과 `ChatTemplateComplete`의 완료 목적을 `PrismGenerationStatus`에 추가했다. 중단 버튼은 callback만 전달하고 요청 취소 결과는 호스트가 제어한다. 기존 `PrismResponse`의 생성·완료·오류 사용 계약은 유지한다. 단일 `PrismPositionCard`는 독립 링크형 요약이며 원본 추천 목록 배치·더보기는 이미 완료 판정한 `prism-position-recommendations`의 책임임을 catalog에 명시했다.

로컬 브라우저는 기본 선택 후 두 버튼 잠금, 반복 선택 2회, 분석 중단 후 중단 상태, 320px 긴 선택지와 포지션 카드의 넘침 0을 확인했다. 320px에서 버튼과 포지션 카드 폭은 각 288px, 문서 폭은 320px이다. 별도 shadcn 소비자에는 현재 레지스트리를 재설치했다. 59개 TSX 소스와 CSS는 생성 파일과 바이트 단위로 같고 완전 예제 46개가 타입 검사되며 Vite·Pretendard·고지가 통과했다. 게시 예제의 중단·잠금과 140px 부모의 긴 질문·포지션 카드, 내부 스크롤하는 5열 Markdown 표를 브라우저에서 확인했다. 140px 부모에서 제안·카드·생성 상태 폭은 140px, 표 내부 폭 140px/스크롤 폭 167px, 문서 가로 넘침과 콘솔 오류는 0이다. 포지션 요약 callback은 클릭과 Enter에 각각 1회 반응했다.

전체 PRISM 테스트 337개(제안 잠금·반복 선택, 생성 중단, 안전한 Markdown 포함), workspace typecheck, site build가 통과했다. 최종 registry release check, PR·CI·미리보기 결과는 `.worknotes/browser-evidence/content-goal-publication.json`에 기록한다. 이 그룹을 새 기준으로 완료 판정해 **27/58개**, 미판정 31개다. 인증된 전체 대화와 실제 서비스 중단·선택 결과, 배포 SHA 연결은 미확인이다.

최종 site build 이후 registry release check의 5개 검사와 `verify-current`가 통과했고, 게시 검증 JSON의 `docs/` 복사본이 원본과 일치했다. 59개 설치 모듈·CSS 대조와 46개 예제 타입 검사는 최종 산출물 기준으로 다시 통과했다.
