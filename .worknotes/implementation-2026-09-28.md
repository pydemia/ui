# Component 확장 구현 기록

기준: 2026-09-28. [확장 계획](component-roadmap.md)의 65개 항목은
조사·판정 후보이며 모두 독립 구현으로 확정된 것은 아닙니다.

## 이번 구현 묶음: 폼 입력

- 현재 `Input`과 `NativeSelect`는 소비자가 label·설명·오류 ID를 직접
  연결합니다. `Calendar`는 날짜 선택기이며 form 값과 trigger가 없습니다.
- `Field`는 native input과 trigger 기반 control 모두에 id,
  `aria-describedby`, `aria-invalid`를 명시적으로 전달합니다. 자체 label을
  가진 `AffixedInput`과 `Dropzone`은 중복으로 감싸지 않습니다.
- `Select`는 검색 없는 단일 선택입니다. 값과 form 제출은 Radix Select가
  소유합니다. 검색과 다중 선택은 이 항목에 섞지 않습니다.
- `DatePicker`의 값은 시각이 아닌 `YYYY-MM-DD` 달력 날짜입니다.
  비어 있는 값은 `null`이고 form에는 빈 문자열로 전달합니다.
  Calendar의 선택과 Popover의 열림·focus 처리를 조합합니다.

## 수용 조건

- 문서 preview에서 필수값 누락과 오류 설명이 각 control에 연결됩니다.
- Select는 키보드로 열고 선택·닫기를 할 수 있으며, DatePicker는 날짜를
  선택한 뒤 trigger의 값과 form 값을 갱신합니다.
- 기존 component의 public API를 변경하지 않습니다. 새 항목은 export,
  registry, provenance, 사용 코드에 함께 나타납니다.
- typecheck, build, registry:check 및 관련 브라우저 동작을 실행하고
  미검증 항목을 별도로 적습니다.

## 구현 및 소비자 설치

Field, Select, DatePicker를 `@pydemia/ui` export, registry, provenance,
문서 preview·사용 코드에 추가했습니다. Select는 고정 버전
`@radix-ui/react-select@2.3.7`을 사용합니다. source·license·의존성 조사는
`research/source-inventory.md`에 기록했습니다.

별도 Vite 소비자에서 처음 `shadcn add`를 실행했을 때 기존
`registryDependencies`의 `./pyd-label.json`을 소비자 로컬 파일로 해석해
실패했습니다. 공식 shadcn item 명세에 따라 생성 JSON의 내부 참조를
HTTP URL로 바꾸고, 파일 target을 `@ui/<파일명>`으로 지정했습니다.
`registry:build`가 이 변환을 수행하며 `registry:check`가 결과를 검사합니다.
배포 빌드의 기본 base는 `https://pydemia-ui.vercel.app/r/`입니다.
로컬 설치 검증에서는 `PYDEMIA_REGISTRY_BASE_URL`을
`http://127.0.0.1:5173/r/`로 지정했습니다.

공통 token은 `pyd-tokens` registry item으로 제공하고 소비자 CSS에서
`@import "./components/ui/tokens.css";`로 적용합니다. 이 item은
component 개수에 포함하지 않습니다. 별도 Vite 소비자에서 3개 component와
token item 설치, import, TypeScript 검사, production build를 완료했습니다.
처음 설치에서 발견한 경로 결함과 수정 후 설치 결과를 구분해
`research/verification.md`에 남깁니다.
