# Design modes r1 검토 판정과 수정 검증

기준은 `browser-evidence/design-modes-review-r1/manifest.json`의 288개
파일이다. 두 독립 reviewer의 원문은 review-state-r1, review-ux-r1에
보존한다. 아래 판정은 root의 취합이며 사용자 승인이나 출시 인증이 아니다.

| 원문 항목 | 판정 | 반영과 검증 |
| --- | --- | --- |
| STATE-01 | 채택·수정 | child의 실제 DOM 변경 이후 invalidation, parent changed 표시, 재연결마다 새 wire revision. 실제 iframe Light→Dark→재연결 Light에서 검색 `검색`, 경로 `draft-preserve`, 검토 완료 상태 유지 확인. |
| STATE-02 / UX-01 | 같은 원인의 지적을 통합·수정 | controller의 순수 designSelection을 preview/commit에 공통 사용. Swiss Ocean/accent #123456 저장→Editorial→Swiss 방향키 후보에서 root는 Editorial 유지, 후보 #123456. Enter 뒤 page/iframe 모두 Swiss #123456, iframe 검색 유지. |
| UX-02 | 채택·수정 | persist 오류를 reset의 안내에 전달. 저장 실패 테스트에서 색상 초기화·업무 input identity·메모리 복원 유지 확인. |

실행: 통합 `npm run typecheck` exit 0, docs 테스트 15/15, UI 전체
299/299 통과. profile 메시지 테스트에는 잘못된 origin/source, 오래된
revision/ack, timeout, frame 부재·복구와 standalone 동작이 포함된다.
브라우저는 Codex IAB의 개발 환경이다. 실제 screen reader·다른 엔진·운영
게시 결과로 확대하지 않는다. iframe locator의 일회 관측 timeout 뒤
새 DOM snapshot과 읽기 전용 DOM 값 확인으로 복구 결과를 확인했다.

증거 이미지: `design-modes-profile-recovery-2026-10-14.jpg`.
후속 대상: 첫 6종 가족·상태·밝기 검수, 조합 예시, 독립 설치 브라우저,
Bento/Spatial recipe와 21종 전수 검수. 20종은 계속 ready다.

사용자 의견: PRISM은 현재 디자인 유지. root는 이 의견을 적용 범위에
반영했다. agent 검토 판정을 사용자의 별도 승인으로 기록하지 않는다.

## Presentation r2

34개 source를 복사하고 hash manifest로 고정한 presentation-r2에 새 독립
reviewer를 배분했다. router decide 추천과 생성 요청은 gpt-6-astra/low,
fork_turns=none이며 실제 실행 metadata는 unavailable이다. reviewer는 다른
결론과 live source를 받지 않았고 원문 보고서를 보존했다.

P-R2-01을 채택했다. 실제 Basic applied/Spatial candidate의 1180px picker에서
Dashboard627.6px, panels 한 열을 재현했다. Spatial에 42rem에서 활성화하는
1.6:1 중간 폭 표현을 추가했다. 기본 scope는 mid-columns를 한 열로
재정의하므로 기존 48rem 규칙을 유지한다.

수정 후 실제 368.975/230.625px 두 열, 각 panel scrollWidth=clientWidth,
detail scrollWidth=clientWidth963 확인. Root와 URL은 Basic/기존 hash 유지.
Spatial root의 독립 Basic Light scope640px는 한 열·shadow none 유지.
390px Spatial 후보는 폭228px 한 열·root overflow0. 새 상태·DOM을 만들지
않고 CSS로 수정했다. 대응 이미지: spatial-workspace-candidate.

확대 hook/recipe 이후 UI 전체299/299와 docs15/15를 새로 실행해 통과했다.
중간 폭 수정은 CSS 변경이며 이후 docs typecheck 통과. 해당 CSS의 최종
registry 생성/독립 소비자 source 대조는 최종 build와 연결해야 한다.
실제 Swiss/Dark/component=input 공유 URL 진입·reload도 같은 설정으로
복원됐다. 이 결과를 실제 AT나 다른 browser engine 검수로 확대하지 않는다.
