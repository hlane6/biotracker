import unittest
from track import *

# TODO(all): Import utils from association to get GetBBoxPos.


class Track_Test(unittest.TestCase):

    # Test to make sure that UpdatePosition sets next_box as position and
    # removes it from the array.
    def test_UpdatePosition(self):
        init_box = [[0, 0],
                    [1, 0],
                    [0, 1],
                    [1, 1]]
        init_tgt_id = 1

        next_box = [[1, 1],
                    [2, 1],
                    [1, 2],
                    [2, 2]]


        track = Track(init_box=init_box, tgt_id=1)

        # Make sure track was instantiated properly.
        self.assertEqual(track.pos, GetBBoxPos(init_box))
        self.assertNotEqual(track.pos, GetBBoxPos(next_box))

        track.UpdatePosition(GetBBoxPos(next_box), frame_num=None)

        # Make sure track was updated properly.
        self.assertEqual(track.pos, GetBBoxPos(next_box))
        self.assertNotEqual(track.pos, GetBBoxPos(init_box))
