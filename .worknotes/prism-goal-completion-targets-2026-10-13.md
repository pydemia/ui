# PRISM goal 완료 판정 범위 (2026-10-13)

구현 목표는 **독립 설치·검증 가능한 UI 컴포넌트 그룹 58개**로 고정한다. 기준 원본은 `prism/frontend`의 `dev` `2eeb26ff10274745f9d86897c2f2828bff002b98`이다. 목표 수는 원본 TSX 파일 수나 React export 수가 아니라, `pydemia/ui`의 PRISM catalog/registry에서 소비자가 독립적으로 설치하고 기능 목적별로 검증할 수 있는 단위의 수다. 한 그룹에 여러 원본 UI가 대응하면 그 UI의 목적과 필요한 상태를 모두 확인해야 그룹 하나를 완료로 센다.

산정: 원본 `components`/`layouts` TSX 275개 중 벡터 자산 88개를 제외한 비벡터 187개는 primary 그룹 50개에 대응한다. `PrismProfileHtmlExport` 1개와 별도 기능 그룹 7개를 더해 58개다. `prism-icon`은 88개 벡터 자산을 공급하는 필수 지원 그룹이고 디자인 토큰도 필수지만, 둘 다 58개 분모에서는 제외한다. 따라서 현재 catalog의 59개 설치 그룹과 registry의 60개 항목을 그대로 구현 완료 수로 읽지 않는다.

원본 대응 50개:

```text
prism-button                 prism-field                  prism-badge
prism-display                prism-dialog                 prism-feedback
prism-sidebar                prism-chat                   prism-candidate
prism-memo                   prism-panel                  prism-six-frame
prism-selection              prism-profile                prism-content
prism-admin                  prism-export                 prism-document
prism-workspace              prism-chart                  prism-utility
prism-evaluation-history     prism-favorite-candidate     prism-record
prism-management             prism-context                prism-primitives
prism-panel-recipes          prism-position               prism-assessment
prism-collection             prism-notice                 prism-response
prism-management-tools       prism-candidate-list         prism-directory
prism-page-state             prism-domain-forms           prism-print
prism-intro                  prism-profile-sections       prism-mgmt-comments
prism-survey                 prism-attitude-report        prism-analysis
prism-position-recommendations prism-rich-text            prism-profile-print
prism-position-directory     prism-position-blocks
```

별도 기능 8개: `prism-tabs`, `prism-detail`, `prism-html-export`, `prism-detail-state`, `prism-admin-users`, `prism-position-management`, `prism-admin-lists`, `prism-chat-logs`. 이 중 HTML export 1개는 원본 프로필 출력의 추가 재사용 목표이고, 나머지 7개는 원본 파일을 단순 복제하는 것만으로 제공되지 않는 독립 사용 목적이다.

그룹별 완료 조건:

- 원본 대응표의 관련 UI 목적을 공개 props/상태/예제로 표현한다. 파일 하나에 대응표가 있다는 사실만으로 완료 처리하지 않는다. 배포 중인 UI를 디자인과 사용 목적의 기준으로 삼되, 접근성·반응형·크기 조절 또는 원본의 문제를 해결하는 변경은 이유와 결과를 기록하고 허용한다. 문제가 있는 형태까지 픽셀 단위로 재현할 필요는 없다.
- 해당 그룹에서 실제 제공하는 기본·로딩·빈 값·오류·읽기 전용·긴 내용·상호작용 등 적용 가능한 상태를 확인한다. 호스트 소유 API·권한·저장 로직의 범위는 명시하고, 의도한 디자인 일관성과 기능 목적을 배포 UI의 대표 흐름 및 독립 설치본에서 검증한다. 원본과 다른 부분은 의도한 개선인지 미구현인지 구분한다.
- 디자인 토큰, 아이콘, 글꼴, 반응형/크기 조절/dynamic sizing, 접근성, registry 설치·예제·빌드·CI/preview를 확인한다. 이는 개수에 더하지 않는 공통 완료 조건이다.
- 58개 모두 위 조건을 만족하고, 알려진 미검증·미구현 목적을 해소해야 goal 완료로 판정한다. 현재 58개가 catalog에 등록된 상태는 구현·시각 검증 완료를 뜻하지 않으므로 완료 분자와 비율은 별도 감사 전까지 발표하지 않는다.

원본에 새 독립 UI 목적이 추가되거나 배포 UI에서 현 58개로 표현할 수 없는 목적이 확인되면 대응표와 목표 수를 근거와 함께 개정한다. 원본 내부 파일 추가, 아이콘 추가, 같은 그룹의 상태 보완만으로 수를 자동 증가시키지 않는다. 현재 배포 SHA와 기준 소스 SHA의 동일성은 입증되지 않았다.

현재 진척도: 58개 대상 모두 catalog·독립 설치 모듈에 등록되어 있어 **코드·설치 항목은 58/58개**다. 그러나 기존 `verification.json`의 `partial`/`pending`은 이전의 원본 시각 일치 기준으로 작성됐으므로, 개선을 허용하는 새 완료 기준의 분자로 그대로 변환할 수 없다. 앞서 제시한 완료 확인 0/58은 철회한다. `prism-button`, `prism-badge`, `prism-field`, `prism-dialog`, `prism-feedback`, `prism-display`, `prism-candidate`를 개별 재감사해 **완료 판정 7/58개**로 기록했다. 나머지 51개는 불합격이 아니라 아직 새 기준으로 판정하지 않은 그룹이다. 그룹별로 목적·디자인 일관성·의도한 개선·대표 상태·독립 설치 증거를 계속 판정해야 한다.

사이드바 후속 감사: 최신 원본 `dev`와 기존 인증 탭의 대표 치수를 대조하고, 독립 설치본에서 초기 메뉴 상태·프로필 액션 조건·접힘 후 메뉴 재확장·320px 스크롤을 보완했다. 기존 인증 탭에는 최신 원본의 포지션 목록이 표시되지 않았으며 새 세션은 로그인 화면으로 이동했다. 현재 배포의 최신 사이드바를 다시 확인하기 전까지 `prism-sidebar`는 완료 수에 넣지 않는다.

후보자 그룹 재감사: 배포된 공개 Templates 샘플의 1·2·5·6명 카드와 원본 프로필 묶음·표 코드를 대조했다. 설치용 후보자 묶음은 인원별 배치, 패널의 3명→2명 추가·접기, 선택·즐겨찾기 의도 전달을 제공한다. 320px 카드·표 내부 스크롤과 독립 shadcn 설치를 확인했다. 좁은 3열과 긴 이름 잘림은 의도적으로 개선했다. 인증된 제품의 실제 이동·저장 결과는 소비자 영역이며 미검증이다.
