import {useState} from 'react';
import { useTracking } from 'react-tracking';
import Cookies from 'universal-cookie';
import { actionCreator } from '../../../utils/general_utils';

function Newsletter() {
  const [register_message, setRegister] = useState('Subscribe')
  const [emailError, setEmailError] = useState('Your email...');
  const [email, setEmail] = useState(null);

  const onFormChange = (e) => {
    e.preventDefault()
    setEmail(e.target.value)
  }
  const {trackEvent} = useTracking()

  function SaveEmail() {
    trackEvent(actionCreator('email_submit', 'newsletter'));
    const cookies = new Cookies();

    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    console.log(email)
    if ( re.test(email) ) {
        setEmailError(null)
        const params = {
            method: 'POST',
            body: JSON.stringify({
            action : 'EmailRegister',
            data: {email: email, persistent_user_id: cookies.get('persistent_user_identifier'), session_id: cookies.get('session_identifier')}
            })
        }
        fetch('https://hiz7c7c2uqwvzyz7ceuqklvmnu0nsxcx.lambda-url.eu-central-1.on.aws/', params)
            .catch(err => console.log(err));
        setRegister("Subscribed!")
    } else {
        console.log("failed")
        setEmail(null)
        setEmailError("Haha nice try. Give us a proper email.")
    }

  }

  return (
    <section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="pb-12 pt-12 md:pt-20 md:pb-20">

          {/* CTA box */}
          <div className="relative bg-blue-900 rounded py-10 px-8 md:py-16 md:px-12 shadow-2xl overflow-hidden" data-aos="zoom-y-out">

            {/* Background illustration */}
            <div className="absolute right-0 bottom-0 pointer-events-none hidden lg:block" aria-hidden="true">
              <svg width="428" height="328" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient cx="35.542%" cy="34.553%" fx="35.542%" fy="34.553%" r="96.031%" id="ni-a">
                    <stop stopColor="#84CEEB" offset="0%" />
                    <stop stopColor="#5680E9" offset="44.317%" />
                  </radialGradient>
                </defs>
                <g fill="none" fillRule="evenodd">
                  <g fill="#FFF">
                    <ellipse fillOpacity=".04" cx="185" cy="15.576" rx="16" ry="15.576" />
                    <ellipse fillOpacity=".24" cx="100" cy="68.402" rx="24" ry="23.364" />
                    <ellipse fillOpacity=".12" cx="29" cy="251.231" rx="29" ry="28.231" />
                    <ellipse fillOpacity=".64" cx="29" cy="251.231" rx="8" ry="7.788" />
                    <ellipse fillOpacity=".12" cx="342" cy="31.303" rx="8" ry="7.788" />
                    <ellipse fillOpacity=".48" cx="62" cy="126.811" rx="2" ry="1.947" />
                    <ellipse fillOpacity=".12" cx="78" cy="7.072" rx="2" ry="1.947" />
                    <ellipse fillOpacity=".64" cx="185" cy="15.576" rx="6" ry="5.841" />
                  </g>
                  <circle fill="url(#ni-a)" cx="276" cy="237" r="200" />
                </g>
              </svg>
            </div>

            <div className="relative flex flex-col lg:flex-row justify-between items-center">

              {/* CTA content */}
              <div className="text-center lg:text-left lg:max-w-2xl">
                <h3 className="h3 text-white mb-2">Subscribe for Product Updates!</h3>
                <p className="text-white text-base md:text-lg font-light mb-6">We're not going to stop until we have the best damn product for all of you.</p>

                {/* CTA form */}
                <form className="w-full md:w-auto">
                  <div className="flex flex-col sm:flex-row justify-center max-w-s mx-auto sm:max-w-l lg:mx-0">
                    <input type="email" className="form-input w-full appearance-none bg-blue-50 border border-blue-100 rounded-md 
                    focus:border-blue-600 px-4 py-3 mb-2 sm:mb-0 sm:mr-2 text-blue-900 placeholder-gray-500" 
                    placeholder={emailError} aria-label={emailError} onChange={(e) => onFormChange(e)} />
                    <a className="btn text-white bg-blue-600 hover:bg-blue-700 shadow border rounded-md" 
                      onClick={SaveEmail}>
                        {register_message}
                    </a>
                  </div>
                  {/* Success message */}
                  {/* <p className="text-sm text-gray-400 mt-3">Thanks for subscribing!</p> */}
                </form>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

export default Newsletter;
