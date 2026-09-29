# Conversation 편입

2026-09-29. `Message`는 한 메시지를 표시하고 `PromptInput`은 입력을
담당하지만, 목록의 스크롤 위치와 새 메시지 안내는 소비자마다 다시
구현해야 합니다. `Conversation`은 순서가 있는 메시지 배열을 받아
`Message`로 렌더하고 읽기 위치를 관리합니다.

값은 안정적인 ID, 발신자, ReactNode 내용으로 구성합니다. 중복·공백
ID는 거부합니다. 처음에는 최신 메시지를 보여주며, 끝을 보고 있을
때만 추가된 메시지와 내용 높이 변화를 따라갑니다. 위로 스크롤해
이전 내용을 읽고 있으면 위치를 유지하고 새 메시지 수와 이동 버튼을
표시합니다. 버튼을 누르면 끝으로 이동하고 목록에 focus를 둡니다.

WAI-ARIA 1.2의 `log` role은 순서대로 추가되는 채팅 기록을 예시로
듭니다. live 발표는 `polite`를 기본으로 하고 `aria-relevant`를
`additions`로 제한합니다. streaming 중에는 소비자가 `busy`를
지정합니다. 실제 screen reader 발표는 별도로 검증해야 합니다.

이 저장소의 원본 React·Tailwind 구현이며 기존 `Message`와
`pyd-utils`를 사용합니다. 외부 component source나 새 runtime
dependency는 추가하지 않습니다.

## 구현·검증 상태

`@pydemia/ui` export, 내부 registry의 `pyd-conversation`,
provenance, 문서 preview와 사용 코드를 연결했습니다. 현재 로컬 작업
트리는 64개 component, 66개 registry item입니다.

`npm run typecheck`, `npm run build`, `npm run registry:check`,
`git diff --check`가 통과했습니다. 정적 산출물에 로컬 registry URL이
남지 않았습니다. server render에서 빈 상태·두 발신자 표시와
공백 label·빈/중복 ID 거부를 확인했습니다.

문서 preview의 Chromium에서 초기 최신 위치, 끝에서 응답을 추가할 때
자동 스크롤, 이전 내용을 읽는 동안 위치 유지와 새 메시지 2건 안내,
이동 버튼의 끝 스크롤·focus, PromptInput Enter 전송, 대화 비움을
확인했습니다. 새 Vite 소비자 fixture에서 `shadcn add`로 conversation과
token을 설치해 4개 파일이 생성됐고, typecheck·build와 브라우저의
추가 동작이 통과했습니다. 소비자 runtime audit는 0건입니다. 전체
audit의 high 1건은 fixture의 Vite 7.1.3 개발 의존성에 있습니다.

실제 screen reader 발표, touch, streaming 중 내용 변경, 대량
메시지 성능, 전체 item의 새 설치, 공개 배포는 검증하지 않았습니다.
과거 메시지 prepend와 가상 스크롤은 현재 API 범위에 없습니다.
