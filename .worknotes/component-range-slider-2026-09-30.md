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
- `npm run build`와 `registry:release-check`가 통과했습니다. 95개 item,
  93개 component와 13개 snapshot을 검사했으며 새 ID는
  `sha256-4405ce202eb10a7cb865a7609676349ed6e002ae1b49676d06f4438dd31c5449`입니다.
- 별도 Vite 소비자에 `shadcn@4.21.0`으로 RangeSlider·tokens와 전이
  의존성을 설치했습니다. 5개 파일의 LF 정규화 내용이 원본과 같고
  TypeScript와 Vite build가 통과했습니다.
- 공개 snapshot URL을 새 Vite 소비자에 설치했습니다. RangeSlider,
  Slider, utils, token, MIT 고지 5개 파일이 생성됐고 typecheck·build가
  통과했습니다.
- 실제 touch, touch 보조기술, Safari, screen reader, RTL은 미검증.

실제 touch, touch 보조기술, Safari, screen reader, RTL과 독립 소비자
브라우저 동작은 미검증입니다. 이전 미공개 draft snapshot 네
디렉터리는 포함하지 않았습니다.

## 공개 배포

[PR #13](https://github.com/pydemia/ui/pull/13)의 Verify UI가 통과한
뒤 `3f2d33b0016a7d20c888e231f5b92b16932b6f28`로 병합했습니다.
`main`의 Verify UI와 Pages CI가 성공했고 Vercel production
`dpl_Ag1DjmuWRKQ7FdZWq2oANPyiTkJu`가 READY입니다. 공개
`https://ui.pydemia.ai/?component=range-slider`에서 93개 component,
thumb별 이름, Usage와 `20/80 → 25/80` 변경·제출을 확인했습니다.
공개 `pyd-range-slider.json`과 snapshot item은 조회됐으며
manifest의 `itemCount`는 95입니다.
