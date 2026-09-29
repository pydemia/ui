# 공개 registry 소비자 갱신·충돌 복구 검사

2026-09-29. 공개 `https://pydemia-ui.vercel.app/r/registry.json`은
40개 item을 반환했고, 현재 작업 트리는 91개 item입니다. 새 내용 해시
snapshot의 공개 manifest URL은 HTTP 404이므로 이 검사는 공개 구버전
URL과 로컬 신규 `/r/` URL을 사용했습니다. CLI는 `shadcn@4.21.0`으로
고정했습니다. [CLI 문서](https://ui.shadcn.com/docs/cli)의 `--diff`와
`--overwrite` 범위를 확인했습니다.

`pydemia-ui-registry-upgrade-20260929` 임시 소비자에서 공개 `Button`과
`Badge`를 설치해 typecheck·build를 통과했습니다. `Badge`의 기존
`rounded-sm`을 소비자가 `rounded-full`로 바꾼 뒤 로컬 신규 item을
추가했습니다. 덮어쓰기를 거절하면 수정본은 남지만 새 `variant` API는
들어오지 않았습니다. `--overwrite`는 새 코드를 설치하고 소비자 수정을
지웠습니다. 백업된 한 줄을 새 소스에 다시 적용하자 새 `danger` variant와
사용자 radius가 함께 typecheck·build를 통과했습니다. Chromium에서는
Badge가 표시되고 `borderRadius`가 원형으로 계산됐으며 console error는
0건이었습니다. `--diff`는 재적용해야 할 radius 한 줄을 표시했습니다.
같은 fixture의 `Button`도 수정 파일 보존·명시적 덮어쓰기 동작을
확인했습니다.

별도 `pydemia-ui-registry-full-upgrade-20260929` 소비자에는 현재 공개
40개 item을 한 번에 설치했습니다. 설치 직후 typecheck·build가
통과했습니다. 현재 91개 item의 내부 의존성 URL을 로컬로 지정해
빌드한 뒤 이 소비자에 `--overwrite`로 동시 갱신했습니다. 결과 파일
93개는 현재 생성 JSON의 93개 고유 파일 내용과 모두 일치했고
typecheck·전체 모듈 build가 통과했습니다. Chromium에서 값 export
210개를 로드했고 console error는 0건이었습니다. 검사 후 기본 공개
의존성 URL로 다시 빌드했으며 저장소 `registry:check`가 통과했습니다.

두 fixture는 각각 아래 경로에 있습니다.

- `C:\Users\pydemia\AppData\Local\Temp\pydemia-ui-registry-upgrade-20260929`
- `C:\Users\pydemia\AppData\Local\Temp\pydemia-ui-registry-full-upgrade-20260929`

이 결과는 직전 공개 registry를 설치한 소비자의 갱신과 수정 파일
충돌·재적용 경로를 확인합니다. 모든 제품별 소비자 수정의 자동 병합을
뜻하지 않습니다. 현재 내용 해시 snapshot의 공개 URL 설치와 과거
snapshot 장기 보존, 실제 screen reader·touch는 아직 검증하지 않았습니다.
