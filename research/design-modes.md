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

디자인은 색상뿐 아니라 컨트롤 형태, 재질, 타이포그래피와 실제 업무 화면의
구성을 함께 바꿉니다. Bento, Spatial, Skeuomorphism, Terminal, Retro, Pixel 후보는 업무 화면을 미리보기 맨 위에
바로 표시합니다. 다른 후보에서도 조합 화면 상세 미리보기를 펼칠 수 있으며,
후보를 바꾸어도 펼친 업무 화면의 입력·필터·행 선택은 유지됩니다.

| 디자인 | 주요 시각 특징 |
| --- | --- |
| Glassmorphism | 보라·청록 배경이 비치는 투명 유리, 강한 blur, 밝은 가장자리 |
| Material Inspired | 캡슐 버튼, 채워진 필드, tonal 표면과 단계별 elevation |
| Fluent Acrylic | 잔결이 있는 acrylic, 부드러운 reveal 하이라이트, 청회색 chrome |
| Neumorphism | 같은 회색 표면에서 솟거나 들어간 이중 그림자 |
| Flat Design | 그림자 없는 단색 블록과 색으로 구분한 표제 |
| Bento Grid | 크기가 다른 색상 타일, 큰 첫 지표와 비대칭 차트 격자 |
| Neobrutalism | 굵은 검은 경계, 선명한 색과 단단한 offset 그림자 |
| Claymorphism | 둥근 pastel 덩어리, 안쪽 빛·그림자와 바깥쪽 입체 그림자 |
| Skeuomorphism | 광택·bevel 버튼, 새겨진 입력면과 brushed 표면 |
| Dark UI | 검정 중심의 중성 표면과 깊이가 다른 어두운 레이어 |
| Minimalist SaaS UI | 프레임을 줄인 여백, 얇은 선과 절제된 typography |
| Swiss Style | 강한 격자, 큰 제목, 검정 표제와 빨강 강조 |
| Editorial UI | serif 제목, 종이색 바탕, 이중 선과 인쇄물 같은 위계 |
| Aurora Mesh | 넓은 다색 mesh 배경과 읽을 수 있는 콘텐츠 표면 |
| Cyberpunk UI | 잘린 모서리, 네온 경계·빛과 scanline 격자 |
| Terminal UI | 단색 녹색 monospace, 점선 프레임과 분절된 progress |
| Retro Desktop UI | 회색 bevel, navy 제목줄과 눌리는 고전 컨트롤 |
| Pixel Art UI | 계단식 모서리·그림자, monospace와 반복 픽셀 타일 |
| Hand drawn UI | 손글씨 제목, 불규칙 모서리·스케치 선과 노트 바탕 |
| Spatial UI | 자체 벡터 공간 배경, 떠 있는 chrome과 높이가 다른 패널 |

투명 재질을 지원하지 않는 브라우저에서는 읽을 수 있는 불투명 표면으로
대체합니다. 각 지역 scope는 부모의 캔버스·clip·그림자·구성 값을 초기화한
뒤 자신의 디자인을 적용합니다. Basic 기본 스타일과 PRISM은 보존합니다.

