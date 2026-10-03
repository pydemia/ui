# shadcn 출처 고지 범위 조정

## 병합 후 상태

PR #135는 `ec5b4c44dbce6a5c7195791a938c65d3ae8074f0`로
`main`에 병합됐고 PR·`main` Verify UI와 Pages가 통과했습니다.
고지가 가리키는 고정 commit의 manifest는 공개 GitHub URL에서
HTTP 200이며 로컬 파일·SHA-256과 일치합니다. Vercel
production은 배포 횟수 제한으로 실패해 사용자 도메인의 75번째
manifest는 HTTP 404입니다. 기존 74번째 공급은 정상이고
공개 확인 수량은 143개 component·145개 item입니다.
75번째 snapshot의 공개 확인은 대기 중입니다.

원본 component를 하나 추가해도 `registry/provenance.json` 전체의
hash가 달라져 shadcn/ui 수정 소스를 쓰는 28개 item의 소비자 고지와
생성 JSON이 함께 바뀌었습니다. `CalendarHeatmap` 릴리스에서
그 전파를 확인했습니다. source 자체나 MIT 고지가 바뀐 것은
아니었습니다.

`registry/shadcn-sources.json`에 해당 28개 item의 이름과 source
metadata만 고정했습니다. 소비자 고지는 이 파일의 commit
`b19a9f3968e53c0f1643814536b1cd45e1a21e46`과 LF 기준
SHA-256을 가리킵니다. `registry:check`는 현재 provenance에서
shadcn/ui source 기록을 골라 manifest와 대조하고, 고지의 hash도
검사합니다. 원본 기록의 추가·수정은 고지를 바꾸지 않고, 수정
소스의 upstream·LICENSE·고지 필드가 달라지면 검사가 실패합니다.

현재까지 `npm run build`와 `npm run registry:release-check`가
통과했습니다. 75번째 snapshot
`sha256-293797da4028d8548f131b2b5c9c6945b449fef30bbb4a17385d7b7f26035dc8`은
145개 item을 담습니다. 회귀 테스트 2개는 원본 기록을 추가해도
source 목록이 같고 shadcn source를 바꾸면 목록이 달라짐을
확인했습니다. PR CI와 이 변경의 공개 경로는 아직 확인하지
않았습니다.

이 변경은 원본 component 추가 때 고지와 28개 item을 다시 생성하는
비용을 줄입니다. 새 snapshot마다 전체 item을 원본·게시 위치에
복사하는 비용은 그대로입니다. 공개 확인 수량은 143개 component·
145개 registry item이며 Goal 관리용 추정 약 98%는 유지합니다.
