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
구성을 함께 바꿉니다. Bento와 Spatial 후보는 업무 화면을 미리보기 맨 위에
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

일반 Chromium 화면·키보드/focus·반응형·상태 보존·독립 설치와 자동 검사를
확인했습니다. 실제 화면 낭독기, 실제 브라우저200% 확대, reduced-motion/
forced-colors 활성 환경, blur 미지원 환경은 후속 수동 검수 범위입니다.
이는 해당 환경의 실행 통과나 전체 접근성 인증을 의미하지 않습니다.
