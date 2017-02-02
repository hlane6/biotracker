import flask as fl
import os

""" Consider using these flask extensions:
    Flask-Uploads -
    http://pythonhosted.org/Flask-Uploads/#flaskext.uploads.UploadSet.save
    Flask-RESTful - https://flask-restful.readthedocs.io/en/0.3.5/
"""

app = fl.Flask(__name__, static_url_path='')

# Set up constants
app.config['VIDEO_FOLDER'] = 'biotracker/static/video'
app.config['DATA_FOLDER'] = 'biotracker/static/data'
app.config['VIDEO_FOLDER_SHORT'] = 'video'
app.config['DATA_FOLDER_SHORT'] = 'data'

# Create directories to hold the video/data
if not os.path.exists(app.config['VIDEO_FOLDER']):
    os.makedirs(app.config['VIDEO_FOLDER'])

if not os.path.exists(app.config['DATA_FOLDER']):
    os.makedirs(app.config['DATA_FOLDER'])

#Accept byte ranges
@app.after_request
def after_request(response):
    response.headers.add('Accept-Ranges', 'bytes')
    return response

def send_file_partial(path):
    """ 
        Simple wrapper around send_file which handles HTTP 206 Partial Content
        (byte ranges)
        TODO: handle all send_file args, mirror send_file's error handling
        (if it has any)
    """
    range_header = request.headers.get('Range', None)
    if not range_header: return send_file(path)
    
    size = os.path.getsize(path)    
    byte1, byte2 = 0, None
    
    m = re.search('(\d+)-(\d*)', range_header)
    g = m.groups()
    
    if g[0]: byte1 = int(g[0])
    if g[1]: byte2 = int(g[1])

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
    rv.headers.add('Content-Range', 'bytes {0}-{1}/{2}'.format(byte1, byte1 + length - 1, size))

    return rv

import biotracker.views
