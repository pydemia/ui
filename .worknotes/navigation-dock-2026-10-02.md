# BottomNav 표시 선택

## 공개 확인

PR #91의 Verify UI run `36990865356`, 병합 commit `fc12a8f`의
Verify UI run `36991146756`과 Pages run `36991145804`가
성공했습니다. Vercel production
`dpl_3aeb4rBTHisaB1T1iUZCshbQj4oq`는 READY이며
`ui.pydemia.ai` alias에 연결됐습니다. 공개 Navigation preview에서
`dock`으로 전환했을 때 선택 링크가 accent 배경으로 표시됐고 Usage에
새 prop이 보였습니다. 공개 browser console error는 0건입니다.
현재 `pyd-navigation.json`, 49번째 snapshot manifest와 같은
snapshot의 navigation item URL은 HTTP 200이고 manifest의 itemCount는
127입니다. 공개 사이트에서 로컬 keyboard·반응형 검사를 반복하지
않았습니다. Goal 관리용 추정은 약 97%로 유지합니다.

## 구현과 로컬 검증

2026-10-02. 공개 기준 125개 component·127개 registry item·48개
snapshot에서 시작했습니다. `Navigation`은 전역·측면 링크의 표시를
고를 수 있지만 하단 탐색은 전체 너비 막대 한 형태였습니다.
`BottomNav`에 `appearance="dock"`을 추가해 카드나 작업 화면의
콘텐츠 위에 여백을 둔 탐색을 구성할 수 있게 했습니다. 기존 `bar`는
기본값입니다. 목적지 이름은 두 형태에서 모두 보이며
`aria-current="page"`는 호출자가 지정합니다. 새 component/item,
외부 source나 npm 의존성은 없습니다. 기존 `pyd-navigation`의
source·license·dependency 기록은 그대로 정확합니다.

문서 Navigation preview에 표시 전환 버튼과 `dock` Usage를 넣었습니다.
`@pydemia/ui`의 public type export에도 `BottomNavProps`를 추가했습니다.
로컬 `npm run typecheck`, UI 테스트 185/185, `npm run build`,
`npm run registry:release-check`가 통과했습니다. 현재 빌드와
49번째 snapshot
`sha256-b540f42c1b8b61ae2797a15c21b4f8634a48439bca19441b227c0a22ce1732bd`
의 127개 item이 일치합니다.

로컬 Chromium 문서 preview에서 `bar`→`dock` 전환, 클릭과 Enter로
현재 목적지 변경, 390px의 가로 넘침 없음, 밝은/어두운 모드의 선택
색상과 focus 표시를 확인했습니다. browser console error는 0건입니다.
실제 screen reader·touch·Safari·RTL은 실행하지 않았습니다. 기존
설치 형식과 의존 경로는 그대로여서 별도 소비자 재설치는 적용하지
않았습니다. PR CI·공개 URL·production 결과는 위에 기록했습니다.

Goal 관리용 추정은 약 97%를 유지합니다. 표시 선택 폭은 넓어졌지만
독립 사용 사례와 component 수는 늘지 않았습니다.
