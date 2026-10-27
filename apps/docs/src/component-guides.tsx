type GuideProp = {
    name: string;
    type: string;
    defaultValue: string;
    behavior: string;
};

type ComponentGuide = {
    props: readonly GuideProp[];
    keyboard: readonly string[];
    states: readonly { name: string; behavior: string }[];
};

const guides: Record<string, ComponentGuide> = {
    button: {
        props: [
            { name: "variant", type: "primary | outline | ghost", defaultValue: "primary", behavior: "버튼의 시각적 강조를 선택합니다." },
            { name: "size", type: "default | icon", defaultValue: "default", behavior: "아이콘 전용 정사각형 크기를 선택할 수 있습니다." },
            { name: "type", type: "button | submit | reset", defaultValue: "button", behavior: "폼 제출은 명시적으로 submit을 지정합니다." },
            { name: "loading / loadingText", type: "boolean / string", defaultValue: "false / 없음", behavior: "처리 중임을 알리고 클릭을 막습니다. 원할 때 표시 문구를 바꿉니다." },
        ],
        keyboard: ["Tab으로 포커스하고 Enter 또는 Space로 실행합니다.", "loading 또는 disabled 상태에서는 작업을 실행하지 않습니다."],
        states: [
            { name: "기본", behavior: "primary 강조 버튼이며 type은 button입니다." },
            { name: "보조", behavior: "outline·ghost로 강조 수준을 낮춥니다." },
            { name: "처리 중·비활성", behavior: "spinner·busy 상태 또는 native disabled 상태를 보여 줍니다." },
        ],
    },
    "color-input": {
        props: [
            { name: "label", type: "string", defaultValue: "필수", behavior: "hex 입력 필드의 보이는 이름입니다." },
            { name: "value / defaultValue", type: "#RRGGBB", defaultValue: "#000000", behavior: "제어형 또는 내부 상태로 불투명 색상을 받습니다." },
            { name: "onValueChange", type: "(hex) => void", defaultValue: "없음", behavior: "유효한 색상이 확정될 때 호출됩니다. 제어형에서는 필수입니다." },
            { name: "name / disabled", type: "string / boolean", defaultValue: "없음 / false", behavior: "native 텍스트 값을 폼에 넣거나 입력을 막습니다." },
            { name: "variant", type: "card | inline", defaultValue: "card", behavior: "입력 주변 면 표현을 고릅니다." },
        ],
        keyboard: ["Tab으로 hex 필드와 브라우저 기본 색상 입력에 접근합니다.", "hex가 완성되지 않으면 오류를 표시하고 마지막 유효한 값을 보존합니다."],
        states: [
            { name: "기본", behavior: "색상 견본과 6자리 hex 값을 함께 보여 줍니다." },
            { name: "잘못된 입력", behavior: "오류를 연결하고 기존 확정색은 유지합니다." },
            { name: "비활성", behavior: "두 입력을 사용할 수 없고 폼 제출에서 제외됩니다." },
        ],
    },
    "color-picker": {
        props: [
            { name: "label", type: "string", defaultValue: "필수", behavior: "hex 입력 필드의 보이는 이름입니다." },
            { name: "value / defaultValue", type: "#RRGGBB | #RRGGBBAA", defaultValue: "#000000", behavior: "불투명하면 6자리, alpha가 있으면 8자리 소문자 hex로 정규화합니다." },
            { name: "onValueChange", type: "(hex) => void", defaultValue: "없음", behavior: "색상 채널을 바꿀 때 호출됩니다. 제어형에서는 필수입니다." },
            { name: "swatches", type: "readonly string[]", defaultValue: "[]", behavior: "빠르게 선택할 색상 버튼을 표시합니다." },
            { name: "name / disabled / readOnly", type: "string / boolean / boolean", defaultValue: "없음 / false / false", behavior: "native 폼 값, 입력 차단, 읽기 전용 상태를 정합니다." },
            { name: "showEyeDropper", type: "boolean", defaultValue: "true", behavior: "브라우저가 EyeDropper API를 지원할 때만 버튼을 표시합니다." },
        ],
        keyboard: ["색조·채도·밝기·불투명도는 각각 Tab과 화살표 키로 조정합니다. 포인터용 2D 영역과 같은 색상 값을 편집합니다.", "hex 필드에 6자리 또는 8자리 값을 직접 입력하고, 견본 버튼은 Enter·Space로 선택합니다.", "스포이드가 취소되거나 지원되지 않아도 현재 값은 유지됩니다."],
        states: [
            { name: "불투명", behavior: "#rrggbb를 폼에 제출합니다." },
            { name: "반투명", behavior: "#rrggbbaa를 폼에 제출합니다." },
            { name: "잘못된 입력", behavior: "오류를 표시하고 기존 확정값을 유지합니다." },
            { name: "비활성·읽기 전용", behavior: "색상 변경을 막습니다. 비활성 값은 폼에 제출하지 않습니다." },
        ],
    },
    coachmark: {
        props: [
            { name: "open / onOpenChange", type: "boolean / (open) => void", defaultValue: "필수", behavior: "호출자가 표시 상태를 소유합니다." },
            { name: "trigger / title / children", type: "ReactElement / string / ReactNode", defaultValue: "필수", behavior: "안내 대상, 제목, 설명을 제공합니다." },
            { name: "step / totalSteps", type: "number / number", defaultValue: "없음", behavior: "둘 다 제공하면 현재 단계와 전체 단계를 표시합니다." },
            { name: "nextAction", type: "{ label, onClick }", defaultValue: "없음", behavior: "다음 단계 동작을 호출자에게 위임합니다." },
            { name: "side", type: "top | right | bottom | left", defaultValue: "bottom", behavior: "대상에 대한 안내 위치입니다." },
        ],
        keyboard: ["Trigger를 Enter·Space로 열고 Tab으로 닫기·다음 버튼에 이동합니다.", "Escape로 닫으면 focus가 trigger로 돌아옵니다."],
        states: [
            { name: "닫힘", behavior: "Trigger만 표시합니다." },
            { name: "열림", behavior: "제목·설명·닫기 버튼이 있는 비모달 안내를 표시합니다." },
            { name: "단계 표시", behavior: "step과 totalSteps를 함께 받으면 진행 번호를 표시합니다." },
        ],
    },
};

