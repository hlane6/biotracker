import numpy as np
from utils import *
from fileIO import TrackerManager
from track import CreateTrackFromDetection, Track
import copy
import sys
from munkres import Munkres, print_matrix
import pdb
# TODO(Carden): Check tracks for the number of zombie frames if not matched to
# a new track.
# TODO(Carden): Figure out how to detect if there are leftover tracks (happens
# when bbox_arr is finished before tracks is done updating).

# Finds the closest box in the array and removes it from the array.
# Array doesn't need to be returned, because they are mutable.
def FindClosest(tracks, new_tracks, keyframe_tgts=[]):
    # pdb.set_trace()
    max_dist = 50
    m = Munkres()
    # Exit if all the tracks have been updated or there are no tracks to update.
    if len(new_tracks) == 0 or len(tracks) == 0:
        return

    # Create a cost matrix for the distances of each track
    matrix = []
    # Iterate though the tracks. If a key match is found, calculate the
    # distance as the max distance for assignment. Otherwise, calculate the
    # true cost to all else.
    for i in range(len(tracks)):
        track = tracks[i]
        match_key = next((key_tgt for key_tgt in keyframe_tgts if track.tgt_id == key_tgt.tgt_id), None)
        if match_key is not None:
            matrix.append([max_dist for i in range(len(new_tracks))])
            # TODO(carden): Update to add in theta from key frame.
            track.UpdatePosition(match_key.pos, match_key.frame_num)

        else:
            matrix.append([CalcDistance(tracks[i].pos, new_track.pos)
                                for new_track in new_tracks])
    # Compute the lowest cost path through the cost matrix.
    indices = m.compute(matrix)
    # Collect columns to delete from new tracks array.
    cols = []
    for row, col in indices:
        if matrix[row][col] < max_dist:
            tracks[row].UpdatePosition(new_tracks[col].pos,
                                       new_tracks[col].frame_num)
            cols.append(col)
    cols.sort(reverse=True)
    for col in cols:
        del new_tracks[col]


# Update target position to new position with greedy search.
# Add any unmatched new targets to the target array
# Delete zombie frames.
def UpdateTracks(targets, new_track_arr, cur_tgt_id, keyframe_tgts=[]):
    # Update tracks after end of loop.
    FindClosest(targets, new_track_arr, keyframe_tgts)

    # If there are leftover tracks, add them to the track array, then increment
    # tgt_id appropriately.
    for new_track in new_track_arr:
        track = new_track
        track.tgt_id = cur_tgt_id
        targets.append(track)
        cur_tgt_id += 1
    # Empty the new track array.
    del new_track_arr[:]

    # Remove tracks that have not been updated for a set number of frames.
    zombie_frame_count = 3
    cur_frame_num = max([tgt.frame_num if tgt.frame_num is not None else 0 for tgt in targets])

    inds_to_remove = []
    for i in range(len(targets)):
        frame_num = targets[i].frame_num if targets[i].frame_num is not None else 0
        if frame_num - cur_frame_num > zombie_frame_count:
            inds_to_remove.append(i)
    for i in inds_to_remove:
        del targets[i]


    return cur_tgt_id

# Generator that loads all the targets in a frame.
# If none exist, returns an empty array and increments frame.
# Check for keyframe status to continue yielding empty arrays.
def LoadNextFrameTargets(track_mgr, is_keyframe=False):
    cur_idx = 0
    cur_frame = 1
    while cur_idx < len(track_mgr.detections):
        new_targets = []
        if track_mgr.detections[cur_idx].frame_num == cur_frame:
            while cur_idx < len(track_mgr.detections) and \
                track_mgr.detections[cur_idx].frame_num == cur_frame:
                    detection = track_mgr.detections[cur_idx]
                    new_targets.append(CreateTrackFromDetection(detection))
                    # Increment to next detection.
                    cur_idx += 1
        cur_frame += 1
        # Return all the targets in the new frame.
        yield new_targets
    while is_keyframe:
        yield []


# Loads all detections into an array of frames for association
def LoadTracks(csv_file, keyframe_file=None):
    key_mgr = TrackerManager('keyframe_out')
    if keyframe_file is not None:
        key_mgr.load_data(keyframe_file+'.csv')
    # Load the track data from csv file.
    tm = TrackerManager('track_out')
    tm.load_data(csv_file+'.csv')

    cur_tgt_id=1
    # This array holds the targets for each frame update.
    frames = []
    # This array holds all the targets and is updated during stitching.
    targets = []
    # Load the generator object for retrieving new frames
    frame_generator = LoadNextFrameTargets(tm)
    keyframe_generator = LoadNextFrameTargets(key_mgr, is_keyframe=True)
    # Iterate through all frames in track manager & keyframes.
    for frame_targets, keyframes in zip(frame_generator, keyframe_generator):
        # Update all the tracks to new positions.
        # Keep track of the highest target number.
        cur_tgt_id = UpdateTracks(targets, frame_targets, cur_tgt_id, keyframes)

        # Update targets with detections from frame.
        # Do a deep copy to avoid updating all the previous frames with the
        # target array.
        frames.append(copy.deepcopy(targets))
    return frames

def DumpFrames(csv_out, frames):
    tm = TrackerManager(csv_out)
    for frame_idx in range(len(frames)):
        for tgt in frames[frame_idx]:
            tgt.DumpAsDetection(tm)
    return tm

if __name__ == '__main__':
    csv_in = sys.argv[1]
    csv_out = sys.argv[2]

    frames = LoadTracks(csv_in)
    tm_assoc = DumpFrames(csv_out, frames)
    tm_assoc.write_file()
