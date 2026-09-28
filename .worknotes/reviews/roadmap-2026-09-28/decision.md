# Component roadmap 교차 검토 판정

검토 대상은 [manifest.md](manifest.md)에 해시와 Git HEAD를 기록하고
`input/`에 보존한 2026-09-28 작업 트리 사본입니다. 적용한 지침은
[persona-cross-review](https://skills.pydemia.ai/skills/persona-cross-review)
사이트의 표시 revision `931d437ed7c9`입니다. 세 reviewer는 같은 사본을
서로의 결과 없이 읽고 [소비자 관점](consumer.md),
[API·접근성 관점](api.md), [공급·검증 관점](delivery.md)에 각각 기록했습니다.
동일 모델의 여러 검토 결과가 일치한다는 사실을 정답의 증거로 세지
않았습니다. 조정자는 현재 코드와 빌드·문서 경로를 다시 확인했습니다.
검토 입력 roadmap의 SHA-256은 manifest에 있습니다. 수정 후
[roadmap](../../component-roadmap.md)의 SHA-256은
`ba18c2463d1b65e20341f53fae920529f6bb0f7a3382b609ef2d36fc027440d8`
입니다.

## 판정과 반영

| 원 지적 | 판정 | 판단 근거와 로드맵 수정 |
| --- | --- | --- |
| CON-01, API-03 | 채택 | `Table`은 정적 표이고 목록 선택·페이지 동작은 아직 없습니다. `Pagination`·`DataTable`·선택 action을 한 소비자 흐름에서 검증하도록 묶었습니다. 페이지 기준과 행 ID·선택 유지 범위를 선행 명세로 추가했습니다. |
| CON-02, API-01 | 채택 | `AffixedInput`·`Dropzone` 등은 label을 내부에서 소유합니다. `Field`가 모든 control을 같은 방식으로 감싼다고 가정하지 않고 이름·오류 ID·form 값의 연결 표와 오류 후 재제출 사례를 추가했습니다. |
| CON-03 | 일부 채택 | 반복되는 공통 골격의 소비자 증거는 없습니다. `AppShell`을 앞당기지 않고 설치 가능한 recipe와 좁은 화면 검증을 우선하도록 적었습니다. |
| API-02 | 채택 | `Calendar`는 `DayPicker` props를 노출하지만 DatePicker의 저장 값 의미는 아직 없습니다. 단일 날짜의 빈 값·직렬화·시간대 원칙을 첫 폼 묶음의 선행 결정으로 추가했습니다. |
| API-04 | 채택 | 현재 `Dropzone`은 선택 이름·거부 오류를 내부 상태로 가집니다. 업로드의 진행·실패·취소와 모순되지 않도록 상태 소유·발표 우선순위를 파일 묶음에 추가했습니다. |
| API-05 | 채택 | `Carousel`은 미구현입니다. 자동 재생을 기본 off로 명시하고 사용 시 중지·재시작·focus 처리 기준을 후보 설명에 넣었습니다. |
| API-06 | 구현 검증으로 이관 | `MetricCard`는 수치·변화량을 이미 표시합니다. `Stat`의 card 없는 반복 용례가 확인되기 전에는 별도 API로 확정하지 않도록 했습니다. |
| DEL-01 | 채택 | `scripts/build-site.mjs`는 `docs/`를 재생성하고 현재 item은 상대 경로 dependency를 사용합니다. 불변 release 식별자·dependency 묶음·이전 버전 복구를 공급 선결 작업에 넣었습니다. 구현 방식은 소비자 설치 시험 전에 결정합니다. |
| DEL-02 | 채택 | component는 CSS variable과 Tailwind token을 쓰지만 `registry.json`에는 token 공급 item이 없습니다. 기존 README의 수동 stylesheet 안내만으로 자동 설치를 주장하지 않고 전달 방식 결정·깨끗한 소비자 검증을 추가했습니다. |
| DEL-03 | 구현 검증으로 이관 | `Message`·`PromptInput`은 provenance에 Apache-2.0 수정/적응 source로 기록됐고 repository에는 notice가 있습니다. 현재 item은 고지 파일을 나열하지 않습니다. 실제 설치물의 전달 범위를 확인한 뒤 필요한 고지 방식을 결정하도록 추가했습니다. 법률 위반 여부를 이 검토에서 판정하지 않았습니다. |
| DEL-04 | 채택 | 기존 로드맵은 최초 설치만 구체적으로 요구했습니다. 직전 버전에서 갱신·충돌·복구하는 소비자 시험을 ready-made 완료 조건에 추가했습니다. |
| DEL-05 | 일부 채택 | 패키지 root와 registry 파일의 모든 내부 export가 같아야 한다는 근거는 없습니다. 대신 지원 경로별 공개 심볼·type과 import 예시를 명시하고 각각 typecheck하도록 했습니다. |

원본 계획이 정확히 65개 후보를 나열한 것은 확인됐지만 개별 항목을
숫자 때문에 넣었다는 증거는 아닙니다. 다만 35+65를 완료 목표처럼
읽을 여지가 있어 수량 제목과 순차 release 약속을 제거했습니다.
`Stat` 등 겹칠 수 있는 항목은 구현 전 판정 대상으로 바꾸고,
`InputGroup`·`RangeSlider` 등 성급히 제외한 항목은 미결정 경계에
복원했습니다. 이는 reviewer 지적과 기존 handoff의 통합 기준을 함께
적용한 조정 결정입니다.

## 남은 검증

- 실제 소비자 프로젝트의 component 반복 빈도와 공통 화면 골격은
  자료가 없어 확인하지 못했습니다. 후보별 우선순위는 해당 근거가
  확보될 때 갱신해야 합니다.
- 새 registry release 경로, token 설치, license 고지 전달,
  `shadcn add`·갱신·복구는 계획에 반영했으며 실행하지 않았습니다.
- 이 검토는 문서와 코드의 정적 검토입니다. UI typecheck, build,
  browser 조작, screen reader 검사는 새로 수행하지 않았습니다.
- 실제 사용 모델과 reasoning effort는 신뢰할 수 있는 runtime 값이
  없어 기록하지 않았습니다. 지침상의 권장 설정은 실제 실행값으로
  간주하지 않았습니다.
