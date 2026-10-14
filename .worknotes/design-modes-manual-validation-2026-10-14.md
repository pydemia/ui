# R4 출시 검수 조건

## 최신 사용자 결정 — R6 적용 진행

사용자가 “21종 개발이 완료되었다면, 적용해 줘”라고 요청했다.
직전의 미검수 범위 기록 후 공개 경로 설명에 이어 받은 실행 지시다.
실제 ENV 항목은 미검수로 유지하고, 21종을 공개 적용한 뒤 후속 검수하는
기준으로 진행한다. 아래의 응답 대기·blocked 기록은 이전 상태다.
현재 실행과 새 source/release 정보는 design-modes-release-r6-2026-10-14.md에 연결한다.
PRISM 현재 디자인 유지 결정도 계속 적용한다.

현재 대상 source: `736fd49c09c4755b7c359d986d8552f4ecdb68bd` (R5).
접근성 media 보완의 기반 source는 `16af79a2ca4794500d14fb6404d8f50ed64c5838`다.
대상 화면: http://127.0.0.1:5173/ 및 /design-qa.html.
배포용 local 빌드: http://127.0.0.1:5201/.
사용자에게 보여 준 B 상세 이미지: design-modes-b-r3-workspace-2026-10-14.png.
일반 표시의 UI는 R3와 같으며 R4는 특수 media 우선순위를 보완한다.
PRISM은 main/6ea262ef의 현재 디자인과 source를 유지한다.

## 남은 실제 환경 점검

| ID | 검사 | 확인할 결과 | 상태 |
| --- | --- | --- | --- |
| ENV-AT | 실제 화면 낭독기 | 후보와 현재 적용 구분, 검색·빈 결과·확정/취소 전달, preview 조작과 trigger focus | 미검수 |
| ENV-ZOOM | 실제 브라우저 200% 확대 | B 목록·상세·닫기·적용 도달, 입력과 내부 표 조작 | 미검수 |
| ENV-MEDIA | reduced-motion/forced-colors 활성 환경 | 모션·장식 제거, 경계·오류·focus·선택 식별, 지역 portal 일치 | 미검수 |
| ENV-BLUR | backdrop-filter 미지원 환경 | Glass/Fluent의 읽을 수 있는 단색 표면, 입력·선택 유지 | 미검수 |

현재 연결한 IAB와 Edge는 Chromium이다. 별도 engine과 물리 touch 실행을
완료했다고 보고하지 않는다. 현재 IAB의 media는 둘 다 false이며 backdrop은
지원된다. CSSOM 회귀 검사는 media 조건의 실제 실행을 대체하지 않는다.
새 폰트·texture 파일이나 비동기 자산 로더는 도입하지 않았다.

## 사용자에게 요청한 판단

구현계획 §7은 미검수 항목이 남은 모드를 released로 올리지 않도록 정했다.
async 질문으로 아래 두 처리를 제시했다. 아직 응답을 받지 않았다.

- 출시 전에 실제 환경 점검 완료: 기존 조건 유지.
- 미검수 범위를 기록하고 21종 공개 후 추가 점검: 출시 조건의 명시적 조정.

무응답이나 도구의 질문 접수 성공을 승인으로 계산하지 않는다. Basic released,
20 ready를 유지한다. Source·산출물·소비자·Git 검증은 계속 수행한다.
사용자 판단이나 실제 결과를 받으면 해당 ID와 source revision에 연결한다.

원격 후보: Draft PR https://github.com/pydemia/ui/pull/163,
head736fd49c09c4755b7c359d986d8552f4ecdb68bd.
해당 head의 CI38535562314는 completed/success다.
Vercel 후보는 READY이나 기존 인증 보호가 있어 화면을 검수하지 않았다.
운영 게시와 검수 조건 선택은 아직 완료되지 않았다.

동일 선행 조건3turn 반복과 독립 보완 완료 후 impasse 판정은
design-modes-blocked-audit-2026-10-14.md에 기록했다. 사용자 판단 또는
실제 ENV 결과를 기다리며 Goal은 blocked로 전환한다.
