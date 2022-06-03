import { useEffect } from "react";

export default function SummaryInputChoices(props) {
    const media_type = props.media_type
    const setMediaType = props.setMediaType

    useEffect(() => {
        if (media_type === null){
            setMediaType('text')
        }
    }, [media_type, setMediaType])

    const handleChange = (
        selectedValue,
      ) => {
        setMediaType(selectedValue);
    };


    return (
        <div class="mb-2 ml-16 h-10 md:h-10 border-slate-100 rounded-lg bg-neutral-100 items-center">
            <div class="mt-4">
                <div class="inline-flex w-full" role="group">
                    <button 
                        type="button" 
                        class="border rounded inline-block px-2 mr-1 py-2.5 h-10 w-36
                            text-white font-medium text-sm leading-tight uppercase 
                            bg-green-primary bg-opacity-80
                            border-green-primary border-opacity-80
                            hover:bg-green-primary  focus:bg-green-primary focus:outline-none focus:ring-0 
                            active:bg-green-primary transition duration-150 ease-in-out"
                        value="text"
                        onClick={e => handleChange(e.target.value)}
                    >
                        SUMMARIZE TEXT
                    </button>
                    <button 
                        type="button" 
                        class="border rounded inline-block px-2 mr-1 py-2.5 h-10 w-36
                        text-white font-medium text-sm leading-tight uppercase 
                        bg-green-primary bg-opacity-80
                        border-green-primary border-opacity-80
                        hover:bg-green-primary  focus:bg-green-primary focus:outline-none focus:ring-0 
                        active:bg-green-primary transition duration-150 ease-in-out"
                        value="youtube"
                        onClick={e => handleChange(e.target.value)}
                    >
                        SUMMARIZE VIDEO
                    </button>
                    <button 
                        type="button" 
                        class="border rounded inline-block px-2 mr-1 py-2.5 h-10 w-36
                        text-white font-medium text-sm leading-tight uppercase 
                        bg-green-primary bg-opacity-80
                        border-green-primary border-opacity-80
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