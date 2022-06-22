import TextField from '@mui/material/TextField';


export default function SummaryInputs(props) {
    const media_type = props.media_type
    

    const handleTextFieldChange = (event) => {
        event.preventDefault();
        props.setText(event.target.value)
    }

    const handleFileInput = (e) => {
        props.setSelectedFile(e.target.files[0]);
    }
    
    function returnTextInput() {
        return(
            <div class="p-2 mt-4 md:mt-0 bg-white rounded-lg shadow-xl">
                <div class="pt-1 ml-1 h-10 border-b-1 border-color border-blue-base text-base text-gray-700 items-center font-light">
                    Drop in the text you want to summarize here...
                </div>
                <div class="border border-slate-200 rounded-lg">
                    <TextField
                        class="m-2 mb-4 pb-4 h-96 overflow-y-scroll"
                        id="multiline-static"
                        variant="standard"
                        autoFocus={true}
                        fullWidth
                        multiline
                        value={props.text_to_summarize}
                        onChange={handleTextFieldChange}
                        placeholder={props.text_input_placeholder}
                        InputProps={{ disableUnderline: true }}
                    />
                </div>
            </div>

        )
    }

    function returnVideoInput() {

        return(

            <div class="grid grid-cols-1 p-2 h-40 bg-white rounded-lg border shadow-sm content-center">
                <div class="pt-1 ml-1 h-10 border-b-1 border-color border-blue-900 text-base text-gray-700 items-center font-light">
                    Drop in the url of the Youtube video you want to summarize here...
                </div>
                <div class="mt-4 md:mt-0 border border-slate-200 rounded-lg">
                    <TextField
                        class="m-2"
                        id="outlined-basic"
                        variant="standard"
                        autoFocus={true}
                        fullWidth
                        rows={16}
                        onChange={handleTextFieldChange}
                        placeholder={(props.YTError) ? null : props.video_input_placeholder}
                        error={(props.YTError) ? props.video_input_placeholder : null}
                        helperText={(props.YTError) ? props.video_input_placeholder : null}
                        InputProps={{ disableUnderline: true }}
                    />
                </div>
            </div>
        )
            
    }


    function returnPDFInput() {
        return(
            <>
                <div class="grid grid-cols-1 p-2 h-50 bg-white rounded-lg border shadow-sm content-center">
                    <div class="pt-1 ml-1 h-10 border-b-1 border-color border-blue-900 text-base text-gray-700 items-center font-light">
                        Upload your PDF here...
                    </div>
                    <div class="flex flex-col justify-left items-center w-full">
                        {/*<label for="dropzone-file" class="flex flex-col justify-center items-center w-full h-30 bg-blue-base bg-opacity-5 rounded-lg border-2 border-blue-base border-opacity-50 border-dashed cursor-pointer  hover:bg-blue-base hover:bg-opacity-10">
                            <div class="flex flex-col justify-center items-center pt-5 pb-6">
                                <svg class="mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400"><span class="font-semibold">PDF only</span>... for the time being</p>
                            </div>
                            <input id="dropzone-file" type="file" class="hidden" onChange={handleFileInput} onDrop={handleFileInput}/>
                        </label>*/}
                         
                        <input class="block w-full text-sm text-gray-900 bg-blue-base bg-opacity-5 rounded-lg border border-blue-base focus:outline-noned" id="file_input" type="file" accept=".pdf" onChange={handleFileInput}/>

                    </div> 
                    <p class="mt-1 font-light text-sm">{props.pdf_input_placeholder}</p>
                </div>
            </>

        )
    }

    return(

            <div class="m-2 col-span-1 grid grid-cols-1 md:col-span-4 md:col-start-1 justify-center content-center rounded-lg">
                <>
                    {media_type === 'text' ? returnTextInput() : (media_type==='youtube' ? returnVideoInput() : returnPDFInput())}
                </>
                <>
                    {props.clearTextAllowed === true ? 
                        <div class="flex w-full my-2 justify-center md:justify-left">
                            <div>
                                <button onClick={props.clearText}
                                    class="h-10 w-34
                                    border-blue-base border border-opacity-80  
                                    font-semibold rounded-md p-3 flex items-center">
                                        <p class="text-base font-light text-center text-blue-base">Clear Text</p>
                                </button>
                            </div>
                        </div>
                    :null}
                </>
            </div>

    )


}