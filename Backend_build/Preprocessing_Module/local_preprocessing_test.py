import json
from Media_Class import Media
import requests


def recommend_model(media_content):
    """
    Just a base skeleton of what the model recommendation function would look like. So everything below is an idea,
    not a final build.
    :param media_content:
    :return:
    """

    models = {"LexRank": "https://bq5g5pjjc6fbzptimanr6v2gqu0tyydw.lambda-url.eu-central-1.on.aws/"}

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


def request_summarization(media_content, url_to_request):

    response = requests.post(url_to_request, json={"full_text": media_content.raw_text,
                                                 "perc_length": media_content.reduction_perc})

    print(response)
    content = json.loads(response.content.decode('utf-8'))

    return content


if __name__ == "__main__":
    media_to_summarise = "testing/PDF_conversion/Are you Solving right problem?.pdf"
    percent_reduce = 5
    format = "pdf"

    WorkingContent = Media(media=media_to_summarise, perc_reduction=percent_reduce, format=format)
    WorkingContent.convert_and_clean_media()

    decision_reason, model_recommendation, model_endpoint = recommend_model(media_content=WorkingContent)

    WorkingContent.model_decision_factor = decision_reason
    WorkingContent.model_to_use = model_recommendation

    final_summary_out = request_summarization(media_content=WorkingContent, url_to_request=model_endpoint)

    WorkingContent.final_summary = final_summary_out['final_summary']
    WorkingContent.info_to_DB()

    print("-------------------------------------- FINAL SUMMARY ----------------------------------------")
    print(final_summary_out)


