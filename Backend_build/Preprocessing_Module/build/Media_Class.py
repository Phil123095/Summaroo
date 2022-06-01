import time
from youtube_transcript_api import YouTubeTranscriptApi
from urllib.parse import urlparse
from urllib.parse import parse_qs
import urllib.request as urlq
import io
from pdfminer.high_level import extract_pages
from pdfminer.layout import LTTextContainer


class Media:
    def __init__(self, media, perc_reduction, format=None):
        self.request_time = time.time()
        print(media)
        self.raw_media = media
        self.raw_text = None
        self.reduction_perc = perc_reduction

        if format:
            self.media_format = format
        else:
            self.media_format = self.__determine_format()

        # Clean text in separate function call
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
        self.time_to_preprocess = None
        self.time_to_summarise = None

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
        for page_layout in extract_pages(self.pdf_getter(url=self.raw_media), caching=True):
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


    def clean_text(self):
        """
        Once media is transformed to text, this should be run to clean & prep the text for final summarization.
        :return:
        """
        pass

    def info_to_DB(self):
        """
        Once all steps are done, write the metadata for the media object to the database for performance & tracking.
        :return:
        """

