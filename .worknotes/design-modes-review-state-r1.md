# Design modes r1 — 구현·통합 독립 검토

검토자는 상태, 수명, URL/storage와 profile 메시지 책임을 맡았다.
검토 기준은 `.worknotes/browser-evidence/design-modes-review-r1`이며
base HEAD는 `288b0838aec424f7c83686f3d3b00677d749fa4b`다.
라이브 소스와 다른 reviewer 보고서는 읽지 않았다. manifest의 288개 파일
SHA-256을 모두 다시 계산했고 전부 일치했다. 개별 hash는
`browser-evidence/review-state-r1/hash-verification.json`에 보존했다.

적용 Skill: persona-cross-review, software-engineering,
pydemia-coding-style 및 dictionary/design 참조. root AGENTS.md를 읽었다.
router 추천·생성 요청은 부모가 제공한 gpt-6-astra/low이며 실제 실행
metadata는 unavailable이다. 재위임은 하지 않았다.

## STATE-01 — profile 내부 밝기 변경 후 동기화 상태가 사실과 달라짐

판정: 확인된 동작 불일치, P2, W08 통합 완료 전에 처리.
W08 전체가 완료됐다는 판단이나 배포 차단 판정은 아니다.

r1 위치:
- `apps/profile-demo/src/main.tsx:60`: 내부 밝기 버튼은 revision을 null로
  바꾸지만 부모에게 변경 또는 동기화 해제를 알리지 않는다.
- `apps/profile-demo/src/main.tsx:113`: 동일 revision 재전송은 현재 DOM에
  같은 revision이 적용된 경우에만 ack하고 나머지는 적용하지 않는다.
- `apps/docs/src/theme/profile-bridge.ts:29`: send/retry는 현재 controller
  revision을 그대로 재사용한다.
- `apps/docs/src/theme/profile-bridge.ts:45` 및
  `apps/docs/src/main.tsx:491`: 부모의 applied 표시가 그대로 유지된다.

조건과 영향: 부모 Light revision 0 적용과 ack → iframe 내부 Dark 버튼
클릭 → iframe은 Dark지만 부모는 계속 현재 디자인이 적용됐다고 표시한다.
동일 revision을 send로 재연결해도 receiver가 적용·ack하지 않아
unavailable로 끝난다. 내부 밝기 변경이 허용된다면 부모의 확인 상태를
무효화하고 다시 동기화할 경로가 필요하다.

실행 증거: exact r1 profile 엔트리를 esbuild로 별도 번들하고 JSDOM에서
렌더링했다. 메시지는 같은 origin/source로 dispatch하고 postMessage를
관측했다. 출력은 다음과 같다.

```text
after initial light [ { type: 'pydemia-ui-theme-applied', version: 1, revision: 0 } ]
after local toggle dark
after same-revision reconnect dark []
```

반증: 기존 origin/source/version 검사와 최신 revision 동기식 갱신은
적절하다. 동일 payload retry도 DOM 적용 확인 후에만 ack하는 보호가
있다. 부모에서 실제 설정을 다시 바꾸면 revision이 증가해 복구된다.
따라서 일반적인 연속 디자인 변경 실패나 stale-message 회귀라고
보고하지 않는다. 문제는 로컬 변경의 표시와 재연결 경로다.

최소 수정: embedded profile의 밝기 변경을 부모 controller 요청으로
보내 하나의 revision 경로를 사용하거나, 로컬 변경을 통지해 applied를
해제하고 명시 재연결에 새 transport revision을 부여한다. standalone
밝기 버튼은 유지한다. 동일 revision 검사를 느슨하게 푸는 방식은 피한다.

수용 사례: Light 동기화 후 profile 내부 Dark 조작 시 부모/iframe이
같은 설정을 갖거나 독립 상태가 정확하게 표시돼야 한다. 재연결은
입력·필터를 보존하며 최신 설정을 적용하고 새 ack로 applied가 돼야 한다.
늦은 이전 ack와 다른 source/origin은 계속 거부해야 한다.

