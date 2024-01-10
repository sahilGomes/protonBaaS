import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../component/Navbar';

function RootLayout() {
  const [showNav, setShowNav] = useState(false);

  return (
    <>
      {showNav ?
        <div>
          <Navbar/>
          <Outlet context={{ setShowNav }} />
        </div>
        :
        <Outlet context={{ setShowNav }} />
      }
    </>
  );
}

export default RootLayout