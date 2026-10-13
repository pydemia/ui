# 프로필 내부 섹션 재감사 (2026-10-14)

기준 소스: `prism/frontend` `dev` = `origin/dev` `2eeb26ff10274745f9d86897c2f2828bff002b98`. 대상은 목표 58개 중 `prism-profile-sections` 한 그룹이다. 헤더와 탭은 완료 판정된 `prism-profile`, 코멘트 CRUD는 `prism-mgmt-comments`, 인쇄 페이지는 `prism-profile-print`에서 따로 판정한다.

원본 8개 탭과 수정 전 설치용 레시피를 대조한 결과:

| 탭 | 원본의 표시 목적 | 현재 차이 |
| --- | --- | --- |
| 종합 | SUMMARY, 기본 정보, 경력, 보상 | 빈 보상 표의 행 구조와 외화 값 표시를 점검해야 함 |
| 전문성 | SUMMARY, 전문 분야·대표 업적, 6 Frame Survey | 레시피의 마지막 항목이 Survey가 아닌 일반 근거 목록 |
| 성공경험 | SUMMARY, 대표 경험 우선 선택·영역별 Essay, 좌절·실패 Essay | 레시피가 일반 점수·경험 카드로 구성되어 키워드·AI 인터뷰·실패 항목을 표현하지 못함 |
| Design 역량 | 등급 SUMMARY, 점수 Essay, 6 Frame Survey, 경험 다양성·현재 위치 | 현재 레시피에는 Essay·Survey·다양성 요약이 없음 |
| Learning Agility | 등급 SUMMARY, 점수 Essay, Survey, 관련 경험 2축 | 현재 레시피에는 Survey가 없고 점수 Essay만 SUMMARY 자리에 놓임 |
| Attitude | SUMMARY, 성격·가치관, 위험, Survey, PDF | `PrismAttitudeReport`에 대응 기능이 있음. 통합 예제에서 상태와 문서 액션 확인 필요 |
| Leadership | 파이 SUMMARY, Survey, 역할별 강점·개선, 연도별 추이 | 현재 레시피의 Radar·근거 목록은 원본 Survey의 대체가 아님 |
| Mgmt. Comments | ELP/CEO 의견과 CEO 작성·수정·삭제 | `PrismMgmtComments` 별도 그룹이므로 이 그룹에서는 조합과 탭 상태만 확인 |

검증 범위: 원본 목적을 표현하는 typed props와 대표 합성 예제를 추가하되 기존 설치자 계약은 유지한다. 빈 값·실제 0·긴 텍스트·320px 스크롤과 각 탭 상태를 로컬 및 독립 설치본에서 확인한다. 인증된 배포 전체 프로필과 기준 소스 SHA의 연결은 별도 미검증으로 남긴다.

현재 구현: `PrismExpertiseSection`에 Survey 경로를 추가했다. `PrismSuccessExperienceSection`은 대표 영역 기본 선택, controlled 영역 변경, 영역별 Essay, 키워드, AI 인터뷰, 좌절·실패 항목을 표현한다. `PrismDesignSection`은 등급 SUMMARY·점수 Essay·Survey·회사/Function 다양성과 현재 위치를 조합하고, `PrismAgilitySection`은 Survey와 관련 경험을 포함한다. `PrismLeadershipSection`은 기존 Radar/근거 목록 경로를 유지하면서 원본 Survey 경로를 받는다. 종합 탭의 중복 SUMMARY 제목을 제거했고, 빈 보상 표에는 호출자가 제공한 연도의 총보상·연봉·IB 행을 유지한다. 실제 0과 null은 별도로 표시한다. 이 새 경로는 catalog 예제와 8개 탭 합성 미리보기에 반영했다.

로컬 브라우저: 320px에서 8개 탭을 열어 구성과 문서 폭 320px 유지를 확인했다. Design 위치 표는 254px 영역 안에서 320px 콘텐츠가 내부 스크롤됐다. 긴 내용의 전문성·성공경험·Design·Learning Agility·Leadership 탭도 문서 폭을 늘리지 않았다. 오류 상태는 이전 내용을 숨기고 재시도 후 합성 데이터를 복원했다. 로딩과 빈 결과를 별도로 확인했다. 빈 리더십 추이는 불필요한 차트·표 없이 안내를 표시하고, 종합의 빈 보상 표는 호출자가 제공한 연도의 총보상·연봉·IB 행을 유지했다. 별도 shadcn 설치본은 59개 모듈과 CSS 바이트 일치, 43개 예제 타입 검사, Vite·폰트·고지가 통과했고 320px 컨테이너 안에서 262px Design 위치 영역의 320px 콘텐츠가 내부 스크롤됐다. 성공경험 영역 변경과 Survey 0점도 표시했다. 이 검증은 합성 데이터와 로컬·설치본에 한정된다.

판정: 원본 8개 분류의 표시 목적과 대표 상태가 컴포넌트 계약·예제·독립 설치본에서 확인됐다. 문제가 있는 빈 차트/표와 좁은 위치 표는 개선으로 기록한다. PRISM 테스트 327개, workspace typecheck, site build, registry release check가 통과했다. `prism-profile-sections`를 새 기준으로 완료 판정해 **14/58개**, 미판정 44개로 기록한다. 인증된 배포 전체 프로필과 배포 SHA의 연결은 확인하지 못했다. PDF·코멘트 저장과 실제 API·권한 처리는 별도 그룹 또는 호스트 범위다.
