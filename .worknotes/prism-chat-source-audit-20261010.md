# 현재 채팅 분석·포지션 추천 소스 대조

2026-10-10. frontend HEAD=origin/dev `087811ffba678ece20ee00b1c3c5d117a1d3d323`, fetch 후 clean입니다. 기준 `7ecfc9af` 대비 남은 5개 변경 파일의 diff와 현재 전체 파일을 읽었습니다. 이는 변경 경로 검토 완료이며 구현·배포 화면의 전체 상태/시각 일치를 의미하지 않습니다. 이 감사는 Attitude 공개 head `b4a502d8` 이후 로컬 후속 기록입니다.

| 대상 | 현재 원본 코드 | 현재 kit와 차이 |
| --- | --- | --- |
| ChatJSONRendererPanel.tsx | position_card에서 panelMode를 제거하고 일반 ChatTemplatePositionRecommend를 사용합니다. 후보/분석/criteria/table/options는 각 panel 동작을 유지합니다. 실제 파일은 custom inline action을 label로 표시하면서 별도의 위임 handler도 둡니다. | PrismResponse는 panel rich action을 label로 보존하지만 position 카드의 일반 레이아웃/선택/더 보기 recipe가 없습니다. panel에 옛 포지션 헤더 높이를 다시 적용하면 안 됩니다. 다른 block 목적의 전체 원본 parity는 별도입니다. |
| ChatProfileAnalysis.tsx/.scss | 리더 유형 원형 60px 배지·10px 정보 버튼·하단 panel tooltip·설명+단계 문구, 본문은 aiComment ?? leaderTypeDesc이며 12px/700입니다. 원본 배지 이름은 마지막 리더/leader 앞에서 줄을 나눕니다. 블록은 흰색/12px padding/8px radius, 6 Frame 제목과 80px label 열입니다. | 현재 PrismProfileAnalysis에는 원형 배지 기본 CSS는 있지만 정보 버튼/tooltip·aiComment·divider·단계 설명과 별도 6 Frame 제목이 없습니다. 모든 factor를 일반 chip으로 표시하므로 목적별 표현을 보완해야 합니다. |
| ChatTemplatePositionRecommend.tsx/.scss | rank/panelMode 제거, 한 개/두 개는 36px 헤더, 3개 이상 grid는 53px입니다. 기본 3열/10px gap, 400px 이하 2열, wrapper gap20입니다. 넓은 폭은 4–6개일 때 최초3개, 7개 이상 최초6개입니다. 좁은 폭은 5개 이상 최초4개·두 개씩 추가·전체 뒤 접기입니다. ResizeObserver를 해제하고 breakpoint/initialShow가 바뀌면 접습니다. | 현재 PrismResponse는 포지션 전체를 수직으로 렌더하고 범용 PrismPositionCard의 16px 제목/14px 본문/별도 헤더를 사용합니다. 현재 원본 12px 스타일·선택·동일한 panel layout·더 보기·반응형 목적을 구현해야 합니다. |

연결된 PositionRecommend.tsx/.scss도 전체를 대조했습니다. 원본은 gray50 배경/16px padding/12px radius/12px gap, 내부 흰색 body 12px padding/8px radius, 회사 logo12px, 제목12px500 두 줄/설명12px400 세 줄 제한입니다. 선택은 Blue400 2px border와 padding15px로 외곽 크기를 보존합니다. 클릭과 Enter/Space를 지원하며 headerMinHeight가 있으면 minimum을 적용합니다. 현재 단순 카드와 구분되는 독립 추천 recipe가 필요합니다. 원본 인증 상태·hover·폰트·전체 pixel 검증은 남아 있습니다.

FactorContent의 목적도 확인했습니다. 전문성은 제목+구분선으로 연결한 primary tag, 성공경험은 대표 항목에만 yellow star, Design/Learning은 첫 결과의 active 작은 chip, Attitude는 제목/summary 뒤 Red400 Derailment chip, Leadership은 제목/summary, 나머지는 일반 chip입니다. summary의 trim empty는 NoData이며 custom tag가 있는 문자열은 inline markdown입니다. 호스트 데이터의 kind를 명시하고 접근성/좁은 폭/원문 보존을 지원하는 typed 계약으로 구현해야 하며 label만 보고 평가를 생성하지 않습니다.

