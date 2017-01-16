import flask as fl

""" Consider using these flask extensions:
    Flask-Uploads - http://pythonhosted.org/Flask-Uploads/#flaskext.uploads.UploadSet.save
    Flask-RESTful - https://flask-restful.readthedocs.io/en/0.3.5/
"""

app = fl.Flask(__name__)

import biotracker.views
