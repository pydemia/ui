# Pyd Monotone 구현·게시 작업 기록

날짜: 2026-11-07

## 범위와 격리

- 사용자 요청: 기획된 기능성 monotone 아이콘을 실제로 제작해 `ui.pydemia.ai`에 추가하고, UI·아이콘 활용 Skill을 `skills.pydemia.ai`에 게시한다.
- 원본 checkout `C:/Users/pydemia/git/ui`의 기존 미커밋 변경은 건드리지 않는다. 이 작업은 `codex/monotone-icons-2026-11-07` worktree에서 수행한다.
- 앞선 기획 기록과 `research/monotone-icon-system.md`를 이 worktree에 가져왔다.

## 결정과 현재 상태

- 39종 16·24px SVG, chevron 20px 강조형, `currentColor`, 기본 장식 처리 및 명시적 이름을 가진 SVG의 `role=img`를 구현했다.
- `pyd-monotone-icons` registry 항목과 검색 가능한 Foundation 카탈로그를 추가했다. CopyButton, PasswordInput, Tree, TreeNav, Sidebar 내부 아이콘을 교체했다.
- 검증 완료: `npm run typecheck`, `npm run registry:build`, `npm run registry:check`, `npm run build`, UI 패키지 테스트 320개, 문서 테스트 15개.
- Edge의 로컬 사이트에서 39개 표시, `copy` 검색 결과 1개, Basic light/dark 렌더링을 확인했다. 아이콘 출처 링크 확장자 오류를 고쳤다. 다른 디자인 모드·실사용자 식별성은 별도 검수하지 않았다.
- immutable registry release `sha256-c291d550f044c9ff2888401021ad173d49925ac57f1fe8be22e3dc1092d06138`을 생성했다. `npm run registry:release-check`가 현재 빌드와 일치한다.
- Skill canonical source·Prompt·아키텍처 등록은 별도 `agent-skills` worktree에 작성했다. `npm run validate`, Python 3.13 환경의 테스트 173개, `npm run ci:local`이 통과했다. Skill PR은 [pydemia/agent-skills#43](https://github.com/pydemia/agent-skills/pull/43)이다.

## 남은 작업

- UI 게시용 변경 커밋·PR·배포와 공개 registry URL 확인.
- Skill PR 병합·배포 및 사이트 Skill·Prompt 목록·상세 확인.
- 체크가 끝나면 검증 범위와 공개 URL을 이 문서에 갱신한다.
