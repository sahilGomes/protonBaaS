import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../component/Navbar';
import Popupbar from '../component/Popupbar';

export default function RootLayout() {
  const [showNav, setShowNav] = useState(false);  //state to showNav component
  const [popmessage, setPopmessage] = useState(""); //state to show notification/popup from bottom

  return (
    <>
      {popmessage && <Popupbar popmessage={popmessage} setPopmessage={setPopmessage} />}
      <div className='app-container flex w-full h-screen bg-base-100'>
        {showNav && <Navbar/>}
        <Outlet context={{ setShowNav,setPopmessage }} />
      </div>
    </>
  );
}