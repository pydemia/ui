# PRISM 두 컴포넌트 작업 범위 (2026-10-13)

- 이번 작업은 `PrismPositionDirectory`와 `PrismSummaryBadge` 두 컴포넌트로 제한합니다. 원본 `dev` `2eeb26ff10274745f9d86897c2f2828bff002b98`의 직접 변경을 기준으로 선택했습니다. 전체 187개 비벡터 파일이나 59개 설치 그룹을 이번 완료 범위로 주장하지 않습니다.
- `PrismPositionDirectory`: 원본 `PositionList.tsx`/SCSS의 열린 상세 탭 mount 유지와 기존 행이 있는 재조회 표시를 반영합니다. 독립 컴포넌트는 패널별 `aria-controls`/`aria-labelledby`, `hidden`과 명시적인 display 해제를 사용합니다. 초기 로딩은 네 skeleton 행이고 기존 행이 있는 로딩은 표·조작을 유지합니다. `refreshing` 합성 예제를 추가했습니다.
- `PrismSummaryBadge`: 최신 `BadgeSummary.module.scss`의 원형 배지 padding `10px 4px`를 반영했습니다. 원본 Candidate Common 배포 샘플에서 88×88px와 padding을 실제 측정했고 로컬 및 별도 shadcn 설치본에서도 일치했습니다. wrapper/본문/툴팁 및 인쇄 전 범위의 일치를 주장하지 않습니다.
- `PrismPositionDirectory`의 mount 횟수와 재조회 행 보존을 검사하는 테스트를 추가했습니다. 대상 5개, PRISM 전체 295개 테스트와 typecheck, 전체 site build, generic registry release-check, 59개 설치 모듈/CSS의 바이트 일치와 40개 예제 타입 검사·Vite·폰트·고지 검사가 통과했습니다.
- 로컬 브라우저에서 포지션 목록→상세→목록 뒤 상세 DOM이 hidden으로 남았습니다. 별도 설치본에서 상세 mount가 1회로 유지되고 기존 행/정렬 버튼과 SUMMARY 88×88px·`10px 4px`를 확인했습니다. 브라우저 viewport override 대신 문서의 실제 320px iframe을 사용해 문서 너비 320px·표 680px/스크롤 영역 256px와 상세 탭 복귀 후 상태 유지를 확인했습니다.
- 남은 검증: 원본 배포 SHA 연결, 실제 서비스의 상세 재조회·오류·권한, 전체 상태의 pixel/font/인쇄 비교. 현재 변경은 draft PR #162의 검토 브랜치에 반영 예정이며 main/production은 범위 밖입니다.
