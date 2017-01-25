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

import biotracker.views
