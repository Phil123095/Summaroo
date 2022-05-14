FROM public.ecr.aws/lambda/python:3.9

COPY Summarization_Models/base-v.1/requirements.txt .

COPY Summarization_Models/base-v.1/summarizer.py .

RUN pip install -r requirements.txt

RUN python -m nltk.downloader punkt

CMD ["summarizer.lambda_handler"]