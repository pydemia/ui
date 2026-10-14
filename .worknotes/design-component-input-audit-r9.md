# Input family design harmony audit (R9)

## 범위와 판정

- Read-only audit 기준: `HEAD 0b1dec2b`, branch `codex/design-component-harmony`.
- 기존 디자인 방향인 Basic/PRISM 계약은 바꾸지 않고 input family가 design mode의 tone·density를 더 온전히 받을 수 있는지를 source와 catalog에서 확인했다. Source/build/Git/browser 변경은 하지 않았다.
- 주된 결함은 **디자인 모드가 기본 control에만 적용되고 composite host에는 닿지 않는 것**, **공통 입력의 간격·높이 토큰이 디자인별로 달라지지 않는 것**, **underline 변형에 대한 unlayered cascade 누수**다. 여러 복합체에서 focus ring/표면 책임이 host와 안쪽 Input으로 중복될 수 있다.

## 확인 파일과 docs demo inventory

`apps/docs/src/catalog.tsx`가 해당 family의 실제 catalog와 code/demo 위치를 모두 포함한다. 별도의 Input demo source는 발견하지 못했다.

| 영역 | source | catalog entry / demo |
| --- | --- | --- |
| 원시 입력 및 field context | `packages/ui/src/components/input.tsx` (8), `textarea.tsx` (8), `field.tsx` (21) | Input 5605, Textarea 6043, Field는 개별 entry 없이 composition |
| input composites | `input-group.tsx` (7), `affixed-input.tsx` (14), `password-input.tsx` (12), `number-input.tsx` (67), `pin-input.tsx` (20), `tags-input.tsx` (25), `search-input.tsx` (22), `color-input.tsx` (18) | InputGroup 5657, Number 5681, Tags 5702, Color 5722, Password 5736, PIN 5749, Search 5638, Affixed 6934 |
| option / date composites | `autocomplete.tsx` (27), `combobox.tsx` (35), `multi-select.tsx` (37), `select.tsx` (15), `native-select.tsx` (9), `date-picker.tsx` (22), `date-time-picker.tsx` (29), `date-range-picker.tsx` (26) | NativeSelect 6071, Combobox 7129, Autocomplete 7188, MultiSelect 7213, DatePicker 7277, DateRangePicker 7346, DateTimePicker 7403 |
| theme/token cascade | `packages/ui/src/design-modes.css` (349–362), `packages/ui/src/styles.css` (1–42, 215–224), `apps/docs/src/main.tsx` (20–21), `apps/docs/src/styles.css` (1–3) | demos use these shared imports |

`packages/ui/src/components`에는 `form.tsx` 또는 공유 Form primitive가 없다. 실제 계약은 native `<form>`과 `Field` 조합이며 catalog demos에서도 그 방식이다. Field는 label/description/error/required 관계를 제공하지만 스타일 context marker는 없다.

## 실제 cascade와 표현 불일치

1. **underline 모양이 일부 원소에서 디자인 layer에 의해 다시 채워진다.** `design-modes.css:349–356`의 첫 규칙은 underline을 제외하지만 두 번째 배경 규칙은 `textarea`, `select-trigger`, `native-select`에 `data-appearance` 제외 조건이 없다. Tailwind 클래스의 `bg-transparent`보다 unlayered design CSS가 우선하여 underline Textarea/SelectTrigger/NativeSelect에 `--field-fill`이 적용된다. Input만 두 번째 규칙에서 outline만 지정한다. 의도된 투명/밑줄 recipe를 보존하려면 두 번째 규칙도 appearance별로 제한해야 한다.

2. **테마별 spacing/size 값이 사실상 고정이다.** `styles.css:32–42`는 `--control-height:36px`, `--space-2:8px`, `--space-3:12px` 등 공통 scale을 둔다. Input은 `input.tsx:20–24`에서 공통 height와 horizontal padding을, Textarea는 `textarea.tsx:19–23`에서 고정 space-3/space-2를 소비한다. `design-modes.css`는 field radius/fill/decoration/image은 mode별로 바꾸지만 field padding, inline gap, control height/field density token은 재정의하지 않는다. 따라서 Flat/Swiss/Retro 등 모드에서도 입력군의 hit area와 content inset은 같은 수치다. 밀도 설정을 별도 개념으로 유지하되 design mode가 선택적으로 소비할 수 있는 `--field-inline-padding`, `--field-block-padding`, `--field-height`, `--field-gap` 같은 역할 토큰이 비어 있다.

3. **복합체의 표면과 focus 소유권이 이중화된다.** `InputGroup`과 `AffixedInput`은 각각 host에 border/radius/background/focus-within을 설정하지만 child `Input`도 기본 `data-ui="input"` 및 `data-appearance="outline"`을 가진다 (`input-group.tsx:7–52`, `affixed-input.tsx:44–53`). NumberInput stepper도 같은 wrapper+Input 형태다 (`number-input.tsx:182–244`). 디자인 규칙 `design-modes.css:349–359`는 이 안쪽 Input에 radius, shadow, image, fill을 다시 적용하므로 투명·borderless로 의도한 inner control에 독립 field decoration이 들어갈 수 있다. CSS selector가 unlayered라 Tailwind의 `bg-transparent`, `rounded-none`, `border-0` 유틸리티 선언보다 우선한다.

