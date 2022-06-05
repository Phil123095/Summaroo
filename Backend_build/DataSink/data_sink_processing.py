import pandas as pd
import json
import os
from DB_connector import get_db_connections
import datetime


def processSummaryLog(data_in, connection):
    print("Summary Logging Started")
    general_data = data_in['general_data']
    text_data = data_in['text_information']

    general_df = pd.DataFrame([general_data])
    text_df = pd.DataFrame([text_data])

    general_df.to_sql('summary_request_reporting', connection, if_exists='append', index=False)
    text_df.to_sql('text_content', connection, if_exists='append', index=False)
    print(f"Summary Logging for {data_in['hash_ID']} done")

    return

def updateRatingLog(data_in, connection):
    print("Summary Rating Started")
    summary_ID = data_in['summaryID']
    rating = data_in['rating']

    sql_update = f"UPDATE summaroo_data.summary_request_reporting SET user_rating={rating} WHERE hash_ID='{summary_ID}'"
    with connection.connect() as cur:
        cur.execute(sql_update)

    print(f"Summary Rating for {data_in['summaryID']} done")

    return

def addEmailBeta(email, connection):
    print("Email Beta Register Started")
    now = datetime.datetime.now()
    data_to_add = {'registration_timestamp': datetime.datetime.strftime(now, "%Y-%m-%d %H:%M:%S.%f"), 'email': email}
    email_df = pd.DataFrame([data_to_add])
    email_df.to_sql('beta_registration', connection, if_exists='append', index=False)
    print(f"Email Beta Register for {email} done.")
    return


def lambda_handler(event, context):
    if os.environ.get("AWS_EXECUTION_ENV") is None:
        local = True
    else:
        local = False

    for message_queue in event['Records']:
        try:
            message = json.loads(message_queue['body'])
        except KeyError:
            message = event

        action = message['action']
        data = message['data']

        db_connection = get_db_connections(local=local)

        if action == 'SummaryRequestLog':
            processSummaryLog(data_in=data, connection=db_connection)
        elif action == 'SummaryRatingLog':
            updateRatingLog(data_in=data, connection=db_connection)
        elif action == 'EmailRegister':
            addEmailBeta(email=data['email'], connection=db_connection)

    return