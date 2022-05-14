from sumy.summarizers.lex_rank import LexRankSummarizer
from sumy.nlp.tokenizers import Tokenizer
import nltk
from sumy.parsers.plaintext import PlaintextParser
import json


def text_cleaner(full_text):
    """
    :param full_text: Full text to clean
    :return: Parsed & Cleaned text.
    """
    clean_text = full_text.split(".")

    return clean_text


def summarization(full_text, reduce_length):
    clean_text = text_cleaner(full_text)
    full_text_length = len(clean_text)

    summary_perc = int(reduce_length)/100

    final_sentence_count = full_text_length * summary_perc

    rawList = [item for item in full_text.splitlines() if item.strip()]

    rawList_str = ' '.join(rawList)
    parser = PlaintextParser.from_string(rawList_str, Tokenizer('english'))
    # Summarise
    Lex = LexRankSummarizer()
    Lex_summary = Lex(document=parser.document, sentences_count=round(final_sentence_count))

    final_summary = ' '.join(str(v) for v in Lex_summary)

    return final_summary


def lambda_handler(event, context):
    message = json.loads(event['body'])
    text_to_summarise = message['full_text']
    percent_reduce = message['perc_length']

    result_summary = summarization(full_text=text_to_summarise, reduce_length=percent_reduce)

    return {'final_summary': result_summary}
