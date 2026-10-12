# 프로필 헤더·즐겨찾기·평가 이력 대조

직전 turn은 원본 대조와 구현을 진행한 진척입니다. 중단된 handle51517은 없었으며 JSX 닫기 괄호 오류 로그를 확인해 수정했습니다. 이후 실행들도 종료 상태를 확인한 뒤 검증했습니다. 전체 goal은 active입니다.

UI 기준 head는cf38ab3d입니다. frontend를 다시 fetch/fast-forward해 HEAD=origin/dev `27c4fdbf3e73234b7ab5c46e379a04d083c12df8`/clean을 확인했습니다. 프로필·즐겨찾기·평가·관련 원본CSS10파일은 이전087811ff와 같습니다. 변경30파일의 leadership tag/content/detail/divider·print detail,position version,admin user/group/position과chat link/sidebar는 pendingRevisionAudit로 남겼습니다. deployed revision binding은 확인하지 않았습니다.

## 구현 근거

- 프로필은132px 사진/gap12, 이름·ELP·생년월/tenure 태그, 이름 오른쪽 Print/Favorite20px, 계열/직무·12px 로고/직책·평가, 하단 메모/파란 건수를 복원했습니다. loading은 source 사진·이름96px/20px·부서300px·직책390px skeleton이고 stale header/actions를 감춥니다. 명시적 빈 값은 legacy alias로 덮지 않습니다.
- 즐겨찾기 카드는16px padding/12px radius,70px 사진,121px 정보 영역과12px 흰 전문 분야/평가 패널을 별도로 제공합니다. 상세·즐겨찾기는 형제 native buttons입니다. 긴 정보는 min-height/줄바꿈으로 보존하고 grid는3열/gap10·600px 이하2열/360px 이하1열·opt-in resize/scroll을 지원합니다. Collection.cardVariant=favorite로 조합합니다.
- 평가 이력은 원본의 공백/null 제외·최근 연도순·배지/연도 묶음을 기본으로 사용합니다. 괄호 등급은 표시용 강조이며 explicit active가 우선합니다. 기존 개별값/unknown/빈 안내는 explicit/empty로 지원합니다. 원문은 변경하지 않고 공개 결과에 내부 sort index를 포함하지 않습니다. 사람 순위/평가를 계산하지 않습니다.
- Portrait는 subject/URL에 따라 수명을 분리하고 오류 시 사진 없음/선택적 initial을 표시합니다. 보호 URL과 인증은 호스트 소유입니다. favorite/print busy와 readonly는 제어형이고 memo/print 읽기 동작은 별도로 유지합니다.
- Source Favorite/FavoriteOn SVG를 사용합니다. shadcn이 import 앞의 고지를 삭제하는 것을 실제 설치에서 확인했습니다. 원문을 import 뒤로 옮겨 보존했고 실행 vector 선언은 변경하지 않았습니다. 설치본을 손으로 수정하지 않았으며 고지 삭제를 허용하는 예외도 사용하지 않았습니다.

## 검증과 남은 범위

최종 source의 전체161 tests/0 fail와 workspace typecheck,52그룹/53항목·32개 완전 예시 계약 검사가 통과했습니다. 실제53항목 shadcn 설치 및 최종 profile/CSS 갱신, TypeScript/Vite/font bytes/고지가 통과했습니다.52개 TSX module과CSS 모두 emitted exact bytes이고 transform 예외는0입니다. 표준 npm run build, canonical/generated 검증 자료4개 대조와 generic current release25ca4393 검사가 통과했습니다.

Source fingerprint는 `b27a07b18ed2b915e5ab73219241dff4352d5fbbbb434ded0b329c1168103afd`/71 input입니다. 현재195 fixture의 실제 화면 검사는0입니다. Source DOM/내용·synthetic JSDOM/SSR·설치/build 증거를 원본 pixel/native 검증으로 사용하지 않습니다. 현재 A4 header/pagination도 미검증이고 과거 native/raster 결과는 해당 source에서만 유효합니다.

Consumer `/private/var/folders/ht/0ztx9m_d3xz1lg1m0rsy6bk80000gn/T/prism-consumer-UAveFJ`의 source/lock/dist/의존성을 보존했습니다. 검증 server는 helper 종료 시 정리됐습니다. 로그와 source/byte 대조는 `.worknotes/browser-evidence/profile-header-*`에 있습니다. 공간은336MiB에서56GiB로 회복된 상태를 확인했으며 이번 phase에서 다른 파일을 삭제하지 않았습니다.

코드·조사 자료와 generated registry/docs를 분리 commit해 기존 draft PR162에 올리고 정확한 head/CI/preview 자산을 확인합니다. 인증 원본·전체 source 스타일/목적·새27c4fdbf 차이·고도화·production은 미완료입니다. 항목/검사/대응 수를 완료 기준으로 사용하지 않습니다.
