import { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

/*import axios from 'axios';*/


function LandingPage() {

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

    function SummarizeText() {

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
            .then(response => setSummOut(response.final_summary));
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
                            onChange={handleTextFieldChange}
                        />
                    </div>
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
                </ToggleButtonGroup>
            </div>
        </div>
        <div class="w-100 min-h-screen grid grid-cols-1 md:grid-cols-8 md:grid-rows-6 md:gap-4 md:mx-14">
            {media_type === 'text' ? returnTextInput() : returnVideoInput()}
    
            <div class="m-2 p-2 col-span-1 md:col-span-4 md:row-span-3 bg-white justify-center items-center rounded-lg">
                <div class="pt-1 ml-1 h-10 border-b-1 border-color border-blue-900 text-base text-gray-700 items-center font-light">
                    ... and the magic happens here.
                </div>
                <div class="border rounded-lg border-slate-200 h-96 w-full overflow-y-scroll">
                    <p class="pt-1 px-2 text-base font-light text-gray-700">{summary_out}</p>
                </div>

            </div>
            <div class="h-20 col-span-1 md:col-span-4 border-slate-200 rounded-lg bg-slate-100 px-2 mb-2">
                <p class="pt-1 px-2 text-sm md:text-base font-light text-gray-700">Select the summary size (as % of total text length)</p>
                <div class="py-1 px-2 mb-3 h-2">
                    <Slider
                        aria-label="Perc Of Text"
                        defaultValue={10}
                        getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        step={2}
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