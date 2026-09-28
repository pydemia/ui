# Component 구현 출처 재검토

2026-09-29 기준 `main`의 40개 registry item(컴포넌트 38개)을
검토했습니다. 사용자는 디자인 reference를 남기되 구현 코드는 shadcn/ui
기반이거나 `pydemia/ui` 자체 코드이길 요청했습니다.

## 확인한 상태

- `registry/provenance.json`은 Origin UI의 AffixedInput, Kibo UI의
  Snippet·Dropzone, AI Elements의 Message를 `modified` source로
  표시했습니다. PromptInput도 AI Elements의 adaptation으로
  표시했습니다.
- MetricCard는 자체 구현인데 source provider에 Tremor reference가
  함께 들어 있었습니다. Label·Badge·Table 역시 자체 코드와
  shadcn/ui convention을 한 source 필드에 섞어 기록했습니다.
- Dropzone은 Kibo UI component를 직접 import하지는 않았으나
  `react-dropzone`을 runtime과 registry dependency로 사용했습니다.
- 나머지 26개 component는 고정 revision의 shadcn/ui source를
  변형한 항목입니다. 해당 MIT notice는 유지해야 합니다.
- 저장소 루트에 공개 LICENSE가 없습니다. metadata의
  `project-owned`는 소유 구분이지 외부 사용자에게 주는 사용 허가가
  아닙니다.

## 이번 결정

- source는 현재 배포하는 구현 코드의 출처만 표시합니다.
  다른 library에서 관찰한 디자인·동작은 별도 `reference`로
  표시합니다. reference license는 현재 코드의 license로 표시하지
  않습니다.
- AffixedInput은 내부 Input·Label, Snippet은 내부 Tabs·Button,
  Message와 PromptInput은 내부 component 조합을 사용합니다.
  기존 공개 API와 preview의 동작은 유지합니다.
- Dropzone은 native file input과 drag/drop 이벤트로 다시 작성하고
  `react-dropzone` dependency를 제거합니다. 형식·크기·개수 오류는
  자체 코드에서 계산하고 기존 callback 형태를 유지합니다.
- 과거 출처 기록은 Git history와 기존 research 기록에 남깁니다.
  Origin UI·Kibo UI·AI Elements의 이전 adaptation notice도
  귀속 표기로 보존합니다. 현재 코드의 구현 출처와 과거 notice를
  동일한 뜻으로 표시하지 않습니다.

## 검증 상태

| 검사 | 결과 | 범위 |
| --- | --- | --- |
| `npm run typecheck` | pass | UI와 문서·예시 TypeScript |
| `npm run build` | pass | 40개 registry JSON, 두 정적 사이트 |
| `npm run registry:check` | pass | 출처 허용 목록, reference URL, 의존성·파일 |
| Dropzone 파일 선택 | pass | PNG 선택과 선택 파일 이름 표시 |
| Dropzone 형식·크기 거부 | pass | TXT 오류, 1 MB 초과 PNG 오류 |
| Dropzone 키보드 | pass | Enter로 native file chooser 열기 |
| 문서 metadata | pass | 자체 source, Kibo UI·Origin UI reference, 공개 사용 조건 미지정 표시 |
| Vercel production | pass | `975c729`, `dpl_8DvfHEEXwQuEsSPRQChHKv8VofXs` READY |
| 공개 사이트·registry | pass | `ui.pydemia.ai` 표시, Dropzone JSON에 `react-dropzone` 없음 |
| 실제 drag/drop·개수 제한 | 미검증 | 브라우저 자동화에서 파일 drag를 실행하지 않음 |
| 실제 screen reader | 미검증 | role·aria 속성과 상태 DOM만 확인 |

문서 빌드에는 기존의 500 kB 초과 chunk 경고가 남습니다.
실제 법률 검토나 제3자 소스와의 유사성에 대한 독립 법률 판정은
수행하지 않았습니다. 공개 배포·재사용 조건은 저장소 전체 LICENSE
결정 후 명시해야 합니다.
