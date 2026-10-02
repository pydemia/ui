# FunnelChart 후보

2026-10-03. `BarList`는 독립 범주를 비교하고 `BulletChart`는 한
실적을 목표와 비교합니다. 가입·구매 과정에서 단계마다 얼마나
남았는지는 순서와 첫 단계 기준이 필요해 `FunnelChart`를 선택했습니다.
단순히 component 수를 늘리기 위한 이름 변경은 아닙니다.

원본 React·Tailwind와 기존 `pyd-utils`만 사용합니다. 고유 단계 ID,
이름, 감소하는 유한한 값 또는 `null`을 받습니다. 미수집과 0건을
구분하고 첫 단계가 0·미수집이면 비율을 만들지 않습니다. 순서 목록,
보이는 건수·도달률과 장식 막대를 사용하며 `panel`·`plain`을
제공합니다. 외부 component source와 새 npm 의존성은 없습니다.

typecheck·UI 테스트 218/218·build·registry 검사(135개 item,
133개 export/catalog)가 통과했습니다. 로컬
Chromium에서 기본 전환값, 미수집·빈 목록·평면 표시를 확인했습니다.
390px 가로 넘침은 없었고 차트 영역 axe 검사는 violation 0건,
incomplete 0건입니다. 이후 표시 번호를 `aria-hidden`으로 조정했고
대상 테스트 3/3과 재빌드가 통과했습니다. `BulletChart`와 함께
60번째 불변 snapshot
`sha256-039468e6ad1e0f9b4c9adad72b6627274d4bee35f1b18857a098f2dc7c9b664f`
을 생성해 `registry:release-check`를 통과했습니다. PR #106의 draft
Verify UI run `37048696452`와 검토 준비 run `37049005305`가
성공했고 Vercel preview는 READY입니다. 사용자 production의
`pyd-funnel-chart.json`은 404입니다. 공개 공급과 실제 screen
reader 발표는 미검증입니다.

`main`은 131개 component·133개 item·59개 snapshot, 이번 브랜치는
133개 component·135개 item·60개 snapshot입니다. 사용자 사이트는 Vercel 배포
제한으로 이전 공개 130개·132개·58개 기준입니다. Goal 관리용
추정은 약 97%를 유지합니다.
