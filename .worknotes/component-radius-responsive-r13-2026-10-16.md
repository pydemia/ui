# R13 반응형 테마 모서리 조정

- 요청: Material Inspired의 Registry review/Operations workspace가 좁은 화면에서 지나치게 둥글어지는 문제 개선, 다른 디자인 모드도 검토.
- 기준: main20731840b8fcc1703868504a8403fd32d5c36cb6, snapshot93. 이전 main CI38758374935 success 확인.
- branch: codex/responsive-theme-radius. 기존 사용자 dirty 노트7개와 첨부 보존.
- 조사: Registry review는 별도 profile example iframe, Operations는 AnalyticsWorkspace. 실제 DOM/모서리 토큰/좁은 화면을 함께 확인 예정.
- 작업 소유: root가 코드/브라우저/빌드/Git/배포 담당. radius_source_audit_r13은 읽기 전용 소스 검토와 지정 노트만 담당.
- 라우터: 가용 모델 도구 입력으로 gpt-6-luna/high/fork none 권고 및 생성 요청. 주/leaf 실제 runtime model·effort metadata는 unavailable.
- 수용 기준: 패널/복합 항목의 과한 타원화 제거, 짧은 버튼·배지의 의도한 pill 및 다른 컨셉의 사각/비대칭 모서리 보존. 모바일/중간/데스크톱 검수, 기존 상태·Basic 격리·PRISM 보존.
- 검증: 아직 원인 및 최종 변경 미확정. 구현/빌드/CI/운영반영 미완료.

## 원인 재현과 수정 방향

- 실제 Material390: Operations 외곽341x720/r999/overflow auto로 타원 clip, featured MetricCard292x135/r999, compact292x70/r999. Registry iframe 내 Tailwind rounded-sm도 전역 --radius999를 그대로 사용.
- --radius를12로 정상화, short action은 별도 --control-radius999 유지. selection/navigation12로 복합 행 pill 전파 차단.
- Card의 featured/compact data-variant가 기존 default/elevated/subtle 셀렉터를 비켜가는 문제 확인. 모든 non-Basic Card에 panel geometry를 적용하고 featured accent 색상/배치 보존.
- 문서 스크롤 workspace wrapper는 control/default radius 대신 panel radius 사용. 다른 모드의 사각/비대칭 geometry는 각 panel token 그대로 사용.
- 실제 수정 후 빌드/모바일·중간·넓은 화면/모드 비교 검수 필요. 아직 배포되지 않음.

## 검수 중 추가 발견

- UI303/Docs15 tests 및 full typecheck 통과.
- 1440px 지원39조합, 실제catalog144개/오류0, panel999 없음, 업무 초안 유지, nestedBasic panel5px 유지. 320px21모드/업무workspace 가로 넘침0/오류0 확인.
- 개발QA header의 JSON 진단 문자열이 모바일 pageOver를 만들므로 해당 수치는 제품 overflow 증거로 사용하지 않음. 실제 main 문서와 QA workspace 경계로 따로 검수.
- 실제 Material 연속320/390/768/1024/1440 resize에서 profile초안/기간 선택 유지. 패널24/Registry래퍼12 유지.
- 1024px에서 full header navigation이 테마 선택기를 밖으로 밀어 페이지232px 넘침 확인. 좁은 toolbar 전환 경계를1300px로 앞당기고 긴 테마명 축약을 전 너비에서 허용. 이 추가 docs CSS는 재검수 필요.
- 독립 source audit 수용: 다른 모드에999px기본값 유출 없음. Clay/Glass/Spatial의 유한 큰 패널과 Drawn의 비대칭, 사각형 모드는 유지.

## 최종 로컬 브라우저 검수

- matrix-desktop-39.json: 지원39조합 모두144개 render/오류0/요청과 실제설정 일치. 작업workspace 넘침0, panel999 없음, nestedBasic5px 유지, 업무초안 유지.
- matrix-mobile-320-21.json: 실제320px/21모드/각144개 render/오류0, workspace 넘침0, Basic5px 유지. QA JSON header 진단 overflow는 제품 검사에서 제외.
- actual-main-21x2.json: 실제 문서21모드 x320/1024 총42회, page overflow0/frame·metriccard999 없음. 사각/비대칭 geometry 그대로 유지.
- material-responsive-breakpoints.json: 실제320~1440px의13경계에서 page overflow0, frame24px 유지. Windows viewport 요청561/1301은 실제562/1302로 측정되어 실제값 기록.
- material-resize-actual.json: Registry초안 radius-review 및 Operations기간month 연속resize 후 보존 확인. 최초1024 overflow 결과는 추가툴바CSS 수정 전 상태이며 최종경계검사로 해소 확인.
- 실제 Material320/390/desktop 개선 screenshot, Clay320/Drawn320 시각 확인. 모든모드의 모든대화형상태를 확인한 것으로 확대하지 않음.
- 비교 검사 전 UI build/full typecheck/UI303/Docs15 pass. 이후 docs header CSS 추가가 있으므로 정식 build 및 CI에서 재검증 예정.
- 디자인 결정은 agent-selected 구현 수정이며 사용자에게 새 컨셉 선택이나 전면 개편을 요구하지 않음. PRISM/폰트/팔레트/데이터 계약 변경 없음.

## 릴리스 생성

- 첫 정식 npm run build 통과. 소스 최종 검수 후 immutable snapshot94 생성: sha256-31f15cec4a99547f46cf2be4e1c2f7e0d8fc2b2f412a205d36a170348d7b6667 /148items.
- 이전93개 snapshot 유지. 새CSS·metadata를 registry 소비자에게 함께 전달하기 위한 새 릴리스이며 기존 snapshot 수정 없음.
- 최종 docs 재빌드 진행 중. PR/CI/운영배포 및 공개registry 설치 검수는 아직 미완료.
- source audit leaf 종료 확인, 지정 노트만 변경한 결과 수용.

## 릴리스 전 확인

- 최종 정식 npm run build 및 registry:release-check 통과. current snapshot94/148items 일치, 기존 immutable 파일 diff0.
- compiled preview에서 Material320/390/1024/1440 pageoverflow0/모든 workspace frame24/metriccard4종24 확인. Registry iframe wrapper3종12 및 compiled-radius 입력→검토완료 상태 반영 확인.
- 제품 source4files(메타데이터1/CSS3) 범위. JSX·상태·핸들러·의존성 변경 없음. 중복구현을 복제하는 CSS unit test 추가 대신 기존303/15와 실제 브라우저 검수 적용.
- PRISM 소스 diff0. 공용 번들 변경에 따른 생성문서 asset hash 변경만 포함. 폰트/팔레트 자산 변경 없음.
- 이후 PR CI가 full test/typecheck/build/generated docs parity/과거릴리스 보존 확인 예정. 운영확인 전 상태.
