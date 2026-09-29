# Registry 내용 해시 snapshot

2026-09-29. 기존 `npm run build`는 `docs/`를 재생성하며 `/r/`의 내부
의존성도 최신 주소를 가리켰습니다. 동일한 소비자 설치 결과를 다시
얻을 수 있도록 현재 91개 registry item의 JSON을 내용 해시 식별자로
묶었습니다. component JSON, `pyd-tokens`와 수정한 shadcn/ui source의
MIT 고지 전달 파일이 같은 snapshot에 들어 있습니다. 외부 component
source를 새로 편입하지 않았습니다.

로컬 snapshot ID:
`sha256-0fd137f58bdca77709885ac45073c41b44e62791835a8996fac6c1d34eb6f9fe`.
`registry/releases/<ID>/`와 생성된 `docs/r/releases/<ID>/`에 91개
item JSON과 manifest 1개가 있습니다. 각 item의 `registryDependencies`는
동일 ID 아래의 절대 URL을 가리킵니다. 최신 `/r/` 경로는 그대로 둡니다.
shadcn/ui의 [registry item 명세](https://ui.shadcn.com/docs/registry/registry-item-json)에
명시된 custom registry URL 의존성 형식을 따릅니다.

`npm run registry:snapshot`은 현재 공개 기본 URL 빌드를 검사한 뒤
snapshot을 만듭니다. 같은 내용이면 기존 디렉터리를 유지하고 내용이
바뀌면 새 ID를 만듭니다. `npm run build`는 추적되는 snapshot을
`docs/r/releases/`로 복사합니다. `registry:check`는 원본·복사본의
파일 해시와 내부 의존성의 ID 일치를 검사합니다. 임시 fixture의
회귀 시험은 원본 변경 후 새 ID 생성, 이전 snapshot 보존과 변조
감지를 확인했습니다.

`npm run typecheck`, `npm run build`, `npm run registry:check`,
`git -c core.safecrlf=false diff --check`가 통과했습니다. 로컬 개발
서버에서 snapshot의 `pyd-button-group.json`과 `manifest.json`이
HTTP 200이었고, 같은 snapshot 명령을 재실행해 기존 ID 유지도
확인했습니다.

이 snapshot은 아직 commit·push·공개 배포하지 않았습니다. 공개 URL의
HTTP 응답과 `shadcn@4.21.0` 설치, 이전 공개 버전 소비자의 갱신·충돌·
복구, 실제 장기 보존은 검증하지 않았습니다. 이번 작업으로 공급·품질
조건을 추가 완료 처리하지 않습니다.
