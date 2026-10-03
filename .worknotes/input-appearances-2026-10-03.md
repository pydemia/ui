# Input 표시 형태 — 2026-10-03

## 공개 확인

PR [#146](https://github.com/pydemia/ui/pull/146)을 병합한 `main`
`14486b7e`의 Verify UI와 Pages가 통과했습니다. Vercel production
`dpl_HBEQfR7zdJcWm6MfnXt3BJ7nJtc2`는 READY이며
`ui.pydemia.ai` alias를 받았습니다. 사용자 도메인의
[78번째 schema 2 manifest](https://ui.pydemia.ai/r/releases/sha256-386c361908aa3c1fdbdd48fe846b9fdd3a9ca0d7fd665acb966c37467e468b66/manifest.json)는
HTTP 200, `itemCount=146`이고 snapshot·현재 `pyd-input` item도
HTTP 200으로 새 외형 소스를 담습니다. GitHub raw의 같은 manifest와
item도 HTTP 200입니다. [공개 문서](https://ui.pydemia.ai/?component=input#components)에서 세 외형과 Usage를
확인하고 `filled`에 텍스트를 입력해 값과 focus 표시를 확인했습니다.
설치 경로 변경은 없어 격리 소비자 설치를 다시 실행하지 않았습니다.

## 범위와 판단

중급 화면의 입력란은 다른 표면에 놓이므로 공통 `Input`에 외형 선택이
필요합니다. 새 component를 만들거나 개수를 늘리지 않고 기존
`Input`에 `outline`(기본값), `filled`, `underline`을 추가했습니다.
기본형의 CSS와 native input 동작은 유지합니다. `filled`는
`--surface-subtle`, `underline`은 투명 표면과 아래쪽 테두리를
사용합니다. `className`은 호출자가 재정의할 수 있습니다.

`AffixedInput`은 자체 외곽 테두리를 그리므로 `appearance`를 받으면
속성이 실제 외형에 반영되지 않습니다. 이 속성은 타입에서 제외했습니다.
기존 shadcn/ui Input 소스를 수정한 범위이며 새 외부 코드는 편입하지
않았습니다. 원본 revision과 MIT 고지는 기존 provenance를 따릅니다.

문서 catalog는 Label과 연결된 세 입력의 동작하는 preview와 Usage를
제공합니다. 처음에는 세 칸으로 놓았으나 preview 폭에서 placeholder가
잘려 한 열로 바꿨습니다.

## 검증

- 대상 SSR 테스트 2/2: 세 외형의 `name`, `value`, `required`,
  `aria-invalid`, 기본값과 token class를 확인했습니다.
- UI 전체 테스트 270/270, `npm run typecheck`, `npm run build`,
  `npm run registry:release-check`가 통과했습니다.
- schema 2 release 후보는 78번째이며 146개 item과 144개 public
  component를 담습니다. 새 release ID는
  `sha256-386c361908aa3c1fdbdd48fe846b9fdd3a9ca0d7fd665acb966c37467e468b66`입니다.
- 로컬 Chromium `http://127.0.0.1:5174/?component=input#components`에서
  세 형태가 구분되고 label이 각 input에 연결되는 것을 확인했습니다.
  `filled`에 텍스트를 입력해 값이 유지됨을 확인했고 밝은·어두운
  테마를 비교했습니다.

실제 screen reader·touch·Safari는 실행하지 않았습니다. native
키보드 이동과 form 제출은 이번 preview에서 수동 실행하지 않았으며
native 속성 보존을 대상 테스트로 확인했습니다. 설치 경로와 의존성
형식은 바뀌지 않아 격리 소비자 설치를 반복하지 않았습니다.

## 공급·품질 판정

[판정 재검토](quality-gate-level-review-2026-10-03.md)에 따라 새 API의
핵심 경로와 실제 Usage·preview를 확인했습니다. 외형 변경을 이유로
모든 component의 screen reader·Safari·모바일 검사를 요구하지
않습니다. 기존 component 수량 144개, registry item 146개이며 Goal
관리용 추정은 **약 99% → 약 99%**입니다.
