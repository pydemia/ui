# registry 출처 고지의 revision 고정

2026-09-29. 수정한 shadcn/ui source를 설치한 소비자에게 전달하는
`SHADCN_UI_LICENSE.md`가 `main`의 provenance를 가리키고 있었습니다.
과거 item의 출처 설명이 나중에 바뀔 수 있으므로 새 고지는
`a84b26fb0f52b50eab439cadab3861e7faf00265`의
`registry/provenance.json`을 가리키고 LF 기준 SHA-256
`73b0a8ffe4141c7fa7378a15aa8a6478a38cabe2614cd6fcfa61d26498a5f5d3`
을 기록합니다. 로컬 Git의 해당 commit과 공개 GitHub raw 파일이 현재
metadata와 정확히 같은 내용임을 확인했습니다.

`scripts/check-registry.mjs`는 고지 링크가 40자리 commit을 가리키고,
링크의 commit 표기와 SHA-256이 현재 provenance 내용에 맞는지 검사합니다.
metadata가 바뀌면 새 고지·고정 revision을 함께 갱신해야 합니다. 이
검사는 GitHub에 저장된 commit의 파일 내용을 매번 내려받지는 않습니다.

새 로컬 snapshot은
`sha256-d6ac442e615afdf7bda064ed424685038b48ac2ff063bc5726e354494ba29fee`
입니다. 이전 snapshot은 수정하지 않았습니다. `npm run build`의 첫
시도는 Windows의 생성 HTML 파일 접근 오류로 중단됐지만, 생성 파일을
확인한 뒤 같은 명령을 다시 실행해 성공했습니다. `npm run typecheck`,
package 테스트 48/48, `npm run registry:release-check`가 통과했습니다.
새 snapshot의 공개 배포·소비자 설치는 아직 확인하지 않았습니다.

기존 공개 snapshot 안의 고지는 여전히 당시의 `main` 링크를 포함합니다.
불변 파일을 바꾸지 않고 그 버전의 출처를 고정해 찾아볼 수 있는 방법과
rollback 시 snapshot URL 보존은 남은 공급 과제입니다. 따라서 component
89개·registry item 91개, 공급·품질 조건 5/10, goal의 관리용 추정
약 70%는 유지합니다.
