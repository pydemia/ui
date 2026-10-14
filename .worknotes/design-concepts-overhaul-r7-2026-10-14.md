# 20종 디자인 콘셉트 전면 개선

사용자 최신 의견: 운영 20종 대부분이 Basic의 최소 변형으로 보이며,
Neobrutalism 외에 Glass/Clay 등의 콘셉트가 드러나지 않는다. 각 콘셉트의
재질·형태·타이포·구성까지 전면 개선한다. 기존 B 선택 흐름과 상태 계약,
Basic, PRISM은 보존한다. R6 공개 완료와 새 시각 품질 개선을 구분한다.

분석 결과: Glass/Fluent 불투명도90%, 캔버스 효과는 작은 preview에 제한,
Clay의 약한 inset/offset 그림자, 여러 모드의 재질 규칙 공유가 구분을 약화했다.
원본 atlas의 embedded 이미지20개를 원문 bytes 그대로 추출해 비교했다.
참조 이미지를 제품 배경으로 복사하지 않고 해당 재질·구성 원리를 구현한다.

작업 경계:
- root: 공용 material CSS, 문서/미리보기/조합 화면의 캔버스·chrome,
  nested scope 격리, 실제 화면·상태·Basic/PRISM 회귀, build/Git/배포
- leaf mode_profiles: 비Basic20종의 palette/shape/type metadata만 변경
- leaf visual_reference_audit: 원본20종과 기존CSS의 읽기 전용 비교

router가 관찰한 여유3slots에서 두 독립 작업을 gpt-6-luna/high/fork none으로
추천했으며 같은 설정으로 실제 생성했다. root metadata와 leaf 실제 runtime
metadata는 unavailable이며 생성 요청과 관측값을 구분한다.

판정 기준: 20종 모두 원본의 구별되는 시각 표식을 실제 컴포넌트/조합
화면에 구현,39지원 밝기·주요 상태·지역 scope와 palette 검사, Basic/PRISM
보존, 독립 설치·새 snapshot·CI·운영 적용 및 전후 화면 확인.
검사 결과는 실행 후 갱신한다. 실제 ENV 후속 미검수 범위는 유지한다.

독립 검토와 수정:
- engineering scope reviewer: frozen 6파일에 blocking/actionable 회귀 없음.
  Basic token parity, PRISM 배제, 지역 scope reset·portal 격리 정적 확인.
  Cyber/Pixel clipped corner focus는 실제 browser 확인 필요.
- visual reviewer: Bento/Spatial 구성이 접힌 details에 가려짐, Spatial이
  Glass 변형에 가까움, Pixel 본문이 proportional임을 지적해 모두 채택.
- primary preview가 Bento/Spatial 업무 화면을 먼저 표시하도록 변경.
  mounted subtree는 동일하며 다른 후보의 펼침 상태도 유지한다.
- Spatial은 외부 이미지 없이 자체 SVG room 배경과 staggered floating
  panels를 사용. Pixel 전체 UI font도 mono로 변경.

현재 실제 실행 결과:
- 최종 CSS에서 39개 지원 밝기 조합의 catalog 144개 렌더링 오류 0.
  16 family의 상태 witness 개수를 기록. 개별 API·모든 상태 전수 인증 아님.
- 동일 입력 초안과 focus-visible, nested Basic Light Forest의 radius5px,
  shadow/filter none 유지. 소수 픽셀 계산상 1px 경계는 0.8px로 관측됨.
- 열린 업무 Dialog의 39조합 실제 전환 중 동일 label과 입력, 최근4주 기간,
  검색어·행 선택 유지. 실제 portal design/appearance도 root와 일치.
- tests/typecheck 최종 재실행 진행 중. 새 snapshot/운영 배포는 아직 미완료.

원본 R6 공개는 완료됐으나 사용자 최신 피드백으로 R7 시각 개선을 추가한
상태다. R6의 완료 판정을 R7 완료로 재사용하지 않는다.

최종 로컬 검증:
- 타입 검사0, UI301/301·docs15/15, full build→snapshot→full build0,
  release-check0. release87/148 items:
  sha256-0454d1db56193b5f5361c1dc1b7aad1ce64cf6515936a6254ce2e6358914c45c
- 21종 실제 문서 적용/캡처와 입력 유지. Pixel의 mono 본문으로 생긴
  desktop header 넘침을 해당 모드의 넓은 화면 간격 조정으로 해결했다.
- 320/390px ×21종: 후보 tap만으로 root가 바뀌지 않음, explicit apply,
  입력 유지·document overflow0. 임시 viewport reset 완료.
- Basic 전후 비교는 동일 포인터 상태로 7대표면의 font/size/fill/image/
  border/radius/shadow/filter/padding 완전 일치. 초기 trigger hover 차이는
  source 회귀가 아님을 동일 입력 클릭 후 비교로 확인했다.
- PRISM source diff0, 실제 Pretendard/body253/white440pxDialog/picker0.
- Bento→Spatial 후보 변경 중 최근4주/검색/선택 유지, primary workspace
  기본 표시. 리뷰 후 3 findings를 닫았고 새 actionable finding 없음.
- 독립 shadcn4.21.0 설치 attempt-v0qaks:15파일 source/CSS 일치,
  tsc·Tailwind/Vite·strict21종 released gate 통과. CLI browserVerified=false
  원본은 보존한다. 공개 설치의 실제 browser 검사는 배포 후 수행한다.

근거: browser-evidence/design-concepts-{catalog,portal,mobile,prism,
normal-final,basic-parity,preview-state,source-final}-r7.json 및
design-concepts-family-r7.csv(624 family 관측, witness0을 API 통과로 해석하지 않음).
실제21화면 갤러리: design-concepts-gallery-r7-2026-10-14.html.
독립 검토 후 수정 delta는 현재 7개 source파일 hash로 별도 기록했다.
운영 적용·공개 readback은 아직 수행 전이다.
