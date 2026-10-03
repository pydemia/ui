# 입력 control 표시 형태 — 2026-10-03

## 선정과 변경

`Input`은 outline·filled·underline을 제공하지만 같은 form에 쓰는
`Textarea`, `NativeSelect`, `SelectTrigger`는 한 형태뿐이었습니다.
세 control에 같은 `appearance`를 추가하고 기존 outline을 기본값으로
유지했습니다. `Textarea`·`NativeSelect`는 native control을,
`SelectTrigger`는 기존 Radix combobox와 `Select`의 값 전달을
그대로 사용합니다. 색과 간격은 공통 token을 따릅니다.

세 component의 출처와 고지는 기존 provenance를 유지했습니다.
외부 코드, 새 npm 의존성, registry 설치 경로는 추가하지 않았습니다.
문서에는 Textarea의 세 입력란과 NativeSelect·Select의 전환 가능한
preview, 각 외형의 Usage를 추가했습니다.

## 실행한 검증

- 대상 SSR 테스트 4/4: native 값·필수·오류 상태, combobox 이름과
  역할, 기본값·token 차이·미지원 값 거부를 확인했습니다.
- UI 전체 테스트 277/277, `npm run typecheck`, `npm run build`,
  `npm run registry:release-check`가 통과했습니다. release 검사는
  80개 불변 snapshot, 144개 component export/catalog와 146개 item,
  현재 빌드의 일치를 확인했습니다.
- 로컬 Chromium 문서에서 Textarea `filled`에 텍스트를 입력하고
  outline·underline 표시를 확인했습니다. NativeSelect는 filled·
  underline 전환 뒤 선택값을 바꿨고 Select는 filled에서 option을
  고른 뒤 underline으로 바꿔도 같은 값이 form에서 제출됐습니다.
  어두운 테마에서 Select의 세 표면도 구분되는지 확인했습니다.
- 80번째 schema 2 snapshot 후보는
  `sha256-a41c77f25332ff2a69d2143563361bc9cf0b48a12cb901664579ccea8a112eb2`
  이며 146개 item을 담습니다.

첫 release 검사에서는 snapshot 생성 후 배포 폴더 복사가 끝나지 않아
`docs/r/releases` 파일이 없었습니다. 빌드를 다시 실행해 배포 폴더에
복사한 뒤 같은 검사가 통과했습니다. 실제 screen reader·touch·Safari는
실행하지 않았고 PR CI와 사용자 도메인의 새 preview는 확인 전입니다.
설치 경로가 그대로여서 격리 소비자 재설치는 반복하지 않았습니다.

새 component는 없고 후보 수량은 144개 component·146개 item입니다.
Goal 관리용 추정은 **약 99% → 약 99%**입니다.
