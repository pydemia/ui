# AvatarUploader 편입 기록

2026-10-02. 공개 기준은 120개 component·122개 registry item·41개
snapshot, goal 관리용 추정 약 95%입니다. 이 작업의 로컬 초안에는
AvatarUploader를 더해 121개 component·123개 item이 있습니다.

## 사용처와 구현

프로필 사진을 고르는 화면에는 선택, 정사각형 crop, 저장 전 미리보기,
제거 요청이 함께 필요합니다. 기존 `ImageCropper`는 호출자가 `File`을
공급해야 하고 `Avatar`는 표시만 하므로 이 흐름을 조합한
`AvatarUploader`를 추가했습니다. `FileUpload`의 전송 상태와는
다른 작업입니다. `pydemia/ui` 원본 구현이며 기존 `Avatar`·
`Button`·`ImageCropper`·`pyd-utils`를 사용합니다. 새 npm 의존성은
없습니다.

PNG·JPEG·WebP 파일을 검사하고 `ImageCropper`의 정사각형 PNG
`Blob`을 `onImageChange`로 전달합니다. 제거는 `null`을 전달하고
아직 변경하지 않은 상태는 callback을 호출하지 않습니다. 저장·전송은
앱이 맡습니다. 결과 미리보기용 object URL은 교체·제거·`src` 변경·
unmount에서 해제합니다. 파일 입력은 label을 갖는 native control이며
crop·취소·제거 뒤 입력에 focus를 돌립니다.

`@pydemia/ui` export, `pyd-avatar-uploader` item, provenance, 문서
preview·Usage를 연결했습니다. [출처 조사](../research/source-inventory.md)와
[동작 규칙](../research/design-contract.md)을 갱신했습니다.

## 로컬 검증

- `npm run typecheck` 통과.
- 전체 UI 테스트 172/172 통과. 새 테스트 3건은 파일 검사, crop
  결과·focus, 제거·`src` 갱신을 확인합니다.
- `npm run build` 통과. registry item 123개와 문서 사이트를
  생성했습니다.
- 로컬 Chromium에서 실제 PNG 선택, crop, Blob preview, 제거와
  focus 복귀를 확인했습니다. 390px dark에서 가로 넘침과 브라우저
  오류는 없었습니다. 제거 후 새 파일 선택 시 이전 상태 문구가
  남지 않도록 수정했습니다.

source commit `86cb975fbd7fda4a5e30cef1d79d3aa5cda5c9ac`의
provenance SHA-256을 소비자 고지에 고정했습니다. 초기
`registry:check` 실패는 이전 hash가 남아 있었기 때문이며, 고지
갱신 후 검사와 `registry:release-check`가 통과했습니다. 123개 item과
121개 export/catalog가 일치하고 42번째 snapshot
`sha256-1fe7e3c31000b32e5f0865a208e818c05c6a1a4ea186e4313128ae75808dc8cf`를
현재 빌드와 대조했습니다. 공개 preview·item URL·CI·배포는 아직
확인하지 않았습니다. 실제 저장 API와 보조기술 발표는 이
component가 제공하는 범위 밖이거나 별도 환경 검사가 필요합니다.
공개 확인 전까지 공급 수량과 goal 추정 약 95%를 올리지 않습니다.

공급·품질 판정은 [현재 적용 검토](quality-checklist-current-review-2026-10-02.md)의
변경 위험 기준을 따릅니다. 이미 통과한 같은 commit의 CI나 로컬에서
실행한 브라우저 흐름을 반복할 필요는 없습니다.

## 공개 확인

PR [#76](https://github.com/pydemia/ui/pull/76)의 Verify UI run
`36967165317`과 병합 commit `413c0814983d830cb1d631c20f564086c47d261f`의
Verify UI run `36967341555`, Pages run `36967341232`가 통과했습니다.
Vercel production `dpl_ErGFax8WHqeFc2b2XAnuLxxWFJYo`는 READY이며
`ui.pydemia.ai` alias에 연결됐습니다. 공개 브라우저에서
AvatarUploader preview·Usage를 확인했습니다. 현재
`/r/pyd-avatar-uploader.json`과 42번째 snapshot의 manifest·item
URL은 HTTP 200이고 manifest의 `itemCount`는 123입니다.

로컬에서 확인한 선택·crop 흐름은 공개 사이트에서 다시 실행하지
않았습니다. 실제 저장 API와 screen reader 발표는 검사하지
않았습니다. 공개 기준은 121개 component·123개 item·42개
snapshot입니다. 프로필 사진 준비의 완결된 반복 용례를 공급해
goal 관리용 추정을 약 95%에서 약 96%로 조정합니다.
