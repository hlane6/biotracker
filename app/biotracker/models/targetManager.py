import csv
import cv2
from collections import namedtuple
from biotracker.models.tracker import Tracker, Target


class TargetManager:
    """ A TargetManager is responsible for generating Targets for a given
    video. This is a three step process:
        1. Using a Tracker, perform an initial first pass of the video. After
        this step, the targets will contain information about their x, y,
        width, height, and theta, but will not have associated ids, and there
        can be many mistakes dealing with sequential frames combining multiple
        targets into one larger target.

        2. Post process the generated tracklets by attempting to remove some
        of the mistakes previously made. After this step, multiple targets will
        ideally not be combining into one bigger target if they get close
        together.

        3. Using an Associator, associate the targets. After this step, the
        targets should have all have corresponding ids and are ready to be
        written to a csv file.
    """

    FRAME_NUM = 0
    TARGET_ID = 1
    POS_X = 2
    POS_Y = 3
    WIDTH = 4
    HEIGHT = 5
    THETA = 6

    def __init__(self, video_path: str) -> None:
        """ Initializes the TrackerManager. A TrackerManger has the following
        instance variables:
            targets: list[list[Target]] - All of the targets for a given video.
            At each index contains a list of all Targets corresponding to the
            frame number with the index for its value
            video: cv2.VideoCapture - a reference to the video it is analyzing
        """
        self.targets = []
        self.video = cv2.VideoCapture(video_path)

    def identify_targets(self) -> None:
        """
        """
        tracker = Tracker(self.video)
        self.targets = tracker.process_video()

    def post_process_targets(self) -> None:
        """
        """
        pass

    def associate_targets(self):
        """
        """
        pass

    def write_csv_file(self, csv_file_name: str) -> None:
        """ Converts data to a csv file. Targest will be ordered by
        ascending frame number.
        """
        with open(csv_file_name, 'w') as csv_file:
            writer = csv.writer(csv_file)

            writer.writerow(Target.FIELDS)

            for frame_targets in self.targets:
                for target in frame_targets:
                    writer.writerow(tuple(target))

    def load_data(self, csv_file: str):
        """ Loads data from a csv file
        """
        with open(csv_file, 'r') as file_data:
            reader = csv.reader(file_data, delimiter=',')

            next(reader, None)  # skip header

            for row in reader:
                target = self.__read_row(row)
                self.targets.append(self.target)

    def __read_row(self, row: list):
        """ Reads in a row from csv file into a Target
        """
        return Target(
            pos=(int(row[POS_X]), int(row[POS_Y])),
            target_id=int(row[TARGET_ID]),
            theta=float(row[THETA]),
            frame_num=int(row[FRAME_NUM]),
            dimensions=(int(row[WIDTH]), int(row[HEIGHT]))
        )
