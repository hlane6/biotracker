from biotracker import app
from biotracker.fileIO import TrackerManager
from biotracker.track import Track
from scipy.stats.mstats import mode

import numpy as np
import cv2
import os

import pdb # Use this for debugging


class Tracker(object):
    ''' Handles the generation of tracklets for a given video.
        Does not associate the tracklets with ids. Initial generated tracklets
        may contain errors.
        self.background -- the computed background image of the video
        self.tracklets -- the tracklets for the entire video, indexing 0 gives
                tracklets for frame 0 and so forth
    '''


    def __init__(self, preDefinedDataExists):
        ''' filename -- name of the video file which can be found in
                    the video folder of the server
        '''

        fname = os.listdir(app.config['VID_ORG_FOLDER'])[0]  
        self.vid_name = fname.split(".")[0]
        self.preDefinedDataExists = preDefinedDataExists

        self.video_path = '{}/{}'.format(app.config['VID_ORG_FOLDER'], fname)
        video = cv2.VideoCapture(self.video_path)

        self.frame_count = video.get(cv2.CAP_PROP_FRAME_COUNT)
        self.frame_width = video.get(cv2.CAP_PROP_FRAME_WIDTH)
        self.frame_height = video.get(cv2.CAP_PROP_FRAME_HEIGHT)

        self.background = self.get_background(video)
        self.tracklets = self.process_video(video)

        # video.release()


    def generate_csv(self):
        ''' Generates the csv data file '''

        csv_path = os.path.join(app.config['DATA_FOLDER'], self.vid_name + ".csv")
        self.tracklets.write_csv_file(csv_path)


    def generate_video_with_markup(self):
        ''' Marks up a raw video given a predefined csv file '''

        csv_path = os.path.join(app.config['VID_MRK_FOLDER'], self.vid_name + ".avi")

        # fourcc = cv2.VideoWriter_fourcc(*'MP4V')
        fourcc = cv2.VideoWriter_fourcc(*'MPEG')
        videoOut = cv2.VideoWriter(csv_path, fourcc, int(self.frame_count),
                                   (int(self.frame_width), int(self.frame_height)))

        video = cv2.VideoCapture(self.video_path)
        self.process_video(video, videoOut=videoOut)
        videoOut.release()



    def get_background(self, video, numframes=120):
        ''' Computes the background image of a given video '''

        background_path = '{}/bk_{}.png'.format(
            app.config['BKGRND_FOLDER'],
            self.vid_name)

        if os.path.exists(background_path):
            return cv2.imread(background_path, 0)

        if not video.isOpened():
            print("Error opening input video")

        frames = []
        count = 0
        while(video.grab() and video.isOpened()):
            ret, inFrame = video.retrieve()
            if ret:
                grayframe = cv2.cvtColor(inFrame, cv2.COLOR_BGR2GRAY)
                frames.append(grayframe)
                count += 1
                if count >= numframes:
                    break

        # Stack all the frames into a single 3D array.
        frames = np.stack(frames)
        background = np.zeros(frames[0, :, :].shape)

        # Get the mode of the set of frames to make targets disappear.count
        # Note: This function call may take a while for sophisticated backgrounds
        background, count = mode(frames, axis=0)

        # Drop the third dimension.
        background = background[0, :, :]
        cv2.imwrite(background_path, background)
        return cv2.imread(background_path, 0)


    def process_video(self, video, videoOut=None, background=None):
        ''' Generates tracklets frame by frame for a given video '''

        track_mgr = TrackerManager()
        frameNum = 0
        currentDataRow = 1 # First row in the csv is a header
        while(video.grab() and video.isOpened()):
            ret, inFrame = video.retrieve()
            frameNum += 1
            if (self.preDefinedDataExists):
                outFrame, rowsRead = self.retreive_targets(inFrame, frameNum, track_mgr, currentDataRow)
                currentDataRow += rowsRead
            else:
                outFrame = self.process_frame(inFrame, frameNum, track_mgr)

            if videoOut is not None:
                videoOut.write(outFrame)

        return track_mgr


    def process_frame(self, inFrame, frameNum, track_mgr):
        ''' Generates tracklets for an individual frame '''

        grayframe = cv2.cvtColor(inFrame, cv2.COLOR_BGR2GRAY)
        grayframe = cv2.absdiff(grayframe, self.background)

        # Array of targets to found in the frame
        targets = []
        ret, thresh_img = cv2.threshold(grayframe, 30, 255, cv2.THRESH_BINARY)

        # Detect targets and draw contours on the image.
        targets, inFrame = self.detect_targets(thresh_img, inFrame, frameNum)

        # Add targets from updated tracks
        for tgt in targets:
            tgt.DumpAsDetection(track_mgr)

        return inFrame


    def detect_targets(self, thresh_img, inFrame, frameNum):
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
            if cv2.contourArea(contour) > CONTOUR_THRESH:
                new_track_arr.append(Track(init_box=box,
                                           corners=cv2.boxPoints(rect),
                                           tgt_id=unlabeledAntID,
                                           frame_num=frameNum))
                cv2.drawContours(inFrame, [box], 0, (0, 0, 255), 2)

        return new_track_arr, inFrame


    def retreive_targets(self, inFrame, frameNum, track_mgr, currentDataRow):
        file_path = '{}/{}'.format(app.config['DATA_FOLDER'], self.vid_name + ".csv")
        track_mgr.load_data(file_path)

        rows = len(track_mgr.detections)
        if currentDataRow < rows:
            detection = track_mgr.detections[currentDataRow]

        while currentDataRow < rows and detection.frame_num == frameNum:
            box = np.int0((detection.corner1, detection.corner2, detection.corner3, detection.corner4))
            cv2.drawContours(inFrame, [box], 0, (0, 0, 255), 2)
            currentDataRow += 1
            detection = track_mgr.detections[currentDataRow]

        return inFrame, currentDataRow
