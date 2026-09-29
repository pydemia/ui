# Spinner 형태 확장

2026-09-29. 진행 중 상태를 여러 화면 밀도에 맞게 표현하도록 기존
Spinner를 icon·ring·dots·bars·orbit 다섯 형태로 확장했습니다. 별도
component나 registry item을 늘리지 않아 총수는 75개 component,
77개 registry item입니다.

## 구현과 출처

- `packages/ui/src/components/spinner.tsx`: icon은 기존 Lucide
  `LoaderCircle`을 사용합니다. ring·dots·bars·orbit은 SVG 도형으로
  표시하고 `data-variant`를 노출합니다. 모든 형태에 `role="status"`와
  기본 `aria-label`을 둡니다. 외부 입력이 잘못된 variant를 보내면
  `RangeError`를 던집니다.
- 애니메이션은 Tailwind utility를 사용합니다. `motion-reduce`에서
  도형이 정지하도록 각 애니메이션 요소에 `animate-none`을 지정했습니다.
  색상은 `text-accent`를 사용합니다.
- `apps/docs/src/catalog.tsx`: 다섯 형태의 동작하는 preview와 사용
  코드를 표시합니다.
- shadcn/ui 공식 문서, 고정 revision의 Spinner source와 동일 revision의
  MIT LICENSE를 확인했습니다. 새 SVG 형태는 이 저장소에서 작성했고
  추가 npm dependency는 없습니다. 기존 `lucide-react@0.468.0`과
  `pyd-utils`를 재사용하며 registry MIT 고지도 유지합니다.

## 검증

- `npm run typecheck`, 기본 URL의 `npm run build`,
  `npm run registry:check`가 통과했습니다. 생성된 registry item은
  77개이고 생성 파일에 로컬 URL이 남지 않았습니다.
- 문서 브라우저에서 다섯 `status` 이름과 SVG 형태, 밝은·어두운
  모드의 accent 색상을 확인했습니다. 로고 헤더의 border 제거도
  두 모드에서 확인했습니다.
- 새 임시 소비자 프로젝트에 로컬 registry URL로 Spinner와 tokens를
  설치했습니다. Spinner·utils·tokens·MIT 고지 4개 파일이 생성됐고
  설치한 Spinner source는 저장소 원본과 일치합니다. 소비자
  typecheck·build와 브라우저의 다섯 형태·이름·색상 확인이
  통과했습니다. `npm audit --omit=dev --audit-level=high`는 0건입니다.
- server render에서 다섯 variant의 markup과 알 수 없는 variant의
  `RangeError`를 확인했습니다. 변경 CSS·TSX의 `git diff --check`가
  통과했습니다.

OS의 reduced motion 설정을 켠 실제 브라우저, screen reader, 다른
브라우저는 검증하지 않았습니다. 전체 registry item 재설치와 원격
배포도 이번 작업 범위에서 실행하지 않았습니다.
