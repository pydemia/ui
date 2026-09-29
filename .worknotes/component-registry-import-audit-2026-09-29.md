# Registry import 의존성 감사

2026-09-29. 91개 item의 동시 설치만으로는 각 item이 사용하는 source의
직접 의존성 선언을 확인할 수 없었습니다. `scripts/check-registry.mjs`가
각 item의 TS/TSX 파일에서 정적 import·export 대상 모듈을 읽고 다음을
검사하도록 했습니다.

- 상대 경로 source는 item 자체 파일이거나 명시된
  `registryDependencies`의 파일이어야 합니다.
- 외부 package는 item의 `dependencies`에 직접 선언되어야 합니다.
  `react`와 `react-dom`은 소비자 peer dependency로 취급합니다.

최초 검사에서 `pyd-search-input`과 `pyd-number-input`의 `./utils` 직접
import에 대응하는 `pyd-utils` 선언이 빠진 것을 발견했습니다.
`registry.json`의 두 item에 추가했습니다. 검사 범위는 정적 module
specifier이며 동적 import나 실행 중 의존성 사용을 검증하지 않습니다.

기존 로컬 snapshot
`sha256-0fd137f58bdca77709885ac45073c41b44e62791835a8996fac6c1d34eb6f9fe`
은 유지하고 변경된 item의 새 snapshot
`sha256-9f61dbbe414ff6749e1f47757a9f17baceb35a0b2b4826f1d6a4d390ca168555`
를 생성했습니다. 두 디렉터리와 `docs/r/releases/` 복사본을
`registry:check`가 검사합니다.

`npm run typecheck`, `npm run build`, `npm run registry:check`,
`git diff --check`가 통과했습니다. 이번 metadata 변경 이후 두 item의
개별 `shadcn add`와 공개 snapshot URL 설치는 실행하지 않았습니다.
현재 로컬 변경 묶음은 commit·push·공개 배포하지 않았습니다.
