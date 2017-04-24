Biotracker (v1.0.0)
===================

Biotracker is a set of tools useful for the tracking of moving objects. It
consists of two main tools: the tracker command line scripts and the corrector
desktop application. The tracking scripts allow a user to generate csv data
given an mp4 video file as an input. The corrector application allows for the
editing of that data to correct any mistakes the algorithm might have made.
It was created by a team of Georgia Tech students for their capstone project
for their client, Professor Tucker Balch. Their team included:

+ Alex Matlock
+ Angie Palm
+ Austin Herring
+ Harry Lane
+ Sarah Marland

This repo is organized in the following way:

+ corrector -> Contains all code relating to the desktop application.
+ inputs -> Contains useful inputs to test the application with.
+ style -> Contains style guides used throughout the project.
+ tracker -> Contains all code implementing the tracking scripts.

Install Guide (Tracker)
-----------------------

### Pre-Requisites

These list all of the programs you need to have installed before starting the
installation of the tracker.

+ python3 (>= 3.6.0)
+ pip3 (>= 9.0.1)

### Dependent Libraries

There are several python pacakges you will need to install for tracker to
work properly. Run the following commands to install them:

    pip3 install munkres
    pip3 install numpy
    pip3 install scipy

If you are running on **Ubuntu**, you **must** also run the command:

	sudo apt-get install ffmpeg x264 libx264-dev

This is needed for one of our dependencies to work.

The final library you must install is opencv3. Unfortunately, this library can
not be installed through pip. Installing opencv can be a fairly tricky process
and so we have provided links below to tutorials that guide you through the process.

+ [Installing on Ubuntu](http://www.pyimagesearch.com/2016/10/24/ubuntu-16-04-how-to-install-opencv/)
+ [Installing on Mac](http://www.pyimagesearch.com/2016/12/19/install-opencv-3-on-macos-with-homebrew-the-easy-way/)

### Download Instructions

With all the necessary libraries installed, you can now download and use the
tracker. There are two main options here:

1. If you have git installed and you will be using both the tracker and corrector,
it would be simpler to just clone this repo with the following command:

        git clone https://github.com/hlane6/biotracker.git

2. Otherwise, we have provided a downloadable zip file in the download section
of this repo.

[Click here to download the tracker zip](https://github.com/hlane6/biotracker/blob/delivery_docs/downloads/tracker.zip?raw=true)

### Run Instructions

Make sure your terminal is located at the highest level of the application.

1. **Tracker** - To run tracker, run the command:

        python3 -m tracker -a tracker -v /path/to/video/videoname.mp4 -b /path/to/background/background.jpg

	This will create a `videoname.csv` file of your data in the same
    directory as your input video. Only `-a` and `-v` are necessary for
    tracker. `-b` is optional. However, providing the correct background 
    image will extremely speed up the running time of tracker. If you
    don't provide a background image, tracker will create one for you
    to be used later.

2. **Genvid** - To run genvid, run the command:

        python3 -m tracker -a genvid -v /path/to/video/videoname.mp4 -t /path/to/csv/filename.csv -f nameofoutputfile

	It will create this file in the same directory as the video. Only 
    `-a`, `-v`, and `-t` are necessary for genvid. `-f` is optional.

### Troubleshooting

+ If you are running Ubuntu and the three `pip3` commands don't seem to work, try running these commands instead:

        sudo apt-get install python3-munkres
        sudo apt-get install python3-numpy
        sudo apt-get install python3-scipy

+ Be sure to run python 3, and not python 2, as python 2 is not supported.

Install Guide (Corrector)
-------------------------

### Download Instructions

The corrector is a desktop application and as such, we have provided downloadable
executable files for mac and linux for you to download without any installation or
configuration steps necessary. They can also be found in the download section of
this repo.

+ [Ubuntu Corrector Download]()
+ [Mac Corrector Download](https://github.com/hlane6/biotracker/blob/delivery_docs/downloads/mac/Corrector-1.0.0.dmg?raw=true)

### Pre-Requisites

If you would rather download, build, and install the corrector from source, you
will need one program before you get started.

+ [Node](https://nodejs.org/en/)

### Dependent Libraries

Once you have node installed and the source code downloaded, you can install
the required libraries by running the following command inside the corrector
folder of the repo.

    npm install

Npm is a package manager for node similar to pip for python. All of the required
libraries are specified in corrector/package.json and npm will read and install
them for you by running that command. Note that npm will install them locally into
a node_modules folder it creates for you. Deleting this folder will require you to
rerun this installation command.

### Build Instructions

With all required libraries installed, you can now run commands to build the
Corrector from source. To compile the source files, run the following command
while in the corrector folder:

    npm run build

Once built, use the following command to run the corrector.

    npm run start

To generate an executable that you can do with what you please, run the following
command:

    npm run package

Note that this will package the corrector for what ever system you are currently
using. The resulting executable file will be located under corrector/release.

### Troubleshooting

+ If you get errors when running any npm command, be sure you are in the
corrector folder, and not the root folder. 

Release Notes
-------------

Features

1. **Tracker**
+ Input: video to analyze
+ Output: CSV data of the tracked targets
2. **Genvid**
+ Input: video and CSV data
+ Output: video with bounding boxes drawn
3. **Corrector**
+ Allows for manual correction of the tracker’s mistakes
+ Users can select a bounding box and reassign it to a different target ID number

Known Bugs
+ In the Corrector application, closing the ID editor will stay closed on Linux. In order to
retrieve the editor, the user must restart the application.
+ Sometimes, Tracker creates an incorrect data file at first (this has to do with generating
an image for the first time). The user must run the script again to get the correct data file.
+ Genvid outputs an error to the command line, but the error means nothing and the
process is still successful.
+ Running a script with no arguments displays a Python error instead of a printed,
informative error of what exactly went wrong.
+ If the video passed in is not an mp4, the scripts will display a Python error instead of a
printed, informative error of what exactly went wrong.
