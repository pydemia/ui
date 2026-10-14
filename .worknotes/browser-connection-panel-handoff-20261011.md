# 브라우저 연결 확인과 SidePanel 비교 인계

2026-10-11. 사용자가 이전의 “플러그인 조회에서는 현재 로컬 브라우저 연결을 복구할 수단을 확인하지 못했습니다”라는 설명에 대해 필요한 조치를 문의했습니다.

## 현재 직접 확인한 상태

- CUA 연결 목록에 Chrome(extension), Edge(extension), Codex In-app Browser(iab)가 표시됩니다. 연결 목록에 있다는 사실만으로 모든 탭의 조작이 정상이라고 판단하지 않습니다.
- 자체 브라우저의 `http://dev.prism.ai/sample/chat/side-panel` 탭은 접근성 트리를 읽을 수 있고 `패널 축소` 버튼이 표시됩니다. 로컬 `http://127.0.0.1:63155/prism?component=prism-panel&state=default&embed=1` 탭도 목록에 있습니다.
- 기존 Chrome의 `http://dev.prism.ai/chat` 탭을 읽었지만 `AXWebArea Leadership PRISM`만 반환됐습니다. 정상적인 로그인 화면 내용이나 후보자 UI는 확인되지 않았습니다. 이번 확인에서는 사용자 탭을 새로고침하거나 로그인 상태를 변경하지 않았습니다.
- macOS 잠금 상태가 Chrome 빈 화면의 원인인지 확정하지 않았습니다. 연결 실패, 입력 실패, 사이트 화면이 비어 있는 상태를 구분해야 합니다.

새 플러그인 설치는 현재 필요한 조치로 확인되지 않았습니다. 사용자가 장비에 접근할 수 있을 때 기존 로그인 프로필에서 PRISM 화면이 정상인지 먼저 확인하고, 연결 실패가 지속되는 경우 `Settings > Computer Use`의 연결 상태와 확장 프로그램을 확인합니다. 브라우저 및 데스크톱 앱 재시작은 그다음 조치입니다. 공식 지침: https://learn.chatgpt.com/docs/chrome-extension#troubleshooting

## 자체 브라우저로 진행한 SidePanel 측정

원본 기본 상태와 확대 애니메이션이 끝난 상태의 측정값을 보존했습니다. 확대 도중 측정한 값은 최종 기하 비교에서 제외합니다.

| 항목 | 배포 원본 | 현재 로컬 재현본 |
| --- | --- | --- |
| 기본 패널 너비 | 440px | 440px |
| 헤더 높이 / 여백 | 64px / 20px | 64px / 20px |
| 동작 버튼 / SVG | 24px / 24px | 32px / 20px |
| 그림자 | rgba(37,38,46,.06) -4px 0 12px | rgba(37,38,46,.12) -4px 0 16px |
| 본문 여백 | 0px | 20px |
| 본문 세로 overflow | hidden | auto |

원본 확대 상태는 viewport 1280px에서 width 1281px, left -1px, right 1280px, z-index 1250입니다. 원본 공개 예제의 h4 제목은 18px/700입니다. 기본 문자열 제목과 rich ReactNode 제목을 구분해 구현할 필요가 있습니다. 양쪽 데모 컨테이너의 높이가 다르므로 패널 전체 높이를 시각 불일치로 세지 않습니다.

다음 작업은 `PrismPanel` 버튼·아이콘·경계선·그림자·확대 규격을 원본에 맞추고 본문 여백과 스크롤을 caller가 지정할 수 있도록 하는 것입니다. 기존 workspace의 본문 스크롤과 크기 조절은 유지해야 합니다. 이 기록 시점에는 패널 소스와 생성물을 변경하지 않았고 기존 메모/빈 상태 작업 기록의 미커밋 변경도 보존했습니다. 인증이 필요한 PRISM 화면의 전체 비교는 미검증입니다. 전체 goal은 계속 active입니다.
