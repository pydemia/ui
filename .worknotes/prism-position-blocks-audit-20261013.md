# 포지션 블록 관리 원본과 독립 계약

직전 관리자 목록 단계는 source/generated commits 4d973a9e/65734935, 실제 shadcn 설치, 선택한 browser 동작, CI와 검토 preview 자산 readback까지 확인했습니다. 이전 goal 턴은 component count의 정적 의존관계를 현재 원본에서 재실행하고 파일 수와 설치 그룹 수의 혼동을 바로잡은 조사 진척입니다. 기존 admin-list 게시 기록과 소비자 산출물을 보존합니다.

현재 원본 frontend 27c4fdbf3e73234b7ab5c46e379a04d083c12df8의 PositionBlockPage, CriteriaDialog, JobCriteriaDialog, CriteriaDeleteDialog, Tag/Section/영향 요약의 TSX/SCSS와 mapBlocks를 읽었습니다. LIVE/TEMP, 산업·직책·직무의 구분, 직책 읽기 전용, TEMP scheduled/running 잠금, 삭제 상태 제외 count, 직무 대분류 3열과 변경 tag를 재현합니다. 목록에는 원본에 없는 검색을 추가하지 않습니다.

기존 PrismCriteriaEditor는 일반 controlled 편집 계약을 보존합니다. 원본의 자동 600ms 이름 검사, 생성 후 설명 편집, 직무 이름·설명 쌍, 수정 전 영향 확인, 주직무 필수/보조직무 해제/중복 직무 금지와 조회 실패 차단은 별도 source-specific PrismBlockEditor/DeletionDialog로 구성합니다. 서비스를 복사하지 않고 typed callbacks와 AbortSignal을 제공합니다. 별도 공개 API와 상태·조합 검증을 진행 중입니다.

공개 블록 payload는 알려진 폼 필드만 복사하며 소직무 UI 식별자는 저장 요청에서 제외합니다. 변경되지 않은 기존 이름은 재검사하지 않습니다. 이름 결과는 해당 trimmed name에만 유효하며 취소된 조회·생성·영향·저장 결과는 다른 scope에 적용하지 않습니다. 실제 서버에서 이미 실행된 변경을 취소하거나 rollback한다는 계약은 없습니다. role 생성/수정/삭제는 원본처럼 지원하지 않습니다.

원본 인증 관리자 화면의 실제 렌더와 디자인·폰트/pixel 동일성, real API/RBAC, registry/consumer/site/CI/preview 검증은 아직 완료하지 않았습니다.

## 로컬·설치 검증

신규20개를 포함한 전체252 PRISM tests가 통과했습니다. 최초 테스트 helper가 required의sr-only `필수` 문자와 job categories를 누락한 문제를 고쳤고, dropdown 전환은 해당 combobox의aria-controls로 열린listbox를 기다리도록 바꿨습니다. 실제 구현에서는 같은 이벤트 묶음의 저장→닫기가 stale busy값을 읽는 문제를 고쳐 controller ref로 즉시 잠급니다. callback 안의flushSync scope 교체도 새창을닫거나옛오류를쓰지않습니다. source의14px SectionTitle/26px tag/3개폭64·96·80 로딩태그/6개대분류 로딩카드와원본 색변수를 확인했습니다. final package build와대상20 tests, workspace typecheck가통과했습니다.

실제workspace browser에서저장실패/수정확정재시도후직접편집한소직무설명이재개방시그대로표시됐습니다. 다른직무와중복선택은삭제불가이고,올바른대체기준/미선택보조직무로삭제실패→선택보존→재시도→deleted tag 비활성이확인됐습니다. 산업중복이름차단/AI생성후직접설명수정/생성,직무소직무생성/모두삭제시저장차단/수동추가후생성도확인됐습니다. 합성실패는다음요청1회만적용되어재시도할수있습니다. real API/AI/인사판단을수행하지않습니다.

12개상태를1280/320px에서확인했습니다. root overflow0만으로는못찾던remap dialog scrollWidth607/width296은hidden label의absolute containing block을해당field로고쳐296/296이됐습니다. 표는264px 내부viewport에서760px를scroll합니다. 기존management-tools/default320px회귀도overflow0/중첩button0이며총13개현재고유상태의선택검증입니다. 전체244상태나원본전체pixel검증이아닙니다. 처음원본URL의/admin경로404는/chat/admin으로수정했으며최종원본document complete/body visible text empty입니다. 이전404로그를인증실패증거로해석하지않았습니다.

57 TSX/CSS가실제shadcn설치와exact bytes/0변환이고38완전예제TypeScript/Vite/font/고지가통과했습니다. 소비자의기존source/lockfile/default dist와이전단계dist는보존하고새dist-position-blocks를사용합니다. 실제설치browser,standardsite build,검토branch/CI/preview 게시readback은계속진행합니다.

## 최종 로컬 상태

설치browser에서도영향확인후직무수정/중복재매핑차단/보조직무해제/삭제가동작했고320px dialog296/scroll296,표viewport264/scroll760,consolewarn/error0을확인했습니다. 원본에없는표caption의시각적제목을숨기면서table의접근성명칭을유지했고마지막CSS도다시설치해57 TSX/CSS exact bytes/38예제와mobile검증을통과했습니다. 최종재매핑screenshot을같은파일에갱신했습니다. 임시설치tab16/17과dev sessions71230/83126을닫고모두종료130을확인했습니다. viewport는reset했고기존workspace tab9와새tab15는handoff로보존합니다. 기존source/user 탭은변경하지않았습니다.

최종source fingerprint8bec6b373c04dcb00d4417ca6660eb419e00d2c9d9a5ae953daa9d8afcf4b0e5/82inputs입니다. 57그룹/58registry/38예제/244fixture이며현재선택browser증거는13개고유상태입니다. 표준site build/registry contract·dependency·usage 검사와generic snapshot sha256-25ca4393b38b8fcebbbd34ca3d8c73475e773a766e971da004f94e40728bc896이통과했습니다. canonical4개research는docs복사본과일치합니다. 원본비벡터186개는여전히파일수이고원본purpose매핑49 primary/50 total그룹은최종목표수나완료수가아닙니다. source/generatedcommit과검토게시확인을이어갑니다.
