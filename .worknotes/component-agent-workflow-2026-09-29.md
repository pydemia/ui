# AI 작업 상태 component

2026-09-29. `Conversation`과 `Message`는 대화의 순서와 발신자를
표시하지만, 접을 수 있는 reasoning과 도구 실행의 대기·진행·성공·오류
상태를 반복해서 구현해야 합니다. `Reasoning`은 disclosure와 생성
상태, `ToolCall`은 도구 이름·입력·결과·오류를 맡습니다.

`Reasoning`은 기존 shadcn 기반 `Collapsible`을 조합합니다. label은
필수이고 streaming·complete·failed 상태를 구분합니다. inline과
card 표현을 제공합니다. 내용은 기본적으로 접으며 streaming 중
`aria-busy`를 적용합니다. `ToolCall`은 pending·running·succeeded·
failed를 구분하고 입력은 native `details`로 펼칩니다. 성공 결과와
실패 오류가 상태와 모순되면 오류를 냅니다. card와 compact 표현을
제공합니다.

[WAI-ARIA APG Disclosure Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)의
button·`aria-expanded`·Enter/Space 동작과
[WAI-ARIA status role](https://www.w3.org/TR/wai-aria-1.2/#status)의
polite 발표 규칙을 확인했습니다. 두 component의 구현은 저장소
원본이며 외부 source를 복사하지 않았습니다. `Reasoning`은 기존
`Collapsible`·lucide·utils, `ToolCall`은 utils만 사용합니다.

## 구현·검증 상태

`@pydemia/ui` export, `pyd-reasoning`·`pyd-tool-call` registry,
provenance와 동작하는 문서 preview·사용 코드를 연결했습니다. 현재
로컬 작업 트리는 66개 component, 68개 registry item입니다.
공식 shadcn Collapsible 문서, 고정 revision의 source와 같은 revision의
MIT LICENSE를 확인했고, `@radix-ui/react-collapsible@1.1.20`과
`lucide-react@0.468.0` 설치 상태를 확인했습니다.

`npm run typecheck`, `npm run build`, `npm run registry:check`,
`git diff --check`가 통과했습니다. 정적 산출물에 로컬 registry URL이
남지 않았습니다. server render에서 상태 표시와 공백 이름·모순된
결과·오류 거부를 확인했습니다. 문서 Chromium에서는 Reasoning의
Enter·Space 접힘, 펼침 상태, 상태 변경과 ToolCall의 입력 펼침,
대기·진행·완료·실패 및 결과·오류 전환을 확인했습니다. 두 표현의
밝은/어두운 모드도 확인했습니다.

새 Vite 소비자 fixture에서 두 registry item과 token을 설치해
Collapsible·MIT 고지를 포함한 6개 파일이 생성됐습니다. 설치본의
typecheck·build·브라우저 상태 전환이 통과했습니다. 마지막 source
수정 뒤 해당 item을 재설치하고 두 component 파일이 저장소 원본과
동일함을 확인했습니다. 소비자 runtime audit는 0건입니다. 전체
audit의 high 1건은 fixture의 Vite 7.1.3 개발 의존성에 있습니다.

실제 screen reader 발표, touch, RTL, streaming 과정의 빈번한
내용 변경과 전체 item의 새 설치·공개 배포는 검증하지 않았습니다.
