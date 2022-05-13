from flask import Flask, request, send_from_directory
from flask_cors import CORS
from summarizer import summarization
import os

app = Flask(__name__, static_folder='FE_build/build', static_url_path='/')

CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route("/summarise", methods=["POST"])
def show_summary():
    input_params = request.json
    text_to_summarise = input_params["full_text"]
    perc_length_summary = input_params["perc_length"]

    summarized_text = summarization(full_text=text_to_summarise, reduce_length=perc_length_summary)

    return {'statusCode': 200, 'final_summary': summarized_text}


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))