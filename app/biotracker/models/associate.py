import csv

# Update target position to new position with greedy search.
# Add any unmatched new targets to the target array
# Delete zombie frames.
# def update_tracks(targets, new_track_arr, cur_target_id, keyframe_tgts=[]):
def update_tracks(targets, new_track_arr, cur_target_id):
    # Update tracks after end of loop.
    find_closest(targets, new_track_arr)

    # If there are leftover tracks, add them to the track array, then increment
    # target_id appropriately.
    for new_track in new_track_arr:
        track = new_track
        track.target_id = cur_target_id
        targets.append(track)
        cur_target_id += 1
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


    return cur_target_id

# Finds the closest box in the array and removes it from the array.
# Array doesn't need to be returned, because they are mutable.
# def find_closest(tracks, new_tracks, keyframe_tgts=[]):
def find_closest(tracks, new_tracks):
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
        #match_key = next((key_tgt for key_tgt in keyframe_tgts if track.target_id == key_tgt.target_id), None)
        #if match_key is not None:
            #matrix.append([max_dist for i in range(len(new_tracks))])
            # TODO(carden): Update to add in theta from key frame.
            #track.UpdatePosition(match_key.pos, match_key.frame_num)

        #else:
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

# Loads all detections into an array of frames for association
def load_tracks(csv_file):
    # Load the track data from csv file.
    tm = TrackerManager('track_out')
    tm.load_data(csv_file+'.csv')

    cur_target_id=1
    # This array holds the targets for each frame update.
    frames = []
    # This array holds all the targets and is updated during stitching.
    targets = []

    #open file
    f_orig = open(csv_file + '.csv','rb')
    f_new = open('data.csv', 'wb');

    # Load the generator object for retrieving new frames
    frame_generator = load_next_frame_targets(tm)
    # Iterate through all frames in track manager.
    for frame_targets, line in zip(frame_generator, f_orig):
        # Update all the tracks to new positions.
        # Keep track of the highest target number.
        cur_target_id = update_tracks(targets, frame_targets, cur_target_id)

        for target in targets:
        	words = line.split(',')
        	words[1] = target.target_id
        	f_new.write(','.join(words))

        # Update targets with detections from frame.
        # Do a deep copy to avoid updating all the previous frames with the
        # target array.
        frames.append(copy.deepcopy(targets))

    f_orig.close()
    f_new.close()
    return frames

# Generator that loads all the targets in a frame.
# If none exist, returns an empty array and increments frame.
# Check for keyframe status to continue yielding empty arrays.
def load_next_frame_targets(target_mgr):
    cur_idx = 0
    cur_frame = 1
    while cur_idx < len(target_mgr.detections):
        new_targets = []
        if target_mgr.detections[cur_idx].frame_num == cur_frame:
            while cur_idx < len(target_mgr.detections) and \
                target_mgr.detections[cur_idx].frame_num == cur_frame:
                    detection = target_mgr.detections[cur_idx]
                    new_targets.append(target_mgr.detection_to_target(detection))
                    # Increment to next detection.
                    cur_idx += 1
        cur_frame += 1
        # Return all the targets in the new frame.
        yield new_targets

