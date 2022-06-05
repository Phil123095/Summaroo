import dotenv
import os
import json
import boto3


def send_message(message, local):
    if local:
        dotenv.load_dotenv()

    if message['action'] == 'SummaryRatingLog':
        message_delay = 20
    else:
        message_delay = 0

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
        MessageGroupId='trial',
        DelaySeconds=message_delay
    )

    if response:
        print("Submitted to SQS")
    else:
        print("Error")
    return


def lambda_handler(event, context):
    if os.environ.get("AWS_EXECUTION_ENV") is None:
        local = True
    else:
        local = False

    try:
        message = json.loads(event['body'])
    except TypeError:
        message = event['body']

    send_message(message=message, local=local)
    return
