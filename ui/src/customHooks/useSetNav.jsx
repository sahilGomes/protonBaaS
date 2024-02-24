import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

export default function useSetNav() {
    const { setShowNav,setPopmessage } = useOutletContext();

    useEffect(() => {
        if (location.hash === "#/login") {
            setShowNav(false);
        }
        else {
            setShowNav(true);
        }
    }, [setShowNav]);
    return setPopmessage;
}
