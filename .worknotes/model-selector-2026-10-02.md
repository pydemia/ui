# ModelSelector 편입

2026-10-02. 공개 기준은 116개 component, 118개 registry item,
37개 snapshot이며 goal 관리용 추정은 약 91%입니다. 이번 작업은
AI 작성 화면에서 모델을 검색·선택하고 기능·제공자·사용량 문구,
사용 불가 이유를 함께 확인하는 반복 용례를 대상으로 합니다.

기존 `Combobox`의 검색·keyboard·form 값을 사용하고 모델별
메타데이터와 권한 변경 시 제출 차단만 추가했습니다. 모델 목록,
권한, 요금 문구와 실제 모델 호출은 소비자 앱이 소유합니다.
`PromptInput`과 함께 사용하는 문서 preview를 추가했습니다.
코드는 pydemia/ui 원본이며 새 외부 source나 npm 의존성은 없습니다.

## 확인한 범위

- `npm run typecheck`, UI 테스트 161/161, `npm run build` 통과.
- `registry:check`는 119개 item·117개 component 대응과 기존
  snapshot을 확인했습니다. `registry:release-check`는 38번째
  snapshot `sha256-d2020273e3a064ac334ce6628d09e4cfbc01b4fc007209d660ffc49d2502465c`를
  현재 빌드와 대조해 통과했습니다.
- 로컬 Chromium에서 모델 선택 후 form 값과 설명 변경,
  `PromptInput` 전송, 사용 불가 모델의 제출 차단과 이유,
  `panel`·`compact` 표시를 확인했습니다.
- 390px dark 화면에서 가로 넘침과 브라우저 오류는 없었습니다.

## 공급 상태

Registry·provenance·고지의 고정값과 snapshot을 확인했습니다.
PR CI와 공개 URL은 아직 확인하지 않았습니다. 실제 screen reader·touch·
Safari·RTL과 별도 소비자 설치는 이번 변경의 공통 차단 조건으로
적용하지 않았고 지원 검증도 주장하지 않습니다. 공개 전까지
goal 추정 약 91%를 유지합니다.

체크리스트 수준 검토는
[별도 기록](quality-checklist-level-2026-10-02.md)에 남겼습니다.
