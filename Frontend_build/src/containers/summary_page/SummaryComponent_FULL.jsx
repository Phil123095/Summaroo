import {  useState, useEffect } from "react";

import OutputSummary from "./SummaryOutput";
import SummaryInputs from "./SummaryInput";
import SummaryInputChoices from "./SummaryTypeChoice";
import SummaryRequestOptions from "./SummaryRequestOptions";

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


function LandingPageFULL() {
    const [isLoading, setIsLoading] = useState(false);

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
            SummarizationManager().then(res => {
                setIsLoading(res)
                console.log("6 - Apparently Resolved")
            });
            /*if (summary_out.length > 1) {setIsLoading(false)}*/
            /*summaryManagement.then(result => setIsLoading(false))*/
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isLoading]);

    return (
        <div class="mt-4 md:mt-2 bg-neutral-100">
            <SummaryInputChoices media_type={media_type} setMediaType={setMediaType}/>
            <div class="w-100 min-h-screen grid grid-cols-1 md:grid-cols-8 md:grid-rows-6 md:gap-4 md:mx-14">
                <SummaryInputs media_type={media_type} setMediaType={setMediaType} setText={setText} text_to_summarize={text_to_summarize} setSelectedFile={setSelectedFile} setSummOut={setSummOut} setSummaryLoaded={setSummaryLoaded} summaryLoaded={summaryLoaded}/>
                <OutputSummary summarised_text={summary_out}/>
                <SummaryRequestOptions setSummPerc={setSummPerc} summaryTrigger={triggerSumm} isLoading={isLoading}/>
            </div>
        </div>
    )
  
}

export default LandingPageFULL;