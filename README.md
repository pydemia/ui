# pydemia UI

React 19, Tailwind CSS 4, TypeScript와 shadcn registry convention으로 만든
source-owned UI 컴포넌트 작업공간입니다. 현재 38개 컴포넌트를 포함합니다.
shadcn/ui 기반 항목은 원본 revision과 MIT notice를 유지합니다. Origin UI,
Kibo UI, AI Elements, Tremor는 디자인·상호작용 reference로 기록하고
해당 항목의 구현 코드는 `pydemia/ui`에서 관리합니다.
이 저장소와 문서 사이트는 prototype 단계이며 Mantine/MUI 수준의 전체
component breadth를 제공하지는 않습니다.

## 시작하기

Node.js 22 이상이 필요합니다.

```bash
npm ci
npm run typecheck
npm run build
npm run registry:check
npm run dev
```

`npm run dev`는 문서 사이트를 `http://127.0.0.1:5173/`에서 실행합니다.
프로필 예시만 보려면 `npm run dev:example`을 사용합니다.

`@pydemia/ui`는 이 workspace 안에서 사용하는 **private 패키지**이며 npm에
게시되지 않았습니다. 컴포넌트 소스를 프로젝트에 편입할 때는 원하는
`docs/r/pyd-*.json` 항목을 shadcn registry로 설치합니다. token은
`pyd-tokens.json`을 함께 설치하고 소비자 CSS에서
`@import "./components/ui/tokens.css";`로 연결합니다. `npm run build`는
`docs/`에 게시용 사이트, `docs/r/`에 registry JSON, `docs/examples/profile/`에
실행 가능한 조합 예시를 생성합니다. import 경로는 소비자 프로젝트의
`components.json`에 지정한 `aliases.ui` 위치에 맞춰 조정합니다.

생성된 JSON의 내부 의존성은 공개 registry URL을 가리킵니다. 별도 소비자
프로젝트에서 로컬 registry를 시험할 때는 먼저
`PYDEMIA_REGISTRY_BASE_URL=http://127.0.0.1:5173/r/`를 설정하고
`npm run build`를 실행하세요. 환경 변수를 지정하지 않은 빌드는
`https://pydemia-ui.vercel.app/r/`를 사용합니다.

## Colormap

문서 사이트의 Colormap 영역에서 Neutral, Pydemia, Ocean, Forest,
Violet을 선택하거나 각 색을 `#RRGGBB`로 조정할 수 있습니다. 조정값은 현재
light/dark 모드에 따로 적용되며 새로고침하면 초기화됩니다. 조합 예시의
iframe에도 적용되고, 「전체 화면으로 열기」 링크에는 현재 선택이 담깁니다.

공통 stylesheet는 `--accent`, `--background` 같은 semantic token을
`--palette-accent`, `--palette-background`의 alias로 선언합니다. 소비자
앱에서도 root의 `data-colormap`을 설정하거나 palette 변수를 덮어써
같은 컴포넌트의 색을 바꿀 수 있습니다.

```js
document.documentElement.dataset.colormap = "forest";
document.documentElement.style.setProperty("--palette-accent", "#25684a");
```

직접 지정한 색은 문서 사이트의 본문, Accent, User message 대비 표시를
확인하세요. 색상을 바꿔도 컴포넌트 소스나 registry metadata는 변하지
않습니다.

## 구조

| 경로 | 역할 |
| --- | --- |
| `packages/ui` | 컴포넌트 원본과 light/dark design tokens |
| `registry.json`, `registry/provenance.json` | registry 항목, 출처·라이선스·의존성·접근성 metadata |
| `apps/docs` | 컴포넌트 미리보기, 사용 코드, palette, 예시 사이트의 원본 |
| `apps/profile-demo` | 실제 컴포넌트를 조합한 프로필 예시 |
| `docs/` | Vercel 정적 배포용 빌드 결과 (`npm run build`로 갱신) |
| `research/` | source inventory, taxonomy, 검증 기록 |
| `.worknotes/` | 세션 인계, [확장 계획](.worknotes/component-roadmap.md), 검토 기록 |

새 component의 디자인 reference와 실제 코드 출처는
`registry/provenance.json`에서 별도로 기록합니다. shadcn/ui source를
변형한 항목은 revision·license·notice를 유지합니다. 다른 library는
구현 source로 복사하지 않고 필요한 동작을 자체 코드로 작성합니다.
dependency의 license는 component source license와 구분합니다.
외부 source notice는 [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md)에
보관합니다. 이전 adaptation의 귀속 notice도 보존합니다.
이 저장소에는 아직 전체 코드에 적용할 공개 LICENSE가
없으므로 문서의 「공개 사용 조건 미지정」은 재사용 허가를 뜻하지 않습니다.

## 문서 사이트 게시

문서 사이트는 GitHub에 연결된 Vercel 프로젝트
[`pydemia-ui`](https://vercel.com/pydemia-7822/pydemia-ui)에 배포됩니다. 현재
공개 주소는 [`https://pydemia-ui.vercel.app`](https://pydemia-ui.vercel.app/)입니다.
[`vercel.json`](vercel.json)은 저장소 루트에서 `npm ci`와 `npm run build`를
실행하고 `docs/`를 정적 사이트로 게시하도록 지정합니다. `main`에 push하면
Vercel이 다시 배포합니다.

`ui.pydemia.ai`는 Vercel 프로젝트에 등록되어 있으며 Squarespace DNS 연결을
기다리는 중입니다. Squarespace에서 `ui`의 CNAME을 프로젝트의 Vercel
[Domains 설정](https://vercel.com/pydemia-7822/pydemia-ui/settings/domains)에
표시되는 대상으로 지정해야 합니다. 기존 GitHub Pages 배포 설정은 도메인
전환이 확인될 때까지 남아 있습니다. 따라서 이전 대상인
`pydemia.github.io`로 CNAME을 새로 지정하지 마세요.

접근성과 브라우저 검증의 현재 상태는 [`research/verification.md`](research/verification.md)에
기록했습니다. 화면의 상태 변경과 복사는 데모 기능이며 서버 데이터가 아닙니다.
