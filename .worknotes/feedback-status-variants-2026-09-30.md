# Feedback 상태별 표시

## 확인과 결정

Spinner에는 이미 icon·ring·dots·bars·orbit 다섯 형태가 있습니다.
Alert는 기본·오류 두 형태만 제공하고, Toast의 success·warning은
info와 같은 accent 테두리를 사용합니다. 저장 완료, 만료 예정, 오류를
반복 표시하는 화면에서 의미와 색상이 일치하도록 Alert에 info·success·
warning을 추가하고 Toast의 상태색을 맞춥니다.

기존 `default`·`destructive` 동작을 유지합니다. default·info·success·
warning은 `status`, destructive/error는 `alert` 역할을 사용합니다.
메시지 제목으로 상태를 설명하고 색상만으로 뜻을 전달하지 않습니다.
`--success`, `--warning`은 기존 palette→semantic alias 구조에
추가합니다. 모든 colormap에서 같은 상태색을 사용하며 light/dark에
각각 색을 둡니다. 상태색과 surface의 계산 대비는 light success
6.87:1, warning 5.89:1, dark success 9.47:1, warning 9.65:1입니다.
이 계산은 지정한 색 쌍에 한정됩니다.

[shadcn Alert 문서](https://ui.shadcn.com/docs/components/radix/alert)는
custom color 사용 사례를 제공하며, 기존 편입 소스와
[MIT LICENSE](https://github.com/shadcn-ui/ui/blob/98a1fe67b439324ddc857f47fbdce056600a4329/LICENSE.md)는
같은 `98a1fe67` revision으로 확인했습니다. 색상·상태 확장은 이
저장소에서 작성했고 새 runtime 의존성은 없습니다. 긴급 오류 역할은
[WAI Alert Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)을
참고했습니다.

## 진행 상태

- [x] 상태별 token과 Alert·Toast 구현, 문서 preview·사용 코드
- [x] provenance의 역할 설명 갱신
- [x] 패키지 테스트 66/66, typecheck·build
- [x] 로컬 Chromium light/dark·colormap·live region 확인
- [ ] registry release 검사
- [ ] 독립 소비자 registry 설치·typecheck·build
- [ ] PR·CI·production 배포

실제 screen reader 발표와 다른 브라우저는 별도 미검증 항목으로 둡니다.
이전 미공개 draft snapshot 네 디렉터리는 stage하지 않습니다.

Chromium에서 Alert의 다섯 형태를 확인했습니다. 기본·정보·성공·주의는
`status`, 오류는 `alert` 역할이고, 계산된 테두리·텍스트 색은 각
token과 일치했습니다. dark mode의 success·warning 값과 Forest
colormap에서도 alias 적용을 확인했습니다. Toast warning을 실행하면
`status` live region에 제목이 나타나고 warning 테두리가 적용됐습니다.
390px preview에서 문서 가로 overflow는 없었습니다. 실제 보조기술의
발표 여부는 확인하지 않았습니다.
