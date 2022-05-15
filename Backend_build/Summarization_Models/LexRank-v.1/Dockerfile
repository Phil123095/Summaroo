FROM public.ecr.aws/lambda/python:3.9

COPY Summarization_Models/LeyRank-v.1/requirements.txt .

COPY Summarization_Models/LexRank-v.1/summarizer.py .

RUN pip install -r requirements.txt

RUN python -c "import nltk; nltk.download('punkt', download_dir='/var/task/nltk_data')"

CMD ["summarizer.lambda_handler"]