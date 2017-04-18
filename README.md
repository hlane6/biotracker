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

The final library you must install in opencv3. Unfortunately, this library can
not be installed through pip. Installing opencv can be a fairly tricky process
and so we have provided link below to tutorials that guide you through the process.

+ [Installing on Ubuntu](http://www.pyimagesearch.com/2016/10/24/ubuntu-16-04-how-to-install-opencv/)
+ [Installing on Mac](http://www.pyimagesearch.com/2016/12/19/install-opencv-3-on-macos-with-homebrew-the-easy-way/)

### Download Instructions

With all the necessary libraries installed, you can now download and use the
tracker. There are two main options here:

1. If you have git installed and you will be using both the tracker and corrector,
it would be simpler to just clone this repo with the following command:
    
    git clone https://github.com/hlane6/biotracker.git

2. Otherwise, we have provided a downloadable zip file in the download section
of this repo

### Run Instructions

[ insert run instructions for scripts here ]

### Troubleshooting

[ add troubleshooting here ]


Install Guide (Corrector)
-------------------------

### Download Instructions

The corrector is a desktop application and as such, we have provided downloadable
executable files for mac and linux for you to download without any installation or
configuration steps necessary. They can also be found in the download section of
this repo.

+ [Ubuntu Corrector Download]()
+ [Mac Corrector Download]()

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
them for you.

### Build Instructions

### Run Instructions

### Troubleshooting

+ dependent libraries
+ download instructions
+ build instructions
+ installation of actual application
+ run instructions
+ troubleshooting

Release Notes
-------------

+ New features in release
+ known bugs and defects
