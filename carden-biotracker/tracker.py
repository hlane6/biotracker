import cv2
import numpy as np
from scipy.stats.mstats import mode
import sys
from fileIO import TrackerManager
from track import Track
from utils import ShowVidFrame
import os


def DetectTargets(thresh_img, inFrame, frameNum, draw=False):
    # No ground truth means no known label, 0 is a sentinal value for an
    # unlabled ant
    unlabeledAntID = 0
    CONTOUR_THRESH = 100

    im, contours, heirarchy = cv2.findContours(thresh_img, cv2.RETR_EXTERNAL,
                                               cv2.CHAIN_APPROX_NONE)
    # Initialize target number starting at 1.
    # Initialize list of tracks for updating.
    new_track_arr = []
    for contour in contours:
        rect = cv2.minAreaRect(contour)
        box = np.int0(cv2.boxPoints(rect))

        # Create a track to access attributes of the bounding box around tgt,
        # and add it to track array

        if(draw):
            if cv2.contourArea(contour) > CONTOUR_THRESH:
                new_track_arr.append(Track(init_box=box,
                                           tgt_id=unlabeledAntID,
                                           frame_num=frameNum))
                cv2.drawContours(inFrame, [box], 0, (0, 0, 255), 2)
    return new_track_arr, inFrame


def ProcessVideo(filename, videoIn, videoOut=None, background=None):
    track_mgr = TrackerManager(filename)
    frameNum = 0
    display = videoOut is None
    while(videoIn.grab()):
        ret, inFrame = videoIn.retrieve()
        frameNum += 1
        outFrame, display = ProcessFrame(inFrame, frameNum, track_mgr,
                                         background, display)
        if videoOut is not None:
            videoOut.write(outFrame)

    return track_mgr


# Perform background subtraction and binary thresholding to detect ants.
def ProcessFrame(inFrame, frameNum, track_mgr, background, display=False):
    grayframe = cv2.cvtColor(inFrame, cv2.COLOR_BGR2GRAY)
    grayframe = cv2.absdiff(grayframe, background)
    ShowVidFrame('background', grayframe)
    # Array of targets to found in the frame
    targets = []
    ret, thresh_img = cv2.threshold(grayframe, 30, 255, cv2.THRESH_BINARY)
    ShowVidFrame('thresh', thresh_img)

    # Detect targets and draw contours on the image.
    targets, inFrame = DetectTargets(thresh_img, inFrame, frameNum, draw=True)

    # Add targets from updated tracks
    for tgt in targets:
        tgt.DumpAsDetection(track_mgr)
    if display:
        display = ShowVidFrame('Tracker', inFrame)

    return inFrame, display


def GetBackground(inVideoName, numframes=120):
    if os.path.exists('background.png'):
        return cv2.imread('background.png', 0)
    videoIn = cv2.VideoCapture(inVideoName)
    if not videoIn.isOpened():
        print("Error opening input video: " + inVideoName)
    frames = []
    count = 0
    while(videoIn.grab()):
        ret, inFrame = videoIn.retrieve()
        grayframe = cv2.cvtColor(inFrame, cv2.COLOR_BGR2GRAY)
        frames.append(grayframe)
        count += 1
        if count >= numframes:
            break
    # Stack all the frames into a single 3D array.
    frames = np.stack(frames)
    background = np.zeros(frames[0, :, :].shape)
    # Get the mode of the set of frames to make targets disappear.
    background, count = mode(frames, axis=0)
    # Drop the third dimension.
    background = background[0, :, :]
    cv2.imwrite('background.png', background)
    return cv2.imread('background.png', 0)


if __name__ == '__main__':
    inVideoName = sys.argv[1]
    is_outputting_video = False
    videoOut = None
    videoIn = cv2.VideoCapture(inVideoName)
    if len(sys.argv) > 2:
        outFileName = sys.argv[2]
        videoOut = cv2.VideoWriter(
            outFileName, cv2.VideoWriter_fourcc('m', 'p', 'e', 'g'),
            int(videoIn.get(cv2.CAP_PROP_FRAME_COUNT)),
            (int(videoIn.get(cv2.CAP_PROP_FRAME_WIDTH)),
                int(videoIn.get(cv2.CAP_PROP_FRAME_HEIGHT))))
        if not videoOut.isOpened():
            print("Error opening output video: " + outFileName)
        else:
            is_outputting_video = True
    if not videoIn.isOpened():
        print("Error opening input video: " + inVideoName)
    background = GetBackground(inVideoName)
    track_mgr = ProcessVideo("tracklets", videoIn, videoOut, background)

    if is_outputting_video:
        videoOut.release()
    videoIn.release()
    track_mgr.write_file()
