from Backend_build.Preprocessing_Module.build.preprocessing_handler import lambda_handler as preprocessing_lambda_local
from Backend_build.Summarization_Models.LexRank_v_1.summarizer import lambda_handler as summarization_lambda_local


def testing_helper(format, media_input, local_testing_preprocessing, summary_test_only=False, percent_length=None, sentence_count_out=None):
    """
    :param format: str --> either 'text', 'youtube', 'pdf'
    :param media_input: --> either raw text, youtube link, or pdf. MUST BE RAW TEXT FOR DIRECT SUMMARIZATION
    :param summary_test_only: --> Boolean. Default FALSE. if FALSE, then will the input through the preprocessor first.
    :param local_testing_preprocessing: Boolean. If True, summarization will be run locally. If false, summarization will be requested to MS.
    :param percent_length: Integer. Default is NONE. Used when working with preprocessing module
    :param sentence_count_out: Default is NONE. Used when working with the summarization module directly.
    :return: sumarized text
    """

    if not summary_test_only:
        """
        Event format to pass to the preprocessing lambda function (preprocessing_handler file). 
        You need to pass the format, full text, percentage length (integer) and local testing flag. 
        If local_testing == TRUE, then the preprocessing handler will run summarization locally.
        """
        event = {
            'body': {
                'format': format,
                'full_text': media_input,
                'perc_length': percent_length,
                'local_testing': local_testing_preprocessing
            },
            'headers': {'origin': "localhost"}
        }
        summary_full_process = preprocessing_lambda_local(event=event, context=None)
        return summary_full_process

    elif summary_test_only:
        if not isinstance(media_input, str):
            raise "Direct summarization testing only works with raw text. Please change the media_input to raw text."

        """
        Event format to pass to the summarization lambda function (summarizer.py file). 
        You need to pass the full (clean) text, and output summary length in NUMBER OF SENTENCES. 
        """

        event_direct_summary = {
            'body': {
                'full_text_clean': media_input,
                'final_sentences_out': sentence_count_out
            },
            'headers': {'origin': "localhost"}
        }

        summary_summ_only = summarization_lambda_local(event=event_direct_summary, context=None)

        return summary_summ_only


if __name__ == '__main__':
    full_text = """The board decided that the company needed to quicken its digital pace.

    Today’s challenge is different.

    For many transactions, consumers and businesses increasingly prefer digital channels, which make content universally accessible by mixing media (graphics and video, for example), tailoring messages for context (providing location or demographic information), and adding social connectivity (allowing communities to build around themes and needs, as well as ideas shared among friends).

    • Improving management decisions as algorithms crunch big data from social technologies or the Internet of Things.

    • Enabling new business or operating models, such as peertopeer product innovation or customer service.

    3ExhibitHow digitization transforms industriesThe position of an industry on this curve depends on the degree to which companies and customers within it have embraced digitization.

    New normal: Advanced incumbents, established startups Tipping pointLaggard incumbents drop offMainstream customers adoptAdvanced incumbents begin to adaptEarly adopters embrace the new modelsNew trends emergeInnovative startups create disruptive business modelsTimeThe upshot is that digitization will change industry landscapes as it gives life to new sets of competitors.

    Some players may consider your capabilities a threat even before you have identified them as competitors.

    New competitors can often be smaller companies that will never reach scale but still do a lot of damage to incumbents.

    In our experience, banking, insurance, media, telecommunications, and travel are particularly vulnerable to these winnertakesall market dynamics.

    In France, for instance, the startup Free has begun offering mobile service supported by a large and active digital community of “brand fans” and advocates.

    For many businesses, it may not pay to build out those functions at competitive levels of performance, so they simply plug an existing offering into their value chains.

    At the same time, companies are struggling to find the right talent in areas that can’t be automated.

    Apps that allow consumers to purchase virtual goods and digital services on mobile devices have become a significant industry.

    One global bank has aligned its offerings with the borderless strategies of its major customers by creating a single website, across 20 countries, that integrates what had been an array of separate national or product touch points.

    Incumbents too have opportunities for launching disruptive strategies.

    Inhouse data on existing buyers can help incumbents with large customer bases develop insights (for example, in pricing and channel management) that are keener than those of small attackers.

    Decision 3: Cooperate or compete with new attackers? Decision 4: Diversify or double down on digital initiatives? Integrating digital operations directly into physical businesses can create additional value—for example, by providing multichannel capabilities for customers or by helping companies share infrastructure, such as supplychain networks.

    Decision 6: Delegate or own the digital agenda? Regardless of the organizational or leadership model a CEO and board choose, it’s important to keep in mind that digitization is a moving target."""
    test_summary_out = testing_helper(format='youtube',
                                      media_input='https://www.youtube.com/watch?v=IhmO9_3DlSA!',
                                      local_testing_preprocessing=True,
                                      summary_test_only=False,
                                      percent_length=0.1,
                                      sentence_count_out=None)

    print(test_summary_out)