function ComponentGuidePanel({ id }: { id: string }) {
    const guide = guides[id];
    if (!guide) return null;

    return <section aria-labelledby="component-guide-heading"
        className="mt-6 grid gap-5 rounded-sm border border-border bg-surface p-4">
        <div>
            <p className="m-0 text-xs font-semibold uppercase tracking-wide text-muted">
                Component guide
            </p>
            <h3 id="component-guide-heading" className="mb-0 mt-1 text-lg font-semibold">
                API와 사용 상태
            </h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full min-w-[540px] border-collapse text-left text-sm">
                <caption className="sr-only">{id} 주요 속성</caption>
                <thead><tr className="border-b border-border text-muted">
                    <th scope="col" className="py-2 pr-3">속성</th>
                    <th scope="col" className="py-2 pr-3">타입</th>
                    <th scope="col" className="py-2 pr-3">기본값</th>
                    <th scope="col" className="py-2">동작</th>
                </tr></thead>
                <tbody>{guide.props.map((prop) => <tr key={prop.name}
                    className="border-b border-border align-top last:border-b-0">
                    <th scope="row" className="py-2 pr-3 font-mono font-medium">{prop.name}</th>
                    <td className="py-2 pr-3 font-mono text-xs">{prop.type}</td>
                    <td className="py-2 pr-3">{prop.defaultValue}</td>
                    <td className="py-2">{prop.behavior}</td>
                </tr>)}</tbody>
            </table>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
            <div><h4 className="m-0 text-sm font-semibold">키보드와 접근성</h4>
                <ul className="mb-0 mt-2 grid gap-1 pl-5 text-sm text-muted">
                    {guide.keyboard.map((item) => <li key={item}>{item}</li>)}
                </ul>
            </div>
            <div><h4 className="m-0 text-sm font-semibold">대표 상태</h4>
                <dl className="mt-2 grid gap-2 text-sm">
                    {guide.states.map((state) => <div key={state.name}>
                        <dt className="font-medium">{state.name}</dt>
                        <dd className="m-0 text-muted">{state.behavior}</dd>
                    </div>)}
                </dl>
            </div>
        </div>
    </section>;
}

export { ComponentGuidePanel, guides };
export type { ComponentGuide };
