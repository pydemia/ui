# pydemia UI favicon 선택·게시 기록

2026-09-28. 사용자는 `pydemia-logo-v2`의 2D shade v4와 얕은 3D
시안을 OneDrive와 Google Drive에 저장하고, 2D shade v4를 사이트
favicon으로 쓰도록 선택했습니다.

## 원본과 클라우드 보관

- 2D: `favicon-candidates/main-logo-gradient/`의
  `pydemia-logo-v2-dimensional-v4.svg` 및 같은 이름의 PNG 1728px,
  32px, 16px.
- 3D: 같은 폴더의 `pydemia-logo-v2-extruded.svg` 및 PNG 1728px,
  32px, 16px. 3D는 사이트에 적용하지 않은 비교 시안입니다.
- 두 드라이브의 `pydemia-logo-v2/ui` 폴더에 시안 8개와 `README.md`를
  업로드했습니다. 폴더 목록을 다시 읽어 각각 9개 파일을 확인했습니다.
- [Google Drive 폴더](https://drive.google.com/drive/folders/1l7FyGobGq-uWoWTKyCCCMTSlkQls-JjY)
- [OneDrive 폴더](https://onedrive.live.com?cid=231A9F5CA1804368&id=231A9F5CA1804368!s0e0b89eef6894a60ac469930bd5f5905)

## 사이트 적용

`apps/docs/public/`과 `apps/profile-demo/public/`에 2D shade v4의
SVG·32px PNG·16px PNG를 복사했습니다. 두 앱의 `index.html`에 favicon
링크를 추가했습니다. 빌드된 프로필 예시의 링크는
`/examples/profile/favicon.*`로 변환됩니다.

## 검증 상태

- `npm run typecheck`, `npm run build`, `npm run registry:check` 통과.
- 빌드된 `docs/`에 두 페이지의 favicon 링크와 파일이 포함된 것을
  확인했습니다. 원본과 배포 출력의 해시도 일치합니다.
- 로컬 preview에서 문서와 프로필 예시를 열었고, 양쪽 SVG가
  브라우저에서 렌더링되는 것을 확인했습니다. 문서 사이트의 SVG·32px·
  16px 파일은 HTTP 200으로 응답했습니다.
- 브라우저 탭 chrome의 작은 아이콘 표시 자체는 확인하지 못했습니다.
- commit `319a9cc`를 `origin/main`에 push했습니다. Vercel production
  배포 `dpl_DCg2iw1JZbBzS9AmNsvFKUcPbVjB`가 `READY`이고
  `pydemia-ui.vercel.app`, `ui.pydemia.ai` alias가 연결됐습니다.
- 두 도메인의 문서·favicon SVG 경로가 HTTP 200으로 응답했습니다.
  `pydemia-ui.vercel.app`의 16px·32px PNG, 프로필 예시 페이지와
  프로필 favicon SVG도 HTTP 200입니다. 공개 SVG를 브라우저에서 직접
  열어 색상과 형태가 렌더링되는 것을 확인했습니다.
