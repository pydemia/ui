# PageHeader 크기 선택

2026-09-29. 기존 `PageHeader`가 title, subtitle, eyebrow, action과
`h1`/`h2` 계층을 이미 제공합니다. 제목·부제목의 화면별 크기 선택은
반복 사용 가치가 있지만 별도 Title/Subtitle component는 같은
책임을 중복합니다. `size` 속성을 기존 component에 추가했습니다.
component와 registry item 수는 82개·84개로 같습니다.

`compact`는 18px 제목과 12px 부제목, 기본값은 기존 24px·14px,
`hero`는 넓은 화면 48px 제목과 16px 부제목을 사용합니다.
`hero` 제목은 작은 화면에서 36px입니다. 간격에는 기존
`--space-2/4/6` token을 사용합니다. `level`은 크기와 독립적으로
heading element를 선택합니다. 잘못된 `size`는 `RangeError`로 알립니다.
구현은 pydemia/ui 원본이며 외부 source를 복사하지 않았습니다.
의존성은 기존 `pyd-utils`뿐입니다.

문서 preview에 세 크기 선택과 `aria-pressed` 상태를 추가하고,
사용 코드에 `size="hero"`를 표시했습니다. 기존 기본값은 유지합니다.

## 실행한 검사

- `npm run typecheck`, `npm run build`, `npm run registry:check`,
  `npm test -w @pydemia/ui`가 통과했습니다. 패키지 테스트는 18개입니다.
- 로컬 문서 Chromium에서 세 선택 버튼의 상태와 18·24·48px 제목,
  12·14·16px 부제목을 확인했습니다. 세 경우 모두 `h2`였습니다.
  어두운 모드에서 `hero` 제목은 foreground token 색으로 보였습니다.
- 새 Vite 소비자에 `pyd-page-header`와 `pyd-tokens`를 설치했습니다.
  PageHeader·utils·token CSS 3개 파일이 설치됐고 변경된 source는
  저장소 원본과 줄바꿈 정규화 후 일치했습니다. 소비자 typecheck·build와
  production audit(취약점 0건)이 통과했습니다.
- 소비자 Chromium에서 `compact`/`default`/`hero`의 제목 크기
  18·24·48px와 `h2`/`h2`/`h1` 계층을 확인했습니다. console error는
  없었습니다.
- 현재 패키지 tarball을 전체 registry 소비자 fixture에 다시 설치하고
  catalog 사용 코드 82개를 재추출해 typecheck했습니다. 새 `size="hero"`
  예시를 포함해 모두 통과했습니다.
- 로컬 소비자 설치 후 기본 공개 URL로 빌드 산출물을 복원하고
  `registry:check` 84개 item을 다시 통과했습니다.

소비자 fixture는
`C:\Users\pydemia\AppData\Local\Temp\pydemia-ui-page-header-size-consumer-20260929`
입니다. 실제 좁은 viewport, screen reader 발표, 다른 브라우저와
공개 배포는 검증하지 않았습니다.
