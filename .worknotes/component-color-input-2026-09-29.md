# ColorInput 편입

2026-09-29. Inputs 범주의 색상 입력을 `@pydemia/ui`와 내부 registry에
추가했습니다. 작업 트리는 71개 component, 73개 registry item입니다.

## 구현

- `ColorInput`은 native 색상 선택기와 `#RRGGBB` 텍스트 입력을 같은
  값에 연결합니다. controlled·uncontrolled 값, card/inline 표현,
  `name`을 통한 form 제출, 유효하지 않은 입력의 필드별 오류와 blur
  복원을 제공합니다. 값 변경 callback에는 소문자 hex를 전달합니다.
- 문서 사이트에 동작하는 preview와 사용 코드를 추가하고 기존
  Colormap 편집기의 개별 필드를 `ColorInput`으로 교체했습니다.
  palette 선택, 모드별 override, 초기화와 대비 계산은 문서 앱이
  계속 관리합니다.
- W3C WAI form label 지침과 WHATWG native color state 명세를
  참고했습니다. 외부 component source를 복사하지 않았으며 편입한
  upstream revision·LICENSE는 없습니다. 직접 registry 의존성은
  기존 `pyd-utils`뿐이고 새 npm dependency는 없습니다.

## 검증

- `npm run typecheck`, `npm run build`, `npm run registry:check` 통과.
  기본 공개 URL의 73개 registry item이 생성됐고 ColorInput·registry
  출력에는 로컬 URL이 남지 않았습니다.
- server render에서 form markup과 잘못된 label·색상·controlled
  props 거부를 확인했습니다.
- 문서 Chromium에서 유효한 입력과 form 제출, 무효 입력의 오류,
  blur 복원, inline 표현, Colormap token 즉시 반영, 밝은·어두운
  모드의 값 유지, 초기화를 확인했습니다.
- 새 Vite 소비자 fixture에 shadcn CLI로 ColorInput·tokens를
  설치했습니다. 생성된 3개 파일 중 ColorInput source hash는 저장소와
  일치합니다. 소비자 typecheck·build와 Chromium의 form 제출·오류
  표시를 확인했습니다. fixture는
  `%TEMP%/pydemia-ui-color-input-consumer-20260929`에 있습니다.

native picker에 값을 자동 주입했을 때 change가 전달되지 않아 실제
사용자 선택 동작은 검증했다고 판단하지 않았습니다. screen reader 발표,
다른 브라우저의 picker, 전체 registry item의 새 소비자 설치와 공개
배포도 확인하지 않았습니다.
