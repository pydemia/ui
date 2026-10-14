# PRISM 기본 글줄바꿈 대조

원본 frontend `dev` d677e551의 `src/styles/base/_reset.scss`는 body에 `word-break: keep-all`과 `overflow-wrap: anywhere`를 지정합니다. 인증된 배포 대화 화면 `/chat/7cded670-0be3-41f1-b3cc-927dc286926e`에서 body·문단·표 셀의 computed 값도 각각 `keep-all`·`anywhere`였습니다. 배포 SHA와 소스 리비전의 결합은 확인하지 못했습니다. 원본의 변경 목록에서 새 safeHtml은 채팅 HTML 소독/React 변환인데, 독립 `PrismFormattedText`는 이미 `rehype-sanitize`와 명시적 URL 정책으로 이를 지원합니다. 그 구현을 중복 복사하지 않았습니다.

독립 PRISM light root의 기존 computed 값은 `normal`·`normal`이었습니다. root에 소스와 같은 상속 규칙을 적용한 뒤 root와 포지션 표 셀에서 `keep-all`·`anywhere`를 확인했습니다. 현재 source fingerprint는 `34dc37a576653da8ca0f4d177f6b18da009cb2e45e48213aebbca6b69403a4bc`/87 inputs입니다. 포지션 목록 합성 기본·로딩·빈 결과·오류·긴 내용 5상태를 320/1280px에서 다시 읽었으며 각 상태의 문서 가로 넘침과 중첩 버튼은 0입니다. 320px의 680px 표는 256px 영역 내부에서 스크롤합니다. 브라우저 뷰포트는 1280px 기본값으로 복원했습니다.

`npm run prism:check`의 전체 284개 테스트와 `npm run typecheck`가 통과했습니다. 새 격리 shadcn 소비자 `/var/folders/ht/0ztx9m_d3xz1lg1m0rsy6bk80000gn/T/prism-consumer-rVSNWx`에 60개 registry 항목을 설치했고 40개 완전 예제의 TypeScript/Vite/font/고지가 통과했습니다. 설치된 `prism.css`는 현재 소스 CSS와 217932바이트·SHA256 `c5945f158d1bc1e86ea67486d4f89dd07bf33304d553aa9655edf95d45eee887`로 일치합니다. 세부 포지션 동작의 설치 브라우저 증거는 이전 source fingerprint에 속하며 이번 CSS 변경의 재실행으로 간주하지 않습니다.

전체 원본 상태·폰트/픽셀 일치와 인증 서비스 실행은 아직 미확인입니다. 이전 포지션 목록 게시 proof는 `b1526da5`에만 적용되며 현재 줄바꿈 변경의 CI/preview는 별도 확인합니다.

표준 사이트 build와 generic registry release-check가 통과했습니다. 게시된 리비전 검증은 다음 단계입니다.

## 검토 브랜치 게시 결과

소스·검증 기록 `89952008`과 생성 registry·docs `b1cf2212`를 검토 브랜치에 푸시했습니다. draft PR #162는 `main` 대상으로 최종 head `b1cf22121efeae882c0316c541ebb8bd70202a20`을 가리킵니다. 이 SHA의 Verify UI run `38370135025`는 completed/success입니다.

자동 Vercel preview `dpl_BFxcFLejqMj5AvG1XqQcpanvcayR`은 READY/target null/동일 SHA입니다. `https://pydemia-c47cxxqmt-pydemia-7822.vercel.app`의 인증된 HTTP 산출물 18개가 readback에 통과했습니다. 17개는 로컬 build 바이트와 같고 `/prism/index.html`은 Vercel feedback script 하나를 제외한 앱 HTML이 같습니다. 상세 파일별 결과는 ignored `browser-evidence/word-wrap-final-preview-readback.json`에 있습니다. 일반 인앱 브라우저로 preview를 열면 Vercel 로그인 화면으로 이동하므로 배포 브라우저 렌더는 미검증입니다. main/production은 변경하지 않았습니다.
