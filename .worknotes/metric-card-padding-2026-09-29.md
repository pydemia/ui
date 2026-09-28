# MetricCard 안쪽 여백

2026-09-29. 사용자가 MetricCard의 테두리와 콘텐츠 사이가 좁아 보인다고
지적했습니다. 기존 `MetricCard`는 공통 `Card`에 padding을 지정하지 않아
콘텐츠가 테두리에 붙어 있었습니다.

`MetricCard`에 `p-[var(--space-4)]`를 적용했습니다. 값은 16px이며
기존 `CardContent`와 같습니다. API, 테마 token, registry metadata는
변경하지 않았습니다. 빌드로 생성된 `pyd-metric-card.json`과 문서
사이트 파일은 함께 갱신했습니다.

## 검증

- `npm run typecheck`, `npm run build`, `npm run registry:check` 통과.
- 로컬 문서 preview에서 계산된 padding이 상하좌우 16px임을 확인했습니다.
  라이트·다크 테마에서 시각적으로 확인했고, 버튼을 눌렀을 때 수치와
  변화 텍스트가 갱신됐습니다.
- 좁은 화면과 실제 screen reader는 이번 변경에서 확인하지 않았습니다.
- 문서 빌드의 기존 500 kB 초과 JS chunk 경고가 남아 있습니다.
