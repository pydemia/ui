# prism-export 목표 수용 감사 (2026-10-14)

현재 프런트엔드 `2eeb26ff10274745f9d86897c2f2828bff002b98`의 `CandidateProfilesPdfDownload`, `PdfDownloadHost`, `buildCandidateProfilePdf`, `streamDownload`을 설치형 PDF/ZIP 작업 API에 대조했다. 원본은 한 후보자를 PDF 하나로, 여러 후보자를 같은 이름을 구분한 ZIP 하나로 출력하고, 다운로드 호스트를 화면 라우트 위에 두어 메뉴 이동 중 작업을 유지한다. 생성 수를 보고하고 작업 제거·화면 이탈에는 진행 중 출력을 중단한다. 설치형은 호스트가 제공한 정적 문서/PDF renderer와 각 작업의 ID를 받아 같은 출력 목적을 제공한다. 실제 후보자 조회·권한·7분류 문서 내용은 소비자가 맡는다.

설치형은 PDF 서명을 검사하고 실패한 renderer의 불완전한 ZIP을 완료 파일로 표시하지 않는다. 중복 파일명은 `(2)`·`(3)`으로 구분한다. 불변 작업 ID와 AbortSignal로 경로 변경·callback 재렌더링·취소를 구분하며, 비동기 streaming sink의 쓰기 완료를 기다린 뒤 닫는다. `onComplete`는 브라우저 다운로드 시작 또는 sink 종료이고 OS 파일 저장 완료를 뜻하지 않는다. 원본 출력 동작의 목적을 유지하면서 실패·비동기 작업의 결과를 더 분명하게 처리한 개선이다.

기존 대상 테스트는 단일 PDF의 바이트·파일명·진행률, 복수 ZIP의 이름과 PDF 보존, 스트림 backpressure·실패 시 abort, pending renderer 취소, 호스트 route/StrictMode의 단일 작업 유지와 unload listener 정리를 확인한다. 이번 로컬 브라우저에서는 합성 후보 한 명의 78,531바이트 PDF를 다운로드해 `%PDF-1.3`, A4 1쪽과 제목을 확인했다. 같은 이름의 두 후보를 선택하자 157,456바이트 ZIP 하나가 생성됐고 두 PDF의 이름이 원본과 `(2)`로 구분되며 CRC와 PDF 서명이 정상이다. 진행률은 각각 1/1, 2/2로 표시됐다. 오류 상태는 파일 생성 실패를 표시했고 2초 지연 작업의 0/1 상태에서 즉시 취소하자 기본 동작으로 돌아왔다.

새 격리 shadcn 소비자는 59개 PRISM 모듈을 설치했고 export 소스/CSS는 레지스트리 원문과 바이트 단위로 일치한다. 52개 완전 예제 타입 검사와 Vite/Pretendard/고지 빌드가 통과했다. 설치본의 PDF 완전 예제를 브라우저에서 실행해 11,279바이트 A4 1쪽 PDF를 다운로드했다. 이전 같은 구현에서는 전체 7분류의 긴 21쪽 PDF, 두 후보의 각 9쪽 PDF를 넣은 ZIP, 독립 설치본의 7분류 PDF/ZIP을 실제 생성·검사했다. 이번 합성 작업 검사와 이전 통합 증거를 구분한다.

출력 작업·진행·취소·단일/복수 파일·독립 설치를 확인해 `prism-export`를 **56/58번째 완료 그룹**으로 판정한다. 미판정은 `prism-print`, `prism-profile-print` 2개다. 인증된 원본의 출력 세션·서비스워커·OS 저장 완료, 실제 후보 데이터·사진 권한과 전체 문서 내용·용지 나눔은 확인하지 못했다. 전체 7분류 내용은 `prism-profile-print`, native 인쇄는 `prism-print` 범위다.

전체 빌드와 PR/CI/preview 결과는 게시 후 덧붙인다.
