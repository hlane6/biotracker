from biotracker import app

import cv2
import os


class Tracker(object):
    ''' Handles the generation of tracklets for a given video. Does not associate the 
        tracklets with ids. Initial generated tracklets may contain errors.

        self.background -- the computed background image of the video
        self.tracklets -- the tracklets for the entire video, indexing 0 gives tracklets
                for frame 0 and so forth
    '''

    def __init__(self, filename=None):
        ''' filename -- name of the video file which can be found in
                    the video folder of the server
        '''
        full_path = '{}/{}'.format(
            app.config['VIDEO_FOLDER'],
            filename
        )

        video = cv2.VideoCapture(full_path)

        self.background = self.get_background(video)
        self.tracklets = self.process_video(video)

        video.release()

    def get_background(self):
        return None

    def process_video(self):
        return None

    def process_frame(self):
        return None

    def detect_targets(self):
        return None

