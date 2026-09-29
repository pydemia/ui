# Badge 표시 형태 확장

기존 `Badge`는 상태를 표시하는 화면에서도 모두 같은 중립색이었습니다.
별도 `StatusIndicator` component를 만들지 않고 `Badge`에
`default`·`outline`·`accent`·`danger` variant를 추가했습니다. 기본값의
class는 유지합니다. `accent`는 기존 accent/foreground token을,
`danger`는 danger/surface token을 사용합니다. 형태가 달라도 상태
이름을 텍스트로 전달해야 합니다. 지원하지 않는 variant는 오류로
알립니다. 새 npm dependency는 없습니다.

문서 preview와 사용 코드를 네 형태로 바꿨고 Operations workspace의
완료·실행 중·실패에 각각 기본·강조·위험 형태를 적용했습니다.
`BadgeProps`를 공개 export했습니다. shadcn/ui Badge의 variant 사용
문서와 고정 revision source·LICENSE를 검토했으며 코드는 복사하지
않았습니다. 출처와 의존성은 `research/source-inventory.md`에 있습니다.

패키지 테스트 37개와 저장소 typecheck가 통과했습니다. 문서
Chromium에서 네 형태의 텍스트·계산 색상과 분석 화면의 상태 적용을
확인했습니다. Neutral의 밝은·어두운 모드와 Pydemia의 어두운
colormap에서 token이 바뀌었고 console error는 0건이었습니다.
저장소 build·registry:check도 통과했고 기본 공개 URL로 89개 item을
생성했습니다. 문서 Vite build에는 500 kB 초과 chunk 경고가 있었지만
빌드는 완료됐습니다. 산출물에 로컬 테스트 URL은 남지 않았습니다.
React best practices 점검에서 새 fetch·effect·전역 listener는 없고,
상태별 variant 대응표는 module scope에 두었습니다. 이번 변경 범위에서
추가 수정이 필요한 항목은 찾지 못했습니다.

임시 소비자 경로:
`C:\Users\pydemia\AppData\Local\Temp\pydemia-ui-badge-variants-consumer-20260929`.
로컬 registry의 `pyd-badge`·`pyd-tokens`를 `shadcn@4.0.0 add`로
설치했습니다. Badge·utils·token CSS 3개 파일이 줄바꿈 정규화 후
원본과 일치했고 소비자 typecheck·Vite build가 통과했습니다.

실제 screen reader 발표, touch·다른 브라우저, 모든 colormap 조합의
contrast, 기존 소비자 수정 파일의 갱신·충돌 복구, 현재 89개 item의
동시 재설치와 공개 배포는 확인하지 않았습니다.
