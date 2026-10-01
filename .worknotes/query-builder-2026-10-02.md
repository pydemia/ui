# QueryBuilder 작업

## 판정

분석·감사 화면에서 `(상태 = 실패 OR 심각도 > 3) AND 담당자 포함 운영`처럼
조건을 중첩해 편집할 수 있어야 합니다. `FilterBar`는 호출자가 제공한
개별 control의 적용·초기화만 맡으며 조건 트리·연산자·그룹 순서를
관리하지 않습니다. `QueryBuilder`는 이 독립 동작을 제공하는 원본
component로 구현합니다. 외부 component 코드를 도입하지 않습니다.

## 구현 명세

- `fields`는 text·number·date·select 입력의 이름과 값 선택지를
  정의합니다. `value`는 ID가 있는 조건·AND/OR 그룹 트리입니다.
- 추가·수정·삭제·위아래 이동은 완전한 다음 트리를
  `onValueChange`로 전달합니다. 호출자가 저장·서버 조회를 담당합니다.
- 비어 있거나 잘못된 조건은 편집 중 보존하고 적용 시 각 조건의 오류를
  표시합니다. `onApply`는 유효한 트리에서만 호출합니다. 조건이 없는
  최상위 그룹은 전체 결과를 뜻하는 빈 쿼리로 적용할 수 있습니다.
- native select·input·button과 이름 있는 form/fieldset을 사용합니다.
  drag 없이 순서를 바꿀 수 있습니다. `plain`·`panel` 표시를 공통
  token으로 제공합니다.
- 중첩 깊이는 기본 4단계로 제한하며 호출자가 범위 안에서 바꿀 수
  있습니다. 빈 값 검사 연산자는 값 입력을 사용하지 않습니다.

## 검증 계획

구조·중복 ID·필드·값 검증, 조건 추가·편집·그룹 이동·적용 callback,
키보드와 390px 배치를 확인합니다. package export·registry·provenance·
문서 preview/Usage, typecheck·테스트·build·release 검사를 맞춥니다.
공개 전후 검증과 미실행 환경을 분리해 기록합니다.

## 로컬 결과

- `npm run typecheck`, UI 테스트 152/152, `npm run build` 통과.
  registry item은 로컬 117개, component는 로컬 115개입니다.
- Chromium 390px에서 문서 scrollWidth 390px, 필드 선택기 286px.
  조건 추가·오류·수정·적용을 실행했고 console error는 없었습니다.
- 문서 preview의 좁은 패널에서 선택기가 약 50px로 줄어드는 문제를
  발견했습니다. 조건 입력을 한 줄씩 배치해 390px와 desktop에서
  다시 확인했습니다.
- 실제 서버 조회·screen reader·touch·Safari·RTL, 개별 소비자
  설치와 공개 배포는 미검증입니다.
- provenance를 source commit `b73cce7`에 고정하고 35번째 snapshot
  `sha256-3773dda79971f256f5d45dd8b4593f64b92063147ab2311f25a9c903bcaf5f94`를
  생성했습니다. `registry:release-check`가 통과했습니다.
