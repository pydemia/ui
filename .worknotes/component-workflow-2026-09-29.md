# Stepper·Timeline 구현과 검증

2026-09-29. `Workflow` 범주에 순서가 있는 작업 진행과 활동 기록을
추가했습니다. 둘 다 `@pydemia/ui`에서 직접 작성한 React/Tailwind
구현이며, 외부 component source를 복사하지 않았습니다. 새 npm
dependency는 없습니다. 두 registry item은 기존 `pyd-utils`만
참조합니다.

`Stepper`는 현재 index와 완료·오류 id를 호출자가 소유합니다.
`completedStepIds`를 생략하면 현재 단계보다 앞선 단계를 완료로
표시하고, 전달하면 이전 단계로 돌아가도 완료 상태를 유지합니다.
`navigation`은 `none`, `completed`, `all` 중에서 고르며, 이동할 수
있는 단계만 native button입니다. 오류가 있는 이전 단계는
`completed` 정책에서도 다시 열 수 있습니다. 현재 단계에는
`aria-current="step"`을 지정하고 상태를 텍스트로 표시합니다.

`Timeline`은 전달된 순서를 유지합니다. `dateTime`이 있으면
`<time>`으로 기계 판독 가능한 시간을 제공하고, 없으면 표시용
문자열만 보여줍니다. 상태는 색상과 함께 텍스트로 표시합니다.
빈 배열은 상태 메시지로 표시합니다.

참고한 공식 문서는
[W3C ARIA26](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA26)과
[WHATWG time 요소](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-time-element)입니다.
문서 사이트에는 실제 component로 동작하는 preview와 사용 코드를
추가했습니다.

## 검증

- `npm run typecheck`: 통과.
- 로컬 URL로 `npm run registry:build`: 60개 item 생성.
- 별도 Vite 소비자에 `shadcn add`로 두 item 설치: 통과.
- 소비자 fixture에서 두 component를 import·render하고
  `npm run typecheck`, `npm run build`: 통과.
- SSR 경계값: 잘못된 index, 중복·미확인·모순 id, callback 누락,
  Timeline 중복·빈 상태 label을 거부하고 유효한 현재 단계와
  `<time>`을 렌더링하는 것을 확인.
- Chromium 문서 preview: 완료 단계로 Enter 이동, 완료 상태 유지,
  오류 단계 재진입과 다음 단계 비활성화, 세로 배치,
  Timeline의 시간·상태·빈 상태를 확인.

최종 `npm run build`와 `npm run registry:check`도 통과했습니다.
생성된 registry는 공개 기본 URL을 가리키며 로컬 URL이 남지
않았습니다. 검사 결과는 `research/verification.md`에도 기록했습니다.
실제 screen reader 발표, touch, RTL과 공개 배포는 검증하지
않았습니다. 소비자 검사는 기존
fixture를 재사용했으며 전체 item의 새 프로젝트 설치는 실행하지
않았습니다.
