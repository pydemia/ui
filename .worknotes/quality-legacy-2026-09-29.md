# 2026-09-29 라이브러리 전체 운영·품질 조사 기록

아래 체크박스는 2026-09-29부터 쌓인 조사 기록입니다. 항목마다
범위와 종료 시점이 달라 완료 개수를 릴리스 승인이나 goal 완료율로
사용하지 않습니다. 본문에 남은 `현재 90개` 같은 수치는 당시 조사
시점의 기록입니다. 현재 릴리스에는
[로드맵의 적용 기준](component-roadmap.md#공급과-품질의-판정-단위)을
씁니다.

- [ ] component의 public export와 registry item,
  provenance, 문서 예시가 서로 일치하는지 확인하고 변경을 검토
  가능한 단위로 정리합니다. 현재 90개 component 모듈·public export·
  registry·catalog ID의 1:1 대응을 `registry:check`에 넣고
  통과했습니다. `AvatarGroup`과 `ButtonGroup`은 각각 별도 설치했고
  provenance 92개도 검사했습니다. 직전 사용 코드 89개는 tarball
  소비자와 registry 소스 경로에서 각각 typecheck했습니다.
  확장안을 기능·문서·생성 산출물의 세 커밋으로 정리하고 깨끗한
  체크아웃의 build·typecheck·테스트·registry 검사를 통과했습니다.
  [릴리스 검토 기록](component-release-review-2026-09-29.md)에 범위를
  남겼습니다. 이후 독립 검토에서 문서 설치 명령과 Usage의 불일치,
  차트 극단값·행 이름, 배포 rollback 시 snapshot 주소 손실 가능성을
  확인했습니다. [후속 검토](component-followup-review-2026-09-29.md)의
  미완료 항목을 닫은 뒤 완료 처리합니다.
  DataTable의 390px 열 압축은 표 내부 가로 scroll로 수정했습니다.
  [검증 기록](component-data-table-responsive-2026-09-29.md)에 범위가
  있습니다.
- [x] 별도 소비자 프로젝트에서 현재 92개 registry item을
  `shadcn@4.21.0 add`로 설치했습니다. token·MIT 고지를 포함한
  94개 파일이 생성된 JSON 내용과 일치했고 90개 모듈의 typecheck·
  build·Chromium 로딩(212개 값 export, console error 0건)을 확인했습니다.
  직전 사용 코드 89개의 package·registry 직접 import typecheck도
  수행했습니다. 새 Markdown 사용 코드는 별도 package tarball
  소비자에서 typecheck했습니다.
  새 `CitationList` item도 별도 빈 소비자에 설치해 확인했습니다.
  개별 item 전체의 격리 설치와 상호작용 검사도 남았습니다.
- [ ] 기존 35개에서 남은 미검증 항목 중 실제 사용에 영향을 주는 상호작용을
  우선 재검사합니다. Dropzone의 drag·거부 조건, Calendar의 범위·시간대,
  Slider의 다중 thumb·터치, Avatar 이미지 fallback을 포함합니다.
  파일 선택의 형식·크기·개수 거부, 기간의 부분·완료 선택, 다중 thumb의
  키보드 변경, 이미지 로드·fallback은 Chromium에서 확인했습니다.
  실제 파일 drag/drop·touch·다른 호스트 시간대·screen reader 검사가
  남아 있어 완료 처리하지 않았습니다.
  [재검사 기록](component-foundation-interactions-2026-09-29.md)에
  범위를 구분했습니다.
- [ ] keyboard·focus·이름/상태 발표를 실제 보조기술로 점검할 대상과
  브라우저 범위를 정하고 결과를 `verification.md`에 기록합니다.
- [ ] registry item을 소비자가 재현 가능하게 설치할 수 있도록 버전 고정,
  변경 기록, 호환성 확인, 회귀 검사와 릴리스 절차를 마련합니다. 현재
  `@pydemia/ui`는 private workspace package이므로 npm 게시를 전제로
  계획하지 않습니다. 내용 해시 snapshot과 변조 회귀 검사, 직전 공개
  버전 소비자의 갱신 시험을 추가했습니다. `CHANGELOG.md`의 미공개
  변경 기록과 `registry:release-check`의 로컬 릴리스 검사도 마련했습니다.
  PR·`main` push의 CI workflow에 typecheck·테스트·빌드·현재 snapshot·
  생성 파일 검사도 추가했고 PR #1의 원격 실행이 통과했습니다.
  PR #1의 `main` 병합, production 배포와 공개 URL 설치는 확인했습니다.
  독립 검토에서 발견한 문서 설치 명령·rollback·provenance 문제는
  [후속 검토](component-followup-review-2026-09-29.md)에 기록했습니다.
  새 고지는 provenance의 commit·SHA-256을 고정합니다. 과거
  snapshot의 `main` 링크와 rollback 문제는 남아 있습니다.
- [ ] 릴리스마다 component JSON, `registryDependencies`, token을 같은
  식별자로 묶고 불변 주소를 보존합니다. 현재 91개 item의 로컬
  `sha256-48f182bbf4fafa4e209bb89acebf7e77b722f6aac842e1a3c90d974399d9ac93`
  snapshot과 `docs/r/releases/` 복사본을 검사했습니다. `/r/`은 최신
  경로로 유지합니다. production에서 현재·이전 snapshot의 manifest와
  Button JSON을 내려받아 저장소 파일과 해시를 비교했고 두 ID의
  item을 각각 새 소비자에 설치해 typecheck·build를 확인했습니다.
  이전 배포로 Instant Rollback하면 새 snapshot 파일이 배포에서 빠져
  주소가 404가 될 수 있습니다. rollback 복구 절차 또는 별도 보존
  저장소를 마련해야 완료입니다. 장기간의 URL 보존과 모든 item의
  개별 공개 설치도 미검증입니다.
  [배포 기록](component-production-release-2026-09-29.md)을 참고하세요.
- [x] `pyd-tokens` item으로 token stylesheet를 전달하고 소비자 CSS에서
  import하는 절차를 별도 Vite 프로젝트에서 검증했습니다.
- [x] 복사·수정한 shadcn/ui source 27개 item을 각각 새 소비자에
  `shadcn@4.21.0 add`로 설치했습니다. 각 설치물의 component 소스와
  `SHADCN_UI_LICENSE.md`가 저장소 원본과 일치했습니다. npm 의존성의
  별도 license와 실제 상호작용·접근성 검사는 이 항목의 범위가 아닙니다.
  [검증 기록](component-license-notice-individual-2026-09-29.md)에
  대상과 방법을 남겼습니다.
- [x] 직전 공개 40개 item을 설치한 소비자를 현재 91개 item으로
  갱신했습니다. 93개 파일 일치·typecheck·전체 모듈 build·Chromium
  로딩을 확인했습니다. 수정한 Badge·Button의 기본 설치는 파일을
  보존하고, 명시적 덮어쓰기는 수정을 지웠습니다. Badge의 수정 한 줄을
  새 소스에 재적용해 typecheck·build·브라우저 표시를 확인했습니다.
  [충돌·복구 기록](component-registry-upgrade-2026-09-29.md)에 범위가
  있습니다. 제품별 변경의 자동 병합을 제공한다는 뜻은 아닙니다.
- [x] private package의 `@pydemia/ui` 경로와 registry 설치 파일별
  import 경로를 구분했습니다. catalog 사용 코드 89개를 현재 package
  tarball 소비자와 직접 설치한 registry 소스 소비자에서 각각
  typecheck했습니다. README와 문서 설치 안내에 경로 차이를
  명시했습니다. 개별 preview의 브라우저 동작 검사는 별도 범위입니다.
