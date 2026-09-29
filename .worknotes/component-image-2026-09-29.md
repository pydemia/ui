# Image 구현·검증 기록

2026-09-29. File & media 범주에 `Image`를 추가했습니다. 로컬 작업
트리는 69개 component, 71개 registry item입니다. 공개 배포는
확인하지 않았습니다.

`Avatar`는 프로필 이미지, `Dropzone`은 파일 선택을 맡습니다. 일반
콘텐츠 이미지를 고정 비율로 표시하고 로딩·누락·오류를 구분하는
component가 없어 `Image`를 추가했습니다. `src`는 URL 또는 `null`이고,
빈 문자열은 오류로 처리합니다. `aspectRatio`는 square/video/portrait
또는 양의 유한한 숫자입니다. cover/contain과 plain/frame을 선택할 수
있습니다. native `<img>`의 `alt`, `srcSet`, `sizes`, `loading`,
`decoding`, load/error callback을 유지합니다.

정보 이미지에는 설명 `alt`, 장식 이미지에는 빈 `alt`를 요구합니다.
로드 오류가 난 이미지는 접근성 트리에서 숨기고 상태 문구를 표시합니다.
로딩 skeleton은 장식 요소입니다. W3C WAI Images Tutorial과 WHATWG
HTML 이미지 명세를 확인했습니다. 외부 구현 소스는 복사하지 않았고
새 npm dependency도 없습니다. 직접 registry 의존성은 `pyd-utils`입니다.

## 검증

- `npm run typecheck`, `npm run build`, `npm run registry:check`,
  `git diff --check` 통과. 기본 공개 URL의 71개 registry item을
  생성했고 산출물에서 로컬 URL을 발견하지 못했습니다.
- server render에서 `src=null`, native 이미지 속성 전달, 빈 URL,
  누락된 `alt`, 0 비율 거부를 확인했습니다.
- 문서 Chromium에서 정상 이미지, `src=null` 화면, 디코딩 오류,
  cover/contain 전환, 이미지 비율과 오류 시 접근성 트리에서 이미지를
  숨기는 동작을 확인했습니다.
- 새 Vite 소비자 fixture에 `Image`·token을 shadcn CLI로 설치했습니다.
  Image·utils·token 3개 파일이 생성됐고 Image source hash가 저장소와
  일치합니다. 설치본의 typecheck·build·Chromium 정상/누락/오류 상태가
  통과했습니다. `npm audit --omit=dev --audit-level=high`는 0건입니다.

실제 screen reader, 느린 네트워크의 로딩 화면, 실제 HTTP 오류,
반응형 `srcSet`의 기기별 선택, 다른 브라우저와 터치 기기,
전체 registry item의 새 소비자 설치는 검증하지 않았습니다.
