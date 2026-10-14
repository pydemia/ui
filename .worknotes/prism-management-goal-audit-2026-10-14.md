# prism-management 목표 수용 감사 (2026-10-14)

현재 원본 프런트엔드 `2eeb26ff10274745f9d86897c2f2828bff002b98`의 회사 그룹·사용자·공지·포지션 관리 양식, AI 설명 생성 버튼, 기준 목록 및 영향 포지션 표시를 대조했다. 이 그룹은 필드 schema와 controlled values를 받는 범용 양식 및 보조 구성요소다. 회사 그룹·사용자·공지·포지션의 고유 필드와 업무 검증은 `prism-domain-forms`, 기준 삭제·재매핑은 `prism-management-tools`의 범위로 유지한다. 실제 저장·생성·조회·권한 판단은 호스트 callback과 API가 담당한다.

기존 320px 사용자 양식의 두 열은 각각 약 121px라 레이블과 선택 필드가 읽기 어려웠다. 부모 폭 520px 이하에서는 한 열로 바꿔 로컬 320px 화면의 필드 폭을 약 254px로 확보했다. 1280px에서는 두 열을 유지한다. 원본의 좁은 화면 문제를 그대로 재현하지 않는 의도한 개선이다. 필수 다중 선택과 날짜에 `*`, 스크린리더의 `필수`, `aria-required`를 연결했다. 읽기 전용·저장 중 데모에서는 AI 생성과 기준 변경 callback을 제공하지 않는다.

필수 다중 선택·날짜가 비었을 때 오류를 내고 제출을 막는지, 입력 후 controlled draft를 전달하는지, AI 버튼이 form submit을 일으키지 않는지, busy/readOnly가 저장을 막는지 대상 테스트로 확인했다. 로컬 브라우저에서 default/readonly/loading/error와 320/1280px, 회사 미선택 오류와 선택 후 저장 의도, readonly/loading의 액션 차단을 확인했다.

새 외부 소비자에 현재 레지스트리의 `prism-management`와 토큰을 shadcn CLI로 설치했다. 설치된 PRISM TSX 16개와 CSS는 레지스트리 원문과 일치하며 완전 사용 예제 TypeScript 검사와 Vite/Pretendard 빌드가 통과했다. 소비자 브라우저 320px에서 문서 폭 320px, 필드 폭 286px, 필수 ARIA, AI 생성 의도, 기준 추가, 영향 포지션 표, 두 필수 오류, 선택·날짜 입력 후 저장 의도를 확인했다. 이 예제는 합성 데이터와 로컬 상태를 사용한다.

인증된 배포 관리자 페이지의 revision·화소 비교와 실제 API 저장·AI 생성·영향 조회·RBAC는 검증하지 못했다. 배포 UI는 목적과 대표 형태의 기준이며 읽기 어렵거나 접근성이 부족한 형태까지 똑같이 복제할 필요는 없다는 사용자 지침을 적용했다. 목적·대표 상태·개선·독립 설치·브라우저 사용을 확인해 `prism-management`를 **52/58번째 완료 그룹**으로 판정한다. 미판정은 `prism-document`, `prism-export`, `prism-html-export`, `prism-print`, `prism-profile-print`, `prism-record` 6개다.

전체 `npm run build`, `npm run prism:check`(360/360 테스트, 완전 사용 예제 50개 타입 검사), `npm run typecheck`, `npm run registry:release-check`가 통과했다. PR/preview readback 결과는 게시 후 이 문서에 덧붙인다.

## 게시 후 검증

커밋 `767d3626921773f54908e3b94e4fbe8122c2a955`를 기존 초안 PR #162에 push했다. PR head와 본문의 52/58 판정을 다시 읽어 일치함을 확인했다. Verify UI run `38510341320`은 completed/success였고 사이트 빌드·PRISM 계약·레지스트리·`docs/` 생성물 검사를 통과했다. 같은 SHA의 Preview 배포 `7056673887`도 success였다. 보호된 preview에서 인증된 `vc curl`로 `components.json`, `llms.txt`, `verification.json`, 관리·선택·토큰 item, registry 7개를 읽어 로컬 `docs/` 생성물과 바이트 단위로 비교했다. 실제 인증된 PRISM 관리자 API·권한·AI 결과는 계속 미검증이다.

이 게시 후 기록은 다음 소스 변경과 함께 커밋할 로컬 작업 기록 변경이다.
