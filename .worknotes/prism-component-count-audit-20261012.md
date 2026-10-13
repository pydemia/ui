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

## 2026-10-13 재확인

사용자의 186개 산정 질문에 맞춰 현재 원본 HEAD `27c4fdbf3e73234b7ab5c46e379a04d083c12df8`에서 조사 스크립트를 다시 실행했습니다. 원본 components/layouts TSX 273개와 inventory의 경로 집합은 완전히 일치하며 누락·중복 경로는 없습니다. 벡터 자산 87개를 제외한 186개는 파일 수로는 정확합니다. 이를 독립 구현 목표 수로 제시한 것은 과대계상입니다.

- 실행 진입점의 정적 import 연결: 본서비스 175파일, 샘플 전용 7파일, 미연결 4파일입니다. 배포 화면의 실제 렌더 여부를 증명하는 수치는 아닙니다.
- 현재 비벡터 원본 대응표: primary 49그룹, additionalTargets의 독립 HTML export를 포함하면 50그룹입니다. 이전 본문의 48/49는 당시 대응표 수치입니다.
- 예를 들어 프로필 내부 섹션 17파일은 `prism-profile-sections`, 평가 관련 14파일은 `prism-assessment`, 응답 렌더링 13파일은 `prism-response` 그룹으로 대응합니다. 개별 파일을 모두 독립 설치 단위로 만들지는 않습니다.
- 현재 로컬 catalog에는 58그룹이 등록되어 있습니다. 진행 중인 변경을 포함한 등록 수이며 검증 완료 수나 최종 목표 수로 사용하지 않습니다.
- 최종 독립 구현 목표 총수는 미확정입니다. 기능 목적·공개 계약·화면 조합·상태별 누락을 기준으로 확정해야 하며, 186 또는 175를 진행률 분모로 사용하지 않습니다. 50그룹 대응 완료도 전체 디자인·동작 재현 완료를 의미하지 않습니다.

이번 재확인은 로컬 소스·inventory·정적 의존관계 조사입니다. 브라우저 조작, 원격 갱신, 배포 및 구현 변경은 수행하지 않았습니다. 상세 결과는 기존 ignored `.worknotes/browser-evidence/component-count-audit.json`에 갱신했습니다.

## e5d4d79a source 갱신

2026-10-13 다시 fetch/fast-forward한 원본에서 미연결 Radar/Summary 두 TSX가 삭제됐습니다. 현재 271파일 = 벡터87 + 비벡터184이며 본서비스175/샘플7/미연결2입니다. 이전 273/186은 27c4fdbf 기준의 수치로 보존합니다. 독립 목표 총수로 사용하지 않는 기준과 원본 대응49/50그룹은 유지합니다. 최신 delta 작업 기록에서 상세 검증을 확인합니다.

## 현재 질문에 대한 재집계

원본 HEAD와 로컬 origin/dev가 모두 `e5d4d79a8933389e47d32ca44e91216bef011d7e`인 상태에서 정적 의존관계 조사를 다시 실행했습니다. 이번에는 원격 fetch나 구현 변경 없이 현재 로컬 소스를 확인했습니다. components/layouts의 실제 TSX 271개와 inventory 경로 집합이 일치하며 누락·잔존·중복 경로는 없습니다.

- 비벡터 TSX 184파일: 본서비스 정적 연결 175, 샘플 전용 7, 실행 진입점 미연결 2입니다.
- 원본 비벡터 파일의 재사용 그룹 대응: primary 49, 추가 HTML export를 포함하면 50그룹입니다. 이 수는 대응표의 그룹 수이며 최종 독립 컴포넌트 목표 총수나 완료 수가 아닙니다.
- 현재 catalog 등록 수는 58그룹입니다. 원본 재현과 확장 항목을 포함하며 인증된 배포 화면의 디자인·동작 검증 완료 수와 구분합니다.
- 묶음 사례: 현재 프로필 내부 섹션 16파일은 `prism-profile-sections`, 평가 14파일은 `prism-assessment`, 응답 렌더링 13파일은 `prism-response`에 대응합니다. 같은 그룹 안에서도 서로 다른 기능 목적과 공개 계약의 검증은 필요합니다.

따라서 186개라는 독립 구현 목표 수는 철회합니다. 184나 175로 단순 교체하지 않습니다. 최종 독립 구현 목표 총수는 현재 미확정이며 진행률을 `58/186` 또는 `58/184`로 계산하지 않습니다. 이번 질문에는 파일 수, 재사용 그룹 수, 기능·상태별 검증 범위를 분리해 답합니다.

## 2026-10-13 d677e551 재집계

원본 dev d677e551과 현재 inventory의 components/layouts TSX 경로 275개를 집합으로 비교했습니다. 누락·잔존·중복이 없습니다. 벡터 88개를 제외한 비벡터 187개 중 정적 본서비스 연결 178개, 샘플 전용 7개, 진입점 미연결 2개입니다. 비벡터 원본의 primary 대응은 50그룹이고 독립 HTML export를 더한 합집합은 51그룹입니다. 원본 파일 수나 대응 그룹 수는 구현 최종 목표 수 또는 검증 완료 수가 아닙니다. 상세 행별 분류는 ignored `browser-evidence/component-count-current-d677.json`에 있습니다.
