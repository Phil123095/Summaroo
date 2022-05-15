import time


class Media:
    def __init__(self, media, perc_reduction, format=None):
        self.request_time = time.time()
        self.raw_media = media
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
        pass

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
