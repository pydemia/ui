# 연속 목록 행 모서리 R19

- 요청: MasterDetail·Board에서 선택 행의 둥근 모서리가 연속된 목록과
  어긋나는 현상 수정. 같은 현상이 있는 컴포넌트도 확인.
- 시작점: main `1e2dd7c46eca27e1cae943ecfc0903008c3b9315`.
  기존 dirty 기록 12개·첨부·R17 중간 snapshot은 보존.
- R1: 구분선으로 이어지는 행의 내부 모서리는 0. hover/selected 간
  모양이 달라지지 않도록 동일한 행 형상을 사용.
- R2: 제목과 실제 외곽의 마지막 모서리는 패널의 테마 radius를 따름.
  떨어진 카드·inset option은 이번 요구로 사각화하지 않음.
- R3: Basic 격리, 선택·키보드·모바일 상세 복귀 동작 보존.
- 완료 기준(동일 가중치): ① 유사 구조 조사 및 구현 ② 실제 화면·동작
  검증 ③ 기존에 허용된 main/운영/공개 registry 반영. 현재 0/3.
- 설계 선택은 사용자 지정. 테마·색상·폰트·PRISM 재설계 없음.
- routing: 독립 source audit은 helper decide 결과 gpt-6-luna/high의
  leaf `joined_row_audit_r19`에 read-only 위임. main 모델·effort 및 leaf
  실제 runtime 값은 미노출. main이 공유 CSS·build·Git·게시를 담당.
- 참고: design-modes.css의 선택 surface-row에 navigation-radius 적용.
  현재 이 slot은 Board/MasterDetail만 사용. 전체 row 구조 감사 진행.

## 구현·검증

- source audit leaf 종료 및 결과 수용. 상세는
  `joined-row-audit-r19-2026-10-16.md`. 정확히 같은 문제는 두 컴포넌트의
  공용 surface-row 선택 규칙. ItemList·NotificationCenter·표는 해당
  radius가 없고, Tree·TreeNav·option·schedule event는 inset 또는 간격이
  있는 독립 항목. Accordion catalog는 간격이 있는 disclosure이므로 유지.
- D1: 현재 두 컴포넌트만 사용하는 surface-row의 선택 radius 제거 및
  행 radius0 명시. 미래 용도를 위한 새 public variant/hook은 추가하지 않음.
- D2: Board에 외곽 overflow-hidden 추가. MasterDetail은 기존 clipping
  유지. 마지막 행이 실제 패널 끝에 닿는 경우에만 패널의 곡선으로 잘림.
  상세가 길어 목록 아래 빈 공간이 남는 경우 마지막 행도 내부 행으로 처리.
- D3: 공용 tokens stylesheet에 surface-row의 focus offset -2px 적용.
  Tailwind utility만으로는 unlayered 기본 focus rule을 이기지 못하는 것을
  실제 측정하여 이 위치로 수정. Basic에도 clipping 후 초점이 보이게 유지.
- TSX는 Board class만 변경. hook/state/ref/이벤트·ARIA·데이터 변경 없음.
- 관련 기존 테스트 16개(중복 실행 제외) pass: MasterDetail3·community5·
  Accordion2·ItemList3·NotificationCenter3. UI build/TypeScript pass.
- 실제 catalog QA: 21개 mode ×320/1440px ×두 컴포넌트 =84개 관찰에서
  row radius0, panel overflow-hidden, 내부 가로 초과2px 초과·render 오류0.
  독립 Basic Board paint·radius가 외부 21개 mode 전환 중 동일.
  `browser-evidence/joined-row-r19/theme-matrix.json`에 actual width 기록.
- 실제 Clay390 Board: 글쓰기 UI로 긴 제목/본문을 추가해 3개 가변 높이 행
  표시 및 첫·중간·마지막 선택, Enter 선택 확인. 초기 screenshot은 dialog
  닫힘 전 transition frame이므로 최종 시각 증거에서 제외.
- 실제 Clay390 MasterDetail: 중간 행 Enter→상세→목록으로 복귀 후
  같은 선택과 초점 복원. 넓은 QA Review(실제 viewport1440, panel948px)에서
  중간 항목 선택 후 목록/상세 동시 표시, overflow0 확인.
- default catalog preview는 max520px여서 desktop viewport에서도 narrow
  layout이라는 점을 구분. 넓은 배치는 QA Review로 별도 확인.
- 현재 기준 2/3 완료. 남은 작업은 공식 build/snapshot/release-check,
  PR CI·main 병합·운영 및 공개 source readback. 임시 Vite5240 사용 중.

- 첫 공식 build 통과 및 새 snapshot 4de9aeca 생성(148 items). 기존 공개100개 release와 로컬 중간27cd 보존. 최종 build/release-check 진행. 설치 형식·target·의존 경로 변경 없음으로 별도52종 consumer 재설치는 이번 범위에 포함하지 않음. 배포 후 변경 item source readback으로 공개 전달 확인 예정.

- 공식 build→snapshot→build→release-check 순서 모두 pass. 현재4de9aeca/148items 일치 및 기존 immutable 파일 수정·삭제 없음. 제품 source4files(CHANGELOG 포함), 자체 기록2개와 생성 산출물만 commit 예정. 임시 Vite5240 종료·listener 없음 확인. 운영 공개 source readback/화면과 CI는 아직 미완료.
