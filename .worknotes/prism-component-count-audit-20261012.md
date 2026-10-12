# 컴포넌트 수 산정 재조사

원본 frontend HEAD 27c4fdbf3e73234b7ab5c46e379a04d083c12df8와 현재 source-inventory를 조사했습니다. 앞서 186개를 일반 컴포넌트로 설명한 것은 파일 수와 독립 구현 단위를 혼동한 표현입니다. 186은 구현 목표의 분모로 사용하지 않습니다.

원본 inventory 273개는 벡터 TSX 자산 87개와 비벡터 TSX 파일 186개입니다. src/components 아래의 269개 TSX와 layouts 아래의 4개 파일을 포함합니다. 각 파일의 독립성, 실제 사용 여부, 상태별 분리나 상위 화면 구성은 이 집계에 반영되지 않았습니다.

src/main.tsx에서 runtime import, literal dynamic import, Vite import.meta.glob으로 등록되는 샘플 페이지까지 추적했습니다. sampleRoutes 연결을 제거한 본서비스 그래프에서 175개 파일이 도달 가능하며, 샘플에서만 7개가 도달 가능합니다. 나머지 4개는 현재 실행 진입점에서 연결되지 않습니다. 이 수치는 정적 의존관계이며 인증된 화면의 실제 렌더·분기 실행 증거가 아닙니다.

샘플 전용 7개는 AdminAttachmentList, AdminChipAutocomplete, HRXCountBadge, HRXAutocomplete, HRXFileAttach, HRXProgressBar, HRXTable입니다. 미연결 4개는 DragDropOverlay, LeadershipRadar, LeadershipSummary, HRXPopover입니다. DragDropOverlay는 ChatLayout에서 주석 처리되어 있으며 LeadershipRadar는 미연결 LeadershipSummary에서 참조합니다. 샘플 페이지는 실제 라우트에 등록되어 있으므로 7개를 곧바로 요구 범위에서 제거하지 않습니다. 미연결 항목의 기존 구현도 삭제하지 않습니다.

175개에도 Header/Layout/FilterBar/Toolbar, loading Skeleton, empty/error 상태, JSON/Markdown renderer의 패널 변형, 프로필·출력의 내부 섹션 조합이 포함됩니다. 이 파일들을 각각 별도 설치 컴포넌트로 만들 필요는 없습니다. 기존 원본 대응표의 primary target은 48그룹이며 additionalTargets의 독립 HTML export를 포함하면 49그룹입니다(벡터 자산 그룹 제외). 원본 파일과 재사용 그룹의 대응 관계가 있다는 사실은 모든 기능 목적·디자인·동작이 완성되었다는 증거가 아닙니다.

기존 발표 수치 54개는 설치·유지보수 그룹으로, 원본 대응 49그룹, 벡터 1그룹 및 별도 Tabs/Detail/detail selection/admin user list 4그룹을 포함합니다. 이번 진행 중인 position management 1그룹은 아직 설치·게시 검증을 마치지 않았으므로 이 재조사의 발표 기준에는 포함하지 않습니다.

앞으로 원본 파일 수, 독립 설치 그룹 수, 기능 목적·상태별 검증을 따로 보고합니다. 실제 최종 구현 목표 수는 기존 그룹의 누락된 공개 계약과 화면 조합을 확인한 뒤 확정할 수 있으며 현재 186 또는 175로 확정하지 않습니다. 상세 분류와 조사 스크립트는 ignored browser-evidence/component-count-audit.json 및 .mjs에 보존했습니다.

진행 중인 포지션 작업: 13개 신규 검증을 포함한 PRISM 전체214 tests/0fail, workspace typecheck와 최종명칭 보정 후 대상13 tests가 통과했습니다. 10개 position fixture를1280/320px에서 렌더해 rootOverflow0/중첩button0을 확인했고, 사용자 default의320px 회귀도 확인했습니다. 최신 원본 관리자 URL은 document complete/visible body empty이며 로그 오류도 없어 원본 디자인 비교를 확인하지 못했습니다. 새로운 source fingerprint/registry/consumer/build/게시 증거는 다음 단계입니다.

후속 검증에서 포지션 관리의 실제 설치·예제·브라우저·site build가 통과했습니다. 설치 그룹은55개/토큰 포함registry56개가되었으며 원본186파일을독립목표수로세지않는원칙은동일합니다. 원본대응49그룹수도새복합UI의추가에맞춰최종목표총수나완료수로확정하지않습니다. 게시검증은포지션작업기록에서별도로확인합니다.
