# TagsInput 추가

2026-09-29. Inputs 범주의 `TagsInput`을 `@pydemia/ui`, 내부 registry,
문서 preview에 추가했습니다. 로컬 작업 트리는 75개 component,
공용 item 2개를 포함한 registry 77개 item입니다. 공개 배포는
하지 않았습니다.

## 구현 결정

- 문자열 배열을 확정된 태그로 관리하고 입력 중인 draft는 분리합니다.
  앞뒤 공백을 제거하고 대소문자를 무시해 중복을 거부합니다.
- Enter·쉼표로 추가하고, 빈 입력의 Backspace나 이름 있는 버튼으로
  삭제합니다. 쉼표·줄바꿈을 포함한 붙여넣기는 한 번에 추가하며
  후보 중 중복이나 개수 초과가 있으면 전체 추가를 거부합니다.
- 같은 `name`을 가진 hidden input을 태그 수만큼 렌더링합니다.
  미확정 draft가 남아 있거나 `required`인데 태그가 없으면
  native form validity로 제출을 막습니다.
- `outline`·`soft`는 공통 semantic token을 사용합니다. focus는
  입력창이 아닌 전체 입력 영역에 하나의 ring으로 표시합니다.
- 자체 구현이며 외부 component source를 복사하지 않았습니다.
  registry 의존성은 `pyd-utils`만 있고 새 npm dependency는 없습니다.

## 확인 결과

- 문서 Chromium에서 Enter·쉼표 추가, 대소문자 중복 거부,
  Backspace·삭제 버튼, 최대 5개 제한, 필수값 누락, 여러 태그 붙여넣기,
  반복 form 값과 미확정 draft의 제출 차단을 확인했습니다.
  밝은·어두운 모드에서 outline/soft 표시를 확인했습니다.
- 새 Vite fixture
  `%TEMP%/pydemia-ui-tags-input-consumer-20260929`에서 로컬
  registry URL로 설치했습니다. TagsInput·utils·tokens 3개 파일이
  생성됐고 TagsInput 소스는 원본과 일치합니다. 소비자 typecheck·build,
  Chromium의 반복값 제출·미확정 입력 차단을 확인했으며 console
  error는 없습니다. runtime dependency의
  `npm audit --omit=dev --audit-level=high`는 0건입니다.
- 최종 `npm run typecheck`, 기본 공개 URL의 `npm run build`,
  `npm run registry:check`, `git diff --check`가 통과했습니다.
  두 registry 출력에 로컬 URL은 남지 않았습니다. 빌드의 큰 JS chunk
  경고는 남아 있습니다.

실제 screen reader, 다른 브라우저, IME 조합 입력, touch, 전체 registry
item의 새 프로젝트 설치와 공개 배포는 검증하지 않았습니다.
