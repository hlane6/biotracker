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

    def to_target(self, target_id=None, frame_num=None, x=None, y=None,
                  width=None, height=None, theta=None):
        """ Converts the current target to a different target changing
        only the paramteres that are passed in.
        """
        return Target(
            target_id=self.target_id if target_id is None else target_id,
            frame_num=self.frame_num if frame_num is None else frame_num,
            x=self.x if x is None else x,
            y=self.y if y is None else y,
            width=self.width if width is None else width,
            height=self.height if height is None else height,
            theta=self.theta if theta is None else theta
        )

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
        return 'Target({:s})'.format(
            ','.join([str(item) for item in list(self)])
        )
