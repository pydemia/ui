# RangeSlider 작업 기록

## 선택 근거

기존 `Slider`는 `[20, 80]`처럼 두 thumb를 표시하지만 각각의 이름과
별도 form 필드를 제공하지 않았습니다. 가격·수치 필터를 실제 form에
넣으려면 호출자가 반복해서 상태·hidden input을 조합해야 했습니다.
`RangeSlider`는 이 중복을 줄이는 별도 사용 단위로 선정했습니다.

## 구현

- 기존 `Slider`에 선택적 `thumbLabels`를 추가하고 기본 API는 유지.
- `RangeSlider`는 전체 그룹 이름, 두 endpoint 이름, 두 form 이름을
  필수로 받습니다. controlled/default 상태, 범위·간격 검증, 숫자 표시
  형식과 외부 form 연결을 제공합니다.
- shadcn/ui 기반 기존 Slider와 Radix 1.4.7을 재사용합니다. 새 npm
  runtime 의존성은 없습니다. source·license·접근성 기준은
  `research/source-inventory.md`에 기록했습니다.
- 문서 preview는 월 이용료 범위를 제출하고 초기화합니다. Usage 코드는
  같은 form을 다시 작성할 수 있습니다.

## 검증과 남은 확인

- package 테스트: SSR 그룹·thumb 이름·두 값·disabled·잘못된 입력.
- TypeScript: UI·프로필·문서 typecheck.
- 로컬 Chromium: 키보드로 `20/80 → 25/75`, 두 이름의 form 값 제출,
  native reset의 `20/80` 복원, 390px에서 가로 overflow 없음.
- Radix의 thumb 교차 시 값 정렬과 focus 이동을 관찰했습니다. 이때
  endpoint 이름은 현재 작은 값·큰 값에 붙습니다.
- 현재 작성 시점의 미완료: registry snapshot·독립 소비자·PR·production.
- 실제 touch, touch 보조기술, Safari, screen reader, RTL은 미검증.

다음 작업은 package 테스트 수정 후 재실행, metadata 고정 고지와
snapshot 발행, 독립 소비자 설치, PR과 production 검증입니다. 이전
미공개 draft snapshot 네 디렉터리는 포함하지 않습니다.
