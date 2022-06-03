let loadingGif = require("../../assets/LOADING.gif")
let punchingGif = require("../../assets/PUNCHGIF.gif")
let failgif = require("../../assets/FAILGIF.gif")
let majesticgif = require("../../assets/MAJESTIC GIF.gif")

let array = [loadingGif, punchingGif, failgif, majesticgif]
export default function OutputSummary(props) {
    const summary_out = props.summarised_text

    function NewlineText(props) {
        const text = props.text
        return text.split('.').map(str => <p class="text-base font-light text-gray-700">{str += "."}</p>);
    }

    return(
        <div class="m-2 p-2 col-span-1 md:col-span-4 md:row-span-3 bg-white justify-center items-center rounded-lg">
            <div class="pt-1 ml-1 h-10 border-b-1 border-color border-blue-900 text-base text-gray-700 items-center font-light">
                ... and the magic happens here.
            </div>
            <div class="border rounded-lg border-slate-200 h-96 w-full overflow-y-scroll">
                <div class="px-2 pt-1">
                    {summary_out === '' ? 
                        (props.isLoading === true ? 
                            <img class="animate-in slide-in-from-left animate-out slide-out-to-right-95 w-18 h-18" src={array[Math.floor((Math.random()*array.length))]} alt="wait until the page loads" />

                        : null) 
                    : <NewlineText text={summary_out}/>}
                </div>
            </div>

        </div>

    )

}