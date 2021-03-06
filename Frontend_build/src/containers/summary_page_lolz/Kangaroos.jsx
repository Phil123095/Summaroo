import { GiphyFetch } from "@giphy/js-fetch-api";
import {  useEffect, useState } from "react";
import Footer from "../general/Footer";
import Header from "../general/Header";
import { useTracking } from 'react-tracking';
import { actionCreator } from '../../utils/general_utils';

export default function KangarooGenerator() {
    const giphyFetch = new GiphyFetch("I416egPdf0z8yknVgQJ5uahNr0WBa8YG");
    const [gifLink, setGifLink] = useState(null);
    const random = async () => {
        trackEvent(actionCreator('kangaroo_button_click', 'kangaroo_page'));
        try {
          const result = await giphyFetch.random({tag: 'kangaroo'})
          const url = result.data.images.original.url
          setGifLink(url)
        } catch (error) {
          console.error(`random`, error);
        }

    };

    const {trackEvent} = useTracking()

    useEffect(() => {
  
        trackEvent(actionCreator('page_view', 'kangaroo_page'));
  
    }, [trackEvent])
    
    useEffect(() => {
        if (!gifLink) {
            random();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gifLink]);
    

    return(
        <div className="flex flex-col max-h-screen min-w-screen">
            <Header/>
            <main className="mt-32 md:mt-2 bg-white px-2 pt-1 h-full w-full flex flex-col justify-center items-center">
                <div class="mt-20 flex flex-col md:w-2/4 justify-center items-center">
                    <p class="mx-auto text-center text-xl md:text-xl font-light mb-2">As of now, we're still in MVP mode. <br/> But much, much more is yet to come.<br/> In the meantime, please enjoy our finest selection of Kangaroo GIFs.<br/>- Summaroo Team ❤️<br/> <a class="text-sm underline text-blue-base" href="/summarize">P.S. if you were looking for the summarization page, you can find it here</a></p>
                    <img class="w-8/10 h-8/10" src={gifLink} alt="gif" />
                    <button onClick={random} class="w-full mt-6 h-30 inline-flex justify-center items-center bg-blue-base bg-opacity-90 border-blue-base border-opacity-80 hover:bg-blue-base h-16 border rounded-lg animate-none text-lg text-white font-bold">Generate Kangaroo Happiness</button>
                    <button onClick={random} class="w-full h-8 mt-2 inline-flex justify-center items-center bg-neutral-400 bg-opacity-90 hover:bg-neutral-600 border rounded-lg animate-none">
                        <a href="/" class="inline-block my-4 mx-2 align-center text-black text-lg rounded hover:no-underline">
                            Back to work... 😔
                        </a>
                    </button>

                </div>
            </main>
            <Footer/>
        </div>
    )
}