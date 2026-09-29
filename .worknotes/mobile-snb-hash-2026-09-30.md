# 모바일 SNB 선택 시 본문 앵커

기존 코드는 850px 이하에서 명시적인 `scrollIntoView()`를 생략하지만,
SNB 선택 뒤에도 URL에 `#components`를 남겼습니다. 모바일에서는
선택한 컴포넌트의 query 값만 바꾸고 `#components` 해시는 제거합니다.
다른 섹션의 해시는 유지합니다. 상단 Components 메뉴와 데스크톱
SNB는 기존처럼 `#components`로 이동합니다. 버튼 focus는 유지해
키보드 조작을 막지 않습니다.

390px Chromium에서 `scrollY=844`, SNB `scrollLeft=1875`에서
TagsInput → ColorInput을 선택했습니다. 두 스크롤 값이 유지됐고
URL 해시는 비었으며 선택 상태와 버튼 focus가 갱신됐습니다.
1280px 데스크톱 SNB에서 Sidebar를 선택했을 때 본문 상단 위치가
약 84px, URL 해시는 `#components`였습니다. 실제 touch 기기와
Safari는 검증하지 않았습니다. component·registry item 수와 snapshot
내용은 변하지 않습니다.
