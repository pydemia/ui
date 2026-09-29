# SegmentedControl 추가

2026-09-29 로컬 작업 트리. 화면 밀도처럼 한 옵션을 고르고 그 값을
form에 제출하는 설정에 사용합니다. 기존 `ToggleGroup`은 pressed
상태를 표시하지만 form 값을 내보내지 않습니다. 기존 `RadioGroup`의
원형 항목과 별도 label 배치는 그대로 둡니다. 새 component는 가로
분할 형태와 native radio의 form 동작을 함께 제공합니다.

`SegmentedControl`은 필수 `label`과 `name`, controlled `value` 또는
uncontrolled `defaultValue`, `onValueChange`, `required`, `disabled`를
받습니다. 각 item의 `value`와 보이는 문자열 이름도 필수입니다.
`fieldset`·`legend`와 native radio가 이름·선택·제출을 담당합니다.
item은 그룹의 직접 자식으로 두며 빈 그룹과 중복 `value`는 오류로
알립니다.
색·간격·초점 표시는 공통 token을 사용합니다. 좁은 영역에서는
항목을 숨기지 않고 내부를 가로로 스크롤합니다.

처음에는 설치된 Radix Radio Group `1.4.7`로 구현했습니다. 이번
Chromium 자동 조작에서는 ArrowLeft가 focus를 옮겨도 값은 그대로
남았습니다. 브라우저 자동 입력 방식과 library 동작 중 원인은
분리하지 못했으므로 upstream 결함으로 단정하지 않습니다. 최종
구현은 native radio로 바꾸었고 같은 조작에서 focus와 선택값이
함께 바뀌는 것을 확인했습니다. 최종 코드에 Radix runtime이나
외부 component source는 들어가지 않습니다. 참고한 W3C 패턴과
처음 검토한 Radix 문서·동일 설치 버전 source·MIT LICENSE는
`research/source-inventory.md`에 기록했습니다.

public export, `pyd-segmented-control` registry item, provenance,
문서의 실제 preview·사용 코드를 추가했습니다. 로컬 총수는
88개 component·90개 registry item입니다.

## 검증

- `npm test -w @pydemia/ui`: 41개 통과. 새 테스트는 group의
  native 의미·form name과 빠진 label·name 오류를 검사합니다.
- 저장소 `npm run typecheck`, `npm run build`,
  `npm run registry:check`: 통과. build의 500KB 초과 chunk 경고는
  남아 있습니다.
- 문서 Chromium: 기본→밀집 클릭, ArrowLeft로 기본 선택,
  `compact` form 제출, disabled 항목, 밝은·어두운 모드와 390px
  표시를 확인했습니다.
- 개별 fixture
  `C:\Users\pydemia\AppData\Local\Temp\pydemia-ui-segmented-final-consumer-20260929`:
  `shadcn@4.21.0 add`로 item·utils·tokens 3개 파일 설치,
  component 소스 일치, typecheck·build 통과.
- 최종 소스의 전체 fixture
  `C:\Users\pydemia\AppData\Local\Temp\pydemia-ui-all-registry-90-final-consumer-20260929`:
  CLI 4.21.0으로 90개 item 동시 설치, 92개 생성 파일의 JSON 내용
  일치, 모든 component 모듈의 typecheck·build 통과. Chromium에서
  207개 값 export 로딩, console error 0건을 확인했습니다.

전체 설치의 첫 시도는 기본 registry JSON에 원격 dependency URL이
들어 있어 아직 공개되지 않은 `pyd-time-picker`를 찾지 못했습니다.
`PYDEMIA_REGISTRY_BASE_URL=http://127.0.0.1:5173/r/`로 로컬 검증
빌드를 만들고 같은 빈 fixture에서 다시 설치해 통과했습니다.
최종 소스는 새 빈 fixture에 다시 설치해 같은 검사를 통과했습니다.
마지막에는 환경 변수를 제거하고 `npm run build`를 재실행해
`apps/docs/public/r/`와 `docs/r/`의 기본 공개 dependency URL을
복원했습니다. `registry:check`도 다시 통과했습니다.

실제 screen reader 발표, RTL·touch·다른 브라우저, 88개 catalog
사용 코드 전체의 새 tarball 소비자 검사, 기존 소비자의 갱신 충돌·
복구, 원격 공개 배포는 확인하지 않았습니다.
