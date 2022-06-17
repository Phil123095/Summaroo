import { useEffect } from 'react';
import HeroHomeTrial from './partials/HeroHome2';
import FeaturesHome from './partials/Features';
import Newsletter from './partials/Newsletter';
import Footer from '../general/Footer';
import Cookies from 'universal-cookie';
import { useTracking } from 'react-tracking';
import { actionCreator } from '../../utils/general_utils';
import Header from '../general/Header';

function Home() {
  const cookies = new Cookies();
  const session_identifier = cookies.get('session_identifier');
  const persistent_user_identifier = cookies.get('persistent_user_identifier');
  const {trackEvent} = useTracking()

  useEffect(() => {

      trackEvent(actionCreator('page_view', 'test_home_page'));

  }, [persistent_user_identifier, session_identifier, trackEvent])

  return (
    <div className="flex flex-col min-h-screen min-w-screen overflow-hidden">
      <Header/>
      {/*  Page content */}
      <main className="flex-grow">

        {/*  Page sections */}
        <HeroHomeTrial />
        <FeaturesHome />
        <Newsletter />

      </main>

      {/*  Site footer */}
      <Footer />

    </div>
  );
}

export default Home;