import { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import AWS from 'aws-sdk';

window.Buffer = window.Buffer || require("buffer").Buffer;

/*const { S3Client, PutObjectCommand, ListObjectsCommand, DeleteObjectCommand, DeleteObjectsCommand } = require("@aws-sdk/client-s3");*/



/*const accessKeyId = process.env.REACT_APP_ACCESS_KEY_ID;
const secretAccessKey = process.env.REACT_APP_SECRET_ACCESS_KEY;*/

/*AWS.config.update({ region:Region, credentials: new AWS.Credentials(accessKeyId, secretAccessKey)});*/
/*AWS.config.update({ region: Region, accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID, secretAccessKey:process.env.REACT_APP_SECRET_ACCESS_KEY});*/

/*const config = {
    bucketName: BucketName,
    region: Region,
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
}*/



/*const myBucket = new AWS.S3({
    params: { Bucket: BucketName},
    region: Region,
})*/

/*import axios from 'axios';*/


function LandingPage() {


    const BucketName = process.env.REACT_APP_BUCKET_NAME;
    const Region = process.env.REACT_APP_REGION;
    AWS.config.update({ region: Region, accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID, secretAccessKey:process.env.REACT_APP_SECRET_ACCESS_KEY});

    function valuetext(value) {
        return `${value}%`;
    }

    const [text_to_summarize, setText] = useState('');
    const [summary_perc, setSummPerc] = useState(10);
    const [summary_out, setSummOut] = useState('');
    const [media_type, setMediaType] = useState('text');

    function handleTextFieldChange(event) {
        event.preventDefault();
        setText(event.target.value)
    }

    function handleSummPercSlider(event) {
        event.preventDefault();
        setSummPerc(event.target.value)
    }

    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState(null);
    const [summaryLoaded, setSummaryLoaded] = useState(false);

    const handleFileInput = (e) => {
        setSelectedFile(e.target.files[0]);
        setSelectedFileName(e.target.files[0].name)
    }

    const handleUpload2 = () => {
        const upload_params = {Bucket: BucketName, Key: selectedFileName, Body: selectedFile};
        const upload = new AWS.S3.ManagedUpload({params: upload_params});
        upload.promise()
        .then(data => console.log(data))
        .catch(error => console.log("Something fucked up: ", error.message));
    }

    function clearText() {
        setText('');
        setSummOut('');
        setSummaryLoaded(false);
    }

    function SummarizeText() {
        if (media_type === 'pdf') {
            handleUpload2()
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
                .then(setSummaryLoaded(true));
        }

    }

    function returnTextInput() {
        return(
            <div class="m-2 col-span-1 md:col-span-4 md:col-start-1 md:row-span-3 bg-slate-500 justify-center items-center rounded-lg">
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
                    <div class=" border border-slate-200 rounded-lg">
                        <input type="file" class="form-control my-4 justify-center align-center rounded-lg border border-solid border-gray-300" onChange={handleFileInput}/>
                    </div>
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
        event,
        newAlignment,
      ) => {
        setMediaType(newAlignment);
      };

    console.log(media_type)

    return (
    <div class="mt-4 md:mt-2">
        <div class="mb-2 ml-16 h-10 md:h-10 border-slate-100 rounded-lg bg-slate-100 items-center">
            <div class="mt-4">
                <ToggleButtonGroup
                    color="primary"
                    value={media_type}
                    exclusive
                    onChange={handleChange}
                >
                    <ToggleButton value="text">Summarise Text</ToggleButton>
                    <ToggleButton value="youtube">Summarise Video</ToggleButton>
                    <ToggleButton value="pdf">Upload PDF</ToggleButton>
                </ToggleButtonGroup>
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
                        defaultValue={3}
                        getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        step={1}
                        marks
                        min={1}
                        max={50}
                        onChange={handleSummPercSlider}
                    />
                </div>
            </div>
            <div class="m-2 mb-3 h-10 md:h-20 col-span-1 md:col-span-4 border-slate-100 rounded-lg bg-slate-100 items-center">
                <Button variant="contained" disableElevation fullWidth style={{minHeight: '60px', maxHeight: '60px'}} onClick={SummarizeText}>
                    <p class="text-base">Summarize</p>
                </Button>
            </div>
        </div>
    </div>
    )
  
}

export default LandingPage;