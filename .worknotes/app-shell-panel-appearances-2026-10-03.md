# AppShell 측면·하단 panel 디자인 선택

2026-10-03. 원래 goal의 화면 구성 요구를 현재 137개 component·17개
범주에 대조했습니다. 전역 탐색, 좁은 화면 drawer가 있는 측면 탐색,
좌우·하단·floating 영역, 분석 화면, 제목·목록·알림, 다섯 가지
spinner 표시는 이미 있습니다. `AppSidebar`와 `AppBottomPanel`은
작동하는 영역이지만 외형 선택은 각각 한 가지였습니다.

두 영역에 `attached`·`inset`을 추가했습니다. 기본 `attached`의
class와 DOM 의미를 유지합니다. `inset`은 가장자리에서 띄우고 공통
border·surface·shadow token을 사용합니다. `aria-label`과 자식
구성, 접기 상태는 호출자가 이전처럼 소유합니다. 원본 React·Tailwind
코드만 바꿨고 새 의존성이나 외부 코드 편입은 없습니다. 기존
provenance의 source·LICENSE·dependency 표기는 유효합니다.

`npm run typecheck`와 대상 SSR 테스트 3/3을 통과했습니다. 기존
`attached`의 테두리·방향, `inset`의 여백·그림자·영역 이름과 잘못된
appearance 거부를 검사했습니다. Chromium의 390px과 1280px에서
`inset`의 측면·하단 배치와 가로 넘침 없음, light/dark 대비를
확인했습니다. 하단 panel 접기·다시 열기, 도움말 열기·Escape 닫기와
trigger focus 복귀가 동작했고 console error는 없었습니다. 실제
screen reader 발표는 실행하지 않았습니다. 기존 `attached`의 DOM·
class는 SSR 검사로 확인했고 시각 회귀 검사는 실행하지 않았습니다.

전체 build와 `registry:check`가 139개 item·137개 component의 정합성을
확인했습니다. 68번째 snapshot ID는
`sha256-d8bd8996d3f0ad4dad3133de01626182d4c111a4c97664864f9b5a32403c194b`이며
재빌드 뒤 `registry:release-check`가 현재 생성물과의 일치를 확인했습니다.
PR #120의 Verify UI와 Vercel preview는 성공했고 `main`의 Verify UI·
Pages도 성공했습니다. Vercel production은 배포 횟수 제한으로 실패했습니다.
`ui.pydemia.ai`의 68번째 snapshot manifest는 HTTP 404이며 현재
`pyd-app-shell.json`은 새 생성물과 바이트가 다릅니다. 그러므로 저장소와
CI의 공개 준비는 확인했지만 사용자 도메인의 새 표시 형태는 공개
확인으로 세지 않습니다. 배포가 가능해지면 manifest와 새 item의
내용 일치를 확인해야 합니다. Goal 관리용 추정은 약 98%입니다.
