import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
/*import SummaryComponents from "./containers/summary_page/SummaryComponents";*/
/*import HeaderBar from "./containers/general/HeaderBar";*/
import HeaderBar2 from "./containers/general/HeaderBar2";
import NotFound from "./containers/general/NotFound";
import SummaryPage from "./containers/summary_page/SummaryComponent_FULL";
import SummaryPagelolz from "./containers/summary_page_lolz/SummaryComponent_FULL_FUN";
import KangarooGenerator from "./containers/summary_page_lolz/Kangaroos";
import LandingPage from "./containers/landing_page/LandingPage";

function Router() {

    return (
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
    );
  }

export default Router;