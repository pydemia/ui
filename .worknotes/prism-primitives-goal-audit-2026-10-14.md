# 공통 primitive 완료 판정 — 2026-10-14

현재 frontend `dev`/`origin/dev`는 `2eeb26ff10274745f9d86897c2f2828bff002b98`로 일치한다. 로고·사이드바 프로필·팝오버·skeleton·더보기·플로팅 대화·즐겨찾기·입력 라벨·파일 오버레이의 TSX/SCSS는 종전 감사 기준 `087811ff` 이후 변경되지 않았다. 앞서 배포 InputLabel 샘플에서 라벨 14px/600/20px, 필수 표시, 16px 도움말과 회색 11px tooltip을 측정했고 로컬/설치본 입력 연결과 터치·키보드 경로를 검증했다. 현재 인증 배포 `/chat`은 인앱 브라우저에서 연결이 재설정되어 최신 업무 화면·배포 SHA는 확인하지 못했다.

공개 완전 예제에 텍스트 로고, 펼친/접힌 사용자 요약, 제어형 즐겨찾기, 입력 라벨/도움말, 클릭/키보드 팝오버, 더보기, 개별/목록 skeleton, 플로팅 대화 버튼, 파일 오버레이를 넣었다. 원본 파일 오버레이는 아이콘·파일 확장자·파일명·선택적 미리보기를 표시하므로 설치용 오버레이에도 호스트 제공 `fileName`/`previewUrl`을 추가했다. 어두운 배경에서 파일명이 읽히도록 흰색으로 표시한다. 팝오버는 원본의 90–350px 크기·회색 테두리·6px 모서리를 반영하고 열기 방식은 마우스/터치/키보드 공통의 클릭·활성화로 유지한다. Radix Portal은 원래 부모의 `data-prism` 하위 선택자 밖에 렌더되므로 콘텐츠 요소 자체의 속성으로 스타일을 지정한다. 원본 `ChatLayout`의 파일 드롭 기능은 주석 처리돼 있어 실제 업로드 결과는 범위에 넣지 않는다.

별도 shadcn 설치본에서 59개 TSX 모듈과 CSS의 registry bytes 일치, 완전 예제 48개 타입 검사, Vite build, Pretendard bytes와 asset notice를 확인했다. 브라우저에서 즐겨찾기 상태, 팝오버 열기/Escape, 더보기 전환, 도움말, 파일 오버레이, 플로팅 버튼의 호스트 intent를 확인했다. 320px viewport에서 document scrollWidth는 320px이었다. 파일 오버레이의 비활성·아이콘/확장자·이미지 분기에는 SSR 검사를 추가했다.

원본의 표시 목적과 대표 디자인, 접근성 개선, 독립 설치를 충족해 `prism-primitives`를 완료 판정한다. 이전의 엄격한 전체 시각/상호작용 `partial`은 유지한다. 목표 진척은 **32/58개**, 미판정 **26개**다. 실제 권한·드롭/첨부·채팅 이동과 최신 인증 배포 대조는 전체 goal에 남는다.

최종 로컬 검사: workspace typecheck, `npm run build`, `npm run prism:check`(338/338), `npm run registry:release-check`, 재설치 소비자의 59개 TSX/CSS 바이트 일치·48개 완전 예제 타입 검사·Vite/폰트/고지가 통과했다. 재설치 브라우저에서 파일명 최종 글자색은 rgb(255, 255, 255)였다.

Portal 선택자 수정 후 재설치 브라우저의 팝오버 계산 스타일은 minWidth 90px/maxWidth 350px/borderRadius 6px, 현재 내용 폭 153.484px이다. 320px viewport에서는 maxWidth 296px이고 x=83–236.484px, document scrollWidth 320px으로 유지됐다. 최종 CSS를 포함한 site build와 독립 설치 재검증도 통과했다.
