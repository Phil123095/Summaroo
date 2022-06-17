import { useEffect } from "react";
import { actionCreator } from '../../utils/general_utils';
import { useTracking } from "react-tracking";

export default function SummaryInputChoices(props) {
    const media_type = props.media_type
    const setMediaType = props.setMediaType
    const clearTextAllowed = props.clearTextAllowed
    const clearText = props.clearText
    const { trackEvent } = useTracking();

    useEffect(() => {
        if (media_type === null){
            setMediaType('text')
        }
    }, [media_type, setMediaType])

    const handleChange = (selectedValue) => {
        trackEvent(actionCreator(selectedValue + '_button_click', 'summary_page'))
        setMediaType(selectedValue)

        ((clearTextAllowed) ? clearText : null);
    };


    return (
        <div class="col-span-1 ml-2 md:col-span-4 mx-1 mb-4 md:mb-2 h-10 lg:h-10 items-center">
            <div class="mt-4">
                <div class="inline-flex justify-center lg:justify-start w-full" role="group">
                    <button 
                        type="button" 
                        class="shadow-lg inline-block basis-1/3 border rounded px-1 py:1.5 lg:px-2 lg:py-2.5 mr-1 h-10 w-32 lg:w-36
                            text-white font-medium text-sm leading-tight uppercase 
                            bg-blue-base bg-opacity-90
                            border-blue-base border-opacity-90
                            hover:bg-blue-base focus:bg-blue-base focus:outline-none focus:ring-0 
                            active:bg-blue-base active:border-blue-base transition duration-150 ease-in-out"
                        value="text"
                        onClick={e => handleChange(e.target.value)}
                    >
                        SUMMARIZE TEXT
                    </button>
                    <button 
                        type="button" 
                        class="shadow-lg border rounded basis-1/3 inline-block mr-1 px-0.5 py:1.5 lg:px-1 lg:py-2.5 h-10 w-32 lg:w-36
                        text-white font-medium text-sm leading-tight uppercase 
                        bg-blue-base bg-opacity-90
                        border-blue-base border-opacity-90
                        hover:bg-blue-base focus:bg-blue-base focus:outline-none focus:ring-0 
                        active:bg-blue-base active:border-blue-base transition duration-150 ease-in-out"
                        value="youtube"
                        onClick={e => handleChange(e.target.value)}
                    >
                        SUMMARIZE VIDEO
                    </button>
                    <button 
                        type="button" 
                        class="shadow-lg border rounded basis-1/3 inline-block px-1 py:1.5 lg:px-2 lg:py-2.5 mr-1 h-10 w-32 lg:w-36
                        text-white font-medium text-sm leading-tight uppercase 
                        bg-blue-base bg-opacity-90
                        border-blue-base border-opacity-90
                        hover:bg-blue-base focus:bg-blue-base focus:outline-none focus:ring-0 
                        active:bg-blue-base active:border-blue-base transition duration-150 ease-in-out"
                        value="pdf"
                        onClick={e => handleChange(e.target.value)}
                    >
                        UPLOAD PDF
                    </button>
                </div>
            </div>
        </div>



    )

}