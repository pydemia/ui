# LogViewer 편입

시작 기준은 공개 124개 component·126개 registry item·47개 snapshot,
goal 관리용 추정 약 97%입니다. handoff의 `LogViewer`는 기존
`LogConsole`과 별도 사용처가 있습니다. 운영·배포 화면에서 수십 건의
로그를 검색하고 수준별로 확인할 때 소비자가 매번 검색 입력과 필터
상태를 조합하지 않도록 묶었습니다. 명령 입력은 `Terminal`, 로그
데이터 갱신과 삭제는 호출자가 담당합니다.

`LogViewer`는 기존 `LogConsole`·`Input`·`NativeSelect`와 React로
작성한 원본 component입니다. 검색어와 수준 선택만 내부에서
관리합니다. panel·flat 표시는 공통 token을 사용합니다. 외부 코드를
가져오거나 새 npm 의존성을 추가하지 않았습니다. 기존 의존
component의 upstream revision·LICENSE는 provenance 기록을
재사용합니다.

로컬 `npm run typecheck`와 `npm run build`, UI 테스트 184/184가
통과했습니다. 대상 테스트는 검색·수준 필터, 빈 원본·빈 결과,
이름·기본 음성 발표 상태를 확인했습니다. Chromium에서 검색 결과 1/3, 수준을 바꾼
빈 결과 0/3, 원본을 비운 0/0, flat 표시와 390px dark 화면의
가로 overflow 없음을 확인했습니다. 실제 keyboard-only 탐색,
screen reader·touch·Safari·RTL은 검사하지 않았습니다.

`registry/SHADCN_UI_LICENSE.md`의 provenance 링크를 source commit
`f5becfd`와 SHA-256에 고정했습니다. `registry:release-check`는
125개 export/catalog·127개 item과 48번째 snapshot
`sha256-9ab7b05eddbd7dee1aa86d9de4ddd8ec56a27071df3d6d710f90766ef35e9c8d`
의 현재 빌드 일치를 확인했습니다. 새 설치 경로는 아니므로 별도
소비자 설치는 실행하지 않았습니다. PR CI와 공개 URL은 아직
확인하지 않았으므로 공개 수량과 goal 추정은 유지합니다.
