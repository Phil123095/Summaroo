import {  useState } from "react";
let landingViz = require("../assets/SummarooPic.png")

/*import {ReactComponent as ReactLogo} from "../assets/SummarooLogo.svg"*/

function LandingPage() {
    const [emailRegistered, setEmail] = useState(null);

    const onFormChange = (e) => {
        e.preventDefault()
        setEmail(e.target.value)
    }

    const saveEmail = () => {
        const params = {
            method: 'POST',
            body: JSON.stringify({
            action : 'EmailRegister',
            data: {email: emailRegistered}
            })
        }
        fetch('https://hiz7c7c2uqwvzyz7ceuqklvmnu0nsxcx.lambda-url.eu-central-1.on.aws/', params)
            .catch(err => console.log(err));

    }

    return (
    <div class="h-100 px-4 mt-2 lg:ml-4 lg:px-0 lg:mt-6 bg-neutral-100">
        <div class="w-100 flex flex-row">
            <div class="lg:ml-14 flex lg:basis-3/6 flex-col justify-center items-center">
                <div class="flex flex-col content-center space-y-2 lg:space-y-14">
                    <div class="pr-4 pl-4 lg:pr-4 lg:pl-0">
                        <div class="text-center lg:text-left text-5xl lg:text-6xl font-bold leading-relaxed whitespace-pre-line">
                            Your digital content in a nutshell.
                        </div>
                    </div>
                    <div class="flex flex-col items-center space-y-6 items-bottom">
                        <button class="w-full mt-6 h-30 inline-flex justify-center 
                                items-center bg-green-primary bg-opacity-90 
                                border-green-primary border-opacity-80 hover:bg-green-primary 
                                h-16 border rounded-lg animate-none text-lg shadow-xl">
                            <a href="/summarize" class="inline-block my-4 mx-2 align-center text-white text-xl rounded hover:no-underline">
                                Start Summarizing 🦘
                            </a>
                        </button>
                        <div class="bg-white w-full shadow-2xl rounded-lg overflow-hidden">
                            <div class="flex flex-row items-center justify-between py-4 pl-2 bg-white shadow-xl rounded-lg mx-auto text-center">

                                <div class="w-full justify-center text-center flex flex-col md:flex-row space-x-1">
                                    <div class="flex w-full justify-center mb-1 lg:mb-0 lg:basis-1/4">
                                        <h1 class="text-base text-grey-800 my-1">Register for the Beta Launch 🎉</h1>
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
                                                    Register
                                            </button>
                                        </div>
                                    </div>
                         
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            <div class="hidden lg:flex lg:mt-2 lg:basis-3/6 lg:justify-center lg:items-center">

                <img class="w-9/12 h-9/12" src={landingViz} alt="Summaroo" />

            </div>



        </div>

    </div>
    )
  
}

export default LandingPage;