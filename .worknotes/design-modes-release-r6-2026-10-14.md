# R6 21종 적용 결정과 실행

사용자 최신 요청: “21종 개발이 완료되었다면, 적용해 줘”.
직전 설명에서 남은 수동 환경 검수를 미검수로 기록하고21종을 공개하는
경로를 안내했다. 이번 요청에 따라 그 경로로 진행한다. 환경 검수 통과를
추정하지 않으며 관련 범위는 research/design-modes.md와 기존 ENV 표에 보존한다.
이 최신 결정은 구현계획 §7의 공개 선행 조건에 대한 해당 범위의 조정이다.

현재 baseHEAD736fd49c, main6ea262ef. PRISM source/public/scripts는 유지한다.
21종을 released로 제공하고 resolver·URL·메시지·picker의 일반 경로를 검사한다.
Basic 첫 방문 Light/Neutral, 기존 상태와 iframe·portal 계약은 유지한다.

라우터는 주 metadata unavailable, delegate gpt-6-luna/high/fork none을
추천했다. 현재 도구의 지원 조합과 여유3slots를 확인했으며 bounded release
delta 검토를 해당 요청으로 위임한다. 실제 execution metadata는 unavailable이다.
공유 source·build·Git·배포와 최종 판정은 root가 관리한다.

실행 순서: typecheck/관련 tests → build → snapshot → build → release-check →
source/CSS 소비자 설치 → commit/push/CI → PR 병합 → production READY →
ui.pydemia.ai의21종·Basic·profile·portal·PRISM 및 공개 설치/readback.

검사·공개 결과는 실행 후 갱신한다. Goal의 기존 blocked 사유는 사용자
결정으로 해소됐으며, 재개 이후 같은 사유의 blocked audit를 새로 시작한다.

## Delta 검토 수용

독립 leaf는11개 frozen 파일의 정적 검토에서 blocking regression 없음으로
판정했다. 초기 metadata 주석의 준비 중 표현만 지적했으며 지원21종 주석으로
정정했다. leaf는 검사·브라우저·PRISM diff를 실행하지 않았고 root가 확인한다.
typecheck/UI300/docs15는 실제 실행해 통과했다. 주석 수정 전 build는 예비
실행으로 구분하고 최종 source의 build→snapshot→build를 따로 수행한다.

최종 첫 build 통과 뒤 새 snapshot06554cd1…/148items 생성 확인.
build log 종료10:38:53UTC, manifest 생성10:39:08UTC로 실제 생성 순서를 확인했다.
재빌드와 release-check를 이어간다. 이전85개 release와 PRISM source는 보존한다.

## 공개 직전 검증

재빌드와 release-check 통과. 독립 소비자 attempt-7974Zt는 shadcn 4.21.0으로
15파일 설치 후 TypeScript/Tailwind/Vite, exact source/CSS, strict 21종 gate를
통과했다. 로컬 production 빌드의 첫 방문은 Basic/Light/Neutral이고,
Swiss 후보 탐색은 preview만 바꿨다. Swiss/Glass 실제 선택, URL 반영,
입력 초안 유지, profile Glass 적용 acknowledgement를 실제 브라우저에서 확인했다.
공개 CI/production/공개 소비자 검증은 이어서 수행한다.

source commit eefe273c495a4937a1a670e49413bc55c2d68975 push 확인.
PR163 ready 전환 후 CI38552590567은 타입/UI/docs 통과, 빌드 진행 중.
브랜치 배포 dpl_HfPf4NuzUVfGA2MsmmeYKW4G3CQC READY 확인.
운영 적용 전 화면에는 Design mode 선택기가 없음을 실제 확인했고,
PRISM의 Pretendard 및 body rgb(253,253,253) 기준을 저장했다.

CI38552590567 completed/success: PRISM, registry history/current snapshot,
generated docs 재현까지 통과. expected head eefe273c를 고정해 PR163을 병합했고,
merge/main은00a56c29ca81fe17756ca8aa33f44524df0f822f다.
source/registry/PRISM 코드와 생성물은 feature와 main에서 동일하다.
production dpl_CmYFcbPoznYU3wHs6JeRk6TNiKuA는 main 해당 SHA로 BUILDING이다.
W01–W13의 구현·검증과 최신 사용자 검수 조건 조정을 충족했으며,
W14는 운영 readback·공개 소비자 설치를 확인한 후 완료로 기록한다.

