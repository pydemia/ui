# MultiSelect 구현과 검증

2026-09-29. 기존 `Select`와 `Combobox`는 단일 값을 선택합니다.
`MultiSelect`는 검색 가능한 checkbox 목록에서 여러 값을 선택하고,
선택된 항목을 chip으로 제거합니다. 선택 순서를 유지하며 이름을 지정하면
native `<select multiple>`이 같은 이름의 form 값들을 제출합니다.
필수값이 비어 있으면 오류를 표시하고 목록을 엽니다. `maxSelections`에
도달하면 선택되지 않은 항목을 비활성화합니다. 항목 목록은 최대 높이를
두고 스크롤할 수 있습니다.

`@pydemia/ui` export, 내부 `pyd-multi-select` registry item, 문서
preview와 사용 코드를 추가했습니다. 직접 registry 의존성은 기존
`pyd-input`, `pyd-popover`, `pyd-utils`입니다. 외부 MultiSelect 소스는
복사하지 않았습니다. W3C WAI의 checkbox 그룹 지침과 Radix Popover
공식 문서를 확인했습니다. 기존 shadcn/ui Popover wrapper의 고정
revision source와 같은 revision MIT LICENSE를 확인했고, 설치된
`@radix-ui/react-popover@1.1.23`의 manifest, 배포 소스와 MIT LICENSE도
확인했습니다. 링크는 `research/source-inventory.md`에 있습니다.

로컬 브라우저에서 빈 필수값 오류, 검색 결과, 두 개 선택 상한과 disabled
항목, 복수 form 값 제출, chip 제거 후 focus 복원, 초기화를 확인했습니다.
Enter로 열기, Tab으로 checkbox 이동, Space 선택, Escape로 닫기와
trigger focus 복원을 확인했습니다. 서버 렌더링에서 복수 선택 값과
잘못된 label·option·선택 값·상한을 검사했습니다. 로컬 registry의
62개 item을 생성하고 기존 Vite 소비자 fixture에 `shadcn add`로
설치했습니다. 전이 의존성이 포함된 import·render의 typecheck와
build가 통과했습니다.

저장소 `npm run typecheck`, `npm run build`, `npm run registry:check`,
`git diff --check`도 통과했습니다. 첫 build는 두 Vite 앱의 build가
끝난 뒤 `docs/index.html` 기록에서 Windows 파일 열기 오류로
종료됐고, 동일 명령을 재실행해 통과했습니다. 생성된 62개 registry
item에는 로컬 URL이 남지 않았습니다.

실제 screen reader 발표, touch·RTL 동작, 대량 option 성능,
uncontrolled 상태에서 native form reset, 전체 registry item의 새
소비자 설치, 원격 배포는 확인하지 않았습니다. 문서 preview는 controlled
상태를 사용합니다. 저장소 전체의 검사 결과는
`research/verification.md`에 기록했습니다.
