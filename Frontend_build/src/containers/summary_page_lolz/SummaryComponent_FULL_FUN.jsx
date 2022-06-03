import {  useState, useEffect } from "react";
import { GiphyFetch } from "@giphy/js-fetch-api";
import OutputSummaryLOLZ from "../summary_page_lolz/SummaryOutputlolz";
import SummaryInputs from "../summary_page/SummaryInput";
import SummaryInputChoices from "../summary_page/SummaryTypeChoice";
import SummaryRequestOptions from "../summary_page/SummaryRequestOptions";
import Realistic from "../summary_page/ConfettiFun";

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


function LandingPageLOLZ() {
    const giphyFetch = new GiphyFetch("I416egPdf0z8yknVgQJ5uahNr0WBa8YG");
    const [gifLink, setGifLink] = useState(null);
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

    const random = async () => {
        try {
          const result = await giphyFetch.random({tag: 'kangaroo'})
          const url = result.data.images.fixed_height.url
          setGifLink(url)
        } catch (error) {
          console.error(`random`, error);
        }
        

      };
    
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
                setSummOut('');
    
                if (media_type === 'pdf') {
                    const uploadPromise = UploadDocument(selectedFile);
                    uploadPromise.then(res => resolve(false))    
                        .catch(err => reject(err));
                     
                } else {
                    const summaryRequestPromise = requestSummary(text_to_summarize);
                    summaryRequestPromise.then(result => resolve(false))
                }
    
            
            });
        };

        if (isLoading) {
            if (media_type === 'text') {setIsLoading(false);}
            random()
            SummarizationManager().then(res => {
                setIsLoading(res)
                if (media_type !== "text") {setConfetti(true);}
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isLoading]);

    return (
        <div class="h-fit mt-4 md:mt-2 bg-neutral-100">
            <SummaryInputChoices media_type={media_type} setMediaType={setMediaType}/>
            <div class="w-100 grid grid-cols-1 md:grid-cols-8 md:grid-rows-4 md:gap-4 md:mx-14">
                <SummaryInputs media_type={media_type} setMediaType={setMediaType} setText={setText} text_to_summarize={text_to_summarize} setSelectedFile={setSelectedFile} setSummOut={setSummOut} setSummaryLoaded={setSummaryLoaded} summaryLoaded={summaryLoaded}/>
                <OutputSummaryLOLZ summarised_text={summary_out} isLoading={isLoading} gifLink={gifLink}/>
                <SummaryRequestOptions setSummPerc={setSummPerc} summaryTrigger={triggerSumm} isLoading={isLoading}/>
                <Realistic indicator={(!isLoading && popConfetti) ? true : false}/>
            </div>
        </div>
    )
  
}

export default LandingPageLOLZ;