from munkres import Munkres
from biotracker.utils import *
from biotracker.models.target import Target
from typing import List


def associate(targets: List[List[Target]]) -> List[List[Target]]:
    """ Takes in a list of lists of Targets which have no associated
    ids and will associate ids for each frame. Returns the associated
    targets
    """
    associated_targets = []

    # Assign ids to the first frame of targets
    associated_targets.append([
        target.to_target(target_id=index)
        for index, target in enumerate(targets[0])
    ])

    # based on previousframe, update next frame with ids
    for next_frame in targets[1:]:
        cur_associated_targets = associate_sequential_targets(
            associated_targets[-1],
            next_frame
        )
        associated_targets.append(cur_associated_targets)

    return associated_targets


def associate_sequential_targets(current_frame: List[Target],
        next_frame: List[Target]) -> List[Target]:
    """ Takes in two sequential frames of targets. The first frame is
    labeled with ids while the second frame is unlabeled. Using the first
    frames ids, the second frame will be associated using a distance
    cost matrix
    """
    max_distance = 50
    munk = Munkres()

    distance_matrix = [
        [
            calc_distance((target.x, target.y), (other.x, other.y))
            for other in next_frame
        ]
        for target in current_frame
    ]

    indicies = munk.compute(distance_matrix)

    targets = []
    for row, col in indicies:
        targets.append(next_frame[col].to_target(
            target_id=current_frame[row].target_id
        ))

    matched_targets = [col for row, col in indicies]

    if len(matched_targets) < len(next_frame):
        next_id = max([target.target_id for target in current_frame]) + 1

        for index, target in enumerate(next_frame):
            if index not in matched_targets:
                targets.append(target.to_target(target_id=next_id))

    return targets
