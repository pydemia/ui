# 공급·품질 체크리스트 재검토

2026-10-02. 공개 기준은 111개 component, 113개 registry item,
30개 snapshot입니다. 이번 검토는 판정 문구와 기록 방식의 변경이며
새 기능·실행 검증·배포를 추가하지 않습니다. Goal 관리용 추정은
약 86% 그대로입니다.

## 확인한 문제

로드맵의 10개 체크박스에는 현재 릴리스의 자동 검사, 2026-09-29의
소비자 설치 실험, 오래된 component 재검사, 실기기·보조기술 표본,
rollback 뒤 URL 보존이 함께 들어 있습니다. 각 항목의 범위와
종료 시점이 달라 `5/10`을 품질 수준이나 신규 공급률로 읽으면
실제 결과를 왜곡합니다. 항목 안의 `현재 90개` 같은 수치도 당시
조사 기록인데 현재 규모로 오해하기 쉽습니다.

실제 `Verify UI` workflow는 PR과 main push에서 typecheck,
UI 테스트, build, `registry:release-check`를 실행합니다.
`registry:release-check`는 `registry:check`를 포함하며 export·
registry·catalog 대응, 의존 선언, provenance·고지, 생성 source,
Usage와 snapshot을 검사합니다. 같은 commit에 대한 수동 재실행이나
표준 item별 소비자 프로젝트 설치를 출시 조건으로 더할 근거는
없습니다.

## 적용할 기준

릴리스에서 실제로 바뀐 경로만 검사합니다. 새 component의 사용처·
동작 규칙·export·registry·문서, 참고한 upstream의 공식 자료와
LICENSE 확인은 유지합니다. 코드 변경의 CI 결과를 인정하고,
상호작용은 영향받은 값·keyboard·focus, 표시 변경은 해당 상태와
영향받은 화면 크기·theme만 실행합니다. 설치 형식·target·의존
경로가 달라질 때 소비자 설치를 요구합니다. registry 변경은
snapshot과 공개 manifest·변경 item URL을 릴리스 묶음당 한 번
확인합니다.

각 검사는 적용 여부와 통과·미검증·차단 상태로 기록합니다. 적용되는
검사를 실행하지 못하면 공급 완료로 표시하지 않습니다. 실행하지
않은 개별 CLI 설치나 screen reader·touch·Safari·RTL 검사를
통과로 바꾸지도 않습니다. 이 환경들을 지원한다고 명시할 때는
해당 환경의 검사를 앞당깁니다.

추가 검토에서 남은 중복을 확인했습니다. 로컬 브라우저에서 변경한
동작을 검증하고 같은 산출물을 배포했다면 공개 사이트에서 같은
시나리오를 재실행하는 것은 기본 조건이 아닙니다. 공개 단계에서는
배포 상태와 변경된 preview·registry URL의 도달을 확인합니다.
외부 component 코드를 편입하지 않은 원본 구현에는 upstream 코드와
LICENSE의 동일 revision 대조를 적용하지 않습니다. 플랫폼 명세와
재사용한 기존 component의 출처는 기록합니다. 이 조정은 자동 검사,
값·keyboard·focus의 변경 흐름 검증, 확인된 주요 결함의 차단을
줄이지 않습니다.

변경 흐름에서 재현된 값 손실·제출 오류·keyboard 접근 불가·필수
라이선스 고지 누락·설치 실패는 수정판 검증 전까지 차단합니다.
오래된 component 전수 검사, 모든 item의 개별 설치, 실제 보조기술
표본과 rollback 뒤 URL 보존은 별도 운영·품질 과제로 추적합니다.
이는 현재 릴리스의 통과 판정과 독립된 미해결 위험입니다.

`CodeEditorShell` 공개 기록을 이 기준에 대조하면 새 사용처·출처·
export·registry·preview·Usage, CI, 입력·제출·focus 브라우저 동작,
snapshot·공개 URL이 확인됐습니다. 기존 `pyd-textarea` 경로를
재사용해 별도 소비자 CLI 설치는 적용 조건이 아닙니다. 실제
screen reader·touch·Safari·RTL과 rollback 보존은 미검증으로
남습니다. 이 분리는 이미 검증한 공급을 인정하면서도 지원 범위를
부풀리지 않습니다.

로드맵의 현재 판정 구간을 적용 시점별 표로 바꾸고, 10개 체크박스는
당시 조사 기록임을 명시했습니다. 과거 `5/10`을 새 점수로 대체하지
않습니다. 보고에는 변경분의 통과·미검증·차단과 goal 관리용 추정을
각각 적습니다.
