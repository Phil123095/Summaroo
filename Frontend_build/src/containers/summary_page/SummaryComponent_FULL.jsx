import {  useState, useEffect } from "react";

import OutputSummary from "./SummaryOutput";
import SummaryInputs from "./SummaryInput";
import SummaryInputChoices from "./SummaryTypeChoice";
import SummaryRequestOptions from "./SummaryRequestOptions";
import Realistic from "./ConfettiFun";

var AWS = require('aws-sdk/dist/aws-sdk-react-native');

const BucketName = process.env.REACT_APP_BUCKET_NAME;
const Region = process.env.REACT_APP_REGION;

AWS.config.update({
    accessKeyId: process.env.REACT_APP_ACCESS_ID,
    secretAccessKey: process.env.REACT_APP_ACCESS_KEY
})

const myBucket = new AWS.S3({
    params: { Bucket: BucketName},
    region: Region,
})


window.Buffer = window.Buffer || require("buffer").Buffer;


export default function SummaryPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [popConfetti, setConfetti] = useState(false);

    const [text_to_summarize, setText] = useState('');
    const [summary_perc, setSummPerc] = useState(10);
    const [summary_out, setSummOut] = useState('');
    const [media_type, setMediaType] = useState('text');
    const [summaryLoaded, setSummaryLoaded] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    
    const triggerSumm = (e) => {
        e.preventDefault()
        setIsLoading(true);
    }

    const clearText = () => {
        console.log("clearing text")
        setText('');
        setSummOut('');
        setSummaryLoaded(false);
        setConfetti(false);
    }
    
    useEffect(() => {
        function requestSummary(summarize_this_text){
            return new Promise((resolve, reject) => {
                console.log("Requesting Summary")
                const requestOptions = {
                    method: 'POST',
                    body: JSON.stringify({
                        format: media_type,
                        full_text: summarize_this_text,
                        perc_length: summary_perc
                        })
                    };
    
                fetch('https://4bovfvjtrbw7n2szd6a4lzrtwi0gvzhs.lambda-url.eu-central-1.on.aws/', requestOptions)
                    .then(response => response.json())
                    .then(response => setSummOut(response.final_summary))
                    .then(setSummaryLoaded(true))
                    .then(response => resolve("done"))
                    .catch(err => reject(err));
            })
        }

        function UploadDocument(file){
            return new Promise((resolve, reject) => {
                const params = {
                    Body: file,
                    Bucket: BucketName,
                    Key: file.name.replace(/\s+/g, '')
                };

                console.log("3 - About to upload document")
                myBucket.upload(params, function(err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(data)
                        console.log("4 - Requesting Summary in Upload")
                        requestSummary(data.Location).then(result => resolve(false))
                        console.log("5 - Summary Request Done")
                    }
                })
    
            })
    
        }
    
        function SummarizationManager() {
            return new Promise((resolve, reject) => {
                console.log("1 - Start loading status", isLoading)
                console.log("1 - Summary Starting")
                console.log(media_type)
                setSummOut('');
    
                if (media_type === 'pdf') {
                    /*setIsLoading(true);*/
                    console.log("2 - IN PDF")
                    const uploadPromise = UploadDocument(selectedFile);
                    uploadPromise.then(res => resolve(false))    
                        .catch(err => reject(err));
                     
                } else {
                    const summaryRequestPromise = requestSummary(text_to_summarize);
                    console.log("2 - NOT PDF")
                    summaryRequestPromise.then(result => resolve(false))
                }
    
            
            });
        };

        if (isLoading) {
            if (media_type === 'text') {setIsLoading(false); setConfetti(true);}
            SummarizationManager().then(res => {
                setIsLoading(res)
                if (media_type !== "text") {setConfetti(true);}
                console.log("6 - Apparently Resolved")
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isLoading]);

    return (
        <div class="h-fit mt-4 lg:mt-2 bg-neutral-100">
            <SummaryInputChoices media_type={media_type} setMediaType={setMediaType} clearText={clearText} clearTextAllowed={(!isLoading && popConfetti) ? true : false}/>
            <div class="w-100 grid grid-cols-1 md:grid-cols-8 md:grid-rows-4 md:gap-4 md:mx-14">
                <SummaryInputs media_type={media_type} setMediaType={setMediaType} setText={setText} clearTextAllowed={(!isLoading && popConfetti) ? true : false} clearText={clearText} text_to_summarize={text_to_summarize} setSelectedFile={setSelectedFile} setSummOut={setSummOut} setSummaryLoaded={setSummaryLoaded} summaryLoaded={summaryLoaded}/>
                <OutputSummary summarised_text={summary_out} isLoading={isLoading} showRating={(!isLoading && popConfetti) ? true : false} summaryLoaded={summaryLoaded}/>
                <SummaryRequestOptions setSummPerc={setSummPerc} summaryTrigger={triggerSumm} isLoading={isLoading}/>
                <Realistic indicator={(!isLoading && popConfetti) ? true : false}/>
            </div>
        </div>
    )
  
}
