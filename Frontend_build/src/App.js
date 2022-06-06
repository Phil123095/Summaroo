import './App.css';
/*import Router from "./Routes";*/
import Cookies from 'universal-cookie';
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from 'react';
import track from 'react-tracking';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import HeaderBar2 from "./containers/general/HeaderBar2";
import NotFound from "./containers/general/NotFound";
import SummaryPage from "./containers/summary_page/SummaryComponent_FULL";
import SummaryPagelolz from "./containers/summary_page_lolz/SummaryComponent_FULL_FUN";
import KangarooGenerator from "./containers/summary_page_lolz/Kangaroos";
import LandingPage from "./containers/LandingPage";

const App = () => {
  useEffect(() => {
    const cookies = new Cookies();

    const setCookies = () => {
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
      setCookies()
    }
    console.log(cookies.get('session_identifier'), cookies.get('persistent_user_identifier'))
  }, [])


  return (
      <div class="flex min-w-screen min-h-screen bg-neutral-100">
        <div class="min-w-full min-h-full font-bahnschrift">
        <HeaderBar2/>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage/>} />
                <Route path="/summarize" element={<SummaryPage/>}/>
                <Route path="/fun-version" element={<SummaryPagelolz/>}/>
                <Route path="/kangaroos" element={<KangarooGenerator/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </BrowserRouter>
      </div>
      </div>
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
        fetch('https://hiz7c7c2uqwvzyz7ceuqklvmnu0nsxcx.lambda-url.eu-central-1.on.aws/', params)
            .catch(err => console.log(err));
      }
      LogActivity(data);
      (window.dataLayer = window.dataLayer || []).push(data);
    }
  }
)(App);

export default TrackedApp;