## 운영 공개 완료

production dpl_CmYFcbPoznYU3wHs6JeRk6TNiKuA READY, ui.pydemia.ai alias의
main SHA 00a56c29 일치를 확인했다. main CI38553221677도 completed/success다.
공개 immutable manifest 06554cd1…/148 items는 로컬 manifest와 동일하다.

운영 실제 검증:
- 21개 항목 모두 enabled, 21개의 서로 다른 design ID 실제 적용
- 후보 Swiss preview만 변경, URL 유지, Escape 취소 및 trigger focus 복귀
- 21종 전환 중 문서 입력과 profile 입력 초안 유지, profile design 일치,
  iframe src 유지. 실제 적용 URL과 history back/forward 복원 확인
- 설정 없는 재방문 Basic/Light/Neutral 확인. 저장한 디자인 자동 복원 없음
- 모바일 320/390px 후보 tap은 preview만 변경, Apply는 실제 UI 변경,
  document 가로 넘침 없음. viewport override 원상 복구
- PRISM 로드 완료 후 기존 Pretendard, body rgb(253,253,253), picker 없음,
  white 440px Dialog 확인. 초기 effect 적용 전 transient 관찰과 구분

공개 소비자 attempt-TmzCHp:
- https://ui.pydemia.ai/r/에서 실제 shadcn 4.21.0 설치 15파일
- 설치 source/CSS 일치, tsc, Tailwind/Vite build, strict 21종 gate 통과
- 일반 경로(qa 없음)에서 21종 선택, 열린 Dialog와 초안 유지
- Dark root와 지역 Forest palette, 지역 portal 일치 확인
- Dark UI의 Light 요청은 Basic Light fallback, Cyber/Terminal은 Dark로
  정규화된 실제 결과를 구분해 기록. 미지원 밝기 조합의 통과로 보고하지 않음
- CLI 원본 결과와 후속 browserVerification을 별도로 유지

현재 지원은 21종/39개 밝기 조합이다. R5 family matrix는 역사적 시각 검사
근거이며, R6 공개 21종의 일반 적용 결과는 별도 CSV와 JSON에 기록했다.
모든 개별 component API/상태 전수 인증이나 전체 접근성 인증은 아니다.

증거:
- browser-evidence/design-modes-public-r6.json
- design-modes-public-coverage-r6-2026-10-14.csv
- browser-evidence/design-modes-history-public-r6.json
- browser-evidence/design-modes-mobile-public-r6.json
- browser-evidence/design-modes-consumer-public-browser-r6.json
- browser-evidence/design-modes-prism-after-r6.json
- browser-evidence/design-modes-consumer-check/attempt-TmzCHp/verification.json
- design-modes-production-before-r6-2026-10-14.png (운영 적용 전)
- design-modes-production-after-r6-2026-10-14.png (Glass 적용 후)
- design-modes-production-picker-r6-2026-10-14.png (큰 상세 preview)
- design-modes-production-workspace-preview-r6-2026-10-14.png (Operations 상세)
- design-modes-production-mobile-390-r6-2026-10-14.png (모바일 후보/적용)

최신 사용자 결정에 따른 W01–W14 구현·공개 기준 14/14 완료(100%).
실제 화면 낭독기·200% 브라우저 확대·활성 reduced-motion/forced-colors·
blur 미지원 환경은 후속 미검수 상태다. 해당 조정은 위 사용자 결정과
manual-validation 문서에 명시했고, 실행 통과로 바꾸지 않았다.

제품 source/generated/registry는 원격 main과 동일하며 commit/push/병합·
배포 완료. 공개 후 세션 기록은 로컬 .worknotes에 갱신했다.
관련 없는 사용자 원본·시안·첨부는 보존했다. Skill 등록·설치는 반복하지 않았다.
