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
const SummaryEndpoint = process.env.REACT_APP_SUMMARY_ENDPOINT;

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
    const [isCopied, setCopy] = useState(false)
    const [YTError, setYTError] = useState(false)
    const [reviewed, setReviewed] = useState(false)

    const [text_to_summarize, setText] = useState('');
    const [summary_perc, setSummPerc] = useState(10);
    const [summary_out, setSummOut] = useState('');
    const [media_type, setMediaType] = useState('text');
    const [summaryLoaded, setSummaryLoaded] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [summaryID, setSummaryID] = useState(null);

    function matchYoutubeUrl(url) {
        var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        if(url.match(p)){
            return true;
        }
        return false;
    }
    
    const triggerSumm = (e) => {
        e.preventDefault()
        const is_correct = verifyInput()

        if (is_correct){
            if (media_type === 'youtube'){
                const youtube_check = matchYoutubeUrl(text_to_summarize);
                if (youtube_check) {
                    setYTError(false)
                    setIsLoading(true);
                } else {
                    setYTError(true)
                    setText('');
                    setVideoPlaceholder("Please provide a valid Youtube link.")
                }
            } else {setIsLoading(true); setPdfPlaceholder("")}
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
        setCopy(false)
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
                const requestOptions = {
                    method: 'POST',
                    body: JSON.stringify({
                        user_data: {persistent_user_identifier: persistent_user_identifier, session_identifier: session_identifier},
                        format: media_type,
                        full_text: summarize_this_text,
                        perc_length: summary_perc
                        })
                    };
    
                fetch(SummaryEndpoint, requestOptions)
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
                myBucket.upload(params, function(err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        requestSummary(data.Location).then(result => resolve(false))
                    }
                })
    
            })
    
        }
    
        function SummarizationManager() {
            trackEvent(actionCreator('summary_request', 'summary_page'));
            
            return new Promise((resolve, reject) => {
                console.log(media_type)
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
            if (media_type === 'text') { setConfetti(true);}
            SummarizationManager().then(res => {
                setIsLoading(res)
                if (media_type !== "text") {setConfetti(true);}
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isLoading]);


    return (
        <div className="flex flex-col min-h-screen overflow-hidden bg-radial-at-tl from-blue-50 via-indigo-50 to-blue-100">
            <Header/>
            <main className="flex-grow">
                <div class="h-fit pt-36 pb-12 md:pt-24 md:pb-10 lg:mt-2" data-aos="zoom-y-out" data-aos-delay="200">
                    <div class="w-100 flex flex-col md:grid md:grid-cols-8 md:gap-4 md:mx-14">
                        <SummaryInputChoices media_type={media_type} setMediaType={setMediaType} clearText={clearText} clearTextAllowed={(!isLoading && popConfetti) ? true : false}/>
                        <SummaryInputs media_type={media_type} setMediaType={setMediaType} setText={setText} 
                            clearTextAllowed={(!isLoading && popConfetti) ? true : false} clearText={clearText} 
                            text_to_summarize={text_to_summarize} setSelectedFile={setSelectedFile} setSummOut={setSummOut} 
                            setSummaryLoaded={setSummaryLoaded} summaryLoaded={summaryLoaded} text_input_placeholder={inputTextPlaceholder}
                            video_input_placeholder={inputVideoPlaceholder} pdf_input_placeholder={inputPdfPlaceholder} YTError={YTError} />
                        <OutputSummary setReviewed={setReviewed} summarised_text={summary_out} isLoading={isLoading} showRating={(!isLoading && popConfetti) ? true : false} isCopied={isCopied} setCopy={setCopy} summaryLoaded={summaryLoaded} summaryRequestID={summaryID}/>
                        
                        {((media_type === "pdf" || media_type === "youtube") && (!isLoading && popConfetti)) ? <div class="flex col-span-8 h-10"/> : null}
                        <SummaryRequestOptions setSummPerc={setSummPerc} summaryTrigger={triggerSumm} isLoading={isLoading}/>
                    </div>
                </div>

            </main>
            <Footer/>

        </div>
    )
  
}
