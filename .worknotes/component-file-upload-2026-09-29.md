# FileUpload 구현과 검증

2026-09-29. `Dropzone`은 파일 선택·형식·크기·선택 건수를 검사하지만
전송 후 상태는 표시하지 않았습니다. `FileUpload`는 선택 UI와
전송 목록을 묶어 대기·진행·완료·실패·취소를 표시합니다. 실제 네트워크
요청, 취소용 `AbortController`, 재시도와 파일 ID는 호출자가 소유합니다.
`items`를 controlled prop으로 받으므로 전송 결과가 화면에 반영되는
시점도 호출자가 결정합니다.

`FileUpload`는 기존 `Dropzone`, `Progress`, `utils`만 import합니다.
`Dropzone`에 `showSelectedFiles`를 추가해 기본 동작은 유지하고,
`FileUpload`에서만 내부 선택 파일 문장을 숨겼습니다. 목록과 같은
파일 이름을 두 번 표시하지 않기 위해서입니다. `maxFiles`는
`Dropzone`과 동일하게 **한 번의 선택에서 허용하는 개수**입니다.
누적 대기열의 상한과 중복 파일 정책은 호출자가 처리해야 합니다.

외부 component source를 복사하지 않았습니다.
[WHATWG file input](<https://html.spec.whatwg.org/multipage/input.html#file-upload-state-(type=file)>)과
[WAI-ARIA APG range 값](https://www.w3.org/WAI/ARIA/apg/practices/range-related-properties/)을
참고했습니다. `Progress`는 기존 shadcn/ui 고정 revision
`98a1fe67b439324ddc857f47fbdce056600a4329`의 변형을 재사용합니다.
그 구현의 upstream source와 동일 revision MIT LICENSE는 기존
`registry/provenance.json`에 기록되어 있습니다. 설치된
`@radix-ui/react-progress@1.1.16`의 package manifest, 배포 소스,
MIT LICENSE도 확인했습니다. 새 npm dependency는 없습니다.

## 검증

- 로컬 registry에서 61개 item을 생성하고 `pyd-file-upload`를 별도
  Vite 소비자에 `shadcn add`로 설치했습니다. `pyd-dropzone`이 새로
  설치되고 기존 `pyd-progress`가 재사용됐습니다.
- 소비자에서 실제 import·render 후 typecheck와 build가 통과했습니다.
- Chromium 문서 preview에서 실패 후 재시도, 진행률 변경,
  Enter 취소와 Space 재시도, 실제 `.txt` 파일 선택, `.json` 거부,
  대기→진행→완료와 완료 파일 제거를 확인했습니다.
- 390px viewport에서 문서의 가로 넘침이 없었습니다.
- 서버 렌더링에서 빈 목록, 0%·미정 진행률과 잘못된 label·중복 ID·
  범위 밖 진행률·알 수 없는 상태의 경계값을 확인했습니다.

최종 저장소 typecheck·build·registry 검사도 통과했습니다.
61개 registry item은 공개 기본 URL로 생성됐으며 로컬 URL이
남지 않았습니다. 결과는 `research/verification.md`에도 기록했습니다.
실제 네트워크 전송, `AbortController` 연결, screen reader 발표,
touch drag-and-drop과
전체 item의 새 소비자 설치는 검증하지 않았습니다. 문서 preview의
진행 버튼은 상태 시연용이며 서버에 파일을 보내지 않습니다.
