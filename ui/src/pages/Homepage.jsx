import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Homepage() {
    const navigate = useNavigate();

    useEffect(() => {
        console.log(location.hash)
        if (localStorage.getItem("auth_token")) {
            navigate("/editor");
        }
        else {
            navigate("/login");
        }
    });

    return null;
}