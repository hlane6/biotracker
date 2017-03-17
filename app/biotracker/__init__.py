""" Module handling the initial setup of the flask application. Here the Flask
object is created and configured and the directory structure of the server
is set up.
"""

import flask as fl
import os

app = fl.Flask(__name__, static_url_path='')

# Set up constants
app.config['VID_FOLDER'] = 'biotracker/static/video'
app.config['DATA_FOLDER'] = 'biotracker/static/data'
app.config['BKGRND_FOLDER'] = 'biotracker/static/backgrounds'

app.config['VID_FOLDER_RELATIVE'] = 'video'
app.config['DATA_FOLDER_RELATIVE'] = 'data'

# Create directories to hold the video/data/backgrounds
if not os.path.exists(app.config['VID_FOLDER']):
    os.makedirs(app.config['VID_FOLDER'])

if not os.path.exists(app.config['DATA_FOLDER']):
    os.makedirs(app.config['DATA_FOLDER'])

if not os.path.exists(app.config['BKGRND_FOLDER']):
    os.makedirs(app.config['BKGRND_FOLDER'])


# Accept byte ranges
@app.after_request
def after_request(response):
    response.headers.add('Accept-Ranges', 'bytes')
    return response


def send_file_partial(path: str):
    """ Simple wrapper around send_file which handles HTTP 206 Partial Content
    (byte ranges)

    TODO: handle all send_file args, mirror send_file's error handling
    (if it has any)
    """
    range_header = request.headers.get('Range', None)
    if not range_header:
        return send_file(path)

    size = os.path.getsize(path)
    byte1, byte2 = 0, None

    m = re.search('(\d+)-(\d*)', range_header)
    g = m.groups()

    if g[0]:
        byte1 = int(g[0])

    if g[1]:
        byte2 = int(g[1])

    length = size - byte1
    if byte2 is not None:
        length = byte2 - byte1

    data = None
    with open(path, 'rb') as f:
        f.seek(byte1)
        data = f.read(length)

    rv = Response(data,
                  206,
                  mimetype=mimetypes.guess_type(path)[0],
                  direct_passthrough=True)

    rv.headers.add('Content-Range',
                   'bytes {0}-{1}/{2}'.format(byte1,
                                              byte1 + length - 1,
                                              size))

    return rv

import biotracker.views
