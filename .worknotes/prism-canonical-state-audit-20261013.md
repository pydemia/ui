# 현재 canonical 상태의 브라우저 조사

직전 goal 턴은 대화 로그·생성 오버레이 구현, 실제 설치, CI 재현성 보정 및 preview readback을 완료한 진척입니다. 시작 HEAD는 `cdc9c8ed5238558b66b0720efb32c54008225c4d`였으며 이전 게시 증거가 추가된 chat-log 작업 기록만 변경돼 있었습니다. 기존 workspace 서버의 port 63354/PID 8691을 확인하고 자체 브라우저의 소유한 tab10을 재사용했습니다. 서버를 다시 시작하지 않았습니다.

현재 manifest의 58그룹/252개 canonical 상태를 320px와 1280px에서 직접 탐색했습니다. CUA의 goto·DOM snapshot·읽기 전용 DOM 측정만 사용했으며 과거 raw Playwright helper는 실행하지 않았습니다. 각 화면에서 main의 component/state 속성이 요청과 일치하는지, h1 이외의 fixture가 렌더됐는지 확인했습니다. 문서 가로 넘침, 중첩 버튼, 화면에 보이는 라벨 없는 native 입력도 조사했습니다.

결과는 504개 고유한 component/state/width 조합이며 중복은 없습니다. 모든 조합에서 위 조건을 통과했고 font loading status는 loaded였습니다. tab10의 브라우저 error 로그도 비어 있었습니다. 폰트 로딩 완료는 원본과의 폰트·픽셀 동일성을 증명하지 않습니다. 팝업을 모두 열거나 모든 callback·상태 전환·API·저장·권한을 실행한 결과도 아닙니다.

첫 desktop 배치에서 이전 함수 closure의 cursor가 끝에 머물러 added0이 반환됐습니다. 이 실행은 검증 수에 포함하지 않았습니다. 별도 상태 객체를 인자로 받는 cursor로 바꾸고 실제 viewport 1280px를 확인한 뒤 desktop 252개를 실행했습니다. 저장된 504개 결과의 고유 키·개수·폭을 별도로 확인했습니다.

패널 long 예제에서 다음 동작을 직접 실행했습니다.

- ArrowLeft로 440→456px, End로 최대 800px가 됐으며 aria-valuenow와 실제 폭이 일치했습니다.
- 확대하면 부모 콘텐츠 폭에 맞고 크기 조절 separator가 사라졌습니다. 부모 border 때문에 bbox 1000px에 대한 panel은 999px였습니다.
- 닫히면 expanded가 해제됐으며 재열기 후 800px 선호 폭과 대화·패널의 합성 초안이 유지됐습니다.
- 부모를 240px로 줄이면 compact 모드로 바뀌고 separator가 사라졌으며 실제 panel 238px로 내부 border에 맞췄습니다. 문서 넘침은 없었습니다.
- 부모를 1200px로 복원하면 800px 선호 폭이 복원됐습니다.
- 닫힘 후 activeElement는 BODY였습니다. opener 포커스 복원은 현재 검사에서 확인되지 않았으며 호출자에서 복원할지 추가 검토해야 합니다. 배포 원본의 요구사항으로 확정하지 않습니다.

증거는 ignored `browser-evidence/current-252-state-audit.json`, `current-panel-sizing-interactions.json`, `current-panel-sizing.png`에 보존했습니다. source fingerprint는 `31cf20034ffccb9e397b17dc3e8f5d30621c0ae0d5bdb2155fab556927b933e7`/84 inputs이며 이전 구현과 동일합니다. 이번 조사는 source 구현을 바꾸지 않았습니다.

현재 원본 대응·설치 그룹 수는 독립 목표 총수나 완료 수가 아닙니다. 인증된 배포 원본·revision·전체 font/pixel/A4·기능 목적·callback/서비스 효과·추가 종류·고도화 및 production 반영은 아직 미완료입니다. 전체 goal은 active로 유지합니다. 새 renderer gate와 선택한 interaction 증거를 공개 검증 자료에 갱신하고 최종 metadata 뒤에 registry와 사이트를 빌드해 이전 manifest/bundle 순서 오류를 반복하지 않습니다.
