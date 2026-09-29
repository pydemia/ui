# AvatarGroup 추가

2026-09-29 로컬 작업 트리. 여러 사람의 아바타와 남은 인원을 한 줄에
표시하는 반복 용례를 기존 `Avatar` 조합으로 구현했습니다. 목록의
접근성 이름, 각 사람의 이름, 가려진 사람의 이름을 제공합니다.

## 구현

- `members`는 고유 `id`, `name`, `fallback`, 선택적 `src`를 받습니다.
  `maxVisible`의 기본값은 4이고 1 이상의 안전한 정수만 허용합니다.
- `size`는 `sm`과 `default`입니다. 빈 목록에는 `emptyText`를
  표시합니다. 남은 사람은 `+N`으로 요약하고 `overflowLabel`을
  지정하지 않으면 이름을 포함한 기본 접근성 이름을 만듭니다.
- 기존 `Avatar`와 공통 token을 사용합니다. 외부 component 코드를
  복사하지 않았고 새 npm dependency도 추가하지 않았습니다.
- public export, `pyd-avatar-group` registry item, provenance, 문서의
  동작하는 preview와 사용 코드를 추가했습니다. registry 직접 의존성은
  `pyd-avatar`, `pyd-utils`입니다.

## 검증

- `npm test -w @pydemia/ui`: 21개 검사 통과. 새 검사 3개는 남은 인원,
  빈 목록, 잘못된 설정을 다룹니다.
- `npm run typecheck`, `npm run build`, `npm run registry:check` 통과.
  빌드 결과에는 85개 registry item이 있으며 기본 공개 URL로 복원했습니다.
- 로컬 문서 Chromium에서 3명 표시·2명 요약, 5명 전체 표시, 빈 목록,
  작은 크기, 어두운 모드와 console error 0건을 확인했습니다.
- 별도 소비자
  `C:\Users\pydemia\AppData\Local\Temp\pydemia-ui-avatar-group-consumer-20260929`
  에 `shadcn@4.0.0`으로 group·Avatar·utils·tokens·MIT 고지를 설치했습니다.
  설치 파일 5개의 내용은 원본과 일치했습니다. 소비자 typecheck, build,
  production audit(high 이상 0건)와 Chromium의 목록 이름·남은 인원·
  빈 상태를 확인했습니다. package manifest와 LICENSE에서 설치된
  `@radix-ui/react-avatar@1.2.6`의 MIT 조건을 확인했습니다.
- 현재 tarball을 설치한 소비자에서 문서 사용 코드 83개를 typecheck했습니다.

## 미검증

실제 screen reader 발표, 이미지 요청 실패 후 fallback, touch, RTL,
좁은 viewport, 다른 브라우저, 85개 item 전체 동시 재설치, 공개 배포,
기존 소비자 파일과의 갱신 충돌은 확인하지 않았습니다. 이전 84개 item
동시 설치 결과를 새 85개 결과로 간주하지 않습니다.