각 후보의 ‘스타일 설명과 원본 예시 보기’에서 [개정 Atlas](https://ui.pydemia.ai/ui-design-atlas-20.html)의
해당 상세 설명을 열 수 있습니다. Material과 Fluent는 디자인 시스템,
Bento는 배치, Dark UI는 테마, Terminal과 Spatial은 인터페이스 방식으로
분류합니다. 현재 구현은 기존 웹 컴포넌트에 해당 개념을 적용한 예시입니다.

Glass는 유리 카드와 탐색 면을 유지하면서 표·본문의 불투명도를 높입니다.
Fluent의 acrylic은 일시적인 팝업·서랍에 적용하며 업무 영역은 불투명하게
유지합니다. Clay는 주요 카드·액션에 쿠션 같은 입체감을 집중합니다.
Neumorphism의 일반 입력·버튼은 경계를 유지하고, Neobrutalism의 버튼은
누를 때 그림자와 위치가 함께 변합니다. Cyber의 데이터 면은 차분하게
유지하며, Editorial은 실제 프로젝트 목록을 설명하는 기사·캡션을,
Hand-drawn은 안정적인 입력 형태와 절제된 SVG 스케치 선을 표시합니다.

조합 화면의 Skeuomorphism 다이얼과 기간 메뉴는 같은 기간을 선택하고
지표를 갱신합니다. Terminal 작업 공간에서 `/`는 검색, `1`은 개요,
`2`는 최근 실행, `?`는 도움말로 이어집니다. 입력 중에는 단축키를
가로채지 않으며 문자 그래프도 선택한 기간의 데이터를 사용합니다.
Retro 창은 최소화·확대·닫기·다시 열기를 지원하고, 제목줄의 방향키로
제한된 범위에서 이동합니다. 좁은 화면에서는 이동 없이 고정 배치합니다.
Pixel의 진행률은 최근 실행의 완료·실행 중·실패 상태를 반영하고,
픽셀 SVG는 정수 배율로 표시합니다. 디자인 전환 중에는 업무 화면의
입력·필터·선택 상태를 유지합니다.

일반 Chromium 화면·키보드/focus·반응형·상태 보존·독립 설치와 자동 검사를
확인했습니다. 실제 화면 낭독기, 실제 브라우저200% 확대, reduced-motion/
forced-colors 활성 환경, blur 미지원 환경은 후속 수동 검수 범위입니다.
이는 해당 환경의 실행 통과나 전체 접근성 인증을 의미하지 않습니다.

각 비Basic 디자인의 `Design default`는 고유 이름·기준색·Light/Dark 역할색을
가집니다. [팔레트 데이터](design-default-colormaps.json)는 개정 시안의 색을
기준으로 Colors의 OKLCH 생성·대비 보정 로직을 사용한 결과입니다.
시안 이미지에서 해석한 HEX는 원본 제품의 공식 토큰을 뜻하지 않습니다.
기존 Neutral/Pydemia/Ocean/Forest/Violet 선택과 직접 HEX 조정은 유지합니다.
Colormap 화면에서 현재 디자인의 Colors 프로젝트 JSON을 받은 뒤
[Colors](https://colors.pydemia.ai/)의 JSON 가져오기로 기준색·역할색을 편집할 수 있습니다.

폰트는 [Font Library](https://skills.pydemia.ai/fonts)의 공개 승인 원본을
이 앱의 hash 경로에서 제공합니다. 서브세트·형식 변환 없이 원본 bytes와
[라이선스 고지](https://ui.pydemia.ai/fonts/design/notices.txt)를 보존했습니다.
[폰트 명세](design-fonts.json)에 자산 hash·실제 weight·한글 coverage를 기록했습니다.
폰트 CSS는 해당 모드에서 사용하는 face를 요청하며 `font-display: swap`으로
대체 글꼴을 즉시 표시합니다. 다운로드·캐시·네트워크 상태에 따라 전환 직후
표현이 달라질 수 있습니다. 소비자도 `design-modes.css` import로 같은 공개
폰트 경로를 사용합니다. Basic/PRISM과 이름이 충돌하지 않는 CSS family alias를 사용합니다.

| 역할·디자인 | 폰트 |
| --- | --- |
| 일반 UI·본문·표 | Work Sans + Nanum Gothic |
| Glass·Fluent·Neumo·Clay·Dark·Aurora·Spatial 제목 | Manrope + Nanum Gothic |
| Neobrutal·Retro 제목 | Jost + Nanum Gothic |
| Skeuo·Editorial 제목 | Source Serif 4 + Nanum Myeongjo |
| Hand-drawn 제목 | Source Serif 4의 실제 italic face + Nanum Myeongjo |
| Cyber 제목 / 데이터 | Rajdhani 600 / JetBrains Mono |
| Terminal / Pixel 제목·수치 | JetBrains Mono |

Pixel 본문은 일반 UI 글꼴을 사용합니다. 장식은 픽셀 도형·sprite에 두고,
Hand-drawn의 serif italic를 손글씨 폰트라고 표시하지 않습니다.
