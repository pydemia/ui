# 배포·레지스트리·검증 관점 독립 1차 검토

검토 기준은 `input/`에 보관된 2026-09-28 스냅샷입니다. 목표는 현재 35개
component를 출발점으로, 소비자가 재현 가능하게 설치하고 유지할 수 있는
ready-made component 공급입니다. 약 100개는 규모를 가늠하는 수치이며
완료 조건으로 취급하지 않았습니다. 다른 reviewer의 보고서는 읽지
않았습니다. 아래는 문서와 코드의 정적 검토 결과이며 설치·실행 시험을
새로 수행한 결과가 아닙니다.

## 지적

### DEL-01 · design prerequisite · 릴리스별 registry 원본과 복구 경로

- **유형·근거:** 빠진 배포 규칙입니다. `input/research/component-roadmap.md`
  28–31행은 버전 고정·변경 기록·릴리스 절차를 요구하지만, 어떤 URL과
  의존 item이 같은 버전을 가리키는지 정하지 않습니다. 현재
  `input/registry.json` 12–15행은 `pyd-button`이 상대 경로
  `./pyd-utils.json`을 참조합니다. 159–163행은 묶음의 설치 후 완료를
  판단합니다.
- **실패 조건:** 소비자가 `/r/pyd-button.json`을 설치한 뒤 같은 URL의
  내용이 다음 릴리스로 바뀌고, `pyd-utils`도 독립적으로 바뀌면 나중에
  동일 명령으로 원래 묶음을 재설치하거나 결함 릴리스를 되돌릴 수
  없습니다. 이 경로가 실제로 가변 URL로 배포되는지는 스냅샷에 없어
  확인하지 못했습니다.
- **기존 보호 장치·반증:** npm 의존성 버전은 `registry.json`에서
  고정하며, 로드맵은 버전 고정과 소비자 설치를 선행 과제로 명시합니다.
  다만 npm 버전 고정만으로 component JSON과 token의 원본 버전은
  고정되지 않습니다.
- **최소 변경:** 첫 소비자 배포 전에 릴리스 식별자, 불변 item URL,
  같은 릴리스 안에서의 `registryDependencies` 해석, 현재 버전 홍보
  경로, 실패 시 이전 릴리스로 되돌리는 절차를 한 단락으로 정합니다.
  고정 URL을 쓰든 Git revision을 쓰든 기존 item의 내용은 보존해야
  합니다.
- **수용 사례:** 릴리스 A 설치 후 B를 공개해도 A의 Button과 Utils를
  다시 받아 동일한 소스 집합을 얻습니다. B에 결함이 생겨 현재 버전
  안내를 A로 돌려도 A와 B의 고정 주소와 변경 기록은 유지됩니다.

### DEL-02 · design prerequisite · 소비자에게 token을 전달하는 경로

- **유형·근거:** 빠진 설치 입력입니다. `input/registry.json` 12–15행의
  Button item에는 TSX 파일·npm 의존성·Utils 참조만 있습니다.
  `input/packages/ui/src/components/button.tsx` 6–8, 13–18행은
  `--control-height`, `--space-3`, `bg-accent`, `border-border`,
  `bg-surface`를 사용합니다. `input/research/component-roadmap.md`
  20–22행은 소비자에서 token 적용을 검증 대상으로, 156–159행은 공통
  token과 설치 명령을 구현 조건으로 둡니다.
- **실패 조건:** 기존 workspace의 stylesheet가 없는 프로젝트에서
  component 파일만 설치하면 typecheck와 build가 통과하더라도 custom
  utility와 CSS 변수의 시각 결과가 빠질 수 있습니다. 실제 CLI
  결과물과 별도 token 설치 문서는 스냅샷에 없어 이 결과는 추정입니다.
