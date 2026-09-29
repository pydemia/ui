# DataList 편입

반복되는 요청·작업 상세 정보의 이름/값을 의미 있게 표시하도록
`DataList`를 추가했습니다. 필수 label로 이름을 붙인 그룹 안에 native
`dl`·`dt`·`dd`를 사용합니다. `layout="rows"`는 한 행에 이름과 값을
놓고, `layout="grid"`는 container 너비 320px부터 두 열로 배치합니다.
`null`만 기본 `값 없음`으로 표시하며 빈 문자열은 그대로 둡니다.
항목이 없으면 설명 문장을 표시합니다. ID 중복이나 필수값 누락은
오류로 알립니다. 외부 component source를 복사하지 않았고 새 npm
의존성도 없습니다. MDN의 description list 문서를 reference로
확인했습니다. registry 직접 의존성은 `pyd-utils`입니다.

`@pydemia/ui` export와 `pyd-data-list` registry item, provenance,
문서 preview·사용 코드에 편입했습니다. Operations workspace의
floating 도움말에도 기간·실행·로그 건수를 표시합니다.

패키지 테스트 34개와 저장소 typecheck·build·registry:check가
통과했습니다. 문서 Chromium에서 행/그리드 전환 후 332px container의
두 열(`158px 158px`), `값 없음` 출력, 작업 공간 도움말의 기간
변경(`최근 7일`→`최근 4주`)과 console error 0건을 확인했습니다.
문서 Vite build에는 500 kB 초과 chunk 경고가 있었지만 빌드는
완료됐습니다. 기본 공개 registry URL의 89개 item을 생성했고 로컬
테스트 URL이 산출물에 남지 않은 것도 확인했습니다.

임시 소비자 경로:
`C:\Users\pydemia\AppData\Local\Temp\pydemia-ui-data-list-consumer-20260929`.
로컬 registry의 `pyd-data-list`·`pyd-badge`·`pyd-tokens`를
`shadcn@4.0.0 add`로 설치했습니다. DataList·Badge·utils·token CSS
4개 파일은 줄바꿈 정규화 후 원본과 일치했습니다. 소비자 typecheck와
Vite build가 통과했습니다.

실제 screen reader의 발표, touch·다른 브라우저, 현재 89개 item의
동시 재설치, 소비자 수정 파일의 갱신·충돌 복구와 공개 배포는
확인하지 않았습니다. 이전 87개 item 동시 설치와 구분합니다.
