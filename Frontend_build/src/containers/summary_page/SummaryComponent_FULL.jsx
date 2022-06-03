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
                <SummaryRequestOptions setSummPerc={setSummPerc}/>
                <div class="m-2 mb-3 h-10 md:h-20 col-span-1 md:col-span-4 border-slate-100 rounded-lg bg-slate-100 items-center">
                    <button disabled={isLoading} class="w-full h-30 inline-flex justify-center items-center bg-green-primary bg-opacity-90 border-green-primary border-opacity-80 hover:bg-green-primary h-16 border rounded-lg animate-none" onClick={triggerSumm}>
                        {isLoading === true ? 
                            <svg role="status" class="inline mr-3 w-5 h-5 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                            </svg>: null}
                        {isLoading === true ? <p class="text-base text-white">PERFORMING MAGIC</p> : <p class="text-base text-white">SUMMARIZE</p>}
                    </button>

                </div>
            </div>
        </div>
    )
  
}

export default LandingPageFULL;