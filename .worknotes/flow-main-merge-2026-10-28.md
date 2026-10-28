# Flow 브랜치 main 병합 (2026-10-28)

## 요청과 기준

- 사용자가 `codex/flow-ui-2026-10-27`을 `main`에도 합치도록 요청했다.
- Flow 브랜치 `02d195bb8e61bf221f2d016291626505bcbecebc`는 원격에 push되어 있고 검증 완료 상태다.
- 최신 `origin/main`은 `29be466553d187605d0fcbfb15ed7e0474ec1be4`로 Flow 분기 이후 ColorPicker 관련 6개 커밋이 있다.
- 원격 main registry는 149개, Flow 브랜치는 154개, 원래 공유 작업 폴더는 미커밋 작업을 포함해 183개다. 원래 작업 폴더의 미커밋 변경은 건드리지 않는다.

## 계획

1. 최신 main에서 통합 브랜치를 만들어 Flow 커밋을 병합한다.
2. 충돌이 있으면 ColorPicker와 Flow가 모두 남도록 소스·registry를 해결하고 생성물을 재생성한다.
3. 현재 통합 revision의 타입·테스트·빌드·registry 검사를 수행한다.
4. `origin/main`이 그대로인지 확인하고 fast-forward push한다. 원격 SHA와 운영 배포 영향을 확인한다.

## 현재 상태

최신 main fetch 및 기준점 확인 완료. 통합 작업 시작 전이다.

`codex/flow-main-merge-2026-10-28`을 최신 `origin/main`에서 만들고
Flow 브랜치 병합을 시작했다. 소스·registry는 자동 병합됐으며
`registry.json`, `registry/provenance.json`, `docs/r/registry.json`은
모두 155개 항목이다. 충돌은 `docs/`의 생성 HTML·해시 자산에만 발생했다.
통합 소스에서 공식 빌드를 실행해 정적 파일을 재생성한다.

재생성한 정적 파일로 merge 충돌을 모두 해결했다(`git ls-files -u`가 비어 있음).
`npm ci`, `npm run build`, `npm run typecheck`가 통과했다. UI 테스트 320개,
docs 테스트 15개가 모두 통과했고 `npm run registry:check`는 155개 항목,
151개 컴포넌트 export/catalog, 기존 불변 릴리스 107개를 확인했다.
통합 registry의 새 불변 릴리스
`sha256-d6b3efddae62a97cbacef9cca101279d4ca0d0f4effcfdd8024329918d02c6a3`
를 생성했다. 이 릴리스를 `docs/r/releases`에도 포함하기 위한 최종 빌드를
실행 중이다.

최종 빌드와 `npm run registry:release-check`가 통과했다. 현재 생성물은
`sha256-d6b3efddae62a97cbacef9cca101279d4ca0d0f4effcfdd8024329918d02c6a3`
릴리스와 일치한다. 로컬 브라우저에서 `/flows/` GNB와 노드 추가(5→6),
`?component=color-picker`의 카탈로그 표시와 색상 선택(`#ba365b`→`#237f98`)
을 확인했다. 다음은 staged diff·원격 main을 다시 점검하고 merge commit을
만들어 fast-forward push하는 단계다.

관찰 범위: ColorPicker 선택 값은 정상 갱신됐으나, 같은 페이지의 별도
`Registry review` iframe은 로컬 미리보기에서 “예시의 디자인 적용을 확인하지
못했습니다” 상태를 표시했다. 이 병합에서 수정한 영역이 아니며 운영 상태는
push 후 별도로 확인한다. favicon 참조는 생성된 `docs/index.html`과
`docs/flows/index.html`에서 유지됐다.
