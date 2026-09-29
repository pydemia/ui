# SplitButton 조합 예시

2026-09-29 로컬 작업 트리. 기본 실행과 대체 실행을 한 버튼 그룹에
놓는 사용처를 검토했습니다. `SplitButton`이라는 별도 component와
registry item 대신 기존 `ButtonGroup`·`Button`·`DropdownMenu`를
설치 가능한 조합으로 문서화했습니다. 동작 상태는 사용하는 화면이
소유하므로 새 공용 API가 필요하지 않았습니다. component 88개,
registry item 90개는 그대로입니다.

문서의 ButtonGroup preview에 보고서 저장 기본 버튼, 이름이 있는
대체 작업 메뉴 버튼, 사본 저장·CSV 내보내기 메뉴와 실행 상태를
추가했습니다. 사용 코드는 세 item을 모두 설치하도록 안내합니다.
기존 공통 token으로 배경·테두리·초점을 표시하며 외부 source를
복사하거나 npm dependency를 추가하지 않았습니다.

[shadcn/ui Button Group 공식 문서](https://ui.shadcn.com/docs/components/radix/button-group)의
분할 작업 구성을 참고했습니다. 같은 프로젝트의 고정 revision
`98a1fe67b439324ddc857f47fbdce056600a4329` source와 MIT LICENSE는
[ButtonGroup 조사](../research/source-inventory.md)에 기록되어 있습니다.
[Radix Dropdown Menu 공식 문서](https://www.radix-ui.com/primitives/docs/components/dropdown-menu)와
[W3C Menu Button 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/)을
확인했습니다. 로컬 `@radix-ui/react-dropdown-menu@2.1.22`의
package manifest·배포 source·MIT LICENSE도 확인했습니다.

## 검증

- 저장소 `npm run typecheck`, `npm run build`,
  `npm run registry:check`, `git -c core.safecrlf=false diff --check`:
  통과. 빌드는 기본 공개 registry URL의 90개 item을 생성했습니다.
  문서 bundle의 500KB 초과 경고는 남아 있습니다.
- 문서 Chromium: 기본 저장 클릭, 메뉴 열기·사본 저장 선택,
  Enter 열기·첫 항목 focus, Escape 닫기·trigger focus 복귀를 확인.
  밝은·어두운 모드에서 연결 배치와 분리선을 확인.
- 기존 90개 item을 설치한 소비자 fixture에서 문서 사용 코드의
  package import만 설치된 registry 경로로 바꿔 typecheck·build.
  Chromium에서 207개 export 로딩, 기본 저장과 Enter 메뉴 열기,
  CSV 내보내기 선택, console error 0건을 확인.
  Fixture: `C:\Users\pydemia\AppData\Local\Temp\pydemia-ui-all-registry-90-final-consumer-20260929`.

실제 screen reader 발표, touch·RTL·다른 브라우저, 소비자의
수정 파일 갱신·충돌 복구와 공개 사이트 배포는 확인하지 않았습니다.
별도 package tarball에서 이번 사용 코드만 다시 실행하지는
않았습니다.
