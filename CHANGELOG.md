# 변경 기록

## 2026-09-29 — component registry 확장

[PR #1](https://github.com/pydemia/ui/pull/1)을 `main`에 병합해
문서 사이트와 registry를 production에 배포했습니다. 현재 내용 해시
snapshot은
`sha256-48f182bbf4fafa4e209bb89acebf7e77b722f6aac842e1a3c90d974399d9ac93`입니다.

- component 모듈을 38개에서 89개로, 공용 item을 포함한 내부 registry를
  40개에서 91개 item으로 확장했습니다. 화면 구조의 AppShell·Sidebar·
  Navigation, 분석 화면의 DataChart·DonutChart·Dashboard·LogConsole,
  복합 입력의 Combobox·MultiSelect·DateRangePicker, 작업 화면의
  DataTable·Tree·CommandPalette와 AI 대화 component를 포함합니다.
- Spinner에 다섯 표시 형태를, Badge·MetricCard·DataChart·Navigation에
  용례별 표시 형태를 추가했습니다. Navigation의 기존 링크 스타일은
  기본값으로 유지합니다.
- `pyd-tokens`로 공통 stylesheet를 전달하고 수정한 shadcn/ui source의
  MIT 고지를 해당 registry item에 포함했습니다. 내용 해시 snapshot과
  빌드된 최신 item의 일치 검사를 추가했습니다.
- 이전 공개 item을 설치한 소비자를 신규 item으로 갱신하고,
  수정된 Badge·Button 파일의 덮어쓰기와 수동 재적용을 시험했습니다.
- DataChart가 부호가 다른 큰 유한값을 받아도 SVG 좌표와 축 눈금을
  유한하게 계산하도록 고쳤습니다.

개별 component의 동작 범위와 미검증 항목은 `research/verification.md`,
진행·인계 기록은 `.worknotes/`에 있습니다. 현재 package는 private
workspace이며 npm에 게시하지 않았습니다.
