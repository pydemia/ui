# 문서 사용 코드의 복사 가능성 검사

2026-09-29. 현재 catalog 89개 항목의 `code` 문자열을 각각 독립된
TSX 파일로 추출했습니다. 20개 항목은 나란한 최상위 JSX 요소에
fragment가 없어 단독 파일에서 문법 오류가 났습니다. 대상은
`button`, `input`, `password-input`, `label`, `badge`, `checkbox`,
`alert`, `textarea`, `native-select`, `switch`, `separator`,
`progress`, `spinner`, `slider`, `image`, `message`, `scroll-area`,
`navigation`, `carousel`, `data-chart`입니다.

해당 사용 코드에서 나란한 요소를 fragment로 감쌌습니다.
`scripts/check-registry.mjs`는 모든 catalog 항목에 정적인 `code`
문자열이 있는지 확인하고 TSX 파싱 오류가 있으면 실패합니다.

현재 `@pydemia/ui` tarball을 아래 소비자 fixture에 설치했습니다.
89개 코드를 package import 그대로 둔 경우와, 91개 registry item을
설치한 소스의 직접 import로 바꾼 경우를 각각 추출해 `tsc --noEmit`으로
검사했습니다. 총 178개 독립 TSX 파일의 typecheck가 통과했습니다.
fixture의 오래된 `registry-index.ts`에 빠져 있던 `BottomNav`와
`BottomNavLink` export는 설치된 소스에 맞춰 fixture에서만 보완했습니다.

`C:\Users\pydemia\AppData\Local\Temp\pydemia-ui-all-registry-91-consumer-20260929`

저장소 `npm run typecheck`, `npm run build`, `npm run registry:check`,
`git -c core.safecrlf=false diff --check`가 통과했습니다. 개발 서버의
Button·DataChart 선택 화면에서 fragment가 들어간 사용 코드와 preview
표시를 확인했고, DataChart 화면의 브라우저 error log는 비어 있었습니다.

이 검사는 89개 예시의 정적 문법·타입을 확인합니다. 예시 89개의
개별 브라우저 상호작용, 실제 보조기술·touch·다른 브라우저와 기존
소비자의 갱신·충돌은 확인하지 않았습니다. 현재 package는 private이며
이번 변경의 commit·push·공개 배포도 확인하지 않았습니다.
