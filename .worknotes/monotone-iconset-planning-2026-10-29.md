# Monotone UI iconset 기획 기록

날짜: 2026-10-29

## 요청과 범위

사용자 요청은 `ui`의 사용하기 좋은 monotone 기능성 iconset 기획이다. VS Code의 오픈소스 Codicon과 다른 아이콘 세트를 reference로 삼는다. 로고·favicon이나 실제 SVG 제작·코드 교체는 이번 요청에 포함하지 않는다.

## 확인한 현황

- 저장소에는 기존 미커밋 변경이 다수 있다. 이번 작업은 기존 변경을 수정하지 않고 새 기획 기록과 지속 자료만 추가했다.
- `@pydemia/ui`는 `lucide-react`를 직접 의존하고 Accordion·Tree·Menu·PasswordInput·DatePicker·CopyButton 등에 사용한다.
- `IconButton`은 `label`과 `icon`을 필수로 받고, 아이콘은 발표에서 숨긴다. `Sidebar.icon`은 ReactNode를 받는다.
- Tree/TreeNav의 chevron은 현재 20px, strokeWidth 2.25이다. Basic과 20개 디자인 모드, light/dark, ThemeScope 맥락을 고려했다. PRISM은 자체 표현을 유지한다.
- 공식 출처 확인: VS Code 제품 아이콘 문서·Codicon 저장소, Primer Octicons 디자인/사용 규칙, Lucide 디자인 명세·라이선스, Tabler 디자인 가이드·라이선스, W3C WCAG 2.2 비텍스트 대비·대상 크기.

## 결정과 산출물

- 지속 설계 자료: [monotone-icon-system.md](../research/monotone-icon-system.md).
- 제안 방향은 `currentColor` 단색 outline을 기본으로 하고, 16/24px 별도 도안과 필요할 때의 20px 강조형을 둔다.
- 아이콘의 시각 ID와 화면의 행동·상태 명칭을 분리한다. 외부 세트의 규칙을 참고하되 도안은 자체 제작하며, 실제 외부 자산 편입 시 개별 provenance/고지를 기록한다.
- 현재 컴포넌트 계약을 유지하면서 핵심 아이콘을 점진적으로 공급한다.

## 검증 상태와 다음 작업

- 완료: 저장소 사용처·계약 조사, 공식 reference 문서 확인, 기획안 작성, 문서 경로와 출처 연결.
- 미완료: SVG 시안 제작, 16/20/24px 비교, 사용자 식별성 평가, 구현·registry 소비자·브라우저 검증. 기획안의 수용 기준은 후속 검증 계획이다.
- 다음 작업자는 기획안 4절의 후보를 실제 사용 빈도와 대응시켜 첫 도안 목록을 확정한 뒤, `chevron`, `check`, `copy`, `eye`, `calendar`의 크기별 시안을 비교한다. 기존 미커밋 변경을 보존한다.
