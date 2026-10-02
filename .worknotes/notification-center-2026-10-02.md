# NotificationCenter 작업 기록

2026-10-02. `NotificationCenter`를 PR #93으로 공개했습니다. 현재
126개 component·128개 registry item·51개 snapshot입니다. goal
관리용 추정은 약 97%입니다.

지속 알림의 읽음 상태를 소비자가 소유하고 전체·읽지 않음 필터,
항목별/전체 읽음 변경, 선택적 열기 요청을 제공합니다. 기존 `Toast`의
일시 안내와 용례가 다릅니다. React·Tailwind 원본 구현이며 `pyd-utils`
외 새 의존성은 없습니다. panel·plain 표시는 공통 token을 씁니다.

로컬 typecheck·대상 테스트 3/3·build를 통과했습니다. Chromium에서
필터, 개별/전체 읽음, 빈 결과, 열기 요청, Enter, 사라지는 행에서
필터로의 focus 이동을 확인했습니다. 390px 가로 넘침과 dark 표시를
확인했고 console error는 0건입니다. provenance 고지를 commit
`e456c9495f35fc4da5337af7a192370e230a7c61`에 고정했습니다.
`registry:release-check`는 128개 item과 51개 snapshot을 검사했고
현재 빌드와 새 snapshot
`sha256-df24f09932e37b9810eca0349087ef73e4fa1bef16098cc73d1f165ba4c5469d`
의 일치를 확인했습니다. 실제 screen reader 발화는 미검증입니다.

PR #93의 Verify UI run `36998027643`과 병합 commit `130da82`의
Verify UI run `36998331998`·Pages run `36998331246`이 성공했습니다.
Vercel production `dpl_CMUja4pBJCSfhRznJ7VfApFdyGVE`는 READY입니다.
공개 preview·Usage와 console error 0건, 현재 item·51번째 snapshot
manifest·변경 item URL의 HTTP 200을 확인했습니다. manifest는 128개
item을 기록합니다. 기존 component 전체의 개별 설치나 보조기술 전수
검사는 이번 릴리스에서 실행하지 않았습니다.
