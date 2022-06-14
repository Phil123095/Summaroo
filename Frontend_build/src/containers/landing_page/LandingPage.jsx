import {  useEffect } from "react";
import Cookies from 'universal-cookie';
import { useTracking } from "react-tracking";
import { actionCreator } from '../../utils/general_utils';
import Typed from "react-typed"
/*import {LandingCTAOriginal} from "./landing_CTA";*/
import {LandingCTASimpleV2} from "./landing_CTA";

let landingViz = require("../../assets/SummarooPic.png")




/*import {ReactComponent as ReactLogo} from "../assets/SummarooLogo.svg"*/

function LandingPage(props) {
    const cookies = new Cookies();
    const session_identifier = cookies.get('session_identifier');
    const persistent_user_identifier = cookies.get('persistent_user_identifier');
    const {trackEvent} = useTracking()

    useEffect(() => {

        trackEvent(actionCreator('page_view', 'landing_page'));
  
    }, [persistent_user_identifier, session_identifier, trackEvent])

    return (
    <div class="flex flex-row items-center h-100 px-4 mt-2 lg:ml-4 lg:px-0 lg:mt-6 ">
        <div class="w-100 flex flex-row lg:mt-8">
            <div class="lg:ml-10 flex lg:basis-4/6 flex-col justify-center items-center">
                <div class="flex min-w-full flex-shrink-0 flex-col content-center space-y-2 lg:space-y-14">
                    <div class="min-w-full flex-shrink-0 pl-4 lg:pl-0">
                        <div class="w-full  flex-shrink-0 text-center font-extrabold lg:text-left text-5xl lg:text-7xl leading-relaxed whitespace-pre-line space-y-4">
                            <p class="flex-shrink-0 font-black">Your&nbsp;   
                            
                            <Typed
                                strings={[
                                    'digital content',
                                    'youtube videos',
                                    'pdf documents']}
                                typeSpeed={80}
                                backSpeed={60}

                                backDelay={1000}
                                loop={true}
                                /></p> 
                            <p className="font-black bg-clip-text text-transparent bg-gradient-to-tr from-green-300 to-green-primary"> in a nutshell.</p>
                        </div>
                        <div>
                        <p className="mt-8 text-xl font-light text-gray-600" data-aos="zoom-y-out" data-aos-delay="150">
                            Summarise text, videos, and PDFs in a matter of seconds. 
                            <br/> As easy as 1, 2, 3.</p>
                        </div>
                    </div>
                    {/*<LandingCTAOriginal session_identifier={session_identifier} persistent_user_identifier={persistent_user_identifier}/>*/}
                    <LandingCTASimpleV2/>
                </div>
                
            </div>
            <div class="hidden lg:flex lg:mt-2 lg:mr-5 lg:basis-3/6 lg:justify-center lg:items-center">

                <img class="w-10/12 h-10/12" src={landingViz} alt="Summaroo" />

            </div>
        </div>

    </div>
    )
  
}

export default LandingPage;