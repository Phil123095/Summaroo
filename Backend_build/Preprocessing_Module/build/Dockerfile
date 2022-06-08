FROM public.ecr.aws/lambda/python:3.9

COPY Preprocessing_Module/build/requirements.txt .

COPY Preprocessing_Module/build/Media_Class.py .

COPY Preprocessing_Module/build/preprocessing_handler.py .

RUN pip install -r requirements.txt

RUN python -c "import nltk; nltk.download('punkt', download_dir='/var/task/nltk_data')"

CMD ["preprocessing_handler.lambda_handler"]