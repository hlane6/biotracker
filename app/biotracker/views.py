""" Module containing all views for the flask applicatation.
"""

from flask import Flask, Response, flash, redirect, render_template, request
from werkzeug.utils import secure_filename
from werkzeug.datastructures import FileStorage
from datetime import datetime
from biotracker import app
from biotracker.models.targetManager import TargetManager

import os

@app.errorhandler(404)
def page_not_found(e):
    return redirect('/')

@app.route('/')
def root():
    """ Routes users to the welcome / upload page of the applicatation. From
    here the user can upload files and will be directed towards the home page.
    """
    return render_template('index.html')

@app.route('/home')
def home_view():
    """ Routes users to the homepage of the application which includes the
    tracker web applicatation.
    """
    return render_template('home.html')

@app.route('/uploadFiles', methods=['POST'])
def handle_data():
    """ Handles POST requests given an mp4. If a csv file is not provided
    then one will be generated.
    """
    # Fetch files and remove old ones if they exist
    video = request.files['video']
    csvData = request.files['csvData']
    _remove_files(app.config['DATA_FOLDER'])
    _remove_files(app.config['VID_FOLDER'])

    video.save(os.path.join(app.config['VID_FOLDER'],
               secure_filename(video.filename)))

    _handle_csv(csvData)

    return redirect('/home')


@app.route('/video', methods=['GET'])
def fetch_video():
    """ Endpoint to serve the saved video file. Prevents Caching to ensure
    that the newest upload is what always return.
    """
    resp = app.send_static_file(os.path.join(app.config['VID_FOLDER_RELATIVE'],
                                os.listdir(app.config['VID_FOLDER'])[0]))

    # Add these to prevent the browser from caching the video
    resp.cache_control.no_cache = True
    resp.cache_control.no_store = True
    resp.cache_control.must_revalidate = True
    resp.cache_control['post-check'] = 0
    resp.cache_control['pre-check'] = 0
    resp.cache_control['max-age'] = 0

    return resp


@app.route('/csvData', methods=['GET'])
def fetch_csvData():
    """ Endpoint that serves the csv data.
    """

    file = app.send_static_file(
        os.path.join(app.config['DATA_FOLDER_RELATIVE'],
                     os.listdir(app.config['DATA_FOLDER'])[0]))
    file.headers['Content-disposition'] = \
        'attachment; filename=' + os.listdir(app.config['DATA_FOLDER'])[0]

    return file

def _remove_files(directory):
    for f in os.listdir(directory):
        os.remove(os.path.join(directory, f))

def _handle_csv(csvData):
    # If no csv file provided, then create one from video
    if csvData.filename == '':
        fname = os.listdir(app.config['VID_FOLDER'])[0]
        mgr = TargetManager('{}/{}'.format(app.config['VID_FOLDER'], fname))

        mgr.identify_targets()
        mgr.post_process_targets()
        mgr.associate_targets()

        csv_path = os.path.join(app.config['DATA_FOLDER'],
                                fname.split('.')[0] + ".csv")
        mgr.write_csv_file(csv_path)

    # Otherwise create the video from csv data
    else:
        csvData.save(os.path.join(app.config['DATA_FOLDER'],
                    secure_filename(csvData.filename)))
