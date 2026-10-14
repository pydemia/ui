# PRISM 새 대화 인트로 진행 기록 · 2026-10-13

- 원본: 인증된 `dev.prism.ai/chat` 기본 상태와 frontend `dev` `d677e551a61f672025dcc1803a56ff0cab1e36ee`의 `ChatIntroSection`을 확인했습니다. 배포 revision과 checkout revision의 동일성은 확인하지 못했습니다.
- 측정: 인트로 폭 800px, 인사말 167px, 카드 800×149.1875px, 질문 45.59375px, 입력창 800×110px입니다. 질문 색상은 배경 `#f7f9fd`, 글자 `#363636`입니다. 원본에서 질문 선택 후 입력 값·포커스 이동을 확인하고 합성 초안을 지웠습니다.
- 변경: 카드 제목·설명 본문을 묶어 불필요한 14px 간격을 없앴고 원본과 같은 카드 높이·질문 색상·hover를 적용했습니다. 로딩 카드는 48px 아이콘과 120/180px 문구 skeleton으로 바꿨습니다. 기본·로딩 상태의 320px 문서 가로 넘침은 0px입니다.
- 독립 설치본: 59개 모듈과 CSS가 생성 레지스트리와 일치하고 40개 예제 typecheck·Vite·폰트·고지 검사가 통과했습니다. 브라우저에서 질문 선택 후 controlled 값·포커스 이동·전송 0건, 카드 callback 1회, 카드 로딩 구조, 320px 기본·로딩 넘침 0px을 확인했습니다.
- 전체 `prism:check` 293건, workspace typecheck, site build, registry release check가 통과했습니다.
- 검증 경계: 배포 원본의 로딩·모바일·hover, 즐겨찾기 실제 라우팅, 전체 pixel/font 일치는 아직 확인하지 못했습니다. PR/CI/preview 상태는 후속 증거에 기록합니다.
