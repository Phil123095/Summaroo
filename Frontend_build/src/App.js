import './styles/style.scss'
/*import Router from "./Routes";*/
import Cookies from 'universal-cookie';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';
import track from 'react-tracking';
import { isMobile } from "react-device-detect";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import NotFound from "./containers/general/NotFound";
import KangarooGenerator from "./containers/summary_page_lolz/Kangaroos";
import Home from "./containers/Home/Home";
import ContactForm from './containers/general/ContactPage';
import Gradient from './containers/general/Gradient';
import AOS from 'aos';
import SummaryPageFinal from './containers/summary_page/SummaryComponentFinal';


const DataEndpoint = process.env.REACT_APP_AWS_LAZYDATASINK_URL;

const App = () => {
  useEffect(() => {
    AOS.init({
      once: false,
      disable: 'phone',
      duration: 700,
      easing: 'ease-out-cubic',
    });
  });


  const [mobile_ind, setMobile_ind] = useState('');

  useEffect(() => {
    window.addEventListener('unload', handleTabClosing)
    return () => {
        window.removeEventListener('unload', handleTabClosing)
    }
  })

  const cookies = new Cookies();
  const handleTabClosing = () => {
      const params = {
        method: 'POST',
        body: JSON.stringify({
        action : 'UserTracking',
        data: {'persistent_user_id': cookies.get('session_identifier'), 
        'session_id': cookies.get('persistent_user_identifier'),
        'action_id': uuidv4(),
        'timestamp': Date.now(),
        'device': mobile_ind,
        'event_type': 'exit_website', 'page': 'not_clear'}
        })
      }
      fetch(DataEndpoint, params)
          .catch(err => console.log(err));
  }


  useEffect(() => {
    if(isMobile){setMobile_ind("mobile")} else {setMobile_ind("desktop")}


    const cookies = new Cookies();

    const setFullCookies = () => {
      const current = new Date();
      const nextYear = new Date();
      nextYear.setFullYear(current.getFullYear() + 1);
      cookies.set('session_identifier', uuidv4(), {
        path: '/'
      });
      cookies.set('persistent_user_identifier', uuidv4(), {
        path: '/',
        maxAge: (360*24*60*60)
      });
    }


    if (!cookies.get('session_identifier') && !cookies.get('persistent_user_identifier')) {
      setFullCookies()
    } 
    console.log(cookies.get('session_identifier'), cookies.get('persistent_user_identifier'))
  }, [mobile_ind])

  const NormalRouter = () => {
    return (
      <div class="flex flex-row min-w-screen min-h-screen">
        <div class="min-w-full min-h-full font-inter">
          <BrowserRouter>
              <Routes>
                  {/*<Route path="/" element={<LandingPage mobile_ind={mobile_ind}/>} />*/}
                  <Route path="/" element={<Home />}/>
                  <Route path="/summarize" element={<SummaryPageFinal/>}/>
                  <Route path="/kangaroos" element={<KangarooGenerator/>}/>
                  <Route path="/contact-us" element={<ContactForm/>}/>
                  <Route path="/gradient" element={<Gradient/>}/>
                  <Route path="*" element={<NotFound/>}/>
              </Routes>
          </BrowserRouter>
        </div>
      </div>
    )
  }

  const Raban = () => {
    return (
      <div class="flex min-w-screen min-h-screen bg-neutral-100 items-center justify-center">
        <p class="font-extrabold text-8xl text-center"> Fuck off, Raban.</p>
      </div>
    )
  }

  return (
    <>
      {cookies.get('persistent_user_identifier') === 'b035c5a6-539a-4865-8f24-d86b42cb0749' ? <Raban/> : <NormalRouter/>}
    </>
  );
}

const TrackedApp = track(
  // app-level tracking data
  { app: "my-app" },

  // top-level options
  {
    // custom dispatch to console.log in addition to pushing to dataLayer[]
    dispatch: data => {
      console.log(data);
      const LogActivity = (data) => {
        const params = {
          method: 'POST',
          body: JSON.stringify({
          action : 'UserTracking',
          data: data
          })
        }
        fetch(DataEndpoint, params)
            .catch(err => console.log(err));
      }
      LogActivity(data);
      (window.dataLayer = window.dataLayer || []).push(data);
    }
  }
)(App);

export default TrackedApp;