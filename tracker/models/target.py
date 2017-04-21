""" Module containing the Target model.
"""

from typing import Any, List
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

    def __init__(self, target_id: int=0, frame_num: int=0, x: int=None, y: int=None,
                 width: int=0, height: int=0, theta: float=0.0, box: List=None):
        """ Initializes a target given parameters. A Target has the following
        instance variables:
            target_id - an int representing the unique id of the Target
            frame_num - an int representing what frame number of the
                corresponding video the Target belongs to
            x - an int representing the x coordinate of the Target
            y - an int representing the y coordinate of the Target
            width - an int representing the width of the Target
            height - an int representing the height of the Target
            theta - a float representing the angle of rotation of the Target
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

    def __get_xy_from_box(self, box: List):
        xs = [coor[0] for coor in box]
        ys = [coor[1] for coor in box]
        return int((min(xs) + max(xs)) / 2), int((min(ys) + (max(ys))) / 2)

    def to_target(self, target_id: int=None, frame_num: int=None, x: int=None,
                  y: int=None, width: int=None, height: int=None, theta: float=None):
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
