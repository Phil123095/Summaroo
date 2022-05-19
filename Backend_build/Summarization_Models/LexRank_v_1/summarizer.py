from sumy.summarizers.lex_rank import LexRankSummarizer
from nltk import sent_tokenize

from sumy.nlp.tokenizers import Tokenizer
import nltk
from nltk import sent_tokenize
nltk.data.path.append("/var/task/nltk_data")
from sumy.parsers.plaintext import PlaintextParser
import json


def sentence_cleaner(sentence):
    sentence = sentence.replace("\n", "")
    sentence2 = " ".join(sentence.split())
    sentence3 = sentence2.replace("-", "")
    return sentence3

def text_cleaner(full_text):
    """
    :param full_text: Full text to clean
    :return: Parsed & Cleaned text.
    """
    #clean_text = full_text.split(".")
    clean_text = sent_tokenize(full_text)
    fully_cleaned_text = [sentence_cleaner(sentence) for sentence in clean_text]
    #fully_cleaned_text2 = [" ".join(sent.split()) for sent in fully_cleaned_text]
    #print(sentences[0])
    #print(clean_text[0])

    return fully_cleaned_text


def summarization(full_text, reduce_length):
    clean_text = text_cleaner(full_text)
    full_text_length = len(clean_text)

    print(clean_text)

    summary_perc = int(reduce_length)/100

    final_sentence_count = full_text_length * summary_perc

    #rawList = [item for item in full_text.splitlines() if item.strip()]

    rawList_str = ' '.join(clean_text)
    #print(rawList_str)
    parser = PlaintextParser.from_string(rawList_str, Tokenizer('english'))
    # Summarise
    Lex = LexRankSummarizer()
    Lex_summary = Lex(document=parser.document, sentences_count=round(final_sentence_count))

    final_summary = '  '.join(str(v) for v in Lex_summary)

    return final_summary


def lambda_handler(event, context):
    event = event.decode('utf-8')
    try:
        message = json.loads(event['body'])
    except json.decoder.JSONDecodeError:
        message = json.loads(event['body'].decode('utf-8'))

    print(message)

    text_to_summarise = message['full_text']
    percent_reduce = message['perc_length']

    result_summary = summarization(full_text=text_to_summarise, reduce_length=percent_reduce)

    return {'final_summary': result_summary}


