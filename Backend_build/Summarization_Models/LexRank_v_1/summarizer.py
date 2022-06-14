from sumy.summarizers.lex_rank import LexRankSummarizer
from sumy.nlp.tokenizers import Tokenizer
import nltk
from sumy.parsers.plaintext import PlaintextParser
import json
nltk.data.path.append("/var/task/nltk_data")


def summarization(full_text_clean, final_sentence_count):

    parser = PlaintextParser.from_string(full_text_clean, Tokenizer('english'))
    # Summarise
    Lex = LexRankSummarizer()
    Lex_summary = Lex(document=parser.document, sentences_count=round(final_sentence_count))

    final_summary = '  '.join(str(v) for v in Lex_summary)

    return final_summary


def lambda_handler(event, context):
    try:
        try:
            message = json.loads(event['body'])
        except json.decoder.JSONDecodeError:
            message = json.loads(event['body'].decode('utf-8'))
    except TypeError:
        message = event['body']

    print(message)
    text_to_summarise = message['full_text_clean']
    final_sentence_count = message['final_sentences_out']

    result_summary = summarization(full_text_clean=text_to_summarise,
                                   final_sentence_count=final_sentence_count)

    return {'final_summary': result_summary}


