# DataChart 계열 표시 선택

2026-09-30. 분석 화면의 다중 계열 비교에서 필요한 계열 표시·숨김을
기존 `DataChart`의 `toggleableSeries` 옵션으로 구현했습니다.
별도 `Legend` component나 registry item은 추가하지 않습니다.
90개 component·92개 item을 유지합니다.

## 설계와 변경

- 기본 정적 범례는 유지합니다. 다중 계열 입력에 옵션을 지정하면
  이름 있는 native checkbox로 각 계열을 선택합니다.
- 숨긴 계열은 차트·축 범위·누적값·구간 값 패널·접근 가능한 데이터
  표에서 제외합니다. 색과 선 모양은 원래 계열 순서에 고정합니다.
- 모든 계열을 숨기면 값이나 합계를 만들어내지 않고 계열 선택
  안내와 checkbox를 남깁니다. 한 계열을 다시 선택하면 차트를
  복원합니다.
- `DataChart` 문서 preview와 사용 코드에 선택형 범례를 연결했습니다.
  `registry/provenance.json`의 접근성 설명과
  `research/source-inventory.md`의 출처 기록을 갱신했습니다.
- 새 외부 source·npm dependency는 없습니다. 원본 차트 구현과
  `pyd-utils` 직접 registry 의존성을 유지합니다.

## 검증 상태

- `npm run typecheck` 통과.
- `npm run build` 통과. 92개 registry item과 문서·예시를 생성했습니다.
- `npm test -w @pydemia/ui` 60/60 통과. 최초 실행은 새 SSR
  검사의 checkbox 속성 순서 가정 때문에 59/60으로 실패했고,
  속성 순서와 무관한 검사로 수정해 재실행했습니다.
- Chromium 로컬 문서 preview에서 계열 숨김 시 SVG 계열,
  표 머리글, 구간 값과 축 범위 변경을 확인했습니다. 모든 계열
  숨김·복원, 누적 영역의 4건→12건 합계와 Space 키 복원,
  390px viewport에서 checkbox 노출·가로 overflow 범위를
  확인했습니다. 브라우저 error log는 0건입니다.
- registry release 검사, snapshot·소비자 설치, 배포 확인은
  아직 진행 중입니다.

실제 screen reader 발표, 실제 touch 기기, 다른 브라우저는
검증하지 않았습니다. 이전 미공개 draft snapshot 네 디렉터리는
이번 변경과 무관하며 포함하지 않습니다.
