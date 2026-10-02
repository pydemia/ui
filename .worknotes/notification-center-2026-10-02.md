# NotificationCenter 작업 기록

2026-10-02. 공개 기준은 125개 component·127개 registry item·50개
snapshot, goal 관리용 추정은 약 97%입니다. 이번 변경의 새
`NotificationCenter`는 로컬 후보입니다. 공개 수량과 진척도에는 아직
포함하지 않습니다.

지속 알림의 읽음 상태를 소비자가 소유하고 전체·읽지 않음 필터,
항목별/전체 읽음 변경, 선택적 열기 요청을 제공합니다. 기존 `Toast`의
일시 안내와 용례가 다릅니다. React·Tailwind 원본 구현이며 `pyd-utils`
외 새 의존성은 없습니다. panel·plain 표시는 공통 token을 씁니다.

로컬 typecheck·대상 테스트 3/3·build를 통과했습니다. Chromium에서
필터, 개별/전체 읽음, 빈 결과, 열기 요청, Enter, 사라지는 행에서
필터로의 focus 이동을 확인했습니다. 390px 가로 넘침과 dark 표시를
확인했고 console error는 0건입니다. registry 고지 pin, snapshot,
PR CI와 공개 URL은 아직 확인하지 않았습니다. 실제 screen reader
발화는 미검증입니다.

다음 작업은 provenance 고지 pin과 snapshot 생성, registry 검사,
PR·공개 경로 확인입니다. 같은 commit의 CI와 릴리스당 한 번의 공개
manifest·변경 item URL 확인을 적용합니다. 기존 component 전체의
개별 설치나 보조기술 전수 검사는 이 릴리스의 차단 조건이 아닙니다.
