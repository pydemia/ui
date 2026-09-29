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
- `vercel:react-best-practices` 검토에서 새 상태는 checkbox 이벤트의
  함수형 갱신으로만 변경되고, 값·색·선 모양은 render 중 입력과
  현재 선택에서 계산됨을 확인했습니다. 추가 effect나 전역 상태는
  없습니다.

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
- provenance 고지에 commit
  `1f0035bf3f0a94f5ac7826ab4301b33f2b98acad`와 LF 기준
  SHA-256 `61cdf84c33649f887c4eef063823e555c69e37c7d9a441819a0c110b4f0e6f54`를
  고정했습니다. `npm run registry:snapshot`으로
  `sha256-212e10face340c8a0d867de1ea5ace2c1490e102dfec7d09f8ca97e999cae331`을
  만들고 다시 build한 뒤 `registry:release-check`가
  92개 item·9개 snapshot과 현재 내용을 확인했습니다.
- 새 Vite 소비자
  `%TEMP%/pydemia-ui-series-consumer-20260930`에 로컬
  `shadcn@4.21.0 add`로 DataChart·utils·tokens 3개 파일을
  설치했습니다. 설치 source의 LF 기준 SHA-256이 원본과 같고
  소비자 typecheck·build가 통과했습니다. Chromium에서 대기를
  숨기자 합계가 12건에서 8건으로 바뀌었고 error log는 0건입니다.
- 공개 배포와 공개 snapshot URL 설치는 아직 진행 중입니다.

실제 screen reader 발표, 실제 touch 기기, 다른 브라우저는
검증하지 않았습니다. 이전 미공개 draft snapshot 네 디렉터리는
이번 변경과 무관하며 포함하지 않습니다.
