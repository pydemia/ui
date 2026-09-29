# 모바일 SNB의 선택 위치 유지

## 확인과 변경

문서 SNB는 850px 이하에서 본문 자동 이동을 생략하고, React 화면 갱신 뒤
문서·SNB 스크롤 위치를 복원하고 있었습니다. 390px Chromium의 실제
마우스 클릭에서는 기존 코드도 위치가 유지됐습니다. 다만 위치 저장이
`click`에서 실행되어, 터치 브라우저가 버튼을 먼저 focus하며 문서를
스크롤하면 이동한 좌표가 저장될 수 있었습니다.

모바일 SNB 버튼의 `pointerdown`에서 문서 `scrollY`와 SNB `scrollLeft`를
먼저 저장하고, 선택 화면 갱신 직후 그 좌표로 복원합니다. 복원 시
`behavior: "instant"`를 사용해 문서의 전역 smooth scroll 규칙이 복원
동작을 지연하지 않게 했습니다. 키보드·보조기술 click은 클릭 시점의
좌표를 사용하며, 취소된 pointer 동작은 버립니다. 같은 항목을 다시
선택해도 pointer 이전 위치를 복원합니다. 데스크톱 SNB의 기존
`#components` 이동은 유지합니다.

## 검증

- 390px Chromium에서 `scrollY=844`, SNB `scrollLeft=6200`인 상태로
  DataChart → MetricCard를 클릭했습니다. 선택 값·제목이 바뀌고
  두 스크롤 값이 유지됐으며 DOM focus는 MetricCard 버튼이었습니다.
- MetricCard를 다시 클릭해도 두 스크롤 값이 유지됐습니다.
- 1280px Chromium에서 Tree를 선택하면 `#components`로 이동해
  섹션 상단이 약 84px에 놓였습니다.
- `npm run typecheck`, `npm test -w @pydemia/ui` 72/72,
  `npm run build`, `npm run registry:check`, `git diff --check` 통과.

실제 touch 기기·Safari·screen reader에서 pointer 이전 좌표 복원은
미검증입니다. Tree 지연 로딩의 작업 중 변경은 별도 stash에 보관해
이번 빌드와 수정안에 포함하지 않았습니다. 기존 미공개 draft snapshot
네 디렉터리도 포함하지 않습니다.

[PR #14](https://github.com/pydemia/ui/pull/14)를 `main`에 병합했습니다.
PR Verify UI, `main`의 [Verify UI](https://github.com/pydemia/ui/actions/runs/36625014823)·
[Pages CI](https://github.com/pydemia/ui/actions/runs/36625014264)가
성공했고 Vercel production `dpl_Bu4R6wpdpd3Es12gv2dTMaGHTRRr`는
READY입니다. 공개 `ui.pydemia.ai`의 393px Chromium에서 DataChart →
MetricCard 선택 후 `scrollY=844`, SNB `scrollLeft=6200`이 유지되고
URL·제목·버튼 focus가 갱신됐습니다. 이 클릭은 mobile device emulation의
mouse pointer였으므로 실제 touch 검증으로 계산하지 않습니다.
