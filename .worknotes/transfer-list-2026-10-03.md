# TransferList 공급 기록 — 2026-10-03

구성원·권한 배정 화면에서 두 목록 사이의 일괄 이동이 반복됩니다. 기존
`MultiSelect`는 한 목록의 검색·선택에 집중하므로, 배정 전후를 함께
보여 주는 `TransferList`를 별도 Selection 항목으로 선택했습니다.
약 100개라는 수를 맞추기 위한 항목은 아닙니다.

`@pydemia/ui` export, `pyd-transfer-list` registry, provenance,
문서 Usage·live preview를 연결했습니다. 원본 구현은 native fieldset,
checkbox, button, form hidden input과 기존 `pyd-button`·`pyd-utils`만
사용합니다. MUI는 두 목록 배정 흐름의 reference로만 확인했고 해당
source나 dependency를 복사하지 않았습니다. 고정 revision의 source,
LICENSE, manifest와 W3C WAI 접근성 지침은
[source inventory](../research/source-inventory.md#2026-10-03-두-목록-배정-reference)에
기록했습니다.

## 변경 위험에 맞춘 검증

- `npm run typecheck` 통과.
- `npm test -w @pydemia/ui`: 268/268 통과. 새 테스트는 고유 값,
  잘못된 입력, disabled, 배정 순서, 일괄 이동, form 제출값을 확인합니다.
- `npm run build` 통과. 146개 registry item을 생성했습니다.
- `npm run registry:snapshot`과 `registry:release-check` 통과.
  76번째 snapshot 후보에 146개 item을 담고 현재 빌드와 대조했습니다.
- `npm run prism:check`: 32/32 통과. 기존 PRISM 경로에 영향이
  없는지 확인했습니다.
- 로컬 Chromium에서 Space 선택, Enter 추가·제거, disabled 항목,
  `sora, june` form 제출, `Panel`·`Plain` 전환을 확인했습니다.
  390px에서는 두 목록이 세로로 놓이고 문서 폭이 viewport를
  넘지 않았으며 다크 테마도 표시했습니다.

현행 [공급·품질 판정](quality-checklist-decision-2026-10-03.md)을
적용했습니다. form·키보드·반응형 경로에 필요한 증거만 위와 같이
확인했습니다. 모든 browser·theme·폭의 조합, component별 격리 소비자
설치, PR·main·production에서 같은 수동 조작의 반복은 요구하지
않았습니다. 새 설치 형식이나 의존 경로는 없습니다.

실제 screen reader 발표, touch, Safari, RTL은 실행하지 않았습니다.
Goal 관리용 추정은 약 99%이며 Instant Rollback 후 불변 URL
보존은 여전히 별도 미검증 항목입니다.

## 공개 공급

PR #142의 Verify UI `37111819271`, 병합 commit `d1938377`의
Verify UI `37112046324`와 Pages `37112045839`가 성공했습니다.
Vercel production 배포 `dpl_FLqymHxGjLdwvi92c2RtisfHvTyo`는
READY입니다. `ui.pydemia.ai`의 HTML은 새
`assets/index-CQEgDUp_.js`를 참조합니다. 현재
`/r/pyd-transfer-list.json`과 76번째 snapshot
`sha256-6dc931cf4f48322a91355a9fc5f11a3c9b37878b8c73b60f197f43426d9a6ac5`
manifest는 HTTP 200이고 manifest의 `itemCount`는 146입니다.
공개 사이트의 키보드·form 동작은 로컬 검사를 반복하지 않았습니다.
