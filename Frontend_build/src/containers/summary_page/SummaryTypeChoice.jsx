import { useEffect } from "react";

export default function SummaryInputChoices(props) {
    const media_type = props.media_type
    const setMediaType = props.setMediaType
    const clearTextAllowed = props.clearTextAllowed
    const clearText = props.clearText

    useEffect(() => {
        if (media_type === null){
            setMediaType('text')
        }
    }, [media_type, setMediaType])

    const handleChange = (selectedValue) => {
        setMediaType(selectedValue)
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        ((clearTextAllowed) ? clearText : null);
    };


    return (
        <div class="w-full lg:w-fit mx-2 mb-2 lg:ml-16 h-10 lg:h-10 border-slate-100 rounded-lg bg-neutral-100 items-center">
            <div class="mt-4">
                <div class="inline-flex justify-center lg:justify-start w-full" role="group">
                    <button 
                        type="button" 
                        class="shadow-lg inline-block border rounded px-1 py:1.5 lg:px-2 lg:py-2.5 mr-1 h-10 w-32 lg:w-36
                            text-white font-medium text-sm leading-tight uppercase 
                            bg-green-primary bg-opacity-90
                            border-green-primary border-opacity-90
                            hover:bg-green-primary  focus:bg-green-primary focus:outline-none focus:ring-0 
                            active:bg-green-primary active:border-green-primary transition duration-150 ease-in-out"
                        value="text"
                        onClick={e => handleChange(e.target.value)}
                    >
                        SUMMARIZE TEXT
                    </button>
                    <button 
                        type="button" 
                        class="shadow-lg border rounded inline-block mr-1 px-1 py:1.5 lg:px-2 lg:py-2.5 h-10 w-32 lg:w-36
                        text-white font-medium text-sm leading-tight uppercase 
                        bg-green-primary bg-opacity-90
                        border-green-primary border-opacity-90
                        hover:bg-green-primary  focus:bg-green-primary focus:outline-none focus:ring-0 
                        active:bg-green-primary transition duration-150 ease-in-out"
                        value="youtube"
                        onClick={e => handleChange(e.target.value)}
                    >
                        SUMMARIZE VIDEO
                    </button>
                    <button 
                        type="button" 
                        class="shadow-lg border rounded inline-block px-1 py:1.5 lg:px-2 lg:py-2.5 mr-1 h-10 w-32 lg:w-36
                        text-white font-medium text-sm leading-tight uppercase 
                        bg-green-primary bg-opacity-90
                        border-green-primary border-opacity-90
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



    )

}