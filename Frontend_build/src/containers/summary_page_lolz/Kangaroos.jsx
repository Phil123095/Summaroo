import { GiphyFetch } from "@giphy/js-fetch-api";
import {  useEffect, useState } from "react";

export default function KangarooGenerator() {
    const giphyFetch = new GiphyFetch("I416egPdf0z8yknVgQJ5uahNr0WBa8YG");
    const [gifLink, setGifLink] = useState(null);
    const random = async () => {
        try {
          const result = await giphyFetch.random({tag: 'kangaroo'})
          const url = result.data.images.original.url
          setGifLink(url)
        } catch (error) {
          console.error(`random`, error);
        }
        

    };
    
    useEffect(() => {
        if (!gifLink) {
            random();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gifLink]);
    

    return(
        <div class="mt-4 md:mt-2 bg-neutral-100 px-2 pt-1 w-full flex flex-col justify-center items-center">
            <div class="flex flex-col justify-center items-center">
                <img class="w-8/10 h-8/10" src={gifLink} alt="gif" />
                <button onClick={random} class="w-full mt-6 h-30 inline-flex justify-center items-center bg-green-primary bg-opacity-90 border-green-primary border-opacity-80 hover:bg-green-primary h-16 border rounded-lg animate-none text-lg">Generate Kangaroo Happiness</button>
                <button onClick={random} class="w-full h-8 mt-2 inline-flex justify-center items-center bg-neutral-400 bg-opacity-90 hover:bg-neutral-600 border rounded-lg animate-none">
                    <a href="/" class="inline-block my-4 mx-2 align-center text-black text-lg rounded hover:no-underline">
                        Back to work... 😔
                    </a>
                </button>

            </div>
        
        </div>

    )
}