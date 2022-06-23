import pandas as pd
import json
import os
from DB_connector import get_db_connections
import sqlalchemy as sa
import time
import datetime
import uuid
from email_processor import Mail


def processSummaryLog(data_in, connection):
    print("Summary Logging Started")
    general_data = data_in['general_data']
    text_data = data_in['text_information']

    general_df = pd.DataFrame([general_data])
    text_df = pd.DataFrame([text_data])

    try:
        general_df.to_sql('summary_request_reporting', connection, if_exists='append', index=False)
        text_df.to_sql('text_content', connection, if_exists='append', index=False)
        print(f"Summary Logging for {general_data['hash_ID']} done")
    except Exception as err:
        if "mysql.connector.errors.IntegrityError" in str(err):
            print("Duplicate Issue")
            return
        else:
            return

    return

def updateRatingLog(data_in, connection):
    time.sleep(3)
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

    print(f"Summary Rating for {data_in['summaryID']} done")

    # We need to use string formatting to set the table; SQLAlchemy will automatically qualify it with the schema name.
    stmt = f'UPDATE summary_request_reporting SET user_rating=:user_rating WHERE summary_request_reporting.hash_ID  = :summary_ID'

    values = {
        'user_rating': rating,
        'summary_ID': summary_ID
    }

    with connection.begin() as conn:
        conn.execute(sa.text(stmt), values)

    return


def addEmailBeta(data, connection):
    print("Email Beta Register Started")

    try:
        session_id = data['session_id']
    except KeyError:
        session_id = None

    print(data)

    now = datetime.datetime.now()
    data_to_add = {'registration_timestamp': datetime.datetime.strftime(now, "%Y-%m-%d %H:%M:%S.%f"),
                   'persistent_user_id': data['persistent_user_id'], 'session_id': session_id, 'email': data['email']}
    email_df = pd.DataFrame([data_to_add])

    try:
        email_df.to_sql('beta_registration', connection, if_exists='append', index=False)
        mail = Mail()
        mail.send_signup(data['email'])
        print(f"Email Beta Register for {data['email']} done.")

    except Exception as err:
        if "mysql.connector.errors.IntegrityError" in str(err):
            print("User already exists in DB")
            return
        else:
            return

    return


def sendContactEmail(data):
    print("Sending Contact Form Email")
    mail = Mail()
    try:
        mail.send_contact_form(first_name=data['first_name'], last_name=data['last_name'],
                                contact_email=data['email'], full_message=data['message'])
    except Exception as e:
        print("CONTACT EMAIL FAILED")
        print(e)
        return


def userTracking(data, connection):
    print(data)
    try:
        data.pop('app')
    except KeyError:
        pass

    try:
        action = data['action_id']
    except KeyError:
        data['action_id'] = str(uuid.uuid4())

    try:
        host = data['host_type']
    except KeyError:
        data['host_type'] = None

    time_format = pd.to_datetime(int(data['timestamp']), utc=True, unit='ms')

    data['timestamp'] = datetime.datetime.strftime(time_format, "%Y-%m-%d %H:%M:%S.%f")

    user_activity = pd.DataFrame([data])
    try:
        user_activity.to_sql('user_activity_final', connection, if_exists='append', index=False)
    except Exception as err:
        if "mysql.connector.errors.IntegrityError" in str(err):
            print("Duplicate Issue")
            return


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
        elif action == 'EmailContactForm':
            sendContactEmail(data=data)

    return
