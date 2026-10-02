# AppShell 하단 패널 접기 예시

2026-10-03. `AppBottomPanel`은 이름 있는 정적 하단 영역이고,
`Collapsible`은 열림 상태·button의 `aria-expanded`·키보드 조작을
이미 제공합니다. 이 둘을 조합하면 작업 상태나 로그 패널을 접을
수 있어 별도 component나 상태 API를 추가하지 않았습니다.

AppShell 문서 preview의 하단 상태 영역에 `CollapsibleTrigger`와
`CollapsibleContent`를 넣었습니다. Usage에는 필요한
`AppShell`·`Button`·`Collapsible` 설치 item과 조합 코드를
함께 적었습니다. 좁은 화면에서 floating 도움말과 하단 내용이
겹치지 않도록 기존 여백을 유지했습니다. 원본 component 코드나
registry item, npm 의존성은 바뀌지 않았습니다. `Collapsible`의
shadcn/ui 고정 source·MIT 고지는 기존 provenance를 재사용합니다.

`npm run typecheck`, `npm run build`, `npm run registry:release-check`가
통과했습니다. registry 검사는 135개 item·133개 export/catalog와
60개 snapshot을 확인했습니다. 로컬 Chromium에서 하단 내용을
클릭으로 접고 Enter로 다시 열었으며 버튼 focus와 `aria-expanded`가
유지됐습니다. 390px viewport와 document scroll width는 모두
390px입니다. 첫 axe 검사에서 문서의 Operations workspace와
`작업 상태` landmark 이름이 중복돼 preview를 `프로젝트 작업 상태`로
바꿨습니다. 변경 뒤 해당 영역의 axe-core 4.12.1 검사는 violation
0건, incomplete 0건입니다. 실제 screen reader 발표와 공개 사이트
preview는 확인하지 않았습니다.

Goal 관리용 추정은 약 97% 그대로입니다. 브랜치는 133개 component·
135개 registry item, 사용자 production은 이전 공개 130개·132개
기준입니다. 기존 component를 조합한 예시여서 총수는 늘리지
않았습니다.
