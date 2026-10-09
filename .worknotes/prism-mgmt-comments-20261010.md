# CEO·ELP 코멘트 검증 기록

현재 참조 소스는 `087811ff`입니다. `CeoCommentForm`, `SuccessorCandidateMgmtComments`, `BadgeSummary`를 대조해 별도 `prism-mgmt-comments` 계약과 SUMMARY 도움말 본문 스타일 옵션을 구현했습니다. 프로필 탭의 합성 예시는 새 recipe를 사용하며 기존 일반 본문 editor API는 유지합니다.

4필드·5행·연도 입력 정리·trim 경계·nullable metadata·작성자 액션과 원본 카드 간격/글꼴을 반영했습니다. 단일 편집, Promise 중복 방지, 후보 전환/unmount 신호 취소와 늦은 UI 결과 무시, 실패 초안 보존, 성공 후 reload 실패 분리와 목록만 재시도를 지원합니다. collection의 기본 입력 잠금은 개선이며 옵션으로 원본의 입력 가능 상태를 선택할 수 있습니다. 서버 권한·저장과 rollback은 UI가 처리하지 않습니다.

- 공개 CSS `index-Ct5vvkRn.css`의 SHA256은 `455771f685dd104fa44bb3c6292d2de1cf574d9666f93eaab0a37f6ae5429545`입니다. 코멘트의 `1hr3u`/`1kle5` 규칙을 source와 대조했습니다. 전체 배포 revision의 결합이나 인증된 원본 상태 대조로 확대하지 않습니다.
- CUA에서 혼합 연도 입력→2026, Enter 제출 차단, native 100/100/2000자 제한, 상세/저장/삭제 실패와 재시도, 후보 전환, 삭제 완료를 확인했습니다. SUMMARY class/style은 본문에 적용되며 12px 글꼴·안쪽 여백, 280px 최대 너비를 측정했습니다.
- 폭 140~1280px에서 코멘트 영역의 가로 넘침이 없었습니다. 내용 5행은 115px, 긴 내용은 638px였고 실제 드래그로 113→193px 크기 변경을 확인했습니다. 최종 빌드에서 자동·수동 180px 제한을 확인했습니다. 첫 수동 제한 시도는 이전 dist를 읽어 실패했으며 그 수치는 raw 결과에서 별도로 표시했습니다.
- 43그룹/152상태를 실제 320px iframe에서 component/state DOM 표식 확인 후 측정했습니다. 렌더 누락·페이지 넘침·중첩 버튼·이름 없는 표시 입력·수집된 오류는 없었습니다. `frame.contentDocument`는 CUA 읽기 범위에서 제공되지 않아 collector가 실패했고 문서화된 `frameLocator.evaluate`로 내부 DOM 측정을 완료했습니다.
- 새 `consumer-rdnly4`에 44항목/20예시를 설치하고 최종 emitted registry로 다시 설치했습니다. 설치 component 소스는 수정하지 않았습니다. 검증 진입 앱만 실제 320px iframe/StrictMode로 구성했고 production 예시의 등록 3건/수정/삭제 후 2건, 자동 638px/제한 180px, Pretendard·넘침·중첩·오류를 확인했습니다. TypeScript/Vite·폰트 bytes·고지도 통과했습니다. 재사용 script의 EEXIST와 첫 iframe 빌드의 cwd 오류는 수정 후 성공했습니다. 이전 `BXqIdv`의 node_modules만 공간 확보를 위해 정리했으며 소스·lock·dist·증거는 보존했습니다.

최종 검토에서 추가 등록 callback 없이 수정만 제공하는 소비자에 취소 버튼이 없던 경우를 보완했습니다. 그 경로도 계약 테스트에 포함했습니다. 최종 전체 96개 테스트, 표준 build, 문서 TypeScript, 43그룹/20개 완전 예시와 generic snapshot 검사가 통과했습니다. Generic은 146항목/144catalog/83immutable이며 snapshot SHA256 `25ca4393b38b8fcebbbd34ca3d8c73475e773a766e971da004f94e40728bc896`을 유지합니다. 마지막 취소 보완도 최종 emitted registry로 독립 소비자에 다시 설치한 뒤 TypeScript/Vite/font/고지를 확인하고 실제 320px에서 등록 후 3건·본문·넘침/오류0을 확인했습니다.

fetch 후 UI main은 `288b0838`, frontend HEAD와 origin/dev는 `087811ff`이며 frontend는 clean입니다. 인증 source/target Git config hash를 보존했습니다. Source/generated를 나눠 기존 검토 branch와 draft PR162를 갱신합니다. 원본 탭·계정·설정과 8766의 Python 프로세스를 보존합니다.

인증된 원본의 전체 상태·시각/폰트 대조, 실제 backend 권한·저장 검증과 남은 source delta 12경로의 세부 감사가 남아 있습니다. screenshot capture는 5000ms timeout이어서 새 UI 이미지는 없습니다. 기능 목적 273/pending 0이나 합성 fixture 성공은 전체 완료를 의미하지 않습니다.