- **기존 보호 장치·반증:** 로드맵은 token 적용을 별도 소비자 시험에
  포함합니다. 기존 preview의 시각 검사는 `verification.md` 109–110행에
  기록되어 있지만, 깨끗한 소비자 설치의 token 전달을 증명하지는
  않습니다. shadcn registry는 `cssVars`와 `css` 선언을 지원합니다
  ([공식 item 명세](https://ui.shadcn.com/docs/registry/registry-item-json)).
- **최소 변경:** token이 registry item, 별도 style item, 또는 명시적
  사전 설치 파일 중 어디에서 오는지 정하고 component 릴리스와 버전을
  연결합니다. 설치 설명에 순서와 실패 진단을 적습니다.
- **수용 사례:** 기존 pydemia 스타일이 없는 소비자 프로젝트가 공개
  명령만으로 Button과 AffixedInput을 설치합니다. light/dark 양쪽에서
  실제 계산된 색·높이·간격이 지정한 token을 사용하고, typecheck와
  production build가 통과합니다.

### DEL-03 · implementation validation · registry 설치물의 출처 고지

- **유형·근거:** 조건부 배포 위험입니다. `input/research/source-inventory.md`
  209–219행은 AI Elements의 고정 소스와 Apache-2.0을 확인하고
  Message·PromptInput을 간소화해 편입했으며 저장소의 notice와
  license 사본을 기록합니다. `input/registry.json` 178–185행의 두
  item은 component TSX와 다른 UI item만 나열합니다. 로드맵
  151–157행은 provenance·notice 동기화를 요구합니다.
- **실패 조건:** 두 파일이 원본 코드의 수정·재배포에 해당하고 CLI가
  나열된 item 파일만 소비자에게 전달한다면, 저장소의 별도 고지 파일은
  소비자에게 도달하지 않습니다. 수정 코드의 재배포 여부와 생성된
  JSON·설치 결과는 스냅샷만으로 확정할 수 없습니다. Apache-2.0의
  재배포 조건은 [공식 원문 4절](https://www.apache.org/licenses/LICENSE-2.0)
  에 있습니다.
- **기존 보호 장치·반증:** source inventory는 원본 revision과
  license를 연결하고 저장소에 notice·license 사본이 있다고 밝힙니다.
  이는 저장소 수준의 관리 근거이며 CLI 설치물의 전달 근거는 아닙니다.
- **최소 변경:** 두 component의 실제 복사·수정 범위를 provenance에서
  다시 판정하고, 필요한 고지·license가 소비자에게 어떻게 제공되는지
  item별 배포 규칙으로 정합니다. `registry:check`에 설치물 기준의
  고지 확인을 추가할 수 있습니다.
- **수용 사례:** 빈 소비자에 Message 또는 PromptInput을 설치해
  전달된 소스와 함께 적용 대상 license·출처 고지를 찾을 수 있습니다.
  참고만 한 코드라면 그 판단과 근거를 provenance에 명확히 남깁니다.

### DEL-04 · implementation validation · 기존 설치본 갱신 시험

- **유형·근거:** QA 범위의 공백입니다. `input/research/component-roadmap.md`
  35–37, 128–129행은 묶음별 소비자 설치 후 다음 묶음으로 진행하고,
  159–163행은 신규 설치와 API 회귀를 확인합니다. 설치된 소스의
  업데이트, 소비자 수정 파일과의 충돌, 실패 후 복구 사례는 지정하지
  않습니다.
- **실패 조건:** 소비자가 A1의 소스 한 파일을 로컬 수정한 뒤 새
  릴리스를 설치할 때 파일이 덮이거나 갱신되지 않은 채 새 의존성만
  들어오면, UI가 깨지거나 수정 내용이 사라질 수 있습니다. CLI의
  실제 충돌 동작은 시험하지 않았습니다.
- **기존 보호 장치·반증:** 로드맵 28–29행은 변경 기록과 회귀 검사,
  162–163행은 묶음의 API 변경 검토를 요구합니다. 이는 업데이트
  실패·복구 시험으로 구체화할 수 있는 좋은 출발점입니다. 공식 CLI는
  설치 전 파일을 비교하는 `--diff` 옵션을 제공합니다
  ([CLI 문서](https://ui.shadcn.com/docs/cli)).
- **최소 변경:** 신규 묶음의 완료 조건에 직전 공개 버전에서 갱신하는
  소비자 시험 하나를 추가합니다. 덮어쓰기·수동 병합·롤백 중 지원할
  경로와 충돌 시 사용자에게 보이는 안내를 기록합니다.
- **수용 사례:** 이전 버전을 설치하고 한 파일을 수정한 소비자에서
  다음 버전의 차이를 확인합니다. 수정 파일은 보존되거나 명시적
  충돌로 중단되며, 이전 버전 재설치 또는 백업 복원 경로가 동작하고
  최종 typecheck·build 결과가 기록됩니다.

### DEL-05 · implementation validation · package와 registry의 공개 심볼

- **유형·근거:** 확인이 필요한 API 차이입니다.
  `input/packages/ui/src/components/button.tsx` 42–43행은
  `Button`, `buttonVariants`, `ButtonProps`를 export하지만,
  `input/packages/ui/src/index.ts` 1행은 `Button`만 재export합니다.
  `input/registry.json` 12–15행은 파일 단위 설치를 제공합니다.
- **실패 조건:** 문서 예시 또는 내부 소비자가 `@pydemia/ui`에서
  `buttonVariants`나 `ButtonProps`를 import하도록 작성하면 root import가
  실패합니다. registry 설치의 로컬 파일 import는 성공할 수 있어
  전달 방식에 따라 문서 예시가 달라집니다. 해당 예시가 실제로
  존재하는지는 스냅샷에 없어 확인하지 못했습니다.
- **기존 보호 장치·반증:** 로드맵 18–19행이 현재 35개의 public
  export·registry·문서 일치 여부를 확인하도록 합니다. 패키지는
  30–31행에서 private workspace package로 구분해 npm 게시를
  전제로 하지 않습니다. 따라서 두 경로의 모든 내부 심볼을 동일하게
  노출해야 한다는 뜻은 아닙니다.
- **최소 변경:** 지원하는 소비 경로별 공개 심볼과 type export를
  명시하고, 문서 설치 명령·import 예시를 각 경로와 맞춥니다.
  `buttonVariants`의 공개가 의도되지 않았다면 예시에서 쓰지 않습니다.
- **수용 사례:** 지원한다고 문서화한 각 경로로 예시를 별도 소비자에서
  typecheck합니다. 공개하지 않는 심볼은 경로별 API 목록에 표시하며,
  신규 component를 추가할 때 같은 검사를 수행합니다.

## 검토 범위와 제외한 의심

`input/research/component-roadmap.md` 전체, `input/research/verification.md`
전체, `input/research/source-inventory.md` 전체,
`input/.worknotes/shadcn-component-library-handoff.md` 전체,
`input/registry.json` 전체, `input/packages/ui/src/index.ts` 전체를
읽었습니다. component 코드는 Button·AffixedInput·MetricCard·Snippet·
Table·Calendar·Dropzone의 공개 심볼·import·token 및 의존 관계를
중심으로 읽었습니다. Slider·Progress·Empty·Badge는 import/export
범위만 확인했습니다.

- `registry.json`의 item 수 36개와 로드맵의 component 35개가 다른
  것은 `pyd-utils` 공용 item 때문입니다(`registry.json` 6–10행,
  로드맵 3–4행). 개수 오류로 지적하지 않았습니다.
- 소비자 `shadcn add`가 아직 검증되지 않았다는 사실은 이미
  `verification.md` 120–121행과 로드맵 20–22행에 명시되어 있습니다.
  성공한 시험으로 취급하지 않았고, 미구현 자체를 결함으로 세지
  않았습니다.
- 로드맵 11–14, 183–189행은 후보 수를 채우지 않도록 기존 variant와
  조합을 먼저 검사합니다. 65개라는 숫자만으로 불필요한 component
  추가를 지적하지 않았습니다.

스냅샷에 없는 `components.json`, token CSS, 생성된 `/r/*.json`,
`registry/provenance.json`, `THIRD_PARTY_NOTICES.md`, package manifest,
소비자 설치 로그, 배포 설정은 읽지 못했습니다. CI·build·CLI·브라우저
검사는 실행하지 않았습니다. 위 DEL-02·03·05의 실제 소비자 영향은
해당 산출물에서 다시 확인해야 합니다.

## 읽은 스냅샷 식별값

아래 값은 SHA-256입니다. 상대 경로는 모두 `input/` 기준입니다.

| 파일 | SHA-256 |
| --- | --- |
| `research/component-roadmap.md` | `9424AD06AF107433714DE290110E9053B29DBADDDEE750E4380868D063F8ABA7` |
| `research/verification.md` | `E0966698D7398EB9D9D8C1578B32CFE0AE2E8FAA679D16F071702F237EC52B7E` |
| `research/source-inventory.md` | `6F99DAB1A2E8A117C0F76E741DEB0E494C621B0DCFE9F3A66C1C85F2A989975B` |
| `.worknotes/shadcn-component-library-handoff.md` | `1C0F7C9F6EAE6AAF2398C8DA358289FF8ACAB50BE088FE62F960F252B408C258` |
| `registry.json` | `B9944880FA51A8E0C793844FA87F4DD6E29A975C3C8D16C385D96DC4186A7D32` |
| `packages/ui/src/index.ts` | `0F08B836AC79294256E5A0C949353AB2BB27D5A98E91416DB9A0A11BB63B8D36` |
| `packages/ui/src/components/button.tsx` | `9166CF9EBE34244E0203ED5065A0CF157B8B1E54D5026224A386B2B4CF5748B4` |
| `packages/ui/src/components/affixed-input.tsx` | `A6B41558F9F98AEF15280E560416AF765F3403BE886ADDA095868B5F8949D90E` |
| `packages/ui/src/components/metric-card.tsx` | `CF17C8BA72F2C2C7D7912DCA52E18D3265318ED8466D6126017951A54C408899` |
| `packages/ui/src/components/snippet.tsx` | `B0CCC9C41EE7CA6F849F769CB08C1487972381EABC2A1F4D9175AFCA9EE22040` |
| `packages/ui/src/components/table.tsx` | `81210518FB04C92F074E2AF1D63AA33913DD3C587B644EBF5786685C9B29D49D` |
| `packages/ui/src/components/calendar.tsx` | `B62E01BC77539C1BC2ABD675A67F66AA995FD1B370E5FA760E1C14914CA1CEC5` |
| `packages/ui/src/components/dropzone.tsx` | `46D6EAFA650D621E2F036404DCB9CECA57F55551CE5E33B48DF37ED1B9167A81` |
