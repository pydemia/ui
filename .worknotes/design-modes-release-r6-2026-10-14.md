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
