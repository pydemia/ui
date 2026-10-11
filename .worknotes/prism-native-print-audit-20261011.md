# 프로필 인쇄 격리와 준비 상태 검증

직전 goal turn은 source 7c2c4e13/generated 88ecf493, 130 tests/실제 320px 172상태, PDF·HTML·ZIP과 원본 인증 탭 대조, PR162/CI/preview HTTP readback을 완료한 진척입니다. 현재는 인쇄 시 앱과 모달이 함께 출력될 수 있는 gap을 수정합니다. 전체 목표는 active입니다.

원본 087811ff의 CandidateProfilePrintPreview.tsx는 문서 제목 변경, rAF autoPrint와 afterprint close를 연결합니다. PrintPreviewShell은 document.body portal이며 styles/_print.scss가 인쇄 시 #root와 hrx-confirm-dialog를 숨기고 A4/7·10·10mm와 footer를 정의합니다. kit의 CandidateListDemo는 격리 없이 window.print()를 호출했습니다.

preparePrismPrintSession/PrismPrintButton은 createPrismHtmlDocument의 정적 문서와 자산을 190mm iframe에 격리합니다. child scripts/외부 자산은 허용하지 않고 allow-same-origin/allow-modals로 해당 문서의 print()를 연결합니다. fonts.ready/실패 font·image.decode/paint를 기다리고 준비 timeout·resource error·AbortSignal/dispose에서 작업 소유 frame만 정리합니다. 부모 title/DOM을 바꾸지 않습니다.

