# 포지션 버전·본문 링크 참조 대조

직전 goal turn은 최신 리더십 요약을 구현하고 efbd59a8 PR/CI/preview readback을 완료한 진척입니다. 시작 checkout은 efbd59a8이고 이전 readback 메모의 수정만 보존했습니다. 종료된 이전 실행을 다시 시작하지 않았습니다. 전체 goal은 active입니다.

frontend를 기존 인증 설정 보존 방식으로 다시 fetch했고 HEAD=origin/dev27c4fdbf/clean을 확인했습니다. JSON/Markdown의 기본/패널 mapper 네 곳, IPositionItem, PositionDetailView와 history service를 대조했습니다. 카드의 version이 없으면1이고 본문 링크에는 version이 없어 현재LIVE를 조회합니다. 원본은 id/version/retry 변화에 다시 요청하고 이전 응답을 무시합니다. Deployed revision binding과 실제 브라우저 비교는 미검증입니다.

## 구현과 계약

PrismPositionReference는 card{id,version}와 link{id}의 discriminated union입니다. createPrismPositionReference는 legacy card1을 표시용 참조에서 적용하고 원본 item은 변경하지 않습니다. 명시된 version은 positive safe integer이며 raw API 문자열 coercion/auth는 호스트 소유입니다.

카드 onSelect(item,reference),PrismResponse.onPositionOpen(id,reference)는 기존 첫 인자를 유지합니다. 본문·표·analysis 링크의 onAction(kind,id,reference?)는 position에만 version 없는link 참조를 덧붙이며 profile/document는 기존 두 인자를 유지합니다. 카드 콜백과 링크 콜백을 중복 호출하지 않습니다. 기존 panel 링크의 inert 표시도 유지합니다. selectedReference/selectedPositionReference는 id/source/version으로 선택하며 명시적 null은 선택 해제이고 undefined는 legacy selectedId 계약입니다.

완전 host 예시는 같은id의 과거2/3 카드와 현재 운영본,버전 없는 legacy card를 보여 줍니다. API/auth/history/LIVE 결정은 loadPosition callback으로 연결합니다. 기본 provider는 명시된 합성100ms fixture입니다. 예시의 AbortSignal과 active guard는 이전 id/version/provider의 늦은 완료·실패를 무시하며 새 요청의 key가 아니면 stale data를 표시하지 않습니다. 실패/재시도/선택 해제와 양축 resize를 제공합니다. 실제 백엔드 요청을 재현했다고 주장하지 않습니다.

## 검증 상태

Targeted14 tests와 workspace typecheck가 통과했습니다. 새6 cases는 참조/legacy/LIVE·invalid version·원본 identity/immutability·키보드/once callback·같은id 다른version의 제어형 선택·본문/표 action payload·provider stale completion/abort/retry/change/dismissal을 검사합니다. Host example TSX를 변환해 JSDOM에서 실행한 synthetic 증거이며 실제 서비스나 browser pixel 검증과 구분합니다.

전체 PRISM test·registry/예시·실제 consumer 설치/build·site/generic release·PR/CI/preview를 이어갑니다. 기존 스타일은 유지했지만 현재 source에서의 전체 화면·font/pixel·A4/인증 원본/관리자·chat 최신 변경/production은 미완료입니다.


## 최종 설치 검증

전체171 tests/0 fail와32개 완전 예시 계약 검사가 통과했습니다. 실제 shadcn 설치/TypeScript/Vite/font/고지도 통과했고52개 TSX와CSS 모두 emitted exact bytes,변환 예외0입니다. Consumer source/lock/dist/node_modules와 기존 기록을 보존했습니다. Source9a2ec3867fa65575d411433fcf5a35f72ecdd415d04a35fad10305530bb79009/72 inputs에서200 actual browser fixture 검사는0입니다.

다음 source audit에서 UserForm의 roleCode/team·dynamic roles/disabled role codes·optional company·group companies{id,name}·detail 기본 정보 편집,CompanyGroupForm의 searchable company와PositionForm view의403/404 access-error callback을 확인해야 합니다. 이번 turn에서 source diff를 읽어 차이를 식별했지만 구현·전체 상세 대조를 완료했다고 주장하지 않습니다.


표준 npm run build와generic current release25ca4393 검사가 통과했고canonical/generated 연구 자료4개의 exact bytes와최종72-input source fingerprint를 대조했습니다. Panel JSON의 delegated handler만 보고 링크를 활성화하지 않았습니다. TextContent는 transformMarkdownLinks(...,true),표/목록/인용은 stripActionLinksToText/stripActionLinks로 profile/position을 label로 바꾸는 경로를 다시 확인했습니다. Popup은 별도 경로이고 원래 onAction 계약을 유지합니다.
