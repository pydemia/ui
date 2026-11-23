# Kanban 카드 조작 간소화

- 참고한 제품 패턴은 [Jira의 보드 이동](https://support.atlassian.com/jira-software-cloud/docs/work-with-boards-in-business-projects/), [Trello의 카드 이동](https://support.atlassian.com/trello/docs/moving-cards-or-lists/), [Linear의 카드 속성 선택](https://linear.app/docs/display-options)이다.
- 카드 전체 드래그를 기본으로 제공한다. 카드 메뉴의 이동 항목은 편집 권한과 수동 정렬 설정에 따라 표시한다.
- 상세 열기와 일괄 선택은 산하 앱이 선택적으로 제공한다. Projects는 상세·일괄 선택·연결 Story를 기존 데이터와 연결한다.
- 2026-11-23 release sha256-ae899d772b76b62f85fbc3d07f275052b234c6137527d30475847c8cf017ed7c. UI 단위 테스트, 카탈로그 테스트, TypeScript, 정적 빌드 및 registry 현재·과거 스냅샷 검증을 실행했다.
