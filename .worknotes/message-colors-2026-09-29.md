# Message 발신자별 색상

2026-09-29. 사용자 요청은 user 메시지를 어두운 배경과 밝은 글씨로 표시하고,
assistant 메시지는 기존 표현을 유지하는 것입니다.

기존 `MessageContent`는 발신자와 관계없이 `bg-surface`와 상속된 글자색을
사용하고, user에게는 accent 테두리만 적용했습니다. 다크 테마의 accent는
밝은 색이므로 user 전용 token을 추가했습니다.

- light: `--message-user-background: #103344`, 흰색 글씨
- dark: `--message-user-background: #245d70`, 흰색 글씨
- assistant/system: 기존 `bg-surface`, `border-border`, 상속된 글자색

`@theme inline`에서 색상 utility를 연결하고 `MessageContent`의 user
variant에만 적용했습니다. API, 의존성, registry metadata는 바뀌지
않습니다. 문서 catalog의 설명과 생성된 registry JSON도 갱신했습니다.

## 검증

- `npm run typecheck`, `npm run build`, `npm run registry:check` 통과.
- 빌드된 문서의 Message preview를 브라우저에서 확인했습니다. 계산된
  user 배경/글자색은 light `#103344`/`#ffffff`, dark
  `#245d70`/`#ffffff`입니다. assistant는 기존 light
  `#ffffff`/`#202a35`, dark `#1b242d`/`#e9eef2`입니다.
- user 글자색 대비는 WCAG 계산식으로 light 13.30:1, dark 7.31:1입니다.
- 실제 screen reader 발표와 전체 WCAG audit은 실행하지 않았습니다.
- 문서 빌드의 기존 500 kB 초과 JS chunk 경고가 남아 있습니다.
