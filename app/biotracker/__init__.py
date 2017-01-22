import flask as fl

""" Consider using these flask extensions:
    Flask-Uploads - http://pythonhosted.org/Flask-Uploads/#flaskext.uploads.UploadSet.save
    Flask-RESTful - https://flask-restful.readthedocs.io/en/0.3.5/
"""

app = fl.Flask(__name__, static_url_path='')

app.config['VIDEO_FOLDER'] = 'biotracker/static/video'
app.config['DATA_FOLDER'] = 'biotracker/static/data'
app.config['VIDEO_FOLDER_SHORT'] = 'video'
app.config['DATA_FOLDER_SHORT'] = 'data'

import biotracker.views
