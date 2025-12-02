import { useState, useEffect } from 'react'

import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import { Outlet, useLocation } from 'react-router-dom'

function App() {
  const location = useLocation();
  const [isLoggedIN, setIsLoggedIN] = useState(false);
  const [isFooter, setIsFooter] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIN(!!user);
  });


  useEffect(() => {
    const currentPath = location.pathname;

    if ( currentPath.startsWith('/driver/dashboard') || currentPath.startsWith('/login') ||currentPath.startsWith('/register') || currentPath.startsWith('/hospital/dashboard') || currentPath.startsWith('/drive') ) {
      setIsFooter(false);
    }

    else {
      setIsFooter(true);
    }

  }, [location.pathname]);

  return (
    <>
      <Header isLoggedIN={isLoggedIN} setIsLoggedIN={setIsLoggedIN} />
      <main>
        <Outlet />
      </main>
      {isFooter && <Footer />}
    </>
  )
}

export default App;
