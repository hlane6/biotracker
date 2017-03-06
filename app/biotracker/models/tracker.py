""" Module containing the Tracker model
"""

from biotracker import app
from biotracker.models.target import Target
from scipy.stats.mstats import mode

import numpy as np
import cv2
import os


class Tracker(object):
    """ Handles the generation of targets for a given video.
        Does not associate the targets with ids. Initial generated targets
        may contain errors.
        self.background -- the computed background image of the video
    """

    def __init__(self, video: cv2.VideoCapture) -> None:
        self.video = video
        self.background = self.__get_background()

    def __get_background(self, numframes=120) -> np.array:
        """ Computes the background image of a given video by taking a
        specified number of frames from the video and taking the mode of
        those frames. For a stationary camera, the mode represents what is
        stationary in those frames aka the background. Saves the background
        so this doesn't have to be computed every time.
        """
        vid_name = os.listdir(app.config['VID_FOLDER'])[0].split(".")[0]

        background_path = '{}/bk_{}.png'.format(
            app.config['BKGRND_FOLDER'],
            vid_name)

        if os.path.exists(background_path):
            return cv2.imread(background_path, 0)

        if not self.video.isOpened():
            print("Error opening input video")

        frames = []
        count = 0
        while(self.video.grab() and self.video.isOpened()):
            ret, inFrame = self.video.retrieve()
            if ret:
                grayframe = cv2.cvtColor(inFrame, cv2.COLOR_BGR2GRAY)
                frames.append(grayframe)
                count += 1
                if count >= numframes:
                    break

        # Stack all the frames into a single 3D array.
        frames = np.stack(frames)
        background = np.zeros(frames[0, :, :].shape)

        # Get the mode of the set of frames to make targets disappear
        # This function call may take a while for sophisticated backgrounds
        background, count = mode(frames, axis=0)

        # Drop the third dimension.
        background = background[0, :, :]
        cv2.imwrite(background_path, background)
        return cv2.imread(background_path, 0)

    def process_video(self) -> list[list[Target]]:
        """ Generates targets frame by frame for a given video
        """
        all_targets = []

        frameNum = 0
        currentDataRow = 1  # First row in the csv is a header
        while(self.video.grab() and self.video.isOpened()):
            ret, inFrame = self.video.retrieve()
            frameNum += 1
            all_targets.append(self.__process_frame(inFrame, frameNum))

        return all_targets

    def __process_frame(self, inFrame: np.array,
                        frameNum: int) -> list[Target]:
        grayframe = cv2.cvtColor(inFrame, cv2.COLOR_BGR2GRAY)
        grayframe = cv2.absdiff(grayframe, self.background)

        ret, thresh_img = cv2.threshold(grayframe, 30, 255, cv2.THRESH_BINARY)

        # Detect targets and draw contours on the image.
        return self.__detect_targets(thresh_img, inFrame, frameNum)

    def __detect_targets(self, thresh_img: np.array,
                         in_frame: np.array, frame_num: int) -> list[Target]:
        # No ground truth means no known label, 0 is a sentinal value for an
        # unlabled ant
        unlabeled_ant_id = 0
        CONTOUR_THRESH = 100
        targets = []

        im, contours, heirarchy = cv2.findContours(thresh_img,
                                                   cv2.RETR_EXTERNAL,
                                                   cv2.CHAIN_APPROX_NONE)

        for contour in contours:
            rect, dimensions, theta = cv2.minAreaRect(contour)
            box = np.int0(cv2.boxPoints((rect, dimensions, theta)))

            # Create a target and add it to the target manager
            if cv2.contourArea(contour) > CONTOUR_THRESH:
                target = Target(init_box=box,
                                target_id=unlabeled_ant_id,
                                frame_num=frame_num,
                                theta=theta,
                                dimensions=dimensions)
                targets.append(target)
                cv2.drawContours(in_frame, [box], 0, (0, 0, 255), 2)

        return targets
