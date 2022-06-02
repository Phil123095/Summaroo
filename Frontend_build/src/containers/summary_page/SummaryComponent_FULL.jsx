import { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import { return_loader } from "../../utils/general_utils";
/*import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';*/
/*import { S3 } from "@aws-sdk/client-s3"*/
/*import aws from 'aws-sdk';*/

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

/*import S3 from "react-aws-s3"*/
/*var fs = require('fs');*/

window.Buffer = window.Buffer || require("buffer").Buffer;


function LandingPageFULL() {

    function valuetext(value) {
        return `${value}%`;
    }

    const [text_to_summarize, setText] = useState('');
    const [summary_perc, setSummPerc] = useState(10);
    const [summary_out, setSummOut] = useState('');
    const [media_type, setMediaType] = useState('text');
    const [loading, setLoading] = useState(false);

    function handleTextFieldChange(event) {
        event.preventDefault();
        setText(event.target.value)
    }

    function handleSummPercSlider(event) {
        event.preventDefault();
        setSummPerc(event.target.value)
    }

    const [selectedFileName, setSelectedFileName] = useState(null);
    const [summaryLoaded, setSummaryLoaded] = useState(false);


    const [selectedFile, setSelectedFile] = useState(null);


    const handleFileInput = (e) => {
        setSelectedFile(e.target.files[0]);
        setSelectedFileName(e.target.files[0].name)
    }

    const HandlePDFSummary = (file) => {

        const params = {
            Body: file,
            Bucket: BucketName,
            Key: file.name.replace(/\s+/g, '')
        };

        myBucket.putObject(params, function(err, data) {
            if (err) {console.log(err)}
            else {
                const file_url = `https://${BucketName}.s3.amazonaws.com/${file.name.replace(/\s+/g, '')}`
                const requestOptions = {
                    method: 'POST',
                    body: JSON.stringify({
                        format: media_type,
                        full_text: file_url,
                        perc_length: summary_perc
                        })
                };
        
                fetch('https://4bovfvjtrbw7n2szd6a4lzrtwi0gvzhs.lambda-url.eu-central-1.on.aws/', requestOptions)
                    .then(response => response.json())
                    .then(response => setSummOut(response.final_summary))
                    .then(setSummaryLoaded(true))
                    .then(setLoading(false));
                console.log(file_url)}

        })
    }

    function clearText() {
        setText('');
        setSummOut('');
        setSummaryLoaded(false);
    }

    function SummarizeText() {
        setLoading(true)
        if (media_type === 'pdf') {
            console.log(selectedFile, selectedFileName)
            HandlePDFSummary(selectedFile)
  
        } else {
            const requestOptions = {
                method: 'POST',
                body: JSON.stringify({
                    format: media_type,
                    full_text: text_to_summarize,
                    perc_length: summary_perc
                    })
                };

            fetch('https://4bovfvjtrbw7n2szd6a4lzrtwi0gvzhs.lambda-url.eu-central-1.on.aws/', requestOptions)
                .then(response => response.json())
                .then(response => setSummOut(response.final_summary))
                .then(setSummaryLoaded(true))
                .then(setLoading(false));
        }
        

    }

    function returnTextInput() {
        return(
            <div class="m-2 col-span-1 md:col-span-4 md:col-start-1 md:row-span-3 bg-neutral-100 justify-center items-center rounded-lg">
                <div class="p-2 bg-white rounded-lg border shadow-sm">
                    <div class="pt-1 ml-1 h-10 border-b-1 border-color border-blue-900 text-base text-gray-700 items-center font-light">
                        Drop in the text you want to summarize here...
                    </div>
                    <div class="border border-slate-200 rounded-lg">
                        <TextField
                            class="m-2"
                            id="multiline-static"
                            variant="standard"
                            fullWidth
                            multiline
                            rows={16}
                            value={text_to_summarize}
                            onChange={handleTextFieldChange}
                            placeholder="Add something!"
                            InputProps={{ disableUnderline: true }}
                        />
                    </div>
                    {summaryLoaded === true ? 
                        <div class="w-full my-2 items-right">
                            <div>
                                <Button variant="outlined" disableElevation  style={{minHeight: '30px', maxHeight: '30px'}} onClick={clearText}>
                                    <p class="text-base">Clear Text</p>
                                </Button>
                            </div>
                        </div>
                    :<p></p>}
                </div>
            </div>
        )
    }

    function returnVideoInput() {

        return(
            <div class="m-2 col-span-1 grid grid-cols-1 md:col-span-4 md:col-start-1 md:row-span-3 justify-center content-center rounded-lg">
                <div class="grid grid-cols-1 p-2 h-40 bg-white rounded-lg border shadow-sm content-center">
                    <div class="pt-1 ml-1 h-10 border-b-1 border-color border-blue-900 text-base text-gray-700 items-center font-light">
                        Drop in the url of the Youtube video you want to summarize here...
                    </div>
                    <div class=" border border-slate-200 rounded-lg">
                        <TextField
                            class="m-2"
                            id="outlined-basic"
                            variant="standard"
                            fullWidth
                            rows={16}
                            onChange={handleTextFieldChange}
                            placeholder="Add something!"
                            InputProps={{ disableUnderline: true }}
                        />
                    </div>
                </div>
            </div>
            
        );
    }

    function NewlineText(props) {
        const text = props.text;
        return text.split('.').map(str => <p class="text-base font-light text-gray-700">{str += "."}</p>);
      }

    function returnPDFInput() {
        return(
            <div class="m-2 col-span-1 grid grid-cols-1 md:col-span-4 md:col-start-1 md:row-span-3 justify-center content-center rounded-lg">
                <div class="grid grid-cols-1 p-2 h-40 bg-white rounded-lg border shadow-sm content-center">
                    <div class="pt-1 ml-1 h-10 border-b-1 border-color border-blue-900 text-base text-gray-700 items-center font-light">
                        Upload your PDF here...
                    </div>
                    <input type="file" class="form-control my-1 h-8 w-full justify-center align-center rounded-lg border border-solid border-slate-200" onChange={handleFileInput}/>

                </div>
            </div>
        )
    }

    useEffect(() => {
        if (media_type === null){
            setMediaType('text')
        }
    }, [media_type])

    const handleChange = (
        selectedValue,
      ) => {
        setMediaType(selectedValue);
      };

    console.log(media_type)
    

    return (
    <div class="mt-4 md:mt-2 bg-neutral-100">
        <div class="mb-2 ml-16 h-10 md:h-10 border-slate-100 rounded-lg bg-neutral-100 items-center">
            <div class="mt-4">
                <div class="inline-flex w-full" role="group">
                    <button 
                        type="button" 
                        class="border rounded inline-block px-2 mr-1 py-2.5 h-10 w-36
                            text-white font-medium text-sm leading-tight uppercase 
                            bg-green-primary bg-opacity-80
                            border-green-primary border-opacity-80
                            hover:bg-green-primary  focus:bg-green-primary focus:outline-none focus:ring-0 
                            active:bg-green-primary transition duration-150 ease-in-out"
                        value="text"
                        onClick={e => handleChange(e.target.value)}
                    >
                        SUMMARIZE TEXT
                    </button>
                    <button 
                        type="button" 
                        class="border rounded inline-block px-2 mr-1 py-2.5 h-10 w-36
                        text-white font-medium text-sm leading-tight uppercase 
                        bg-green-primary bg-opacity-80
                        border-green-primary border-opacity-80
                        hover:bg-green-primary  focus:bg-green-primary focus:outline-none focus:ring-0 
                        active:bg-green-primary transition duration-150 ease-in-out"
                        value="youtube"
                        onClick={e => handleChange(e.target.value)}
                    >
                        SUMMARIZE VIDEO
                    </button>
                    <button 
                        type="button" 
                        class="border rounded inline-block px-2 mr-1 py-2.5 h-10 w-36
                        text-white font-medium text-sm leading-tight uppercase 
                        bg-green-primary bg-opacity-80
                        border-green-primary border-opacity-80
                        hover:bg-green-primary  focus:bg-green-primary focus:outline-none focus:ring-0 
                        active:bg-green-primary transition duration-150 ease-in-out"
                        value="pdf"
                        onClick={e => handleChange(e.target.value)}
                    >
                        UPLOAD PDF
                    </button>
                </div>
            </div>
        </div>
        <div class="w-100 min-h-screen grid grid-cols-1 md:grid-cols-8 md:grid-rows-6 md:gap-4 md:mx-14">
            {media_type === 'text' ? returnTextInput() : (media_type==='youtube' ? returnVideoInput() : returnPDFInput())}
    
            <div class="m-2 p-2 col-span-1 md:col-span-4 md:row-span-3 bg-white justify-center items-center rounded-lg">
                <div class="pt-1 ml-1 h-10 border-b-1 border-color border-blue-900 text-base text-gray-700 items-center font-light">
                    ... and the magic happens here.
                </div>
                <div class="border rounded-lg border-slate-200 h-96 w-full overflow-y-scroll">
                    <div class="px-2 pt-1"><NewlineText text={summary_out} /></div>
                </div>

            </div>
            <div class="h-20 col-span-1 md:col-span-4 border-slate-200 rounded-lg bg-slate-100 px-2 mb-2">
                <p class="pt-1 px-2 text-sm md:text-base font-light text-gray-700">Select the summary size (as % of total text length)</p>
                <div class="py-1 px-2 mb-3 h-2">
                    <Slider
                        aria-label="Perc Of Text"
                        sx={{color:"#00B050"}}
                        defaultValue={5}
                        getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        step={5}
                        marks
                        min={1}
                        max={100}
                        onChange={handleSummPercSlider}
                    />
                </div>
            </div>
            <div class="m-2 mb-3 h-10 md:h-20 col-span-1 md:col-span-4 border-slate-100 rounded-lg bg-slate-100 items-center">
                <button class="btn w-full h-30 inline-flex justify-center items-center bg-green-primary bg-opacity-90 border-green-primary border-opacity-80 hover:bg-green-primary h-16 w-full border rounded-lg animate-none" onClick={SummarizeText}>
                    {loading === true ? return_loader() : null}
                    {loading === true ? <p class="text-base text-white">PERFORMING MAGIC</p> : <p class="text-base text-white">SUMMARIZE</p>}
                </button>
        
            </div>
        </div>
    </div>
    )
  
}

export default LandingPageFULL;