# 공개 registry 조합 소비자 검사

2026-10-03. 기준 commit은 `ddf0adbf`, 공개 snapshot은
`sha256-6b3bc4951ace2fe379a77bbe155f9e171f1c9245ec8dafc67f306f454c9d3822`
입니다. 새 Vite·React·Tailwind 소비자를
`%TEMP%/pydemia-ui-public-composite-20261003`에 만들고
`shadcn@4.21.0 add`로 공개 snapshot의 13개 item을 한 번에 설치했습니다.
대상은 AppShell, Navigation, Sidebar, Dashboard, MetricCard, DataChart,
DonutChart, FilterBar, Board, Thread, Dialog, PageHeader, token입니다.
CLI는 의존 item과 MIT 고지를 포함해 20개 파일을 생성했습니다.
설치된 AppShell·DataChart·DonutChart·Board·Thread 소스는 줄바꿈을
정규화한 저장소 원본과 일치했고 MIT 고지 파일도 존재합니다.

소비자 화면은 AppShell·Sidebar·Dashboard, `Card` 안의 plain chart,
필터, 게시판·대댓글, modal 글쓰기와 floating 도움말을 함께 사용합니다.
설치된 파일만 직접 import했습니다. `npm run typecheck`와
`npm run build`가 통과했고 build 결과는 JS 304.61 kB, CSS
29.57 kB였습니다.

로컬 Chromium에서 390px 모바일 drawer 열기·링크 이동과 닫기,
1280px 데스크톱 sidebar 표시, 팀 필터 적용에 따른 차트 값
16→5 변경, 게시글 선택·생성, 댓글·대댓글 등록, 도움말 열기·Escape
닫기를 확인했습니다. 두 폭 모두 문서 가로 넘침이 없었습니다.
새 브라우저 세션의 console error는 0건입니다. 수정 중 Vite HMR이
기존 React root를 다시 만드는 오류 한 건은 별도로 관찰했으며,
새 세션과 production build에는 나타나지 않았습니다.

게시글 전환에 동일 `Thread` 인스턴스를 재사용한 첫 조합에서는 이전
글의 초안·등록 안내가 다음 글에 남았습니다. 소비자에서
`key={selectedPostId}`를 지정하자 초안이 분리됐습니다. 문서 catalog와
design-contract에 이 조합 규칙을 추가했습니다. 이는 컴포넌트의
저장·권한 로직을 검증한 결과가 아니며, 검사용 데이터는 메모리에만
있습니다. 실제 보조기술·touch·다른 브라우저와 공개 consumer의
장기 URL 보존은 이번 검사의 범위에 포함하지 않았습니다.

새 component·registry item·snapshot은 없습니다. Goal 관리용 추정은
약 98%로 유지합니다. PR #113을 `main`에 squash 병합했습니다
(`6c049aa9`). PR Verify UI run `37074532215`, `main` Verify UI run
`37074783774`, Pages run `37074783088`이 성공했습니다. Vercel의
`main` commit status는 `Deployment rate limited — retry in 24 hours`로
실패했습니다. 따라서 catalog 설명은 저장소와 Pages에는 반영됐지만
`ui.pydemia.ai`의 새 JS 배포는 공개 대기입니다. 기존 component JSON과
65번째 snapshot의 공급 상태가 실패했다는 뜻은 아닙니다.
