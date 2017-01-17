from fileIO import TrackerManager, Detection
import cv2
from random import randint
from collections import deque
import sys
from utils import ShowVidFrame


# This is for testing with randomly generated tracklets.
def generate_detections(total_frame_num, tgt_num, x_range, y_range):
    Detections = []
    x = []
    y = []

    for i in range(0, tgt_num):
        x.append(randint(0, 255))
        y.append(randint(0, 255))

    for f in range(0, total_frame_num):
        for i in range(0, tgt_num):
            x[i] += randint(0, x_range)
            y[i] += randint(0, y_range)
            d = Detection(frame_num=int(f),
                          tgt_id=int(i),
                          x=int(x[i]),
                          y=int(y[i]),
                          theta=float(2.0),
                          typename=str('ant'),
                          tracklet_id=int(20))
            Detections.append(d)

    return Detections
#---------------------------------------------------------------------#


class Overlay():
    def __init__(self, detections):
        self.detections = detections
        total_tgt_num = self.find_total_tgt(detections)
        # Default action is to keep 100 frame history for each target.
        self.q_size = 100
        self.q_lists = []
        self.color = []
        self.populate_q_lists(total_tgt_num)
        self.generate_color(total_tgt_num)

    # Randomly generate a set of colors.
    def generate_color(self, size):
        self.color = [(randint(0, 255), randint(0, 255), randint(0, 255))
                        for i in range(size+1)]

    def populate_q_lists(self, total_tgt_num):
        for i in range(total_tgt_num):
            q = deque(maxlen=self.q_size)
            for j in range(self.q_size):
                d = Detection(frame_num=int(0),
                              tgt_id=int(-1),
                              x=int(0),
                              y=int(0),
                              theta=float(0),
                              typename=str('xxx'),
                              tracklet_id=int(0))
                q.append(d)
            self.q_lists.append(q)

    # Find detection with largets tgt_id, then return its tgt_id.
    def find_total_tgt(self, detections):
        return max(detections, key=lambda x: x.tgt_id).tgt_id

    def get_current(self, fnum):
        current = []
        for d in self.detections:
            if d.frame_num == fnum or d.frame_num == fnum + 1:
                current.append(d)
        return current

    def drawPath(self, frame, current_detections, video_out, display=False):
        for j in range(len(current_detections)):
            last_d = current_detections[j]
            tgt_ind = last_d[1]-1
            self.q_lists[tgt_ind].append(last_d)

            q = self.q_lists[tgt_ind]

            for i in range(q.maxlen - 1):
                tgt_ind = q[i][1]-1
                if q[i][1] > 0:
                    cv2.line(frame, (q[i][2], q[i][3]),
                             (q[i + 1][2], q[i + 1][3]),
                             color=self.color[tgt_ind], thickness=2)

            cv2.putText(frame, str(q[i][1]), (q[i][2]+3, q[i][3]+3),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                        color=self.color[tgt_ind], thickness=2)
        if video_out is not None:
            video_out.write(frame)
        if display:
            return ShowVidFrame('Overlay', frame)

if __name__ == '__main__':
    tm = TrackerManager('test')
    vid_fname = sys.argv[1]
    cap = cv2.VideoCapture(vid_fname)
    videoOut = None
    display = False
    if len(sys.argv) > 2:
        incsv_file = sys.argv[2]
        tm.load_data(incsv_file)
        ov = Overlay(tm.detections)
    # Generate random detections if none are supplied.
    else:
        total_frame_num = cap.get(cv2.CAP_PROP_FRAME_COUNT)
        total_target_num = 10
        x_range = 2
        y_range = 1
        r_detections = generate_detections(total_frame_num, total_target_num,
                                           x_range, y_range)
        ov = Overlay(r_detections)
    if len(sys.argv) > 3:
        out_video = sys.argv[3] + '.mpg'
        is_outputting_video = True
        videoOut = cv2.VideoWriter(out_video,
                                   cv2.VideoWriter_fourcc('M', 'P', 'E', 'G'),
                                   int(cap.get(cv2.CAP_PROP_FRAME_COUNT)),
                                   (int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)),
                                    int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))))
    else:
        # Without any video output, display overlay.
        display = True
        is_outputting_video = False



    frame_num = 1
    while (cap.isOpened()):
        ret, frame = cap.read()
        if ret:
            current_detections = ov.get_current(frame_num)
            display = ov.drawPath(frame, current_detections, videoOut, display)
            frame_num += 1
        else:
            break

    cap.release()
    if is_outputting_video:
        videoOut.release()
    cv2.destroyAllWindows()


