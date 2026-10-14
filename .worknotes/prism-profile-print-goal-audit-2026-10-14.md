# prism-profile-print 목표 수용 감사 (2026-10-14)

현재 프런트엔드 `2eeb26ff10274745f9d86897c2f2828bff002b98`의 `CandidateProfilePrintPreview`, `mapComprehensiveProfileToPrintPreview`, `PrintPage`와 7분류 조합을 설치형 문서에 대조했다. 최신 원본에서 Leadership의 title/description 아래 별도 `detail`이 추가됐고 설치형 표시 모델·렌더·출력 예제는 이를 보존한다. `PrismProfilePrintDocument`는 종합·전문성·성공경험·Design 역량·Learning Agility·Attitude·Leadership 순서로 표시한다. 후보자 DTO 해석·권한·사진/로고·정확한 경력 분할 힌트는 소비자가 제공한다.

기존 대상 테스트 9개는 7분류와 SUMMARY/보상 4조합, 경력 continuation과 마지막 보상, 누락된 topic index의 Essay·실패 경험·대표 우선순위, 실제 0과 null, 원문 보존/표시 제한, 빈 값·Leadership 상세·복수 후보의 ID를 다룬다. 이번 로컬 브라우저 기본 상태는 190mm 종이와 7분류를 표시했다. SUMMARY/보상 4조합을 바꿔도 7분류와 경력 3건은 유지됐고 종합의 해당 영역만 바뀌었다. 빈 값과 Leadership 상세 전용 상태도 각각 7분류를 유지했다. 긴 상태에서는 경력 48건, 두 번째 성공경험 topic, 실제 0, 마지막 Leadership 상세 문단이 원문 그대로 남았다. `reference-limits`를 선택해도 Leadership 상세 마지막 문단은 유지됐다.

긴 합성 문서의 현재 A4 PDF는 처음에 22쪽이었고 첫 쪽에는 프로필 머리말·사진·탭만 있어 대부분이 비었다. SUMMARY의 제목과 긴 본문을 통째로 다음 쪽으로 옮기는 쪽 나눔 규칙 때문이었다. 제목과 본문을 붙여 두면 현재 쪽의 40% 미만만 쓰게 되는 경우 글줄 경계에서 나누도록 바꿨다. 대상 쪽 나눔 테스트를 하나 추가했고 7개가 통과했다. 다시 생성한 PDF는 21쪽, 10,172,780바이트, A4 595.28×841.89pt다. 첫 쪽에는 SUMMARY 본문이 들어가고 다음 쪽에는 반복 머리말과 이어지는 내용, 마지막 쪽에는 Leadership 추이 표가 남았다. 불가피한 분할 6곳은 `forcedBreaks`로 보고한다. 일부 매우 긴 카드의 테두리는 쪽 경계에서 잘릴 수 있으나 본문 픽셀은 유지한다.

현재 긴 문서를 HTML로도 다운로드했다. 3,442,496바이트 파일에는 7분류, 경력 48건, 두 번째 경험, 마지막 Leadership 상세, 실제 0과 인라인 글꼴이 있고 실행 script·외부 DOM/CSS 자산 URL은 없다. 이번 내장 브라우저는 `file:` URL을 정책상 거부하므로 현재 파일을 다시 열지 않았고 정적 검사로 범위를 한정한다. 이전 같은 구현의 오프라인/320px 검증과 구분한다.

새 격리 shadcn 소비자에 59개 모듈을 설치했고 profile-print/export/print/CSS가 현재 레지스트리와 바이트 단위로 같았다. 53개 완전 예제의 타입 검사와 Vite/Pretendard/고지 빌드가 통과했다. 설치본의 전체 예제를 실제 렌더해 7분류를 확인하고 843,956바이트 A4 7쪽 PDF와 7분류·Leadership 상세·인라인 글꼴을 담은 정적 HTML을 다운로드했다.

내용 목적, 대표 상태, 독립 설치와 PDF/HTML 출력을 확인해 `prism-profile-print`를 **58/58번째 완료 그룹**으로 판정한다. 인증된 운영 후보자 데이터·사진/로고 권한, 현재 배포 SHA, OS 실물 출력/저장, 모든 실제 문서의 글꼴·픽셀·쪽 나눔은 확인하지 못했다. 이 범위를 실제 운영 연동 검증으로 보고하지 않는다.

전체 빌드와 PR/CI/preview 결과는 게시 후 덧붙인다.
