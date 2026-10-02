# 공급·품질 체크리스트 재검토

2026-10-02. 현재 공개 수량은 127개 component, 129개 registry item,
52개 snapshot이며 goal의 관리용 추정은 약 97%입니다. 이번 검토는
제품·CI·게시 방식을 변경하지 않았습니다.

## 확인한 내용

현행 [로드맵](component-roadmap.md#공급과-품질의-판정-단위)은 과거
10개 누적 과제의 완료 수를 릴리스 점수로 사용하지 않습니다. 변경한
핵심 흐름은 자동 테스트 또는 브라우저 실행으로 확인하고, 동일
upstream revision의 조사는 재사용하며, component별 PR·snapshot·
별도 소비자 설치를 요구하지 않습니다. 기준 문구 자체는 이미 변경
위험에 따라 적용하도록 바뀌었습니다.

실제 작업에는 그보다 많은 검사가 남았습니다. ResultState는 로컬
Chromium에서 Enter 재시도와 focus를 확인한 뒤 공개 사이트에서도 같은
동작을 다시 실행했습니다. 문서의 기준은 이 중복을 요구하지 않습니다.
현재 `Verify UI`는 제품 PR과 병합 뒤 `main`에서 전체 검사를 실행하고,
비렌더링 Markdown만 바뀐 PR은 diff 검사만 하지만 `main` push에는
전체 검사를 적용합니다. 문서 전용 병합도 Vercel 배포 횟수를
소비한 사례가 있습니다.

현재 snapshot 52개의 파일은 `registry/releases/`와
`docs/r/releases/`에 각각 5,743개, 약 34 MiB씩 있습니다.
`registry-release.mjs`는 새 snapshot마다 현재 item 전체를 두 위치에
기록합니다. 이는 품질 판정 항목 수보다 릴리스 횟수와 저장 방식에
따른 고정 비용입니다.

## 적용할 판정

| 시점 | 확인할 증거 |
| --- | --- |
| 변경 검토 | 변경 commit의 적용 CI, 바뀐 API·registry·preview·Usage의 일치, 변경한 핵심 흐름의 자동 테스트 **또는** 브라우저 실행 |
| 외부 코드 도입 | 공식 문서, 동일 revision의 source·LICENSE, 의존성·접근성, 소비자 고지. 이미 확인한 revision은 기록 재사용 |
| 새 설치 방식·의존 경로 | 해당 경로의 깨끗한 소비자 설치·typecheck·build. 기존 방식의 새 item은 릴리스 묶음의 대표 설치와 자동 registry 검사 사용 |
| 공개 릴리스 | 배포 상태, manifest, 변경 item URL과 바뀐 preview 확인. 로컬에서 실행한 상호작용은 공개 사이트에서 반복하지 않음 |
| 비렌더링 기록만 변경 | 문구·링크와 diff 검사. 제품 릴리스 검사는 요구하지 않음 |

새 component에는 독립 사용처, public export·registry·출처,
동작하는 preview·Usage가 필요합니다. 정적 표시 변경은 변경한 상태의
preview 확인으로 충분합니다. focus·pointer·browser API·핵심 반응형
배치가 바뀌면 영향받은 브라우저 흐름을 실행합니다. 시각 변경은
영향받는 상태·폭·theme만 봅니다. 같은 commit에서 통과한 CI를
로컬과 원격에서 중복 실행할 필요는 없습니다.
대표 item 설치는 같은 설치 방식의 동작 증거이며, 묶음의 모든 item을
개별 설치했다는 뜻은 아닙니다.

출시를 막는 것은 적용되는 CI 실패, 확인된 값 손실·제출 오류·
keyboard 접근 불가·필수 접근성 이름/상태 누락, 필수 고지 누락,
설치·공개 경로 실패와 변경한
핵심 흐름의 실행 증거 부재입니다. 실제 보조기술·touch·Safari·RTL,
모든 item의 개별 설치와 rollback 뒤 URL 보존은 해당 지원을
주장하거나 관련 경로를 바꿀 때 확인합니다. 그 밖에는 전체
라이브러리 과제로 추적합니다. 미실행 검사를 통과로 기록하지
않습니다.

완성된 component를 검토 가능한 릴리스 묶음으로 공개할 수 있습니다.
각 component마다 PR·snapshot·공개 상호작용 재검사를 만들지 않습니다.
묶음 크기를 채우려고 공개를 지연하거나 후보를 추가하지도 않습니다.
반복 비용을 더 줄이려면 `main`의 문서 전용 CI·Vercel 배포와
snapshot 전체 복제 방식을 별도 작업으로 변경해야 합니다. 기존
고정 URL과 rollback 동작을 검증하기 전에는 저장 형식을 바꾸지
않습니다.

체크리스트를 다시 나눴다는 이유로 goal 추정이나 공개 수량은
변하지 않습니다. 다음 제품 변경부터 적용한 증거와 실제 차단
결함만 기록합니다.

## 첫 적용

같은 날 `BlockEditor`를 PR #98로 공개하면서 변경한 편집 흐름은
로컬 Chromium과 테스트에서 실행했습니다. 공개 사이트는 preview·
Usage, 현재 item과 snapshot URL을 확인했고 편집 동작을 재실행하지
않았습니다. 대표 소비자의 공개 snapshot 설치·typecheck·build는
README의 릴리스 경로 확인으로 수행했습니다.
[작업 기록](block-editor-2026-10-02.md)에 적용 증거와 미검증 범위를
남겼습니다.
