# 제품 UI 소비자·디자인 시스템 도입 관점의 독립 검토

## 범위와 입력

2026-09-28 동결 사본인 `input/`만 읽었습니다. 검토 대상은
`research/component-roadmap.md`, `.worknotes/shadcn-component-library-handoff.md`,
`research/source-inventory.md`, `research/verification.md`,
`registry.json`, `packages/ui/src/index.ts`,
`packages/ui/src/components/{table,empty,dropzone,affixed-input,metric-card}.tsx`
전체입니다. 다른 reviewer의 보고서는 읽지
않았습니다. 아래 경로와 줄 번호는 모두 `input/`을 기준으로 합니다.

| 파일 (`input/` 아래) | SHA-256 |
| --- | --- |
| `research/component-roadmap.md` | `9424AD06AF107433714DE290110E9053B29DBADDDEE750E4380868D063F8ABA7` |
| `.worknotes/shadcn-component-library-handoff.md` | `1C0F7C9F6EAE6AAF2398C8DA358289FF8ACAB50BE088FE62F960F252B408C258` |
| `research/source-inventory.md` | `6F99DAB1A2E8A117C0F76E741DEB0E494C621B0DCFE9F3A66C1C85F2A989975B` |
| `research/verification.md` | `E0966698D7398EB9D9D8C1578B32CFE0AE2E8FAA679D16F071702F237EC52B7E` |
| `registry.json` | `B9944880FA51A8E0C793844FA87F4DD6E29A975C3C8D16C385D96DC4186A7D32` |
| `packages/ui/src/index.ts` | `0F08B836AC79294256E5A0C949353AB2BB27D5A98E91416DB9A0A11BB63B8D36` |
| `packages/ui/src/components/table.tsx` | `81210518FB04C92F074E2AF1D63AA33913DD3C587B644EBF5786685C9B29D49D` |
| `packages/ui/src/components/empty.tsx` | `38A66395B54D31C850D2ADF7D55E8B53EDEA82EE6843B8F11F0CACE5BFDE4778` |
| `packages/ui/src/components/dropzone.tsx` | `46D6EAFA650D621E2F036404DCB9CECA57F55551CE5E33B48DF37ED1B9167A81` |
| `packages/ui/src/components/affixed-input.tsx` | `A6B41558F9F98AEF15280E560416AF765F3403BE886ADDA095868B5F8949D90E` |
| `packages/ui/src/components/metric-card.tsx` | `CF17C8BA72F2C2C7D7912DCA52E18D3265318ED8466D6126017951A54C408899` |

### CON-01 · 관리 목록의 완료 시점과 우선순위

- **중요도/유형:** 설계 선결(design prerequisite) · 조건부 위험.
- **근거:** `research/component-roadmap.md:56-61,113-116,128-147`은
  `Pagination`을 A3, 선택 가능한 `DataTable`을 A4, 선택 후 실행할
  `ActionBar`를 D에 둡니다. 앞 묶음의 소비자 설치·회귀 확인 전에는 다음
  묶음의 public API를 확정하지 않는다고 명시합니다.
  `research/source-inventory.md:20-21`과
  `packages/ui/src/components/table.tsx:4-29`상 현재 `Table`은 정적 표
  요소만 제공합니다.
- **실패 조건:** 목록·검색·행 선택·일괄 처리가 반복되는 소비자 화면이
  A4 시점에 필요하다면, A3의 `HoverCard`·`CommandPalette` 완료를 먼저
  기다리고 A4 뒤에도 선택 후 action 배치와 선택 해제를 앱마다 작성하게
  됩니다. 이런 화면의 실제 빈도는 동결 자료만으로 확인되지 않습니다.
- **기존 보호 장치/반증:** A4가 `DataTable`과 `DateRangePicker` 등을
  별도로 검증하고, `DataTable`의 정렬·필터·선택·페이지 상태와 서버 요청
  책임을 분리합니다(`research/component-roadmap.md:136,165-167`).
  `ActionBar`도 후보에는 있습니다. 따라서 누락보다는 단계 간 분리가
  문제입니다.
- **최소 변경:** A의 순서를 독립 component 개수보다 소비자 화면 단위로
  재검토합니다. 반복 사용처가 확인된 경우 `DataTable`·`Pagination`과
  선택 후 action/선택 해제의 최소 조합을 같은 완료 묶음에 넣거나,
  `DataTable`의 명시적 action slot으로 처리합니다. 이 묶음이
  `HoverCard`·`CommandPalette` 완료에 종속될 이유가 없다면 순차 gate를
  분리합니다. 별도 `ActionBar` 수량을 반드시 늘릴 필요는 없습니다.
- **수용 사례:** 별도 소비자 프로젝트의 목록에서 검색 또는 필터를 적용하고
  페이지를 이동한 뒤 여러 행을 선택하여 action을 실행·취소할 수 있습니다.
  결과에 따라 선택·빈 상태·오류 표시가 일관되게 바뀌며 앱 전용 일괄
  action UI를 다시 만들지 않습니다.

### CON-02 · A1 기본 form의 조합 수용 조건

- **중요도/유형:** 구현 검증(implementation validation) · 완료 기준 공백.
- **근거:** `research/component-roadmap.md:44-50,131-135`는 A1을
  `Field`·`Select`·`Combobox`·`DatePicker`로 만든 “기본 생성·편집 form”으로
  정의합니다. component별 명세와 여러 component의 값·오류·focus 공유는
  요구하지만(`research/component-roadmap.md:140-161`), 제출 시 오류에서
  재제출까지의 조합 사례는 적지 않았습니다.
  `research/source-inventory.md:33-36`도 복잡한 form validation을 기존
  milestone의 gap으로 기록합니다.
