# 블록 생성 중 상태

직전 goal turn은 블록 목록·편집·재매핑과 원본 공통 컨트롤 구현, 실제 설치·로컬 상태, CI/검토 preview readback까지 진행한 진척입니다. 현재 HEAD baa3d5b4와 이전 worknote의 최종 게시 기록을 보존합니다.

현재 source CriteriaDialog/JobCriteriaDialog와 SCSS에서 설명 입력에 inset0 오버레이, Base background opacity0.6,24px spinner가 있고 소직무는 기존 내용을 덮거나 빈 목록에서48px 영역을 확보하는 것을 확인했습니다. 기존 라이브러리는 pending 버튼·입력 잠금만 있었으므로 해당 시각적 상태를 추가합니다.

Textarea의 inputOverlay는 입력 영역만 감쌉니다. null로 빈 wrapper를 유지해 textarea를 생성 시작·종료에 remount하지 않으며, undefined인 기본 사용은 기존 DOM을 유지합니다. 오버레이의 화면 표시가 권한·요청 취소를 수행하지는 않고 호출자가 disabled/readOnly를 지정합니다. 블록 편집기의 기존 scoped task/AbortSignal과 실패 보존을 재사용합니다. 합성 예제에6초 생성 지연을 추가해 실제 클릭으로 pending 상태를 관찰합니다. 단순 지연 provider를 새 독립 컴포넌트나 수동 fixture 상태로 추가 계상하지 않습니다.

현재 package/test/registry/install/browser/site/publication 검증 중이며 원본 인증 화면,완전한 busy/전체font/pixel/A4 및 chat-log 목적은 아직 완료하지 않았습니다.

이번 턴에 자체 브라우저가 복구됐습니다. 1280/320px에서 설명·기존 소직무·빈 소직무의 생성 중 상태를 총 6회 확인했습니다. 설명 오버레이와 textarea의 경계가 일치하고 pending 동안 입력 값이 유지됩니다. Base 배경 opacity 0.6, SVG의 CSS 크기 24px, 빈 소직무 오버레이 높이 48px도 확인했습니다. 회전 중 SVG bounding box 크기는 CSS 크기와 다를 수 있으므로 24px 확인에는 computed style을 사용했습니다. 실제 설치된 retained 소직무 상태는 1280px에서 확인했습니다. 생성 중에는 닫기 동작이 허용되지 않으므로 완료 뒤 닫고 다음 상태로 이동했습니다. 이를 브라우저 취소 검증으로 보고하지 않습니다.

대상 34개와 전체 266개 테스트, 실제 shadcn 설치와 전체 사이트 빌드가 통과했습니다. source-auth/full font/pixel/A4 및 전체 canonical 상태 검증은 남아 있으며 goal은 active입니다.
