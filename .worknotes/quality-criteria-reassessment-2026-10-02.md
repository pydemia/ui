# 공급·품질 기준 재조정

이 문서는 당시의 판정 기록입니다. 현재 적용 기준은
[반복 검사 축소](quality-criteria-simplification-2026-10-02.md)와
[로드맵의 판정 단위](component-roadmap.md#공급과-품질의-판정-단위)를
참고하세요.

2026-10-02. 기존 10개 체크박스는 라이브러리 전체의 누적 과제이며
릴리스별 품질 점수가 아닙니다. 이번에는 실제 작업 기록과 CI 구성을
대조해 릴리스 검사 자체의 부담을 다시 검토했습니다.

## 관찰

- `Verify UI`는 typecheck, UI 테스트, build,
  `registry:release-check`를 PR과 `main` push에서 실행합니다.
  `registry:release-check`는 `registry:check`를 포함합니다.
- 직전 ActionBar·CopyButton 작업은 로컬 소비자 설치, 공개 snapshot
  재설치, 두 소비자의 typecheck·build·브라우저 흐름, PR과 병합 후 CI,
  파일별 해시 대조를 반복했습니다. 새 component와 의존 경로가
  생긴 작업에는 소비자 검사가 유효했지만, 모든 변경에서 같은
  반복이 필요하다는 근거는 없습니다.
- 앞선 재검토는 10개 누적 과제를 새 component의 출시 조건에서
  분리했지만, 새 공개 API나 registry item 변경마다 별도 소비자
  설치·공개 snapshot 대조를 요구했습니다. 기존 component의
  표시 속성 추가에도 설치 경로 검사를 반복하게 됩니다.

## 적용 기준

| 변경 | 필수 확인 | 추가 확인 조건 |
| --- | --- | --- |
| 문서·예제만 | 변경한 링크·Usage·preview, 문서 build | 실행 흐름이 있는 예제면 그 흐름 |
| 기존 component의 표시·token·타입 | typecheck, 관련 테스트, build, registry 검사, 변경한 상태의 preview | token이나 layout 영향이 있으면 light/dark·좁은 화면 |
| 값·form·keyboard·focus 동작 | 위 검사와 해당 흐름의 회귀 테스트·브라우저 실행 | touch·보조기술 등을 지원한다고 주장하거나 변경이 그 경로에 영향을 줄 때 |
| 새 component·설치 경로·의존성 체인 | 출처·LICENSE·의존성·접근성 검토, export·registry·Usage 대조, 대표 소비자 설치·typecheck·build | 독립된 새 의존 경로나 target이 있을 때 별도 소비자 |
| registry 산출물·배포 설정 | 내용 해시 snapshot 검사와 공개 URL 도달 확인 | 설치 형식·의존 URL·배포 경로가 바뀌면 공개 URL 설치 |

저장소 검사는 CI가 동일 commit에서 통과한 결과를 사용할 수
있습니다. 실패를 수정했다면 수정 commit에서 관련 검사를 다시
실행합니다. 로컬과 공개 환경을 모두 시험한 경우 각각 결과를
적되, 같은 소비자 시험을 두 번 하는 것을 기본 조건으로 두지
않습니다. 공개 확인은 manifest와 변경 item의 도달 여부가
기본이며, 모든 JSON의 수동 해시 비교는 요구하지 않습니다.

기존 component의 새 표시 속성은 새 공개 API이지만 설치 경로가
그대로라면 문서 Usage의 타입 검사와 변경한 preview 확인으로
충분합니다. 현재 진행 중인 Card·Alert 표시 형태 확장도 이 기준을
적용합니다. 새 소비자 CLI 재설치는 필요하지 않습니다.

같은 upstream revision에 대해 이미 확인한 공식 문서·소스·
LICENSE·의존성 기록은 다시 사용할 수 있습니다. 새 upstream이나
revision을 도입하면 직접 확인합니다. 라이선스 고지 누락, 설치·
build 실패, 값 손실, 제출 오류, keyboard 진입·탈출 불가처럼 확인된
주요 결함은 해당 수정판을 검증하기 전까지 출시 완료로 보지
않습니다. 실제 screen reader·touch·Safari·RTL과 rollback 뒤 URL
보존은 별도 품질 과제로 남기고, 검사하지 않았다는 사실을 기록합니다.

이번 재검토는 새 기능·실행 검증·공개 배포를 추가하지 않았습니다.
공개 기준은 109개 component·111개 registry item·27개 snapshot,
goal 관리용 추정은 **약 83% → 약 83%**입니다. 10개 누적 과제는
완료 5·부분 4·미검증 1이며 공급률로 사용하지 않습니다.
