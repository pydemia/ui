# CitationList 추가

2026-09-29 로컬 작업 트리. AI 응답의 출처 제목·위치·원문 링크를
한곳에 표시하는 반복 용례를 위해 `CitationList`를 추가했습니다.
기존 `Message`·`Conversation`은 발신자와 대화 순서를 담당하며 출처
목록을 표현하지 않습니다. 로컬 총수는 89개 component와 91개
registry item입니다.

`label`이 있는 section과 native ordered list·link를 사용합니다.
각 출처는 고유 `id`, `title`, 절대 HTTP(S) `href`를 요구하고
`location`·`excerpt`를 선택적으로 표시합니다. 링크는 새 탭에서
열리며 `새 탭`을 보이는 텍스트로 알립니다. 빈 목록은 별도 문구로
표시합니다. `compact`·`card`는 동일한 출처 데이터를 공통 token으로
다르게 배치합니다. 요청·검색·출처 신뢰도 평가는 호출자가 맡습니다.

[AI Elements Inline Citation 문서](https://elements.ai-sdk.dev/components/inline-citation)를
참고했습니다. revision `6a9d5b1822ffb10bba4bd97175f01edd7d8651cd`의
`inline-citation.tsx`·`sources.tsx`와 같은 revision의 Apache-2.0
LICENSE를 확인했습니다. upstream은 HoverCard·Carousel·Badge·
lucide-react를 사용하지만 해당 source나 dependency를 편입하지
않았습니다. 현재 구현은 React·`pyd-utils`와 공통 token만 사용합니다.
[W3C H30 링크 텍스트 기법](https://www.w3.org/WAI/WCAG21/Techniques/html/H30)의
구체적인 링크 이름을 참고했습니다.

## 검증

- `npm test -w @pydemia/ui`: 전체 44개 통과. 새 테스트는 목록·
  링크 의미, 빈 상태, 중복 ID, 잘못된 URL scheme을 검사합니다.
- 저장소 `npm run typecheck`, `npm run build`,
  `npm run registry:check`: 통과. 기본 공개 registry URL로 복원한
  빌드에서 91개 item과 89개 catalog/export 대응을 확인했습니다.
  문서 bundle 500KB 초과 경고는 남아 있습니다.
- 문서 Chromium: 출처 2개와 링크 이름·URL, pointer·Enter로
  compact/card 전환과 빈 상태 왕복, 밝은·어두운 모드, 390px 화면
  (문서 폭 375px, viewport 390px), console error 0건을 확인했습니다.
- 빈 Vite fixture
  `C:\Users\pydemia\AppData\Local\Temp\pydemia-ui-citation-list-consumer-20260929`에
  `shadcn@4.21.0 add`로 item·utils·tokens 3개 파일을 설치했습니다.
  설치 component 소스가 생성 JSON과 일치했고 typecheck·build가
  통과했습니다. 별도 Chromium에서 pointer로 빈 상태 전환,
  Enter로 카드 전환·출처 복귀, 링크 이름·URL, console error 0건을
  확인했습니다. `npm ci` audit는 취약점 0건이었습니다.
- 별도 빈 fixture
  `C:\Users\pydemia\AppData\Local\Temp\pydemia-ui-all-registry-91-consumer-20260929`에
  현재 91개 item을 `shadcn@4.21.0 add`로 함께 설치했습니다.
  생성된 93개 파일이 registry JSON과 모두 일치했고 전체 소스
  typecheck·build를 통과했습니다. Chromium에서 208개 값 export와
  새 출처 링크가 로드됐으며 console error는 0건이었습니다.
  전체 `npm ci` audit는 취약점 0건이었습니다.

실제 화면 판독기 발표, 출처 링크의 외부 사이트 열기, touch·RTL·다른
브라우저, 기존 소비자 파일과의 갱신 충돌·복구 및 공개 배포는
확인하지 않았습니다. 현재 변경은 commit·push하지 않았습니다.
현재 89개 catalog 사용 코드 전체를 새 소비자에서 다시 typecheck하지는
않았습니다.
