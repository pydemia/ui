# 문서 사용 코드와 공급 경로 검사

2026-09-29. 이전 턴의 86개 registry item 동시 설치 검사를 이어
현재 catalog의 사용 코드 84개를 별도 소비자에서 확인했습니다.

`npm run build` 후 `npm pack -w @pydemia/ui`로 현재 package의
tarball을 만들고, 기존의 새 Vite 소비자 fixture에 설치했습니다.
TypeScript AST로 `apps/docs/src/catalog.tsx`의 84개 `code` 문자열을
각각 TSX 파일로 추출했습니다. 서로 독립적인 최상위 JSX 문장 사이에는
세미콜론만 넣었습니다. 소비자의 `tsc --noEmit`이 84개 모두에서
통과했습니다. 이 검사는 public package import의 정적 typecheck이며
예시를 브라우저에서 각각 실행한 결과는 아닙니다.

component `.tsx` 원본 84개, `registry.json`의 component 파일 84개,
`packages/ui/src/index.ts`의 해당 공개 module 84개,
`apps/docs/src/catalog.tsx`의 ID 84개가 1:1로 일치했습니다.
이 대응 검사를 `scripts/check-registry.mjs`에 추가했습니다.
`npm run registry:check`는 86개 item과 provenance, 84개 component의
export·catalog 대응을 확인하며 통과했습니다. `npm run typecheck`,
기본 공개 URL의 `npm run build`, 변경 파일의 `git diff --check`도
통과했습니다.

소비자 fixture:
`C:\Users\pydemia\AppData\Local\Temp\pydemia-ui-all-registry-86-consumer-20260929`.

이번에는 설치된 registry 소스 경로로 문서 예시를 따로 typecheck하지
않았습니다. catalog preview의 84개 상호작용, screen reader, touch,
다른 브라우저와 공개 배포도 이 검사에 포함하지 않았습니다.
대규모 로컬 변경을 검토·릴리스 가능한 단위로 정리하는 일은 남았습니다.
