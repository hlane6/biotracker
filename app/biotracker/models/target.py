""" Module containing the Target model.
"""

from typing import Any
from collections import namedtuple
import numpy as np


class Target:
    """ A Target represents a single object being tracked in a single frame.
    A sequence of Targets for a single Target id is called a tracklet and
    represents a unique object being tracked over multiple frames.
    """

    FIELDS = (
        'frame_num',
        'target_id',
        'x',
        'y',
        'width',
        'height',
        'theta'
    )

    def __init__(self, target_id=0, frame_num=0, x=None, y=None,
                 width=0, height=0, theta=0.0, box=None):
        """ Initializes a target given parameters. A Target has the following
        instance variables:
            pos - a tuple containing the x, y coordinates of the Target
            dimensions - a tuple containing the width, height of the Target
            target_id - an int representing the unique id of the Target
            theta - a float representing the angle of rotation of the Target
            frame_num - an int representing what frame number of the
            corresponding video the Target belongs to
        """
        self.target_id = target_id
        self.frame_num = frame_num
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.theta = theta

        if box is not None and (x is None and y is None):
            self.x, self.y = self.__get_xy_from_box(box)

    def __get_xy_from_box(self, box):
        xs = [coor[0] for coor in box]
        ys = [coor[1] for coor in box]
        return int((min(xs) + max(xs)) / 2), int((min(ys) + (max(ys))) / 2)

    def update_position(self, x, y):
        # Calculate Theta = arctan(dy/dx).
        dy = y - self.y
        dx = x - self.x

        if dx == 0 and dy > 0:
            self.theta = 90.0
        elif dx == 0 and dy == 0:
            if self.theta is None:
                self.theta = 0
            else:
                self.theta = self.theta
        else:
            self.theta = np.degrees(np.arctan2(dy, dx))

        self.x = x
        self.y = y

    def __eq__(self, other: Any):
        return (isinstance(other, self.__class__) and
                self.__dict__ == other.__dict__)

    def __ne__(self, other: Any):
        return not self.__eq__(other)

    def __iter__(self):
        attributes = (
            self.frame_num,
            self.target_id,
            self.x,
            self.y,
            self.width,
            self.height,
            self.theta
        )

        for attr in attributes:
            yield attr

    def __repr__(self):
        return ','.join(list(self))
