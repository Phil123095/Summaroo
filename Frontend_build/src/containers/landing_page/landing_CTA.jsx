import { useTracking } from "react-tracking";
import { actionCreator } from '../../utils/general_utils';
import {  useState } from "react";

export const LandingCTAOriginal = (props) => {
    const [register_message, SetRegister] = useState('Register')
    const [emailRegistered, setEmail] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const {trackEvent} = useTracking()

    const onFormChange = (e) => {
        e.preventDefault()
        setEmail(e.target.value)
    }

    const saveEmail = () => {
        trackEvent(actionCreator('email_submit', 'landing_page'));

        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        if ( re.test(emailRegistered) ) {
            setEmailError(null)
            const params = {
                method: 'POST',
                body: JSON.stringify({
                action : 'EmailRegister',
                data: {email: emailRegistered, persistent_user_id: props.persistent_user_identifier, session_id: props.session_identifier}
                })
            }
            fetch('https://hiz7c7c2uqwvzyz7ceuqklvmnu0nsxcx.lambda-url.eu-central-1.on.aws/', params)
                .catch(err => console.log(err));
            SetRegister("Registered!")
        } else {
            console.log("failed")
            setEmail(null);
            setEmailError("Haha nice try. Give us a proper email.")
        }

    }


    return (

        <div class="flex flex-col items-center space-y-6 items-bottom">
            <button class="w-full mt-3 h-30 inline-flex justify-center 
                    items-center bg-green-primary bg-opacity-90 
                    border-green-primary border-opacity-80 hover:bg-green-primary 
                    h-16 border rounded-lg animate-none text-lg shadow-xl">
                <a href="/summarize" onClick={() => trackEvent(actionCreator('summary_redirect_click', 'landing_page'))} 
                    class="w-full inline-block my-4 mx-2 align-center text-white text-xl rounded hover:no-underline">
                    Start Summarizing 🦘
                </a>
            </button>
            <div class="bg-white w-full shadow-2xl rounded-lg overflow-hidden">
                <div class="flex flex-row items-center justify-between py-4 pl-2 rounded-lg mx-auto text-center">

                    <div class="w-full justify-center text-center flex flex-col md:flex-row space-x-1">
                        <div class="flex w-full justify-center mb-1 lg:mb-0 lg:basis-1/4">
                            <h1 class="text-base text-grey-800 my-1">Stay updated for product releases 🎉</h1>
                        </div>
                    
                        <div class="flex w-full lg:basis-3/4 text-center">
                            <div class="pr-0 flex items-center w-full mx-4">
                                <input onChange={(e) => onFormChange(e)} type="email" placeholder="yourmail@example.com"
                                    class="flex basis-8/12 text-base appearance-none rounded shadow p-3 text-grey-dark mr-2 focus:outline-none"/>
                                <button type="submit"
                                    onClick={saveEmail}
                                    class="basis-4/12 ml-1 bg-green-primary bg-opacity-90 
                                    border-green-primary border-opacity-80 hover:bg-green-primary  
                                    text-white text-center text-base font-semibold rounded-md shadow-md p-3">
                                        {register_message}
                                </button>
                            </div>
                        </div>
                
                    </div>

                </div>
                <div class="text-center">{emailError ? <p class="text-xs">{emailError}</p> : null}</div>
            </div>
        </div>


    )
    
}


export const LandingCTASimpleV1 = (props) => {

    return (

        <div class="flex flex-col items-center space-y-6 items-bottom">
        
                <div class="flex flex-row w-full items-center justify-between py-4 rounded-lg mx-auto text-center">

                    <div class="w-full justify-center text-center flex flex-col md:flex-row space-x-1">

                        <div class="pr-0 flex items-center w-full">
                            <input type="email" placeholder="yourmail@example.com"
                                class="flex basis-7/12 text-base border-2 rounded-lg border-green-primary appearance-none shadow p-3 text-grey-dark mr-2 focus:outline-none"/>
                            <button type="submit"
                                class="flex flew-row items-center justify-center basis-5/12 ml-1 bg-green-primary bg-opacity-90 border-2 
                                border-green-primary border-opacity-80 hover:bg-green-primary  
                                text-white text-center text-xl font-semibold rounded-md shadow-md p-2.5">
                                    Get Started
                                    <svg class="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                            </button>
                        </div>

                
                    </div>

                </div>
        </div>


    )

}

export const LandingCTASimpleV2 = (props) => {
    const {trackEvent} = useTracking()
    return (

        <div class="flex flex-col items-center">
        
                <div class="flex flex-row w-full items-center justify-between rounded-lg mx-auto text-center">

                    <div class="w-full justify-center text-center flex flex-col md:flex-row">

                        <div class="pr-0 flex items-center w-full">
                            <button type="submit"
                                class="flex flew-row items-center justify-center basis-5/12 bg-gradient-to-tr from-green-400 to-green-primary hover:bg-green-primary  
                                text-white text-center text-xl font-semibold rounded-md shadow-md p-2.5">
                                    <a href="/summarize" onClick={() => trackEvent(actionCreator('summary_redirect_click', 'landing_page'))} class="flex flex-row items-center">
                                        Get Started
                                        <svg class="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                    </a>
                        
                            </button>
                        </div>

                
                    </div>

                </div>
        </div>


    )

}