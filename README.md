This is the inital boilerpate need to setup a flask backend server that renders
react components for the frontend.

Make sure you have these installed before you begin:
+ python3
+ pip3
+ node
+ npm
+ virtualenv

Run all commands from the root directory.

Now lets use a virtual environment to install our packages:
    
    python3 -m  venv env
    source env/bin/activate

Now you can run these commands to install the requirements:

    npm install -g webpack
    npm install
    pip3 install -e .

To run the server locally (can be found at localhost:5000):

    export FLASK_APP=biotracker
    export FLASK_DEBUG=true
    flask run

To build the frontend bundle run (in another tab in terminal):

    webpack

To build the frontend bundle and have it rebuild when you edit files, run:

    webpack --watch

Finally, whenever you are done working use this command to exit your virtualenv:

    deactivate

###
Preqres:
+ numpy
+ scipy
+ munkres
+ opencv
