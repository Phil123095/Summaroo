from youtube_transcript_api import YouTubeTranscriptApi
import nltk
from nltk import sent_tokenize
import hashlib
from urllib.parse import urlparse
from urllib.parse import parse_qs
import urllib.request as urlq
import io
from pdfminer.high_level import extract_pages
from pdfminer.layout import LTTextContainer
nltk.data.path.append("/var/task/nltk_data")


class Media:
    def __init__(self, media, perc_reduction, source, format=None):
        print(media)
        self.request_source = source
        self.request_ID = None
        self.raw_media = media
        self.raw_text = None
        self.reduction_perc = float(perc_reduction)/100

        if format:
            self.media_format = format
        else:
            self.media_format = self.__determine_format()

        # Clean text in separate function call
        self.final_text_sentence_count = None
        self.final_sentence_count_out = None
        self.final_clean_text = None

        # Assigned by model router module (i.e. based on media attributes, will determine best summarization model).
        # Decision factor just highlights whether the model was randomly attributed, or not.
        self.model_decision_factor = None
        self.model_to_use = None

        # Summary model outputs that are reassigned to media class once the summarization is done
        self.final_summary = None
        # Model params should be in JSON format.
        self.model_params = None

        # General reporting info, assigned at end of processing.
        self.incoming_request_time = None
        self.summary_request_time = None
        self.summary_response_time = None
        self.final_response_time = None
        self.time_to_preprocess = None
        self.time_to_summarise = None
        self.total_time_to_process = None

    def __determine_format(self):

        """
        In case the request does not include the media format, this should determine what format the media is in.
        E.g. .mp4 -> Video, str -> str, etc.
        :return:
        """
        pass

    def convert_and_clean_media(self):
        """
        Based on format, run different steps to convert the media (E.g. PDF to text conversion, youtube to text, etc.)
        :return:
        """
        if self.media_format == "text":
            self.__basic_text_handle()
        elif self.media_format == "youtube":
            self.__extract_YT_transcript()
        elif self.media_format == "pdf":
            self.__extract_PDF_text()

        self.__clean_text()
        return

    def __basic_text_handle(self):
        self.raw_text = self.raw_media
        return


    def __get_vid_id(self):

        query = urlparse(self.raw_media)
        if query.hostname == 'youtu.be':
            return query.path[1:]
        if query.hostname in ('www.youtube.com', 'youtube.com'):
            if query.path == '/watch':
                p = parse_qs(query.query)
                return p['v'][0]
            if query.path[:7] == '/embed/':
                return query.path.split('/')[2]
            if query.path[:3] == '/v/':
                return query.path.split('/')[2]
        # fail?
        return None

    def __extract_YT_transcript(self):
        # assigning srt variable with the list
        # of dictonaries obtained by the get_transcript() function
        video_ID = self.__get_vid_id()

        try:
            srt = YouTubeTranscriptApi.get_transcript(video_ID)
        except Exception:
            try:
                srt = YouTubeTranscriptApi.get_transcript(video_ID, languages=['en-GB'])
            except Exception:
                srt = YouTubeTranscriptApi.get_transcript(video_ID, languages=['en'])

        full_text = ''
        for text_item in srt:
            text = text_item['text']
            text_final = text + ' '
            full_text = full_text + text_final

        self.raw_text = full_text

        # prints the result

    def __extract_PDF_text(self):
        final_string = ''
        url_to_use = self.raw_media
        for page_layout in extract_pages(self.pdf_getter(url=url_to_use), caching=True):
            for element in page_layout:
                if isinstance(element, LTTextContainer):
                    final_string += element.get_text()

        self.raw_text = final_string

    def pdf_getter(self, url: str):
        '''
        retrives pdf from url as bytes object
        '''
        open = urlq.urlopen(url).read()
        return io.BytesIO(open)

    def __sentence_cleaner(self, sentence):
        sentence = sentence.replace("\n", "")
        sentence2 = " ".join(sentence.split())
        sentence3 = sentence2.replace("-", "")
        return sentence3

    def __clean_text(self):
        """
        Once media is transformed to text, this should be run to clean & prep the text for final summarization.
        :param full_text: Full text to clean
        :return:
        """
        clean_text = sent_tokenize(self.raw_text)
        fully_cleaned_text = [self.__sentence_cleaner(sentence) for sentence in clean_text]
        self.final_text_sentence_count = len(fully_cleaned_text)
        self.final_sentence_count_out = self.final_text_sentence_count * self.reduction_perc
        self.final_clean_text = ' '.join(clean_text)

        return

    def record_times(self, start, summary_request, summary_response, final_response):

        self.incoming_request_time = start
        self.summary_request_time = summary_request
        self.summary_response_time = summary_response
        self.final_response_time = final_response

        self.time_to_preprocess = summary_request - start
        self.time_to_summarise = summary_response - summary_request
        self.total_time_to_process = final_response - start
        return

    def create_unique_ID(self):
        combined_str = str(self.media_format) + str(self.reduction_perc) + str(self.incoming_request_time) + str(
            self.summary_response_time)

        self.request_ID = hashlib.sha1(combined_str.encode('utf-8')).hexdigest()
        return self.request_ID


    def info_to_DB(self):
        """
        Once all steps are done, write the metadata for the media object to the database for performance & tracking.
        :return:
        """

        DB_request_data = {
            'action': 'SummaryRequestLog',
            'data': {
                'hash_ID': self.request_ID,
                'request_source': self.request_source,
                'format': self.media_format,
                'percent_reduce': self.reduction_perc,
                'model': self.model_to_use,
                'full_text_length_sentences': self.final_text_sentence_count,
                # 'full_text_length_words': None,
                # 'full_text_length_characters': None,
                'full_text_raw': self.raw_text,
                'full_text_processed': self.final_clean_text,
                'final_summary': self.final_summary,
                'final_summary_length': self.final_sentence_count_out,
                'incoming_request_TS': self.incoming_request_time,
                'summary_request_TS': self.summary_request_time,
                'summary_module_response_TS': self.summary_response_time,
                'final_response_TS': self.final_response_time,
                'total_time_elapsed': self.total_time_to_process,
                'time_to_preprocess': self.time_to_preprocess,
                'time_to_summarize': self.time_to_summarise,
                'user_rating': None
            }
        }
        pass



