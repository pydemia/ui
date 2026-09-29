# 기간 필터 조합 예시

2026-09-30. 중복된 `DateRangeFilter` public API를 만들지 않고 기존
`DateRangePicker`와 `FilterBar`를 결합한 문서 예시를 추가했습니다.
90개 component·92개 registry item의 수는 유지합니다.

## 범위와 결정

- `FilterBar` preview의 기본 예시는 기간 필터입니다. 버튼으로 기존
  검색어·상태 필터 예시도 볼 수 있습니다. Usage는 기간 필터 조합을
  복사해 쓸 수 있도록 변경했습니다.
- draft와 applied 기간을 분리합니다. 제출된 `FormData`에 시작일·
  종료일이 모두 있을 때만 적용하고, 부분 선택은 오류를 표시하며
  이전 결과를 유지합니다. 초기화는 draft·applied·오류를 지웁니다.
- 예시 데이터는 `YYYY-MM-DD` 달력 날짜입니다. `오늘`·`최근 7일`
  preset과 timestamp 경계는 데이터의 기준일·시간대를 아는 소비자가
  정합니다. 이 예시는 서버의 시간대 변환을 대신하지 않습니다.
- 새 upstream 코드, npm dependency, public export, registry item이
  없습니다. 두 기존 component의 출처·LICENSE·전이 의존성은
  `research/source-inventory.md`와 `registry/provenance.json`을 따릅니다.

## 진행 및 미검증

- `npm run typecheck`, `npm run build`, `npm run registry:release-check`,
  `git diff --check`가 통과했습니다. 기존 내용 해시 snapshot과
  90개 component·92개 item 수는 그대로입니다.
- Chromium 문서 preview에서 2026-09-26 부분 선택 후 제출 오류와
  기존 3건 유지, 29일까지 완료 후 적용 2건, 초기화 후 3건 복원을
  확인했습니다. 기존 검색어·상태 필터 예시도 전환해 확인했습니다.
- 새 Vite 소비자 `pydemia-ui-period-filter-consumer-20260930`에 공개
  snapshot의 `pyd-filter-bar`, `pyd-date-range-picker`, `pyd-field`,
  `pyd-tokens`를 `shadcn@4.21.0 add`로 설치했습니다. 11개 파일이
  생성됐고 세 component 소스가 snapshot과 같았습니다. 조합 사용
  코드의 typecheck·build가 통과했습니다.
- 390px viewport에서 문서 scroll width가 375px이었고 기간 필터와
  dark mode preview가 표시됐습니다.
- [PR #7](https://github.com/pydemia/ui/pull/7)을 `main`의
  `4e5085fb42af9f22685adc134efee6d936cd45b2`로 병합했습니다.
  PR [Verify UI](https://github.com/pydemia/ui/actions/runs/36594483605),
  main [Verify UI](https://github.com/pydemia/ui/actions/runs/36594709198)와
  Pages 작업이 성공했습니다. Vercel production은 READY이고 운영
  preview에서 기간 picker가 열렸습니다.
- 실제 screen reader·touch·다른 시간대 데이터 처리는 미검증입니다.

기존 미공개 draft snapshot 네 디렉터리는 이번 변경에 포함하지 않습니다.
