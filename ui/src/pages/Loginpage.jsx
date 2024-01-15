import useSetNav from "../customHooks/useSetNav";
import logo from "../assets/logo.png";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Loginpage() {
  const setPopmessage = useSetNav();
  const buttonref = useRef();
  const navigate = useNavigate();
  let data_present_in_localstorage = localStorage.getItem("admin_auth") ? true : false;

  useEffect(() => {
    if (data_present_in_localstorage) {
      navigate("/editor");
    }
  });

  function buttonEffect(action) {
    buttonref.current.style.cursor = action ? "not-allowed" : "pointer";
    buttonref.current.style.animation = action ? "loadingLogin 0.5s 0s infinite alternate" : undefined;
  }

  async function handleSubmitData(event) {
    event.preventDefault();
    // login button loading effect
    buttonEffect(true);
    // generate data to send
    let data = new FormData(event.currentTarget);
    let dataToSend = {};
    for (const pair of data) {
      dataToSend[pair[0]] = pair[1];
    }
    // make request and do appropriate action on response
    try {
      const res = await fetch(
        // `${location.protocol}://${location.host}/api/admins/auth-with-password`,
        "http://127.0.0.1:3000/api/admins/auth-with-password",
        {
          method: 'POST',
          body: JSON.stringify(dataToSend),
          headers: {
            "Content-Type": "application/json"
          }
        },
      );
      const resData = await res.json();
      console.log(resData);
      if (resData.code === 400) {
        setPopmessage(resData.message);
        buttonref.current.style.animation = undefined;
        buttonEffect(false);
      }
      else {
        localStorage.setItem("admin_auth", JSON.stringify(resData));
        buttonEffect(false);
        navigate("/editor");
      }
    } catch (err) {
      setPopmessage("Error! RETRY again");
      buttonEffect(false);
    }
  }

  function handleShowPassword() {
    let passwordfiled = document.getElementById("passwordfield");
    let toSet = passwordfiled.getAttribute("type") === "password" ? "text" : "password";
    passwordfiled.setAttribute("type", toSet);
  }

  if (!data_present_in_localstorage) {
    return (
      <div className="main-container flex flex-col h-screen">
        <main className="w-full h-[95%] flex justify-center items-center min-h-[650px] bg-base-100">
          <div className="form-container h-[60%] w-[90%] border-solid border-neutral border-2 rounded-lg max-w-[420px]">
            <div className="text-center font-mono text-3xl mb-[20px] mt-[10px]  text-neutral-content font-bold flex justify-center gap-2">
              <img src={logo} alt="logo" />
              <p className="text-accent-content"><span className="text-accent">Proton</span>BaaS</p>
            </div>
            <form className="w-[80%] mx-auto max-w-[420px]" id="logindetails" action="/" onSubmit={handleSubmitData}>
              <p className="text-center mb-[10px] text-info">Admin sign in</p>
              <div className="email mb-[22px]">
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Email *</span>
                  </div>
                  <input type="email" name="identity" placeholder="Provide Email" className="input input-bordered input-accent w-full" />
                </label>
              </div>
              <div className="password mb-[30px]">
                <label className="form-control w-full relative">
                  <div className="label">
                    <span className="label-text">Password *</span>
                  </div>
                  <input type="password" id="passwordfield" name="password" placeholder="Provide Password" className="input input-bordered input-accent w-full" />
                  <span className="absolute right-4 top-[55%]" onClick={handleShowPassword}><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" className="ai ai-EyeOpen"><path d="M21.257 10.962c.474.62.474 1.457 0 2.076C19.764 14.987 16.182 19 12 19c-4.182 0-7.764-4.013-9.257-5.962a1.692 1.692 0 0 1 0-2.076C4.236 9.013 7.818 5 12 5c4.182 0 7.764 4.013 9.257 5.962z" /><circle cx="12" cy="12" r="3" /></svg></span>
                </label>
              </div>
              <button type="submit" className="btn btn-accent btn-md btn-block font-bold flex justify-center" form="logindetails" ref={buttonref}>
                <span className="txt-accent-content font-bold text-lg">Login</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="20" viewBox="0 0 24 24" fill="none" stroke="" strokeWidth="2" strokeLinejoin="round" className="ai ai-ArrowRight stroke-accent-content"><path d="M4 12h16" /><path d="M13 5l7 7-7 7" /></svg>
              </button>
            </form>
          </div>
        </main>
        <footer className="h-[5%] flex justify-end items-center pr-[8px] bg-neutral">
          <p className="text-right text-accent-content"><a href="https://github.com/sahilGomes/protonBaaS" target="_blank" className="text-accent">Github </a>| ProtonBaaS version 0.0.1</p>
        </footer>
      </div>
    );
  }
}