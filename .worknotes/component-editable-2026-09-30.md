# Editable 편입

2026-09-30. goal은 완료되지 않았습니다. 101개 component라는 규모보다
사용 가능한 입력 흐름과 검증 공백을 우선합니다. 이름·설정값의 인라인
수정은 기존 `Input`·`Field`가 소유하지 않는 보기/편집 전환, 저장·취소,
실패 후 초안 보존이 필요해 별도 component로 판정했습니다.

값·저장 결과는 소비자가 소유합니다. `Editable`은 편집 초안, 유효성
오류, 비동기 대기와 포커스를 관리합니다. 내부 form을 만들지 않아
상위 form 안에서도 사용할 수 있습니다. Enter/저장, Escape/취소,
필수값·사용자 검사와 저장 실패 후 재시도를 수용 조건으로 둡니다.

Chakra UI 공식 Editable 문서와 revision
`961161428b8c59157ad921dd23303b73c294d73f`의 source, package
manifest, MIT LICENSE를 확인했습니다. 원본 코드는 복사하지 않았고
기존 `Button`, `Input`, token만 사용합니다. 세부 출처는
`research/source-inventory.md`에 있습니다.

## 검증 상태

- `npm run typecheck`, 패키지 테스트 98/98, `npm run build` 통과.
- 로컬 Chromium에서 필수값·사용자 검사, 실패 후 초안 유지·재시도,
  Enter/Escape와 편집 버튼 포커스 복귀를 확인했습니다. 390px dark 화면의
  body 너비 390px이며 component가 화면 안에 표시됩니다.
- registry/snapshot 검사와 격리 소비자 설치·브라우저: 대기.
- 공개 배포·실제 screen reader·touch·Safari·RTL: 미검증.
