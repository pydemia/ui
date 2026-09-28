# 첫 milestone 검증 기록

검사 시점: 2026-09-28 UTC. 테스트 데이터는 데모에서 만든 합성 fixture입니다.
실제 제품 backend나 영구 저장을 사용하지 않습니다.

| 검사 | 결과 | 관찰과 한계 |
| --- | --- | --- |
| `npm ci --ignore-scripts --offline` | pass | lockfile 기반 workspace 의존성 설치 |
| `npm run typecheck` | pass | UI 패키지 선언 생성, 데모와 문서 사이트 TypeScript 검사 |
| `npm run registry:build` | pass | shadcn CLI가 9개 item JSON 생성 |
| `npm run registry:check` | pass | 9개 item의 content, dependency 참조, provenance 일치 |
| `npm run build` | pass | Vite 7 문서 사이트와 프로필 데모 build; `docs/`에 registry JSON 포함 |
| `import('@pydemia/ui')` | pass | Node ESM에서 18개 export 로드 |
| 별도 consumer에 component source 복사 후 `tsc --noEmit` | pass | Snippet 포함 9개 소스의 import closure typecheck |
| shadcn CLI `add`로 별도 consumer 설치 | blocked | CLI의 필수 색상 파일 fetch가 이 환경의 proxy에서 거절됨. 원본 registry item 생성과 수동 복사만 확인 |
| 실제 브라우저 화면과 키보드·focus·dark/mobile | unverified | 연결된 브라우저가 `127.0.0.1` 접근을 `ERR_BLOCKED_BY_CLIENT`로 거절 |
| screen reader와 formal WCAG audit | unverified | 브라우저 및 보조기술 테스트 미실행 |

Source 확인은 공식 docs·upstream file·LICENSE 원문을 기준으로 했습니다.
패키지 license는 설치된 manifest에서 직접 확인했습니다. 직접 의존성 중
`class-variance-authority`는 Apache-2.0, `lucide-react`는 ISC입니다.
원본 MIT source와 이를 혼동하지 않았습니다.

정적 token 비교에서 일반 텍스트/배경 13.69:1(light), 15.01:1(dark),
muted/표면 6.46:1(light), 8.25:1(dark), accent 텍스트/표면
7.31:1(light), 7.74:1(dark)를 계산했습니다. 이는 지정된 색 쌍의
수치일 뿐 실제 렌더링의 모든 대비나 WCAG 적합성을 증명하지 않습니다.

남은 수용 검사는 `shadcn add`를 정상 네트워크에서 실행하고,
desktop/mobile light/dark 화면을 실제
브라우저에서 보고 키보드 탭 이동·복사 feedback·focus ring을 확인하는
것입니다. 이후 실제 screen reader로 이름과 상태 발표를 확인합니다.
