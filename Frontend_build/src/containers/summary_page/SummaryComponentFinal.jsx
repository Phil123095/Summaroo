import {  useState, useEffect } from "react";
import Cookies from 'universal-cookie';
import { useTracking } from "react-tracking";
import OutputSummary from "./SummaryOutput";
import SummaryInputs from "./SummaryInput";
import SummaryInputChoices from "./SummaryTypeChoice";
import SummaryRequestOptions from "./SummaryRequestOptions";
/*import Realistic from "./ConfettiFun";*/
import { actionCreator } from "../../utils/general_utils";
import Header from "../general/Header";
import Footer from "../general/Footer";

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


export default function SummaryPageFinal(props) {
    const { trackEvent } = useTracking();
    const cookies = new Cookies();
    const session_identifier = cookies.get('session_identifier');
    const persistent_user_identifier = cookies.get('persistent_user_identifier');
    const [isLoading, setIsLoading] = useState(false);
    const [popConfetti, setConfetti] = useState(false);
    const [inputTextPlaceholder, setTextPlaceholder] = useState("Add something!")
    const [inputVideoPlaceholder, setVideoPlaceholder] = useState("Add something!")
    const [inputPdfPlaceholder, setPdfPlaceholder] = useState("")

    const [text_to_summarize, setText] = useState('');
    const [summary_perc, setSummPerc] = useState(10);
    const [summary_out, setSummOut] = useState('');
    const [media_type, setMediaType] = useState('text');
    const [summaryLoaded, setSummaryLoaded] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [summaryID, setSummaryID] = useState(null);
    
    const triggerSumm = (e) => {
        e.preventDefault()
        const is_correct = verifyInput()

        if (is_correct){
            setIsLoading(true);
        } else {
            if (media_type === 'text'){
                setTextPlaceholder("Please provide a text to summarize.")
            } else if (media_type === 'youtube'){
                setVideoPlaceholder("Please provide a link.")
            } else if (media_type === 'pdf') {
                setPdfPlaceholder("Please upload a file.")
            }
        }
    }

    const verifyInput = () => {
        if (media_type === 'text'){
            if (text_to_summarize.length === 0) {
                return false;
            } else {return true;}
        } else if (media_type === 'youtube'){
            if (text_to_summarize.length === 0) {
                return false;
            } else {return true;}
        } else if (media_type === 'pdf') {
            if (selectedFile === null) {
                return false;
            } else {return true;}
        }
    }

    const clearText = () => {
        console.log("clearing text")
        setSelectedFile(null)
        setSummaryID(null)
        setText('');
        setSummOut('');
        setSummaryLoaded(false);
        setConfetti(false);
    }

    useEffect(() => {

        trackEvent(actionCreator('page_view', 'summary_page'));

    }, [persistent_user_identifier, session_identifier, trackEvent])
    
    useEffect(() => {
        function requestSummary(summarize_this_text){
            return new Promise((resolve, reject) => {
                console.log("Requesting Summary")
                const requestOptions = {
                    method: 'POST',
                    body: JSON.stringify({
                        user_data: {persistent_user_identifier: persistent_user_identifier, session_identifier: session_identifier},
                        format: media_type,
                        full_text: summarize_this_text,
                        perc_length: summary_perc
                        })
                    };
    
                fetch('https://4bovfvjtrbw7n2szd6a4lzrtwi0gvzhs.lambda-url.eu-central-1.on.aws/', requestOptions)
                    .then(response => response.json())
                    .then(response => {setSummOut(response.final_summary); setSummaryID(response.request_id) })
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
            trackEvent(actionCreator('summary_request', 'summary_page'));
            
            console.log("Request is for:", cookies.get('session_identifier'), cookies.get('persistent_user_identifier'))
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
        <div className="flex flex-col min-h-screen overflow-hidden bg-radial-at-tl from-blue-50 via-indigo-50 to-blue-100">
            <Header/>
            <main className="flex-grow">
                <div class="h-fit pt-24 pb-12 md:pt-24 md:pb-10 lg:mt-2" data-aos="zoom-y-out" data-aos-delay="200">
                    <div class="w-100 grid grid-cols-1 md:grid-cols-8 md:gap-4 md:mx-14">
                        <SummaryInputChoices media_type={media_type} setMediaType={setMediaType} clearText={clearText} clearTextAllowed={(!isLoading && popConfetti) ? true : false}/>
                        <SummaryInputs media_type={media_type} setMediaType={setMediaType} setText={setText} 
                            clearTextAllowed={(!isLoading && popConfetti) ? true : false} clearText={clearText} 
                            text_to_summarize={text_to_summarize} setSelectedFile={setSelectedFile} setSummOut={setSummOut} 
                            setSummaryLoaded={setSummaryLoaded} summaryLoaded={summaryLoaded} text_input_placeholder={inputTextPlaceholder}
                            video_input_placeholder={inputVideoPlaceholder} pdf_input_placeholder={inputPdfPlaceholder} />
                        <OutputSummary summarised_text={summary_out} isLoading={isLoading} showRating={(!isLoading && popConfetti) ? true : false} summaryLoaded={summaryLoaded} summaryRequestID={summaryID}/>
                        
                        {((media_type === "pdf" || media_type === "youtube") && (!isLoading && popConfetti)) ? <div class="flex col-span-8 h-10"/> : null}
                        <SummaryRequestOptions setSummPerc={setSummPerc} summaryTrigger={triggerSumm} isLoading={isLoading}/>
                        {/*<Realistic indicator={(!isLoading && popConfetti) ? true : false}/>*/}
                    </div>
                </div>

            </main>
            <Footer/>

        </div>
    )
  
}
