from collections import namedtuple
from biotracker.models.associate import associate
from biotracker.models.tracker import Tracker, Target
import csv
import cv2


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
        """ Using a Tracker, will perform an initial pass of the video.
        self.targets will now contain Targets with valid frame_num, x, y,
        width, height, and theta, but they will have invalid ids and there
        can be mistakes between consequtive frames of Targets disappearing.
        """
        tracker = Tracker(self.video)
        self.targets = tracker.process_video()

    def post_process_targets(self) -> None:
        """ Using a Tracker, will perform a second pass through the targets in
        an attempt to remove inconsistances between consequtive frames.
        self.targest should now contain Targets with valid frame_num, x, y,
        width, height, and theta and are ready to be associated to unique ids.
        """
        tracker = Tracker(self.video)

        last_len = -1
        counter = 2
        while (counter < len(self.targets)):
            length = len(self.targets[counter])
            diff = length - last_len

            if diff > 0:
                # print ("Previous|| ")
                # for prev in self.targets[counter - 1]:
                #     print("ID: ", prev.target_id, " Width: ", prev.width)
                
                # print("S P A C E")
                # print ("Current|| ")
                # for curr in self.targets[counter]:
                #     print(curr.frame_num, "ID: ", curr.target_id, " Width: ", curr.width)

                # print(self.targets[counter])
                self.targets[counter].sort(key=lambda x: x.width, reverse=True)

                k = diff
                while (k < diff):
                    tracker.split(self.targets[counter][k])
                    k -= 1


            last_len = length
            counter += 1


    def associate_targets(self):
        """ Using an associator, will perform a final pass through the
        targets an attempt to assign unique ids to targets throughout the
        video.
        """
        self.targets = associate(self.targets)

    def write_csv_file(self, csv_file_name: str) -> None:
        """ Converts data to a csv file. Targets will be ordered by
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
            target_id=int(row[TARGET_ID]),
            frame_num=int(row[FRAME_NUM]),
            x=int(row[POS_X]),
            y=int(row[POS_Y]),
            width=int(row[WIDTH]),
            height=int(row[HEIGHT]),
            theta=float(row[THETA])
        )