4. **focus ring 제거 utility가 공통 전역 규칙을 이기지 못할 수 있다.** `styles.css:215`의 unlayered `*:focus-visible`이 outline을 지정한다. Composite 안쪽 Input은 layered `focus-visible:outline-none`을 사용하고 outer wrapper는 `focus-within` ring을 그린다 (`input-group.tsx:31,48`, `affixed-input.tsx:48`, `number-input.tsx:229,242–244`). Normal layered utility는 unlayered global 선언보다 낮은 우선순위이므로 inner/outer ring이 같이 보이는 구조다. Composite-context selector에서 안쪽 native control의 ring을 명시적으로 끄거나 host 책임 하나로 통일할 수 있어야 한다. 단, 단독 control의 :focus-visible은 유지한다.

5. **주요 shared primitive 외에 button-shaped field/host는 design-mode selector에서 빠져 있다.** DatePicker/DateRangePicker trigger는 raw `<button>`이고 고정 `h-[var(--control-height)] px-[var(--space-3)] rounded-sm border bg-surface`다 (`date-picker.tsx:46–71`, `date-range-picker.tsx:100–122`). MultiSelect trigger도 raw button이며 자체 border/focus/invalid 규칙을 갖는다 (`multi-select.tsx:129–155`). `select.tsx`의 `SelectTrigger`는 표준 selector에 들어오지만 Date/Range/MultiSelect trigger는 들어오지 않는다. 날짜, 선택, 검색/태그 입력을 같은 화면에 둘 때 같은 field family여도 모드별 tone이 불균일하다.

6. **raw native text controls는 shared field marker/recipe를 우회한다.** `tags-input.tsx:173–190`, `pin-input.tsx:116–130`, `color-input.tsx:79–115`, `multi-select.tsx:167–169,188–198`, `date-range-picker.tsx:93–98`의 hidden inputs/`date-picker.tsx:46–71`의 trigger는 custom DOM이다. Tags/Pin/Color의 visible control은 각각 직접 클래스로 완성돼 기본 focus/validation가 다르게 연결된다. Color hex text input은 `h-8`, `px-2`, `bg-background`를 고정하고 mode field tokens를 소비하지 않는다. Pin slot display는 size를 `--control-height`에 연결했지만 surface/radius/focus를 독자 구현한다. Hidden/native form controls는 표시 selector에 포함시키지 않아야 한다.

7. **상태 전달은 family마다 다르며, host-level styling 대상으로 모이지 않는다.** 기본 Input/Textarea/NativeSelect/SelectTrigger는 disabled와 invalid utility를 갖고, Field는 `aria-invalid`를 child로 준다 (`field.tsx:32–48`). TagsInput은 invalid를 wrapper와 text input에 나눠 반영한다 (`tags-input.tsx:138–147,180–184`); NumberInput은 invalid를 Input에, 오류 문구를 sibling에 둔다 (`number-input.tsx:193–200,271–274`); ColorInput은 raw text control에만 invalid를 준다 (`color-input.tsx:90–116`). AffixedInput의 disabled는 inner Input에만 적용돼 prefix/suffix의 opacity·disabled affordance는 별도다. Date/Range trigger는 `ComponentProps<"button">`와 `...triggerProps`를 통해 Field의 `aria-invalid`를 받을 수 있고 aria-invalid border utility도 갖지만, design-mode용 semantic host marker는 없다. Host-level `data-invalid`/`data-disabled`와 slot-specific markers가 부족해 design layer가 state 표현을 통일하기 어렵다.

## 우선순위와 제안

**P0 — cascade 누수 및 composite context를 먼저 닫는다.**

- `data-ui="field"`와 `data-slot="field-label|field-description|field-error|field-control"`을 Field에 제공해 gap, caption/error ink, required/error 상태를 semantic selector로 연결한다. Label/description/error DOM, ids와 ARIA 관계는 그대로 둔다.
- `data-ui="input-group"`, `data-ui="affixed-input"`, `data-ui="number-input"`처럼 host identity를 두고, 기존 `data-slot="input-group-control|input-group-addon"`를 보존한다. child Input을 composite context에서 field appearance selector의 직접 대상에서 제외하거나 host의 `--field-*`를 사용하게 해 double radius/fill/shadow를 막는다. `data-appearance` props/API를 변경하지 않는다.
- underline 배경 selector에 appearance 조건을 맞춘다. textarea/select/native select의 underline은 transparent recipe를 유지한다.
- composite에서 host가 focus ring을 담당하는 경우 host-context 안의 child focus outline을 끄는 unlayered rule을 둔다. standalone control은 기존 focus-visible을 유지한다.

**P1 — 한 semantic recipe로 visible control host들을 연결한다.**

