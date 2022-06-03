import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
/*import SummaryComponents from "./containers/summary_page/SummaryComponents";*/
/*import HeaderBar from "./containers/general/HeaderBar";*/
import HeaderBar2 from "./containers/general/HeaderBar2";
import NotFound from "./containers/general/NotFound";
import LandingPageFULL from "./containers/summary_page/SummaryComponent_FULL";
import LandingPageLOLZ from "./containers/summary_page_lolz/SummaryComponent_FULL_FUN";
import KangarooGenerator from "./containers/summary_page_lolz/Kangaroos";

function Router() {

    return (
      <div class="min-w-full min-h-full font-bahnschrift">
        <HeaderBar2/>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPageFULL/>}/>
                <Route path="/fun-version" element={<LandingPageLOLZ/>}/>
                <Route path="/kangaroos" element={<KangarooGenerator/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </BrowserRouter>
      </div>
    );
  }
  
  export default Router;