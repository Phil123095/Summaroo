FROM public.ecr.aws/lambda/python:3.9

COPY DataSink_LazyLambda/requirements.txt .

COPY DataSink_LazyLambda/lazylambda_data.py .

RUN pip install -r requirements.txt

CMD ["lazylambda_data.lambda_handler"]