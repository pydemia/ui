# 날짜 입력과 24시간 시계

2026-11-24. Date & time 카탈로그의 날짜 입력에 초점 또는 클릭으로 여는 달력을 추가했습니다. `DateInput`은 직접 입력과 달력 선택을 지원하며 날짜는 YYYY-MM-DD로 제출합니다. 팝업이 이미 열린 상태에서 Alt+아래 화살표로 달력에 초점을 옮길 수 있습니다.

`TimePicker`의 24시간 모드에서 두 링의 시계를 열고 시에서 분으로 이어서 선택할 수 있습니다. 24시는 폼에서 00시로 제출합니다. 문서 예제는 한 분 간격을 사용하고 기존 12시간제, `minuteStep`, HH:mm 폼 계약을 유지합니다. 두 링과 시→분 전환은 [Android Material Components](https://github.com/material-components/material-components-android/blob/master/docs/components/TimePicker.md)를 참고했습니다.

Projects도 같은 날짜 입력과 시계 소스를 사용합니다. 패키지 테스트 325개와 문서 테스트 15개를 통과했습니다. 화면 낭독기 수동 검사는 미실시입니다.

로컬 정적 카탈로그를 Edge 1440·390px에서 열어 날짜 입력의 클릭과 달력 키보드 이동, YYYY-MM-DD 제출, 24시와 59분의 00:59 제출을 확인했습니다.
