from biotracker import app

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

    def __init__(self, filename=None):
        ''' filename -- name of the video file which can be found in
                    the video folder of the server
        '''
        full_path = './{}/{}'.format(
            app.config['VIDEO_FOLDER'],
            filename
        )

        print('Tracker path: {}'.format(full_path))

        video = cv2.VideoCapture(full_path)

        while video.isOpened():
            ret, frame = video.read()
            if not ret:
                break

            print(frame)

        self.background = self.get_background(video)
        self.tracklets = self.process_video(video)

        video.release()

    def get_background(self, video):
        ''' Computes the background image of a given video '''
        return None

    def process_video(self, video):
        ''' Generates tracklets frame by frame for a given video '''
        return None

    def process_frame(self, frame):
        ''' Generates tracklets for an individual frame '''
        pass

    def detect_targets(self, image):
        ''' Detects targets from the contour image of a frame '''
        pass
