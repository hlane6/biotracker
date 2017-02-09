from flask import Flask, Response, flash, redirect, render_template, request
from werkzeug.utils import secure_filename
from werkzeug.datastructures import FileStorage
from datetime import datetime
from biotracker import app
from biotracker.models.tracker import Tracker

import os


@app.errorhandler(404)
def page_not_found(e):
    return redirect('/')


@app.route('/')
def root():
    return render_template('index.html')


@app.route('/home')
def home_view():
    return render_template('home.html')


@app.route('/uploadFiles', methods=['POST'])
def handle_data():
    """
    Handles POST requests given an mp4.
    If a csv file is not provided then one will be generated
    """

    # Fetch files and remove old ones if they exist
    video = request.files['video']
    csvData = request.files['csvData']
    remove_files(app.config['DATA_FOLDER'])
    remove_files(app.config['VID_FOLDER'])

    video.save(os.path.join(app.config['VID_FOLDER'],
               secure_filename(video.filename)))

    # If no csv file provided, then create one from video
    if csvData.filename == '':
        tracker = Tracker()
        tracker.generate_csv()

    # Otherwise create the video from csv data
    else:
        csvData.save(os.path.join(app.config['DATA_FOLDER'],
                     secure_filename(csvData.filename)))

    return redirect('/home')


@app.route('/video', methods=['GET'])
def fetch_video():
    """
    Endpoint to serve the saved video file
    Prevents Caching to ensure that the newest upload is what always return
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
    """
    Endpoint to serve the save csv data
    """

    file = app.send_static_file(
        os.path.join(app.config['DATA_FOLDER_RELATIVE'],
                     os.listdir(app.config['DATA_FOLDER'])[0]))
    file.headers['Content-disposition'] = \
        'attachment; filename=' + os.listdir(app.config['DATA_FOLDER'])[0]

    return file


def is_match(video, csv):
    """
    Checks if a csv file matches a given mp4 file.
    If the names are the same return true
    """

    return video.filename.split('.')[0] == csv.filename.split('.')[0]


def remove_files(directory):
    """
    Removes all the files in a given directory
    Useful for clearing old mp4/csv data
    """

    for f in os.listdir(directory):
        os.remove(os.path.join(directory, f))
