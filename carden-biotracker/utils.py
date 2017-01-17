import numpy as np
import cv2
from fileIO import Detection

# Calculate euclidean distance between two points.
def CalcDistance(pos1, pos2):
    dx = (pos1[0] - pos2[0])**2
    dy = (pos1[1] - pos2[1])**2
    return int(np.sqrt(dx + dy))


# Get center coordinate of a bounding box.
def GetBBoxPos(bbox):
    x_arr = [coord[0] for coord in bbox]
    y_arr = [coord[1] for coord in bbox]
    min_x = min(x_arr)
    min_y = min(y_arr)
    max_x = max(x_arr)
    max_y = max(y_arr)
    y = int((max_y + min_y)/2)
    x = int((max_x + min_x)/2)
    return x, y

def ShowVidFrame(win_name, frame):
    cv2.imshow(win_name, frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        return False
    return True

