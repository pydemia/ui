# Component 의존성 점검

2026-09-29 현재 `main`의 38개 component와 2개 설치용 registry item을
확인했습니다. 구현 출처는 `registry/provenance.json` 기준 shadcn/ui 26개,
`pydemia/ui` 원본 12개입니다.

## 확인 범위와 결과

`packages/ui/package.json`, 38개 component의 import, `registry.json`의
`dependencies`와 `registryDependencies`, 빌드된 registry, 세 workspace의
manifest, 설치된 npm 트리를 대조했습니다. 동적 import와 `require`는
`packages/ui/src`에서 발견되지 않았습니다. `npm run registry:check`는
40개 item을 통과했습니다.

`@pydemia/ui`에는 React·React DOM peer dependency 2개와 실행 의존성
21개가 있습니다. 실행 의존성 21개는 모두 현재 소스에서 사용하며
registry item의 직접 npm 의존성 선언과 일치합니다. 로컬 component
import도 registry item 간 의존성 선언과 일치합니다.

| 실행 의존성 | 수 | 직접 사용하는 component |
| --- | ---: | --- |
| `@radix-ui/react-*` | 16 | Accordion, AlertDialog, Avatar, Checkbox, Collapsible, Dialog, Popover, Progress, RadioGroup, Select, Separator, Slider, Switch, Tabs, Toggle, Tooltip |
| `class-variance-authority` | 1 | Button, Alert |
| `lucide-react` | 1 | Accordion, Breadcrumb, Checkbox, DatePicker, Dropzone, NativeSelect, Select, Snippet, Spinner |
| `react-day-picker` | 1 | Calendar; DatePicker가 Calendar를 사용 |
| `clsx`, `tailwind-merge` | 2 | 공용 `cn` 유틸리티를 사용하는 component |

`apps/docs`는 `@pydemia/ui` 외에 preview와 사이트 아이콘 용도로
`lucide-react`, locale 예시 용도로 `react-day-picker`를 직접 선언합니다.
`apps/profile-demo`는 예시 아이콘 용도로 `lucide-react`를 직접
선언합니다. Tailwind CSS, Vite, TypeScript, esbuild, shadcn CLI는
개발·빌드 의존성입니다. `shadcn/ui` 자체는 `@pydemia/ui`의 npm 실행
패키지가 아니라 저장소에 편입된 component 소스의 출처입니다.

MUI, Chakra UI, Mantine, Tremor, Kibo UI, AI Elements, Origin UI,
`react-dropzone` 패키지는 실행 manifest, component import, registry
설치 의존성, lockfile에서 발견되지 않았습니다. Tremor, Kibo UI,
AI Elements, Origin UI는 `registry/provenance.json`에 디자인 reference로
기록되어 있습니다. Origin UI 소스를 직접 편입한 component도 현재는
없습니다.

전이 의존성도 있습니다. 설치된 트리에서 `@floating-ui/react-dom`은
Radix Popper를 거쳐, `react-remove-scroll`은 Radix Dialog·Popover·Select를
거쳐, `date-fns`는 React DayPicker를 거쳐 설치됩니다. 이들은 직접
registry item 의존성은 아니지만 소비자 설치 시 포함됩니다.

## 해석과 확인이 필요한 범위

Radix UI, React DayPicker, Lucide, CVA, clsx, tailwind-merge는 각각
shadcn/ui와 별개의 제3자 npm 패키지입니다. 현재 shadcn 방식의
component에서 쓰는 의존성이지만, "React·Tailwind 외 패키지 금지"를
문자 그대로 적용하면 현 구성은 조건을 만족하지 않습니다. 공식
shadcn/ui 문서도 Calendar의 React DayPicker 사용과 Radix·Lucide 등의
별도 의존성을 안내합니다:

- <https://ui.shadcn.com/docs/components/radix/calendar>
- <https://ui.shadcn.com/docs/tailwind-v4>
- <https://ui.shadcn.com/docs/installation/manual>

Radix는 Select 등의 입력 동작과 focus 관리에, DayPicker는 Calendar에
실제로 쓰입니다. 이 패키지까지 제거하려면 component 구현과 접근성
동작을 다시 설계하고 검증해야 합니다. 허용 범위에 대한 사용자 답변을
기다리고 있습니다.

## Metadata 불일치

- `pyd-select`의 provenance 의존성 문자열은
  `@radix-ui/react-select@2.3.7 (MIT)`입니다. 다른 item은 package 이름만
  기록합니다. manifest 및 registry 설치 선언은 정상입니다.
- `pyd-collapsible`는 `./utils`를 import하고 registry item은
  `pyd-utils`를 설치하지만, provenance 의존성 배열에는 `pyd-utils`가
  빠져 있습니다.

이번 점검은 실행 코드와 manifest의 정적 대조, 설치 트리 확인,
`registry:check` 실행까지 수행했습니다. 패키지의 전체 전이 의존성에
대한 개별 라이선스·접근성 검토나 browser 동작 재검증은 수행하지
않았습니다. 구현 코드와 metadata는 변경하지 않았습니다.
