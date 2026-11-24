# 공용 앱 탐색

- Projects의 프로젝트·업무 메뉴, Note의 너비 저장과 모바일 탐색, Skills Hub의 그룹형 앱 목적지를 비교했다.
- [Atlassian Layout](https://atlassian.design/components/navigation-system/layout/usage)의 전역 탐색·사용 문맥·보조 패널 배치와 [Material 3 Desktop](https://m3.material.io/foundations/desktop/components)의 화면별 탐색 패턴을 참고했다.
- NavigationShell은 슬롯과 반응형 배치를 담당한다. URL, 권한, 앱별 목적지, 오른쪽 패널 열림 상태는 소비자가 소유한다.
- 넓은 작업공간에서는 왼쪽 탐색이 본문 옆, 충분히 넓을 때 오른쪽 패널이 본문 옆에 온다. 좁은 작업공간에서 Sidebar는 drawer를 제공하며 오른쪽 패널은 본문 아래에 놓인다.
- Projects는 기존 프로젝트 순서·링크·모바일 메뉴를 사용하고, 기존 공용 resize 모듈로 왼쪽 탐색 너비를 조절한다.
- Registry 스냅샷은 sha256-653545263ed512b9c3be418615c5962ef39cc8ebb9db36f1b5b5a186ea7a8dbb이다. 기존 main의 카드·칸반 너비 개선을 포함한다. 공용 UI 324개, 문서 15개 테스트와 빌드·registry 검사를 통과했다. Edge 1720·390px에서 화면 전환, 너비 저장, 오른쪽 패널, 모바일 drawer와 focus 복원을 확인했다.
