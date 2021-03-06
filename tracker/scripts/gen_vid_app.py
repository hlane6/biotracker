from ..config import DEFAULT_SETTINGS
from ..config import COLORS
from decimal import *

import cv2
import csv
import os.path
import platform

import numpy as np

def genvid(video: str, tracks: np.array, out_name: str=None):
    """ Generates a video file from an old video and a csv file generated by the
    tracker script. Will simply overlay the boxes defined in the data file over
    the old video and save it in to the file specified in out_name or will append
    bb to the end of the video filename and save it there.
    """

    vid = cv2.VideoCapture(video)

    if (platform.system() == 'Darwin'):
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    elif (platform.system() == 'Linux'):
        fourcc = cv2.VideoWriter_fourcc(*'X264')
    else:
        fourcc = cv2.VideoWriter_fourcc(*'mrle') # STILL NOT SURE IF THIS WILL WORK WITH WINDOWS

    fps = vid.get(cv2.CAP_PROP_FPS)

    width = int(vid.get(3))
    height = int(vid.get(4))

    exists = False

    if out_name is not None:
        if os.path.isfile(os.path.join(os.path.dirname(video), out_name + '.mp4')):
            exists = True;
        out = cv2.VideoWriter(os.path.join(os.path.dirname(video), out_name + '.mp4'), fourcc, fps, (width, height))
    else:
        if os.path.isfile(os.path.join(video.split('.mp4')[0] + 'bb' + '.mp4')):
            exists = True
        out = cv2.VideoWriter(os.path.join(video.split('.mp4')[0] + 'bb' + '.mp4'), fourcc, fps, (width, height))

    frameNum = 0

    if not exists:
        while(vid.isOpened()):
            ret, frame = vid.read()

            if ret:
                frameNum = frameNum + 1
                with open(tracks, 'r') as t:
                    reader = csv.reader(t)
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

        vid.release()
        out.release()
    else:
        print("Bounding box video already exists. Please delete it and run again.")
