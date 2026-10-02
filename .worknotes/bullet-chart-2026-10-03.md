# BulletChart 후보

2026-10-03. Vercel 배포 제한으로 사용자 사이트는 BarList 이전 공개
기준인 130개 component·132개 item·58개 snapshot입니다. `main`은
BarList까지 131개·133개·59개이며 goal 관리용 추정은 약 97%입니다.

운영 목표 대비 실적을 한 척도에서 표시하는 용례를 선택했습니다.
`Progress`의 작업 진행률, `BarList`의 여러 범주 비교와 의미가
달라 별도 `BulletChart`로 구현했습니다. 원본 React·Tailwind와
기존 `pyd-utils`만 사용합니다. 현재·목표·최대가 보이는 텍스트이며
막대와 목표선은 장식입니다. `null`과 0을 구분하고 범위 밖 값은
오류로 처리합니다. `panel`·`plain` 표시와 문서 preview·Usage를
추가하고 Operations workspace의 완료 건수에 연결했습니다.

로컬에서 typecheck·UI 테스트 215/215·build·registry 검사가
통과했습니다. registry 검사는 134개 item·132개 export/catalog와
기존 59개 snapshot을 확인했습니다. Chromium에서 현재 74%·목표
80%·최대 100%, 목표 초과 88%, 미수집과 평면 표시를 확인했습니다.
390px 가로 넘침과 console error는 없었습니다. Operations
workspace의 재실행 후 현재 완료 건수는 3→2로 바뀌었습니다.
고유 label 검사를 추가한 뒤 대상 테스트 3/3을 재실행했습니다.
[draft PR #106](https://github.com/pydemia/ui/pull/106)의 Verify UI
run `37045189665`가 성공했습니다. Vercel 제한 중에 snapshot을 하나
더 공개하지 않고 다음 릴리스 묶음에서 생성합니다. 새 snapshot·
production 공개 경로는 미검증입니다.
현재 로컬 후보는 132개 component·134개 item입니다. 공개 공급이
아니므로 goal 관리용 추정 약 97%를 유지합니다.
