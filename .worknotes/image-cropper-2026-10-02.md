# ImageCropper 편입 기록

2026-10-02. 공개 기준은 111개 component·113개 item·30개 snapshot,
goal 관리용 추정 약 86%입니다. 로컬에는 `ImageCropper`를 더해
112개 component·114개 item이 있습니다. 공개 검증 전까지 goal
추정은 유지합니다.

## 사용처와 구현

프로필 사진이나 게시물 이미지를 선택한 뒤 비율에 맞게 자르는
반복 작업입니다. 기존 `Image`는 표시, `FileUpload`는 전송 상태를
담당하며 원본의 crop 영역을 편집하지 않습니다. handoff의
File & media 후보 중 독립적인 값·상호작용이 확인돼 편입했습니다.

`file: File | null`은 호출자가 소유합니다. PNG·JPEG·WebP를
브라우저가 디코딩하고, 중앙 기준 crop 영역을 확대·가로·세로
위치로 조정합니다. Canvas 포인터 끌기와 동일한 상태를 native
range로 제어합니다. 결과는 PNG `Blob`으로 `onCrop`에 전달하며
업로드·저장은 앱이 처리합니다. 파일 교체 시 blob URL을 해제하고
진행 중이던 이전 파일의 비동기 export는 전달하지 않습니다.
크기·비율·필수 이름·callback 오류는 명시적으로 구분합니다.

`@pydemia/ui` export, `pyd-image-cropper` registry item,
provenance, 실제 문서 preview와 Usage를 연결했습니다. 새 npm
의존성은 없고 기존 `pyd-button`·`pyd-utils`만 사용합니다. 구현은
pydemia/ui 원본이며 Canvas·File·Pointer Events의 공식 명세와
WAI label·drag 대안 지침만 참고했습니다. 기존 Button의 고정
shadcn/ui source와 동일 revision MIT 고지는 유지합니다.
[source 조사](../research/source-inventory.md)와
[동작 규칙](../research/design-contract.md)에 근거가 있습니다.

## 로컬 검증

- `npm run typecheck` 통과.
- UI 테스트 135/135, 새 SSR 검증 3건 통과.
- `npm run build` 통과, registry item 114개 생성.
- Chromium 문서 preview에서 샘플과 실제 파일 선택, 키보드 확대,
  포인터 위치 변경, 1:1·16:9 PNG 결과 크기·MIME을 확인.
- 120×120px 사분면 PNG의 300% crop에서 왼쪽 위 빨강과 오른쪽
  아래 노랑의 결과 중앙 픽셀을 확인.
- 390px light/dark에서 가로 넘침 없음, page error 없음.

source commit `dc5b9d6`의 provenance 고지 핀을 갱신하고
31번째 snapshot
`sha256-7faa63bf1fee02d8ed644e96d9a7f41804f406317f66ed362737aa3b5a363066`을
생성했습니다. 재빌드 뒤 `registry:release-check`가 114개 item·
112개 export/catalog와 현재 snapshot을 확인했습니다. PR·공개
URL은 남았습니다. 표준 registry 설치 경로를 재사용하므로 개별 item
CLI 설치는 이번 릴리스의 필수 검사에 포함하지 않았지만
실행 여부는 미검증으로 유지합니다. 실제 touch·screen reader·
Safari·RTL과 rollback 뒤 URL 보존도 미검증입니다.
