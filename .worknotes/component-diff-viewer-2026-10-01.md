# DiffViewer 작업 기록

## 시작 상태와 판정

- Goal 관리용 진척도: 약 80%. 현재 103개 component, 105개 registry
  item, 공급·품질 체크리스트 완료 5/10.
- `CodeBlock`은 단일 문자열, `LogConsole`은 시간·수준별 로그를
  표시합니다. 변경 전후의 줄 번호·추가·삭제·문맥을 같은 화면에서
  비교하는 상태는 없습니다. 코드 검토와 설정 변경 검토에 반복
  사용하므로 `DiffViewer`를 별도로 편입합니다.
- 사용자별 변경 승인·댓글 저장이나 patch 적용은 소비자가 소유합니다.

## 설계 범위

- `before`·`after` 문자열의 줄 비교와 통합·좌우 보기를 제공합니다.
  줄 번호, 빈 줄, 끝 줄바꿈 차이를 구분합니다.
- 동일한 앞뒤 문맥을 먼저 분리하고 나머지에는 결정적인 최장 공통
  부분열을 적용합니다. 비교 표가 100만 칸을 넘으면 앞뒤 문맥만
  정렬하고 중간은 전부 삭제·추가로 보여 주며 축약 비교임을 밝힙니다.
  큰 입력에서도 변경 내용을 숨기거나 결과를 같다고 표시하지 않습니다.
- native table의 열 제목과 변경 종류 텍스트, 이름 있는 키보드 스크롤
  영역, 공통 token을 사용합니다. 원본 React 구현이며 새 runtime
  dependency는 추가하지 않습니다.
- 공식 React Diff Viewer README·동일 revision source·manifest·MIT
  LICENSE는 용례 reference로만 확인했습니다. source를 복사하지
  않습니다.

## 검증 계획

- 추가·삭제·같은 줄·중복 줄·빈 줄·끝 줄바꿈·큰 변경, 두 보기와
  잘못된 입력을 패키지 테스트로 확인합니다.
- typecheck, build, registry:release-check와 문서 preview, 별도 소비자
  공개 snapshot 설치·390px 브라우저·키보드 스크롤을 검사합니다.
- 실제 screen reader·touch·Safari·RTL은 실행 전까지 미검증입니다.

## 현재 검증

- `npm run typecheck` 통과. 전용 SSR 테스트 6/6 통과. 중복 줄·
  빈 줄·끝 줄바꿈·큰 변경, HTML 문자 escaping을 확인했습니다.
- 최종 전체 패키지 테스트 110/110 통과. `npm run build`로 106개
  registry item과 문서·프로필 예시 생성에 성공했습니다.
- 로컬 390px Chromium에서 통합 7행(추가 2·삭제 2), 내부 영역
  328px/내용 536px, body·viewport 390px을 확인했습니다. 스크롤
  영역에 포커스를 두고 ArrowRight를 누르자 `scrollLeft`가 0→40으로
  이동했습니다. 좌우 보기의 4열·5행과 줄바꿈 시 최소 너비 640px,
  내부 가로 스크롤·body 390px을 확인했습니다.
- 좌우 보기 줄바꿈의 첫 시안은 390px에서 코드 열이 몇 글자씩
  끊겼습니다. 최소 표 너비를 준 뒤 light·dark 화면을 이미지로 다시
  확인했습니다. 추가·삭제 줄에 색 외에 보이는 `+`·`−`를 넣고
  최종 통합 보기의 표식도 Chromium에서 확인했습니다.
- registry release 검사·소비자·공개 배포는 아직 실행하지 않았습니다.
