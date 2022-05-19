from youtube_transcript_api import YouTubeTranscriptApi
from urllib.parse import urlparse
from urllib.parse import parse_qs


def get_vid_id(value):
    """
    Examples:
    - http://youtu.be/SA2iWivDJiE
    - http://www.youtube.com/watch?v=_oPAwA_Udwc&feature=feedu
    - http://www.youtube.com/embed/SA2iWivDJiE
    - http://www.youtube.com/v/SA2iWivDJiE?version=3&amp;hl=en_US
    """
    query = urlparse(value)
    if query.hostname == 'youtu.be':
        return query.path[1:]
    if query.hostname in ('www.youtube.com', 'youtube.com'):
        if query.path == '/watch':
            p = parse_qs(query.query)
            return p['v'][0]
        if query.path[:7] == '/embed/':
            return query.path.split('/')[2]
        if query.path[:3] == '/v/':
            return query.path.split('/')[2]
    # fail?
    return None


def video_to_transcript(video_url):
    # assigning srt variable with the list
    # of dictonaries obtained by the get_transcript() function
    video_id = get_vid_id(video_url)
    try:
        srt = YouTubeTranscriptApi.get_transcript(video_id)
    except Exception:
        srt = YouTubeTranscriptApi.get_transcript(video_id, languages=['en-GB'])

    full_text = ''
    for text_item in srt:
        text = text_item['text']
        text_final = text + ' '
        full_text = full_text + text_final

    # prints the result
    return full_text