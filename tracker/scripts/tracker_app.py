""" Module containing the script to generate csv data from a given
video file.
"""

from ..models.target_manager import TargetManager

def tracker(video, background=None):
    manager = TargetManager(video, background)
    manager.identify_targets()
    manager.associate_targets()
    csv_path = video.split('.mp4')[0] + '.csv'
    manager.write_csv_file(csv_path)
