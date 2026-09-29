# CodeBlock 편입

탭형 `Snippet`과 달리 단일 코드·파일·응답 본문을 표시할 때 사용할
`CodeBlock`을 추가했습니다. 필수 label, 선택적 language, 긴 줄의
가로 scroll·줄바꿈, 복사 버튼과 성공·실패 상태를 제공합니다.
`figure`·`figcaption`·`pre`·`code`의 native 의미와 기존 Button,
공통 token을 사용합니다. 외부 component source나 새 npm dependency는
편입하지 않았습니다. MDN의 HTML `pre`와 Clipboard API 문서를
확인한 범위는 `research/source-inventory.md`에 기록했습니다.

패키지 테스트 31개와 저장소 typecheck가 통과했습니다. 문서
Chromium에서 wrap 전환, Enter로 복사 버튼 실행과 성공 상태,
ArrowRight로 코드 영역의 가로 scroll 위치 증가(0→40),
390px 화면의 블록 내부 scroll·줄바꿈 및 문서 전체 가로 넘침 없음,
console error 0건을 확인했습니다. 브라우저의 실제 clipboard 값은
독립적으로 확인하지 못했으므로 성공 상태만 검증한 것으로 기록합니다.

임시 소비자 경로:
`C:\Users\pydemia\AppData\Local\Temp\pydemia-ui-code-block-consumer-20260929`.
로컬 registry URL의 `pyd-code-block`·`pyd-tokens`를
`shadcn@4.0.0 add`로 설치했습니다. 생성된 CodeBlock·Button·utils·
token CSS·MIT 고지 5개 파일은 줄바꿈 정규화 후 원본과 같았습니다.
소비자 typecheck·Vite build와 production audit(high 이상 0건)가
통과했습니다.

저장소 전체 build·registry:check가 통과했습니다. 기본 공개 URL로
88개 registry item을 생성했고 86개 원본·public export·catalog ID의
1:1 대응을 확인했습니다. `git diff --check`도 통과했습니다. 문서
Vite build에는 500 kB 초과 chunk 경고가 있었지만 빌드는 완료됐습니다.
실제 screen reader 발표, touch, 다른 브라우저, 88개 item 동시
재설치, 갱신 충돌·복구와 공개 배포는 확인하지 않았습니다.
