import csv
from collections import namedtuple

# Data structure for target. Works like a dictionary without as much overhead.
Detection = namedtuple('Detection', ['frame_num', 'target_id', 'x', 'y',
                                     'width', 'height', 'theta'])


class TargetManager:
    FRAME_NUM = 0
    TARGET_ID = 1
    POS_X = 2
    POX_Y = 3
    WIDTH = 4
    HEIGHT = 5
    THETA = 6

    def __init__(self):
        self.detections = []
        self.targets = []

    def write_csv_file(self, csvFileName):
        ''' Converts data to a csv file '''
        with open(csvFileName, 'w') as csvFile:
            writer = csv.writer(csvFile)
            writer.writerow(Detection._fields)
            for detection in self.detections:
                row = []
                for x in range(0, 7):
                    row.append(detection[x])
                writer.writerow(row)

    def load_data(self, csv_file):
        """ Loads data from a csv file """

        with open(csv_file, 'r') as file_data:
            reader = csv.reader(file_data, delimiter=',')
            next(reader, None)  # skip header
            for row in reader:
                detection = self.read_row(row)
                self.detections.append(detection)
                self.targets.append(self.detection_to_target(detection))

    def read_row(self, row):
        """ Reads in a row from csv file into a Detection object """
        if row[THETA] == '':
            row[THETA] = 0.0

        return Detection(frame_num=int(row[FRAME_NUM]),
                         target_id=int(row[TARGET_ID]),
                         x=int(row[POX_X]),
                         y=int(row[POX_Y]),
                         width=int(row[WIDTH]),
                         height=int(row[HEIGHT]),
                         theta=float(row[THETA]))

    def add_target(self, target):
        """ Adds one detection entry to the manager array """

        theta = 0.0 if target.theta is None else target.theta
        self.targets.append(target)
        self.detections.append(Detection(target.frame_num,
                                         target.target_id,
                                         target.pos[0],
                                         target.pos[1],
                                         target.dimensions[0],
                                         target.dimensions[1],
                                         theta))

    def detection_to_target(detection):
        """ Converts a detection to a target """

        d_target_id = None if detection.target_id == 0 else detection.target_id
        target = Target(pos=(detection.x, detection.y),
                        target_id=d_target_id,
                        theta=detection.theta,
                        frame_num=detection.frame_num,
                        dimensions=(detection.width, detection.height))
        return target
