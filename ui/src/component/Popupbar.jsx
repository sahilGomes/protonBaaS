import { useEffect, useState } from "react";

export default function Popupbar({popmessage,setPopmessage}) {

    useEffect(()=>{
        let timeoutId = setTimeout(()=>setPopmessage(""),5000);
        return ()=>{
            clearTimeout(timeoutId);
        }
    });

    return (
        <div className="w-[80%] max-w-[420px] animate-[popItUp_1s_ease-in_forwards] absolute bottom-3 left-[50%] translate-x-[-50%] flex justify-between items-center gap-4 p-[6px] bg-info rounded-md first-letter">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" fill="currentColor"><path d="M21 3C21.5523 3 22 3.44772 22 4V18C22 18.5523 21.5523 19 21 19H6.455L2 22.5V4C2 3.44772 2.44772 3 3 3H21ZM20 5H4V18.385L5.76333 17H20V5ZM13 7V15H11V7H13ZM17 9V15H15V9H17ZM9 11V15H7V11H9Z" className="text-info-content"></path></svg>
            <p className="text-info-content font-serif">{popmessage}</p>
            <button onClick={()=>setPopmessage("")}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"strokeLinejoin="round" className="ai ai-XSmall text-error"><path d="M17 17L7 7m10 0L7 17"/></svg></button>
        </div>
    );
}