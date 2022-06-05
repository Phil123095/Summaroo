import { useState } from 'react'
import { Rating } from 'react-simple-star-rating'
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({
    region: 'eu-central-1',
    accessKeyId: process.env.REACT_APP_AWS_SQS_KEY,
    secretAccessKey: process.env.REACT_APP_AWS_SQS_SECRET
})

// Create an SQS service object
var sqs = new AWS.SQS({apiVersion: 'latest'});




export default function OutputSummary(props) {
    const [rating, setRating] = useState(0)
    const handleRating = (rate) => {
        console.log(rate, props.summaryRequestID)
        setRating(rate)
        sendRating(rate, props.summaryRequestID)
        // other logic
    }

    const sendRating = (rating, summaryID) => {

        var params = {
            // Remove DelaySeconds parameter and value for FIFO queues
           DelaySeconds: 0,
           MessageBody: JSON.stringify({
            action : 'SummaryRatingLog',
            data: {summaryID: summaryID, rating: rating}
            }),
            MessageGroupId: 'trial',
           // MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
           // MessageGroupId: "Group1",  // Required for FIFO queues
           QueueUrl: process.env.REACT_APP_AWS_SQS_URL
         };


        console.log(rating, summaryID)

        sqs.sendMessage(params, function(err, data) {
            if (err) {
                console.log("Error", err);
            } else {
                console.log("Success", data.MessageId);
            }
            });

    }

    
    /*const summary_out = props.summarised_text*/

    function NewlineText(props) {
        const text = props.text
        return text.split('.').map(str => <p class="text-base font-light text-gray-700">{str += "."}</p>);
    }

    return(
        <div class="m-2 pb-1 p-2 col-span-1 md:col-span-4 md:row-span-3 bg-white justify-center items-center rounded-lg">
            <div class="pt-1 ml-1 h-10 border-b-1 border-color border-blue-900 text-base text-gray-700 items-center font-light">
                ... and the magic happens here.
            </div>
            <div class="border rounded-lg border-slate-200 h-96 w-full overflow-y-scroll">
                <div class="px-2 pt-1">
                    {props.summarised_text === '' ? null : <NewlineText text={props.summarised_text}/>}
                    
                </div>
            </div>
            {props.showRating === true ? 
                <div class="flex w-full mt-1 justify-end">
                    <p class="text-sm font-extralight mr-4 mt-0.5 text-gray-500">Help us help you - rate the summary!</p>
                    <Rating onClick={handleRating} ratingValue={rating} size={20} className="trial" /* Available Props */ />
                </div>
            :<div class="h-8"/>}

        </div>

    )

}