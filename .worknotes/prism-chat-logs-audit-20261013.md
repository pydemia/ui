# 대화 로그 목록과 보관 상세

원본 frontend `27c4fdbf3e73234b7ab5c46e379a04d083c12df8`의 ChatLogPage/DetailPage, SCSS와 fixture를 확인했습니다. 목록은 100개 mock 행을 페이지당 10행으로 보여주며 조회·초기화는 no-op입니다. 정렬은 화살표와 페이지 번호만 바꾸고 상세는 route id와 관계없이 같은 fixture를 표시합니다. 실제 서비스 API 통합을 완료했다고 주장하지 않습니다.

독립 컴포넌트에는 Conversation ID·에러·이름·회사·사번·대화 주제·최근 대화일의 7열, 160/303/250px 필터, ID 복사와 상세 열기, 64px 상세 헤더와 최대 900px 본문을 구성했습니다. 조회·페이지·정렬·행은 호출자가 관리하며 공개 필드만 콜백으로 전달합니다. 복사 성공은 실제 clipboard 또는 adapter Promise가 완료된 뒤 표시합니다. 보관 상세는 기존 typed response를 재사용하고 원본의 맥락 추가 질문 숨김과 선택 응답 표시를 유지합니다.

공개 예제는 합성 23행과 4개 대화 턴을 사용합니다. 원본 fixture의 실제 회사명·사번·인명·인사 분석은 복사하지 않았으며 예제의 복사 adapter도 시스템 clipboard를 변경하지 않습니다.

검증: 로그 12개와 블록 22개를 합친 대상 34개, 전체 PRISM 266개 테스트가 통과했습니다. 초기 장시간 테스트의 원인은 상세 답변 표의 tbody를 목록 표로 오인한 assertion과 큰 DOM 실패값 출력이었습니다. 목록의 .prism-directory만 확인하도록 수정하고 probe를 제거했습니다. 별도 상세 DOM·block SSR 검사는 정상이었으며 구현의 렌더 실패로 보고하지 않습니다.

중단된 테스트 핸들과 대응 프로세스가 모두 없는 것을 확인한 뒤 실행을 재개했습니다. 기본 PATH에서 node가 사라져 bundled runtime을 명시했습니다. 실제 shadcn 설치는 처음에 시스템 CA를 사용하지 않아 인증서 체인 검증에 실패했습니다. NODE_USE_SYSTEM_CA=1로 시스템 신뢰 저장소를 사용한 재실행이 통과했으며 TLS 검증을 끄지 않았습니다.

실제 설치 결과: 58개 모듈과 CSS가 emitted source와 정확히 일치하며 변환은 0개입니다. 39개 완전한 예제의 tsc, Vite build, Pretendard font 바이트와 artwork notices 확인이 통과했습니다. 새 dist-chat-logs를 사용해 이전 consumer 빌드와 입력 파일을 보존했습니다. 전체 사이트 빌드 및 일반 registry release-check도 통과했으며 기존 불변 snapshot은 유지됐습니다.

이전 턴의 상태 묶음 관찰은 timeout 후 Mac 잠금으로 중단됐지만 이번 턴에는 자체 브라우저 연결이 복구됐습니다. 로그의 8개 canonical 상태를 1280/320px에서 각각 렌더해 문서 가로 넘침·중첩 버튼이 모두 0임을 확인했습니다. 복사 실패/재시도, 잘못된 날짜의 조회 차단, 2페이지에서 상세 진입·복귀 시 페이지 유지, 읽기 전용 옵션과 맥락 추가 질문 숨김도 확인했습니다. 설치된 목록·상세를 두 폭에서 렌더했고 설치된 소직무 생성 중 상태는 실제 측정 폭 1280px에서 확인했습니다.

원본 경로를 처음에 /admin/chat-logs로 잘못 열어 404가 표시됐습니다. 소스의 상위 /chat 경로를 확인한 뒤 /chat/admin/chat-logs로 바로잡았습니다. 올바른 원본 경로는 자체 브라우저에서 document complete/visible body empty로 관찰됐으며 기존 Chrome source 탭은 /admin-login을 표시합니다. 초기 404 로그를 올바른 경로의 현재 오류로 간주하지 않습니다. 인증된 원본 화면·배포 revision·font/pixel/A4 비교는 아직 미검증입니다.

현재 집계는 설치 그룹 58개, 토큰 포함 registry 59개, 완전한 예제 39개, canonical 상태 252개입니다. 이번 fingerprint에서 확인한 canonical 상태는 로그 8개와 블록 edit 1개를 합친 9개이며 동적 오버레이 6회는 새 상태로 계상하지 않습니다. 원본 비벡터 186파일은 최종 독립 목표 수나 진행률 분모가 아닙니다.

증거는 ignored browser-evidence의 chat-logs-render-checks.json, generation-overlay-render-checks.json, chat-logs-installed-bytes.json, chat-logs-installed-runtime.json과 대상/전체 테스트·설치·빌드 로그에 보존했습니다. review branch CI와 preview readback은 다음 단계이며 production/main 배포는 수행하지 않습니다. 전체 goal은 active입니다.

## 검토 게시 후 CI 재현성 보정

소스 bdc644fd, 생성물 c9cac7d8을 검토 브랜치에 push하고 draft PR #162의 head/base를 확인했습니다. c9cac7d8 preview는 READY이며 공개 파일 11개의 바이트/SHA readback은 통과했습니다. 첫 readback 실행은 모두 실패했고 시스템 CA를 사용한 재실행이 통과했습니다. Preview의 자체 브라우저 렌더는 Vercel 로그인 보호로 확인하지 못했습니다. 인증 보호를 변경하지 않았습니다.

CI run 38343548616은 typecheck·UI 테스트·build·PRISM 계약/테스트·registry 검사를 통과했지만 마지막 docs diff 검사에서 실패했습니다. 검증 metadata를 갱신한 뒤 registry만 재생성하고 사이트를 다시 빌드하지 않아 components.json을 import하는 문서 번들이 이전 manifest를 포함한 것이 원인입니다. 당시 생성물의 HTML은 index-CNuHECV9.js를 참조했고 CI rebuild는 index-C4tXqy2k.js를 참조합니다. 테스트 실패나 런타임 기능 오류로 기록하지 않습니다.

최종 manifest를 반영한 사이트를 다시 빌드합니다. 보정된 마지막 커밋의 CI/preview를 다시 확인하고 registry 자료 외에 실제 HTML 및 JS/CSS 번들도 readback 대상으로 포함합니다. 전체 goal 및 원본 인증·font/pixel/A4 검증은 여전히 미완료입니다.

최종 metadata를 반영한 로컬 전체 rebuild가 통과했고 HTML의 index-C4tXqy2k.js 참조는 실패한 CI가 재생성했던 이름과 일치합니다. 원본 코드·테스트·registry contract는 바뀌지 않았습니다. 새 커밋에서 전체 CI를 다시 확인합니다. consumer 임시 서버는 소유한 PID/CWD를 확인한 뒤 종료했으며 기존 consumer 산출물은 보존했습니다. workspace 서버는 port63354/session99159, 자체 브라우저의 tab10은 후속 검증을 위해 유지합니다.
