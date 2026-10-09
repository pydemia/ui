# PRISM 최신 소스 차이 감사

2026-10-09, `7ecfc9af` → `087811ff`: components/styles 아래 수정 42개와 추가 10개, 총 52개 경로입니다. 이 표는 작업 범위를 추적하며 52개 모두의 동작·시각 검증 완료를 뜻하지 않습니다. Inventory의 기능 목적 매핑 273/pending 0과 별개입니다. Checkout revision과 실제 배포 revision의 결합은 미확인입니다.

| 변경 | 소스 경로 | 현재 확인 범위 | 남은 범위 |
| --- | --- | --- | --- |
| M | src/components/admin/company-groups/CompanyGroupForm.module.scss | 반영 및 합성 fixture 검증 | 현재 create/detail typed 양식; 인증 원본 상태·pixel 대조 대기 |
| M | src/components/admin/company-groups/CompanyGroupForm.tsx | 반영 및 합성 fixture 검증 | 현재 create/detail typed 양식; 인증 원본 상태·pixel 대조 대기 |
| M | src/components/admin/users/UserForm.module.scss | 반영 및 합성 fixture 검증 | 현재 create/detail typed 양식; 인증 원본 상태·pixel 대조 대기 |
| M | src/components/admin/users/UserForm.tsx | 반영 및 합성 fixture 검증 | 현재 create/detail typed 양식; 인증 원본 상태·pixel 대조 대기 |
| M | src/components/chat/candidate/CandidateFilterBar.tsx | 반영 및 선택 합성 상태 검증 | 현재 typed 목록·source 선택/출력 준비·반응형·85tests와 CUA; 원본 인증 상태·전체 pixel/native print·OS 저장 대조 대기 |
| M | src/components/chat/candidate/CandidateListContent.module.scss | 반영 및 선택 합성 상태 검증 | 현재 typed 목록·source 선택/출력 준비·반응형·85tests와 CUA; 원본 인증 상태·전체 pixel/native print·OS 저장 대조 대기 |
| M | src/components/chat/candidate/CandidateListContent.tsx | 반영 및 선택 합성 상태 검증 | 현재 typed 목록·source 선택/출력 준비·반응형·85tests와 CUA; 원본 인증 상태·전체 pixel/native print·OS 저장 대조 대기 |
| M | src/components/chat/contextInfo/ContextInfoLayer.module.scss | 반영 및 선택 합성 상태 검증 | 필수/선택 badge·11행·trim기준50/800 경고·structured intent·반응형/resize 반영; 원본 인증 상태·전체 pixel·기본 motion 대조 대기 |
| M | src/components/chat/contextInfo/ContextInfoLayer.tsx | 반영 및 선택 합성 상태 검증 | 필수/선택 badge·11행·trim기준50/800 경고·structured intent·반응형/resize 반영; 원본 인증 상태·전체 pixel·기본 motion 대조 대기 |
| M | src/components/chat/contextInfo/ContextInfoSection.module.scss | 반영 및 선택 합성 상태 검증 | 필수/선택 badge·11행·trim기준50/800 경고·structured intent·반응형/resize 반영; 원본 인증 상태·전체 pixel·기본 motion 대조 대기 |
| M | src/components/chat/contextInfo/ContextInfoSection.tsx | 반영 및 선택 합성 상태 검증 | 필수/선택 badge·11행·trim기준50/800 경고·structured intent·반응형/resize 반영; 원본 인증 상태·전체 pixel·기본 motion 대조 대기 |
| M | src/components/chat/conversation/ChatJSONRendererPanel.tsx | 변경 경로 확인 | 이번 관리자 양식 범위에서 세부 diff/state까지 검토하지 않음; 다음 감사 대상 |
| M | src/components/chat/memo/MemoCard.module.scss | 반영 및 선택 검증 | prism-memo의 현재 본문/날짜/단일 편집과 async 동작 반영; source/deployed CSS 대조 및 합성 runtime. 인증 원본 전체 상태 대기 |
| M | src/components/chat/memo/MemoCard.tsx | 반영 및 선택 검증 | prism-memo의 현재 본문/날짜/단일 편집과 async 동작 반영; source/deployed CSS 대조 및 합성 runtime. 인증 원본 전체 상태 대기 |
| M | src/components/chat/memo/MemoContent.module.scss | 반영 및 선택 검증 | prism-memo의 현재 본문/날짜/단일 편집과 async 동작 반영; source/deployed CSS 대조 및 합성 runtime. 인증 원본 전체 상태 대기 |
| M | src/components/chat/memo/MemoContent.tsx | 반영 및 선택 검증 | prism-memo의 현재 본문/날짜/단일 편집과 async 동작 반영; source/deployed CSS 대조 및 합성 runtime. 인증 원본 전체 상태 대기 |
| M | src/components/chat/position/PositionRecommend.module.scss | 차이 확인; 추가 대조 대기 | rank UI 제거 확인; 현재 kit에도 rank 계약 없음. 원본 headerMinHeight/선택/정렬 layout 상태 대조는 필요 |
| M | src/components/chat/position/PositionRecommend.tsx | 차이 확인; 추가 대조 대기 | rank UI 제거 확인; 현재 kit에도 rank 계약 없음. 원본 headerMinHeight/선택/정렬 layout 상태 대조는 필요 |
| M | src/components/chat/successorCandidate/BadgeSummary.tsx | 변경 경로 확인 | 이번 관리자 양식 범위에서 세부 diff/state까지 검토하지 않음; 다음 감사 대상 |
| M | src/components/chat/successorCandidate/attitude/AttitudeDiagnosis.module.scss | 변경 경로 확인 | 이번 관리자 양식 범위에서 세부 diff/state까지 검토하지 않음; 다음 감사 대상 |
| M | src/components/chat/successorCandidate/attitude/AttitudeDiagnosis.tsx | 변경 경로 확인 | 이번 관리자 양식 범위에서 세부 diff/state까지 검토하지 않음; 다음 감사 대상 |
| M | src/components/chat/successorCandidate/attitude/PdfViewerDialog.module.scss | 변경 경로 확인 | 이번 관리자 양식 범위에서 세부 diff/state까지 검토하지 않음; 다음 감사 대상 |
| M | src/components/chat/successorCandidate/attitude/PdfViewerDialog.tsx | 변경 경로 확인 | 이번 관리자 양식 범위에서 세부 diff/state까지 검토하지 않음; 다음 감사 대상 |
| M | src/components/chat/successorCandidate/attitude/SuccessorCandidateAttitude.tsx | 변경 경로 확인 | 이번 관리자 양식 범위에서 세부 diff/state까지 검토하지 않음; 다음 감사 대상 |
| M | src/components/chat/successorCandidate/expertise/SurveyValidation.module.scss | 변경 경로 확인 | 이번 관리자 양식 범위에서 세부 diff/state까지 검토하지 않음; 다음 감사 대상 |
| M | src/components/chat/successorCandidate/expertise/SurveyValidation.tsx | 변경 경로 확인 | 이번 관리자 양식 범위에서 세부 diff/state까지 검토하지 않음; 다음 감사 대상 |
| A | src/components/chat/successorCandidate/leadership/LeadershipPie.module.scss | 부분 반영 및 선택 검증 | typed pie/summary와 수치·geometry 증거 있음; 전체 원본 profile/frame 상태 대기 |
| A | src/components/chat/successorCandidate/leadership/LeadershipPie.tsx | 부분 반영 및 선택 검증 | typed pie/summary와 수치·geometry 증거 있음; 전체 원본 profile/frame 상태 대기 |
| A | src/components/chat/successorCandidate/leadership/LeadershipPieSummary.module.scss | 부분 반영 및 선택 검증 | typed pie/summary와 수치·geometry 증거 있음; 전체 원본 profile/frame 상태 대기 |
| A | src/components/chat/successorCandidate/leadership/LeadershipPieSummary.tsx | 부분 반영 및 선택 검증 | typed pie/summary와 수치·geometry 증거 있음; 전체 원본 profile/frame 상태 대기 |
| M | src/components/chat/successorCandidate/leadership/SuccessorCandidateLeadership.tsx | 부분 반영 및 선택 검증 | typed pie/summary와 수치·geometry 증거 있음; 전체 원본 profile/frame 상태 대기 |
| A | src/components/chat/successorCandidate/leadership/mapLeadershipPie.ts | 부분 반영 및 선택 검증 | typed pie/summary와 수치·geometry 증거 있음; 전체 원본 profile/frame 상태 대기 |
| M | src/components/chat/successorCandidate/mgmtComments/CeoCommentForm.tsx | 변경 경로 확인 | 이번 관리자 양식 범위에서 세부 diff/state까지 검토하지 않음; 다음 감사 대상 |
| M | src/components/chat/successorCandidate/mgmtComments/SuccessorCandidateMgmtComments.tsx | 변경 경로 확인 | 이번 관리자 양식 범위에서 세부 diff/state까지 검토하지 않음; 다음 감사 대상 |
| M | src/components/chat/successorCandidate/print/CandidateProfilePrintPreview.tsx | 목적 구현 및 선택 검증 | 독립 PDF/ZIP/HTML engine과 합성 runtime 있음; 전체 실제 source print/layout/mapping 대조 대기 |
| A | src/components/chat/successorCandidate/print/CandidateProfilesPdfDownload.module.scss | 목적 구현 및 선택 검증 | 독립 PDF/ZIP/HTML engine과 합성 runtime 있음; 전체 실제 source print/layout/mapping 대조 대기 |
| A | src/components/chat/successorCandidate/print/CandidateProfilesPdfDownload.tsx | 목적 구현 및 선택 검증 | 독립 PDF/ZIP/HTML engine과 합성 runtime 있음; 전체 실제 source print/layout/mapping 대조 대기 |
| A | src/components/chat/successorCandidate/print/PdfDownloadHost.tsx | 목적 구현 및 선택 검증 | 독립 PDF/ZIP/HTML engine과 합성 runtime 있음; 전체 실제 source print/layout/mapping 대조 대기 |
| M | src/components/chat/successorCandidate/print/PrintLeaderSummary.module.scss | 목적 구현 및 선택 검증 | 독립 PDF/ZIP/HTML engine과 합성 runtime 있음; 전체 실제 source print/layout/mapping 대조 대기 |
| M | src/components/chat/successorCandidate/print/PrintLeaderSummary.tsx | 목적 구현 및 선택 검증 | 독립 PDF/ZIP/HTML engine과 합성 runtime 있음; 전체 실제 source print/layout/mapping 대조 대기 |
| A | src/components/chat/successorCandidate/print/buildCandidateProfilePdf.ts | 목적 구현 및 선택 검증 | 독립 PDF/ZIP/HTML engine과 합성 runtime 있음; 전체 실제 source print/layout/mapping 대조 대기 |
| A | src/components/chat/successorCandidate/print/exportProfileHtml.ts | 목적 구현 및 선택 검증 | 독립 PDF/ZIP/HTML engine과 합성 runtime 있음; 전체 실제 source print/layout/mapping 대조 대기 |
| M | src/components/chat/successorCandidate/print/mapComprehensiveProfileToPrintPreview.ts | 목적 구현 및 선택 검증 | 독립 PDF/ZIP/HTML engine과 합성 runtime 있음; 전체 실제 source print/layout/mapping 대조 대기 |
| M | src/components/chat/successorCandidate/total/SuccessorCandidateLeaderSummary.module.scss | 부분 반영 및 선택 검증 | typed pie/summary와 수치·geometry 증거 있음; 전체 원본 profile/frame 상태 대기 |
| M | src/components/chat/successorCandidate/total/SuccessorCandidateLeaderSummary.tsx | 부분 반영 및 선택 검증 | typed pie/summary와 수치·geometry 증거 있음; 전체 원본 profile/frame 상태 대기 |
| M | src/components/chat/templates/ChatProfileAnalysis.module.scss | 변경 경로 확인 | 이번 관리자 양식 범위에서 세부 diff/state까지 검토하지 않음; 다음 감사 대상 |
| M | src/components/chat/templates/ChatProfileAnalysis.tsx | 변경 경로 확인 | 이번 관리자 양식 범위에서 세부 diff/state까지 검토하지 않음; 다음 감사 대상 |
| M | src/components/chat/templates/ChatTemplatePositionRecommend.module.scss | 변경 경로 확인 | 이번 관리자 양식 범위에서 세부 diff/state까지 검토하지 않음; 다음 감사 대상 |
| M | src/components/chat/templates/ChatTemplatePositionRecommend.tsx | 변경 경로 확인 | 이번 관리자 양식 범위에서 세부 diff/state까지 검토하지 않음; 다음 감사 대상 |
| M | src/styles/_dialog.scss | 선택 규칙 반영 | 확인 본문 pre-line 반영; 원본 모든 dialog 상태 대조 대기 |
| M | src/styles/_print.scss | 목적 구현 및 선택 검증 | 독립 PDF/ZIP/HTML engine과 합성 runtime 있음; 전체 실제 source print/layout/mapping 대조 대기 |
| M | src/styles/_text-field.scss | 선택 규칙 반영 | focus 오류 빨간 테두리의 local computed style 확인; 전체 입력 규칙은 추가 대조 |
