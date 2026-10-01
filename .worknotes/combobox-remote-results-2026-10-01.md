# Combobox 원격 결과 갱신

2026-10-01. goal 재개 시 102개 component·104개 registry item입니다.
새 component 수를 늘리기보다 기존 `Combobox`의 실제 사용 공백을
먼저 수정합니다. controlled 선택값이 원격 검색 결과에서 빠지면
렌더링 중 `RangeError`가 발생했고, 로딩·요청 실패가 빈 결과와
구분되지 않았습니다.

## 동작 결정

- `selectedOption`은 현재 `options`에 없는 선택값의 label을 보존할 때만
  사용합니다. `value`와 일치하지 않거나 빈 값이면 기존 오류를 유지합니다.
  현재 목록에 같은 값이 있으면 현재 목록의 label이 우선합니다.
- `filterOptions=false`이면 소비자가 반환한 결과를 다시 문자열 필터링하지
  않습니다. 기본값은 기존 로컬 필터 동작을 유지합니다.
- `loading`과 `errorMessage`는 과거 결과의 선택을 막고 각각 status와
  alert로 알립니다. 로딩 중에는 오류보다 로딩 상태가 우선합니다.
  실제 요청, 취소, 결과와 선택값 저장은 소비자가 소유합니다.
- 검색어 입력은 종전처럼 선택값을 해제합니다. 결과만 갱신될 때는
  `selectedOption`으로 표시와 hidden form 값을 유지합니다.

## 출처와 구현

[WAI-ARIA APG Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
을 2026-10-01에 확인했습니다. 입력과 listbox, 방향키·Enter·Escape,
`aria-activedescendant` 관계를 유지했습니다. 구현은 기존 pydemia/ui
원본 코드를 확장했고 upstream 코드를 복사하지 않았습니다. 새 npm
dependency나 registry dependency는 없습니다. 공통 Input·surface·danger
token을 사용합니다.

## 현재 검증

- `npm run typecheck` 통과.
- 패키지 테스트 101/101 통과. 값 보존, 잘못된 fallback, loading·error와
  빈 상태 구분 회귀 검사를 추가했습니다.
- 로컬 Chromium에서 현재 결과에서 빠진 선택값의 label과 form 제출값을
  확인했습니다. 원격 검색 결과의 방향키·Enter와 실패 메시지도 확인했습니다.
- `npm run build`, `npm run registry:release-check` 통과. 104개 item,
  102개 component, 19개 불변 snapshot입니다. 새 snapshot ID는
  `sha256-89e9ec939dea43db48bdacdd4c3555cc2072a5131be074c65eae592ec14ef7c1`
  입니다.
- 로컬 registry에서 별도 Vite 소비자에 `shadcn@4.21.0 add`로 5개 파일을
  설치했습니다. Combobox·Input·utils·token·notice는 원본과 같고,
  typecheck·build가 통과했습니다. Chromium에서 결과 교체 후 label·
  제출값과 390px 가로 넘침 없음을 확인했습니다. fixture는
  `%TEMP%/pydemia-combobox-consumer-20261001`에 있습니다.
- 배포 전 새 snapshot URL의 내부 의존성은 아직 없는 production 경로라
  공개 URL로 설치할 수 없습니다. 로컬 registry는 5176번에서 별도로
  빌드했고 검증 뒤 기본 공개 base로 다시 생성했습니다.

## 미검증

- 실제 screen reader의 로딩·오류 발표, touch, Safari, RTL.
- 공개 배포와 공개 snapshot 소비자 설치는 아직 진행하지 않았습니다.
