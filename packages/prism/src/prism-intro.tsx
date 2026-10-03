import { useRef, type ReactNode } from "react";
import { PrismIcon } from "./prism-icon";
import { PrismStarGlyph as Star } from "./prism-icon";
import { PrismChatInput, type PrismChatInputProps } from "./prism-chat";
import { PrismSkeletonGroup } from "./prism-primitives";

export function PrismChatIntro({name,cards,questions,onPromptSelect,loading=false,logo,composer}: {
    name:string;cards:readonly {id:string;title:string;description:string;icon?:ReactNode;onOpen:()=>void}[];
    questions:readonly string[];onPromptSelect:(question:string)=>void;loading?:boolean;logo?:ReactNode;composer:PrismChatInputProps;
}) {
    const ref=useRef<HTMLDivElement>(null);
    return <div className="prism-chat-intro"><header><div aria-hidden="true">{logo??<PrismIcon name="SymbolBgIcon" size={65}/>}</div><h2><span>{name}</span>님 어떤 인재를 찾고 계신가요?</h2><h3>필요한 후보 추천이나 인재분석을 도와드리겠습니다.</h3></header>
        {loading ? <PrismSkeletonGroup rows={3}/> : <div className="prism-intro-cards">{cards.map(card=><button key={card.id} type="button" onClick={card.onOpen}><span aria-hidden="true">{card.icon??<Star/>}</span><strong>{card.title}</strong><p>{card.description}</p></button>)}</div>}
        <div ref={ref} className="prism-intro-input">{!!questions.length&&<section><p>아래 질문으로 빠르게 시작해보세요</p><div>{questions.slice(0,5).map(question=><button key={question} type="button" onClick={()=>{onPromptSelect(question);ref.current?.querySelector('textarea')?.focus();}}>{question}</button>)}</div></section>}<PrismChatInput {...composer}/></div></div>;
}
