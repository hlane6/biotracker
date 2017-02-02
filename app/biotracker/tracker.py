from biotracker import app
from fileIO import TrackerManager
from track import Track
from scipy.stats.mstats import mode
from utils import ShowVidFrame

import numpy as np
import cv2
import os


class Tracker(object):
    ''' Handles the generation of tracklets for a given video.
        Does not associate the tracklets with ids. Initial generated tracklets
        may contain errors.

        self.background -- the computed background image of the video
        self.tracklets -- the tracklets for the entire video, indexing 0 gives
                tracklets for frame 0 and so forth
    '''


    def __init__(self):
        ''' filename -- name of the video file which can be found in
                    the video folder of the server
        '''
        full_path = '{}/{}'.format(
            app.config['VIDEO_FOLDER'],
            os.listdir(app.config['VIDEO_FOLDER'])[0])

        video = cv2.VideoCapture(full_path)

        self.background = self.get_background(video)
        self.tracklets = self.process_video(video)

        video.release()


    def get_background(self, video, numframes=120):
        ''' Computes the background image of a given video '''

        if os.path.exists('background.png'):
            return cv2.imread('background.png', 0)

        if not video.isOpened():
            print("Error opening input video")

        frames = []
        count = 0
        while(video.grab()):
            ret, inFrame = video.retrieve()
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


    def process_video(self, video, videoOut=None, background=None):
        ''' Generates tracklets frame by frame for a given video '''

        track_mgr = TrackerManager(filename)
        frameNum = 0
        display = videoOut is None
        while(video.grab()):
            ret, inFrame = video.retrieve()
            frameNum += 1
            outFrame, display = process_frame(inFrame, frameNum, track_mgr,
                                              display)
            if videoOut is not None:
                videoOut.write(outFrame)

        return track_mgr


    def process_frame(self, inFrame, frameNum, track_mgr, display=False):
        ''' Generates tracklets for an individual frame '''

        grayframe = cv2.cvtColor(inFrame, cv2.COLOR_BGR2GRAY)
        grayframe = cv2.absdiff(grayframe, self.background)
        ShowVidFrame('background', grayframe)

        # Array of targets to found in the frame
        targets = []
        ret, thresh_img = cv2.threshold(grayframe, 30, 255, cv2.THRESH_BINARY)
        ShowVidFrame('thresh', thresh_img)

        # Detect targets and draw contours on the image.
        targets, inFrame = detect_targets(thresh_img, inFrame, frameNum, draw=True)

        # Add targets from updated tracks
        for tgt in targets:
            tgt.DumpAsDetection(track_mgr)
        if display:
            display = ShowVidFrame('Tracker', inFrame)

        return inFrame, display


    def detect_targets(self, thresh_img, inFrame, frameNum, draw=False):
        ''' Detects targets from the contour image of a frame '''

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
