# pydemia UI

React 19, Tailwind CSS 4, TypeScript와 shadcn registry convention으로 만든
source-owned UI 컴포넌트 작업공간입니다. 현재 foundation 6개와 Origin UI,
Kibo UI에서 정규화한 컴포넌트 각 1개를 포함합니다. 이 저장소와 문서 사이트는
prototype 단계이며 Mantine/MUI 수준의 전체 component breadth를 제공한다는
뜻은 아닙니다.

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
`docs/r/pyd-*.json` 항목을 shadcn registry로 설치하고 `packages/ui/src/styles.css`의
token 정의를 소비자 stylesheet에 연결해야 합니다. `npm run build`는
`docs/`에 게시용 사이트, `docs/r/`에 registry JSON, `docs/examples/profile/`에
실행 가능한 조합 예시를 생성합니다.

## 구조

| 경로 | 역할 |
| --- | --- |
| `packages/ui` | 컴포넌트 원본과 light/dark design tokens |
| `registry.json`, `registry/provenance.json` | registry 항목, 출처·라이선스·의존성·접근성 metadata |
| `apps/docs` | 컴포넌트 미리보기, 사용 코드, palette, 예시 사이트의 원본 |
| `apps/profile-demo` | 실제 컴포넌트를 조합한 프로필 예시 |
| `docs/` | Vercel 정적 배포용 빌드 결과 (`npm run build`로 갱신) |
| `research/` | source inventory, taxonomy, 검증 기록 |

외부 component를 추가할 때는 upstream revision과 정확한 license를 확인하고,
`registry/provenance.json`에 의존성·적용 profile·접근성 상태를 기록한 다음
token과 상호작용을 정규화합니다. 출처별 notice는
[`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md)에 보관합니다.

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
