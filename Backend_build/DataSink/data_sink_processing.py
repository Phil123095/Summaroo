import pandas as pd
import json
import os
from DB_connector import get_db_connections
from sqlalchemy import text
import datetime
import uuid


def processSummaryLog(data_in, connection):
    print("Summary Logging Started")
    general_data = data_in['general_data']
    text_data = data_in['text_information']

    general_df = pd.DataFrame([general_data])
    text_df = pd.DataFrame([text_data])

    general_df.to_sql('summary_request_reporting', connection, if_exists='append', index=False)
    text_df.to_sql('text_content', connection, if_exists='append', index=False)
    print(f"Summary Logging for {general_data['hash_ID']} done")

    return

def updateRatingLog(data_in, connection):
    """data_trial = {'hash_ID': data_in['summaryID'], 'user_rating': data_in['rating']}
    general_df = pd.DataFrame([data_trial])


    general_df = general_df.set_index(['hash_ID'])
    upsert(con=connection,
           df=general_df,
           table_name='summar',
           if_row_exists='update')"""
    print("Summary Rating Started")
    summary_ID = data_in['summaryID']
    rating = data_in['rating']

    sql_update = f"UPDATE summary_request_reporting SET user_rating={rating} WHERE hash_ID='{summary_ID}'"

    print(sql_update)
    connection.execute(text(sql_update))

    print(f"Summary Rating for {data_in['summaryID']} done")

    return


def addEmailBeta(data, connection):
    print("Email Beta Register Started")
    now = datetime.datetime.now()
    data_to_add = {'registration_timestamp': datetime.datetime.strftime(now, "%Y-%m-%d %H:%M:%S.%f"),
                   'persistent_user_id': data['persistent_user_id'], 'session_id': data['session_id'], 'email': data['email']}
    email_df = pd.DataFrame([data_to_add])
    email_df.to_sql('beta_registration', connection, if_exists='append', index=False)
    print(f"Email Beta Register for {data['email']} done.")
    return


def userTracking(data, connection):
    print(data)
    data.pop('app')

    try:
        action = data['action_id']
    except KeyError:
        data['action_id'] = uuid.uuid4()

    time_format = pd.to_datetime(int(data['timestamp']), utc=True, unit='ms')

    data['timestamp'] = datetime.datetime.strftime(time_format, "%Y-%m-%d %H:%M:%S.%f")

    user_activity = pd.DataFrame([data])
    user_activity.to_sql('user_activity', connection, if_exists='append', index=False)

    print(f"Summary Logging for user_tracking done")

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
            addEmailBeta(data=data, connection=db_connection)
        elif action == 'UserTracking':
            userTracking(data=data, connection=db_connection)

    return