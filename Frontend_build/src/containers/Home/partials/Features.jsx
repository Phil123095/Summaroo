import React, { useState, useRef, useEffect } from 'react';
import Transition from '../../../utils/Transition';
import FeatureIllustration1 from '../../../assets/illu1.png'
import FeatureIllustration2 from '../../../assets/illu2.png'
import FeatureIllustration3 from '../../../assets/illu3.png'

import FeaturesBg from '../../../assets/SummarooPic.png';

function Features() {

  const [tab, setTab] = useState(1);

  const tabs = useRef(null);

  const heightFix = () => {
    if (tabs.current.children[tab]) {
      tabs.current.style.height = tabs.current.children[tab - 1].offsetHeight + 'px'
    }
  }

  useEffect(() => {
    heightFix()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  return (
    <section className="relative">

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="pt-8 md:pt-16">

          {/* Section header */}
          <div className="max-w-5xl mx-auto text-center pb-6 md:pb-8" data-aos="fade-right">
            <p className="mb-4 text-4xl font-extrabold text-gray-900">How does it work?</p>
          </div>

          {/* Section content */}
          <div className="md:grid md:grid-cols-12 md:gap-6p pt-8">

            {/* Content */}
            <div className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-7 lg:col-span-6 md:mt-6" data-aos="fade-right">
              <div className="md:pr-4 lg:pr-12 xl:pr-16 mb-8">
                <p className="h3 mb-3 text-4xl text-gray-900">It's as easy as...</p>
              </div>
              {/* Tabs buttons */}
              <div className="mb-8 md:mb-0">
                <a
                  className={`flex w-full items-center text-lg p-5 rounded border transition duration-300 ease-in-out mb-3 ${tab !== 1 ? 'bg-white shadow-md border-blue-100 hover:shadow-lg' : 'bg-blue-100 border-transparent shadow-md'}`}
                  href="#0"
                  onClick={(e) => { e.preventDefault(); setTab(1); }}
                >
                  <div>
                    <div className="font-bold leading-snug tracking-tight mb-1">Select the Format.</div>
                    <div className="text-gray-600">Text, Youtube, PDFs - we can handle them all.</div>
                  </div>
                </a>
                <a
                  className={`flex items-center text-lg p-5 rounded border transition duration-300 ease-in-out mb-3 ${tab !== 2 ? 'bg-white shadow-md border-blue-100 hover:shadow-lg' : 'bg-blue-100 border-transparent shadow-md'}`}
                  href="#0"
                  onClick={(e) => { e.preventDefault(); setTab(2); }}
                >
                  <div>
                    <div className="font-bold leading-snug tracking-tight mb-1">Add your Content</div>
                    <div className="text-gray-600">Copy in text, drop in a youtube link, or upload a PDF. Easy.</div>
                  </div>

                </a>
                <a
                  className={`flex items-center text-lg p-5 rounded border transition duration-300 ease-in-out mb-3 ${tab !== 3 ? 'bg-white shadow-md border-blue-100 hover:shadow-lg' : 'bg-blue-100 border-transparent shadow-md'}`}
                  href="#0"
                  onClick={(e) => { e.preventDefault(); setTab(3); }}
                >
                  <div>
                    <div className="font-bold leading-snug tracking-tight mb-1">Hit Summarize!</div>
                    <div className="text-gray-600">And sit back and watch the magic unfold.</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Tabs items */}
            <div className="invisible mb-10 md:visible h-0 md:h-full md:max-w-none md:w-full mx-auto md:col-span-5 lg:col-span-6 mb-8 md:mb-0 md:order-1" data-aos="zoom-y-out" ref={tabs}>
              <div className="relative flex flex-col text-center lg:text-right">
                {/* Item 1 */}
                <Transition
                  show={tab === 1}
                  appear={true}
                  className="w-full"
                  enter="transition ease-in-out duration-700 transform order-first"
                  enterStart="opacity-0 translate-y-16"
                  enterEnd="opacity-100 translate-y-0"
                  leave="transition ease-in-out duration-300 transform absolute"
                  leaveStart="opacity-100 translate-y-0"
                  leaveEnd="opacity-0 -translate-y-16"
                >
                  <div className="relative h-full flex-col -translate-y-6">
                    <img className="md:max-w-none mx-auto rounded" src={FeatureIllustration1} width="425" height="392" alt="Features bg" />
                  </div>
                </Transition>
                {/* Item 2 */}
                <Transition
                  show={tab === 2}
                  appear={true}
                  className="w-full"
                  enter="transition ease-in-out duration-700 transform order-first"
                  enterStart="opacity-0 translate-y-16"
                  enterEnd="opacity-100 translate-y-0"
                  leave="transition ease-in-out duration-300 transform absolute"
                  leaveStart="opacity-100 translate-y-0"
                  leaveEnd="opacity-0 -translate-y-16"
                >
                  <div className="relative inline-flex flex-col translate-y-10">
                    <img className="md:max-w-none mx-auto rounded" src={FeatureIllustration2} width="550" height="508.2" alt="Features bg" />
                  </div>
                </Transition>
                {/* Item 3 */}
                <Transition
                  show={tab === 3}
                  appear={true}
                  className="w-full"
                  enter="transition ease-in-out duration-700 transform order-first"
                  enterStart="opacity-0 translate-y-16"
                  enterEnd="opacity-100 translate-y-0"
                  leave="transition ease-in-out duration-300 transform absolute"
                  leaveStart="opacity-100 translate-y-0"
                  leaveEnd="opacity-0 -translate-y-16"
                >
                  <div className="relative inline-flex flex-col">
                    <img className="md:max-w-none mx-auto rounded" src={FeatureIllustration3} width="500" height="462" alt="Features bg" />
                  </div>
                </Transition>
              </div>
            </div >

          </div >

        </div >
      </div >
    </section >
  );
}

export default Features;
