import csv
import cv2
from collections import namedtuple
from biotracker.models.tracker import Tracker

import pdb

# Data structure for target. Works like a dictionary without as much overhead.
Detection = namedtuple('Detection', ['frame_num', 'target_id', 'x', 'y',
                                     'width', 'height', 'theta'])


class TargetManager:
    """ A TargetManager is responsible for generating Targets for a given
    video. This is a three step process:
        1. Using a Tracker, perform an initial first pass of the video. After
        this step, the targets will contain information about their x, y, width,
        height, and theta, but will not have associated ids, and there can be
        many mistakes dealing with sequential frames combining multiple targets
        into one larger target.

        2. Post process the generated tracklets by attempting to remove some
        of the mistakes previously made. After this step, multiple targets will
        ideally not be combining into one bigger target if they get close
        together.

        3. Using an Associator, associate the targets. After this step, the
        targets should have all have corresponding ids and are ready to be
        written to a csv file.
    """
    FRAME_NUM, TARGET_ID, POS_X, POS_Y, WIDTH, HEIGHT, THETA = 1, 2, 3, 4, 5, 6

    def __init__(self, video_path):
        """
        """
        self.detections = []
        self.targets = []
        self.video = cv2.VideoCapture(video_path)

    def identify_targets(self):
        """
        """
        tracker = Tracker(self.video)
        self.targets = tracker.process_video()

    def post_process_targets(self):
        """
        """
        pass

    def associate_targets(self):
        """
        """
        pass

    def write_csv_file(self, csv_file_name):
        """ Converts data to a csv file
        """
        with open(csv_file_name, 'w') as csv_file:
            writer = csv.writer(csv_file)
            writer.writerow(Detection._fields)
            for frame_targets in self.targets:
                for target in frame_targets:
                    row = []

                    detection = Detection(
                        target.frame_num,
                        target.target_id,
                        target.pos[0],
                        target.pos[1],
                        target.dimensions[0],
                        target.dimensions[1],
                        target.theta
                    )

                    for x in range(0, 7):
                        row.append(detection[x])

                    writer.writerow(row)

    def load_data(self, csv_file):
        """ Loads data from a csv file
        """
        with open(csv_file, 'r') as file_data:
            reader = csv.reader(file_data, delimiter=',')

            next(reader, None)  # skip header

            for row in reader:
                detection = self._read_row(row)
                self.detections.append(detection)
                self.targets.append(self._detection_to_target(detection))

    def _read_row(self, row):
        """ Reads in a row from csv file into a Detection object
        """
        return Detection(frame_num=int(row[FRAME_NUM]),
                         target_id=int(row[TARGET_ID]),
                         x=int(row[POX_X]),
                         y=int(row[POX_Y]),
                         width=int(row[WIDTH]),
                         height=int(row[HEIGHT]),
                         theta=float(row[THETA]))

    def _detection_to_target(detection):
        """ Converts a detection to a target
        """
        d_target_id = None if detection.target_id == 0 else detection.target_id
        target = Target(pos=(detection.x, detection.y),
                        target_id=d_target_id,
                        theta=detection.theta,
                        frame_num=detection.frame_num,
                        dimensions=(detection.width, detection.height))
        return target
