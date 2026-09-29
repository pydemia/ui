# Component 공급 목표 진행 상태

2026-09-29: [draft PR #1](https://github.com/pydemia/ui/pull/1)을 열고
Vercel preview의 READY 상태와 브라우저의 89개 목록·Navigation variant
전환을 확인했습니다. preview registry JSON은 인증이 필요하고 현재
production의 새 snapshot 경로는 404입니다. 따라서 공개 소비자 설치와
릴리스 조건은 완료 처리하지 않으며 **5/10**, 관리용 **약 70%**를
유지합니다. [기록](component-release-review-2026-09-29.md)에 범위를
남겼습니다.

2026-09-29: 확장안을 기능·문서·생성 산출물의 세 커밋으로 정리하고,
Git archive에서 복원한 깨끗한 체크아웃으로 `npm ci`, build,
typecheck, package 테스트 45개, `registry:check`,
`registry:release-check`를 통과했습니다. ZIP 복원 시 JSON의 CRLF 변환이
내용 해시를 깨뜨리는 문제는 `.gitattributes`로 고쳤습니다. 세부 내역은
[릴리스 검토 기록](component-release-review-2026-09-29.md)에 있습니다.
대규모 변경의 독립 검토와 공개 URL 설치·배포는 남아 있어 공급·품질
조건은 **5/10**, 전체 goal의 관리용 추정은 **약 70%**로 유지합니다.
기능·문서·생성 산출물·작업 기록은
`origin/codex/ui-component-release`로 push했습니다.

2026-09-29: [로컬 릴리스 검사](component-release-check-2026-09-29.md)를
추가했습니다. 현재 빌드와 지정한 내용 해시 snapshot, `docs/r/`의
최신 JSON이 일치함을 확인했고, 미공개 변경 기록과 실행 절차를
작성했습니다. component **89개**, registry item **91개**, 공급·품질
조건 **5/10**, 전체 goal의 관리용 추정 **약 70%**는 유지합니다.
실제 공개 URL에서 설치하고 이전 snapshot을 보존하는 검증은 남았습니다.

2026-09-29: [Navigation 디자인 확장](component-navigation-variants-2026-09-29.md)으로
전역·측면 링크에 선택 가능한 표시 형태를 추가했습니다. 기존 API의
variant 확장이라 component·registry item 수는 **89개·91개**로 같고,
공급·품질 조건의 완료 표시는 **5/10**입니다. 전체 goal의 관리용
추정 **약 70%**를 유지합니다. 새 로컬 snapshot과 소비자 갱신 검사는
완료했지만 대규모 변경 검토·공개 배포·실제 보조기술 검사는 남았습니다.

2026-09-29: [registry import 감사](component-registry-import-audit-2026-09-29.md)로
91개 item의 정적 source import와 직접 의존성 선언을 대조했습니다.
`SearchInput`·`NumberInput`의 누락 선언을 고쳤고 새 내용 해시
snapshot을 생성했습니다. 이전 snapshot은 보존했습니다. component
수는 **89개**, registry item은 **91개**로 같습니다. 공급·품질 조건도
**5/10**이므로 전체 goal의 **관리용 추정 약 70%**를 유지합니다.
이는 수량 기준 89%와 조건 완료 표시 50%의 평균 69.5%를 반올림한
값이며, 실제 공개 준비율이나 객관적 완료율은 아닙니다. 대규모 변경
검토·릴리스, 공개 snapshot 설치, 실제 보조기술·touch 검사는 남았습니다.

2026-09-29: [공개 버전 소비자 갱신 검사](component-registry-upgrade-2026-09-29.md)에서
40개 공개 item을 현재 91개로 갱신했고, 수정 파일의 충돌·재적용 경로를
확인했습니다. 공급·품질 조건의 완료 표시는 **5/10(50%)**입니다.
로컬 **89개 component·91개 registry item**이므로 약 100개 규모
기준 수량 비율 89%와 조건 50%의 산술 평균 69.5%를 반올림해 전체
goal을 **약 70%**로 추정합니다. 100개는 확정 완료 수가 아니며
이 추정치는 공개 준비율이 아닙니다. snapshot 공개 설치·릴리스와
실제 보조기술·touch 등 남은 조건은 계속 미완료입니다.

2026-09-29: 91개 registry item을 내용 해시 snapshot으로 묶고
`docs/r/releases/` 복사본·내부 의존성·파일 해시를 검사했습니다.
[검증 범위](component-registry-release-2026-09-29.md)를 기록했습니다.
공개 URL 설치와 과거 버전 보존·갱신은 아직 검증하지 않았으므로 공급·
품질 조건은 **4/10**으로 유지합니다. 로컬 **89개 component·91개
registry item**이며 전체 goal의 관리용 추정도 **약 65%**입니다.

2026-09-29: 기존 AppShell floating 도움말 조합의 focus 손실을 고쳤습니다.
문서와 분석 화면에서 열림 상태·Tab·Escape·닫기 focus 복귀를 확인했고
[검증 범위](component-floating-help-2026-09-29.md)를 기록했습니다.
새 component를 세지 않았습니다. 로컬 **89개 component·91개 registry
item**, 공급·품질 조건 **4/10**, 전체 goal 관리용 추정 **약 65%**입니다.
실제 보조기술·touch·다른 브라우저와 기존 소비자 갱신·릴리스는 남았습니다.

2026-09-29: 89개 catalog 사용 코드를 package tarball과 설치된
registry 소스의 두 소비 경로에서 각각 typecheck했습니다. 단독 TSX에서
문법 오류가 나던 20개 예시를 수정했고 `registry:check`에 문법 검사를
추가했습니다. [검증 기록](component-catalog-usage-2026-09-29.md)을
참고하십시오. 수량은 **89개 component·91개 registry item**으로
같습니다. 약 100개 규모 기준 수량 비율은 **89%**, 공급·품질 조건은
**4/10(40%)**입니다. 두 수치를 임의로 같은 비중으로 평균한
64.5%를 반올림해 전체 goal을 **약 65%**로 추정합니다. 100개는
고정된 완료 조건이 아니며 이 추정치는 객관적 완성률이나 공개
준비율이 아닙니다. 개별 동작·접근성 회귀, 기존 소비자 갱신,
변경 묶음의 검토·릴리스와 공개 배포가 남았습니다.

2026-09-29: `CitationList`를 추가해 로컬 작업 트리는 **89개
component·91개 registry item**입니다. 약 100개 규모 기준의 수량
비율은 89%, 공급·품질 조건의 완료 표시는 **4/10(40%)**입니다.
두 축을 임의로 같은 비중으로 보면 64.5%이므로 전체 goal의
**관리용 추정 약 65%**를 유지합니다. 100개는 확정 목표 수가
아니고, 이 수치는 공개 준비율도 아닙니다. 새 item의 격리 소비자
설치와 문서 동작, 현재 91개 item의 새 소비자 동시 설치·93개 파일
일치·typecheck·build·브라우저 로딩은
[CitationList 기록](component-citation-list-2026-09-29.md)에 있습니다.
기존 소비자의 갱신·충돌·복구, 실제 보조기술·touch·RTL,
전체 변경 묶음의 검토·릴리스와 공개 배포는 남았습니다.

2026-09-29: `SplitButton` 후보를 기존 세 item의 설치 가능한 조합
예시로 해결했습니다. 기본 저장·대체 메뉴의 문서/소비자 동작을 확인했고
새 component와 item은 만들지 않았습니다. 현재 로컬 작업 트리는
**88개 component·90개 registry item**입니다. 약 100개 규모 기준의
수량 비율 88%와 공급·품질 조건 **4/10(40%)**의 산술 평균은
**64%**이며, 전체 goal은 기존과 같이 **약 65%**의 관리용 추정으로
기록합니다. 100개는 고정된 완료 조건이 아니고, 두 축의 동일 가중치도
합의된 평가 기준이 아니므로 객관적 완료율이나 공개 준비율은 아닙니다.
[조합 검증](component-split-button-recipe-2026-09-29.md)을 제외한
현재 변경 묶음의 검토·릴리스, 전체 핵심 동작·접근성 회귀, 소비자
갱신·충돌 복구와 불변 URL·공개 배포는 남았습니다.

2026-09-29: form 제출이 필요한 분할 선택 `SegmentedControl`을
추가했습니다. 로컬 작업 트리는 **88개 component·90개 registry
item**입니다. 새 항목과 현재 90개 item의 격리 소비자·동시 소비자
검사를 마쳤지만, 공급·품질 조건의 완료 표시는 **4/10** 그대로입니다.
약 100개 규모 기준의 수량 비율 88%와 조건 40%를 같은 비중으로
평균하면 64%이므로 전체 goal의 **관리용 추정은 약 65%**로
유지합니다. 고정된 목표 수나 출시 준비도를 뜻하지 않습니다.
[SegmentedControl 기록](component-segmented-control-2026-09-29.md)에
새 동작과 검증 범위를 남겼습니다. 88개 catalog 사용 코드 전체의
새 소비자 typecheck, 보조기술·touch·RTL, 갱신 충돌·복구와 공개
배포는 남았습니다.

2026-09-29: 기존 Dropzone·Calendar·Slider·Avatar의 문서 예시를
확장해 Chromium에서 파일 선택·거부, 기간 선택, 두 thumb 키보드
조작, 실제 이미지와 fallback을 재검사했습니다. 파일 drag/drop,
touch, 실제 screen reader와 다른 호스트 시간대 검사가 남아 있어
공급·품질 조건의 완료 표시는 **4/10** 그대로입니다. component는
**87개**, registry item은 **89개**이며 전체 goal의 관리용 추정치는
**약 65%**로 유지합니다. 수량 비율 87%와 완료 표시 40%를 같은
비중으로 평균한 63.5%를 반올림한 값입니다. 사용 가능한 화면
범위나 공개 준비도를 객관적으로 측정한 값은 아닙니다.
[상호작용 재검사](component-foundation-interactions-2026-09-29.md)에
확인 범위와 남은 항목을 기록했습니다.

2026-09-29: 기존 `Navigation` item에 주요 목적지용 `BottomNav`를
추가했습니다. 숫자를 늘리기 위한 별도 item이 아니라 같은 탐색
API의 하단 배치입니다. browser pointer·Enter·390px 배치와 격리
소비자 설치·typecheck·build를 확인했습니다. 수량은 **87개
component·89개 registry item**, 공급·품질 조건은 **4/10** 그대로이며
전체 goal 관리용 추정치도 **약 65%**로 유지합니다. 세부 근거는
[하단 탐색 기록](component-bottom-navigation-2026-09-29.md)에 있습니다.

2026-09-29: shadcn/ui source를 수정한 27개 registry item을 각각 새
소비자 fixture에 설치하고, 각 설치물의 MIT 고지와 직접 component
소스가 원본과 일치하는지 확인했습니다. 공급·품질 조건은 **10개 중
4개**가 완료 표시되었습니다. component는 **87개(약 100개 규모 기준
87%)**입니다. 두 축을 임의로 같은 비중으로 계산한 63.5%를
전체 goal의 **관리용 추정 약 65%**로 기록합니다. 가중치와 조건별
난이도가 정해지지 않아 객관적 완료율이나 배포 준비율은 아닙니다.
[item별 고지 전달 검증](component-license-notice-individual-2026-09-29.md)에
범위와 미검증 항목을 기록했습니다. 대규모 변경의 검토·릴리스,
나머지 item의 개별 설치, 실제 상호작용·접근성, 갱신 충돌·복구와
불변 URL은 남았습니다.

2026-09-29: 현재 89개 registry item을 `shadcn@4.21.0`으로 새 소비자에
동시 설치했습니다. 91개 파일의 원본 일치, 설치 소스의 87개 catalog
사용 코드 typecheck, 전체 모듈 build·Chromium 로딩을 확인했습니다.
별도 package tarball 소비자에서도 87개 코드가 typecheck됐습니다.
공급·품질 조건은 **10개 중 3개**로 늘었습니다. component는
**87개(약 100개 규모 기준 87%)** 그대로입니다. 두 축을 임의로 같은
비중으로 계산하면 58.5%이므로 전체 goal의 관리용 추정치는 **약
60%**로 조정합니다. 가중치가 합의되지 않았고 남은 조건의 난이도도
달라 객관적 완료율이나 배포 준비율은 아닙니다. 세부 근거는
[현재 공급 경로 검사](component-catalog-supply-2026-09-29.md)에
있습니다. 변경 묶음의 검토·릴리스, 모든 개별 설치·상호작용,
보조기술·touch·다른 브라우저, 갱신 충돌·복구, 불변 URL은 남았습니다.

2026-09-29: 기존 `Badge`에 기본·외곽선·강조·위험 variant를 추가하고
Operations workspace의 완료·실행 중·실패에 적용했습니다.
`StatusIndicator` 후보는 별도 component 없이 이 API 확장으로
처리했습니다. 수량은 **87개 component·89개 registry item(규모 기준
87%)**, 공급·품질 조건은 **2/10**, 전체 goal의 관리용 추정치는
**약 50%**로 그대로입니다. 격리 소비자 설치와 브라우저의 밝은·어두운
모드 결과는 [Badge 기록](component-badge-variants-2026-09-29.md)에
남겼습니다.

2026-09-29: `DataList`를 추가해 로컬 작업 트리는 **87개 component와
89개 registry item**입니다. 약 100개라는 규모 기준의 수량 비율은
**87%**입니다. 독립 소비자에 `DataList`·`Badge`·token을 설치해
typecheck·build와 원본 일치를 확인했습니다. 이전 87개 item의 동시
설치 검사는 현재 89개 item 전체를 대표하지 않습니다.
[DataList 기록](component-data-list-2026-09-29.md)에 검사 범위가
있습니다.

공급·품질 조건은 여전히 10개 중 2개가 완료 표시되어 있습니다. 수량
87%와 조건 20%를 같은 비중으로 단순 평균하면 53.5%지만, 두 축의
가중치와 조건별 난이도가 정해지지 않았습니다. 전체 goal은 **관리용
추정 약 50%**로 유지합니다. 객관적인 완료율이나 공개 배포 준비율로
해석할 수 없습니다. 대규모 로컬 변경의 검토·릴리스, 기존 component
상호작용 회귀, 보조기술·touch·다른 브라우저, 갱신·충돌 복구와 불변
registry URL은 남았습니다.

2026-09-29: `CodeBlock`을 추가해 로컬 작업 트리는 **86개 component와
88개 registry item**입니다. 약 100개 규모 기준의 수량 비율은
**86%**입니다. 공급·품질 조건은 여전히 2/10이고 전체 goal의 관리용
추정치는 **약 50%**로 유지합니다. 단일 코드 블록의 복사·긴 줄
배치와 격리 설치 검사는
[CodeBlock 기록](component-code-block-2026-09-29.md)에 남겼습니다.

2026-09-29: 현재 87개 registry item을 새 소비자에 동시에 설치하고
89개 파일의 원본 일치와 87개 모듈의 typecheck·build를 확인했습니다.
이 검사는 공급·품질 조건 중 이미 완료 표시된 동시 신규 설치 항목의
현재 snapshot 재검증입니다. 수량 85%, 조건 2/10, 관리용 전체
약 50% 추정치는 변하지 않습니다.
[전체 설치 기록](component-full-registry-consumer-2026-09-29.md)에
검사 범위와 미검증 항목을 남겼습니다.

2026-09-29 종료 시점의 로컬 작업 트리는 **85개 component와 87개
registry item**입니다. `DateTimePicker`를 추가했고 단독 registry 설치,
소비자 typecheck·build 및 로컬 Chromium의 양방향 선택·제출을
확인했습니다. 약 100개라는 규모 기준의 수량 비율은 **85%**입니다.

전체 goal의 관리용 추정치는 **약 50%**로 유지합니다. 수량 85%와
아래 공급·품질 조건 2/10(20%)을 임의로 같은 비중으로 보면 52.5%지만,
가중치·항목 난이도가 합의되지 않았습니다. 따라서 객관적인 완료율이나
배포 준비율은 아닙니다. 현재 변경 묶음의 검토·릴리스, 기존 component의
핵심 동작 회귀, 실제 보조기술·touch·다른 브라우저, 개별 설치·갱신·
충돌 복구, 불변 버전 URL이 주요 미완료 범위입니다. 새 component의
검사 범위는 [DateTimePicker 기록](component-date-time-picker-2026-09-29.md)에
남겼습니다.

2026-09-29 추가 확인: 기존 component를 조합한 Operations workspace를
문서에 넣고 기간 전환, 지표·차트, 로그, 실행 목록, floating 도움말의
브라우저 동작을 확인했습니다. 새 component 수는 0개이고 공급·품질
조건의 완료 표시도 2/10으로 그대로여서 아래 약 50% 추정치는
변경하지 않습니다. 이 예시는 중급 분석 화면 재현성의 한 사례이며
다른 제품 화면이나 접근성 전체를 대표하지 않습니다. 검사와 남은 범위는
[분석 예시 기록](component-analytics-workspace-2026-09-29.md)에 있습니다.


2026-09-29 로컬 작업 트리 기준으로 component는 초기 38개에서 84개로
늘었습니다. 공용 `pyd-utils`, `pyd-tokens`를 포함한 registry item은
86개입니다. 약 100개라는 규모 기준의 수량 비율은 **84%**입니다.
100개는 확정된 완료 조건이 아니라 공급 범위를 가늠하는 기준점입니다.

전체 목표의 **관리용 추정 완료율은 약 50%**로 봅니다. 수량 비율 84%와
[로드맵](component-roadmap.md)의 공급·품질 조건 10개 중 완료한 2개의
비율 20%를 같은 비중으로 보면 52%이며, 이를 50% 수준으로
표현했습니다. 두 축의 가중치는 사용자와 합의한 기준이 아니고 항목별
난이도도 달라, 객관적인 전체 완료율이나 출시 준비도로 해석할 수
없습니다. 특히 component별 design 선택 폭과 중급 이상 복합 화면의
재현성은 하나의 정량 지표로 아직 측정하지 않았습니다.
이후 `MetricCard`에 compact·featured 형태를 추가했지만 component
총수와 공급 조건의 완료 표시 수는 변하지 않았습니다. 검증 범위는
[MetricCard 기록](component-metric-card-variants-2026-09-29.md)에 있습니다.

86개 registry item은 새 소비자 프로젝트에 한 번에 설치했습니다.
생성된 88개 파일은 원본과 일치했고 86개 모듈의 typecheck·build·
브라우저 로딩(206개 값 export, console error 0건)이 통과했습니다.
기본 공개 URL 빌드, 저장소 typecheck와 `registry:check`도 통과했습니다.
[전체 설치 기록](component-full-registry-consumer-2026-09-29.md)에
검사 방법과 fixture 경로를 남겼습니다.

남은 공급 조건에는 현재 변경을 검토 가능한 단위로 정리하는 일,
기존 component의 핵심 상호작용 회귀, 실제 보조기술·touch·다른
브라우저 검사, item별 격리 설치, 소비자가 수정한 파일의 갱신·충돌·
복구, 불변 버전 URL과 릴리스 절차가 있습니다. 현재 변경 묶음의
commit·push·공개 배포도 확인하지 않았습니다. 이번 86개 동시 설치는
각 component의 상호작용 검증을 대신하지 않습니다. 이후 현재
catalog 사용 코드 84개를 tarball 소비자에서 typecheck했고 원본·
public export·registry·catalog ID의 1:1 대응을 자동 검사에 넣었습니다.
검사 범위는 [문서 코드 기록](component-catalog-consumer-2026-09-29.md)에
있습니다. 공급·품질 조건의 완료 표시 수는 변경되지 않았습니다.

상단 로고의 사각 테두리 요청은 키보드 초점 상태의 공통
`focus-visible` outline으로 재현해 로고 링크의 초점 표시를 아래쪽
선으로 바꿨습니다. 밝은·어두운 로컬 화면에서 확인한 범위는
[flat 로고 기록](brand-logo-flat-2026-09-29.md)에 있습니다.