- 표준 native/trigger markers: 기존 `data-ui="input|textarea|native-select|select-trigger"`를 유지.
- composite visible host/slot markers: `date-picker-trigger`, `date-range-picker-trigger`, `multi-select-trigger`, `tags-input-control|chip`, `pin-input-cell|control`, `color-input-control|swatch`, `search-input-control`, `password-input-control|visibility-toggle`. hidden form inputs 및 multi-select의 hidden native `<select>`에는 표시 recipe marker를 달지 않는다.
- 모든 visible field에 mode 소비용 `--field-height`, `--field-inline-padding`, `--field-block-padding`, `--field-gap`, `--field-radius`, `--field-border-width`, `--field-fill`, `--field-decoration`, `--field-focus` semantic slots를 제공한다. `styles.css`의 base values는 Basic 그대로 두고, 디자인별 overrides는 `design-modes.css`에만 둔다. 기존 global density token과 역할이 다르므로 전역 density contract를 제거하지 말고, 필요한 mode만 field role token을 override한다.
- Design selectors는 raw `input, textarea, select, button` 태그 전역보다 semantic `data-ui`/`data-slot`을 사용한다. 단독 input의 current `appearance` semantics와 disabled/readOnly/form/keyboard behavior를 유지한다.

**P2 — focused demos를 code contract로 반영한다.**

- `catalog.tsx`의 Input/Textarea/NativeSelect underline 예시, InputGroup·Affixed/Number·Date/Range·MultiSelect를 mode가 다른 실제 composite 예로 묶는다. 같은 기능과 값/state를 유지한 채 spacing/radius/tone 대비를 관찰할 fixture만 추가한다.
- 검토 우선 demo는 catalog input 5605, InputGroup 5657–5678, Number 5681, Tags 5702, Color 5722, Password 5736, Pin 5749, Textarea 6043, NativeSelect 6071, Affixed 6934, Combo/Autocomplete/MultiSelect 7129–7242, Date family 7277–7440이다.

## 범위 내 파일 인벤토리

기본 field/token 소비: `input.tsx`, `textarea.tsx`, `field.tsx`, `select.tsx`, `native-select.tsx`.
복합 input: `input-group.tsx`, `affixed-input.tsx`, `password-input.tsx`, `number-input.tsx`, `pin-input.tsx`, `tags-input.tsx`, `search-input.tsx`, `color-input.tsx`.
조합 선택/날짜: `autocomplete.tsx`, `combobox.tsx`, `multi-select.tsx`, `date-picker.tsx`, `date-time-picker.tsx`, `date-range-picker.tsx`.
기반 테마 및 문서 demo: `packages/ui/src/design-modes.css`, `packages/ui/src/styles.css`, `apps/docs/src/catalog.tsx`, `apps/docs/src/main.tsx`, `apps/docs/src/styles.css`.

이 인벤토리에는 `form.tsx`가 없다. Form-level layout은 native `<form>`이며 공통 label/error context는 `Field`가 소유한다. 따라서 후속 수정은 새 form API를 추측해 추가하기보다 현재 Field + native form contract를 보존한다.

## 제한

브라우저 computed style/스크린샷/접근성 도구는 이번 read-only source audit에서 실행하지 않았다. 위 cascade 판정은 현재 source import와 CSS cascade/layer 구조에 근거한다. 실제 픽셀 조합은 후속 구현 시 확인할 항목이다.


## R9 semantic hook implementation (root handoff)

- Added only `data-ui`, `data-slot`, `data-variant`, and conditional undefined marker attributes in the scoped component DOM. Existing classes, component props/types, callbacks, validation, keyboard handling, and state flow were not changed.
- `Field` and AffixedInput, NumberInput, TagsInput, PinInput, DateTimePicker now expose the agreed field context. InputGroup retains `data-slot="input-group"` and adds `data-ui="field-frame"`. Affixed prefix/suffix and field actions/chips/control/cells expose their slots.
- ColorInput exposes its variant and swatch/control markers; PasswordInput and SearchInput expose composite roots and Search controls. DatePicker/DateRangePicker/MultiSelect visible triggers expose `data-ui="select-trigger"` with outline appearance. Autocomplete/Combobox popup panel hosts expose `data-ui="overlay-panel"`.
- Hidden form inputs/selects were left unmarked; PinInput's real hidden-ish native input has no primitive marker. `input.tsx`, `textarea.tsx`, `select.tsx`, and `native-select.tsx` remain unchanged as requested.
- Source files changed: `packages/ui/src/components/field.tsx`, `affixed-input.tsx`, `input-group.tsx`, `number-input.tsx`, `tags-input.tsx`, `color-input.tsx`, `password-input.tsx`, `search-input.tsx`, `pin-input.tsx`, `date-time-picker.tsx`, `date-picker.tsx`, `date-range-picker.tsx`, `multi-select.tsx`, `autocomplete.tsx`, and `combobox.tsx`.
- No build/tests/browser/Git/CSS/docs catalog operations were run; root owns shared CSS and validation.
