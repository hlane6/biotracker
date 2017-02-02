from utils import *
import copy

# TODO: Move the Detection tuple into this file.
# TODO: Write functions to convert to and from Detection Tuples
# TODO: Test theta update, test tgt_id assignment.
# TODO: Add a zombie frame counter.

def CreateTrackFromDetection(detection):
    d_tgt_id = None if detection.tgt_id == 0 else detection.tgt_id
    track = Track(pos=(detection.x, detection.y),
                  tgt_id=d_tgt_id,
                  theta=detection.theta,
                  frame_num=detection.frame_num)
    return track


# Keep track of current location.
class Track:
    def __init__(self, init_box=None, pos=None, tgt_id=None, theta=None,
                 frame_num=None):
            

        if init_box is not None:
            self.pos = GetBBoxPos(init_box)
        else:
            self.pos = pos
        self.pos_arr = [self.pos]
        self.tgt_id = tgt_id
        self.theta = theta
        self.frame_num = frame_num

    def UpdatePosition(self, new_pos, frame_num):
        # Calculate Theta = arctan(dy/dx).
        dy = new_pos[1]-self.pos[1]
        dx = new_pos[0]-self.pos[0]
        if dx == 0 and dy > 0:
            self.theta = 90.0
        elif dx == 0 and dy == 0:
            if self.theta is None:
                self.theta = 0
            else:
                self.theta = self.theta
        else:
            self.theta = np.degrees(np.arctan2(dy, dx))
                                
        self.pos_arr.append(new_pos)
        self.pos = new_pos
        self.frame_num = frame_num

    def DumpAsDetection(self, track_mgr):
        theta = 0.0 if self.theta is None else self.theta
        track_mgr.add_target(self.frame_num, self.tgt_id, self.pos[0],
                             self.pos[1], theta, 'ant', self.tgt_id)

    def __eq__(self, other):
        return (isinstance(other, self.__class__)
            and self.__dict__ == other.__dict__)

    def __ne__(self, other):
        return not self.__eq__(other)

    def __repr__(self):
        return ("pos:{pos}\n"
                "pos_arr:{pos_arr}\n"
                "tgt_id:{tgt_id}\n"
                "theta:{theta}\n"
                "frame_num:{frame_num}\n").format(pos=self.pos,
                                                  pos_arr=self.pos_arr,
                                                  tgt_id=self.tgt_id,
                                                  theta=self.theta,
                                                  frame_num=self.frame_num)