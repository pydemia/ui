# MetricCard 표시 형태 확장

2026-09-29. 목표의 data analytics 디자인 선택 폭을 넓히기 위해 기존
`MetricCard`에 `compact`, `featured`를 추가했습니다. `default`는 이전
배치와 여백을 유지합니다. `compact`는 좁은 지표 묶음에 맞게 label과
값을 한 행에 놓고, `featured`는 대표 지표에 accent 배경과 큰 수치를
적용합니다. 세 형태 모두 `label`, `value`, `change`, `detail`을
텍스트로 표시합니다. 표시 형태로 `Stat`을 별도 component로 세지
않았습니다.

구현은 기존 `Card`와 공통 token을 사용합니다. 기존 Tremor reference는
KPI 카드의 구조에 한정하며 이번 두 형태의 source는 직접 작성했습니다.
새 dependency는 없습니다. 문서 catalog에는 세 형태의 실제 preview와
사용 코드를 넣었습니다.

| 검사 | 결과 | 범위 |
| --- | --- | --- |
| `npm test -w @pydemia/ui` | pass | 25개 검사 중 새 2개: 형태별 동일 텍스트·이름, 구분되는 token class, 잘못된 variant |
| 저장소 `npm run typecheck`·`npm run build` | pass | package, docs, profile 예시, 공개 URL의 86개 registry item |
| `npm run registry:check` | pass | 86개 item·provenance·원본, 84개 export·catalog 대응 |
| 문서 Chromium | pass (limited) | 세 형태 표시·동시 값 변경, Neutral light/dark 및 Pydemia accent 색 |
| 별도 소비자 `shadcn@4.0.0 add` | pass | `pyd-metric-card`와 token, 의존성 포함 5개 파일 설치 |
| 소비자 원본 비교 | pass | MetricCard·Card·utils·tokens·MIT 고지, 줄바꿈 정규화 후 일치 |
| 소비자 typecheck·build·audit | pass | 세 형태 Vite 앱, high 이상 취약점 0건 |
| 소비자 Chromium | pass (limited) | 세 group과 텍스트, 값 갱신·dark token; 새 탭 console error 0건 |
| 현재 catalog 84개 사용 코드 | pass | 현재 tarball 소비자에서 TSX 추출 후 typecheck |
| screen reader·touch·RTL·다른 브라우저 | unverified | 실제 기기·보조기술 검사 미실행 |
| 공개 배포 | unverified | 로컬 빌드와 소비자 설치만 확인 |

소비자 fixture는
`C:\Users\pydemia\AppData\Local\Temp\pydemia-ui-metric-card-variants-consumer-20260929`에
있습니다. 브라우저에서 fixture의 theme는 문서 사이트와 같은 방식으로
root의 `.dark`를 전환했습니다. 편집 도중 dev HMR에서 `createRoot`
경고가 있었으나 서버를 재시작해 새 탭을 열었을 때 console error는
0건이었습니다.
