import pandas as pd
import json
import os
from DB_connector import get_db_connections


def processSummaryLog(data_in, connection):
    general_data = data_in['general_data']
    text_data = data_in['text_information']

    general_df = pd.DataFrame([general_data])
    text_df = pd.DataFrame([text_data])

    general_df.to_sql('summary_request_reporting', connection, if_exists='append', index=False)
    text_df.to_sql('text_content', connection, if_exists='append', index=False)

    return


def lambda_handler(event, context):
    if os.environ.get("AWS_EXECUTION_ENV") is None:
        local = True
    else:
        local = False

    try:
        message = json.loads(event['body'])
    except KeyError:
        message = event

    action = message['action']
    data = message['data']

    db_connection = get_db_connections(local=local)

    if action == 'SummaryRequestLog':
        processSummaryLog(data_in=data, connection=db_connection)
    elif action == 'SummaryRatingLog':
        pass