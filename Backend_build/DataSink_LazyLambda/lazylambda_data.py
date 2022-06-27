import dotenv
import os
import json
import boto3


def send_message(message, local):
    if local:
        dotenv.load_dotenv()

    aws_sqs_key = os.environ['AWS_SQS_KEY']
    aws_sqs_secret = os.environ['AWS_SQS_SECRET']
    aws_sqs_url = os.environ['AWS_SQS_URL']

    sqs_client = boto3.client("sqs", aws_access_key_id=aws_sqs_key,
                              aws_secret_access_key=aws_sqs_secret,
                              region_name="eu-central-1")
    sqs_queue_url = aws_sqs_url

    response = sqs_client.send_message(
        QueueUrl=sqs_queue_url,
        MessageBody=json.dumps(message),
        MessageGroupId='trial'
    )

    if response:
        print("Submitted to SQS")
    else:
        print("Error")
    return


def check_inputs(message):
    try:
        test1, test2, test3 = message['session_id'], message['action_id'], message['persistent_user_id']
        return True
    except KeyError:
        try:
            action = message['action']
            if action in ['SummaryRatingLog', 'UserTracking', 'EmailRegister']:
                return True
            else:
                return False
        except KeyError:
            return False


def lambda_handler(event, context):
    if os.environ.get("AWS_EXECUTION_ENV") is None:
        local = True
    else:
        local = False

    try:
        message = json.loads(event['body'])
    except TypeError:
        message = event['body']

    if check_inputs(message=message):
        send_message(message=message, local=local)
        return
    else:
        return {"response": "Please stop tampering with our solution. Be nice. Nice people are cool."}

