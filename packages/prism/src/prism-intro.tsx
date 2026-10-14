import { useRef, type ReactNode } from "react";
import { PrismIcon } from "./prism-icon";
import { PrismStarGlyph as Star } from "./prism-icon";
import { PrismChatInput, type PrismChatInputProps } from "./prism-chat";
import { PrismSkeleton } from "./prism-primitives";

export function PrismChatIntro({name,cards,questions,onPromptSelect,loading=false,logo,composer}: {
    name:string;cards:readonly {id:string;title:string;description:string;icon?:ReactNode;onOpen:()=>void}[];
    questions:readonly string[];onPromptSelect:(question:string)=>void;loading?:boolean;logo?:ReactNode;composer:PrismChatInputProps;
}) {
    const ref=useRef<HTMLDivElement>(null);
    return <div className="prism-chat-intro"><header><div aria-hidden="true">{logo??<PrismIcon name="SymbolBgIcon" size={65}/>}</div><h2><span>{name}</span>님 어떤 인재를 찾고 계신가요?</h2><h3>필요한 후보 추천이나 인재분석을 도와드리겠습니다.</h3></header>
        <div className="prism-intro-cards">{loading ? cards.map(card=><div key={card.id} className="prism-intro-card prism-intro-card-skeleton" role="status" aria-label={`${card.title} 불러오는 중`}><PrismSkeleton width={48} height={48} radius={7}/><div><PrismSkeleton width={120} height={20}/><PrismSkeleton width={180} height={20}/></div></div>) : cards.map(card=><button key={card.id} className="prism-intro-card" type="button" onClick={card.onOpen}><span className="prism-intro-card-icon" aria-hidden="true">{card.icon??<Star/>}</span><div className="prism-intro-card-body"><strong>{card.title}</strong><p>{card.description}</p></div></button>)}</div>
        <div ref={ref} className="prism-intro-input">{!!questions.length&&<section><p>아래 질문으로 빠르게 시작해보세요</p><div>{questions.slice(0,5).map(question=><button key={question} type="button" onClick={()=>{onPromptSelect(question);ref.current?.querySelector('textarea')?.focus();}}>{question}</button>)}</div></section>}<PrismChatInput {...composer}/></div></div>;
}