HTML Standard는 브라우저가 인쇄 요청을 무시할 수 있고 sandboxed modals가 있는 문서에서는 before/afterprint도 발생하지 않으며 대화상자 반환을 기다리는 구현과 기다리지 않는 구현을 허용합니다. onRequested/onAfterPrint/dispose를 구분하며 출력 성공·OS 저장 완료로 해석하지 않습니다. 참고: [HTML printing](https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#printing), [srcdoc](https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/srcdoc).

- 단위 테스트 5개와 전체 138 tests/49그룹/26완전예시 타입 검사가 통과했습니다. JSDOM에는 srcdoc navigation/native dialog가 없어 테스트는 navigation과 native invocation만 모사합니다. 격리/원본 불변·일회 요청·afterprint 정리, 느린 font/취소/late 결과, asset 실패/timeout, font 실패/Trusted Types 거부, 준비 후 abort/dispose를 확인했습니다.
- 실제 IAB의 7분류 default에서 인쇄 버튼을 눌렀습니다. 이후 Runtime.evaluate가 timeout이었지만 같은 tab14가 존재해 재시작하거나 인쇄를 다시 호출하지 않았습니다. com.openai.codex 앱 자체는 CUA 안전정책상 접근 대상이 아니라는 거부를 받아 OS dialog를 직접 확인하지 못했습니다.
- 허용된 검증용 browser tab에 Escape를 한 번 보냈고 실제 onAfterPrint의 `인쇄 요청 처리가 끝났습니다.` 상태, owned frame 0, 원래 부모 title `PRISM UI · pydemia`를 확인했습니다. 별도 수동 afterprint dispatch는 하지 않았습니다. 인쇄 호출·Escape·브라우저 이벤트를 관찰했지만 OS 출력/저장·용지/실물 layout을 확인한 결과는 아닙니다.

다음 단계는 원본 전체 인쇄 출력과 native 용지·여백·페이지 분할·사진·font/pixel 대조입니다. 아래 독립 consumer와 좁은 화면 검증은 완료했습니다.

## 최신 독립 설치와 실제 브라우저 검증

- 50항목/75파일/26완전예시를 재설치하고 TypeScript·Vite·font SHA256·권리 고지가 통과했습니다. installed component는 직접 수정하지 않고 검증 entry만 유지했습니다.
- 실제 긴 두 프로필의 인쇄 준비 frame에서 각7분류·각48경력·SVG6·script0/button0·앱 상단 제외·Pretendard loaded·190mm(718.109375px)를 확인했습니다. native-prepared-current-long-metrics.json을 보존했습니다.
- 준비 대기 fixture는 자산 loader만 의도적으로 멈춥니다. 취소 상태와 frame0/재시도 가능을 확인했습니다. 합성 asset 오류도 frame0/재시도 가능이며 정상 재준비 뒤 부모 이름을 수정해도 child snapshot은 유지됐습니다. native-current-cancel-error-snapshot.json은 이 범위이며 OS 인쇄 취소 검증이 아닙니다.
- 폰트 ready를 최초 snapshot보다 먼저 기다리던 버그를 재현했습니다. 88ecf493의 같은 입력은 later profile/later form을 반환하고 현재본은 original profile/original form을 반환합니다. CSS media/support/layer, inline style과 canvas dimensions도 비동기 자산 전에 캡처했습니다. 새3회귀+5native를 포함한 전체138tests가 통과했고 마지막 CSS 보완 뒤 관련15tests를 다시 통과했습니다.
- 독립 HTML actual320에서 hidden sr-only absolute text가 containing block 밖으로 빠져 html scrollWidth619를 만들었습니다. export viewer position:relative로 보완한 registry를 다시 설치했습니다. 이후 document width/scrollWidth320, viewer width320/scrollWidth718, paper718.109375·14분류/96경력·font loaded를 확인했습니다. native-fixed-standalone-320.json과 실제 전후 DOM 근거가 있습니다.
- 최신 HTML3,168,468bytes/sha2565d58962efa5a593c64c0fd346f1bc0bae27f9d084a9233117df2a49d334b878f가 browser srcdoc 원문과 일치했습니다. 첫 plain textarea transport의 조각2에서2문자가 바뀌어 해당 raw 사본은 원본으로 사용하지 않았습니다. base64로 재전송한 조각과 최종 전체 base64의 해시 일치를 확인했습니다. native-print-preview/long.html과 두 PNG를 보존했습니다.
- 현172고유fixture(actual320)의 marker/누락/overflow/nested button/unlabeled visible input 문제0, 수집 warning/error log0입니다. native-current-172-fixtures.json과65개 source input hash의 native-current-source-fingerprint.json을 보존했습니다. hash2996cb313e6e0672c6cd1b0282c4e9fad8e8d7a3ccbda0f39e1713f16a16ddc8입니다. viewer CSS 수정은 해당 fixture의 저장 요청 전 export 규칙만 바꿔 앞서 렌더한 정의 상태에 시각 변화가 없고 독립 저장 HTML을 별도 재측정했습니다. 이 검사는 모든 동작·원본 parity를 증명하지 않습니다.
- 최종 실제 PrismPrintButton을 다시 클릭하고 Escape 한 번 뒤 afterprint 상태/owned frame0/원래title/버튼 재활성화를 확인했습니다. afterprint를 수동 dispatch하지 않았습니다. native-fixed-print-invocation.json에 기록했고 OS 대화상자 설정·저장파일·실물출력은 확인하지 못했습니다.
- 워크스페이스 typecheck와 generic release check가 통과했습니다. 이후 표준 site build·최종 registry 검증·source/generated 분리 commit과 기존 draft PR162 갱신을 이어갑니다. 전체 goal은 active입니다.

- 최종 후보자 preview의 오래된 연결 안내를 실제 연결된 동작에 맞춰 바꾸고 재준비 시 이전 인쇄 상태를 초기화했습니다. 65 source input 중 해당 demo 한 파일만 변경됐음을 hash로 대조했고6상태 actual320를 다시 검사해 기존172행의 해당6행을 대체했습니다. 최종 source fingerprint 740efd9dc6e1b7d2ac617dfb42e57a9e95064ba7c731194639380cc9616686e2; native-final-172-fixtures.json/native-final-source-fingerprint.json입니다.
- 실제 두 후보자 false/false 옵션 preview 하나에14분류·SUMMARY0·보상없음·document320/scroll320·aria-hidden 없음이 확인됐습니다. Native 버튼 뒤 Escape로 preview도 닫혔고 frame0/parent title 유지입니다. 이 경우 afterprint status는 따로 관찰하지 못했습니다. 이미 닫힌 footer를 추가로 찾은 no-match는 재시도하지 않았고 명시적 afterprint 성공 사례는 앞선 single 문서로만 제한합니다.
- 최신 frontend fetch 뒤 HEAD=origin/dev087811ff clean, origin/main288b0838이며 credential Git config hash가 유지됐습니다.

- 최종 docs typecheck/check-prism49그룹·26예시/표준 npm run build/generic verify-current/diff check exit0입니다. 일반 snapshot25ca4393는 유지됐습니다. generated components/registry/verification JSON·MD 네 파일이 canonical public bytes와 일치했습니다. registry762,676bytes/sha25681d67f026cc42675b238cb380dbd84c9a23c943de933dbab1745263f4d3af29b입니다.
- own 탭14–18을 닫고 temporary viewport를 reset했습니다.63153/5804/63227/63228의 PID·command·cwd를 확인한 뒤 해당서버만 종료했고4session exit143을 확인했습니다. 소비자source/lock/deps/dist와raw HTML·PNG·JSON은 보존했습니다. 사용자Chrome 탭과계정·권한은 변경하지 않았습니다. Vite terminal의public import/Babel/large chunk 경고와 browser warning/error 수집0은 다른 범위입니다.
