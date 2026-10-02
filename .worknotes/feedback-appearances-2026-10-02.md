# Empty·Skeleton 표시 확장

기준: 공개 124개 component·126개 registry item·45개 snapshot,
goal 관리용 추정 약 97%. 새 component를 만들지 않고 기존
`Empty`·`Skeleton`에 화면 위치별 표시를 추가합니다. 이미 있는
`Spinner` 다섯 형태, `MetricCard` 세 형태와 `DataChart`의 inspector는
다시 구현하지 않습니다.

`Empty`는 기존 점선형을 기본으로 유지하고 실선 panel과 border 없는
plain을 추가했습니다. 세 형태 모두 제목·설명·선택적 동작의 의미는
같습니다. `Skeleton`은 기존 직사각형을 기본으로 유지하고 텍스트 줄·
원형 자리를 추가했습니다. 장식 요소이며 상위 loading 설명이
필요합니다. pulse는 움직임 줄이기 설정에서 멈추도록 했습니다.

두 파일의 기존 shadcn/ui 고정 revision·MIT LICENSE와 `pyd-utils`
의존 기록을 재사용했습니다. upstream code와 npm 의존성은 새로
도입하지 않았습니다. 기존 provenance 문구는 여전히 정확하므로
수정하지 않았습니다. 이는 소비자 고지 hash를 불필요하게 바꾸지
않으려는 결정입니다.

로컬 확인: typecheck, 대상 회귀 테스트 2/2, build와 126개 item·
124개 export/catalog 검사가 통과했습니다. 로컬 Chromium에서
`Empty`의 panel·plain과 동작, `Skeleton`의 세 형태·로딩 전환,
390px dark의 token 적용을 확인했습니다. Reduced motion은 출력
class·build로 확인했으며 실제 OS 설정 전환은 실행하지 않았습니다.
46번째 snapshot ID는
`sha256-ea992a80d6d5a7e8c27918e9f7cf7a4880facb2e8ea2e350ed5e2e27bbe7b4b2`이고
`registry:release-check`가 통과했습니다. PR CI·공개 배포·URL은
아직 확인하지 않았습니다.

이번 검토에서 공급·품질 기준은 변경 위험별로 적용합니다.
[현재 적용 검토](quality-checklist-current-review-2026-10-02.md)에
재판정을 적었습니다. 이 표시 확장만으로 goal 추정은 올리지
않습니다. 공개 검증을 마치면 이 기록과 `research/verification.md`를
갱신합니다.
