# PRISM 대화 입력창 진행 기록 · 2026-10-13

- 기준: 인증된 PRISM-DEV 대화 입력창을 브라우저에서 확인했습니다. 로컬 frontend 기준 revision은 `d677e551a61f672025dcc1803a56ff0cab1e36ee`이며 배포본과 같은 revision인지는 확인하지 못했습니다.
- 원본 기본 상태: 외곽 800×110px, 입력 영역 60px, 첫 글줄 20px, 동작 영역 48px, 전송 버튼 28px입니다. 빈 값에서는 글자 수를 숨기고 5자 합성 입력에서는 `5/2000자`를 표시했습니다. 합성 초안은 원본에서 제거했습니다.
- 구현: `PrismChatInput`의 placeholder, 2000자 상한, 최대 5줄 자동 높이, 생성 중 표시와 중단 버튼, 28px 전송 버튼을 보정했습니다. 합성 1000자 입력을 320px에서 검사해 textarea 내부 스크롤과 문서 가로 넘침 부재를 확인했습니다.
- 독립 설치: registry의 59개 모듈 원문과 CSS를 정확히 설치하고 40개 예제를 typecheck·Vite build로 확인했습니다. 설치본 브라우저에서 중단 뒤 초안이 남고 전송 횟수가 0회임을 확인했으며 전송 버튼 한 번을 누른 뒤 1회가 됐습니다. 버튼 전환 직후 의도치 않은 form submit 문제를 수정한 결과입니다.
- 남은 검증: 배포본의 생성 중·긴 내용·모바일·첨부 상태, 실제 채팅 API 전송·중단, 다른 브라우저 IME 동작, 전체 pixel parity, 배포 revision 일치 여부입니다.
- `prism:check` 291건 통과, 전체 typecheck·site build·registry release check 통과, 독립 설치본 59개 모듈·40개 예제 확인을 마쳤습니다. PR #162의 source commit·generated commit·CI·exact-head preview 검증은 아직 진행 중입니다.
