# Design modes 지원

ui.pydemia.ai의 Design mode 목록에서 디자인을 탐색하면 큰 상세 미리보기만
바뀝니다. 데스크톱에서는 항목 클릭 또는 Enter로 적용합니다. 좁은 화면에서는
후보를 선택한 뒤 적용 버튼을 누릅니다. Escape는 취소하고 선택 버튼으로 돌아갑니다.
설정 없는 첫 방문은 Basic / Light / Neutral입니다. PRISM은 기존 디자인을 유지합니다.

| ID | 디자인 | 지원 밝기 |
| --- | --- | --- |
| basic | Basic | Light / Dark |
| glass | Glassmorphism | Light / Dark |
| material | Material Inspired | Light / Dark |
| fluent | Fluent Acrylic | Light / Dark |
| neumorphic | Neumorphism | Light / Dark |
| flat | Flat Design | Light / Dark |
| bento | Bento Grid | Light / Dark |
| brutal | Neobrutalism | Light / Dark |
| clay | Claymorphism | Light / Dark |
| skeuo | Skeuomorphism | Light / Dark |
| dark-ui | Dark UI | Dark |
| minimal | Minimalist SaaS UI | Light / Dark |
| swiss | Swiss Style | Light / Dark |
| editorial | Editorial UI | Light / Dark |
| aurora | Aurora Mesh | Light / Dark |
| cyber | Cyberpunk UI | Dark |
| terminal | Terminal UI | Dark |
| retro | Retro Desktop UI | Light / Dark |
| pixel | Pixel Art UI | Light / Dark |
| drawn | Hand drawn UI | Light / Dark |
| spatial | Spatial UI | Light / Dark |

Dark UI에서 Light로 바꾸면 Basic Light로 이동합니다. Cyberpunk/Terminal의
Light 요청은 해당 Dark로 정규화합니다. 디자인 전환은 입력·필터·선택과
열린 Dialog를 유지합니다. 지역 ThemeScope와 그 portal은 부모 페이지와
다른 디자인·밝기·팔레트를 사용할 수 있습니다.

소비자 설치·CSS 연결·TypeScript 사용법은 [README](../README.md#design-mode-소비자-사용)에 있습니다.
`releasedDesignModes`에는 21종이 포함되며 일반 앱에 `allowUnreleased`를 설정할 필요가 없습니다.

일반 Chromium 화면·키보드/focus·반응형·상태 보존·독립 설치와 자동 검사를
확인했습니다. 실제 화면 낭독기, 실제 브라우저200% 확대, reduced-motion/
forced-colors 활성 환경, blur 미지원 환경은 후속 수동 검수 범위입니다.
이는 해당 환경의 실행 통과나 전체 접근성 인증을 의미하지 않습니다.
