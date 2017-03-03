""" Module containing the Target model.
"""


class Target:
    """ A Target represents a single object being tracked in a single frame.
    A sequence of Targets for a single Target id is called a tracklet and
    represents a unique object being tracked over multiple frames.
    """

    def __init__(self, init_box=None, pos=None, target_id=None, theta=None,
                 frame_num=None, dimensions=None):
        """ Initializes a target given parameters. A Target has the following
        instance variables:
            TODO: finish me
        """
        if init_box is not None:
            self.pos = self.__get_bbox_pos(init_box)
        else:
            self.pos = pos

        self.dimensions = dimensions
        self.pos_arr = [self.pos]
        self.target_id = target_id
        self.theta = theta
        self.frame_num = frame_num

    def __get_bbox_pos(self, bbox):
        """ Get center coordinate of a bounding box """
        x_arr = [coord[0] for coord in bbox]
        y_arr = [coord[1] for coord in bbox]

        min_x = min(x_arr)
        min_y = min(y_arr)
        max_x = max(x_arr)
        max_y = max(y_arr)

        y = int((max_y + min_y)/2)
        x = int((max_x + min_x)/2)
        return x, y

    def __eq__(self, other):
        return (isinstance(other, self.__class__) and
                self.__dict__ == other.__dict__)

    def __ne__(self, other):
        return not self.__eq__(other)

    def __repr__(self):
        return ("pos:{pos}\n"
                "pos_arr:{pos_arr}\n"
                "target_id:{target_id}\n"
                "theta:{theta}\n"
                "frame_num:{frame_num}\n").format(pos=self.pos,
                                                  pos_arr=self.pos_arr,
                                                  target_id=self.target_id,
                                                  theta=self.theta,
                                                  frame_num=self.frame_num)
