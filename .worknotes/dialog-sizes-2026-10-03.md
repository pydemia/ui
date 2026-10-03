# Dialog 크기 선택 — 2026-10-03

PR #156을 `main`의 `78af088d`로 병합했습니다. PR과 `main`의
Verify UI, `main`의 Pages가 통과했습니다. Vercel production은 아직
이전 배포를 가리키고 83번째 manifest·item은 사용자 도메인에서
HTTP 404입니다. 따라서 공개 공급 확인은 대기 중입니다.
병합 commit `78af088d`의 GitHub Vercel status는 `failure`이고
설명은 `Deployment rate limited — retry in 24 hours.`입니다.
83번째 manifest·Dialog item은 GitHub raw에서 HTTP 200입니다.

복합 폼과 편집 화면을 같은 모달 API로 표시하기 위해
`DialogContent`에 `default`(기존 크기), `wide`, `fullscreen`을
추가했습니다. `Dialog`의 Radix focus·닫기 동작과 기존 기본 크기를
유지합니다. 문서 preview에서 세 크기를 열고 Usage에는 넓은 모달
예시를 제공합니다. 새로운 component·registry item·의존성은 없습니다.

## 검증 상태

- 확인: `npm run typecheck`, 대상 테스트 2/2, UI 전체 280/280,
  `npm run build`, `npm run registry:release-check`. 83번째
  snapshot은
  `sha256-25ca4393b38b8fcebbbd34ca3d8c73475e773a766e971da004f94e40728bc896`입니다.
- 확인: 로컬 Chromium의 기본 폭 512px·넓은 폭 896px. 전체 화면
  모달은 데스크톱 1280×720과 모바일 390×844의 viewport를
  채웁니다. 모달을 열면 닫기 버튼에 focus가 들어가고 Escape로 닫으면
  열기 버튼으로 돌아옵니다.
- 미검증: production 배포와 83번째 manifest·변경 item,
  실제 screen reader·touch·Safari·RTL.

기존 설치 형식·target·의존 경로를 바꾸지 않아 격리 소비자 설치를
반복하지 않습니다. 외부 코드도 편입하지 않아 기존 shadcn/ui
revision의 고지를 재사용합니다. Goal 관리용 추정은 약 99%입니다.
