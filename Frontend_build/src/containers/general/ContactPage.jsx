import {  useEffect, useState } from "react";
import Header from "../general/Header";
import Footer from "./Footer";
import Cookies from 'universal-cookie';
import { actionCreator } from '../../utils/general_utils';
import { useTracking } from 'react-tracking';

export default function ContactForm() {
    const {trackEvent} = useTracking()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [contactEmail, setEmail] = useState('')
    const [messageBody, setMessage] = useState('')
    const [buttonMessage, setButtonMessage] = useState('Send')
    const [incompleteIndicator, setIncomplete] = useState(false)

    
    useEffect(() => {

        trackEvent(actionCreator('page_view', 'contact_form'));
  
    }, [trackEvent])

    const verifyFields = () => {
        if (firstName === '' || lastName === '' || contactEmail === '' || messageBody === ''){
            return false;
        } else {return true;}

    }


    function handleFormSubmit() {
        const verif_result = verifyFields();

        if (verif_result){
            setIncomplete(false)
            const cookies = new Cookies();
            trackEvent(actionCreator('form_submit', 'contact_form'));

            const params = {
                method: 'POST',
                body: JSON.stringify({
                action : 'EmailContactForm',
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    email: contactEmail, 
                    message: messageBody,
                    persistent_user_id: cookies.get('persistent_user_identifier'), 
                    session_id: cookies.get('session_identifier')}
                })
            }
            fetch('https://hiz7c7c2uqwvzyz7ceuqklvmnu0nsxcx.lambda-url.eu-central-1.on.aws/', params)
                .catch(err => console.log(err));
            setButtonMessage("Sent!")
        } else {
            setIncomplete(true)

        }
    }


    return(
        //tailwindcss contact form
        <div className="flex flex-col max-h-screen min-w-screen">
            <Header/>
            <main className="mt-32 md:mt-2 bg-white px-2 pt-1 h-full w-full flex flex-col justify-center items-center">
                <form class="mt-32 mb-16 w-full max-w-lg">
                    <div class="w-full mb-6">
                        <p class="text-2xl font-bold text-center">We'd love to hear your thoughts!</p>
                        <p class="text-gray-600 text-sm italic text-center mt-4">We'd be very grateful if you can provide any feedback on functionality, bugs, and so on for the site. But to be clear, we also accept fan mail.</p>
                        {incompleteIndicator ? <p class="text-red-400 font-bold text-base text-center mt-4">Please fill in all the fields.</p> : null}
                    </div>
                    <div class="flex flex-wrap -mx-3 mb-6">
                        <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            First Name
                        </label>
                        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 
                                    leading-tight focus:outline-none focus:bg-white" 
                                    id="grid-first-name" type="text" placeholder="Jane" onChange={(e) => setFirstName(e.target.value)} required/>
                        </div>
                        <div class="w-full md:w-1/2 px-3">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
                            Last Name
                        </label>
                        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 
                                    rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                                    id="grid-last-name" type="text" placeholder="Doe" onChange={(e) => setLastName(e.target.value)} required/>
                        </div>
                    </div>
                    <div class="flex flex-wrap -mx-3 mb-6">
                        <div class="w-full px-3">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                            E-mail
                        </label>
                        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border 
                                    border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none 
                                    focus:bg-white focus:border-gray-500" id="email" type="email" onChange={(e) => setEmail(e.target.value)} required/>
                        </div>
                    </div>
                    <div class="flex flex-wrap -mx-3 mb-6">
                        <div class="w-full px-3">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                            Message
                        </label>
                        <textarea class=" no-resize appearance-none block w-full 
                                bg-gray-200 text-gray-700 border border-gray-200 
                                rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white 
                                focus:border-gray-500 h-48 resize-none" id="message" onChange={(e) => setMessage(e.target.value)} required></textarea>
                        </div>
                    </div>
                    <div class="md:flex md:items-center">
                        <div class="md:w-1/3">
                            <button class="shadow bg-blue-base hover:bg-blue-base focus:shadow-outline 
                                focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit" onClick={handleFormSubmit}>
                                {buttonMessage}
                            </button>
                        </div>
                        <div class="md:w-2/3"></div>
                    </div>
                </form>
            </main>
            <Footer/>
        </div>

    )
}