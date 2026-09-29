# 현재 catalog 사용 코드와 registry 공급 경로 검사

현재 `apps/docs/src/catalog.tsx`의 정적 사용 코드 87개를 TypeScript
AST로 각각 추출했습니다. 현재 `@pydemia/ui` 빌드의 tarball을 새
소비자에 설치해 87개 `@pydemia/ui` import의 `tsc --noEmit`을
통과했습니다. 실제 앱에서 각 preview를 실행한 결과는 아닙니다.

같은 revision의 89개 registry item을 로컬 URL에서 새 소비자에
`shadcn@4.21.0 add`로 한 번에 설치했습니다. 생성된 91개 파일
(87개 component, `calendar-date.ts`, utils, token CSS, MIT 고지)은
줄바꿈 정규화 후 저장소 원본과 일치했습니다. 사용 코드 87개의
`@pydemia/ui` import를 public export 대응표에 따라 설치된 파일의
직접 import로 바꿔 `tsc --noEmit`을 통과했습니다. 설치 소스 전체를
포함한 Vite build가 통과했고 로컬 Chromium에서 205개 값 export를
로드했습니다. console error는 0건이었습니다. build에는 500 kB
초과 chunk 경고가 있었습니다.

`shadcn@4.0.0`으로도 89개 item을 별도 새 소비자에 동시 설치했습니다.
91개 원본 일치, 설치 소스와 사용 코드의 typecheck, 전체 모듈 build와
Chromium의 205개 값 export 로딩이 통과했습니다. 다만 이 버전은
`@ui/` target을 `src/@ui/`에 설치했고, 4.21.0은 소비자
`aliases.ui: "@/components/ui"`에 맞춰 `src/components/ui/`에
설치했습니다. [shadcn registry target 문서](https://ui.shadcn.com/docs/registry/registry-item-json)에
명시된 현재 placeholder 규칙은 4.21.0 결과와 일치합니다. 문서의
설치 명령은 검증한 4.21.0으로 고정하고 두 경로 차이를 README에
기록했습니다.

임시 package 소비자:
`C:\Users\pydemia\AppData\Local\Temp\pydemia-ui-catalog-87-consumer-20260929`.
임시 registry 소비자:
`C:\Users\pydemia\AppData\Local\Temp\pydemia-ui-all-registry-89-latest-consumer-20260929`.
4.0.0 비교 소비자:
`C:\Users\pydemia\AppData\Local\Temp\pydemia-ui-all-registry-89-consumer-20260929`.

생성한 직접 import 코드는 검사용 변환본이며 문서 사이트의 Usage 탭은
계속 private package 코드를 보여줍니다. README와 문서 설치 안내에
registry 소비자는 설치된 파일 경로를 써야 한다고 명시했습니다.
각 preview의 전체 상호작용, 실제 screen reader·touch·다른 브라우저,
모든 item의 개별 격리 설치, 소비자 수정 파일의 갱신·충돌 복구와
공개 배포는 확인하지 않았습니다.
