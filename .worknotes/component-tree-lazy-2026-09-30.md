# Tree 원격 하위 항목

## 구현

기존 Tree의 정적 노드 입력에 `childState`를 추가했습니다. 원격 노드는
`unloaded`·`loading`·`error` 상태 중 하나를 사용하고, 오류에는
`errorMessage`를 지정합니다. 소비자가 `onLoadChildren(id)`에서 요청과
데이터 갱신을 소유합니다. Tree는 열린 unloaded 노드를 요청하고
열린 오류 노드의 `ArrowRight` 또는 재시도 표시에서 다시 요청합니다.
로딩 중 중복 요청은 막고, 접었다 다시 펼치면 unloaded 노드를 새로
요청할 수 있습니다. 로드 후 자식·선택·focus는 기존 규칙을 따릅니다.
새 runtime 의존성은 없습니다.

W3C WAI-ARIA Tree View Pattern의 동적 노드 속성과 방향키 규칙을
참고했습니다. 구현 소스는 기존 pydemia/ui 원본이며 외부 component
소스를 복사하지 않았습니다. source·의존성과 설계 명세는
`research/source-inventory.md`와 `research/design-contract.md`에
기록했습니다.

## 검증

- `npm run typecheck` 통과. UI·profile demo·문서 TS를 확인했습니다.
- `npm test -w @pydemia/ui` 75/75 통과. 새 server render 테스트는
  대기·로딩·오류·자식 및 잘못된 상태 조합을 확인합니다.
- 로컬 Chromium에서 Remote 펼침 → loading → 실패 → `ArrowRight`
  재시도 → 완료 → `ArrowRight`로 자식 focus → Enter 선택을 확인했습니다.
  오류 표시의 pointer 재시도도 확인했습니다.
- 390px에서 문서 가로 overflow가 없었고, light/dark 오류 메시지와
  focus 표시를 화면으로 확인했습니다.

현재 registry snapshot·독립 소비자·PR CI·공개 배포는 미검증입니다.
실제 screen reader·touch·Safari·RTL과 네트워크 오류의 소비자별 처리도
미검증입니다. 이전 미공개 draft snapshot 네 디렉터리는 stage하지
않습니다.
