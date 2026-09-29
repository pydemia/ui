# 기존 component 상호작용 재검사

2026-09-29 로컬 작업 트리의 `Dropzone`, `Calendar`, `Slider`,
`Avatar`를 재검사했습니다. component 구현과 registry item은 이번에
변경하지 않았습니다. 문서 preview와 사용 코드에서 기존 기능을 직접
조작할 수 있도록 예시를 확장했습니다.

| 대상 | 확인한 동작 | 남은 검증 |
| --- | --- | --- |
| Dropzone | Chromium의 native file chooser에서 PNG 2개 선택; TXT 형식, 128KB 초과, 3개 선택을 각각 거부하고 기존 선택 파일을 유지 | OS 파일 drag/drop, 실제 screen reader 발표 |
| Calendar | `mode="range"`, `min={1}`에서 첫 날짜는 미완료, 두 번째 날짜는 9월 15–18일 범위로 표시 | 다른 호스트 시간대에서 `timeZone` 동작, RTL, 실제 screen reader |
| Slider | 두 thumb의 접근 가능한 이름 확인; ArrowRight/ArrowLeft로 20–80에서 21–79로 변경 | pointer drag, 실제 touch, 실제 screen reader |
| Avatar | 로컬 SVG의 이미지 로드(`naturalWidth=150`), 실패한 이미지와 이미지 없는 항목의 텍스트 fallback 표시 | 실제 screen reader의 대체 텍스트 발표 |

`Calendar` 예시는 설치된 `react-day-picker@9.14.0`의 `TZDate`와
`timeZone` prop을 사용합니다. 범위 선택에서 `min={1}`은 첫 클릭의
부분 선택을 예시에서 드러내기 위해 넣었습니다. 현재 검사는
Asia/Seoul 설정과 같은 시간대의 브라우저에서 수행했으므로 다른
호스트 시간대의 날짜 경계는 검증하지 않았습니다.

참고한 upstream 공식 문서:
[DayPicker range](https://daypicker.dev/selections/range-mode),
[DayPicker time zone](https://daypicker.dev/localization/setting-time-zone),
[Radix Slider](https://www.radix-ui.com/primitives/docs/components/slider).
time zone 문서의 최신 예시와 설치된 9.14.0의 import 경로는 다를 수
있어, 실제 사용 코드는 설치된 패키지의 type declaration과
`npm run typecheck`로 확인했습니다.

문서의 `Avatar` 예시 이미지는 프로젝트에서 작성한
`apps/docs/public/avatar-demo.svg`이며 빌드 결과
`docs/avatar-demo.svg`에 포함됐습니다. `Dropzone` 검사의 PNG·TXT
fixture는 workspace 밖의 임시 경로에 만들었습니다. 서버 전송은
실행되지 않았습니다.

검사 명령: `npm run typecheck`, `npm run build`,
`npm run registry:check`, `git -c core.safecrlf=false diff --check`
모두 통과했습니다. 빌드의 500KB 초과 chunk 경고는 남아 있습니다.
이번 검사로 roadmap의 기존 상호작용 항목을 완료 처리하지 않습니다.
파일 drag/drop과 touch 등 명시된 조건이 남았습니다.
