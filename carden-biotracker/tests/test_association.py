from association import *
from track import *

import unittest


class Association_Test(unittest.TestCase):

    def test_UpdateTrackersWithKeyframes(self):
        keyframe_file = "tests/test_keyframes"
        # keyframes = LoadTracks(keyframe_file)
        # TODO(carden): Create keyframe file and confirm working.
        frames = LoadTracks('tests/test_assoc', keyframe_file=keyframe_file)
        expected_track_1 = Track(pos=(3, 4), frame_num=1, tgt_id=1, theta=45.0)
        expected_track_2 = Track(pos=(7, 8), frame_num=1, tgt_id=2, theta=90.0)
        expected_frame_1 = [expected_track_1, expected_track_2]

        # Updates to track 1 & 2.
        expected_track_3 = Track(pos=(4, 5), frame_num=2, tgt_id=1, theta=45.0)
        expected_track_3.pos_arr = [(3, 4), (4, 5)]
        expected_track_4 = Track(pos=(7, 10), frame_num=2, tgt_id=2, theta=90.0)
        expected_track_4.pos_arr = [(7, 8), (7, 10)]
        expected_track_5 = Track(pos=(7, 9), frame_num=2, tgt_id=3, theta=90.0)
        expected_frame_2 = [expected_track_3, expected_track_4, expected_track_5]

        expected_frames = [expected_frame_1, expected_frame_2]

        self.assertCountEqual(expected_frames, frames)

    # TODO(carden): Add a test for when there are more tracks than new detections.

    def test_LoadNextFrameTargets(self):
        tm = TrackerManager('test_out')
        tm.load_data('tests/test_assoc.csv')
        frame_gen = LoadNextFrameTargets(tm)
        new_targets = next(frame_gen)

        expected_track_1 = Track(pos=(3, 4), frame_num=1, tgt_id=1, theta=45.0)
        expected_track_2 = Track(pos=(7, 8), frame_num=1, tgt_id=2, theta=90.0)
        expected_frame_1 = [expected_track_1, expected_track_2]

        self.assertCountEqual(new_targets, expected_frame_1)

    def test_LoadTracks(self):
        frames = LoadTracks('tests/test_assoc')
        expected_track_1 = Track(pos=(3, 4), frame_num=1, tgt_id=1, theta=45.0)
        expected_track_2 = Track(pos=(7, 8), frame_num=1, tgt_id=2, theta=90.0)
        expected_frame_1 = [expected_track_1, expected_track_2]

        # Updates to track 1 & 2.
        expected_track_3 = Track(pos=(4, 5), frame_num=2, tgt_id=1, theta=45.0)
        expected_track_3.pos_arr = [(3, 4), (4, 5)]
        expected_track_4 = Track(pos=(7, 9), frame_num=2, tgt_id=2, theta=90.0)
        expected_track_4.pos_arr = [(7, 8), (7, 9)]
        expected_frame_2 = [expected_track_3, expected_track_4]

        expected_frames = [expected_frame_1, expected_frame_2]

        self.assertCountEqual(expected_frames, frames)

    def test_UpdateTracks(self):
        init_box_1 = [[0, 0],
                     [1, 0],
                     [0, 1],
                     [1, 1]]

        init_box_2 = [[9, 9],
                     [10, 9],
                     [9, 10],
                     [10, 10]]

        next_box_1 = [[1, 1],
                     [2, 1],
                     [1, 2],
                     [2, 2]]
        next_box_2 = [[10, 10],
                     [11, 10],
                     [10, 11],
                     [11, 11]]
        next_box_3 = [[20, 20],
                     [21, 20],
                     [20, 21],
                     [21, 21]]
        input_track_1 = Track(init_box=init_box_1,
                              tgt_id=1)
        input_track_2 = Track(init_box=init_box_2,
                              tgt_id=2)
        input_tracks = [input_track_1, input_track_2]

        new_track_1 = Track(pos=(2,3))
        new_track_2 = Track(pos=(12,13))
        new_track_3 = Track(pos=(22,23))
        new_tracks = [new_track_1, new_track_2, new_track_3]

        expected_update_1 = new_track_1
        expected_update_1.tgt_id = input_track_1.tgt_id
        expected_update_1.pos_arr = [input_track_1.pos, new_track_1.pos]

        dx1 = new_track_1.pos[0] - input_track_1.pos[0]
        dy1 = new_track_1.pos[1] - input_track_1.pos[1]
        expected_update_1.theta = np.degrees(np.arctan2(dy1, dx1))

        expected_update_2 = new_track_2
        expected_update_2.tgt_id = input_track_2.tgt_id
        expected_update_2.pos_arr = [input_track_2.pos, new_track_2.pos]

        dx1 = new_track_2.pos[0] - input_track_2.pos[0]
        dy1 = new_track_2.pos[1] - input_track_2.pos[1]
        expected_update_2.theta = np.degrees(np.arctan2(dy1, dx1))

        # Add another track to account for new detection.
        expected_update_3 = new_track_3
        expected_update_3.tgt_id = 3


        expected_new_tracks = [expected_update_1, expected_update_2,
                               expected_update_3]
        UpdateTracks(input_tracks, new_tracks, cur_tgt_id=3)

        # Ensure that tracks have been updated to next closest tracks.
        self.assertCountEqual(expected_new_tracks, input_tracks)
        # Ensure updated_tracks have been deleted.
        self.assertCountEqual([], new_tracks)

    def test_FindClosest_2(self):
        track_1 = Track(pos=(3, 4), frame_num=1, tgt_id=1, theta=45.0)
        track_2 = Track(pos=(7, 8), frame_num=1, tgt_id=2, theta=90.0)
        tracks = [track_1, track_2]

        track_3 = Track(pos=(5, 6), frame_num=1, tgt_id=1, theta=45.0)
        new_tracks = [track_3]

        expected_track_1 = track_3
        expected_track_1.pos_arr = [track_1.pos, track_3.pos]
        expected_track_2 = track_2
        expected_updates = [expected_track_1, expected_track_2]

    # Test to make sure that FindClosest sets next_box as position and
    # removes it from the array.
    # TODO(Carden): Update test to work with array of tracks.
    def test_FindClosest(self):
        init_box_1 = [[0, 0],
                     [1, 0],
                     [0, 1],
                     [1, 1]]

        init_box_2 = [[9, 9],
                     [10, 9],
                     [9, 10],
                     [10, 10]]

        next_box_1 = [[1, 1],
                     [2, 1],
                     [1, 2],
                     [2, 2]]
        next_box_2 = [[10, 10],
                     [11, 10],
                     [10, 11],
                     [11, 11]]
        next_box_3 = [[20, 20],
                     [21, 20],
                     [20, 21],
                     [21, 21]]
        input_track_1 = Track(init_box=init_box_1,
                              tgt_id=1)
        input_track_2 = Track(init_box=init_box_2,
                              tgt_id=2)
        input_tracks = [input_track_1, input_track_2]

        new_track_1 = Track(pos=(2,3))
        new_track_2 = Track(pos=(12,13))
        new_tracks = [new_track_1, new_track_2]

        expected_update_1 = new_track_1
        expected_update_1.tgt_id = input_track_1.tgt_id
        expected_update_1.pos_arr = [input_track_1.pos, new_track_1.pos]

        dx1 = new_track_1.pos[0] - input_track_1.pos[0]
        dy1 = new_track_1.pos[1] - input_track_1.pos[1]
        expected_update_1.theta = np.degrees(np.arctan2(dy1, dx1))

        expected_update_2 = new_track_2
        expected_update_2.tgt_id = input_track_2.tgt_id
        expected_update_2.pos_arr = [input_track_2.pos, new_track_2.pos]

        dx1 = new_track_2.pos[0] - input_track_2.pos[0]
        dy1 = new_track_2.pos[1] - input_track_2.pos[1]
        expected_update_2.theta = np.degrees(np.arctan2(dy1, dx1))

        expected_new_tracks = [expected_update_1, expected_update_2]

        FindClosest(input_tracks, new_tracks)

        # Ensure that tracks have been updated to next closest tracks.
        self.assertCountEqual(expected_new_tracks, input_tracks)
        # Ensure updated_tracks have been deleted.
        self.assertCountEqual([], new_tracks)

        # Ensure that next_box has been removed from array.
        # TODO(Carden): Add test to ensure decoy track not falsely detected.
        # self.assertNotEqual(bbox_arr, [next_box, far_box])
        # self.assertEqual(bbox_arr, [far_box])


