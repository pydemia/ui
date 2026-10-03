# Autocomplete 작업 기록

2026-10-03. 기존 `Combobox`는 목록의 ID를 선택해야 form에 값을
전달합니다. 새 팀·태그 후보처럼 추천 목록 밖의 이름을 입력할 수 있는
필드에는 별도 문자열 규칙이 필요합니다. `Autocomplete`는 입력한
텍스트 하나를 native form에 전달하고 추천어는 입력을 돕는 선택적
목록입니다. component 수를 맞추기 위한 별칭이 아닙니다.

원본 React·Tailwind 코드이며 `pyd-input`·`pyd-utils`를 재사용하고
새 npm 의존성은 없습니다. W3C APG의 manual list autocomplete
동작을 참고했고 예제 코드는 복사하지 않았습니다. 추천어 선택 전의
입력, IME, Escape, reset, loading과 controlled 값을 대상 테스트
4개로 확인했습니다. 전체 UI 테스트 251/251, typecheck·build,
PRISM 검사 23/23이 통과했습니다. 로컬 Chromium의 390px preview에서
자유 텍스트 제출, 방향키·Enter와 마우스 추천어 선택을 확인했습니다.
registry 고지·snapshot과 공개 경로는 계속 확인합니다. 실제 screen
reader·touch·Safari·RTL은 아직 실행하지 않았습니다. Goal 관리용
추정은 약 98%로 유지합니다.
