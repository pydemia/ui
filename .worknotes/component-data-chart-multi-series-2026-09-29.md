# 다중 계열 차트

2026-09-29. 기존 `DataChart`의 단일 `points` API를 유지하면서 같은
기간의 완료·대기 등 여러 지표를 비교할 수 있게 했습니다. 계열마다
별도 component를 늘리지 않고 선형·그룹 막대·비누적 영역 variant를
같은 입력 데이터로 전환합니다.

`categories`는 공통 X축이며 `series`의 각 항목은 고유 ID, 표시 이름,
범주와 길이가 같은 값 배열을 갖습니다. `null`은 결측값입니다. 선형·
영역 경로는 결측에서 끊고 막대는 그리지 않습니다. 계열은 같은
Y축을 쓰며 정적 범례와 범주·계열별 데이터 표를 제공합니다. 표는
데이터가 모두 결측이어도 남습니다. 색상은 semantic token을 혼합해
colormap과 함께 변하고, 선 패턴도 구분합니다.

[shadcn/ui Chart 공식 문서](https://ui.shadcn.com/docs/components/base/chart)의
다중 데이터 계열·범례 표현을 디자인 reference로 확인했습니다. 해당
구현은 Recharts를 사용하지만 이 변경에는 source 코드를 편입하거나
dependency를 추가하지 않았습니다.
[W3C WAI Complex Images](https://www.w3.org/WAI/tutorials/images/complex/)의
차트 설명·상세 데이터 대안에 맞춰 눈에 보이는 제목·설명과 숨겨진
데이터 표를 유지합니다. 실제 screen reader의 표 탐색은 미검증입니다.

누적 영역·계열 표시 toggle·tooltip은 아직 구현하지 않았습니다.
계열이 매우 많거나 범주 이름이 긴 경우의 시각 품질과 실제 보조기술,
touch·RTL 검사는 남아 있습니다. 변경은 로컬 작업 트리에만 있습니다.

## 검증

서버 렌더링에서 단일 계열 호환, 다중 계열 값·결측 상태, 누락·혼합 입력,
값 길이·중복 ID·무한값을 검사했습니다. 문서 Chromium에서 선형
2계열과 범례·표, 그룹 막대 12개, 영역 4개 경로, 결측 두 건과 빈
상태를 확인했습니다. 밝은/어두운 모드에서 두 계열 색상이 다르게
계산되는 것도 확인했습니다. Neutral에서 Pydemia colormap으로 바꾸면
두 계열의 계산된 색상이 함께 바뀌고 Neutral로 복원됩니다.

새 Vite 소비자에 `shadcn add`로 chart와 token을 설치했습니다. 설치된
source를 import해 typecheck·build가 통과했고, 브라우저에서 선형 두
경로와 막대 7개 전환 및 계열별 데이터 표를 확인했습니다. 설치본의
runtime `npm audit --omit=dev`는 0건이었습니다. 최종 source를 다시
registry로 설치했고 파일 해시가 저장소 source와 일치합니다.
`npm run typecheck`, `npm run build`, `npm run registry:check`가 통과했고
69개 registry item의 기본 공개 URL 산출물에 로컬 URL이 남지 않았습니다.
