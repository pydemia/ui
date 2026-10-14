# prism-document 목표 수용 감사 (2026-10-14)

현재 원본 프런트엔드 `2eeb26ff10274745f9d86897c2f2828bff002b98`의 `PdfViewerDialog`와 `PrintOptionsDialog`를 설치형 PDF·출력 선택 계약과 대조했다. 두 원본 파일과 SCSS는 이전 비교 기준 `087811ff` 이후 변경되지 않았다. `CandidateProfilePrintPreview`의 7분류 본문과 실제 인쇄는 별도 `prism-profile-print`·`prism-print` 그룹이 맡으므로 이 그룹의 source 목록에서 중복을 제거했다.

원본 PDF 대화상자는 1200px/90vh, 페이지 입력 46px·배율 입력 64px, 도구막대 12px 20px padding과 페이지/배율/맞춤·다운로드를 제공한다. 로컬 1280px에서 입력 폭 46/64px, 도구막대 12px 20px과 2페이지 합성 PDF를 확인했다. 로컬 320px에서 문서 폭 320px, 뷰어 288px, 도구막대 넘침 없음, 한 섹션 출력 미리보기를 확인했다. 원본 출력 옵션은 440px 대화상자와 두 체크 항목을 사용한다. 설치형은 같은 두 항목을 controlled 값으로 제공하고, 호출자가 열 때 선택을 초기화한다.

레지스트리에 `PrismPdfDialog`, `PrismPrintOptions`, `PrismPrintPreview`를 함께 조합하는 완전 사용 예제를 추가했다. 예제의 PDF 주소 `public/document.pdf`는 소비자 앱이 공급하고, PDF.js worker는 설치한 `pdfjs-dist`의 Vite URL import를 사용한다. 실제 인증 URL fallback은 `loadPdf`, 실제 프로필 섹션/인쇄는 호스트와 별도 그룹의 계약이다.

새 외부 shadcn 소비자에 현재 `prism-document`와 토큰을 설치했다. 설치 파일 25개(이 중 PRISM TSX 9개)는 레지스트리 원문과 바이트 단위로 일치했다. 완전 예제의 TypeScript/Vite 빌드가 통과했고 PDF.js worker, Pretendard 글꼴과 PDF CSS가 생성됐다. 설치본 브라우저 320px에서 296×720px PDF 대화상자, 문서 폭 320px, 실제 2페이지 렌더·2페이지 이동·90% 수동 배율과 내부 723px 스크롤을 확인했다. 다운로드한 PDF는 합성 원본과 바이트 단위로 일치했다. PDF 파일을 임시로 빼서 HTML SPA 응답을 받은 경우 형식 오류가 표시됐고, 파일 복원 후 재시도해 2페이지가 다시 렌더됐다. 출력 옵션 선택·미리보기·인쇄 의도 callback·재열기 시 선택 초기화도 확인했다.

이 그룹은 PDF 열람·다운로드와 출력 섹션 선택 목적을 충족해 **53/58번째 완료 그룹**으로 판정한다. 미판정은 `prism-export`, `prism-html-export`, `prism-print`, `prism-profile-print`, `prism-record` 5개다. 인증된 배포 원본 PDF에 사용된 실제 서비스 URL·권한·배포 revision과 OS 출력 결과는 검증하지 못했다. PDF 바이트와 섹션 내용은 합성 자료였고, 실제 프로필 출력의 전체 페이지 분할·화소·글꼴 일치는 별도 출력 그룹 감사에 남긴다.

전체 `npm run build`, `npm run prism:check`(360/360 테스트, 완전 사용 예제 51개 타입 검사), `npm run typecheck`, `npm run registry:release-check`가 통과했다. PR/preview readback 결과는 게시 후 덧붙인다.
