import { useState } from "react";
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import axios from 'axios';


function LandingPage() {

    function valuetext(value) {
        return `${value}%`;
    }

    const [text_to_summarize, setText] = useState('');
    const [summary_perc, setSummPerc] = useState(10);
    const [summary_out, setSummOut] = useState('');

    function handleTextFieldChange(event) {
        event.preventDefault();
        setText(event.target.value)
    }

    function handleSummPercSlider(event) {
        event.preventDefault();
        setSummPerc(event.target.value)
    }

    function SummarizeText() {
        //Prevent page reload
        axios({
            method: "POST",
            url: "/summarise",
            data: {
                full_text: text_to_summarize,
                perc_length: summary_perc
               }
        })
        .then(response => response.data)
        .then(response => setSummOut(response.final_summary))
    }

    return (
    <div class="mt-28">
        <div class="w-100 min-h-screen grid grid-cols-8 grid-rows-6 gap-4 mx-14">
            <div class="col-span-4 col-start-1 row-span-3 bg-slate-500 justify-center items-center rounded-lg">
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
            <div class="p-2 col-span-4 row-span-3 bg-white justify-center items-center rounded-lg">
                <div class="pt-1 ml-1 h-10 border-b-1 border-color border-blue-900 text-base text-gray-700 items-center font-light">
                    ... and the magic happens here.
                </div>
                <div class="border rounded-lg border-slate-200 h-96 w-full overflow-y-scroll">
                    <p class="pt-1 px-2 text-base font-light text-gray-700">{summary_out}</p>
                </div>

            </div>
            <div class="h-20 col-span-4 border-slate-200 rounded-lg bg-slate-100 px-2">
                <p class="pt-1 px-2 text-base font-light text-gray-700">Select the summary size (as % of total text length)</p>
                <div class="py-1 px-2 mb-3 h-2">
                    <Slider
                        aria-label="Perc Of Text"
                        defaultValue={10}
                        getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        step={5}
                        marks
                        min={5}
                        max={100}
                        onChange={handleSummPercSlider}
                    />
                </div>
            </div>
            <div class="h-20 col-span-4 border-slate-100 rounded-lg bg-slate-100 items-center">
                <Button variant="contained" disableElevation fullWidth style={{minHeight: '60px', maxHeight: '60px'}} onClick={SummarizeText}>
                    <p class="text-base">Summarize</p>
                </Button>
            </div>
        </div>
    </div>
    )
  
}

export default LandingPage;