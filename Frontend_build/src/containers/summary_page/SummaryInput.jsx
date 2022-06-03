import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function SummaryInputs(props) {
    const media_type = props.media_type
    

    const handleTextFieldChange = (event) => {
        event.preventDefault();
        props.setText(event.target.value)
    }

    const handleFileInput = (e) => {
        props.setSelectedFile(e.target.files[0]);
    }

    function clearText() {
        props.setText('');
        props.setSummOut('');
        props.setSummaryLoaded(false);
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
                            value={props.text_to_summarize}
                            onChange={handleTextFieldChange}
                            placeholder="Add something!"
                            InputProps={{ disableUnderline: true }}
                        />
                    </div>
                    {props.summaryLoaded === true ? 
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

    return(
        <>
            {media_type === 'text' ? returnTextInput() : (media_type==='youtube' ? returnVideoInput() : returnPDFInput())}
        </>
    )


}