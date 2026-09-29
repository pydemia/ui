# CommandPalette 구현과 검증

2026-09-29. 중급 제품 화면에서 빠른 이동과 작업 실행을 한곳에
모으기 위해 `CommandPalette`를 추가했습니다. trigger 또는
Ctrl/Cmd+K로 열고 label·keywords로 검색합니다. 그룹별 목록,
disabled 명령, 빈 검색 결과, 방향키 순환과 Enter 실행을 지원합니다.
선택 결과는 `onSelect(id)`로 소비자에게 전달하며 실제 화면 이동이나
작업 실행은 소비자가 처리합니다. controlled `open`과 uncontrolled
`defaultOpen`을 모두 지원합니다.

기존 `Dialog`와 `Input`을 조합한 원본 구현입니다. modal focus와
Escape는 Radix Dialog에 맡기고, 검색 입력은 focus를 유지한 채
`aria-activedescendant`로 현재 명령을 표시합니다. 직접 registry
의존성은 `pyd-dialog`, `pyd-input`이며 새 npm dependency는 없습니다.
WAI-ARIA APG Combobox와 Radix Dialog 공식 문서, 기존 Dialog wrapper의
shadcn/ui 고정 revision source·동일 revision MIT LICENSE를
확인했습니다. 설치된 `@radix-ui/react-dialog@1.1.23`의 manifest,
배포 소스와 MIT LICENSE도 확인했습니다. 출처 링크는
`research/source-inventory.md`에 있습니다.

`@pydemia/ui` export, 내부 registry item, 문서의 동작하는 preview와
사용 코드를 연결했습니다. 로컬 Chromium에서 trigger·Ctrl+K,
키워드 검색, 빈 결과, disabled 명령 건너뛰기, 방향키 순환,
Enter 실행, Escape와 trigger focus 복원을 확인했습니다. controlled
preview의 열기·닫기와 단축키도 확인했습니다. 390px viewport에서
dialog 폭은 358px이고 문서 가로 넘침은 없었습니다. 서버 렌더링에서
정상 trigger와 중복·공백 ID, 빈 label 거부를 확인했습니다. 로컬
registry의 63개 item을 생성하고 기존 Vite 소비자 fixture에
`shadcn add`로 설치해 import·render의 typecheck와 build가
통과했습니다.

최종 저장소 `npm run typecheck`, `npm run build`,
`npm run registry:check`, `git diff --check`도 통과했습니다. 생성된
63개 item은 공개 기본 URL을 사용하며 로컬 URL이 남지 않았습니다.
`aria-activedescendant`의 실제 option 연결과 pointer 선택도
브라우저에서 확인했습니다.

실제 screen reader 발표, touch·RTL, 여러 팔레트를 한 페이지에 둔
경우의 단축키 우선순위, 전체 registry item의 새 소비자 설치와 원격
배포는 확인하지 않았습니다. 결과는 `research/verification.md`에도
기록했습니다.
