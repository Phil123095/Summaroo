import { useState } from 'react'
import { Rating } from 'react-simple-star-rating'
import { Link } from 'react-router-dom';

export default function OutputSummary(props) {
    const DataEndpoint = process.env.REACT_APP_AWS_LAZYDATASINK_URL;
    const [reviewed, setReviewed] = useState(false)
    const [rating, setRating] = useState(0)

    const handleRating = (rate) => {
        console.log(rate, props.summaryRequestID)
        setRating(rate)
        setReviewed(true)
        sendRating(rate, props.summaryRequestID)
        // other logic
    }

    const sendRating = (rating, summaryID) => {
        console.log(rating, summaryID)
        const params = {
            method: 'POST',
            body: JSON.stringify({
            action : 'SummaryRatingLog',
            data: {summaryID: summaryID, rating: rating}
            })
        }
        fetch('https://hiz7c7c2uqwvzyz7ceuqklvmnu0nsxcx.lambda-url.eu-central-1.on.aws/', params)
            .catch(err => console.log(err));
    }


    function NewlineText(props) {
        const text = props.text
        return text.split('.').map(str => <p class="text-base font-medium text-gray-700">{str += ". "}</p>);
    }

    const handleCopy = (e) => {
        e.preventDefault()
        navigator.clipboard.writeText("✨ Summary magic brought to you by www.summarooapp.com ✨\n\n" + props.summarised_text)
        props.setCopy(true);
      } 

    const Clipboard = () => {
        return(
            <div class="flex flex-row items-center">
                <button class=" flex flex-row items-center" onClick={(e) => handleCopy(e)}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    {props.isCopied ? <p class="ml-1 text-sm font-light">Copied!</p> : <p class="ml-1 text-sm font-light">Copy</p>}
                </button>
                
            </div>
        )
    }

    console.log(props.showRating)


    return(

        <div class="h-fit m-2 pb-1 p-2 col-span-1 md:col-span-4 bg-white justify-center items-center rounded-lg">
            <div class="flex space-between">
                <div class="pt-1 ml-1 h-10 border-b-1 border-color border-blue-900 text-base text-gray-700 items-center font-light">
                    ... and the magic happens here.
                </div>

            </div>
            <div class="border rounded-lg border-slate-200 h-96 w-full overflow-y-scroll">
                <div class="px-2 pt-2">
                    {props.summarised_text === '' ? null : <NewlineText text={props.summarised_text}/>}
       
                </div>
            </div>
            {props.showRating === true ? 
                <div class="flex w-full items-center">
                    <div class="flex w-1/4 justify-start items-start">
                        {props.showRating === true ? <Clipboard /> : null}
                    </div>
                    <div class="flex w-3/4 mt-1 justify-end items-center">
                        <p class="text-sm font-light mr-2 text-gray-800">Help us help you - rate the summary!</p>
                        <div class="pt-1 -pb-1">
                            <Rating onClick={handleRating} ratingValue={rating} size={20} className="trial" /* Available Props */ />
                        </div>
                    </div>
                </div>
            :<div class="h-8"/>}
            {reviewed ? 
                <div class="w-full flex justify-end">
                    <span className="input-group-btn text-right text-sm font-light underline text-blue-base">
                        <Link to="/contact-us">Have any more feedback? We'd love to hear it.</Link>
                    </span>
                </div> : null
            }
        </div>

    )

}