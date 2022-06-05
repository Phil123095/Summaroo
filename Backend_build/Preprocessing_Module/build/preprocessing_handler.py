import json
from Media_Class import Media
import requests
import datetime


def recommend_model(media_content, force_model):
    """
    Just a base skeleton of what the model recommendation function would look like. So everything below is an idea,
    not a final build.
    :param media_content:
    :return:
    """

    models = {"LexRank": "https://bq5g5pjjc6fbzptimanr6v2gqu0tyydw.lambda-url.eu-central-1.on.aws/"}

    if not force_model:
        if media_content.media_format == "text" or media_content.media_format == "pdf":
            model_to_use = "LexRank"
            model_api_url = models[model_to_use]

            decision_factor = "Filtering"
            return decision_factor, model_to_use, model_api_url

        elif media_content.media_format == "youtube":
            model_to_use = "LexRank"
            model_api_url = models[model_to_use]

            decision_factor = "Filtering"
            return decision_factor, model_to_use, model_api_url
    else:
        model_to_use = force_model
        model_api_url = models[force_model]
        decision_factor = "Forced Model"
        return decision_factor, model_to_use, model_api_url


def request_summarization(media_content, url_to_request):
    response = requests.post(url_to_request, json={
                                                "full_text_clean": media_content.final_clean_text,
                                                "final_sentences_out": media_content.final_sentence_count_out
                                            })

    content = json.loads(response.content.decode('utf-8'))

    return content


def lambda_handler(event, context):
    incoming_request_TS = datetime.datetime.now()
    print(event)
    message = json.loads(event['body'])
    origin = json.loads(event['origin'])

    if "summarooapp.com" in origin:
        source = "live-webapp"
    elif "localhost" in origin:
        source = "webapp-testing"
    else:
        source = "api-request"

    try:
        content_format = message['format']
        force_model = message['force_model']
    except KeyError:
        content_format = None
        force_model = None

    content_to_summarise = message['full_text']

    percent_reduce = message['perc_length']

    WorkingContent = Media(media=content_to_summarise, perc_reduction=percent_reduce, source=source, format=content_format)
    WorkingContent.convert_and_clean_media()

    decision_reason, model_recommendation, model_endpoint = recommend_model(media_content=WorkingContent,
                                                                            force_model=force_model)

    WorkingContent.model_decision_factor = decision_reason
    WorkingContent.model_to_use = model_recommendation

    summarization_request_TS = datetime.datetime.now()

    final_summary_out = request_summarization(media_content=WorkingContent, url_to_request=model_endpoint)
    summarization_response_TS = datetime.datetime.now()

    WorkingContent.final_summary = final_summary_out['final_summary']

    final_response_TS = datetime.datetime.now()
    WorkingContent.record_times(start=incoming_request_TS, summary_request=summarization_request_TS,
                                summary_response=summarization_response_TS, final_response=final_response_TS)

    final_summary_out['request_id'] = WorkingContent.create_unique_ID()

    WorkingContent.info_to_DB()

    return final_summary_out
