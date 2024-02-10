import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Homepage() {
    /*The only function of this page is to navigate to appropriate position based on /#/ value.
    That is if auth_token in local storage go to /collections or else to /login.
    */
    const navigate = useNavigate();

    useEffect(() => {
        console.log(location.hash)
        if (localStorage.getItem("admin_auth")) {
            navigate("/collections");
        }
        else {
            navigate("/login");
        }
    });

    return null;
}