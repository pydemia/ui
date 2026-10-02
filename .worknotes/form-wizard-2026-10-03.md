# FormWizard 공급 작업

## 공개 확인

PR #103을 `e921800e872d11ae3ba098c3e668b362a7f80d9a`로 병합했습니다.
PR과 `main`의 Verify UI, GitHub Pages, Vercel production이
성공했습니다. 공개 현재 item, 57번째 snapshot의 manifest·item,
문서 사이트 JS asset은 로컬 빌드와 byte 단위로 일치합니다.
`ui.pydemia.ai`의 같은 JS asset도 일치합니다. 공개 사이트의
상호작용은 재실행하지 않았고, 아래 로컬 Chromium 결과를
사용했습니다. 실제 screen reader·touch·Safari 동작은 검사하지
않았습니다. 공개 수량은 130개 component·132개 registry item·
57개 snapshot이며 goal 관리용 추정은 약 97%입니다.

## 구현과 로컬 검증

`Stepper`는 현재·완료·오류 상태를 보여주지만 단계별 입력 검증과
제출 흐름은 제공하지 않습니다. 신규 `FormWizard`는 여러 단계의
설정·게시·신청 form에서 이 반복 코드를 줄입니다. 숫자만 늘리는
후보와 구분하기 위해 단계 전환, 실패 상태, 값 보존 사례를 함께
제공합니다.

현재 단계만 렌더링해 native required 검사를 적용합니다. 입력값과
현재 단계는 호출자가 소유하며 마지막 `onFinish`의 저장도 호출자
책임입니다. `validateStep`은 `boolean | Promise<boolean>`이고
`false`와 예외를 표시합니다. 검증 중에는 중복 이동을 막고 외부
단계 변경 뒤 늦은 응답을 버립니다. 가로·세로 Stepper와 panel·plain
외관을 제공합니다. 중첩 form은 사용하지 않습니다.

원본 React·Tailwind 구현이며 기존 `Stepper`·`Button`·`utils`만
사용합니다. [WHATWG HTML Standard](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#constraint-validation)의
native 유효성 검사·submit 순서를 확인했고 외부 source를 복사하지
않았습니다. 신규 npm 의존성은 없습니다.

대상 테스트 4/4, 전체 UI 테스트 206/206, `npm run typecheck`와
`npm run build`가 통과했습니다. Registry 검사는 Usage의 추가
`Input` 설치 항목과 provenance hash 갱신을 잡았고 수정 뒤 132개
item·130개 export/catalog가 통과했습니다. 로컬 Chromium에서
필수값 차단, 사용자 검증 오류, Enter 이동, 제목 focus, 뒤로 가기
뒤 값 유지, 완료 요청과 390px 세로 배치를 확인했습니다. 문서의
가로 넘침·console error·Vite error overlay는 없었습니다.
57번째 snapshot `sha256-2703ecc5913caf2a736415e2fd98c6276a48d6e0b955d8eca4b2a4024fdd16b5`를
생성·재빌드했고 `registry:release-check`가 현재 132개 item과 57개
snapshot을 통과했습니다. 이 시점에는 PR CI·공개 경로를
확인하지 않았습니다. 당시 공개 기준은 129개 component·131개
item·56개 snapshot, 로컬은 130개·132개·57개였으며 goal 관리용
추정은 약 97%였습니다.
