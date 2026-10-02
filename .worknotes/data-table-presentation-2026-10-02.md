# DataTable 표시 선택

## 공개 확인

PR #64는 `main`의 `adccef5`에 병합했습니다. PR Verify UI와 병합
commit의 Verify UI·Pages가 통과했고 Vercel production
`dpl_CnMbnvpvSwZe3U1wbkjAemXr4p74`는 READY입니다. 공개
DataTable preview·Usage와 console error 0건을 확인했습니다. 현재
registry manifest·item, 37번째 snapshot manifest·item URL이 모두
HTTP 200이고 snapshot에 118개 item이 있습니다. 공개 component
수는 116개이며 goal 관리용 추정은 약 91%입니다. 새 component
종류가 추가된 것은 아니므로 수량을 올리지 않았습니다.

2026-10-02. 목표는 같은 DataTable을 일반 관리 목록과 행이 많은
운영 화면에 모두 사용할 수 있도록 행 간격과 줄무늬를 선택하게 하는
것입니다. 기존 DataTable은 검색·필터·정렬·선택·페이지와 원격 조회를
이미 제공했지만 표의 행 밀도는 상위 token에만 의존했습니다.
`Spinner`의 다섯 형태와 `DataChart`의 구간별 값 패널을 확인한 뒤
중복 component를 추가하지 않았습니다.

`density`는 `standard`(기존 10px), `compact`(4px),
`comfortable`(16px)입니다. 값은 해당 표에만 적용합니다.
`striped`는 짝수 데이터 행에 공통 `surface-subtle`을 씁니다.
두 속성의 기본값은 기존 출력과 같고 전체 행·원격 모드에 적용됩니다.
행 ID, 데이터 순서, 접근 가능한 표 이름과 조작 규칙은 건드리지
않았습니다. 새 외부 source나 npm 의존성은 없습니다.

## 로컬 확인

- TypeScript typecheck, UI 테스트 156/156, site/registry build와
  `registry:release-check`가 통과했습니다.
- Chromium에서 기본·compact·comfortable의 computed row padding은
  각각 10px·4px·16px입니다. 줄무늬는 전체 행·원격 모드에서
  두 번째 행에 적용됐고, dark에서 token 색으로 바뀌었습니다.
- 390px에서 문서 scrollWidth는 390px이었습니다. preview와 Usage가
  보였고 console error·Vite overlay는 없었습니다.
- 37번째 snapshot ID는
  `sha256-72ff812680d65d8deb1063f8e571d2c4d649813668343209e631f8800b1cb0ab`입니다.

로컬 검사 시점에는 PR CI와 공개 배포·URL을 확인하지 않았습니다.
공개 결과는 위에 기록했습니다. 별도 소비자 설치는 확인하지 않았습니다.
실제 screen reader·touch·Safari·RTL도 이번 범위에서 실행하지
않았습니다. 공개 component 수는 아직 116개이고 goal 관리용 추정은
약 91%로 유지합니다. 이번 변경은 기존 component의 사용 범위를
넓히지만 새 종류를 공급한 것은 아닙니다.
