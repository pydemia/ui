# 사이트 flat 로고 적용

2026-09-29. 사용자가 사이트 왼쪽 상단의 `p` 모노그램과 favicon을
그라데이션 시안 대신 flat 로고로 바꾸도록 요청했습니다.

## 선택한 원본

`C:\Users\pydemia\Downloads\pydemia-logo-v2.zip`의
`04-colorful/pydemia-logo-colorful.svg`에 있는 승인 도형을 사용합니다.
첫 모듈은 네이비 `#103344`, 180도 회전한 두 번째 모듈은 버건디
`#BA365B` 단색입니다. PNG 대체 파일은 앞선 작업에서 보관한 같은
원본의 `approved-colorful-source.png`를 복사했습니다.

기존 2D shade v4와 3D 시안은 `.worknotes/favicon-candidates/`와
두 클라우드의 `pydemia-logo-v2/ui` 폴더에 남겨 둡니다.

## 변경 범위

- `apps/docs`와 `apps/profile-demo`의 favicon을 flat SVG·PNG로 교체하고
  이전 그라데이션 16px·32px PNG 참조 및 파일을 제거했습니다.
- 문서 사이트 상단 링크의 `p` 모노그램을 같은 flat SVG로 바꿨습니다.
  기존 `pydemia / ui` 글자와 링크의 접근 가능한 이름은 유지했습니다.
- 다크 모드에서도 네이비 도형이 보이도록 이미지에 흰 배경을 둡니다.

## 검증 상태

- `npm run typecheck`, `npm run build`, `npm run registry:check` 통과.
- 빌드된 두 페이지에서 새 favicon 링크와 파일을 확인했습니다.
  두 앱의 SVG·PNG와 각 배포 출력은 파일별 해시가 일치합니다. PNG는
  승인된 flat 원본과도 해시가 일치합니다.
- 로컬 preview에서 상단 로고를 라이트·다크 모드로 확인했습니다.
  SVG favicon을 브라우저에서 직접 열어 flat 색상을 확인했습니다.
  두 페이지의 SVG·PNG 경로는 모두 HTTP 200입니다.
- 작은 화면의 실제 표시와 브라우저 탭 chrome의 아이콘은 확인하지
  못했습니다.
- commit `5859d0d`를 `origin/main`에 push했습니다. Vercel production
  배포 `dpl_4Smpm33CGsKHE2NQGVwvouyjAEeT`가 `READY`이고
  `ui.pydemia.ai`, `pydemia-ui.vercel.app` alias가 연결됐습니다.
  두 도메인의 페이지·flat SVG·PNG가 HTTP 200으로 응답했고, 공개
  사이트의 상단 flat 로고를 브라우저에서 확인했습니다.
