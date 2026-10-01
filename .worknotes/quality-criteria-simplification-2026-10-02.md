# 공급·품질 기준 재검토: 반복 검사 축소

2026-10-02. 현재 109개 component·111개 registry item·28개 snapshot을
공개했습니다. 이 문서는 검사 실행이나 새 릴리스의 증거가 아니라,
앞으로의 변경을 판정할 때 적용할 기준입니다.

## 재검토 결과

기존 10개 체크박스는 성격과 종료 시점이 다른 누적 과제를 한 분모에
넣었습니다. 보조기술 실사용, 여러 환경의 표본, rollback 뒤 URL 보존은
한 component를 공개할 때마다 끝낼 수 있는 일이 아닙니다. `5/10`은
신규 component 공급률이나 품질 점수로 사용하지 않습니다.

2026-10-02의 앞선 재조정으로 동일 commit의 CI 재실행, 기존 component의
표시 속성에 대한 소비자 재설치, 공개 후 CLI 재설치는 기본 조건에서
빠졌습니다. 아직 표준 registry 경로를 그대로 쓰는 새 component마다
별도 소비자 설치를 요구합니다. `registry:check`는 소스·export·catalog
대응, registry import와 npm 의존 선언, provenance·고지, 컴파일된
파일과 원본의 일치, Usage 구문·설치 item 대응을 검사합니다.
`registry:release-check`는 snapshot과 현재 빌드의 일치를 확인합니다.
따라서 같은 설치 형식의 item을 매번 수동 설치할 필요는 없습니다.

## 적용 기준

- 모든 코드 변경은 동일 commit의 typecheck, 관련 테스트, build,
  `registry:release-check` 통과를 확인합니다. CI 결과를 사용할 수
  있습니다. 변경한 Usage와 preview를 확인합니다. 문서만 바뀌었다면
  문서 build와 변경한 링크·Usage·preview만 확인합니다.
- 새 component에는 독립 사용처, 공개 export, registry item,
  provenance, 동작하는 preview·Usage가 필요합니다. 참고한 upstream의
  공식 문서·고정 revision 소스·LICENSE·의존성·접근성을 확인합니다.
  이미 조사한 동일 revision은 기록을 재사용합니다.
- 상호작용을 바꾸면 영향받은 값·keyboard·focus 흐름을 회귀 테스트와
  브라우저에서 확인합니다. 표시만 바꾸면 변경한 상태를 확인하고,
  색상·배치가 영향을 받는 경우에만 해당 theme·좁은 화면을 확인합니다.
- 소비자 CLI 설치·typecheck·build는 **설치 방식이나 의존 경로가
  새로워질 때** 필수입니다. 예를 들어 새 npm·registry 의존성 체인,
  token 전달, 설치 target, 파일 형식, CLI·배포 경로 변경이 해당합니다.
  표준 경로의 신규 item은 저장소 검사와 preview로 공급을 판정하고,
  별도 설치를 하지 않았다면 해당 item의 소비자 설치는 미검증으로
  기록합니다. 릴리스 묶음에서 표준 item 하나를 표본 설치할 수
  있으나, 이를 다른 item의 개별 설치 검증으로 확대하지 않습니다.
- registry 내용이 바뀌면 snapshot 검사와 공개 manifest·변경 item의
  URL 도달을 확인합니다. 공개 URL을 통한 CLI 설치는 설치·의존 URL
  또는 배포 경로 변경에 적용합니다. 하나의 릴리스 묶음 안에서
  공개 확인을 한 번 수행합니다.

확인된 값 손실·제출 오류·keyboard 진입 또는 탈출 불가·필수 라이선스
고지 누락·설치/build 실패는 수정판의 해당 경로가 통과하기 전까지
출시 완료로 표시하지 않습니다. 실제 screen reader·touch·Safari·
RTL과 rollback 뒤 URL 보존은 별도 품질 작업으로 추적합니다.
검사하지 않은 환경을 통과했다고 쓰지 않습니다.

이번 검토에서 코드를 변경하거나 검사를 실행하지 않았습니다.
component 109개·registry item 111개·snapshot 28개와 goal의 관리용
추정 **약 84%**는 그대로입니다. 새 기준은 남은 작업을 줄여
계산한 완료율이 아니라 중복 실행을 줄이기 위한 판정 방식입니다.
