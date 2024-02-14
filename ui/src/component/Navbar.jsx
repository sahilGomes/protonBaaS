import { Link, NavLink, useNavigate } from "react-router-dom";
import main_logo from "../assets/logo.png";
import editor_logo from "../assets/editorLogo.svg";
import collections_logo from "../assets/dbdataLogo.svg";
import settings_logo from "../assets/settingsLogo.svg";
import logout_logo from "../assets/logoutLogo.svg";

export default function Navbar() {
  const navigate = useNavigate();

  function logoutHandle() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <>
      <div className="navbar-container w-16 border-r-[0.5px] relative">
        <nav>
          <Link to="/" className=" mt-4 h-[55px]"><img src={main_logo} alt="ProtonBaaS" className="w-[48px] h-[48px]" /></Link>
          <NavLink to={"/collections"} className="hover:bg-base-300 relative after:content-['collections']  after:z-10 after:absolute after:hidden hover:after:inline after:top-[25%] after:left-[120%]"><img src={collections_logo} alt="collections_logo" className="w-[48px] h-[48px]" /></NavLink>
          <NavLink to={"/logs"} className="hover:bg-base-300 after:content-['logs'] after:z-10 relative after:absolute after:hidden hover:after:inline after:top-[25%] after:left-[120%]"><img src={editor_logo} alt="editor_logo" className="w-[48px] h-[48px]" /></NavLink>
          <NavLink to={"/settings"} className="hover:bg-base-300 relative after:content-['settings'] after:z-10 after:absolute after:hidden hover:after:inline after:top-[25%] after:left-[120%]"><img src={settings_logo} alt="settings_logo" /></NavLink>
          <button className="absolute bottom-0 p-4 hover:bg-base-300" onClick={logoutHandle}><img src={logout_logo} alt="logout" /></button>
        </nav>
      </div>
    </>
  );
}