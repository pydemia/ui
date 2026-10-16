# PasswordInput 표시 버튼 중복 R21

- 요청: 예시에서 비밀번호를 입력하면 숨김/표시 아이콘이 하나 더 나타남.
- 시작 main: 3bef21b3a1aa7a928d6a009c8a4370808ad91ee5.
  기존 14개 dirty 기록·첨부·미게시27cd release 보존.
- 코드: PasswordInput이 자체 Eye/EyeOff 버튼을 항상 제공하지만
  Edge의 native reveal을 억제하는 규칙이 없음.
- Microsoft 공식 문서: Edge는 사용자가 password 필드에 입력할 때
  Shadow DOM의 눈 버튼을 표시하며 `::-ms-reveal { display:none }` 지원.
  https://learn.microsoft.com/en-us/microsoft-edge/web-platform/password-reveal
- 수정: PasswordInput input에만 Tailwind `[&::-ms-reveal]:hidden` 적용.
  일반 Input·다른 password 필드·password manager/autocomplete 설정은 유지.
- 완료 기준: ① 국소 수정·기존 표시 전환/값/폼 계약 검증
  ② 공식 build/snapshot/CI/main/공개 registry 반영
  ③ 실제 Edge 입력 전후 재현과 최종 화면 확인. 현재 0/3.
- CUA 초기화가 kernel assets 경로 오류로 실패. 1회 reset 후에도 같은 오류.
  실제 브라우저 화면 재현은 아직 미검증이며 문서/코드 추론과 구분.
  코드·DOM·빌드 검증 및 릴리스는 계속 진행.

- 첫 공식 npm run build 통과. 생성 docs CSS에 PasswordInput class의 ::-ms-reveal{display:none}가 실제 출력됨을 확인. 일반 Input에 전역 규칙을 추가하지 않음.
- 기존 input appearance/input-group/pin-input 관련6개 tests pass. 별도 JSDOM 검사에서 자체button1개·표시/숨김·input identity·value/FormData/autocomplete·submit미발생·disabled 확인. JSDOM은 native pseudo-element 렌더를 재현하지 못하므로 실제Edge확인과구분. 근거 helper는ignored browser-evidence/password-r21/check-password-dom.mjs. 기준① 완료(1/3).

- 공식 build→snapshot→build→release-check 모두 통과. 새6204bc23/148items, 이전공개release 보존. 실제Edge시각검수는 도구초기화오류로 여전히 미실행. PR·CI·main·운영 readback 진행 예정.
