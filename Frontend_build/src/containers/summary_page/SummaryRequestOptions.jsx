/*import { return_loader } from "../../utils/general_utils";*/
import Slider from '@mui/material/Slider';

let loadingGif = require("../../assets/LOADING.gif")

export default function SummaryRequestOptions(props) {

    function valuetext(value) {
        const format_value = value + '%'
        return format_value;
    }

    const handleSummPercSlider = (event) => {
        event.preventDefault();
        props.setSummPerc(event.target.value)
    }

    return(
        <>
            <div class=" h-16 md:h-20 col-span-1 md:col-span-4 rounded-lg px-2 mb-2">
                <p class="pt-1 px-2 text-sm md:text-base font-light text-gray-700">Select the summary size</p>
                <div class="py-1 px-2 md:mb-3 h-2">
                    <Slider
                        aria-label="Perc Of Text"
                        sx={{color:"#3b5ae3"}}
                        defaultValue={5}
                        valueLabelFormat={valuetext}
                        valueLabelDisplay="auto"
                        min={1}
                        max={100}
                        onChange={handleSummPercSlider}
                    />
                </div>
            </div>
            <div class="m-2 mb-3 h-10 md:h-20 col-span-1 md:col-span-4 rounded-lg items-center">
                <button disabled={props.isLoading} class="w-full h-30 inline-flex shadow-md justify-center items-center bg-blue-base bg-opacity-90 border-blue-base border-opacity-90 hover:bg-blue-base h-16 border rounded-lg animate-none" onClick={props.summaryTrigger}>
                    {props.isLoading === true ? 
                        <img class="animate-in slide-in-from-left animate-out slide-out-to-right-95 w-12 h-12 mr-1 pb-2" src={loadingGif /*array[Math.floor((Math.random()*array.length))]*/} alt="wait until the page loads" />
                        /*<svg role="status" class="inline mr-3 w-5 h-5 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                        </svg>*/: null}
                    {props.isLoading === true ? <p class="text-lg text-white">PERFORMING MAGIC</p> : <p class="text-lg text-white">SUMMARIZE</p>}
                </button>
            </div>

            

        </>
    )
    
}