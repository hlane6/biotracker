import flask as fl
from biotracker import app

@app.route('/')
def root():
    return fl.render_template('index.html')