## STATE-02 — 저장 프로필이 있는 후보의 미리보기와 적용 결과 차이

판정: 코드에서 확인한 차이, 제품 동작 의도에 대한 추론/추가 검증.
현재 필수 수정 결함으로 확정하지 않는다.

r1 `apps/docs/src/components/design-mode-picker.tsx:51-54`는 다른 디자인
후보를 항상 design palette/빈 override로 표시한다. 반면
`apps/docs/src/theme/controller.ts:86`은 저장한 해당 디자인의 palette와
색상 override를 복원한다. 예를 들어 Swiss/Ocean/custom accent 저장 후
Basic으로 이동해 Swiss 후보를 보면 기본색이지만 적용하면 Ocean과
custom accent가 돌아온다. 두 경로 모두 각각 명시된 동작 목적은 있다.

판정에 필요한 사항: 상세가 기본 디자인 견본임을 명확히 표시할지,
적용될 저장 프로필을 미리 표시할지 정해야 한다. 저장 프로필 복원은
명시된 요구이므로 이를 없애는 수정은 부적절하다. 후보 preview에
controller의 순수 resolveCommitPreview 경로를 제공하거나 복원 안내를
표시하면 차이를 설명할 수 있다. 이 시나리오의 실제 브라우저 검증은
수행하지 않았다.

## 읽은 범위와 제외한 의심

goal, implementation-plan, contract와 manifest를 읽었다. 핵심 소스는
foundation의 design-modes/settings/theme-dom/theme-scope/portal-scope/
theme-messages, docs controller/storage/profile-bridge/main/picker/preview,
profile main/profile-qa, Dialog wrapper다. theme-scope 및 controller
테스트도 읽었으나 테스트 내용을 실제 통과 결과로 세지 않았다.
styles.css와 관련 식별자는 검색했다. 전체 288개 파일 내용의 완전한
수동 검토를 의미하지 않는다.

- 디자인 변경 replaceState는 계획에 명시됐다. pushState 미사용을
  결함으로 세지 않았다. component navigation은 별도 history 역할이다.
- bare entry와 explicit URL은 storage 자동 복원 없이 parser를 사용한다.
- profile source/origin/version/strict revision과 DOM 적용 이후 ack 보호가 있다.
- portal host와 scope는 테마별 key 없이 안정된 state/ref를 사용한다.
  열린 Dialog의 identity와 hydration에 대한 기존 테스트가 있으나 이번
  검토에서 해당 테스트를 실행한 것은 아니다.
- PRISM 분기는 bootstrap 적용 전에 있으며 PRISM의 디자인 변경은
  요청 범위가 아니다. PRISM 시각 회귀를 여기서 인증하지 않는다.
- 미출시 20개/consumer/배포의 미완료를 현재 기능 결함으로 세지 않았다.

## 실제 실행과 한계

실행한 명령:

```text
node .worknotes/browser-evidence/review-state-r1/build.mjs
node .worknotes/browser-evidence/review-state-r1/repro.mjs
```

build는 snapshot UI index를 명시 alias로 사용했고 CSS는 empty loader,
React와 Radix 등 의존성은 root node_modules를 사용했다. 공유 dist를
읽거나 쓰지 않았다. 첫 repro는 requestAnimationFrame global 누락으로
실패했다. JSDOM의 requestAnimationFrame/cancelAnimationFrame을 연결한
두 번째 실행은 exit 0이며 위 결과를 얻었다. 이것은 DOM/message 재현이고
실제 iframe 전송·CSS·브라우저 시각·전체 앱 통과 인증이 아니다.

소스 수정, shared build/test, Git, 배포는 수행하지 않았다. 결과와
재현 파일을 보존했으며 쓰기 소유권을 해제한다. 부모가 STATE-01을
교차 검증하고 W08 수용 기준에 반영할 수 있다.
