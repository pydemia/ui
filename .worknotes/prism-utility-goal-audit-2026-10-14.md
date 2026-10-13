# `prism-utility` goal 수용 감사 (2026-10-14)

판정: `prism-utility` **완료 수용**. 전체 **33/58**, 미판정 25개. 이 판정은 UI 목적과 대표 디자인·상태, 접근성·좁은 화면, 독립 설치 가능성을 기준으로 한다. 기존 `visual: partial`과 `interaction: partial`은 더 엄격한 원본 전체 재현 기준이므로 유지한다.

기준 소스는 `prism/frontend`의 `dev` `2eeb26ff10274745f9d86897c2f2828bff002b98`이다. Switch·Tooltip·Progress·FileAttach·FileDropzone TSX와 해당 SCSS를 이전 대조 리비전 `7ecfc9af`에서 비교했다. 툴팁 SCSS에서 `word-break: break-word` 한 줄만 삭제됐고 나머지 해당 소스는 변경되지 않았다. 현재 배포 화면의 정확한 소스 SHA는 확인되지 않았다.

공개 완전 예제를 다섯 기능을 조합한 `UtilityExample`로 교체했다. Switch는 checked 상태를 소유하고, 표준 Tooltip과 정보 Tooltip은 각자의 도움말을 제공한다. Progress는 65%와 미확정 상태를 전환한다. 두 파일 컨트롤은 같은 controlled 목록에 선택·상태·제거를 반영한다. `가상 업로드 완료`는 호스트가 실제 업로드 결과를 처리해야 한다는 경계를 드러내는 예제 동작이다.

별도 consumer에서 registry의 TSX 59개와 CSS 바이트 일치, 완전 예제 48개 TypeScript 검사, Vite·Pretendard·고지를 확인했다. 인앱 브라우저로 독립 설치한 예제에서 Switch on/off, 표준 Tooltip의 키보드 포커스 열기와 Escape 닫기, 정보 Tooltip 토글, Progress 65%→indeterminate를 확인했다. 두 네이티브 파일 선택기에서 가상 CSV를 선택하고 uploading→ready 및 한쪽에서 삭제했을 때 두 표시가 동기화되는 것을 확인했다. 실제 320px 뷰포트에서 문서 client/scroll 너비는 모두 320px였고 브라우저 error 로그는 없었다. 이전 감사에는 배포 공개 샘플의 파일·툴팁 치수, 9개 툴팁 위치, 긴 내용·파일 유효성·readonly·disabled 등의 더 넓은 증거가 있다.

`npm run build`, `npm run prism:check`(338/338), `npm run typecheck`, `npm run registry:release-check`가 통과했다. 생성된 `docs/`와 공개 registry·검증 JSON은 같은 빌드 결과다.

원본에서 빠진 `word-break: break-word`는 긴 도움말이 화면을 넘지 않도록 재사용 컴포넌트에서 유지했다. 원본의 문제까지 시각적으로 복제하지 않아도 된다는 사용자 기준에 따른 의도적 개선이다. 최신 인증 배포의 SHA, 실제 업로드·다운로드 API, 모든 운영체제 drag/file dialog와 파일 조합 및 픽셀 단위 전체 일치는 이 판정의 증거에 포함하지 않는다.
