# 하단 탐색 확장

`Navigation`의 전역·측면 링크에 `BottomNav`와 `BottomNavLink`를
추가했습니다. 좁은 제품 화면에서 주요 목적지를 이동하는 용례입니다.
새 registry item이나 별도 component 수는 늘리지 않았습니다.

## 판정과 구현

- 기존 `GlobalNav`·`SideNav`는 같은 링크 의미를 가지지만 하단 배치와
  icon·이름의 세로 정렬은 반복되는 독립적인 화면 패턴입니다. 기존
  `pyd-navigation` 파일 안에 API를 추가했습니다.
- `BottomNav`는 이름 있는 native `<nav>`이고, 각 목적지는 `href`와
  항상 보이는 `label`이 필수인 native `<a>`입니다. icon은 장식으로
  숨깁니다. 현재 페이지는 소비자가 `aria-current="page"`로 표시합니다.
  URL 상태나 fixed 배치를 내부에서 관리하지 않습니다.
- 색·간격·표면은 기존 semantic token을 사용합니다. 좁은 너비에
  목적지가 많으면 내부 가로 scroll을 허용합니다.
- [MUI 공식 예시](https://mui.com/material-ui/react-bottom-navigation/)의
  사용처를 참고했습니다. 같은 revision의 source와 LICENSE는
  [source inventory](../research/source-inventory.md)에 기록했습니다.
  외부 source를 복사하거나 MUI dependency를 추가하지 않았습니다.
  새 item 자체의 registry 의존성은 기존 `pyd-utils`뿐입니다.

## 검증

- 패키지 테스트 39개 중 새 테스트 2개가 native landmark·링크·현재
  페이지와 누락된 이름·경로의 오류를 확인했고 전체 39개가 통과했습니다.
- 문서 preview에서 pointer로 `받은 편지함`, Enter로 `설정`을 선택할
  때 표시 내용과 `aria-current`가 함께 바뀌었습니다. 초기 문서 로딩의
  browser console error·warning은 0건이었습니다.
- 390px Chromium viewport에서 하단 탐색은 275px 영역 안에 놓였고
  document scrollWidth 375px는 viewport 390px보다 작았습니다.
- `shadcn@4.21.0 add`로 새 소비자에 `pyd-navigation`과 `pyd-tokens`를
  설치했습니다. 생성된 `navigation.tsx`, `utils.ts`, `tokens.css`가
  저장소 원본과 개행 차이를 제외하고 일치했습니다. 소비자
  `tsc --noEmit`과 Vite build가 통과했습니다. fixture:
  `C:\Users\pydemia\AppData\Local\Temp\pydemia-ui-bottom-navigation-consumer-20260929`.
- 저장소 `npm run typecheck`, `npm run build`, `npm run registry:check`와
  `git diff --check`의 최종 결과는
  [검증 표](../research/verification.md)에 기록합니다.

실제 screen reader 발표, touch 이동, 5개를 넘는 목적지의 내부 scroll,
라우터 연동과 공개 배포는 확인하지 않았습니다. 고정 하단 배치와
safe-area 처리는 소비자 화면이 담당합니다.
