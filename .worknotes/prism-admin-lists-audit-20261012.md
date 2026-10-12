# 회사 그룹·공지 목록과 인증 화면 조사

원본은 frontend 27c4fdbf3e73234b7ab5c46e379a04d083c12df8의 CompanyGroupPage/NoticePage, AdminDateRangeField 및 공통 관리자 요소입니다. 이전 포지션 단계는 source/생성 commit, 실제 설치·선택한 runtime, PR/CI/preview 자산 확인을 마친 진행 턴입니다. 현재 HEAD9ac1df6d와 기존 포지션 게시 확인용 worknote 변경을 보존하고 이어갑니다.

회사 그룹은 상태/회사/검색어와6열이며 회사 목록은 정렬하지 않습니다. 서버 정렬, 조회·초기화·정렬의page1, 일괄 활성/비활성 확인, 비활성화 시 소속 사용자 영향 문구, host가 분류한404의선택정리/목록재조회가 필요합니다. 날짜·등록자 표시는 host-normalized model로 받습니다.

공지는 회사/팝업상태/팝업기간/등록일/검색어와6열입니다. 팝업기간은 시작·종료를 함께 지정해야 하고 등록일은 한쪽 지정도 지원합니다. API 날짜는YYYY.MM.DD이며 공개 draft는ISO calendar date입니다. 정렬은 현재 페이지에만 적용하고 page/전체 total을 바꾸지 않습니다. 필터 없는0건은 등록 안내, 필터 적용0건은 표 검색 결과 안내입니다.

원본 삭제는 per-ID Promise.allSettled 뒤 성공 여부와 무관하게 선택을 지우고 전체 삭제처럼 페이지를 조정합니다. 독립 contract에서는 건별 결과를 검증하고 실제 성공 ID만 제거하며 실패 ID/선택/재시도를 보존합니다. bounded per-ID adapter는 AbortSignal과 queued cancellation을 지원하며 server에서 이미 완료된 변경을 되돌린다고 주장하지 않습니다. 부분 삭제의 개선은 원본의 모든 성공 삭제 동작을 유지하면서 실패를 성공으로 표시하지 않기 위한 것입니다.

회사 그룹·공지 UI를 prism-admin-lists 한 그룹으로 묶고 공통 작업 scope fencing을 내부에서 공유합니다. 원본 파일 수를 별도 구현 목표로 세지 않습니다. 기존 DatePicker는 표시형식만 dotted 옵션으로 확장하고 ISO value와 기존 기본값을 유지합니다. 실제 설치/실행/원본 스타일/서비스/API/RBAC 비교는 진행 중입니다.

AuthBootstrapLayout은 document당GET/auth/session을 한 번 호출하고 Outlet을 렌더합니다. ProtectedRoute는 isAuthChecked가false이거나 user가없으면null을 반환합니다. 이 조건은 관찰한 빈 관리자 화면과 일치하지만 현재 브라우저의 실제 session 요청/응답을 확인한 증거는 아닙니다. 소스 인증 상태를 임의로 주입하거나 credential/cookie를 추출하지 않았습니다. 원본 source/browser 사실과 원인 추론을 구분합니다.

## 2026-10-13 검증

frontend를 다시fetch해 HEAD=origin/dev=27c4fdbf/clean을 확인했습니다. 전체232 PRISM tests/0fail과 최종 대상18개, workspace typecheck,56그룹/57registry/37완전예제 계약 검사가 통과했습니다. 최초 두 실패는 test start의 kind 인자 누락을 고쳤으며 구현 실패로 보고하지 않습니다. 완료·오류 분류 callback이동기로scope를교체할때도기존컨텍스트가새오류/닫힘상태를쓰지못하도록callback후generation을재확인하고실제flushSync시험을추가했습니다. Unknown/null/prototype-key 팝업 상태는 source의dash fallback을 유지합니다.

