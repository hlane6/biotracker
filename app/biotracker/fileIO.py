import csv
import sys
from collections import namedtuple

# Data structure for tracklet. Works like a dictionary without as much overhead.
Detection = namedtuple('Detection', ['frame_num', 'tgt_id', 'x', 'y', 'theta',
                                     'corner1', 'corner2', 'corner3', 'corner4',
                                     'typename', 'tracklet_id'])

class TrackerManager:

    # Initialize with a csv title and append the .csv extension.
    # Initialize the detection array
    def __init__(self):
        self.detections = []
        self.targets = []


    # Reads in a row and returns a Detection object with correct data types.
    def read_row(self, row):
        if row[4] == '':
            row[4] = 0.0

        return Detection(frame_num=int(row[0]),
                         tgt_id=int(row[1]),
                         x=int(row[2]),
                         y=int(row[3]),
                         theta=float(row[4]),
                         corner1=tuple([float(i) for i in row[5].split(":")]),
                         corner2=tuple([float(i) for i in row[6].split(":")]),
                         corner3=tuple([float(i) for i in row[7].split(":")]),
                         corner4=tuple([float(i) for i in row[8].split(":")]),
                         typename=str(row[9]),
                         tracklet_id=int(row[10]))


    # Add one detection entry to the array.
    def add_target(self, frame, tgt_id, x, y, theta, corner1, corner2, corner3, corner4, typename, tracklet_id):
        target = Detection(frame, tgt_id, x, y, theta, corner1, corner2, corner3, corner4, typename, tracklet_id)
        self.detections.append(target)

    # function for writing out to file
    def write_csv_file(self, csvFileName):
        with open(csvFileName, 'w') as csvFile:
            writer = csv.writer(csvFile)
            writer.writerow(Detection._fields) #header
            for detection in self.detections:
                row = []
                for x in range(0, 11):
                    if x > 4 and x < 9:
                        row.append(str(detection[x][0]) + ":" + str(detection[x][1]))
                    else:
                        row.append(detection[x])
                writer.writerow(row)


    # load data from file
    def load_data(self, csv_file):
        with open(csv_file, 'r') as file_data:
            reader = csv.reader(file_data, delimiter=',')
            next(reader, None) # skip header
            for row in reader:
                self.detections.append(self.read_row(row))
        # self.sort_data()

    # prints data
    def show_output(self, out=sys.stdout):
        if self.detections.__len__() > 0:
           # for data in self.detections:
            out.write(str(self.detections))
        else:
            out.write("No data found")


    def show_frame_output(self, frame, out=sys.stdout):
        frameFound = False
        for detections in self.detections:
            if detections[0] == frame:
                out.write(str(detections))
                frameFound = True
        if frameFound == False:
            out.write("Frame number not found")
