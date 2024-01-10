import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

export default function useSetNav() {
    const { setShowNav } = useOutletContext();

    useEffect(()=>{
        if (location.hash === "#/login") {
            setTimeout(()=>setShowNav(false),5000);
        }
        else {
            setTimeout(()=>setShowNav(true),5000);
        }
        console.log("i am useSetNav hook");
        console.log(location.hash)
    },[]);
    return;
}
