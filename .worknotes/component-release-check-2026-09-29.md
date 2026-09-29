# 현재 registry와 릴리스 후보 대조

2026-09-29. 기존 `registry:check`는 저장된 각 snapshot과 빌드 복사본의
무결성을 검사하지만, 지정한 snapshot이 현재 최신 registry와 같은지는
확인하지 않았습니다. `registry:release-check -- <ID>`는 먼저
`registry:check`를 실행한 뒤 다음을 대조합니다.

- 현재 생성된 91개 item의 정규화된 내용 해시와 전달한 ID
- 해당 ID의 원본 snapshot과 `docs/r/releases/` 복사본
- `apps/profile-demo/public/r/`와 `docs/r/`의 최신 index·item JSON

테스트 fixture에서 이전 ID를 만든 후 현재 item을 바꾸면 검사가
실패했고, 새 ID를 만든 뒤 게시용 최신 JSON을 오래된 값으로 두어도
실패했습니다. 현재 로컬 ID
`sha256-a1cd11bae6654a55136729439cd7b437a507d59896271b7c0950745a9e61bf21`
에 대한 `npm run registry:release-check -- <ID>`가 통과했습니다.
README의 실행 순서를 갱신하고 `CHANGELOG.md`에 미공개 후보의
사용자 관점 변경을 기록했습니다.

현재 작업 트리는 대규모 로컬 변경 상태입니다. 공개 URL의 snapshot
설치, 이전 snapshot의 공개 보존, commit·push·배포는 검증하지
않았습니다. 공급·품질 조건 5/10과 전체 goal 관리용 추정 약 70%는
유지합니다.
