# Table·DataTable 표시 형태 — 2026-10-03

## 선정과 구현

기존 `Card`, `Alert`, `PageHeader`에는 외형이나 크기 선택지가 있지만
`Table`은 한 형태였고 `DataTable`이 이를 그대로 사용했습니다. 데이터
비교용 격자와 panel 안에 놓는 경계선 없는 표가 실제 화면 용례와
구분됩니다. 두 component에 `lined`(기본값), `grid`, `plain`을
제공했습니다. `DataTable`은 선택을 내부 `Table`에 전달합니다.
caption·열 머리글·정렬·선택·페이지 동작은 기존 native 구조를
유지합니다.

격자·경계선 제거 selector는 현재 표의 행 셀에만 적용해 중첩 표로
번지지 않습니다. 선 색은 공통 `--border` token을 사용합니다.
`Table`과 `DataTable`은 기존 provenance에서 pydemia/ui 원본 구현이며
새 외부 코드는 편입하지 않았습니다. registry 의존성과 설치 경로도
변경하지 않았습니다.

문서에는 두 component의 Usage와 실제 선택 가능한 preview를
추가했습니다. `DataTable` preview는 로컬·remote 모드 모두에서
외형 선택을 공유합니다.

## 검증

- 대상 SSR 테스트 3/3: 세 외형의 native caption·열 머리글과
  `DataTable` 전달, 기본값, 미지원 값 거부를 확인했습니다.
- `npm run typecheck`, UI 전체 테스트 273/273, `npm run build`,
  `npm run registry:release-check`가 통과했습니다. release 검사는
  79개 snapshot과 현재 빌드의 일치를 확인했습니다.
- 로컬 Chromium의 `Table` preview에서 세 형태를 전환하고 실제
  셀 테두리 차이를 확인했습니다. `DataTable`의 로컬·remote 모드에
  같은 선택이 전달되고 행 내용·선택 control이 유지됨을 확인했습니다.
  어두운 테마의 remote plain 표시도 확인했습니다.
- 79번째 schema 2 snapshot 후보
  `sha256-9d82f7d730145c945cce6dbc2e2bf6a7953158da9a6cdc26899afa543ef88a3f`를
  146개 item으로 생성했습니다.

실제 screen reader·touch·Safari는 실행하지 않았습니다. 이번에는
keyboard 동작과 form 값 처리 코드를 바꾸지 않았고 browser에서 기존
조작을 반복하지 않았습니다. PR CI와 공개 URL은 아직 확인 전입니다.
설치 형식이 그대로여서 격리 소비자 설치는 반복하지 않았습니다.

새 component는 없으며 후보 수량은 144개 component·146개 item입니다.
Goal 관리용 추정은 **약 99% → 약 99%**입니다.