실제 workspace browser에서9건삭제/1건실패/선택1 유지 뒤 실패예시를끄고 해당1건을재시도해13건/선택0이됐습니다. 그룹10건 비활성화 확인에는 소속 사용자 영향 문구가 있고 합성 표시 상태만변경했습니다. invalid 수동날짜는기존23건을유지하고조회하지않았으며 올바른팝업쌍/등록일한쪽조건은12건을표시했습니다. 이는합성provider이며실제회원cascade/서버조회범위/실서비스증거가아닙니다.

10개 새 상태의1280/320px 렌더와 selection/default320px 회귀를 확인했습니다. 문서 overflow0만으로놓쳤던 notice filter의 grid min-content284px이body가용256px을넘었습니다. filters min-width0을추가한뒤root/scrollWidth288,표256,내용1100px 내부scroll이됐습니다. 회사그룹표는940px 내부scroll이며header64입니다. 좁은datepicker popup도296px/x24로viewport안에있었습니다. 구조검사중첩button0/console warn/error0입니다.

원본public /sample/admin/date-range-field를실제로열어 default144/7/144,wide200/7/200,4px gap과입력14px/500/23px line-height/20.125px 높이를측정했습니다. 기존local input높이18px/normal을1.4375em/23px로맞췄고기존selection기본ISO표시를유지했습니다. notice의130/7/130=275px는원본NoticePage의명시적130px variant입니다. 원본static/variable font·전체font/pixel·인증관리자페이지의동일성은미확인입니다. source확인용tab12는닫고기존source/sample tab1은보존했습니다.

실제shadcn설치56 TSX/CSS exact bytes/0변환,37예제와별도entry TypeScript/Vite/font/고지가통과했습니다. 설치browser에서도부분9/1·선택1·재시도1·그룹10상태변경과320px root/scrollWidth288·표256/1100·날짜높이20.125px가확인됐습니다. Native select의implicit label은option문자도포함하므로관찰한role/name으로선택했고selector실패를구현실패로보지않았습니다. 설치tab13과dev session46960은검사후닫고종료130을확인했습니다. consumer source/lockfile/dist-admin-lists/node_modules는보존합니다.

source fingerprint df84bb38728ecc6cadb17f799906b55621622c2a41f669b6c17e84cff33392be/80 inputs입니다. 표준site build와 generic snapshot sha256-25ca4393b38b8fcebbbd34ca3d8c73475e773a766e971da004f94e40728bc896이통과했습니다. 실제현재로컬확인은232고유상태중11개이며전체원본상태동일성검증이아닙니다. 기존date12 기록을보존하고새결과의관찰일은13으로기록합니다. 검토branch/PR/CI/preview readback을이어가며main/production은게시하지않습니다.

## 검토 게시 확인

Source4d973a9e/generated657349352f2b1bdb2473ac34b94367240ce9435f를검토branch에push했고credential exact-match0/config보존을확인했습니다. PR162는draft/base main/정확한65734935이며56그룹/57항목/37예제/232테스트와새부분삭제·날짜·그룹계약을반영했습니다. Verify UI38271590561은completed/success입니다.

기존review preview dpl_Fvg8UurErMrnFrxVs8EQyNU9tzWW에서withLatestCommit=true/target생략으로preview를만들었습니다. 새dpl_EvZsZMxrCxLG5kvsaNUfreAyX849는생성직후부터정확한65734935/target null이며최종READY입니다. https://pydemia-pyiiqdr6z-pydemia-7822.vercel.app의8개자산(registry/components/source-inventory/verification JSON·MD/admin-lists/selection/tokens)이로컬과exact bytes/SHA가일치했습니다. proof는ignored admin-lists-preview-readback.json입니다. CI결과와배포READY는별도확인했으며GitHubcommit의Vercel status목록은이번조회에서비어있었습니다.

최종local partial screenshot도동일소스에서다시저장했습니다. 기존source tab1과workspace tab9를보존했고viewport는reset/handoff했습니다. 공개production/main은변경하지않았으며position-block/chat-log 목적,원본인증전체화면·실제권한/서비스·source배포revision binding·전체font/pixel/A4 비교는남습니다. Goal은active이며이번readback기록만다음source commit용으로미커밋상태에남깁니다.
