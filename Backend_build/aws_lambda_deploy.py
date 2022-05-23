"""
deploy_to_aws.py
~~~~~~~~~~~~~~~~
A simple script that demonstrates how the docker and AWS Python clients
can be used to automate the process of: building a Docker image, as
defined by the Dockerfile in the project's root directory; pushing the
image to AWS's Elastic Container Registry (ECR); and, then forcing a
redeployment of a AWS Elastic Container Service (ECS) that uses the
image to host the service.
For now, it is assumed that the AWS infrastructure is already in
existence and that Docker is running on the host machine.
"""

import base64
import json
import os
import dotenv
import boto3
import docker
import subprocess
import botocore

ECS_CLUSTER = 'py-docker-aws-example-project-cluster'
ECS_SERVICE = 'py-docker-aws-example-project-service'

LOCAL_REPOSITORY = 'py-docker-aws-example-project:latest'


def create_or_get_lambda_role(role_name):
    iam_client = boto3.client('iam')

    try:
        role = iam_client.get_role(RoleName=role_name)
    except Exception:
        role_policy = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Sid": "",
                    "Effect": "Allow",
                    "Principal": {
                        "Service": "lambda.amazonaws.com"
                    },
                    "Action": "sts:AssumeRole"
                }
            ]
        }

        response = iam_client.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=json.dumps(role_policy),
        )
        role = iam_client.get_role(RoleName=role_name)

    return role


def create_lambda_function(repository_URI, service_name, create_function_url=False):
    role = create_or_get_lambda_role(role_name='LambdaBasicExecution')

    lambda_client = boto3.client('lambda')

    response = lambda_client.create_function(
        FunctionName=service_name,
        Role=role['Role']['Arn'],
        Code={'ImageUri': repository_URI + ":latest"},
        Timeout=900,
        MemorySize=1000,
        PackageType='Image'
    )

    waiter = lambda_client.get_waiter('function_active')
    waiter.wait(FunctionName=service_name)

    print("#----------------------------- And that's a wrap. ----------------------------#")
    print(f"Lambda Function for {service_name} has been created.")

    if create_function_url:
        response = lambda_client.create_function_url_config(
            FunctionName=service_name,
            AuthType='NONE',
            Cors={
                'AllowMethods': [
                    'POST',
                ],
                'AllowOrigins': [
                    '*',
                ],
                'MaxAge': 123
            }
        )

        function_url = response['FunctionUrl']
        print(f"Function URL for {service_name} has been created, and can be accessed here:\n {function_url}")

def build_image(docker_client, service_name):
    build_docker = subprocess.run(["docker", "compose", "build", service_name])

    image = docker_client.images.get(name=service_name)

    return image


def create_ecr_repository(ecr_client, service_name):

    all_repositories = ecr_client.describe_repositories()
    repo_list = all_repositories['repositories']

    for repo in repo_list:
        if service_name == repo['repositoryName']:
            return repo['repositoryUri']
        else:
            continue

    response = ecr_client.create_repository(repositoryName=service_name,
                                            encryptionConfiguration={'encryptionType': 'AES256'})

    repository_URI = response['repository']['repositoryUri']

    return repository_URI


def docker_push_to_ECRrepository(docker_client, image, ecr_credentials, repository_URI):
    ecr_username = 'AWS'

    ecr_password = (
        base64.b64decode(ecr_credentials['authorizationToken']).replace(b'AWS:', b'').decode('utf-8'))

    ecr_url = ecr_credentials['proxyEndpoint'].replace("https://", "")

    docker_client.login(
        username=ecr_username, password=ecr_password, registry=ecr_url, reauth=True)

    image.tag(repository_URI, tag='latest')

    # push image to AWS ECR
    push_log = docker_client.images.push(repository_URI, tag='latest')
    #print(push_log)

    return


def deployment_manager(service_name, create_function_url):
    dotenv.load_dotenv()
    access_key_id = os.environ['AWS_KEY_ID']
    secret_access_key = os.environ['AWS_KEY_SECRET']
    aws_region = os.environ['AWS_REGION']

    docker_client = docker.from_env()

    image = build_image(docker_client=docker_client, service_name=service_name)

    print("#------------------------------------ ECR Login ------------------------------------#")
    ecr_client = boto3.client(
        'ecr', aws_access_key_id=access_key_id,
        aws_secret_access_key=secret_access_key, region_name=aws_region)

    ecr_credentials = (
        ecr_client.get_authorization_token()
        ['authorizationData'][0])

    ecr_url = ecr_credentials['proxyEndpoint']

    subprocess.run(["docker", "logout", ecr_url])

    print(f"#----------------- Creating ECR Repository for {service_name} --------------------#")
    repository_URI = create_ecr_repository(ecr_client=ecr_client, service_name=service_name)

    print("#-------------------------------- Push Image to ECR -------------------------------#")
    docker_push_to_ECRrepository(docker_client=docker_client, image=image, ecr_credentials=ecr_credentials,
                                 repository_URI=repository_URI)

    print("#----------------------------- Create Lambda Function ----------------------------#")
    create_lambda_function(repository_URI=repository_URI, service_name=service_name,
                           create_function_url=create_function_url)

    return None


if __name__ == '__main__':
    deployment_manager(service_name="testing-module3", create_function_url=True)
