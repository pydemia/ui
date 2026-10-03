# 83번째 registry 전체 동시 설치 소비자 검사

2026-10-04. 기준 release는
`sha256-25ca4393b38b8fcebbbd34ca3d8c73475e773a766e971da004f94e40728bc896`
(schema 2, item 146개)입니다. 새 Vite·React·Tailwind 소비자를
`%TEMP%/pydemia-ui-all-registry-83-consumer-20261004`에 만들었습니다.
이 소비자는 기존 Dialog 최소 소비자의 설정과 의존성을 시작점으로
사용했습니다.

`shadcn@4.21.0 add --yes --overwrite`에 같은 release의 GitHub raw
item URL 146개를 40·40·40·26개씩 전달했습니다. 네 묶음 모두 CLI
설치가 성공했습니다. 내부 의존 item과 token·MIT 고지를 포함해
`src/components/ui/`에 파일 148개가 있습니다. Manifest의 모든 item
파일 내용을 target별로 모아 LF 줄바꿈으로 비교한 결과, 예상 파일
148개와 설치 파일 148개가 모두 일치했고 충돌·누락은 0건입니다.

설치된 TypeScript 모듈 146개를 한 화면에서 모두 import했습니다.
소비자 `npm run typecheck`와 `npm run build`가 통과했습니다. Vite는
2,785개 모듈을 변환했고 JS 932.87 kB, CSS 63.51 kB를 생성했습니다.
모든 UI 모듈을 강제로 묶었으므로 JS 500 kB 경고를 일반 소비자
번들 크기로 해석하지 않습니다. 로컬 Chromium 화면에는
`146 modules, 291 exports`가 표시됐고 기존 Dialog trigger도
렌더링됐습니다.

이번 검사는 전체 item의 **동시 신규 설치**, 파일 내용, TypeScript
연결, 전체 import의 build·브라우저 로딩을 다룹니다. 개별 item의
독립 설치, 각 component의 실제 상호작용, 사용자가 수정한 파일과의
업그레이드 충돌, screen reader·touch·Safari·RTL은 검증하지 않았습니다.
시작 fixture에 Dialog·utils 의존성이 이미 있었으므로 모든 외부
package의 최소 소비자 자동 설치를 증명하지 않습니다. 이 경로는
Dialog 최소 소비자와 기존 대표 조합 소비자 검사로 따로 확인했습니다.
`ui.pydemia.ai`의 83번째 release 공개 상태도 바뀌지 않았습니다.
Goal 관리용 추정은 약 99%입니다.

## Catalog Usage 코드 검사

현재 작업 트리의 `@pydemia/ui`를 빌드하고 tarball로 같은 소비자에
설치했습니다. `apps/docs/src/catalog.tsx`의 정적 `code` 144개를
각각 TSX 파일로 추출했습니다. `tsconfig.json`의 `include: ["src"]`로
이 파일 전부를 포함한 `npm run typecheck`가 통과했습니다. 따라서
144개 예시의 TypeScript import·prop 사용은 현재 패키지 선언과
일치합니다. 이 검사는 예시의 실제 클릭·입력 동작이나 모든 상태의
렌더링을 증명하지 않습니다. 추출 스크립트와 tarball은 임시 소비자에만
있으며 저장소의 CI 검사는 변경하지 않았습니다.
