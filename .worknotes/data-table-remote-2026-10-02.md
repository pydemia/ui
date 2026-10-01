# DataTable 원격 조회 작업

## 판단

기존 `DataTable`은 전달된 행 전체에 검색·필터·정렬·페이지를 적용합니다.
서버가 현재 페이지 행만 돌려주는 관리 화면에서는 전체 건수, 조회 중,
실패·재시도를 일관되게 표시할 수 없었습니다. 새 `DataGrid`를 세지
않고 기존 component에 호출자 소유의 `remote` 모드를 추가했습니다.
코드는 기존 React·내부 component로 작성했고 외부 component 코드를
도입하거나 새 npm 의존성을 추가하지 않았습니다.

## 동작과 경계

- `remote.view`는 검색어·필터값·정렬·페이지·페이지 크기를 담습니다.
  입력은 완전한 다음 view를 `onViewChange`로 전달합니다.
- `rows`는 서버가 준 현재 페이지 행입니다. 내부에서 다시 검색·정렬·
  자르지 않습니다. `totalItems`는 전체 결과 건수입니다.
- `loading`·`error`는 이전 행을 숨깁니다. `onRetry`가 있을 때만
  오류 재시도 버튼을 표시합니다.
- 원격 선택은 현재 로드된 페이지에 한정합니다. 조회 조건과 로딩·
  오류 상태가 바뀌면 선택을 지웁니다. 로컬 전체 행 모드의 페이지 간
  선택 유지는 그대로입니다.
- 실제 서버 요청, 중복 요청 취소, 페이지 범위 재조정과 여러 서버
  페이지에 걸친 일괄 선택은 호출자가 소유합니다. preview는 로컬
  데이터로 서버 응답을 모사합니다.

## 검증

- `npm run typecheck`: 통과.
- `npm run test -w @pydemia/ui`: 148/148 통과. 신규 5건 포함.
- `npm run build`: 통과. 116개 registry item 생성.
- `registry:release-check`: 34개 snapshot과 현재
  `sha256-73ea6b31c38dfa074a5ad87dd94804ae8cc1217e15cf0adfaa14322ec569b303`
  통과. 첫 실행은 snapshot을 docs로 복사하기 전이라 ENOENT였고,
  재빌드 후 통과했습니다.
- 로컬 Chromium: 검색·필터 빈 결과·정렬·페이지·로딩·오류·재시도,
  페이지 변경 시 선택 해제 실행. 390px에서 문서 가로 넘침 없음.
  console error 0건, Vite overlay 없음.
- React TSX 검토: 원격 조건은 호출자 소유로 두고, 효과의 의존성은
  원격 객체 대신 기본값을 사용했습니다. 새 데이터 요청은 component
  내부에서 시작하지 않습니다.

## 남은 검증

PR #58의 Verify UI run 36936736308과 병합 commit `d89c304`의
Verify UI run 36936989888·Pages run 36936989012가 성공했습니다.
Vercel production 배포 `dpl_2FCVG3HjufNEVCG1SoWoqoEtU99U`는
READY이며 `ui.pydemia.ai`에 연결됐습니다. 공개 브라우저에서
DataTable의 원격 preview·Usage·전체 114개 표기와 console error
0건을 확인했습니다. 현재 registry item과 34번째 snapshot의
manifest·DataTable item URL은 HTTP 200이고 manifest는 116개
item을 표시합니다.

실제 HTTP 응답 경합, screen reader·touch·Safari·RTL, 개별 소비자
CLI 설치, rollback 뒤 snapshot URL 보존은 미검증입니다. 공개
component 수는 114개이며 goal 관리용 추정은 약 89%입니다.
