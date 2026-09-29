# ButtonGroup 추가

2026-09-29 로컬 작업 트리. 여러 작업 버튼의 경계와 간격을 반복해서
조정하던 사용처를 묶었습니다. 각 버튼은 독립된 작업을 실행하며,
선택 상태를 관리하는 `ToggleGroup`과는 역할이 다릅니다.

## 구현

- 필수 `label`을 가진 `role="group"` 안에 기존 `Button`을 배치합니다.
  `orientation`은 `horizontal`(기본) 또는 `vertical`입니다.
- 직접 자식인 native button의 맞닿은 모서리와 테두리를 연결합니다.
  focus가 있는 버튼은 위에 표시해 초점선을 가리지 않습니다.
  `ButtonGroupSeparator`는 장식 요소로 보조기술에서 숨깁니다.
- 버튼의 click·disabled·Tab·Enter/Space 동작은 각 `Button`이
  소유합니다. 그룹은 값이나 선택 상태를 저장하지 않습니다.
- 공통 색상·크기 token을 재사용합니다. 새 npm dependency는 없고
  registry 직접 의존성은 `pyd-button`, `pyd-utils`입니다.
- public export, provenance, registry, 문서 preview와 사용 코드를
  추가했습니다. 로컬 총수는 84개 component, 86개 registry item입니다.

## 출처와 의존성

[shadcn/ui 공식 Button Group 문서](https://ui.shadcn.com/docs/components/radix/button-group),
[고정 revision의 source](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/apps/v4/registry/new-york-v4/ui/button-group.tsx),
[같은 revision의 MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)를
확인했습니다. action 그룹과 toggle 그룹의 구분, 이름 있는 그룹과
native Tab 이동을 참고했으며 source는 복사하지 않았습니다.
기존 `Button`은 shadcn/ui 수정본이므로 격리 소비자 설치 시 MIT
고지가 함께 전달되는 것을 확인했습니다. 설치된 직접 npm 의존성의
manifest와 LICENSE는 `class-variance-authority@0.7.1` Apache-2.0,
`clsx@2.1.1` MIT, `tailwind-merge@3.7.0` MIT입니다.

## 검증

- `npm test -w @pydemia/ui`: 23개 통과. 새 검사 2개는 이름 있는
  그룹·native 버튼·장식 분리선과 지원하지 않는 설정을 다룹니다.
- 저장소 `npm run typecheck`, `npm run build`, `npm run registry:check`:
  통과. `registry:check`는 86개 item과 provenance를 확인했습니다.
- 문서 Chromium: 가로·세로 배치, 수량 변경, 0에서 감소 버튼 비활성화,
  Enter 실행, 어두운 모드 token을 확인했습니다. 빌드 중 Vite HMR에
  따른 중복 `createRoot` console 오류가 두 번 기록됐습니다. 빌드가
  끝난 뒤 새 문서 탭에서는 console error 0건을 확인했습니다.
- 격리 소비자
  `C:\Users\pydemia\AppData\Local\Temp\pydemia-ui-button-group-consumer-20260929`
  에 `shadcn@4.0.0 add`로 group·Button·utils·tokens·MIT 고지 5개
  파일을 설치했습니다. 원본 내용 일치, typecheck·build·production
  audit(high 이상 0건)를 확인했습니다. 소비자 Chromium에서 그룹
  이름, 가로·세로 배치, 1px 분리선, click·disabled·Enter와 console
  error 0건을 확인했습니다.

## 미검증

실제 screen reader 발표, touch·RTL·다른 브라우저·좁은 viewport,
86개 item 전체 동시 재설치, 기존 소비자 파일과의 갱신 충돌, 공개
배포는 확인하지 않았습니다. 문서 사용 코드 전체의 새 tarball
typecheck도 이번 변경 이후에는 다시 실행하지 않았습니다.
