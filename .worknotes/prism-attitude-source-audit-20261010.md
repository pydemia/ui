# Attitude 진단·PDF source 감사

코멘트 구현을 PR162의 `82815d34`에 반영한 뒤 다음 5경로의 diff·현재 코드·kit 대응을 읽었습니다. 이 감사는 구현 또는 원본 상태 검증 완료를 뜻하지 않습니다. PR 커밋의 공개 metadata는 감사 전 미검토 12경로를 기록하며 현재 로컬 감사에서는 7경로가 남습니다.

| 경로 | 현재 source | kit에서 남은 부분 |
| --- | --- | --- |
| AttitudeDiagnosis.tsx / .module.scss | 진단 제목 오른쪽 `action`과 margin8 titleRow 추가. 성격은 180px radar·comment title/description·10점 만점, 가치관은 양수 비중만 표시하고 원래 색 인덱스 유지 | PrismDiagnosis 제목이 outline 안에 있고 action slot이 없음. heading만 있을 때 NoData가 추가되는 판정과 trim 판정, 0% legend 제거, radar 색/라벨·인쇄 스타일 대조 필요 |
| PdfViewerDialog.tsx / .module.scss | 1200px/90vh modal. 열릴 때 전체 bytes fetch, 상대 URL→소비자 환경의 절대 URL fallback, `%PDF` 검사, Range/stream 해제. 성공 전에도 download fallback. 페이지46px/배율64px, blur/Enter commit·10단계 줌30~100·아이콘 fit toggle | PrismPdfViewer는 URL 직접 로드하며 data/loader 계약이 없음. fit/실패/재시도·worker URL은 있으나 modal recipe·전체 bytes/HTML 거부·호스트 fallback·본문/바닥글 배치가 필요. 현재 page와scale input 모두46px이며 입력마다 즉시 commit, 줌은 현재비율±10이고 fit는 텍스트/Expand glyph. 원본 field64px·step rounding·icon/tooltip·입력 glyph/14px 글꼴과 source toolbar 상태 대조 필요 |
| SuccessorCandidateAttitude.tsx | `pdfs.personality_assessment`가 trim 후 존재할 때 `심리적강인함 결과 보기` 버튼을 진단 제목 오른쪽에 제공하고 modal을 열음. survey 근거는 3개 이상일 때3열, 그 밖에는2열 | PrismAttitudeSection의 기존 documentAction은 진단 다음에 배치됨. 현재 기본 demo에는 보고서 액션/열기와 survey 조합이 없음. 기존 소비자를 보존하는 typed report·validation recipe가 필요 |

PDF source의 처음 읽기 출력이 잘렸으므로 나머지 220~260행과 CSS 처음 부분을 따로 읽었습니다. `prism-pdf.tsx`는 존재하지 않아 `index.ts`의 export owner로 실제 `prism-document.tsx`를 확인한 뒤 전체를 대조했습니다. source fetch/adapter·query/cache·권한 로직을 동일하게 복사하는 것이 목표는 아닙니다. 독립 loader 및 호스트 callback으로 목적을 지원하되 실제 원본 상태·전체 시각 대조를 분리합니다.

다음 작업은 보고서 action의 위치와 nullable/trim 판정을 반영한 진단 recipe, 실제 PDF bytes·HTML 오류·실패/재시도·닫기/대상 전환·다운로드와 좁은 modal sizing을 검증하는 독립 보고서 UI입니다. SurveyValidation 2경로, ChatJSONRendererPanel 1경로, ChatProfileAnalysis 2경로, ChatTemplatePositionRecommend 2경로의 최신 diff 세부 감사도 남아 있습니다.


## 구현 중간 기록

- 현재45그룹/46항목·22개 완전 예시로 확장했습니다. 11개 새 계약 테스트를 포함한 전체107개 테스트가 통과했습니다. 기존 출력 옵션/preview API의 소스를 byte 비교해 보존을 확인했습니다.
- PDF.js6.3.289의 공식 PDFViewer를 사용해 전체 bytes·헤더 검사·호스트 fallback, 연속 페이지와 텍스트 레이어/선택, 원본 blur/Enter와10단계 zoom, source glyph·46/64px field·14px 글꼴을 지원합니다. 전용 pdf.css를 별도 registry 파일로 배포하도록 추가했으며 해당 파일이 실제 dependency closure에 포함되는지 검사합니다. 환경 workerUrl은 완전 예시의 명시적 prop으로 받습니다.
- 실제 CUA에서3페이지/3canvas/텍스트 레이어, Enter 후2페이지 이동, PageDown으로3페이지 이동,67%→70%/60%,30~100% 경계와 너비맞춤146%, 실제 Synthetic 단어 선택을 확인했습니다. HTML200 응답을 PDF형식 오류로 거부하고 같은URL retry가성공했습니다. callback bytes4351은원본합성PDF와동일하며 SHA02600e0d...입니다. OS 저장 완료와구분합니다. screenshot은다시5000ms timeout입니다.
- 새 진단은 제목 action·trim·title-only·양수 share/색 인덱스·180px/4rings/point border0과접근성 데이터를 지원합니다. Survey는원본36/24px bars와정수 평균선·source색/0.0/null,2/3열·가변높이/print를 지원합니다. SurveyValidation2경로도전체현재코드/diff·ValidationItem과대조했고 미검토7→5입니다.
- 실제140px에서grid min-content와legend nowrap 넘침이발견되어minmax0/차트내부scroll/legend wrap을수정중입니다. 140×400px PDF모달은ready·넘침0·viewport89px입니다. 다이얼로그 width/height는호스트가 지정할 수 있습니다. 후보가바뀌면대기중모달이닫히는것을실제UI와계약테스트에서확인했습니다.
- 다음필수검증:140px 수정 재측정,PDF모달 폭/높이·실제320iframe,Survey computed/print,최신159상태,독립46항목소비자/실제3페이지/다운로드·종료/late result,표준build/typecheck/registry/generic·PR162. 원본인증 상태와전체font/pixel·실제권한/저장은여전히대기입니다. 이전rdnly4 검증의node_modules만 공간확보를위해정리했고 소스·lock·dist·증거는유지했습니다.
