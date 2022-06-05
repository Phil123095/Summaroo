FROM public.ecr.aws/lambda/python:3.9

COPY DataSink/requirements.txt .

COPY DataSink/DB_connector.py .

COPY DataSink/data_sink_processing.py .

RUN pip install -r requirements.txt

CMD ["data_sink_processing.lambda_handler"]