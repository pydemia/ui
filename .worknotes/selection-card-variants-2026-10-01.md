# 선택 카드 표시 형태

시작 기준: 105개 component·107개 registry item·23개 불변 snapshot,
goal 관리용 추정 약 80%, 라이브러리 과제 완료 5·부분 4·미검증 1.

CheckboxCard·RadioCard를 별도 component로 세지 않습니다. 기존
`Checkbox`·`RadioGroupItem`의 선택 상태와 form 동작에 보이는 이름·
설명·넓은 선택 면적을 더하는 `variant="card"`로 구현합니다.
기본 표시와 외부 Label 사용법은 유지합니다. 카드 안에는 다른
상호작용 요소를 넣지 않습니다.

기존에 고정한 shadcn/ui revision
`98a1fe67b439324ddc857f47fbdce056600a4329`의 Checkbox·Radio
Group source와 MIT LICENSE, 각 공식 문서를 다시 확인했습니다.
Radix Checkbox의 Space와 Radio Group의 방향키·roving focus 문서도
확인했습니다. 설치된 두 Radix package의 manifest·LICENSE는 MIT,
추가 의존성은 없습니다. 자세한 URL은
[source inventory](../research/source-inventory.md)에 기록했습니다.

최종 소스의 `npm run typecheck`, UI 테스트 116/116, 전체 build가
통과했습니다. 문서에는 두 선택기의 카드형 preview·사용 코드를
추가했습니다. 390px Chromium에서 Checkbox 카드 전체 클릭·Space·
disabled·native FormData 제출, Radio 카드 클릭·Space·제출과 설명
연결을 확인했습니다. light/dark 표시와 가로 overflow도 확인했고
브라우저 오류는 없었습니다. 자동화한 방향키 입력에서는 focus만
옮겨졌고 선택값 변경은 확인되지 않았습니다. 기본 radio에서도
같은 현상이 보여 키 입력 도구의 시점 영향을 의심하지만, 카드의
방향키 선택은 검증 완료로 표시하지 않습니다.

`registry:check`의 첫 실행은 provenance 수정 뒤 소비자용 고지의
SHA-256이 예전 값이라 실패했습니다. source commit `3392144`에
고정한 고지로 갱신한 뒤 `registry:check`가 107개 item·105개
export/catalog와 기존 23개 snapshot을 확인했습니다. 새 24번째
snapshot ID는
`sha256-1889f7c9f938bea5019bba5e20d480efc8a17244036c881451a616ceed14b68d`입니다.
재빌드한 후 `registry:release-check`가 현재 빌드와 ID 일치를
확인했습니다. 공개 소비자 설치는 배포 뒤 확인합니다. 실제 screen
reader·touch·Safari·RTL은 아직 검사하지 않았습니다.
