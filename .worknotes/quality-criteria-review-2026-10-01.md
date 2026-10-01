# 공급·품질 기준 재검토

## 관찰

기존 10개 체크리스트는 성격이 다른 작업을 한 분모에 넣었습니다.
component와 registry의 대응, 새 소비자 설치, token 전달처럼
릴리스에서 반복 확인할 항목과 오래된 component의 실기기 재검사,
실제 screen reader 검사, Vercel rollback 뒤 URL 보존처럼
라이브러리 전체에서 해결할 항목이 섞여 있습니다.

2026-10-01 현재 105개 component·107개 registry item·23개
불변 snapshot이 있습니다. `TreeSelect`는 공개 snapshot을 새
소비자에 설치해 파일 일치·typecheck·build·390px Chromium의
필수 오류·키보드 선택·제출·반복 reset을 확인했습니다. 첫 공개
snapshot에서 발견한 native reset 오류는 수정판에서 해결했습니다.
그런데 기존 10개 중 완료 표시는 여전히 5개입니다. 이 값은
라이브러리 전체 과제의 완전 종료 수이지 새 component의 공급
성과를 뜻하지 않습니다.

| 기존 항목 | 현재 판정 | 남은 범위 |
| --- | --- | --- |
| export·registry·provenance·문서 대응 | 부분 | 자동 대응 검사는 통과, 전체 Usage의 수동 재검토 |
| 전체 registry의 별도 소비자 설치 | 완료 | 이후 추가분은 릴리스별 검사 |
| 기존 상호작용 재검사 | 부분 | 실제 drag·touch·다른 시간대 등 |
| 실제 보조기술 검사 | 미검증 | 대상·브라우저 범위 선정과 실행 |
| 버전·변경·호환·회귀 절차 | 부분 | 과거 provenance와 장기 호환 확인 |
| snapshot 묶음과 주소 보존 | 부분 | rollback 뒤 최신 URL 유지 |
| token 설치 | 완료 | 이후 변경분은 릴리스별 검사 |
| shadcn 수정 소스 개별 설치·고지 | 완료 | 새 수정 소스가 생기면 추가 검사 |
| 소비자 갱신·충돌·복구 | 완료 | 이후 변경분은 영향에 따라 검사 |
| package·registry import 구분 | 완료 | 이후 Usage 변경분은 검사 |

## 앞으로의 판정

검증 강도는 변경 범위에 맞춥니다. 모든 변경에 같은 목록을
기계적으로 적용하지 않습니다.

| 변경 범위 | 해당 릴리스에서 확인할 것 |
| --- | --- |
| 문서·예제만 변경 | 링크·사용 코드·preview의 변경 부분과 문서 build |
| 기존 component의 모양·token 변경 | typecheck·build·registry 검사와 해당 상태의 좁은 화면·light/dark 표시 |
| 값·focus·keyboard·form 동작 변경 | 위 검사와 영향받은 흐름의 회귀 테스트·브라우저 동작 |
| 새 공개 API·registry item·의존성 변경 | export·provenance·사용 코드·공개 snapshot을 대조하고 별도 소비자에서 설치·typecheck·build |

새 component는 독립된 사용처와 동작 규칙을 먼저 확인합니다.
upstream을 참고하면 공식 문서, 같은 revision의 소스·LICENSE·
의존성을 확인하고 자체 구현과 복사·수정 소스를 구분합니다.
공개 source가 바뀌는 릴리스는 `registry:release-check`와 snapshot
주소 확인을 포함합니다. 동일한 릴리스에서 여러 item을 바꾸면
소비자 검사는 변경된 dependency 조합을 대표하는 설치로 묶을 수
있으며, 각 item의 단독 설치까지 통과했다고 표현하지 않습니다.
영향받는 동작을 실행하지 못한 환경은 미검증으로 적습니다. 주요
결함을 발견하면 수정판의 해당 흐름을 다시 확인하기 전까지 완료로
표시하지 않습니다.

오래된 component 전체의 실기기 검사, 보조기술·touch·Safari·RTL,
item별 격리 설치, rollback 보존은 별도 품질 작업으로 추적합니다.
특정 환경을 지원한다고 주장할 때는 그 환경에서 검사해야 합니다.
이 범위를 새 component마다 무조건 요구하면 이미 확인된 공급
성과가 계속 0으로 계산됩니다. 반대로 미검증 환경을 통과로
계산하지도 않습니다.

작업마다 현재 component·registry item 수, 해당 변경의 출시
검증 상태, 전체 과제의 완료·부분·미검증 수, 전체 goal의 관리용
추정치를 함께 보고합니다. 이번 기준 재검토는 구현이나 검증
범위를 추가하지 않았으므로 goal 추정은 약 80% 그대로입니다.
