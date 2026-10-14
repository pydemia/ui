# CEO·ELP 코멘트 그룹 재감사 (2026-10-14)

대상은 58개 목표 중 `prism-mgmt-comments` 한 그룹이다. 기준 `prism/frontend` `dev`와 `origin/dev`는 `2eeb26ff10274745f9d86897c2f2828bff002b98`로 일치하고 작업 트리는 깨끗했다. `CeoCommentForm.tsx`, `SuccessorCandidateMgmtComments.tsx`와 두 SCSS는 이전 대조 기준 `087811ffba678ece20ee00b1c3c5d117a1d3d323` 이후 변경되지 않았다. `candidates.ts`의 후속 변경은 CEO 코멘트 요청 경로·payload·응답 타입을 바꾸지 않았다. 기존 공개 배포 CSS 샘플의 코멘트 카드 16px padding·12px radius, 14~16px 본문/제목과 20px 액션은 `browser-evidence/mgmt-deployed-css.json`에 기록되어 있다. 인증된 전체 프로필 화면의 현 배포 SHA는 연결되지 않았다.

원본 목적은 CEO 코멘트의 연도·회의체·발화자·논평 작성, 작성자 본인의 상세 조회·수정·삭제, ELP 선발·육성 코멘트 읽기다. 설치용 그룹은 이 흐름과 함께 nullable metadata, 0년, 본문 줄바꿈, 작성자별 액션을 표현한다. `isMine`은 표시 조건이고 실제 권한·저장·조회·캐시는 호스트가 소유한다. 기존 일반 본문 편집 컴포넌트의 계약과 분리되어 있다. 저장 중 필드 잠금, 중단 신호, 실패 초안 보존, 저장 성공 후 목록 갱신만 재시도는 원본 목적을 유지하는 개선으로 인정한다. 자동 높이·180px 제한과 480px 이하 한 열 배치도 의도한 크기 개선이다.

이번 로컬 브라우저 점검에서 320px 작성 양식은 한 열·입력 폭 246px, 코멘트 컨테이너 320px/scrollWidth 320px이었다. 합성 코멘트를 등록해 CEO 건수가 2→3으로 바뀌고, 상세 편집 양식이 해당 카드 위에 열리며, 수정 본문이 목록에 반영되고 삭제 확인 후 건수가 3→2로 돌아왔다. 140px 작성 양식은 grid 106px, 카드와 scrollWidth 140px으로 넘치지 않았다. 기본·빈 값·로딩·오류·읽기 전용·긴 내용 예제를 각각 확인했고 읽기 전용에는 추가 버튼이 없었다. 로컬·독립 설치 브라우저의 수집된 error 로그는 0건이다. 이는 합성 상태 검증이며 실제 서버 변경의 증거가 아니다.

현재 registry에서 별도 shadcn 소비자로 `prism-mgmt-comments`와 토큰을 재설치했다. 59개 설치 모듈 소스와 CSS는 생성본과 바이트 단위로 일치했고, 완전 예제 43개 타입 검사, Vite 빌드, Pretendard 글꼴 바이트와 자산 고지가 통과했다. 독립 설치본의 실제 320px 컨테이너에서도 작성자 액션·ELP 카드·Pretendard·줄바꿈을 확인했고, 합성 코멘트 등록 후 건수 3·scrollWidth 320px을 확인했다. 설치 소스는 수정하지 않았다. 근거는 `browser-evidence/mgmt-goal-source-consumer.mjs`, `browser-evidence/mgmt-goal-installed-bytes.json`, 이전 계약 테스트 `packages/prism/tests/mgmt-comments.test.mjs`이다.

PRISM 테스트 327개와 registry 계약 검사도 통과했다. 현재 원본 목적, 대표 배포 CSS, 로컬·독립 설치본의 상태·동작·반응형을 확인해 `prism-mgmt-comments`를 새 기준으로 완료 판정한다. 전체 진척도는 **16/58개**, 미판정 42개다. 인증된 원본의 작성·편집·오류 화면 전체 시각, 실제 backend 권한·저장·캐시 통합, 현 배포 SHA 연결은 전체 제품 대조의 미검증 항목으로 남는다.
