# Sidebar 링크 표시 형태

## 공개 상태

PR #152가 `main`의 `7ea06aab`로 병합됐습니다. PR과 `main`의
Verify UI, `main`의 Pages가 통과했고 Vercel production
`dpl_A4aKid5rZSsHtcXEYHtPVXKn9YU3`가 READY입니다.
사용자 도메인의 81번째 manifest·Sidebar item과 현재 Sidebar item은
HTTP 200입니다. 공개 manifest·snapshot item은 저장소 내용과
일치합니다. 공개 문서에서 `filled`를 선택했을 때 활성 링크 배경은
accent token이고 Usage에 `linkVariant="filled"`가 있습니다.
실제 screen reader·touch·Safari는 실행하지 않았습니다.

## 범위

`SideNavLink`에는 `rail`과 `filled`가 있었지만 이를 내부에서
렌더링하는 `Sidebar`는 선택값을 받지 않았습니다. `linkVariant`를
추가해 두 표시를 데스크톱·모바일 탐색에 전달합니다. 기본 `rail`과
현재 페이지, 접힘, 섹션, Drawer 제어는 유지합니다. 새 component나
registry item, npm dependency는 없습니다.

문서 preview에서 두 표시를 전환하고 현재 영역을 선택할 수 있으며,
Usage는 `filled` 예시를 보여 줍니다. 원본 구현의 기존 링크를
조합한 변경이므로 새로운 외부 코드·LICENSE 조사는 적용하지
않습니다. [품질 적용 판정](quality-gate-level-review-2026-10-03.md)은
핵심 동작 증거와 묶음 릴리스에만 적용합니다.

## 검증

- `npm run build -w @pydemia/ui`: 통과.
- `node --test packages/ui/tests/sidebar.test.mjs`: 4/4 통과.
- `npm run typecheck`: 통과.
- `npm run test -w @pydemia/ui`: 278/278 통과.
- `npm run build`: 통과. 새 release를 `docs/`에 복사하기 위해
  snapshot 생성 뒤 다시 실행했습니다.
- `npm run registry:release-check`: 146개 item·144개 export/catalog와
  81번째 snapshot `sha256-c4dc8be30e9a1ee0b1e8d729c3beca45a9f7c29740d45b3a09cbcc6e04c316ba`
  일치.
- 로컬 Chromium 문서 preview: `filled`에서 활성 링크 배경·글자
  token, 다른 항목 선택 후 `aria-current` 이동을 확인했습니다. 390px
  모바일 Drawer의 링크 세 개 모두 `filled`, 항목 선택 후 닫힘과
  현재 영역 갱신을 확인했습니다.
- PR CI·`main` CI·Pages, production과 대표 공개 URL: 통과.

Goal 관리용 추정은 약 99%입니다. component 144개·registry item
146개는 그대로이며, 수량이 아닌 기존 composite API의 표시 선택
가능성을 개선한 작업입니다.
