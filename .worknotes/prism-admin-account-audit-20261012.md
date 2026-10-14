# 관리자 계정·회사 검색·조회 접근 오류 대조

직전 goal turn은 포지션 버전과 host 예시를 구현하고 cd8529c2의 PR/CI/preview readback을 완료한 진척입니다. 시작 checkout은cd8529c2이며 직전 readback 메모의 수정만 보존했습니다. frontend를 기존 인증 설정 보존 방식으로fetch해HEAD=origin/dev27c4fdbf/clean을 확인했습니다. 전체 goal은active입니다. Browser HTTP protocol 정책 거절을 우회하지 않습니다.

UserForm/SCSS와 role DTO,CompanyGroupForm의 searchable/company-name style delta,PositionForm의 view access-error hook을 현재 소스에서 읽었습니다. Source와rendered/deployed binding을 구분합니다. 관리자 목록/route/서버 권한의 전체 대조를 완료했다는 의미는 아닙니다.

## 구현

PrismUserAccountDraft는email/lastName/firstName/companyId/team/roleCode/companyGroupId의7필드입니다. PrismUserForm은이 모델을식별해현재 account recipe를사용하며기존roleId/division RegistrationDraft와mode 없는3필드는유지합니다. 신규 account는선택없는회사를허용하고기본등록이메일을@sk.com형식으로검사합니다. 상세의이메일은잠그되이름·회사·팀은수정할수있습니다. onCancel은dirty,onSubmit은공백정리/역할별group/public7필드만복사한모델을전달합니다.

roles와disabledRoleCodes는호스트데이터입니다. 제한Role은선택돼있을때만disabled로표시하고선택콜백도차단합니다. metadata 없는기존Role/그룹은자동삭제하지않으며저장을막고메타정보미확인을표시합니다. 그룹companies는{id,name}와기존문자열을지원합니다. Role14px/20px,기본정보18px,태그의기본21px와480px이하wrap을구분하고현재회사그룹검사완료상태의teal테두리를제거했습니다. 회사추가picker는검색가능하며입력draft를덮지않습니다.

PrismPositionForm의mode=view는현재companyId와일치하는403/404를onAccessError로요청별한번전달합니다. callback identity변화/StrictMode replay/stale company error는중복/잘못된화면복귀를일으키지않습니다. create/edit과그외오류는초안을유지하며명시적오류/재시도콜백을제공합니다. API/auth/이력/회사Context조회·권한·목록복귀는호스트소유입니다. 이코드는실사용자권한을변경하지않습니다.

## 검증

현재targeted13 tests가통과했습니다. 기존6 source/legacy cases를유지하고새7 cases로optional company·SK email·정규화/immutability/private-field제외·상세기본정보편집/dirty취소·restricted/unknownRole·StrictMode/current/stale/request별access오류·editdraft/retry·회사검색을검사합니다. 처음시험의HTMLFormElement누락은JSDOM환경에실제DOMconstructor를연결해수정했고최종검사는통과했습니다. TS type predicate의띄어쓰기오류도수정했습니다. 실제browser/서비스/RBAC검증이아닌synthetic DOM증거입니다.

전체test/typecheck·registry/완전예시·실제consumer설치·site/generic release·PR/CI/preview를이어갑니다. 관리자목록/페이지복원/상태액션과chat context의최신변경,전체디자인/동작/목적/고도화coverage,실제DEV·font/pixel·A4·production은미완료입니다.


## 최종 타입·설치 검증

회사ID만으로같은회사이전요청을구분할수없어companyContextRequestId를추가했습니다. 현재requestID와error.requestId가다르면오류표시/복귀를하지않습니다. 취소는호스트소유이며오류event의requestId만으로현재요청이라고판단하지않습니다. 같은회사 stale case도기존시험에추가했습니다.

최종workspace typecheck와178 tests/0 fail,32개완전예시계약검사가통과했습니다. 실제최종shadcn설치/TypeScript/Vite/font/고지가통과했고52개TSX와CSS 모두emitted exact bytes,변환예외0입니다. Consumer source/lock/dist/node_modules와기록을보존했습니다. Source4f1a37550edde1dc459f5f5ec726cc2756d9ba7e3d04e355f1f0674a901db54e/72 inputs,202 current browser fixtures의검사수는0입니다. Source CSS/합성DOM/설치결과를원본화면검증으로사용하지않습니다.


표준npm run build가성공했습니다. canonical/generated 연구자료4개와generic release25ca4393를최종대조합니다. 최신ChatSidebar diff는사용자관리메뉴추가이고ChatMain diff는API403/404 toast listener에서profile/position panel open과선택subject를함께비우는동작입니다. 이변경과관리자목록/position-list restore는다음대조로남겨둡니다. 이번sourceform반영만으로전체최신frontend대응을완료했다고하지않습니다.


게시전source대조에서create의dirty를항상true로전달하던계산을수정했습니다. initialValue 또는최초controlled draft를기준으로취소의실제변경여부를판정하고등록가능여부는별도로유지합니다. 초기false/수정true/복원false와valid creation을함께검사합니다. 이전178개검사/commit은이후보정이전증거이며최종검사·source fingerprint·설치/생성물을다시확인합니다.


취소보정후최종179 tests/0 fail,workspace typecheck와32개완전예시계약검사가통과했습니다. 실제최종shadcn재설치/TypeScript/Vite/font/고지와52개module/CSS exact bytes,변환예외0도통과했습니다. 최종source7ea7cd89e57bfaa5f165b8d2cd0c620fc4b0143244881270c2147c659874adec/72 inputs입니다. 이전4f1a/178개증거는보정전범위입니다. 현재202 actual-render검사0을유지합니다.


## PR·CI·preview readback

폼 source5ac53d4b/생성3167d12d에취소보정source59d1e3b5/최종생성1218c9ff2ffe582d380a11502be2060e236d5260을추가했습니다. 기존review branch에push했고credential exact-match0과Git config보존을확인했습니다. PR162는draft true/base main/정확한1218c9ff head로읽고재첨부했습니다. Verify UI38217517697는completed/success이며최종179 PRISM tests,registry/현재generic release/생성물재현검사가포함됩니다.

Vercel dpl_7RDnWr6bQMB1GQVg4EcMvNgA5Cfx는READY/target null/정확한1218c9ff SHA입니다. https://pydemia-broprnil8-pydemia-7822.vercel.app에서기존CLI인증으로registry825410bytes/SHA21ee7676,manifest287691bytes/SHA10941b05,verification118547bytes/SHA19ccb027,domain-forms37111bytes/SHA38fee8f9,tokens190283bytes/SHA53ce9e83의로컬exact bytes를확인했습니다. 전체hash는admin-account-preview-readback.json에보존합니다. HTTP자산검사를실제화면·A4·서비스/RBAC증거로사용하지않습니다.

코드/생성물은게시된head에있고이readback메모만local modified로보존합니다. Consumer/source/lock/dist/node_modules와기록을보존했고helper registry server는finally에서종료됐습니다. 새dev server를시작하지않았습니다. 전체goal은active이며관리자목록/페이지복원/상태액션,chat API접근오류의panel/선택해제와메뉴,전체source 디자인·목적·고도화coverage와현재DEV/font/pixel/A4/production은미완료입니다.
