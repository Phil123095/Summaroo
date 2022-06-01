import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import SummaryComponents from "./containers/summary_page/SummaryComponents";
/*import HeaderBar from "./containers/general/HeaderBar";*/
import HeaderBar2 from "./containers/general/HeaderBar2";
import NotFound from "./containers/general/NotFound";

function Router() {

    return (
      <div class="min-w-full min-h-full font-bahnschrift">
        <HeaderBar2/>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SummaryComponents/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </BrowserRouter>
      </div>
    );
  }
  
  export default Router;