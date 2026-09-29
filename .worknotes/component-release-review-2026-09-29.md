# Component 확장안 릴리스 검토

2026-09-29. 작업 브랜치 `codex/ui-component-release`의 변경을 아래
커밋으로 정리했습니다.

| 커밋 | 검토 범위 |
| --- | --- |
| `8c54e35` | `@pydemia/ui`, registry metadata·검사, 테스트, 패키지 설정 |
| `ad5de72` | 문서 사이트와 profile 예시, README, CHANGELOG, research 기록 |
| `7f292b0` | 사이트 빌드 산출물과 현재 불변 registry snapshot, LF 속성 |

현재 릴리스 후보 ID는
`sha256-a1cd11bae6654a55136729439cd7b437a507d59896271b7c0950745a9e61bf21`입니다.
로컬에서 생성했으나 공개한 적 없는 이전 draft ID
`sha256-0fd137f58bdca77709885ac45073c41b44e62791835a8996fac6c1d34eb6f9fe`와
`sha256-9f61dbbe414ff6749e1f47757a9f17baceb35a0b2b4826f1d6a4d390ca168555`는
두 `releases/` 디렉터리에 untracked 상태로 보존하고 이번 커밋에서는
제외했습니다. 이 ID들은 공개 호환성 대상이 아닙니다.

커밋한 파일만 Git archive ZIP으로 추출한 별도 디렉터리에서 다음을
실행했습니다. 따라서 작업 트리의 untracked draft에 의존하지 않습니다.

- `npm ci`: 통과. npm audit 0건.
- `npm run build`: 통과. 91개 item 생성, package·예시·문서 빌드.
- `npm run typecheck`: 통과.
- `npm run test -w @pydemia/ui`: 45/45 통과.
- `npm run registry:check`: 91개 item, 89개 export/catalog,
  불변 snapshot 1개 검증 통과.
- `npm run registry:release-check -- <현재 ID>`: 현재 빌드와 snapshot,
  게시용 최신 JSON의 일치 검사 통과.

첫 Git archive 검사에서는 Windows ZIP 추출본의 snapshot JSON이
CRLF로 변환되어 manifest의 SHA-256과 달랐습니다. `.gitattributes`에
registry와 docs의 JSON을 `text eol=lf`로 지정하고 생성 산출물 커밋을
수정했습니다. 두 번째 archive 검사에서 동일 명령이 모두 통과했습니다.

기본 component 상호작용 중 실제 drag/drop·touch, 다른 시간대,
screen reader 검사는 끝나지 않았습니다. 이 대규모 변경의 독립 코드
검토와 공개 URL의 snapshot 설치·이전 공개 버전 보존, 사이트 배포는
검증하지 않았습니다. 브랜치를
`origin/codex/ui-component-release`로 push했습니다. 네 번째
`4db73d2`는 `.worknotes/` 진행·검증·인계 기록입니다.

## PR과 preview 배포

2026-09-29: [draft PR #1](https://github.com/pydemia/ui/pull/1)을
`main` 대상으로 열었습니다. Vercel의 head commit `193d98c` 상태 검사는
성공했고 preview deployment는 READY입니다. 인증된 preview 브라우저에서
89개 component 목록, Navigation의 전역 탐색 표면형→밑줄형과 측면 탐색
선형→채움형 전환을 확인했습니다. 문서 내 profile 예시도 렌더링됐습니다.

preview의 `/r/releases/<ID>/pyd-button.json`은 Vercel Authentication
302를 반환했고 브라우저의 JSON 직접 탐색도 `ERR_BLOCKED_BY_CLIENT`로
거절됐습니다. 인증 없는 CLI 소비자 설치의 증거가 아닙니다. production의
동일 경로는 아직 404입니다. 이 PR은 draft이며 `main`에 병합하거나
production에 배포하지 않았습니다.
