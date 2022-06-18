import React from 'react';
import Typed from "react-typed"
import { actionCreator } from '../../../utils/general_utils';
import { useTracking } from 'react-tracking';


function HeroHomeTrial() {
    const {trackEvent} = useTracking()
    return (
        <section className="relative">
            <div className="flex flex-col justify-center items-center max-w-8xl h-screen mx-auto sm:px-6 bg-radial-at-tl from-blue-100 via-indigo-200 to-blue-200">

                    <div class="min-w-full flex-shrink-0 mb-4 mt-10">
                        <div class="w-full flex-shrink-0">  
                            <div class="w-full flex justify-center mx-auto">
                                <div class="inline-block justify-center text-center whitespace-pre-line space-y-5">
                                    <div class="space-y-2 md:space-y-0 w-full flex flex-col md:flex-row h-20 md:ml-14">
                                        <p class="text-4xl md:text-7xl text-white uppercase font-extrabold" data-aos="zoom-y-out" data-aos-delay="300">
                                            Your&nbsp;
                                        </p> 
                                        <p class="text-center mb-5 md:text-left text-4xl md:text-7xl text-white uppercase font-extrabold" data-aos="zoom-y-out" data-aos-delay="300">
                                            <Typed
                                                strings={[
                                                    'digital content',
                                                    'youtube videos',
                                                    'pdf documents']}
                                                typeSpeed={90}
                                                backSpeed={50}

                                                backDelay={1000}
                                                loop={true}
                                            />
                                        </p> 

                                    </div>
                                    <p className="font-black bg-clip-text text-5xl md:text-9xl text-transparent bg-gradient-to-r from-indigo-400 to-blue-800 italic uppercase" data-aos="zoom-y-out" data-aos-delay="600"> 
                                        in a nutshell
                                    </p>
                                    <p className="text-base text-center md:mt-10 md:text-2xl font-thin" data-aos="zoom-y-out" data-aos-delay="900">
                                        Summarise text, videos, and PDFs in a matter of seconds. As easy as 1, 2, 3.
                                    </p>

                                </div>
                            </div>
            
                        </div>
                    </div>
                    <div class="h-40 flex items-center justify-center w-full" data-aos="zoom-y-out" data-aos-delay="1200">
                        <button type="submit"
                            class="flex flex-row items-center justify-center md:w-1/4 border-2 border-white rounded-lg
                            text-blue-800 bg-white hover:bg-blue-800 hover:border-blue-800 hover:scale-105 hover:text-white text-center text-xl font-semibold p-2.5">
                            <a href="/summarize" onClick={() => trackEvent(actionCreator('summary_redirect_click', 'landing_page'))} class="flex flex-row items-center">
                                Get Started
                                <svg class="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                            </a>
                        </button>
                    </div>

            </div>
            <div>
                <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center m-auto h-20">
                    <div>
                        <p class="mb-3 font-light text-white text-xl">Learn More</p>
                        <svg xmlns="http://www.w3.org/2000/svg" className="animate-bounce -translate-y-1/4 h-10 w-10 mx-auto stroke-white stroke-2 hover:stroke-blue-base" fill="none" viewBox="0 0 24 24" >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 17l-4 4m0 0l-4-4m4 4V3" />
                        </svg>
                    
                    </div>
                </div>

            </div>
        
        </section>
    )

    }
    
    export default HeroHomeTrial;