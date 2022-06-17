import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/Logo-Summarroo-Black.png'


function Header() {

  const [top, setTop] = useState(true);

  // detect whether user has scrolled the page down by 10px 
  useEffect(() => {
    const scrollHandler = () => {
      window.pageYOffset > 10 ? setTop(false) : setTop(true)
    };
    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, [top]);  

  return (
    <header className={`fixed w-full z-30 md:bg-opacity-90 transition duration-300 ease-in-out ${!top && 'bg-white backdrop-blur-sm shadow-lg'}`}>
      <div className="max-w-8xl mx-10 px-5 sm:px-6 mt-4 md:mt-0">
        <div className="flex justify-center flex-wrap md:flex items-center md:justify-between h-32 md:h-20 md:w-full">

          {/* Site branding */}
          <div className="flex-shrink-0 mx-auto md:mr-4 mb-1 md:mb-0">
            {/* Logo */}
            <Link to="/" className="flex" aria-label="Summaroo">
              <span class="font-bold text-4xl tracking-tight hover:font-bold text-gray-900">Summaroo </span>
              <div class="ml-2 w-8 h-8">
                <img src={Logo} alt="Summaroo" />
              </div>
            </Link>
          </div>

          {/* Site navigation */}
          <nav className="flex flex-grow">
            <ul className="flex flex-grow justify-center md:justify-end flex-wrap items-center">
              <li>
                <Link to="/kangaroos" className="btn-sm w-28 font-medium text-gray-900 border border-gray-900 hover:text-gray-900 flex items-center transition duration-150 ease-in-out">Sign in</Link>
              </li>
              <li>
                <Link to="/kangaroos" className="btn-sm text-white bg-gray-900 hover:bg-gray-800 ml-3 w-28">
                  <span>Sign up</span>
                  <svg className="w-3 h-3 fill-current text-white flex-shrink-0 ml-2 -mr-1" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z" fillRule="nonzero" />
                  </svg>                  
                </Link>
              </li>
            </ul>

          </nav>

        </div>
      </div>
    </header>
  );
}

export default Header;
