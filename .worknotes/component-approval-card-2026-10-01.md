# ApprovalCard 작업 기록

## 시작 상태와 판정

- 목표 진척도: 약 80% (관리용 추정). 현재 102개 component,
  104개 registry item, 공급·품질 체크리스트 5/10 완료.
- 이번 단위: AI 도구 실행의 승인 요청·승인·거절·만료를 표시하고
  승인 결정을 한 번만 전달하는 `ApprovalCard`를 공급합니다.
- `ToolCall`은 실행 대기·진행·성공·실패를 표시하며 승인 입력은
  받지 않습니다. 승인 후 실제 도구 실행과 최종 status는 소비자가
  소유합니다.
- 완료율은 component 수/100으로 계산하지 않습니다. 이번 변경의
  종료값은 공급 범위와 검증 결과를 보고 판단합니다.

## 설계·검증 범위

- 요청 ID, 제목, 설명, controlled status, 비동기 결정 callback을
  필수로 둡니다. 두 버튼의 중복 제출과 실패 후 재시도를 처리합니다.
- 원본 React·기존 Button·token 구현입니다. AI Elements Confirmation은
  동작 참고 자료이며 source를 복사하지 않습니다.
- 패키지 typecheck·테스트, 문서 build, registry 정합성, 브라우저
  승인·거절·만료·실패·재시도·키보드·좁은 화면을 확인합니다.
- 실제 screen reader, touch, Safari, RTL은 별도 미검증 항목입니다.

## 로컬 검증

- `npm run typecheck` 통과. UI 선언, 프로필 예시, 문서 TypeScript를
  검사했습니다.
- 패키지 테스트 104/104 통과. 요청의 이름·설명·두 결정 버튼,
  완료·거절·만료 시 버튼 제거, 필수값·상태 오류를 확인했습니다.
- 로컬 Chromium 문서 preview에서 승인 버튼 빠른 이중 클릭의 전달
  시도는 1회였습니다. 첫 전달 실패는 alert와 재시도 버튼을 표시했고,
  Enter 재시도 뒤 승인됐습니다. 별도 요청에서는 Space로 거절했고
  만료 상태에서는 결정 버튼이 사라졌습니다.
- 390px Chromium에서 만료 카드 폭은 330px, body·viewport는
  모두 390px이었습니다.
- `npm run build` 통과. 105개 registry item과 문서·프로필 예시를
  생성했습니다. `registry:check`는 새 provenance에 비해 소비자 고지의
  고정 해시가 이전 값이어서 실패했습니다. source 고정 commit 후 고지를
  갱신하고 다시 검사합니다.
- 이 브라우저 검사는 데모 callback의 로컬 상태만 확인합니다. 서버
  idempotency, 실제 도구 실행, 보조기술 발표는 확인하지 않았습니다.
- source commit `1ee626a4597accbc3898794df3c8a05b0b8f0dc4`와
  provenance SHA-256
  `4b094b388af9204d56df8796c2ea95763d604cf9a0b9742da6cc98bacc2e6bcd`를
  소비자 고지에 고정했습니다. `registry:snapshot`이 105개 item·103개
  export/catalog·기존 19개 release를 확인하고 20번째 snapshot
  `sha256-08426c9a767fdc4c69eba32819484ce7ef920d00de9999c3b85c2efe8772ebcc`를
  만들었습니다.
