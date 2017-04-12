""" Module containing the Tracker model
"""

from biotracker import app
from biotracker.models.target import Target
from scipy.stats.mstats import mode
from typing import List
import math

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

    def split(self, target):
        """ Splits certain identified blobs by kmeans """
        pass

    def process_video(self) -> List[List[Target]]:
        """ Generates targets frame by frame for a given video. For every
        frame of the video, performs background subtraction on the frame
        using the previously generated background. The subtracted image is
        then thresholded to remove some noise, and finally the contours
        of the image are found in the thresholded image. A list of Targets
        are created based on those contours.
        """
        all_targets = []

        frameNum = 0
        currentDataRow = 1  # First row in the csv is a header

        last_len = 0
        while(self.video.grab() and self.video.isOpened()):
            ret, inFrame = self.video.retrieve()
            frameNum += 1

            curr_targets = self.__process_frame(inFrame, frameNum, last_len)
            all_targets.append(curr_targets)

            last_len = len(curr_targets)


        return all_targets

    def __process_frame(self, inFrame: np.array,
                        frameNum: int, last_len) -> List[Target]:
        grayframe = cv2.cvtColor(inFrame, cv2.COLOR_BGR2GRAY)
        grayframe = cv2.absdiff(grayframe, self.background)

        ret, thresh_img = cv2.threshold(grayframe, 30, 255, cv2.THRESH_BINARY)

        # Detect targets and draw contours on the image.
        return self.__detect_targets(thresh_img, inFrame, frameNum, last_len)

    def __missed_target(self):
        pass

    def __split(self):
        pass

    def __detect_targets(self, thresh_img: np.array,
                         in_frame: np.array, frame_num: int, last_len) -> List[Target]:
        targets = []
        post = []
        im, contours, heirarchy = cv2.findContours(thresh_img,
                                                   cv2.RETR_EXTERNAL,
                                                   cv2.CHAIN_APPROX_NONE)

        # Difference between number of ants in previous frame and current


        curr_len = 0
        for contour in contours:
            rect, dimensions, theta = cv2.minAreaRect(contour)
            box = np.int0(cv2.boxPoints((rect, dimensions, theta)))
            blob_size = cv2.contourArea(contour)

            # Create a target and add it to the target manager
            target = Target(
                    frame_num=frame_num,
                    width=dimensions[0],
                    height=dimensions[1],
                    theta=theta,
                    box=box,
                )
            if blob_size > app.config['MIN_BLOB_SIZE']:
                targets.append(target)
            if blob_size > app.config['MIN_BLOB_SIZE'] and \
                blob_size < app.config['MAX_BLOB_SIZE']:
                post.append((target, contour, rect, dimensions, theta, box))
                curr_len += 1

        diff = last_len - curr_len
        count = 0
        bound = diff if (diff < len(post)) else len(post)


        while count < bound:

            post.sort(key=lambda x: x[0].width, reverse=True)

            target = post[count][0]
            contour = post[count][1]

            x = target.x
            y = target.y
            
            width = target.width
            height = target.height

            #print(type(width))
            #print(type(height))

            criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0)
            flags = cv2.KMEANS_RANDOM_CENTERS

            xWid = x + int(math.ceil(width))
            yHeight = y + int(math.ceil(height))

            #print("x: ", x, "x + width: ", xWid, "y: ", y, "y + height: ", yHeight)
            img_slice = thresh_img[y:yHeight, x:xWid]

            #kmeans requires np.float32 type param
            values = np.float32(img_slice)
            #print("val rows: ", len(values))
            #print("val cols: ", len(values[0]))

            for i in range(len(values)):
                for j in range(len(values[i])):
                    print("image slice :", i, " ", j, ": ", values[i][j])

            #values = image.reshape((image.shape[0] * image.shape[1], 3))

            #print("img_slice: ", len(img_slice))
            #print("image: ", len(image))
            #print("values: ", len(values))

            if len(values) > 2:
                ans = cv2.kmeans(values, 2, None, criteria, 10, flags)
                for i in range(len(ans[1])):
                    print("i: ", ans[1][i])


            count += 1

        # for n in thresh_img:
        #     print()


        return targets
