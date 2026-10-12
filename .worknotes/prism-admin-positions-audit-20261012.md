# 포지션 관리 구현과 검증

기준 소스는 frontend 27c4fdbf3e73234b7ab5c46e379a04d083c12df8의 PositionPage, positionListRestore, AdminSyncStatusBar/Label 및 관리자 표·필터·탭입니다. 앞선 상태 확인 턴은 구현 변경이 없는 진척도 보고였습니다. 현재 worktree를 재확인하고 포지션 관리의 미완료 경로를 이어갑니다.

독립 PrismPositionManagement와 public list model, staged/applied filters, LIVE/TEMP 버전, 7/8열, 정렬·선택·페이지, PROGRESS 행 선택 제외를 추가합니다. 편집 버전의 변경 상태 필터는 unpaged 전체 결과가 필요하며 partial server page를 받으면 명시적으로 거부합니다. host가 정렬한 결과의 순서를 유지합니다. 삭제·동기화 예약·취소는 host 의도와 AbortSignal을 전달하고 실제 서비스를 복사하지 않습니다.

목록 복원은 contextKey/source가 같고 literal restoreList=true 또는 같은 history locationKey일 때만 허용합니다. public draft/applied/page/sort만 별도로 복사하고 행·선택·세션을 포함하지 않습니다. 비동기 metadata 첫 로드에서 복원한 draft를 전체 선택으로 덮지 않는 계약을 제공하고 완전한 합성 예제에서 실제 remount로 확인합니다. 원본의 전역 snapshot은 사용하지 않습니다.

원본 기준 header64px/title18px, content20/40px, filter20px/12px radius, LIVE5열/TEMP6열 grid와 keyword2열 span, 8px 상태 점/14px label/13px 안내, fill tabs, admin table을 사용합니다. 좁은 컨테이너는 필터3/2/1열과 표 내부 스크롤을 지원합니다. 타입/테스트/설치/실제 브라우저/원본 비교는 아직 진행 중이며 실제 account/RBAC/backend나 전체 pixel/A4 재현 완료로 간주하지 않습니다.

## 검증 결과

전체214 PRISM tests/0fail, 최종명칭 보정 후 대상13 tests, workspace typecheck,55그룹/56 registry/36 complete usage 계약 검사, 표준 site build와 기존 generic release check가 통과했습니다. 처음 두 시험 실패는 Radix 탭의 키보드 활성화 대신 단순 click만 보낸 harness와 실패 뒤 유지된 Host를 새로 초기화하도록 수정했습니다. 실제 브라우저에서 기존 position-summary CSS와 새 목록 요약의 이름 충돌을 발견해 position-list-summary로 분리했습니다. 비동기 metadata updater는 실행 시점에 변할 ref 대신 당시 preserve 값을 캡처합니다.

현재 fabc5bccee5d33b01a8677b4f0a93a082a6ffab72da4d00a66af68e563dc4820/78 inputs입니다. 실제 shadcn 설치의55 TSX/CSS exact bytes/0변환,36 예제의TypeScript/Vite/font/고지와 별도 설치 entry build가 통과했습니다. 10개 새상태를1280/320px에서렌더해rootOverflow0/중첩button0을확인했고 사용자default320px도회귀확인했습니다. 현222고유상태중11개만현재로컬검사이며 전체상태비교가아닙니다.

실제 로컬 browser에서 가상 상세로 이동해 목록을unmount한뒤 돌아왔을 때 미적용검색어·적용결과23건·page2·name ascending이복원되고선택은0으로돌아왔습니다. 합성동기화예약은선택과무관하게작동해등록/선택을잠갔고취소후편집이복구됐습니다. 실제설치한예제에서도검색1건/상세왕복복원/예약잠금/취소복구가통과했고320px 표영역256px안에서1100px 표가스크롤됐습니다. 양쪽console warn/error는빈배열입니다. Screenshot/JSON은ignored browser-evidence에있습니다.

원본 admin/positions는 document complete인데 visible body가비어있고warn/error도없었습니다. 새로 만든 원본확인tab10과설치확인tab11은닫고이전source/sample tab1은보존했습니다. 자체설치dev session62787은검사후종료130을확인했고consumer source/lockfile/dist/dist-admin-positions/node_modules는보존합니다. 로컬workspace tab9는handoff표시했고viewport override는reset했습니다. 설치전용registry server는finally에서종료됐습니다. 독립 소비자 build는원본인증/RBAC/API/전체시각/A4 검증을대신하지않습니다.

원본 파일 수186을 독립 구현 목표로 삼지 않도록countUnit/source audit와생성LLM설명/Coverage문구를정정했습니다. detailed source audit는별도prism-component-count-audit-20261012.md에있습니다. 기존일반registry snapshot은변경하지않았고 main/production은게시하지않았습니다. 검토branch/PR/CI/preview readback이후최종기록을이어갑니다.

완전 예제의 trailing whitespace를 제거하고 catalog·최종 source fingerprint를 갱신했습니다. UI 로직과 설치 모듈/CSS bytes는 변하지 않았습니다.
