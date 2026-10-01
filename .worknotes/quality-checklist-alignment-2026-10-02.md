# 공급·품질 체크리스트 정합성 재검토

2026-10-02. 공개 기준 110개 component, 112개 registry item,
29개 snapshot입니다. goal의 관리용 추정은 약 85%로 유지합니다.
이번 작업은 판정 기준의 문서 정리이며 코드·registry·공개 산출물을
변경하거나 새 동작을 검증하지 않았습니다.

## 확인한 충돌

[반복 검사 축소](quality-criteria-simplification-2026-10-02.md)와
[로드맵 앞부분](component-roadmap.md#공급과-품질의-판정-단위)은
표준 registry item마다 새 소비자 설치를 요구하지 않습니다. 하지만
로드맵 하단의 5·6번은 깨끗한 소비자 설치와 직전 버전 갱신·충돌·
복구를 모든 구현 묶음의 완료 조건으로 적고 있었습니다. 오래된
[재조정 기록](quality-criteria-reassessment-2026-10-02.md)도
새 component마다 대표 소비자 설치를 필수로 적어 최신 기준과
달랐습니다.

실제 `Verify UI` workflow는 PR과 `main` push에서 typecheck,
UI 테스트, build, `registry:release-check`를 실행합니다.
`registry:release-check`는 `registry:check`를 포함합니다.
`check-registry.mjs`는 component source·public export·catalog·
registry item 대응, import의 의존 선언, provenance·고지,
컴파일된 source 일치, Usage 구문·설치 item 대응을 검사합니다.
이 자동 검사와 같은 설치 형식의 수동 CLI 설치를 매번 중복할
근거는 확인되지 않았습니다.

## 적용할 판정

- 새 component는 독립 사용처·동작 규칙, export·registry·출처·
  문서 preview·Usage를 갖춥니다. 참고한 upstream의 공식 문서,
  고정 revision의 source·LICENSE, 의존성·접근성은 확인합니다.
- 공개할 commit에서 typecheck·관련 테스트·build·
  `registry:release-check`를 확인합니다. 동일 commit의 CI 결과를
  다시 수동 실행할 필요는 없습니다. 변경한 동작과 표시만
  브라우저에서 확인합니다.
- 설치 형식·target·의존 경로가 새로울 때만 소비자 CLI 설치와
  typecheck·build를 필수로 합니다. 표준 경로의 개별 item 설치를
  하지 않았다면 그 항목을 미검증으로 적습니다.
- registry 내용이 바뀐 릴리스 묶음은 snapshot 검사와 공개
  manifest·변경 item URL을 한 번 확인합니다. 직전 소비자의
  갱신·충돌·복구는 전체 라이브러리 품질 작업으로 추적합니다.
- 확인된 값 손실·제출 오류·keyboard 진입 또는 탈출 불가·필수
  고지 누락·설치/build 실패는 수정판을 검증할 때까지 출시
  완료로 표시하지 않습니다. 실제 screen reader·touch·Safari·
  RTL과 rollback 뒤 snapshot URL 보존은 미검증으로 남깁니다.

로드맵 하단의 완료 조건을 이 기준에 맞췄고, 이전 판정 기록에는
현재 기준으로 연결되는 안내를 넣었습니다. 누적 10개 과제의
완료 수는 신규 component 공급률이나 goal 완료율로 사용하지
않습니다. 이번 변경으로 공급 수량이나 goal 진척도를 올리지
않습니다.

## 공개 확인

PR #47을 `main`의 `6a9056d`에 병합했습니다. PR의 Verify UI
run 36906701048과 병합 commit의 Verify UI run 36906948027은
typecheck·UI 테스트·build·`registry:release-check`를 통과했습니다.
병합 commit의 Pages run 36906945869과 Vercel 상태도 성공입니다.
이번 변경에는 제품 코드와 사이트 화면 변경이 없어 별도 브라우저
동작 검사는 적용하지 않았습니다. 110개 component·112개 item·
29개 snapshot과 goal 추정 약 85%는 그대로입니다.