현재 구현은 변경하지 않았습니다. 다음은 분석의 목적별 표시·리더 도움말과 추천 목록을 구현하고, 데이터 없음/긴 문장·0/1/2/3/4/6/7/9개·400px 경계/140–1280px·선택/키보드/더 보기/접기/데이터 전환을 독립 소비자에서 확인하는 작업입니다. 소스 코드의 좁은 폭 nextRevealCount 표시와 실제 두 개 추가 조건이 다른 경우는 실제 UI에서 확인한 뒤 기능 목적에 맞게 정합니다. source delta 52경로의 미검토는 0이지만 반영·원본 상태/시각 미검증은 계속 남아 있고 Goal은 active입니다.

## 2026-10-11 구현과 중단된 검증

PrismAnalysis와 PrismPositionRecommendations를 독립 typed recipe로 구현했습니다. 명시적 factor kind·대표 경험 star·첫 Design/Learning 결과·Attitude Derailment·리더 aiComment/설명/단계 tooltip을 지원합니다. 기존 PrismProfileAnalysis는 호환 adapter이며 PrismResponse도 같은 분석/추천 구현을 사용합니다. Rich text를 PrismFormattedText로 독립 설치할 수 있고 기존 PrismRichText 진입점과 sanitizer/action 계약을 유지합니다. 회사 자산은 companyLogo의 비대화형 host slot으로 받으며 기본 회사명을 임의 로고로 바꾸지 않습니다.

추천은 원본36/53px 헤더·12px 제목/본문·선택2px/15px padding을 사용합니다. 400px 이하4개에서 두 개씩/마지막 최대3개를 추가하며 표시 개수와 실제 추가 개수를 맞췄습니다. 240px 이하 한 열, 분석280px 이하 label 재배치, native 양축 resize와 dataset/breakpoint 변경 시 접기를 지원합니다.

전체115tests, 새8tests와48그룹/25완전예시 검사 및 docs TypeScript가 통과했습니다. 첫 StrictMode cleanup test는 다른 Radix tooltip observer까지 집계해 실패했으며 추천 observer 범위로 바로잡고 전체를 다시 통과했습니다. 기존 자체 consumer-tpmsik에49항목을 전체 emitted registry로 재설치했습니다. component source는 직접 편집하지 않았으며25예시 TypeScript/Vite·폰트 bytes SHA256·자산 고지가 통과했습니다. 새 설치본의 browser 실행은 아직 하지 못했습니다.

CUA에서 추천140/200/240은1열,280/320/400은2열,401/440/800/1000/1280은3열이며 root overflow0입니다. 0/1/2/3/4/6/7/9개 초기 표시,4→6→9/접기·Space/Enter 선택·데이터 전환 후4개 복원을 확인했습니다. 최초 선택 border의 중간 transition 색은 후속 개수 검사의 Blue400 rgb(0,114,198)로 재확인했습니다. Native drag는800×349.59→600×410이며 overflow0입니다. 분석140–1280에서 badge60×60/info10×10/comment12px700/80px label(320px 이상)/Yellow400·Red400/넘침0을 측정했습니다. Tooltip350px/12pxpadding/14px500/pre-line과 Escape·nullish fallback·호스트 액션을 확인했습니다.

Screenshot은CDP5000ms timeout으로 새 PNG가 없습니다. 실제320px iframe 전체169상태 검사는22개를 처리한 시점에 Chrome3 연결이 사라졌습니다. aria-hidden native select를 표시 입력으로 오인한 조건은 실제DOM을 읽고 수정했습니다. 개별22기록 배열을 저장하기 전 inventory timeout이 REPL을 reset했으므로 aggregate tool observation과 별도로 저장된 chat-cua-runtime.json만 남았습니다. 169개 완료나 독립 소비자 실제UI 성공으로 확대하지 않습니다. iab도 unavailable이며 환경 갱신 뒤 CUA 도구 자체가 제공되지 않습니다. 서비스/브라우저 설정은 변경하지 않았습니다.

Source delta0미검토는 코드 감사의 범위입니다. 전체 원본 인증 UI·font/pixel·동작 coverage와 실제 회사 logo/긴 문장·OS/인쇄는 미완료이고 Goal active입니다. 다음은 CUA가 다시 제공되면 actual320×169를 개별 raw 파일에 매 case 저장하며 다시 검사하고, 독립 chat consumer production UI·모든 긴/빈/readonly 상태를 확인하는 작업입니다.
