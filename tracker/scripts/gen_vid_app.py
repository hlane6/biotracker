from ..config import DEFAULT_SETTINGS
from ..config import COLORS
from decimal import *

import cv2
import csv
import os.path
import argparse

import numpy as np

def genvid():
    parser = argparse.ArgumentParser(description='Use this app to generate a video with bounding boxes. NOTE: Make sure input video is located within the video folder. Tracks to be used should be in the data folder. Stores the output video in the genVid folder.')
    parser.add_argument('video', help='video of targets in the form "videoname.mp4"')
    parser.add_argument('tracks', help='tracks of targets to draw bounding boxes in the form "filename.csv"')
    args = parser.parse_args()
    videoName = args.video
    args.video = DEFAULT_SETTINGS['VID_FOLDER'] + args.video
    args.tracks = DEFAULT_SETTINGS['DATA_FOLDER'] + args.tracks

    if os.path.isfile(args.video) and os.path.isfile(args.tracks):
        video = cv2.VideoCapture(args.video)

        # Might need to change video format for linux, ubuntu, etc.
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')

        fps = video.get(cv2.CAP_PROP_FPS)

        width = int(video.get(3))
        height = int(video.get(4))

        out = cv2.VideoWriter(DEFAULT_SETTINGS['GENVID_FOLDER'] + videoName, fourcc, fps, (width, height))

        frameNum = 0

        while(video.isOpened()):
            ret, frame = video.read()

            if ret:
                frameNum = frameNum + 1
                with open(args.tracks, 'r') as tracks:
                    reader = csv.reader(tracks)
                    next(reader, None)
                    for line in reader:
                        if int(line[0]) == frameNum:
                            tgt_id = int(line[1])
                            x = int(line[2])
                            y = int(line[3])
                            width = Decimal(line[4])
                            height = Decimal(line[5])
                            theta = Decimal(line[6])

                            rect = ((x,y), (width,height), theta)
                            box = cv2.boxPoints(rect)
                            box = np.int0(box)

                            cv2.drawContours(frame, [box], 0, COLORS[tgt_id], 2)
                        elif int(line[0]) == (frameNum+1):
                            break

                out.write(frame)

            else:
                break

        video.release()
        out.release()

    else:
        if not os.path.isfile(args.video):
            print("Can't find video: '" + args.video + "'.")
        if not os.path.isfile(args.tracks):
            print("Can't find tracks: '" + args.tracks + "'.")
