# Navigation / schedule R10 review disposition

- 독립 새 leaf `navigation_schedule_review_r10`, 요청 설정 gpt-6-luna/high/fork none. runtime metadata 비노출. read-only source review이며 browser 검수 주체는 root.
- F1: Calendar/Scheduler root의 navigation-fill 대신 schedule-fill 명시 제안 수용. 해당 두 root에 전용 override 추가.
- F2: Gantt/Scheduler의 preview-stack 중복 frame 제안은 source 반증으로 제외. 실제 catalog의 두 preview는 preview-workspace이며 styles.css의 기존 `.preview-stage > .preview-workspace` reset 대상. 개발 QA는 preview-stage 없이 직접 mount. 존재하지 않는 wrapper 문제로 확대하지 않음.
- Root 추가 확인: Gantt 새 inline CSS 변수의 Basic 표현 변화 발견 → Basic에서 initial로 reset하고 원래 fallback 유지. 실제 운영12종 비교 통과.
- Root 추가 확인: Skeuo Light 새 헤더의 색 대비4.457 → schedule-heading-ink 전용 foreground로 수정. nonBasic 지원 조합 측정4.5 미만0. 모든 gradient 픽셀을 측정한 것은 아님.
- Root 추가 확인: Calendar min-width auto의 좁은 화면 넘침 → min-width0. QA320/390×21 및 실제문서Clay7종×2 폭 재검수 통과.
- Gantt 새 theme에서 row56px를 기존 SVG rowHeight56과 일치. Basic row49px는 보존. selected data plane에 역상 accent 대신 tint/pressed 처리해 읽기 유지.
- 공유 CSS는 root만 작성. leaf component 패치는 data hooks와 Gantt variable fallback 중심이며 API·handler·ARIA 유지. 별도 behavior와 registry 설치 검수는 R10 main 기록 참조.