class BBoxUtils_Test(unittest.TestCase):

  # Test with an even distance between points.
  def test_EvenBoxPos(self):
    box = [[66, 120],
           [68, 120],
           [66, 122],
           [68, 122]]
    expected_pos = (67, 121)
    pos = GetBBoxPos(box)
    self.assertEqual(expected_pos, pos)

  # Test with an odd distance between points
  def test_OddBoxPos(self):
    box = [[67, 120],
           [70, 120],
           [67, 123],
           [70, 123]]
    # The function returns int positions, so it will round down.
    expected_pos = (68, 121)
    pos = GetBBoxPos(box)
    self.assertEqual(expected_pos, pos)

  def test_DistCalc(self):
    pos1 = (0, 0)
    pos2 = (1, 0)
    expected_dist = 1
    self.assertEqual(CalcDistance(pos1, pos2), expected_dist)
    pos1 = (0, 0)
    pos2 = (0, 1)
    self.assertEqual(CalcDistance(pos1, pos2), expected_dist)

  # Test Distance calc where pos2 is greater than pos1, such that
  # pos1.x - pos2.x < 0 or pos1.y - pos2.y < 0
  def test_DistCalcWithReverseOrderedPoints(self):
    pos1 = (1, 0)
    pos2 = (2, 0)
    expected_dist = 1
    self.assertEqual(CalcDistance(pos1, pos2), expected_dist)
    pos1 = (0, 1)
    pos2 = (0, 2)
    expected_dist = 1
    self.assertEqual(CalcDistance(pos1, pos2), expected_dist)




def main():
  unittest.main()

if __name__ == '__main__':
  main()
