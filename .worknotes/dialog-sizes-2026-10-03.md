# Dialog 크기 선택 — 2026-10-03

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
- 미검증: PR·`main` CI, production preview·manifest·변경 item,
  실제 screen reader·touch·Safari·RTL.

기존 설치 형식·target·의존 경로를 바꾸지 않아 격리 소비자 설치를
반복하지 않습니다. 외부 코드도 편입하지 않아 기존 shadcn/ui
revision의 고지를 재사용합니다. Goal 관리용 추정은 약 99%입니다.
