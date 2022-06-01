import React ,{useEffect, useState} from 'react';


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

function Uploadfile() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [correctFormat, setFormatIndicator] = useState(true);
    const [successUpload, setSuccess] = useState(false);
    const [disableButton, setDisable] = useState(false);
    const [textValidation, setTextValidation] = useState("Just make sure it's .xlsx please.");

    const handleFileInput = (e) => {
        setSelectedFile(e.target.files[0]);
        
        const Filename = e.target.files[0].name

        if (Filename.substr(Filename.length - 4) === '.pdf') {
            setFormatIndicator(true);
        }
        else {setFormatIndicator(false);}
    }

    const uploadFile = (file) => {

        const params = {
            Body: file,
            Bucket: BucketName,
            Key: file.name
        };

        myBucket.putObject(params)
            .on('httpUploadProgress', (evt) => {
                if (evt.loaded === evt.total) {
                    setSuccess(true);
                }
            })
            .send((err) => {
                if (err) console.log(err)
            })
    }

    useEffect(() => {
        if (correctFormat === false) {
            setDisable(true);
            setTextValidation("Sorry, we only accept .xlsx files");
        }
        else if (successUpload === true) {
            setTextValidation("In a minute or so the data will be available in the dashboard.")
        }
        else {
            setTextValidation("Just make sure it's .xlsx please.")
        }

    }, [selectedFile, correctFormat, successUpload])
    

    return(
        <div class="flex flex-row bg-slate-100 items-center justify-center">
            <div class="basis-1/4 h-96 p-9 border-1 border-slate-200 rounded bg-white shadow-sm my-44">
                <div class="pt-10 pb-2">
                    <h2 class="font-weight-bold text-xl text-center">{successUpload === true ? "Upload successful!" : "Upload a File"}</h2>
                    <p class="py-1 text-xs font-weight-light text-center italic">{textValidation}</p>
                </div>
                <div class="flex row justify-center align-center">
                
                    <input type="file" class="form-control my-4 justify-center align-center rounded-lg border border-solid border-gray-300" onChange={handleFileInput}/>
                    <button type="submit"
                            class="w-full text-white bg-blue-500 hover:bg-blue-700 font-bold rounded-lg 
                                text-lg px-4 py-1.5 inline-flex justify-center items-center" 
                            onClick={() => uploadFile(selectedFile)}
                            disabled={disableButton}>

                        <h2 class="text-lg text-center">{successUpload === true ? "Upload another File" : "Upload File"}</h2>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Uploadfile;