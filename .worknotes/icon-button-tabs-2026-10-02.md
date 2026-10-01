# IconButton·Tabs 표시 형태

2026-10-02 시작 공개 기준은 109개 component·111개 registry item·
28개 snapshot, goal 관리용 추정 약 84%입니다. 기존
`Button size="icon"`은 접근 가능한 이름을 강제하지 않습니다.
`Tabs`는 한 가지 표시 형태만 제공합니다.

`IconButton`은 `label`·`icon`을 필수로 받는 원본 wrapper이며
`Button`의 token·variant·native 동작을 사용합니다. PasswordInput의
표시 toggle, Carousel의 이전·다음, Sidebar의 접기 control에
연결했습니다. `TabsList`에는 기본 표시를 보존하면서 `line`과
`contained`를 추가했습니다. 상태·방향키·focus는 기존 Radix Tabs에
남습니다. 새 npm 의존성은 없습니다. source, LICENSE, 정확한
Radix 배포 버전과 접근성 근거는
[source inventory](../research/source-inventory.md)에 기록했습니다.

## 현재 검증

- `npm run typecheck` 통과. 패키지·프로필 예시·문서의 TypeScript를
  검사했습니다.
- UI 테스트 128/128 통과. IconButton의 이름·아이콘·native 버튼과
  Tabs 세 형태의 tab/panel 역할을 포함합니다.
- `npm run build` 통과. registry 112개 item, 문서·프로필 예시가
  생성됐습니다.
- 로컬 Chromium: IconButton 클릭·Space로 수량 변경, Tabs의 line·
  contained 전환과 ArrowRight 선택·panel 전환을 확인했습니다.
  390px dark에서 contained 배경과 body 폭 390px, page error 없음도
  확인했습니다.
- PasswordInput은 Space로 표시 전환 뒤 입력값 유지,
  Carousel은 Enter로 슬라이드 이동과 focus 유지, Sidebar는
  Enter로 접기 뒤 이름·`aria-expanded` 변화를 확인했습니다.
- 새 Vite 소비자에서 로컬 registry의 tokens·IconButton·Tabs·
  PasswordInput·Carousel·Sidebar를 `shadcn@4.21.0 add`로 함께
  설치했습니다. 전이 의존성을 포함한 12개 파일이 생성됐습니다.
  변경 source 5개의 LF 기준 내용이 저장소와 일치했고 소비자
  typecheck·build가 통과했습니다. 설치된 소비자의 브라우저 동작은
  별도로 실행하지 않았습니다. 이후 production base로 registry와
  문서를 재생성했고 `docs/r`에 로컬 URL이 남지 않았습니다.
- source commit `2a48e96`의 provenance와 LF SHA-256을 소비자
  MIT 고지에 고정했습니다. `registry:check`는 112개 item·110개
  export/catalog 대응과 기존 28개 snapshot을 확인했습니다.
  29번째 snapshot
  `sha256-42069de52f0bbf1f184a08610fc1a18c86b53cf2737bd259d616bb446db8cb1c`
  을 생성했고 `registry:release-check`가 현재 빌드와의 일치를
  확인했습니다.

## 공개 확인

PR #45의 Verify UI가 통과했고 병합 commit `adffdc0`의 Verify UI·
Pages도 통과했습니다. Vercel 배포 상태는 success입니다. 공개
`ui.pydemia.ai`에서 IconButton preview 클릭으로 수량이 바뀌고
Tabs의 contained 선택이 적용되는 것을 Chromium에서 확인했습니다.
두 페이지의 page error는 없었습니다. 공개 29번째 snapshot
manifest의 ID·112개 item과 IconButton·Tabs JSON의 새 source를
확인했으며 문서 URL은 HTTP 200입니다.

공개 기준 110개 component·112개 registry item·29개 snapshot입니다.
goal 관리용 추정을 **약 84% → 약 85%**로 조정합니다. 이름 있는
아이콘 작업과 탭 표시 선택지가 공개됐고, 새 registry 의존 경로의
소비자 설치가 확인된 점을 반영했습니다. 공개 snapshot의 별도
소비자 재설치, 실제 screen reader·touch·Safari·RTL과 rollback 뒤
URL 보존은 미검증입니다.