- **실패 조건:** 필수 `Select`와 날짜 입력이 있는 편집 form에서 첫 제출이
  유효성 오류로 막히고 다음 제출에서 서버 오류가 나면, 앱마다 첫 오류
  focus, 설명 연결, 입력값 유지, 재제출 중 상태를 다르게 구현할 수
  있습니다. 이는 component 자체 결함을 입증한 것이 아니라 A1의 조합
  완료 조건이 아직 구체적이지 않다는 지적입니다.
- **기존 보호 장치/반증:** `Field`는 label·설명·필수·오류를 control과
  연결하도록 계획됐고(`research/component-roadmap.md:44`), 공통 절차는
  오류·focus 규칙과 소비자 설치를 요구합니다
  (`research/component-roadmap.md:153-163`). 별도 범용 `Form` component가
  반드시 필요하다는 근거는 없습니다.
- **최소 변경:** A1의 조합 화면 수용 사례에 필수값 누락, 잘못된 값,
  비동기 제출 오류, 수정 후 재제출을 추가하고, `Field`와 입력류가 오류
  설명·focus·disabled 상태를 어떻게 공유할지만 명시합니다. 검증 상태와
  서버 호출의 소유권은 소비자 앱에 둘 수 있습니다.
- **수용 사례:** A1 설치본으로 두 control의 필수 입력 form을 만들고 빈
  제출 시 오류가 발표되며 첫 오류 control로 이동합니다. 값을 고친 뒤
  제출 오류가 발생해도 값은 유지되고, 재제출에 성공하면 오류 상태가
  제거됩니다. 검증은 실제 소비자 조합 화면에서 수행합니다.

### CON-03 · 공통 화면 골격의 재사용 판단 시점

- **중요도/유형:** 선택 개선(optional) · 조건부 범주 공백.
- **근거:** `research/component-roadmap.md:75-79,108-117`은 `Sidebar`를
  B, header·sidebar·content를 묶는 `AppShell`을 D의 전문 작업 화면에
  둡니다. 반면 handoff는 실제 화면의 일관된 조합을 reusable block/profile로
  검증하도록 적었습니다
  (`.worknotes/shadcn-component-library-handoff.md:391-403`). 로드맵의 조합
  화면은 검증 대상으로는 명시되지만 재사용 가능한 설치 예시·recipe로
  남기는지는 명시되지 않았습니다
  (`research/component-roadmap.md:138-141,156-163`).
- **실패 조건:** 여러 소비자 앱에 같은 header·sidebar·content 배치가
  실제로 반복된다면, component별 preview는 있어도 화면 골격의 좁은
  화면 전환과 밀도 규칙을 각 앱이 다시 결정할 수 있습니다. 현재 자료에는
  반복 앱 수나 layout 요구가 없어 `AppShell` 조기 구현의 필요성은 확정할
  수 없습니다.
- **기존 보호 장치/반증:** 로드맵은 실제 소비자 용례를 먼저 확인하고,
  D의 반복 사용처가 없으면 보류하도록 합니다
  (`research/component-roadmap.md:110-111,149-150`). 공통 골격이 필요 없는
  소비자라면 이 공백은 발생하지 않습니다.
- **최소 변경:** A/B 조합 화면 검증 때 화면 골격이 두 곳 이상에서 실제로
  반복되는지만 기록합니다. 반복이 확인되면 기존 component를 조합한
  설치 가능한 예시를 먼저 제공하고, 독립 동작 규칙이 확인될 때만
  `AppShell` 후보의 순서를 앞당깁니다.
- **수용 사례:** 반복 layout이 확인된 두 소비자 화면에서 동일한 예시를
  설치해 좁은 화면 전환·active navigation·content 배치를 같은 규칙으로
  재현합니다. 반복이 확인되지 않으면 D 보류 결정을 기록하면 됩니다.

## 제외한 의심과 미검증

- 65개를 정확히 채우려는 계획으로 판단하지 않았습니다. 로드맵은
  약 100개를 기준점으로만 쓰고, 기존 조합으로 충분한 후보는 새 component로
  만들지 않으며 사용처가 없으면 보류한다고 명시합니다
  (`research/component-roadmap.md:9-14,35-37,110-111`).
- `IconButton`·`EmptyState`·`Sheet`가 빠진 것을 범주 누락으로 세지
  않았습니다. 기존 `Button`·`Empty`·`Drawer`로 해결 가능한지 확인하는
  기준이 있습니다(`research/component-roadmap.md:183-186`;
  `packages/ui/src/components/empty.tsx:4-40`).
- `FileUpload`에 전송 구현이 없다는 지적은 제외했습니다. 전송은 상위
  앱이 제공하고 component는 진행·실패·재시도 UI에 연결한다는 책임이
  적혀 있습니다(`research/component-roadmap.md:143-147`).
- 실제 소비자 사용 빈도, 팀별 화면 수, 35개 component의 원격 설치 결과는
  동결 자료에서 확인할 수 없었습니다. `research/verification.md:99-121`의
  검사 결과를 읽었으며 이번 검토에서 코드 실행·브라우저 검사·사용자
  조사는 하지 않았습니다. 사본에 없는 소비자 앱과 문서 사이트의 실제
  화면, 다른 reviewer 보고서는 검토하지 않았습니다.
