import numpy as np

# Calculate euclidean distance between two points.
def calc_distance(pos1, pos2):
    dx = (pos1[0] - pos2[0])**2
    dy = (pos1[1] - pos2[1])**2
    return int(np.sqrt(dx + dy))